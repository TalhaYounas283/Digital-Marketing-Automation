import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { InsightsService } from './insights.service';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';
import { InsightCategory } from './recommendation.entity';

class CategoryQuery {
  @IsOptional()
  @IsIn(['timing', 'audience', 'content', 'channel'])
  category?: InsightCategory;
}

@ApiBearerAuth()
@ApiTags('insights')
@Controller('insights')
export class InsightsController {
  constructor(private readonly svc: InsightsService) {}

  @Get('recommendations')
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() q: CategoryQuery,
  ) {
    return this.svc.list(user.id, q.category);
  }

  @Post('regenerate')
  regenerate(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.regenerate(user.id);
  }

  @Post('recommendations/:id/apply')
  apply(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.svc.apply(user.id, id);
  }
}
