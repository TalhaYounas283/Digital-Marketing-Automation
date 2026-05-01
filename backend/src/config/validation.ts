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

  // n8n is REQUIRED — boot fails without it.
  N8N_WEBHOOK_URL: Joi.string().uri().required(),
  N8N_WEBHOOK_TIMEOUT_MS: Joi.number().default(15000),

  AI_HF_FALLBACK_ENABLED: Joi.boolean().default(false),
  HUGGINGFACE_API_TOKEN: Joi.when('AI_HF_FALLBACK_ENABLED', {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.string().allow('').optional(),
  }),
  HUGGINGFACE_TEXT_MODEL: Joi.string().default(
    'meta-llama/Meta-Llama-3-8B-Instruct',
  ),
  HUGGINGFACE_IMAGE_MODEL: Joi.string().default(
    'stabilityai/stable-diffusion-xl-base-1.0',
  ),

  WS_KPI_TICK_MS: Joi.number().default(5000),
});
