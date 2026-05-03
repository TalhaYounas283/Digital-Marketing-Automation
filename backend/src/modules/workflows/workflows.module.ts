import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationWorkflow } from './automation-workflow.entity';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { N8nClient } from './n8n.client';

@Module({
  imports: [TypeOrmModule.forFeature([AutomationWorkflow]), HttpModule],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, N8nClient],
})
export class WorkflowsModule {}
