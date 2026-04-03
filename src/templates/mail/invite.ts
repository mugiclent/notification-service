import type { MailEvent } from '../../types/events.js';
import type { MailContent } from './index.js';

type InviteMailEvent = Extract<MailEvent, { type: 'invite.mail' }>;

export const renderInviteMail = (e: InviteMailEvent): MailContent => {
  const hours = Math.ceil(e.expires_in_seconds / 3600);
  return {
    subject: "You've been invited to Katisha",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a1a">You're invited!</h2>
        <p>Hi ${e.first_name},</p>
        <p>You've been invited to join Katisha. Click the link below to accept your invitation:</p>
        <div style="margin:24px 0">
          <a href="${e.invite_link}" style="background:#0070f3;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
            Accept Invitation
          </a>
        </div>
        <p style="color:#666;font-size:14px">This link expires in ${hours} hour${hours !== 1 ? 's' : ''}.</p>
        <p style="color:#666;font-size:14px">If you can't click the button, copy this link: ${e.invite_link}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#888;font-size:12px">The Katisha Team</p>
      </div>
    `.trim(),
  };
};
