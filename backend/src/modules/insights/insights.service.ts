import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ImpactLevel,
  InsightCategory,
  Recommendation,
} from './recommendation.entity';

const SEED_RECS: Array<{
  title: string;
  description: string;
  impact: ImpactLevel;
  category: InsightCategory;
  confidence: number;
}> = [
  {
    title: 'Shift posting window to Tue/Wed 10:00 AM',
    description:
      'Engagement on LinkedIn is 32% higher in the Tue/Wed morning window vs your current weekend cadence.',
    impact: 'high',
    category: 'timing',
    confidence: 88,
  },
  {
    title: 'Double down on short-form video',
    description:
      'Reels and 30-second TikTok-style clips are driving 2.4x more reach than static images for your audience.',
    impact: 'high',
    category: 'content',
    confidence: 91,
  },
  {
    title: 'Re-engage 25-34 segment with bundled offers',
    description:
      'Lead-to-customer conversion in the 25-34 cohort dropped 14% MoM — promotional offers historically reverse this.',
    impact: 'medium',
    category: 'audience',
    confidence: 76,
  },
  {
    title: 'Cut Twitter/X ad spend by 25%',
    description:
      'Twitter CTR is below your portfolio average; reallocating to LinkedIn and Instagram is projected to increase total conversions by ~9%.',
    impact: 'medium',
    category: 'channel',
    confidence: 72,
  },
];

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Recommendation)
    private readonly repo: Repository<Recommendation>,
  ) {}

  list(userId: string, category?: InsightCategory) {
    const where: Record<string, unknown> = { userId };
    if (category) where.category = category;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async regenerate(userId: string) {
    await this.repo.delete({ userId, applied: false });
    const fresh = SEED_RECS.map((r) =>
      this.repo.create({
        ...r,
        userId,
        confidence: Math.min(
          99,
          Math.max(50, r.confidence + Math.floor(Math.random() * 10 - 5)),
        ),
      }),
    );
    return this.repo.save(fresh);
  }

  async apply(userId: string, id: string) {
    const r = await this.repo.findOne({ where: { id, userId } });
    if (!r) throw new NotFoundException('Recommendation not found');
    r.applied = true;
    return this.repo.save(r);
  }
}
