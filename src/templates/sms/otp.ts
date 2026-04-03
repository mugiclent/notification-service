import type { SmsEvent } from '../../types/events.js';

type OtpSmsEvent = Extract<SmsEvent, { type: 'otp.sms' }>;

const PURPOSE_LABELS: Record<OtpSmsEvent['purpose'], string> = {
  phone_verification: 'verify your phone number',
  '2fa': 'confirm your sign-in',
  password_reset: 'reset your password',
};

export const renderOtpSms = (e: OtpSmsEvent): string => {
  const minutes = Math.ceil(e.expires_in_seconds / 60);
  const label = PURPOSE_LABELS[e.purpose];
  return `Your Katisha code to ${label} is: ${e.code}. Valid for ${minutes} min. Do not share this code.`;
};
