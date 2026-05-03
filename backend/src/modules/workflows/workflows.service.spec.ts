import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkflowsService } from './workflows.service';
import { N8nClient } from './n8n.client';
import { AutomationWorkflow } from './automation-workflow.entity';

const userId = '00000000-0000-0000-0000-000000000001';

const buildRepo = () => ({
  create: jest.fn((x) => ({ ...x })),
  save: jest.fn((x) =>
    Promise.resolve({
      id: 'db-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastRun: null,
      n8nWorkflowId: null,
      ...x,
    }),
  ),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn().mockResolvedValue(undefined),
});

const buildN8n = (configured = true) => ({
  isConfigured: jest.fn().mockReturnValue(configured),
  createWorkflow: jest.fn(),
  activate: jest.fn().mockResolvedValue(undefined),
  deactivate: jest.fn().mockResolvedValue(undefined),
  deleteWorkflow: jest.fn().mockResolvedValue(undefined),
});

const buildHttp = () => ({ post: jest.fn() });
const buildConfig = () => ({ get: jest.fn(() => '') });

const make = async (overrides: {
  repo?: ReturnType<typeof buildRepo>;
  n8n?: ReturnType<typeof buildN8n>;
}) => {
  const repo = overrides.repo ?? buildRepo();
  const n8n = overrides.n8n ?? buildN8n();
  const moduleRef: TestingModule = await Test.createTestingModule({
    providers: [
      WorkflowsService,
      { provide: HttpService, useValue: buildHttp() },
      { provide: ConfigService, useValue: buildConfig() },
      { provide: N8nClient, useValue: n8n },
      { provide: getRepositoryToken(AutomationWorkflow), useValue: repo },
    ],
  }).compile();
  return { svc: moduleRef.get(WorkflowsService), repo, n8n };
};

