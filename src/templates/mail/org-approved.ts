import type { MailEvent } from '../../types/events.js';
import type { MailContent } from './index.js';

type OrgApprovedMailEvent = Extract<MailEvent, { type: 'org_approved.mail' }>;

export const renderOrgApprovedMail = (e: OrgApprovedMailEvent): MailContent => {
  const hours = Math.ceil(e.expires_in_seconds / 3600);
  return {
    subject: `${e.org_name} has been approved on Katisha`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px">
        <h2 style="color:#1a1a1a">Organisation Approved!</h2>
        <p>Congratulations! <strong>${e.org_name}</strong> has been approved on Katisha.</p>
        <p>Click below to set up your organisation:</p>
        <div style="margin:24px 0">
          <a href="${e.invite_link}" style="background:#0070f3;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
            Set Up Organisation
          </a>
        </div>
        <p style="color:#666;font-size:14px">This link expires in ${hours} hour${hours !== 1 ? 's' : ''}.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#888;font-size:12px">The Katisha Team</p>
      </div>
    `.trim(),
  };
};
