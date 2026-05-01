import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export const EMAIL_STATUSES = [
  'draft',
  'scheduled',
  'sending',
  'sent',
] as const;

export class CreateEmailCampaignDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() subject!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() template?: string;

  @ApiProperty({ required: false, enum: EMAIL_STATUSES })
  @IsOptional()
  @IsIn([...EMAIL_STATUSES])
  status?: (typeof EMAIL_STATUSES)[number];

  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0)
  recipients?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledDate?: Date;
}

export class UpdateEmailCampaignDto extends PartialType(
  CreateEmailCampaignDto,
) {}

export class EmailCampaignQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsIn([...EMAIL_STATUSES])
  status?: (typeof EMAIL_STATUSES)[number];
}
