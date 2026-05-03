import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BadGatewayException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { AiService } from './ai.service';
import { GeneratedContent } from './generated-content.entity';

const okResponse = <T>(data: T): AxiosResponse<T> =>
  ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as never,
  }) as AxiosResponse<T>;

const geminiText = (text: string) => ({
  candidates: [{ content: { role: 'model', parts: [{ text }] } }],
});

interface ConfigShape {
  'ai.geminiApiKey': string;
  'ai.geminiTextModel': string;
  'ai.geminiTimeoutMs': number;
  'ai.n8nWebhookUrl': string;
  'ai.n8nTimeoutMs': number;
}

const buildConfig = (overrides: Partial<ConfigShape> = {}) => {
  const values: ConfigShape = {
    'ai.geminiApiKey': 'test-key',
    'ai.geminiTextModel': 'gemini-2.5-flash',
    'ai.geminiTimeoutMs': 30000,
    'ai.n8nWebhookUrl': '',
    'ai.n8nTimeoutMs': 15000,
    ...overrides,
  };
  return { get: jest.fn((k: keyof ConfigShape) => values[k]) };
};

const buildHttp = () => ({ post: jest.fn() });

const buildRepo = () => ({
  create: jest.fn((x) => x),
  save: jest.fn().mockResolvedValue(undefined),
});

const makeService = async (
  config: ReturnType<typeof buildConfig>,
  http: ReturnType<typeof buildHttp>,
) => {
  const repo = buildRepo();
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [
      AiService,
      { provide: HttpService, useValue: http },
      { provide: ConfigService, useValue: config },
      { provide: getRepositoryToken(GeneratedContent), useValue: repo },
    ],
  }).compile();
  const svc = moduleRef.get(AiService);
  svc.onModuleInit();
  return { svc, repo };
};

describe('AiService', () => {
  describe('onModuleInit', () => {
    it('throws when GEMINI_API_KEY is empty', async () => {
      const config = buildConfig({ 'ai.geminiApiKey': '' });
      const http = buildHttp();
      const moduleRef: TestingModule = await Test.createTestingModule({
        providers: [
          AiService,
          { provide: HttpService, useValue: http },
          { provide: ConfigService, useValue: config },
          { provide: getRepositoryToken(GeneratedContent), useValue: buildRepo() },
        ],
      }).compile();
      const svc = moduleRef.get(AiService);
      expect(() => svc.onModuleInit()).toThrow(/GEMINI_API_KEY is required/);
    });

    it('boots when key is present and n8n is empty', async () => {
      const config = buildConfig();
      const http = buildHttp();
      await expect(makeService(config, http)).resolves.toBeDefined();
    });
  });

  describe('runAction', () => {
    it('returns plain text for chat_response', async () => {
      const config = buildConfig();
      const http = buildHttp();
      http.post.mockReturnValue(of(okResponse(geminiText('Hello there!'))));
      const { svc } = await makeService(config, http);

      const result = await svc.runAction<string>('chat_response', {
        message: 'hi',
      });

      expect(result).toBe('Hello there!');
      expect(http.post).toHaveBeenCalledTimes(1);
      const url = http.post.mock.calls[0][0] as string;
      expect(url).toContain(
        'generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      );
      const body = http.post.mock.calls[0][1] as {
        generationConfig: { thinkingConfig: { thinkingBudget: number } };
      };
      expect(body.generationConfig.thinkingConfig.thinkingBudget).toBe(0);
    });

    it('parses fenced JSON from generate_seo response', async () => {
      const config = buildConfig();
      const http = buildHttp();
      const fenced =
        '```json\n{\n  "keywords": [{"term":"solar","volume":"5k","difficulty":"med"}],\n  "contentIdeas": ["Guide to solar"],\n  "competitorUrls": ["https://x.com"]\n}\n```';
      http.post.mockReturnValue(of(okResponse(geminiText(fenced))));
      const { svc } = await makeService(config, http);

      const result = await svc.runAction<{
        keywords: { term: string }[];
        contentIdeas: string[];
      }>('generate_seo', { topic: 'solar', niche: 'home' });

      expect(result.keywords[0].term).toBe('solar');
      expect(result.contentIdeas).toEqual(['Guide to solar']);
    });

    it('parses bare-array generate_copy response', async () => {
      const config = buildConfig();
      const http = buildHttp();
      http.post.mockReturnValue(
        of(okResponse(geminiText('["Post one", "Post two", "Post three"]'))),
      );
      const { svc } = await makeService(config, http);

      const result = await svc.runAction<string[]>('generate_copy', {
        platform: 'X',
        topic: 't',
        tone: 'fun',
        audience: 'devs',
      });

      expect(result).toEqual(['Post one', 'Post two', 'Post three']);
    });

    it('throws BadGateway when Gemini fails and n8n is not configured', async () => {
      const config = buildConfig();
      const http = buildHttp();
      http.post.mockReturnValue(throwError(() => new Error('quota exceeded')));
      const { svc } = await makeService(config, http);

      await expect(
        svc.runAction('chat_response', { message: 'hi' }),
      ).rejects.toBeInstanceOf(BadGatewayException);
    });

    it('falls back to n8n when Gemini fails and n8n is configured', async () => {
      const config = buildConfig({
        'ai.n8nWebhookUrl': 'http://n8n.local/webhook',
      });
      const http = buildHttp();
      http.post
        .mockReturnValueOnce(throwError(() => new Error('gemini down')))
        .mockReturnValueOnce(of(okResponse('fallback reply')));
      const { svc } = await makeService(config, http);

      const result = await svc.runAction<string>('chat_response', {
        message: 'hi',
      });

      expect(result).toBe('fallback reply');
      expect(http.post).toHaveBeenCalledTimes(2);
      const secondCallUrl = http.post.mock.calls[1][0] as string;
      expect(secondCallUrl).toBe('http://n8n.local/webhook');
    });

    it('throws BadGateway when JSON action returns unparseable text', async () => {
      const config = buildConfig();
      const http = buildHttp();
      http.post.mockReturnValue(
        of(okResponse(geminiText('not even close to json'))),
      );
      const { svc } = await makeService(config, http);

      await expect(
        svc.runAction('generate_seo', { topic: 't', niche: 'n' }),
      ).rejects.toBeInstanceOf(BadGatewayException);
    });
  });
});
