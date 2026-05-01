import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty() @IsString() title!: string;
  @ApiProperty() @IsString() description!: string;
  @ApiProperty() @IsString() category!: string;
  @ApiProperty({ type: [String] }) @IsArray() @IsString({ each: true })
  platform!: string[];
  @ApiProperty() @IsString() content!: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false }) @IsOptional() @IsBoolean()
  isPremium?: boolean;
}

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {}

export class TemplateQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() category?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  premium?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;
}
