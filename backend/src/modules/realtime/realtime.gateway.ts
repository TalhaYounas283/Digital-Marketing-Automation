import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { WebSocket, Server as WsServer } from 'ws';
import { AnalyticsService } from '../analytics/analytics.service';

interface AuthedSocket extends WebSocket {
  userId?: string;
}

@Injectable()
@WebSocketGateway({ path: '/ws' })
export class RealtimeGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit,
    OnModuleDestroy
{
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: WsServer;

  private interval: NodeJS.Timeout | null = null;
  private clients = new Map<string, Set<AuthedSocket>>();

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly analytics: AnalyticsService,
  ) {}

  onModuleInit() {
    const tickMs = this.config.get<number>('realtime.kpiTickMs') ?? 5000;
    this.interval = setInterval(() => this.broadcastKpi(), tickMs);
    this.logger.log(`KPI tick scheduled every ${tickMs}ms`);
  }

  onModuleDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  handleConnection(client: AuthedSocket, request: IncomingMessage) {
    const token = this.extractToken(request);
    if (!token) {
      client.send(
        JSON.stringify({
          type: 'error',
          data: { message: 'Missing token' },
          timestamp: new Date(),
        }),
      );
      client.close(1008, 'Missing token');
      return;
    }
    try {
      const payload = this.jwt.verify<{ sub: string }>(token, {
        secret: this.config.get<string>('jwt.accessSecret'),
      });
      client.userId = payload.sub;
      const set = this.clients.get(payload.sub) ?? new Set();
      set.add(client);
      this.clients.set(payload.sub, set);
      this.logger.log(`WS connected (user ${payload.sub})`);
      void this.sendKpiTo(client, payload.sub);
    } catch {
      client.send(
        JSON.stringify({
          type: 'error',
          data: { message: 'Invalid token' },
          timestamp: new Date(),
        }),
      );
      client.close(1008, 'Invalid token');
    }
  }

  handleDisconnect(client: AuthedSocket) {
    if (!client.userId) return;
    const set = this.clients.get(client.userId);
    set?.delete(client);
    if (set && set.size === 0) this.clients.delete(client.userId);
  }

  async pushActivity(userId: string) {
    const set = this.clients.get(userId);
    if (!set || set.size === 0) return;
    const data = {
      recentActivity: await this.analytics.recentActivity(userId),
    };
    const message = JSON.stringify({
      type: 'activity_update',
      data,
      timestamp: new Date(),
    });
    set.forEach((c) => c.readyState === c.OPEN && c.send(message));
  }

  private async broadcastKpi() {
    for (const [userId, sockets] of this.clients) {
      if (sockets.size === 0) continue;
      try {
        const kpi = await this.analytics.kpi(userId);
        const message = JSON.stringify({
          type: 'kpi_update',
          data: kpi,
          timestamp: new Date(),
        });
        sockets.forEach((c) => c.readyState === c.OPEN && c.send(message));
      } catch (e) {
        this.logger.warn(
          `KPI tick failed for user ${userId}: ${(e as Error).message}`,
        );
      }
    }
  }

  private async sendKpiTo(client: AuthedSocket, userId: string) {
    try {
      const kpi = await this.analytics.kpi(userId);
      client.send(
        JSON.stringify({
          type: 'kpi_update',
          data: kpi,
          timestamp: new Date(),
        }),
      );
    } catch (e) {
      this.logger.warn(`Initial KPI push failed: ${(e as Error).message}`);
    }
  }

  private extractToken(request: IncomingMessage): string | null {
    const url = new URL(request.url ?? '', 'http://localhost');
    const fromQuery = url.searchParams.get('token');
    if (fromQuery) return fromQuery;
    const auth = request.headers['authorization'];
    if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
      return auth.slice(7);
    }
    return null;
  }
}
