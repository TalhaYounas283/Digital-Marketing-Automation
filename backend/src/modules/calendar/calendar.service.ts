import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ScheduledPost } from './scheduled-post.entity';
import {
  CalendarQueryDto,
  CreateScheduledPostDto,
  UpdateScheduledPostDto,
} from './dto/scheduled-post.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(ScheduledPost)
    private readonly repo: Repository<ScheduledPost>,
  ) {}

  list(userId: string, query: CalendarQueryDto) {
    if (query.month && query.year) {
      const from = `${query.year}-${String(query.month).padStart(2, '0')}-01`;
      const lastDay = new Date(query.year, query.month, 0).getDate();
      const to = `${query.year}-${String(query.month).padStart(2, '0')}-${lastDay}`;
      return this.repo.find({
        where: { userId, date: Between(from, to) },
        order: { date: 'ASC', time: 'ASC' },
      });
    }
    return this.repo.find({
      where: { userId },
      order: { date: 'ASC', time: 'ASC' },
    });
  }

  async getById(userId: string, id: string) {
    const p = await this.repo.findOne({ where: { id, userId } });
    if (!p) throw new NotFoundException('Scheduled post not found');
    return p;
  }

  create(userId: string, dto: CreateScheduledPostDto) {
    return this.repo.save(this.repo.create({ ...dto, userId }));
  }

  async update(userId: string, id: string, dto: UpdateScheduledPostDto) {
    const p = await this.getById(userId, id);
    Object.assign(p, dto);
    return this.repo.save(p);
  }

  async remove(userId: string, id: string) {
    const p = await this.getById(userId, id);
    await this.repo.remove(p);
    return { message: 'Deleted' };
  }
}
