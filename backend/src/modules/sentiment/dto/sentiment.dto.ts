import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class AnalyzeSentimentDto {
  @ApiProperty() @IsString() @MinLength(1) text!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() source?: string;
}
