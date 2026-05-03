import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, unknown>;
  webhookId?: string;
}

interface N8nWorkflowPayload {
  name: string;
  nodes: N8nNode[];
  connections: Record<string, unknown>;
  settings: Record<string, unknown>;
}

interface N8nWorkflowResponse {
  id: string;
  name: string;
  active?: boolean;
}

@Injectable()
export class N8nClient implements OnModuleInit {
  private readonly logger = new Logger(N8nClient.name);

  private apiUrl = '';
  private apiKey = '';
  private timeoutMs = 10000;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    this.apiUrl = (this.config.get<string>('ai.n8nApiUrl') ?? '').replace(
      /\/+$/,
      '',
    );
    this.apiKey = this.config.get<string>('ai.n8nApiKey') ?? '';
    this.timeoutMs = this.config.get<number>('ai.n8nApiTimeoutMs') ?? 10000;
    if (this.isConfigured()) {
      this.logger.log(`n8n REST API configured at ${this.apiUrl}`);
    } else {
      this.logger.log(
        'n8n REST API not configured (Workflow tab will only persist to DB)',
      );
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiUrl && this.apiKey);
  }

  async createWorkflow(
    name: string,
    trigger: string,
    action: string,
  ): Promise<{ id: string }> {
    const payload = this.buildWorkflowPayload(name, trigger, action);
    const res = await firstValueFrom(
      this.http.post<N8nWorkflowResponse>(`${this.apiUrl}/workflows`, payload, {
        headers: this.headers(),
        timeout: this.timeoutMs,
      }),
    );
    if (!res.data?.id) {
      throw new BadGatewayException('n8n create returned no workflow id');
    }
    return { id: res.data.id };
  }

  async activate(id: string): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${this.apiUrl}/workflows/${id}/activate`,
        {},
        { headers: this.headers(), timeout: this.timeoutMs },
      ),
    );
  }

  async deactivate(id: string): Promise<void> {
    await firstValueFrom(
      this.http.post(
        `${this.apiUrl}/workflows/${id}/deactivate`,
        {},
        { headers: this.headers(), timeout: this.timeoutMs },
      ),
    );
  }

  async deleteWorkflow(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.apiUrl}/workflows/${id}`, {
        headers: this.headers(),
        timeout: this.timeoutMs,
      }),
    );
  }

  private headers() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-N8N-API-KEY': this.apiKey,
    };
  }

  private buildWorkflowPayload(
    name: string,
    trigger: string,
    action: string,
  ): N8nWorkflowPayload {
    const isSchedule = /schedul/i.test(trigger);
    const triggerNode: N8nNode = isSchedule
      ? {
          id: 'trigger-1',
          name: 'Schedule Trigger',
          type: 'n8n-nodes-base.scheduleTrigger',
          typeVersion: 1.1,
          position: [240, 300],
          parameters: {
            rule: {
              interval: [{ field: 'days', daysInterval: 1 }],
            },
          },
        }
      : {
          id: 'trigger-1',
          name: 'Webhook Trigger',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 2,
          position: [240, 300],
          webhookId: this.randomWebhookId(),
          parameters: {
            httpMethod: 'POST',
            path: this.slugify(name) || 'workflow',
            responseMode: 'lastNode',
            options: {},
          },
        };

    const actionNode: N8nNode = {
      id: 'action-1',
      name: this.actionDisplayName(action),
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [520, 300],
      parameters: {
        language: 'javaScript',
        jsCode: this.actionStub(trigger, action),
      },
    };

    const triggerKey = triggerNode.name;

    return {
      name,
      nodes: [triggerNode, actionNode],
      connections: {
        [triggerKey]: {
          main: [[{ node: actionNode.name, type: 'main', index: 0 }]],
        },
      },
      settings: { executionOrder: 'v1' },
    };
  }

  private actionStub(trigger: string, action: string): string {
    return [
      "// Auto-generated workflow stub from AutoMarketer Workflow Builder.",
      `// Trigger: ${trigger}`,
      `// Action:  ${action}`,
      "const input = $input.first()?.json ?? {};",
      "return [{",
      "  json: {",
      "    ok: true,",
      `    trigger: ${JSON.stringify(trigger)},`,
      `    action: ${JSON.stringify(action)},`,
      "    receivedAt: new Date().toISOString(),",
      "    input,",
      "  },",
      "}];",
    ].join('\n');
  }

  private actionDisplayName(action: string): string {
    return action.length > 60 ? action.slice(0, 57) + '…' : action;
  }

  private slugify(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
  }

  private randomWebhookId(): string {
    return 'wh-' + Math.random().toString(36).slice(2, 10);
  }
}