describe('WorkflowsService', () => {
  describe('create', () => {
    it('creates a workflow in n8n and stores returned id (Active status)', async () => {
      const n8n = buildN8n(true);
      n8n.createWorkflow.mockResolvedValue({ id: 'n8n-abc' });
      const { svc, repo } = await make({ n8n });

      const result = await svc.create(userId, {
        name: 'Welcome',
        trigger: 'New Lead Captured',
        action: 'Send Email',
        status: 'Active',
      });

      expect(n8n.createWorkflow).toHaveBeenCalledWith(
        'Welcome',
        'New Lead Captured',
        'Send Email',
      );
      expect(n8n.activate).toHaveBeenCalledWith('n8n-abc');
      expect(repo.save).toHaveBeenCalledTimes(1);
      const saved = repo.save.mock.calls[0][0] as AutomationWorkflow;
      expect(saved.n8nWorkflowId).toBe('n8n-abc');
      expect(saved.status).toBe('Active');
      expect(result.n8nWorkflowId).toBe('n8n-abc');
    });

    it('does not call n8n.activate when desired status is Paused', async () => {
      const n8n = buildN8n(true);
      n8n.createWorkflow.mockResolvedValue({ id: 'n8n-abc' });
      const { svc } = await make({ n8n });

      await svc.create(userId, {
        name: 'Welcome',
        trigger: 'Form Submission',
        action: 'Send Email',
        status: 'Paused',
      });

      expect(n8n.createWorkflow).toHaveBeenCalled();
      expect(n8n.activate).not.toHaveBeenCalled();
    });

    it('skips n8n entirely when N8nClient is not configured', async () => {
      const n8n = buildN8n(false);
      const { svc, repo } = await make({ n8n });

      await svc.create(userId, {
        name: 'Welcome',
        trigger: 'New Lead Captured',
        action: 'Send Email',
        status: 'Active',
      });

      expect(n8n.createWorkflow).not.toHaveBeenCalled();
      expect(n8n.activate).not.toHaveBeenCalled();
      const saved = repo.save.mock.calls[0][0] as AutomationWorkflow;
      expect(saved.n8nWorkflowId).toBeNull();
      expect(saved.status).toBe('Active');
    });

    it('throws BadGateway and does not save when n8n create fails', async () => {
      const n8n = buildN8n(true);
      n8n.createWorkflow.mockRejectedValue(new Error('connection refused'));
      const { svc, repo } = await make({ n8n });

      await expect(
        svc.create(userId, {
          name: 'x',
          trigger: 'New Lead Captured',
          action: 'Send Email',
          status: 'Active',
        }),
      ).rejects.toBeInstanceOf(BadGatewayException);
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe('setStatus', () => {
    it('calls n8n.activate then saves Active status', async () => {
      const n8n = buildN8n(true);
      const repo = buildRepo();
      repo.findOne.mockResolvedValue({
        id: 'db-1',
        userId,
        name: 'wf',
        tool: 'n8n',
        trigger: 't',
        action: 'a',
        status: 'Paused',
        lastRun: null,
        n8nWorkflowId: 'n8n-abc',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const { svc } = await make({ repo, n8n });

      await svc.setStatus(userId, 'db-1', 'Active');

      expect(n8n.activate).toHaveBeenCalledWith('n8n-abc');
      expect(repo.save).toHaveBeenCalledTimes(1);
      const saved = repo.save.mock.calls[0][0] as AutomationWorkflow;
      expect(saved.status).toBe('Active');
      expect(saved.lastRun).toBeInstanceOf(Date);
    });

    it('calls n8n.deactivate when pausing', async () => {
      const n8n = buildN8n(true);
      const repo = buildRepo();
      repo.findOne.mockResolvedValue({
        id: 'db-1',
        userId,
        name: 'wf',
        tool: 'n8n',
        trigger: 't',
        action: 'a',
        status: 'Active',
        lastRun: null,
        n8nWorkflowId: 'n8n-abc',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const { svc } = await make({ repo, n8n });

      await svc.setStatus(userId, 'db-1', 'Paused');

      expect(n8n.deactivate).toHaveBeenCalledWith('n8n-abc');
      expect(n8n.activate).not.toHaveBeenCalled();
    });

    it('skips n8n when n8nWorkflowId is null', async () => {
      const n8n = buildN8n(true);
      const repo = buildRepo();
      repo.findOne.mockResolvedValue({
        id: 'db-1',
        userId,
        name: 'wf',
        tool: 'n8n',
        trigger: 't',
        action: 'a',
        status: 'Paused',
        lastRun: null,
        n8nWorkflowId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const { svc } = await make({ repo, n8n });

      await svc.setStatus(userId, 'db-1', 'Active');

      expect(n8n.activate).not.toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });

    it('throws NotFound when the workflow does not belong to the user', async () => {
      const repo = buildRepo();
      repo.findOne.mockResolvedValue(null);
      const { svc } = await make({ repo });

      await expect(
        svc.setStatus(userId, 'missing', 'Active'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes from n8n then from local DB', async () => {
      const n8n = buildN8n(true);
      const repo = buildRepo();
      const dbRow = {
        id: 'db-1',
        userId,
        name: 'wf',
        tool: 'n8n',
        trigger: 't',
        action: 'a',
        status: 'Active' as const,
        lastRun: null,
        n8nWorkflowId: 'n8n-abc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      repo.findOne.mockResolvedValue(dbRow);
      const { svc } = await make({ repo, n8n });

      const result = await svc.remove(userId, 'db-1');

      expect(n8n.deleteWorkflow).toHaveBeenCalledWith('n8n-abc');
      expect(repo.remove).toHaveBeenCalledWith(dbRow);
      expect(result).toEqual({ message: 'Deleted' });
    });

    it('still removes local row when n8n delete fails (best-effort)', async () => {
      const n8n = buildN8n(true);
      n8n.deleteWorkflow.mockRejectedValue(new Error('not found in n8n'));
      const repo = buildRepo();
      const dbRow = {
        id: 'db-1',
        userId,
        name: 'wf',
        tool: 'n8n',
        trigger: 't',
        action: 'a',
        status: 'Active' as const,
        lastRun: null,
        n8nWorkflowId: 'n8n-stale',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      repo.findOne.mockResolvedValue(dbRow);
      const { svc } = await make({ repo, n8n });

      await expect(svc.remove(userId, 'db-1')).resolves.toEqual({
        message: 'Deleted',
      });
      expect(repo.remove).toHaveBeenCalled();
    });
  });
});
