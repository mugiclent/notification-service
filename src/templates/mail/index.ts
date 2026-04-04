import type { MailEvent } from '../../types/events.js';
import { renderOtpMail } from './otp.js';
import { renderWelcomeMail } from './welcome.js';
import { renderInviteMail } from './invite.js';
import { renderOrgApprovedMail } from './org-approved.js';
import { renderSecurityMail } from './security.js';
import { renderOrgMail } from './org.js';
import type { MailContent } from './layout.js';

export type { MailContent } from './layout.js';

/**
 * Dispatch a mail event to the correct template function.
 *
 * The exhaustive switch on the discriminated union means TypeScript will
 * produce a compile error if a new MailEvent type is added to events.ts
 * without a corresponding case here.
 */
export const renderMail = (event: MailEvent): MailContent => {
  switch (event.type) {
    case 'otp.mail':
      return renderOtpMail(event);

    case 'welcome.mail':
      return renderWelcomeMail(event);

    case 'invite.mail':
      return renderInviteMail(event);

    case 'org_approved.mail':
      return renderOrgApprovedMail(event);

    case 'security.login_new_device':
    case 'security.password_changed':
    case 'security.account_suspended':
    case 'security.2fa_enabled':
    case 'security.2fa_disabled':
      return renderSecurityMail(event);

    case 'org.suspended':
    case 'org.rejected':
    case 'org.contact_otp':
    case 'org.contact_verified':
    case 'org.application_received':
      return renderOrgMail(event);
  }
};
