import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1714600000000 implements MigrationInterface {
  name = 'InitialSchema1714600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(120) NOT NULL,
        "email" varchar(180) NOT NULL,
        "passwordHash" varchar(200) NOT NULL,
        "role" varchar(20) NOT NULL DEFAULT 'manager',
        "organization" varchar(120) NOT NULL DEFAULT 'AutoMarketer Workspace',
        "profilePicture" text,
        "notificationPrefs" jsonb NOT NULL DEFAULT '{"leads": true, "campaigns": true, "weekly": false}',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "tokenHash" varchar(255) NOT NULL,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "revokedAt" TIMESTAMPTZ,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_refresh_user" ON "refresh_tokens" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_refresh_hash" ON "refresh_tokens" ("tokenHash")`);

    await queryRunner.query(`
      CREATE TABLE "campaigns" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "name" varchar(200) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'draft',
        "platform" varchar(30) NOT NULL,
        "budget" numeric(12,2) NOT NULL DEFAULT 0,
        "spent" numeric(12,2) NOT NULL DEFAULT 0,
        "clicks" int NOT NULL DEFAULT 0,
        "impressions" int NOT NULL DEFAULT 0,
        "startDate" TIMESTAMPTZ,
        "endDate" TIMESTAMPTZ,
        "settings" jsonb NOT NULL DEFAULT '{}',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_campaigns_user" ON "campaigns" ("userId")`);

    await queryRunner.query(`
      CREATE TABLE "leads" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "name" varchar(200) NOT NULL,
        "email" varchar(200) NOT NULL,
        "source" varchar(120) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'New',
        "score" int NOT NULL DEFAULT 0,
        "aiAnalysis" text,
        "interactions" text,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_leads_user" ON "leads" ("userId")`);

    await queryRunner.query(`
      CREATE TABLE "email_campaigns" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "name" varchar(200) NOT NULL,
        "subject" varchar(200) NOT NULL,
        "template" varchar(200) NOT NULL DEFAULT 'default',
        "status" varchar(20) NOT NULL DEFAULT 'draft',
        "recipients" int NOT NULL DEFAULT 0,
        "openRate" numeric(5,2) NOT NULL DEFAULT 0,
        "clickRate" numeric(5,2) NOT NULL DEFAULT 0,
        "sentCount" int NOT NULL DEFAULT 0,
        "sentDate" TIMESTAMPTZ,
        "scheduledDate" TIMESTAMPTZ,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_email_user" ON "email_campaigns" ("userId")`);

    await queryRunner.query(`
      CREATE TABLE "templates" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid,
        "title" varchar(200) NOT NULL,
        "description" text NOT NULL,
        "category" varchar(80) NOT NULL,
        "platform" text[] NOT NULL DEFAULT ARRAY[]::text[],
        "content" text NOT NULL,
        "tags" text[] NOT NULL DEFAULT ARRAY[]::text[],
        "usage" int NOT NULL DEFAULT 0,
        "rating" numeric(3,1) NOT NULL DEFAULT 4.5,
        "isPremium" boolean NOT NULL DEFAULT false,
        "isSystem" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_templates_user" ON "templates" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_templates_category" ON "templates" ("category")`);

    await queryRunner.query(`
      CREATE TABLE "scheduled_posts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "title" varchar(200) NOT NULL,
        "platform" varchar(30) NOT NULL,
        "date" date NOT NULL,
        "time" varchar(16) NOT NULL DEFAULT '09:00',
        "status" varchar(20) NOT NULL DEFAULT 'scheduled',
        "type" varchar(20) NOT NULL DEFAULT 'post',
        "content" text,
        "campaignId" uuid,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_posts_user" ON "scheduled_posts" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_posts_date" ON "scheduled_posts" ("date")`);

    await queryRunner.query(`
      CREATE TABLE "automation_workflows" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "name" varchar(200) NOT NULL,
        "tool" varchar(30) NOT NULL DEFAULT 'n8n',
        "trigger" varchar(200) NOT NULL,
        "action" varchar(200) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'Paused',
        "lastRun" TIMESTAMPTZ,
        "n8nWorkflowId" varchar(200),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_workflows_user" ON "automation_workflows" ("userId")`);

    await queryRunner.query(`
      CREATE TABLE "social_accounts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "platform" varchar(30) NOT NULL,
        "connected" boolean NOT NULL DEFAULT false,
        "username" varchar(200),
        "accessToken" text,
        "refreshToken" text,
        "expiresAt" TIMESTAMPTZ,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_social_user_platform" UNIQUE ("userId", "platform")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_social_user" ON "social_accounts" ("userId")`);

    await queryRunner.query(`
      CREATE TABLE "generated_contents" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "action" varchar(80) NOT NULL,
        "platform" varchar(30),
        "tone" varchar(30),
        "prompt" jsonb NOT NULL DEFAULT '{}',
        "result" jsonb NOT NULL,
        "provider" varchar(30) NOT NULL DEFAULT 'n8n',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_genc_user" ON "generated_contents" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_genc_action" ON "generated_contents" ("action")`);

    await queryRunner.query(`
      CREATE TABLE "sentiment_records" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "text" text NOT NULL,
        "sentiment" varchar(20) NOT NULL,
        "score" numeric(4,3) NOT NULL DEFAULT 0,
        "source" varchar(120),
        "highlights" text[] NOT NULL DEFAULT ARRAY[]::text[],
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_sent_user" ON "sentiment_records" ("userId")`);

    await queryRunner.query(`
      CREATE TABLE "recommendations" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "title" varchar(200) NOT NULL,
        "description" text NOT NULL,
        "impact" varchar(10) NOT NULL DEFAULT 'medium',
        "category" varchar(30) NOT NULL,
        "confidence" int NOT NULL DEFAULT 80,
        "applied" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_rec_user" ON "recommendations" ("userId")`);

    await queryRunner.query(`
      CREATE TABLE "analytics_snapshots" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "period" varchar(30) NOT NULL DEFAULT 'daily',
        "totalReach" int NOT NULL DEFAULT 0,
        "impressions" int NOT NULL DEFAULT 0,
        "clickRate" int NOT NULL DEFAULT 0,
        "conversion" numeric(5,2) NOT NULL DEFAULT 0,
        "chartData" jsonb NOT NULL DEFAULT '[]',
        "recentActivity" jsonb NOT NULL DEFAULT '[]',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_snap_user" ON "analytics_snapshots" ("userId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "analytics_snapshots"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "recommendations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sentiment_records"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "generated_contents"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "social_accounts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "automation_workflows"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "scheduled_posts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "templates"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "email_campaigns"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "leads"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "campaigns"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
