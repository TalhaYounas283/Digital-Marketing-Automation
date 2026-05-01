import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../../modules/users/user.entity';
import { Campaign } from '../../modules/campaigns/campaign.entity';
import { Lead } from '../../modules/leads/lead.entity';
import { EmailCampaign } from '../../modules/email-campaigns/email-campaign.entity';
import { Template } from '../../modules/templates/template.entity';
import { AutomationWorkflow } from '../../modules/workflows/automation-workflow.entity';
import { SEED_TEMPLATES } from './seed-templates';

async function main() {
  await AppDataSource.initialize();
  console.log('🌱 Seeding database...');

  const userRepo = AppDataSource.getRepository(User);
  const campaignRepo = AppDataSource.getRepository(Campaign);
  const leadRepo = AppDataSource.getRepository(Lead);
  const emailRepo = AppDataSource.getRepository(EmailCampaign);
  const templateRepo = AppDataSource.getRepository(Template);
  const workflowRepo = AppDataSource.getRepository(AutomationWorkflow);

  let demo = await userRepo.findOne({
    where: { email: 'demo@automarketer.ai' },
  });
  if (!demo) {
    demo = await userRepo.save(
      userRepo.create({
        name: 'Demo Marketer',
        email: 'demo@automarketer.ai',
        passwordHash: await bcrypt.hash('demo1234', 10),
        role: 'owner',
        organization: 'AutoMarketer Workspace',
      }),
    );
    console.log('✓ Created demo user (demo@automarketer.ai / demo1234)');
  } else {
    console.log('• Demo user already exists');
  }

  const existingTemplates = await templateRepo.count({
    where: { isSystem: true },
  });
  if (existingTemplates === 0) {
    await templateRepo.save(
      SEED_TEMPLATES.map((t) =>
        templateRepo.create({
          ...t,
          userId: null,
          isSystem: true,
          tags: t.tags ?? [],
          rating: 4.5 + Math.random() * 0.4,
          usage: Math.floor(Math.random() * 1500),
        }),
      ),
    );
    console.log(`✓ Inserted ${SEED_TEMPLATES.length} system templates`);
  }

  const campaignCount = await campaignRepo.count({ where: { userId: demo.id } });
  if (campaignCount === 0) {
    await campaignRepo.save([
      campaignRepo.create({
        userId: demo.id,
        name: 'Summer Brand Awareness',
        status: 'active',
        platform: 'Instagram',
        budget: 5000,
        spent: 1850,
        clicks: 4200,
        impressions: 92000,
        startDate: new Date(),
      }),
      campaignRepo.create({
        userId: demo.id,
        name: 'B2B Lead Magnet',
        status: 'paused',
        platform: 'LinkedIn',
        budget: 3000,
        spent: 880,
        clicks: 1100,
        impressions: 28000,
      }),
      campaignRepo.create({
        userId: demo.id,
        name: 'Newsletter Nurture',
        status: 'active',
        platform: 'Email',
        budget: 600,
        spent: 220,
        clicks: 740,
        impressions: 12500,
      }),
    ]);
    console.log('✓ Inserted 3 demo campaigns');
  }

  const leadCount = await leadRepo.count({ where: { userId: demo.id } });
  if (leadCount === 0) {
    await leadRepo.save([
      leadRepo.create({
        userId: demo.id,
        name: 'Aisha Khan',
        email: 'aisha@example.com',
        source: 'LinkedIn Form',
        status: 'Qualified',
        score: 82,
      }),
      leadRepo.create({
        userId: demo.id,
        name: 'Marco Bianchi',
        email: 'marco@example.com',
        source: 'Website Demo',
        status: 'New',
        score: 64,
      }),
      leadRepo.create({
        userId: demo.id,
        name: 'Priya Patel',
        email: 'priya@example.com',
        source: 'Webinar',
        status: 'Contacted',
        score: 71,
      }),
    ]);
    console.log('✓ Inserted 3 demo leads');
  }

  const emailCount = await emailRepo.count({ where: { userId: demo.id } });
  if (emailCount === 0) {
    await emailRepo.save([
      emailRepo.create({
        userId: demo.id,
        name: 'Spring Reactivation',
        subject: 'We miss you — here is 20% off',
        template: 'reactivation',
        status: 'sent',
        recipients: 4200,
        openRate: 38.4,
        clickRate: 6.2,
        sentCount: 4200,
        sentDate: new Date(Date.now() - 7 * 86400000),
      }),
      emailRepo.create({
        userId: demo.id,
        name: 'Q2 Newsletter',
        subject: 'What we shipped in Q2',
        template: 'newsletter',
        status: 'scheduled',
        recipients: 8200,
        scheduledDate: new Date(Date.now() + 3 * 86400000),
      }),
    ]);
    console.log('✓ Inserted 2 demo email campaigns');
  }

  const wfCount = await workflowRepo.count({ where: { userId: demo.id } });
  if (wfCount === 0) {
    await workflowRepo.save([
      workflowRepo.create({
        userId: demo.id,
        name: 'Hot lead → Slack alert',
        tool: 'n8n',
        trigger: 'Lead score >= 80',
        action: 'Post to #sales-hot-leads on Slack',
        status: 'Active',
        lastRun: new Date(),
      }),
      workflowRepo.create({
        userId: demo.id,
        name: 'Welcome email drip',
        tool: 'n8n',
        trigger: 'New lead captured',
        action: 'Send 3-email welcome sequence over 7 days',
        status: 'Paused',
      }),
    ]);
    console.log('✓ Inserted 2 demo workflows');
  }

  await AppDataSource.destroy();
  console.log('🌱 Seeding complete.');
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
