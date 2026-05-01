import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Converted',
] as const;

export class CreateLeadDto {
  @ApiProperty() @IsString() @MaxLength(200) name!: string;
  @ApiProperty() @IsEmail() email!: string;
  @ApiProperty() @IsString() @MaxLength(120) source!: string;

  @ApiProperty({ required: false, enum: LEAD_STATUSES })
  @IsOptional()
  @IsIn([...LEAD_STATUSES])
  status?: (typeof LEAD_STATUSES)[number];

  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0) @Max(100)
  score?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  aiAnalysis?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  interactions?: string;
}

export class UpdateLeadDto extends PartialType(CreateLeadDto) {}

export class AnalyzeLeadDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() source?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString()
  interactions?: string;
}

export class LeadQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsIn([...LEAD_STATUSES])
  status?: (typeof LEAD_STATUSES)[number];
}
