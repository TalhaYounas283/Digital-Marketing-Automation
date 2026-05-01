import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import {
  ChangePasswordDto,
  UpdateNotificationPrefsDto,
  UpdateProfileDto,
} from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async getById(id: string) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.publicProfile(user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email.toLowerCase();
    if (dto.organization !== undefined) user.organization = dto.organization;
    if (dto.profilePicture !== undefined)
      user.profilePicture = dto.profilePicture;
    return this.publicProfile(await this.users.save(user));
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!ok) throw new BadRequestException('Current password is incorrect');
    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.users.save(user);
    return { message: 'Password updated' };
  }

  async getNotificationPrefs(id: string) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user.notificationPrefs;
  }

  async updateNotificationPrefs(id: string, dto: UpdateNotificationPrefsDto) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.notificationPrefs = { ...user.notificationPrefs, ...dto };
    await this.users.save(user);
    return user.notificationPrefs;
  }

  private publicProfile(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      profilePicture: user.profilePicture,
      notificationPrefs: user.notificationPrefs,
    };
  }
}
