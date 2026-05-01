import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SocialAccountsService } from './social-accounts.service';
import { SocialPlatform } from './social-account.entity';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';

const PLATFORMS: SocialPlatform[] = [
  'twitter',
  'linkedin',
  'facebook',
  'instagram',
];

@ApiBearerAuth()
@ApiTags('social-accounts')
@Controller('social-accounts')
export class SocialAccountsController {
  constructor(private readonly svc: SocialAccountsService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.svc.list(user.id);
  }

  @Post(':platform/connect')
  connect(
    @CurrentUser() user: AuthenticatedUser,
    @Param('platform') platform: string,
  ) {
    if (!PLATFORMS.includes(platform as SocialPlatform))
      throw new BadRequestException('Unsupported platform');
    return this.svc.connect(user.id, platform as SocialPlatform);
  }

  @Post(':platform/disconnect')
  disconnect(
    @CurrentUser() user: AuthenticatedUser,
    @Param('platform') platform: string,
  ) {
    if (!PLATFORMS.includes(platform as SocialPlatform))
      throw new BadRequestException('Unsupported platform');
    return this.svc.disconnect(user.id, platform as SocialPlatform);
  }
}
