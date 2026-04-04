import type { MailEvent } from '../../types/events.js';
import { layout, ctaButton, noticeBox, h1, p, pLast, type MailContent } from './layout.js';
import { getMailStrings } from './i18n.js';

type OrgApprovedMailEvent = Extract<MailEvent, { type: 'org_approved.mail' }>;

export const renderOrgApprovedMail = (e: OrgApprovedMailEvent): MailContent => {
  const s = getMailStrings(e.locale).org_approved;
  const c = getMailStrings(e.locale).common;
  const hours = Math.ceil(e.expires_in_seconds / 3600);
  return {
    subject: s.subject(e.org_name),
    html: layout({
      locale: e.locale,
      preheader: s.preheader(e.org_name),
      body: `
        ${h1(s.h1)}
        ${p(s.body1(e.org_name))}
        ${p(s.body2)}
        ${ctaButton(e.invite_link, s.cta)}
        ${p(s.expiry(hours), 'font-size:14px;color:#737373;')}
        ${noticeBox(`${c.cta_fallback}<br />
          <a href="${e.invite_link}" style="color:#0a0a0a;word-break:break-all;">${e.invite_link}</a>`)}
        ${pLast(c.sign_off)}
      `,
    }),
  };
};
