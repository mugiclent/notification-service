// Infrastructure config — excluded from unit test coverage (see vitest.config.ts)
import { env } from './env.js';

export const config = {
  port: env.PORT,
  isProd: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',

  db: {
    url: `postgresql://notification_svc:${env.DB_PASSWORD}@pgbouncer:6432/notification_db?pgbouncer=true&connect_timeout=5&pool_timeout=5`,
  },

  rabbitmq: {
    url: `amqp://${env.RABBITMQ_USER}:${env.RABBITMQ_PASSWORD}@rabbitmq:5672`,
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
