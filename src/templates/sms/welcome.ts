import type { SmsEvent } from '../../types/events.js';

type WelcomeSmsEvent = Extract<SmsEvent, { type: 'welcome.sms' }>;

export const renderWelcomeSms = (e: WelcomeSmsEvent): string =>
  `Welcome to Katisha, ${e.first_name}! Your account is ready. Download the app or visit our platform to get started.`;
