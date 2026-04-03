import type { SmsEvent } from '../../types/events.js';
import { renderOtpSms } from './otp.js';
import { renderWelcomeSms } from './welcome.js';
import { renderInviteSms } from './invite.js';
import { renderOrgApprovedSms } from './org-approved.js';
import { renderSecuritySms } from './security.js';
import { renderOrgSms } from './org.js';

/**
 * Dispatch an SMS event to the correct template function.
 *
 * The exhaustive switch on the discriminated union means TypeScript will
 * produce a compile error if a new SmsEvent type is added to events.ts
 * without a corresponding case here.
 */
export const renderSms = (event: SmsEvent): string => {
  switch (event.type) {
    case 'otp.sms':
      return renderOtpSms(event);

    case 'welcome.sms':
      return renderWelcomeSms(event);

    case 'invite.sms':
      return renderInviteSms(event);

    case 'org_approved.sms':
      return renderOrgApprovedSms(event);

    case 'security.login_new_device':
    case 'security.password_changed':
    case 'security.all_sessions_revoked':
    case 'security.account_suspended':
    case 'security.2fa_enabled':
    case 'security.2fa_disabled':
      return renderSecuritySms(event);

    case 'org.suspended':
    case 'org.rejected':
    case 'org.cooperative_approved':
    case 'org.contact_verified':
      return renderOrgSms(event);
  }
};
