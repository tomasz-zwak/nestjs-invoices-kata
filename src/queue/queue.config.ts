import { registerAs } from '@nestjs/config';

export const QueueConfig = registerAs('queueConfig', () => ({
  host: process.env.BULL_HOST,
  port: parseInt(process.env.BULL_PORT),
}));
