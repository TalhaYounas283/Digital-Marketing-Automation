import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledPost } from './scheduled-post.entity';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduledPost])],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
