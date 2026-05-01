import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { loadConfiguration } from './config/configuration';
import { configValidationSchema } from './config/validation';
import { DatabaseModule } from './database/database.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { HealthController } from './health/health.controller';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { LeadsModule } from './modules/leads/leads.module';
import { EmailCampaignsModule } from './modules/email-campaigns/email-campaigns.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { SocialAccountsModule } from './modules/social-accounts/social-accounts.module';
import { AiModule } from './modules/ai/ai.module';
import { SentimentModule } from './modules/sentiment/sentiment.module';
import { InsightsModule } from './modules/insights/insights.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { RealtimeModule } from './modules/realtime/realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      load: [loadConfiguration],
      validationSchema: configValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CampaignsModule,
    LeadsModule,
    EmailCampaignsModule,
    TemplatesModule,
    CalendarModule,
    WorkflowsModule,
    SocialAccountsModule,
    AiModule,
    SentimentModule,
    InsightsModule,
    AnalyticsModule,
    RealtimeModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
