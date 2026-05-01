import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { EmailCampaign } from './email-campaign.entity';
import {
  CreateEmailCampaignDto,
  EmailCampaignQueryDto,
  UpdateEmailCampaignDto,
} from './dto/email-campaign.dto';

@Injectable()
export class EmailCampaignsService {
  constructor(
    @InjectRepository(EmailCampaign)
    private readonly repo: Repository<EmailCampaign>,
  ) {}

  list(userId: string, query: EmailCampaignQueryDto) {
    const where: Record<string, unknown> = { userId };
    if (query.status) where.status = query.status;
    if (query.search) where.name = ILike(`%${query.search}%`);
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async getById(userId: string, id: string) {
    const ec = await this.repo.findOne({ where: { id, userId } });
    if (!ec) throw new NotFoundException('Email campaign not found');
    return ec;
  }

  create(userId: string, dto: CreateEmailCampaignDto) {
    return this.repo.save(this.repo.create({ ...dto, userId }));
  }

  async update(userId: string, id: string, dto: UpdateEmailCampaignDto) {
    const ec = await this.getById(userId, id);
    Object.assign(ec, dto);
    return this.repo.save(ec);
  }

  async remove(userId: string, id: string) {
    const ec = await this.getById(userId, id);
    await this.repo.remove(ec);
    return { message: 'Deleted' };
  }

  async send(userId: string, id: string) {
    const ec = await this.getById(userId, id);
    const recipients = ec.recipients || 100;
    ec.status = 'sent';
    ec.sentCount = recipients;
    ec.sentDate = new Date();
    ec.openRate = Math.round((20 + Math.random() * 30) * 10) / 10;
    ec.clickRate = Math.round((1 + Math.random() * 6) * 10) / 10;
    return this.repo.save(ec);
  }

  async duplicate(userId: string, id: string) {
    const ec = await this.getById(userId, id);
    const copy = this.repo.create({
      userId,
      name: `${ec.name} (Copy)`,
      subject: ec.subject,
      template: ec.template,
      status: 'draft',
      recipients: ec.recipients,
      openRate: 0,
      clickRate: 0,
      sentCount: 0,
      sentDate: null,
      scheduledDate: null,
    });
    return this.repo.save(copy);
  }
}
