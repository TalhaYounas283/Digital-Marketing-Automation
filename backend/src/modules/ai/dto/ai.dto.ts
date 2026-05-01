import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export const PLATFORMS = [
  'Twitter',
  'LinkedIn',
  'Instagram',
  'Facebook',
] as const;
export const TONES = [
  'Professional',
  'Casual',
  'Humorous',
  'Urgent',
  'Inspirational',
] as const;

export class GenerateCopyDto {
  @ApiProperty() @IsString() topic!: string;
  @ApiProperty({ enum: PLATFORMS }) @IsIn([...PLATFORMS])
  platform!: (typeof PLATFORMS)[number];
  @ApiProperty({ enum: TONES }) @IsIn([...TONES])
  tone!: (typeof TONES)[number];
  @ApiProperty() @IsString() audience!: string;
}

export class GenerateStrategyDto {
  @ApiProperty() @IsString() productName!: string;
  @ApiProperty() @IsString() goal!: string;
}

export class OptimizeContentDto {
  @ApiProperty() @IsString() originalText!: string;
  @ApiProperty() @IsString() goal!: string;
}

export class GenerateSeoDto {
  @ApiProperty() @IsString() topic!: string;
  @ApiProperty() @IsString() niche!: string;
}

export class AnalyzeCompetitorDto {
  @ApiProperty() @IsString() competitorName!: string;
  @ApiProperty() @IsString() industry!: string;
}

export class GeneratePersonaDto {
  @ApiProperty() @IsString() productName!: string;
  @ApiProperty() @IsString() industry!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() region?: string;
}

export class GenerateImageDto {
  @ApiProperty() @IsString() prompt!: string;
}

export class ChatDto {
  @ApiProperty() @IsString() message!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() context?: string;
}

export class AnalyzeLeadAdHocDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() source!: string;
  @ApiProperty() @IsString() interactions!: string;
}
