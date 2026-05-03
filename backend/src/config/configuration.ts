export type AppConfig = ReturnType<typeof loadConfiguration>;

export const loadConfiguration = () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    user: process.env.DATABASE_USER ?? 'automarketer',
    password: process.env.DATABASE_PASSWORD ?? 'automarketer',
    name: process.env.DATABASE_NAME ?? 'automarketer',
    sync: process.env.DATABASE_SYNC === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'change-me-access',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY ?? '',
    geminiTextModel: process.env.GEMINI_TEXT_MODEL ?? 'gemini-2.5-flash',
    geminiTimeoutMs: parseInt(process.env.GEMINI_TIMEOUT_MS ?? '30000', 10),
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL ?? '',
    n8nTimeoutMs: parseInt(process.env.N8N_WEBHOOK_TIMEOUT_MS ?? '15000', 10),
  },
  realtime: {
    kpiTickMs: parseInt(process.env.WS_KPI_TICK_MS ?? '5000', 10),
  },
});
