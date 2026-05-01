import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailCampaign } from './email-campaign.entity';
import { EmailCampaignsController } from './email-campaigns.controller';
import { EmailCampaignsService } from './email-campaigns.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailCampaign])],
  controllers: [EmailCampaignsController],
  providers: [EmailCampaignsService],
})
export class EmailCampaignsModule {}
