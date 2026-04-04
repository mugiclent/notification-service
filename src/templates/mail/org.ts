import type { MailEvent } from '../../types/events.js';
import { layout, codeBlock, noticeBox, divider, h1, p, pLast, type MailContent } from './layout.js';
import { getMailStrings } from './i18n.js';

type OrgMailEvent = Extract<MailEvent, { type: `org.${string}` }>;

export const renderOrgMail = (e: OrgMailEvent): MailContent => {
  const org = getMailStrings(e.locale).org;
  const c = getMailStrings(e.locale).common;

  switch (e.type) {
    case 'org.suspended': {
      const s = org.suspended;
      return {
        subject: s.subject(e.org_name),
        html: layout({
          locale: e.locale,
          preheader: s.preheader(e.org_name),
          body: `
            ${h1(s.h1)}
            ${p(s.body1(e.org_name))}
            ${noticeBox(s.notice)}
            ${pLast(c.sign_off)}
          `,
        }),
      };
    }

    case 'org.rejected': {
      const s = org.rejected;
      return {
        subject: s.subject(e.org_name),
        html: layout({
          locale: e.locale,
          preheader: s.preheader(e.org_name),
          body: `
            ${h1(s.h1)}
            ${p(s.body1(e.org_name))}
            ${e.reason ? noticeBox(`<strong>${s.reason_label}</strong> ${e.reason}`) : ''}
            ${p(s.body2)}
            ${divider()}
            ${pLast(c.sign_off)}
          `,
        }),
      };
    }

    case 'org.contact_otp': {
      const s = org.contact_otp;
      const minutes = Math.ceil(e.expires_in_seconds / 60);
      return {
        subject: s.subject(e.org_name),
        html: layout({
          locale: e.locale,
          preheader: s.preheader(minutes, e.org_name),
          body: `
            ${h1(s.h1)}
            ${p(s.greeting(e.first_name))}
            ${p(s.body1(e.org_name))}
            ${codeBlock(e.code)}
            ${p(s.expiry(minutes), 'font-size:14px;color:#737373;')}
            ${pLast(c.sign_off)}
          `,
        }),
      };
    }

    case 'org.contact_verified': {
      const s = org.contact_verified;
      return {
        subject: s.subject(e.org_name),
        html: layout({
          locale: e.locale,
          preheader: s.preheader(e.org_name),
          body: `
            ${h1(s.h1)}
            ${p(s.greeting(e.first_name))}
            ${p(s.body1(e.org_name))}
            ${divider()}
            ${pLast(c.sign_off)}
          `,
        }),
      };
    }

    case 'org.application_received': {
      const s = org.application_received;
      return {
        subject: s.subject(e.org_name),
        html: layout({
          locale: e.locale,
          preheader: s.preheader(e.org_name),
          body: `
            ${h1(s.h1)}
            ${p(s.body1)}
            ${p(s.body2(e.org_name, e.org_type, e.contact_email))}
            ${noticeBox(s.notice)}
            ${pLast(c.sign_off)}
          `,
        }),
      };
    }
  }
};
