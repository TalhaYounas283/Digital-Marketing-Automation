import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BadGatewayException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { N8nClient } from './n8n.client';

const okResponse = <T>(data: T): AxiosResponse<T> =>
  ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as never,
  }) as AxiosResponse<T>;

interface ConfigShape {
  'ai.n8nApiUrl': string;
  'ai.n8nApiKey': string;
  'ai.n8nApiTimeoutMs': number;
}

const buildConfig = (overrides: Partial<ConfigShape> = {}) => {
  const values: ConfigShape = {
    'ai.n8nApiUrl': 'http://n8n.local/api/v1',
    'ai.n8nApiKey': 'test-api-key',
    'ai.n8nApiTimeoutMs': 5000,
    ...overrides,
  };
  return { get: jest.fn((k: keyof ConfigShape) => values[k]) };
};

const buildHttp = () => ({
  post: jest.fn(),
  delete: jest.fn(),
});

const makeClient = async (
  config: ReturnType<typeof buildConfig>,
  http: ReturnType<typeof buildHttp>,
) => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [
      N8nClient,
      { provide: HttpService, useValue: http },
      { provide: ConfigService, useValue: config },
    ],
  }).compile();
  const client = moduleRef.get(N8nClient);
  client.onModuleInit();
  return client;
};

describe('N8nClient', () => {
  describe('isConfigured', () => {
    it('returns true when both URL and key are set', async () => {
      const client = await makeClient(buildConfig(), buildHttp());
      expect(client.isConfigured()).toBe(true);
    });

    it('returns false when API key is empty', async () => {
      const client = await makeClient(
        buildConfig({ 'ai.n8nApiKey': '' }),
        buildHttp(),
      );
      expect(client.isConfigured()).toBe(false);
    });

    it('returns false when URL is empty', async () => {
      const client = await makeClient(
        buildConfig({ 'ai.n8nApiUrl': '' }),
        buildHttp(),
      );
      expect(client.isConfigured()).toBe(false);
    });

    it('strips trailing slashes from API URL', async () => {
      const http = buildHttp();
      http.post.mockReturnValue(of(okResponse({ id: 'wf-1', name: 'x' })));
      const client = await makeClient(
        buildConfig({ 'ai.n8nApiUrl': 'http://n8n.local/api/v1////' }),
        http,
      );
      await client.createWorkflow('Test', 'New Lead Captured', 'Send Email');
      const url = http.post.mock.calls[0][0] as string;
      expect(url).toBe('http://n8n.local/api/v1/workflows');
    });
  });

  describe('createWorkflow', () => {
    it('builds a Webhook trigger node for non-schedule triggers', async () => {
      const http = buildHttp();
      http.post.mockReturnValue(of(okResponse({ id: 'n8n-id-1', name: 'x' })));
      const client = await makeClient(buildConfig(), http);

      const result = await client.createWorkflow(
        'Welcome flow',
        'New Lead Captured',
        'Send Email',
      );

      expect(result.id).toBe('n8n-id-1');
      const [url, payload, opts] = http.post.mock.calls[0] as [
        string,
        {
          name: string;
          nodes: Array<{ type: string; name: string; parameters: { path?: string } }>;
          connections: Record<string, unknown>;
        },
        { headers: Record<string, string> },
      ];
      expect(url).toBe('http://n8n.local/api/v1/workflows');
      expect(opts.headers['X-N8N-API-KEY']).toBe('test-api-key');
      expect(payload.name).toBe('Welcome flow');
      expect(payload.nodes).toHaveLength(2);
      expect(payload.nodes[0].type).toBe('n8n-nodes-base.webhook');
      expect(payload.nodes[0].parameters.path).toBe('welcome-flow');
      expect(payload.nodes[1].type).toBe('n8n-nodes-base.code');
      expect(payload.connections).toHaveProperty('Webhook Trigger');
    });

    it('builds a Schedule trigger node for "Scheduled (Daily)"', async () => {
      const http = buildHttp();
      http.post.mockReturnValue(of(okResponse({ id: 'n8n-id-2', name: 'x' })));
      const client = await makeClient(buildConfig(), http);

      await client.createWorkflow(
        'Daily report',
        'Scheduled (Daily)',
        'Notify Team in Slack',
      );

      const payload = http.post.mock.calls[0][1] as {
        nodes: Array<{ type: string }>;
        connections: Record<string, unknown>;
      };
      expect(payload.nodes[0].type).toBe('n8n-nodes-base.scheduleTrigger');
      expect(payload.connections).toHaveProperty('Schedule Trigger');
    });

    it('throws BadGateway when n8n responds without a workflow id', async () => {
      const http = buildHttp();
      http.post.mockReturnValue(of(okResponse({ name: 'no-id-here' })));
      const client = await makeClient(buildConfig(), http);

      await expect(
        client.createWorkflow('x', 'New Lead Captured', 'Send Email'),
      ).rejects.toBeInstanceOf(BadGatewayException);
    });
  });

  describe('activate / deactivate / deleteWorkflow', () => {
    it('POSTs to /workflows/:id/activate', async () => {
      const http = buildHttp();
      http.post.mockReturnValue(of(okResponse({})));
      const client = await makeClient(buildConfig(), http);

      await client.activate('wf-123');

      const url = http.post.mock.calls[0][0] as string;
      expect(url).toBe('http://n8n.local/api/v1/workflows/wf-123/activate');
    });

    it('POSTs to /workflows/:id/deactivate', async () => {
      const http = buildHttp();
      http.post.mockReturnValue(of(okResponse({})));
      const client = await makeClient(buildConfig(), http);

      await client.deactivate('wf-123');

      const url = http.post.mock.calls[0][0] as string;
      expect(url).toBe('http://n8n.local/api/v1/workflows/wf-123/deactivate');
    });

    it('DELETEs /workflows/:id', async () => {
      const http = buildHttp();
      http.delete.mockReturnValue(of(okResponse({})));
      const client = await makeClient(buildConfig(), http);

      await client.deleteWorkflow('wf-123');

      const url = http.delete.mock.calls[0][0] as string;
      expect(url).toBe('http://n8n.local/api/v1/workflows/wf-123');
    });

    it('propagates HTTP errors from n8n', async () => {
      const http = buildHttp();
      http.post.mockReturnValue(throwError(() => new Error('401 unauthorized')));
      const client = await makeClient(buildConfig(), http);

      await expect(client.activate('wf-1')).rejects.toThrow(
        '401 unauthorized',
      );
    });
  });
});
