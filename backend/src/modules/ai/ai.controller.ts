import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import {
  AnalyzeCompetitorDto,
  AnalyzeLeadAdHocDto,
  ChatDto,
  GenerateCopyDto,
  GenerateImageDto,
  GeneratePersonaDto,
  GenerateSeoDto,
  GenerateStrategyDto,
  OptimizeContentDto,
} from './dto/ai.dto';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';

@ApiBearerAuth()
@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('generate-copy')
  generateCopy(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GenerateCopyDto,
  ) {
    return this.ai.runAction<string[]>('generate_copy', { ...dto }, {
      userId: user.id,
      persistFor: { platform: dto.platform, tone: dto.tone },
    });
  }

  @Post('generate-strategy')
  generateStrategy(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GenerateStrategyDto,
  ) {
    return this.ai.runAction('generate_strategy', { ...dto }, { userId: user.id });
  }

  @Post('optimize-content')
  optimize(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: OptimizeContentDto,
  ) {
    return this.ai.runAction('optimize_content', { ...dto }, { userId: user.id });
  }

  @Post('generate-seo')
  seo(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GenerateSeoDto,
  ) {
    return this.ai.runAction('generate_seo', { ...dto }, { userId: user.id });
  }

  @Post('analyze-competitor')
  competitor(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AnalyzeCompetitorDto,
  ) {
    return this.ai.runAction('analyze_competitor', { ...dto }, { userId: user.id });
  }

  @Post('generate-persona')
  persona(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GeneratePersonaDto,
  ) {
    return this.ai.runAction('generate_persona', { ...dto }, { userId: user.id });
  }

  @Post('generate-image')
  image(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GenerateImageDto,
  ) {
    return this.ai.generateImage(dto.prompt, user.id);
  }

  @Post('chat')
  async chat(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChatDto,
  ) {
    const reply = await this.ai.runAction<string>(
      'chat_response',
      { ...dto },
      { userId: user.id },
    );
    return { reply };
  }

  @Post('analyze-lead')
  analyzeLead(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AnalyzeLeadAdHocDto,
  ) {
    return this.ai.runAction<{ score: number; reason: string }>(
      'analyze_lead',
      { ...dto },
      { userId: user.id },
    );
  }
}
