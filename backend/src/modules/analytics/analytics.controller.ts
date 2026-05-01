import {
  Controller,
  Get,
  Header,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { AnalyticsService } from './analytics.service';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';

class EngagementQuery {
  @IsOptional() @IsIn(['6m', '12m']) period?: '6m' | '12m';
}

@ApiBearerAuth()
@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly svc: AnalyticsService) {}

  @Get('kpi')
  kpi(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.kpi(user.id);
  }

  @Get('engagement')
  engagement(
    @CurrentUser() user: AuthenticatedUser,
    @Query() q: EngagementQuery,
  ) {
    return this.svc.engagement(user.id, q.period ?? '6m');
  }

  @Get('demographics')
  demographics(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.demographics(user.id);
  }

  @Get('recent-activity')
  recent(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.recentActivity(user.id);
  }

  @Get('export.csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="analytics.csv"')
  async exportCsv(
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ) {
    res.send(await this.svc.exportCsv(user.id));
  }
}
