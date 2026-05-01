import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentimentRecord } from './sentiment-record.entity';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([SentimentRecord]), AiModule],
  controllers: [SentimentController],
  providers: [SentimentService],
})
export class SentimentModule {}
