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

type Provider = 'gemini' | 'n8n';

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);

  private geminiApiKey!: string;
  private geminiTextModel!: string;
  private geminiTimeoutMs!: number;
  private n8nWebhookUrl!: string;
  private n8nTimeoutMs!: number;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    @InjectRepository(GeneratedContent)
    private readonly contents: Repository<GeneratedContent>,
  ) {}

  onModuleInit() {
    this.geminiApiKey = this.config.get<string>('ai.geminiApiKey') ?? '';
    this.geminiTextModel =
      this.config.get<string>('ai.geminiTextModel') ?? 'gemini-2.5-flash';
    this.geminiTimeoutMs =
      this.config.get<number>('ai.geminiTimeoutMs') ?? 30000;
    this.n8nWebhookUrl = this.config.get<string>('ai.n8nWebhookUrl') ?? '';
    this.n8nTimeoutMs = this.config.get<number>('ai.n8nTimeoutMs') ?? 15000;

    if (!this.geminiApiKey) {
      throw new Error(
        'AI bootstrap failed: GEMINI_API_KEY is required (Gemini is the primary AI provider).',
      );
    }
    this.logger.log(
      `Primary AI provider: Gemini (model=${this.geminiTextModel})`,
    );
    this.logger.log(
      this.n8nWebhookUrl
        ? `n8n secondary path configured at ${this.n8nWebhookUrl}`
        : 'n8n secondary path not configured (skipping)',
    );
  }

  async runAction<T>(
    action: AiAction,
    payload: Record<string, unknown>,
    opts: RunOptions = {},
  ): Promise<T> {
    let provider: Provider = 'gemini';
    let result: T;
    try {
      result = await this.callGemini<T>(action, payload);
    } catch (err) {
      const message = (err as Error).message;
      this.logger.warn(`Gemini provider failed for ${action}: ${message}`);
      if (this.n8nWebhookUrl) {
        this.logger.log(`Falling back to n8n for ${action}`);
        provider = 'n8n';
        result = await this.callN8n<T>(action, payload);
      } else {
        throw new BadGatewayException(
          `Gemini provider failed for action "${action}": ${message}`,
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

  private async callGemini<T>(
    action: AiAction,
    payload: Record<string, unknown>,
  ): Promise<T> {
    if (action === 'generate_image') {
      throw new BadGatewayException(
        'Image generation is not supported by the current Gemini configuration.',
      );
    }

    const prompt = PROMPT_TEMPLATES[action](payload);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiTextModel}:generateContent?key=${this.geminiApiKey}`;

    const response = await firstValueFrom(
      this.http.post(
        url,
        {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: this.geminiTimeoutMs,
        },
      ),
    );

    const text = this.extractGeminiText(response.data);
    return this.parseForAction<T>(action, text);
  }

  private extractGeminiText(raw: unknown): string {
    const data = raw as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const joined = parts
      .map((p) => (typeof p.text === 'string' ? p.text : ''))
      .join('')
      .trim();
    if (!joined) {
      throw new BadGatewayException(
        'Gemini returned no text content in the response.',
      );
    }
    return joined;
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
      `Gemini response for "${action}" was not valid JSON`,
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
