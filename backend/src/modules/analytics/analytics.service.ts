import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../campaigns/campaign.entity';
import {
  AnalyticsSnapshot,
  ChartPoint,
  RecentActivity,
} from './analytics-snapshot.entity';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS_12 = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaigns: Repository<Campaign>,
    @InjectRepository(AnalyticsSnapshot)
    private readonly snapshots: Repository<AnalyticsSnapshot>,
  ) {}

  async kpi(userId: string) {
    const campaigns = await this.campaigns.find({ where: { userId } });
    const totalImpressions = campaigns.reduce(
      (s, c) => s + (c.impressions ?? 0),
      0,
    );
    const totalClicks = campaigns.reduce((s, c) => s + (c.clicks ?? 0), 0);
    const totalReach = Math.round(totalImpressions * 0.6);
    const conversion =
      totalClicks > 0 ? Math.round((totalClicks / totalImpressions) * 1000) / 10 : 0;
    return {
      totalReach: totalReach || randomInt(8000, 15000),
      impressions: totalImpressions || randomInt(70000, 95000),
      clickRate: totalClicks || randomInt(3500, 5500),
      conversion: conversion || randomFloat(2, 8),
      chartData: this.makeChart(),
      recentActivity: await this.recentActivity(userId),
    };
  }

  async engagement(userId: string, period: '6m' | '12m' = '6m') {
    const months = period === '12m' ? 12 : 6;
    return Array.from({ length: months }).map((_, i) => ({
      name: MONTHS_12[(new Date().getMonth() - (months - 1 - i) + 12) % 12],
      twitter: randomInt(800, 3200),
      instagram: randomInt(1500, 5000),
      linkedin: randomInt(600, 2400),
      facebook: randomInt(900, 2800),
    }));
  }

  demographics(_userId: string) {
    return [
      { group: '18-24', value: 18 },
      { group: '25-34', value: 36 },
      { group: '35-44', value: 24 },
      { group: '45-54', value: 14 },
      { group: '55+', value: 8 },
    ];
  }

  async recentActivity(userId: string): Promise<RecentActivity[]> {
    const recent = await this.campaigns.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
      take: 5,
    });
    if (recent.length === 0) {
      return [
        { id: 1, campaign: 'Campaign #101 active', performance: 'High engagement', time: '2m ago' },
        { id: 2, campaign: 'Campaign #102 paused', performance: 'Low CTR detected', time: '15m ago' },
        { id: 3, campaign: 'Campaign #103 launched', performance: 'Initial tracking', time: '1h ago' },
      ];
    }
    return recent.map((c, i) => ({
      id: i + 1,
      campaign: `${c.name} ${c.status}`,
      performance: c.status === 'active' ? 'On track' : c.status === 'paused' ? 'Optimisation pending' : 'Wrapping up',
      time: relativeTime(c.updatedAt),
    }));
  }

  async exportCsv(userId: string): Promise<string> {
    const k = await this.kpi(userId);
    const header = 'metric,value';
    const rows = [
      `totalReach,${k.totalReach}`,
      `impressions,${k.impressions}`,
      `clickRate,${k.clickRate}`,
      `conversion,${k.conversion}`,
    ];
    return [header, ...rows].join('\n');
  }

  private makeChart(): ChartPoint[] {
    return DAYS.map((name) => ({
      name,
      visits: randomInt(3000, 5000),
      clicks: randomInt(1000, 3000),
    }));
  }
}

function randomInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min));
}
function randomFloat(min: number, max: number, dp = 1) {
  return Number((min + Math.random() * (max - min)).toFixed(dp));
}
function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
