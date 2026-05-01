import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RealtimeGateway } from './realtime.gateway';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [JwtModule.register({}), AnalyticsModule],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}
