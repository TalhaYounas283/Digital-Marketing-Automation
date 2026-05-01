import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiService } from '../ai/ai.service';
import { SentimentRecord } from './sentiment-record.entity';
import { AnalyzeSentimentDto } from './dto/sentiment.dto';

@Injectable()
export class SentimentService {
  constructor(
    @InjectRepository(SentimentRecord)
    private readonly repo: Repository<SentimentRecord>,
    private readonly ai: AiService,
  ) {}

  async analyze(userId: string, dto: AnalyzeSentimentDto) {
    const result = await this.ai.runAction<{
      sentiment: 'positive' | 'neutral' | 'negative';
      score: number;
      highlights: string[];
    }>('analyze_sentiment', { text: dto.text }, { userId });

    const record = this.repo.create({
      userId,
      text: dto.text,
      sentiment: result.sentiment,
      score: this.clampScore(result.score),
      source: dto.source ?? null,
      highlights: result.highlights ?? [],
    });
    return this.repo.save(record);
  }

  history(userId: string, limit = 50) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: Math.min(Math.max(limit, 1), 200),
    });
  }

  private clampScore(s: number): number {
    if (Number.isNaN(s)) return 0;
    return Math.max(-1, Math.min(1, s));
  }
}
