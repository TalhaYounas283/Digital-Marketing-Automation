import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository } from 'typeorm';
import { Template } from './template.entity';
import {
  CreateTemplateDto,
  TemplateQueryDto,
  UpdateTemplateDto,
} from './dto/template.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly repo: Repository<Template>,
  ) {}

  async list(userId: string, query: TemplateQueryDto) {
    const qb = this.repo.createQueryBuilder('t');
    qb.where(
      new Brackets((b) => b.where('t.userId = :userId', { userId }).orWhere('t.isSystem = true')),
    );
    if (query.category) qb.andWhere('t.category = :cat', { cat: query.category });
    if (typeof query.premium === 'boolean')
      qb.andWhere('t.isPremium = :p', { p: query.premium });
    if (query.minRating !== undefined)
      qb.andWhere('t.rating >= :r', { r: query.minRating });
    if (query.search) {
      qb.andWhere(
        new Brackets((b) =>
          b
            .where('t.title ILIKE :q', { q: `%${query.search}%` })
            .orWhere('t.description ILIKE :q', { q: `%${query.search}%` }),
        ),
      );
    }
    qb.orderBy('t.usage', 'DESC').addOrderBy('t.createdAt', 'DESC');
    return qb.getMany();
  }

  async getById(userId: string, id: string) {
    const t = await this.repo.findOne({
      where: [
        { id, userId },
        { id, isSystem: true, userId: IsNull() },
      ],
    });
    if (!t) throw new NotFoundException('Template not found');
    return t;
  }

  create(userId: string, dto: CreateTemplateDto) {
    return this.repo.save(
      this.repo.create({
        ...dto,
        userId,
        tags: dto.tags ?? [],
        isPremium: dto.isPremium ?? false,
        isSystem: false,
        usage: 0,
        rating: 4.5,
      }),
    );
  }

  async update(userId: string, id: string, dto: UpdateTemplateDto) {
    const t = await this.repo.findOne({ where: { id, userId } });
    if (!t) throw new NotFoundException('Template not found or not editable');
    Object.assign(t, dto);
    return this.repo.save(t);
  }

  async remove(userId: string, id: string) {
    const t = await this.repo.findOne({ where: { id, userId } });
    if (!t) throw new NotFoundException('Template not found');
    await this.repo.remove(t);
    return { message: 'Deleted' };
  }

  async exportAll(userId: string) {
    const items = await this.list(userId, {});
    return { exportedAt: new Date().toISOString(), count: items.length, items };
  }
}
