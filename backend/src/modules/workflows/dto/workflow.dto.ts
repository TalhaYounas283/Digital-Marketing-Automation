import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateWorkflowDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tool?: string;
  @ApiProperty() @IsString() trigger!: string;
  @ApiProperty() @IsString() action!: string;

  @ApiProperty({ required: false, enum: ['Active', 'Paused'] })
  @IsOptional()
  @IsIn(['Active', 'Paused'])
  status?: 'Active' | 'Paused';

  @ApiProperty({ required: false }) @IsOptional() @IsString()
  n8nWorkflowId?: string;
}

export class UpdateWorkflowDto extends PartialType(CreateWorkflowDto) {}
