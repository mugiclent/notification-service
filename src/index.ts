import 'dotenv/config';
import { config } from './config/index.js';
import express from 'express';
import type { Request, Response } from 'express';
import { initPrisma } from './loaders/prisma.js';
import { initRabbitMQ, closeRabbitMQ } from './loaders/rabbitmq.js';
import { prisma } from './models/index.js';

const start = async (): Promise<void> => {
  await initPrisma();
  await initRabbitMQ();

  const app = express();

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const server = app.listen(config.port, () => {
    console.warn(`[server] Listening on port ${config.port} (${config.isProd ? 'production' : 'development'})`);
    console.warn('[server] Consuming sms + mail queues');
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.warn(`[server] ${signal} received — shutting down`);
    server.close(async () => {
      await prisma.$disconnect();
      await closeRabbitMQ();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
  process.on('SIGINT',  () => { void shutdown('SIGINT'); });
};

start().catch((err) => {
  console.error('[server] Failed to start', err);
  process.exit(1);
});
