import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  organization?: string;

  @ApiProperty({ required: false, description: 'Base64 data URL' })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  currentPassword!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  newPassword!: string;
}

export class UpdateNotificationPrefsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  leads?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  campaigns?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  weekly?: boolean;
}
