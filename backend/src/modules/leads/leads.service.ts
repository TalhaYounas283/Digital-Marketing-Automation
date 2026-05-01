import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Lead } from './lead.entity';
import {
  AnalyzeLeadDto,
  CreateLeadDto,
  LeadQueryDto,
  UpdateLeadDto,
} from './dto/lead.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead) private readonly repo: Repository<Lead>,
    private readonly ai: AiService,
  ) {}

  async list(userId: string, query: LeadQueryDto) {
    const where: Record<string, unknown> = { userId };
    if (query.status) where.status = query.status;
    if (query.search) where.name = ILike(`%${query.search}%`);
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async getById(userId: string, id: string) {
    const lead = await this.repo.findOne({ where: { id, userId } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  create(userId: string, dto: CreateLeadDto) {
    return this.repo.save(this.repo.create({ ...dto, userId }));
  }

  async update(userId: string, id: string, dto: UpdateLeadDto) {
    const lead = await this.getById(userId, id);
    Object.assign(lead, dto);
    return this.repo.save(lead);
  }

  async remove(userId: string, id: string) {
    const lead = await this.getById(userId, id);
    await this.repo.remove(lead);
    return { message: 'Deleted' };
  }

  async analyze(userId: string, id: string, dto: AnalyzeLeadDto) {
    const lead = await this.getById(userId, id);
    const result = await this.ai.runAction<{ score: number; reason: string }>(
      'analyze_lead',
      {
        name: dto.name ?? lead.name,
        source: dto.source ?? lead.source,
        interactions: dto.interactions ?? lead.interactions ?? '',
      },
    );
    lead.score = Math.min(100, Math.max(0, Math.round(result.score)));
    lead.aiAnalysis = result.reason;
    return this.repo.save(lead);
  }

  async exportCsv(userId: string): Promise<string> {
    const leads = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    const header = 'id,name,email,source,status,score,createdAt';
    const rows = leads.map(
      (l) =>
        `${l.id},${csv(l.name)},${csv(l.email)},${csv(l.source)},${l.status},${
          l.score
        },${l.createdAt.toISOString()}`,
    );
    return [header, ...rows].join('\n');
  }
}

function csv(value: string): string {
  if (value == null) return '';
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
