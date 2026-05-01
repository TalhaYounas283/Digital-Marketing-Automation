import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { GeneratedContent } from './generated-content.entity';
import { AiAction, PROMPT_TEMPLATES } from './prompt-templates';

interface RunOptions {
  userId?: string;
  persistFor?: { platform?: string; tone?: string };
}

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);

  private n8nWebhookUrl!: string;
  private n8nTimeoutMs!: number;
  private hfFallbackEnabled!: boolean;
  private hfToken!: string;
  private hfTextModel!: string;
  private hfImageModel!: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    @InjectRepository(GeneratedContent)
    private readonly contents: Repository<GeneratedContent>,
  ) {}

  onModuleInit() {
    this.n8nWebhookUrl = this.config.get<string>('ai.n8nWebhookUrl') ?? '';
    this.n8nTimeoutMs = this.config.get<number>('ai.n8nTimeoutMs') ?? 15000;
    this.hfFallbackEnabled =
      this.config.get<boolean>('ai.hfFallbackEnabled') ?? false;
    this.hfToken = this.config.get<string>('ai.hfToken') ?? '';
    this.hfTextModel = this.config.get<string>('ai.hfTextModel') ?? '';
    this.hfImageModel = this.config.get<string>('ai.hfImageModel') ?? '';

    if (!this.n8nWebhookUrl) {
      throw new Error(
        'AI bootstrap failed: N8N_WEBHOOK_URL is required (n8n is the primary AI provider).',
      );
    }
    this.logger.log(`Primary AI provider: n8n at ${this.n8nWebhookUrl}`);
    this.logger.log(
      this.hfFallbackEnabled
        ? `Hugging Face fallback enabled (text=${this.hfTextModel}, image=${this.hfImageModel})`
        : 'Hugging Face fallback disabled',
    );
  }

  async runAction<T>(
    action: AiAction,
    payload: Record<string, unknown>,
    opts: RunOptions = {},
  ): Promise<T> {
    let provider: 'n8n' | 'huggingface' = 'n8n';
    let result: T;
    try {
      result = await this.callN8n<T>(action, payload);
    } catch (err) {
      const message = (err as Error).message;
      this.logger.warn(`n8n provider failed for ${action}: ${message}`);
      if (this.hfFallbackEnabled) {
        this.logger.log(`Falling back to Hugging Face for ${action}`);
        provider = 'huggingface';
        result = await this.callHuggingFace<T>(action, payload);
      } else {
        throw new BadGatewayException(
          `n8n provider failed for action "${action}": ${message}`,
        );
      }
    }

    if (opts.userId) {
      void this.contents
        .save(
          this.contents.create({
            userId: opts.userId,
            action,
            platform: opts.persistFor?.platform ?? null,
            tone: opts.persistFor?.tone ?? null,
            prompt: payload,
            result: result as unknown,
            provider,
          }),
        )
        .catch((e: Error) =>
          this.logger.warn(
            `Failed to persist generated content: ${e.message}`,
          ),
        );
    }
    return result;
  }

  async generateImage(
    prompt: string,
    userId?: string,
  ): Promise<{ imageUrl: string }> {
    const result = await this.runAction<{ imageUrl: string } | string>(
      'generate_image',
      { prompt },
      { userId },
    );
    if (typeof result === 'string') return { imageUrl: result };
    return result;
  }

  private async callN8n<T>(
    action: AiAction,
    payload: Record<string, unknown>,
  ): Promise<T> {
    const response = await firstValueFrom(
      this.http.post<T>(
        this.n8nWebhookUrl,
        { action, ...payload },
        {
          timeout: this.n8nTimeoutMs,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );
    return response.data;
  }

  private async callHuggingFace<T>(
    action: AiAction,
    payload: Record<string, unknown>,
  ): Promise<T> {
    if (!this.hfToken) {
      throw new BadGatewayException(
        'Hugging Face fallback enabled but HUGGINGFACE_API_TOKEN is empty',
      );
    }
    const prompt = PROMPT_TEMPLATES[action](payload);

    if (action === 'generate_image') {
      const url = `https://api-inference.huggingface.co/models/${this.hfImageModel}`;
      const response = await firstValueFrom(
        this.http.post(
          url,
          { inputs: prompt },
          {
            responseType: 'arraybuffer',
            headers: {
              Authorization: `Bearer ${this.hfToken}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          },
        ),
      );
      const base64 = Buffer.from(response.data as ArrayBuffer).toString(
        'base64',
      );
      return { imageUrl: `data:image/png;base64,${base64}` } as unknown as T;
    }

    const url = `https://api-inference.huggingface.co/models/${this.hfTextModel}`;
    const response = await firstValueFrom(
      this.http.post(
        url,
        {
          inputs: prompt,
          parameters: { max_new_tokens: 512, return_full_text: false },
        },
        {
          headers: {
            Authorization: `Bearer ${this.hfToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      ),
    );

    const text = this.extractText(response.data);
    return this.parseForAction<T>(action, text);
  }

  private extractText(raw: unknown): string {
    if (Array.isArray(raw) && raw.length > 0) {
      const first = raw[0] as { generated_text?: string };
      if (first?.generated_text) return first.generated_text;
    }
    if (
      typeof raw === 'object' &&
      raw &&
      'generated_text' in raw &&
      typeof (raw as { generated_text: unknown }).generated_text === 'string'
    )
      return (raw as { generated_text: string }).generated_text;
    if (typeof raw === 'string') return raw;
    return JSON.stringify(raw);
  }

  private parseForAction<T>(action: AiAction, text: string): T {
    if (action === 'chat_response') return text as unknown as T;
    if (action === 'generate_copy') {
      const arr = this.tryJson<string[]>(text);
      if (Array.isArray(arr)) return arr as unknown as T;
      return text
        .split(/\n\s*\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3) as unknown as T;
    }
    const json = this.tryJson<T>(text);
    if (json) return json;
    throw new BadGatewayException(
      `Hugging Face response for "${action}" was not valid JSON`,
    );
  }

  private tryJson<T>(text: string): T | null {
    const start = text.indexOf('{');
    const startArr = text.indexOf('[');
    const begin =
      start === -1 ? startArr : startArr === -1 ? start : Math.min(start, startArr);
    if (begin === -1) return null;
    const end = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
    if (end === -1 || end <= begin) return null;
    try {
      return JSON.parse(text.slice(begin, end + 1)) as T;
    } catch {
      return null;
    }
  }
}
