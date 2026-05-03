import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().uri().default('http://localhost:5173'),

  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SYNC: Joi.boolean().default(false),
  DATABASE_LOGGING: Joi.boolean().default(false),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Gemini is REQUIRED — boot fails without it.
  GEMINI_API_KEY: Joi.string().required(),
  GEMINI_TEXT_MODEL: Joi.string().default('gemini-2.5-flash'),
  GEMINI_TIMEOUT_MS: Joi.number().default(30000),

  // n8n is optional. If set and reachable, used as a secondary path.
  N8N_WEBHOOK_URL: Joi.string().uri().allow('').optional(),
  N8N_WEBHOOK_TIMEOUT_MS: Joi.number().default(15000),

  WS_KPI_TICK_MS: Joi.number().default(5000),
});
