import type { SmsEvent } from '../../types/events.js';

type SecuritySmsEvent = Extract<SmsEvent, { type: `security.${string}` }>;

export const renderSecuritySms = (e: SecuritySmsEvent): string => {
  switch (e.type) {
    case 'security.login_new_device':
      return `Hi ${e.first_name}, your Katisha account was accessed from a new device${e.device ? ` (${e.device})` : ''}. If this wasn't you, secure your account immediately.`;

    case 'security.password_changed':
      return `Hi ${e.first_name}, your Katisha password was changed. If you didn't do this, contact support immediately.`;

    case 'security.all_sessions_revoked':
      return `Hi ${e.first_name}, all active sessions on your Katisha account have been ended. Sign in again to continue.`;

    case 'security.account_suspended':
      return `Hi ${e.first_name}, your Katisha account has been suspended. Contact support for assistance.`;

    case 'security.2fa_enabled':
      return `Hi ${e.first_name}, two-factor authentication has been enabled on your Katisha account.`;

    case 'security.2fa_disabled':
      return `Hi ${e.first_name}, two-factor authentication has been disabled on your Katisha account. Re-enable it to keep your account secure.`;
  }
};
