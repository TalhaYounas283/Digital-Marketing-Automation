import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { AutomationWorkflow } from './automation-workflow.entity';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/workflow.dto';
import { N8nClient } from './n8n.client';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);

  constructor(
    @InjectRepository(AutomationWorkflow)
    private readonly repo: Repository<AutomationWorkflow>,
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly n8n: N8nClient,
  ) {}

  list(userId: string) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getById(userId: string, id: string) {
    const w = await this.repo.findOne({ where: { id, userId } });
    if (!w) throw new NotFoundException('Workflow not found');
    return w;
  }

  async create(userId: string, dto: CreateWorkflowDto) {
    const desiredStatus = dto.status ?? 'Paused';
    const entity = this.repo.create({
      ...dto,
      userId,
      tool: dto.tool ?? 'n8n',
      status: 'Paused',
    });

    let n8nWorkflowId: string | null = null;
    if (this.n8n.isConfigured()) {
      try {
        const created = await this.n8n.createWorkflow(
          entity.name,
          entity.trigger,
          entity.action,
        );
        n8nWorkflowId = created.id;
        if (desiredStatus === 'Active') {
          await this.n8n.activate(n8nWorkflowId);
          entity.status = 'Active';
          entity.lastRun = new Date();
        }
      } catch (err) {
        this.logger.error(
          `n8n create/activate failed for "${entity.name}": ${(err as Error).message}`,
        );
        throw new BadGatewayException(
          `Failed to create workflow in n8n: ${(err as Error).message}`,
        );
      }
    } else {
      entity.status = desiredStatus;
    }

    entity.n8nWorkflowId = n8nWorkflowId;
    return this.repo.save(entity);
  }

  async update(userId: string, id: string, dto: UpdateWorkflowDto) {
    const w = await this.getById(userId, id);
    Object.assign(w, dto);
    return this.repo.save(w);
  }

  async remove(userId: string, id: string) {
    const w = await this.getById(userId, id);
    if (this.n8n.isConfigured() && w.n8nWorkflowId) {
      try {
        await this.n8n.deleteWorkflow(w.n8nWorkflowId);
      } catch (err) {
        this.logger.warn(
          `n8n delete failed for ${w.n8nWorkflowId}: ${(err as Error).message} — removing local record anyway`,
        );
      }
    }
    await this.repo.remove(w);
    return { message: 'Deleted' };
  }

  async setStatus(
    userId: string,
    id: string,
    status: 'Active' | 'Paused',
  ) {
    const w = await this.getById(userId, id);
    if (this.n8n.isConfigured() && w.n8nWorkflowId) {
      try {
        if (status === 'Active') {
          await this.n8n.activate(w.n8nWorkflowId);
        } else {
          await this.n8n.deactivate(w.n8nWorkflowId);
        }
      } catch (err) {
        this.logger.error(
          `n8n ${status === 'Active' ? 'activate' : 'deactivate'} failed for ${w.n8nWorkflowId}: ${(err as Error).message}`,
        );
        throw new BadGatewayException(
          `Failed to ${status === 'Active' ? 'activate' : 'pause'} workflow in n8n: ${(err as Error).message}`,
        );
      }
    }
    w.status = status;
    if (status === 'Active') w.lastRun = new Date();
    return this.repo.save(w);
  }

  async trigger(userId: string, id: string, payload: Record<string, unknown>) {
    const w = await this.getById(userId, id);
    const url = this.config.get<string>('ai.n8nWebhookUrl');
    if (!url) throw new BadGatewayException('n8n webhook URL not configured');
    try {
      await firstValueFrom(
        this.http.post(url, {
          action: 'workflow_trigger',
          workflowId: w.n8nWorkflowId ?? w.id,
          name: w.name,
          trigger: w.trigger,
          payload,
        }),
      );
      w.lastRun = new Date();
      await this.repo.save(w);
      return { triggered: true, lastRun: w.lastRun };
    } catch (err) {
      this.logger.error(`n8n trigger failed: ${(err as Error).message}`);
      throw new BadGatewayException('Failed to reach n8n webhook');
    }
  }
}
