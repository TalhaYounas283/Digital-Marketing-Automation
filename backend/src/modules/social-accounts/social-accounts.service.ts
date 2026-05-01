import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SocialAccount,
  SocialPlatform,
} from './social-account.entity';

@Injectable()
export class SocialAccountsService {
  constructor(
    @InjectRepository(SocialAccount)
    private readonly repo: Repository<SocialAccount>,
  ) {}

  async list(userId: string) {
    const platforms: SocialPlatform[] = [
      'twitter',
      'linkedin',
      'facebook',
      'instagram',
    ];
    const existing = await this.repo.find({ where: { userId } });
    return platforms.map(
      (p) =>
        existing.find((a) => a.platform === p) ?? {
          id: null,
          userId,
          platform: p,
          connected: false,
          username: null,
        },
    );
  }

  async connect(userId: string, platform: SocialPlatform) {
    let account = await this.repo.findOne({ where: { userId, platform } });
    if (!account) {
      account = this.repo.create({ userId, platform, connected: false });
    }
    account.connected = true;
    account.username = `${platform}_user_${userId.slice(0, 6)}`;
    account.expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000);
    await this.repo.save(account);
    return {
      authUrl: `https://${platform}.com/oauth/authorize?stub=1`,
      account,
    };
  }

  async disconnect(userId: string, platform: SocialPlatform) {
    const account = await this.repo.findOne({ where: { userId, platform } });
    if (!account) throw new NotFoundException('Not connected');
    account.connected = false;
    account.username = null;
    account.accessToken = null;
    account.refreshToken = null;
    account.expiresAt = null;
    return this.repo.save(account);
  }
}
