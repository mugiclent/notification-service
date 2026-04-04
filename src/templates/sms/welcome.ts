import type { SmsEvent } from '../../types/events.js';
import { getSmsStrings } from './i18n.js';

type WelcomeSmsEvent = Extract<SmsEvent, { type: 'welcome.sms' }>;

export const renderWelcomeSms = (e: WelcomeSmsEvent): string =>
  getSmsStrings(e.locale).welcome(e.first_name);
