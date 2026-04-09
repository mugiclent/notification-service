import type { SmsEvent } from '../../types/events.js';
import { getSmsStrings } from './i18n.js';

type SecuritySmsEvent = Extract<SmsEvent, { type: `security.${string}` }>;

export const renderSecuritySms = (e: SecuritySmsEvent): string => {
  const s = getSmsStrings(e.locale).security;
  switch (e.type) {
    case 'security.login_new_device':      return s.login_new_device(e.first_name, e.device);
    case 'security.password_changed':      return s.password_changed(e.first_name);
    case 'security.account_suspended':     return s.account_suspended(e.first_name);
    case 'security.2fa_enabled':           return s['2fa_enabled'](e.first_name);
    case 'security.2fa_disabled':          return s['2fa_disabled'](e.first_name);
  }
};
