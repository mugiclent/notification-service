import type { SmsEvent } from '../../types/events.js';
import { getSmsStrings } from './i18n.js';

type OtpSmsEvent = Extract<SmsEvent, { type: 'otp.sms' }>;

export const renderOtpSms = (e: OtpSmsEvent): string => {
  const s = getSmsStrings(e.locale).otp;
  const minutes = Math.ceil(e.expires_in_seconds / 60);
  return s.template(s.purposes[e.purpose], e.code, minutes);
};
