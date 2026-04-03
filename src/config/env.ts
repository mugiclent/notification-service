// Infrastructure config — excluded from unit test coverage (see vitest.config.ts)
import Joi from 'joi';

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
  PORT: Joi.number().default(8100),

  DATABASE_URL: Joi.string().uri().required(),

  RABBITMQ_URL: Joi.string().uri().required(),

  BULKSMS_API_KEY: Joi.string().required(),
  BULKSMS_SENDER_ID: Joi.string().default('KATISHA'),

  RESEND_API_KEY: Joi.string().required(),
  MAIL_FROM: Joi.string().required(),
});

const { error, value } = schema.validate(process.env, { allowUnknown: true });

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = value as {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  DATABASE_URL: string;
  RABBITMQ_URL: string;
  BULKSMS_API_KEY: string;
  BULKSMS_SENDER_ID: string;
  RESEND_API_KEY: string;
  MAIL_FROM: string;
};
