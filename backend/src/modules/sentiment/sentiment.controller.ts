import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { SentimentService } from './sentiment.service';
import { AnalyzeSentimentDto } from './dto/sentiment.dto';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';

class HistoryQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200) limit?: number;
}

@ApiBearerAuth()
@ApiTags('sentiment')
@Controller('sentiment')
export class SentimentController {
  constructor(private readonly svc: SentimentService) {}

  @Post('analyze')
  analyze(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AnalyzeSentimentDto,
  ) {
    return this.svc.analyze(user.id, dto);
  }

  @Get('history')
  history(
    @CurrentUser() user: AuthenticatedUser,
    @Query() q: HistoryQuery,
  ) {
    return this.svc.history(user.id, q.limit ?? 50);
  }
}
