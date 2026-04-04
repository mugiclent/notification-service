// Infrastructure config — excluded from unit test coverage (see vitest.config.ts)
import { env } from './env.js';

export const config = {
  port: env.PORT,
  isProd: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',

  db: {
    url: env.DATABASE_URL,
  },

  rabbitmq: {
    url: env.RABBITMQ_URL,
  },

  bulksms: {
    apiKey: env.BULKSMS_API_KEY,
    senderId: env.BULKSMS_SENDER_ID,
    endpoint: 'https://api.prod.bulksms.rw/api/v2/bulksms/send-sms',
  },

  resend: {
    apiKey: env.RESEND_API_KEY,
    from: env.MAIL_FROM,
  },

  mail: {
    logoUrl: env.LOGO_URL,
  },
} as const;
