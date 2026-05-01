import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Campaign } from './campaign.entity';
import {
  CampaignQueryDto,
  CreateCampaignDto,
  UpdateCampaignDto,
} from './dto/campaign.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly repo: Repository<Campaign>,
  ) {}

  async list(userId: string, query: CampaignQueryDto) {
    const where: Record<string, unknown> = { userId };
    if (query.status) where.status = query.status;
    if (query.platform) where.platform = query.platform;
    if (query.search) where.name = ILike(`%${query.search}%`);
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async stats(userId: string) {
    const rows = await this.repo
      .createQueryBuilder('c')
      .select('COALESCE(SUM(c.budget), 0)', 'totalBudget')
      .addSelect('COALESCE(SUM(c.spent), 0)', 'totalSpent')
      .addSelect('COALESCE(SUM(c.clicks), 0)', 'totalClicks')
      .addSelect('COALESCE(SUM(c.impressions), 0)', 'totalImpressions')
      .addSelect('COUNT(*)', 'total')
      .where('c.userId = :userId', { userId })
      .getRawOne<{
        totalBudget: string;
        totalSpent: string;
        totalClicks: string;
        totalImpressions: string;
        total: string;
      }>();
    return {
      total: Number(rows?.total ?? 0),
      totalBudget: Number(rows?.totalBudget ?? 0),
      totalSpent: Number(rows?.totalSpent ?? 0),
      totalClicks: Number(rows?.totalClicks ?? 0),
      totalImpressions: Number(rows?.totalImpressions ?? 0),
    };
  }

  async getById(userId: string, id: string) {
    const item = await this.repo.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('Campaign not found');
    return item;
  }

  create(userId: string, dto: CreateCampaignDto) {
    return this.repo.save(this.repo.create({ ...dto, userId }));
  }

  async update(userId: string, id: string, dto: UpdateCampaignDto) {
    const item = await this.getById(userId, id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(userId: string, id: string) {
    const item = await this.getById(userId, id);
    await this.repo.remove(item);
    return { message: 'Deleted' };
  }
}
