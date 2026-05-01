import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export const CAMPAIGN_STATUSES = [
  'active',
  'paused',
  'completed',
  'draft',
] as const;
export const CAMPAIGN_PLATFORMS = [
  'Facebook',
  'Google',
  'Instagram',
  'LinkedIn',
  'Email',
  'Twitter',
] as const;

class CampaignSettingsDto {
  @IsOptional() @IsInt() @Min(0) dailyCap?: number;
  @IsOptional() autoOptimize?: boolean;
  @IsOptional() sendAlerts?: boolean;
}

export class CreateCampaignDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ enum: CAMPAIGN_PLATFORMS }) @IsIn([...CAMPAIGN_PLATFORMS])
  platform!: (typeof CAMPAIGN_PLATFORMS)[number];

  @ApiProperty({ enum: CAMPAIGN_STATUSES, required: false })
  @IsOptional()
  @IsIn([...CAMPAIGN_STATUSES])
  status?: (typeof CAMPAIGN_STATUSES)[number];

  @ApiProperty() @IsNumber() @Min(0) budget!: number;

  @ApiProperty({ required: false }) @IsOptional() @IsNumber() @Min(0)
  spent?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0)
  clicks?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0)
  impressions?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({ required: false, type: CampaignSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CampaignSettingsDto)
  settings?: CampaignSettingsDto;
}

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}

export class CampaignQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsIn([...CAMPAIGN_STATUSES])
  status?: (typeof CAMPAIGN_STATUSES)[number];
  @IsOptional() @IsIn([...CAMPAIGN_PLATFORMS])
  platform?: (typeof CAMPAIGN_PLATFORMS)[number];
}
