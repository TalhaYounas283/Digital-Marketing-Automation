import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateScheduledPostDto {
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() platform!: string;

  @ApiProperty({ description: 'YYYY-MM-DD' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @ApiProperty({ description: 'HH:mm', required: false })
  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  time?: string;

  @ApiProperty({ required: false, enum: ['scheduled', 'published', 'draft'] })
  @IsOptional()
  @IsIn(['scheduled', 'published', 'draft'])
  status?: 'scheduled' | 'published' | 'draft';

  @ApiProperty({ required: false, enum: ['post', 'story', 'reel'] })
  @IsOptional()
  @IsIn(['post', 'story', 'reel'])
  type?: 'post' | 'story' | 'reel';

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  content?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsUUID()
  campaignId?: string;
}

export class UpdateScheduledPostDto extends PartialType(
  CreateScheduledPostDto,
) {}

export class CalendarQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(12) month?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1970) @Max(3000) year?: number;
}
