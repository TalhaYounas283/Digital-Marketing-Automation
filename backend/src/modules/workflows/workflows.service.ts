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

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);

  constructor(
    @InjectRepository(AutomationWorkflow)
    private readonly repo: Repository<AutomationWorkflow>,
    private readonly http: HttpService,
    private readonly config: ConfigService,
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

  create(userId: string, dto: CreateWorkflowDto) {
    return this.repo.save(
      this.repo.create({
        ...dto,
        userId,
        tool: dto.tool ?? 'n8n',
        status: dto.status ?? 'Paused',
      }),
    );
  }

  async update(userId: string, id: string, dto: UpdateWorkflowDto) {
    const w = await this.getById(userId, id);
    Object.assign(w, dto);
    return this.repo.save(w);
  }

  async remove(userId: string, id: string) {
    const w = await this.getById(userId, id);
    await this.repo.remove(w);
    return { message: 'Deleted' };
  }

  async setStatus(
    userId: string,
    id: string,
    status: 'Active' | 'Paused',
  ) {
    const w = await this.getById(userId, id);
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
