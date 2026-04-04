import type { MailEvent } from '../../types/events.js';
import { layout, noticeBox, divider, h1, p, pLast, type MailContent } from './layout.js';
import { getMailStrings } from './i18n.js';

type SecurityMailEvent = Extract<MailEvent, { type: `security.${string}` }>;

export const renderSecurityMail = (e: SecurityMailEvent): MailContent => {
  const sec = getMailStrings(e.locale).security;
  const c = getMailStrings(e.locale).common;

  switch (e.type) {
    case 'security.login_new_device': {
      const s = sec.login_new_device;
      return {
        subject: s.subject,
        html: layout({
          locale: e.locale,
          preheader: s.preheader,
          body: `
            ${h1(s.h1)}
            ${p(s.greeting(e.first_name))}
            ${p(s.body1(e.device))}
            ${p(s.body2)}
            ${noticeBox(c.support_note)}
            ${pLast(c.sign_off)}
          `,
        }),
      };
    }

    case 'security.password_changed': {
      const s = sec.password_changed;
      return {
        subject: s.subject,
        html: layout({
          locale: e.locale,
          preheader: s.preheader,
          body: `
            ${h1(s.h1)}
            ${p(s.greeting(e.first_name))}
            ${p(s.body1)}
            ${noticeBox(c.support_note)}
            ${divider()}
            ${pLast(c.sign_off)}
          `,
        }),
      };
    }

    case 'security.account_suspended': {
      const s = sec.account_suspended;
      return {
        subject: s.subject,
        html: layout({
          locale: e.locale,
          preheader: s.preheader,
          body: `
            ${h1(s.h1)}
            ${p(s.greeting(e.first_name))}
            ${p(s.body1)}
            ${noticeBox(s.notice)}
            ${pLast(c.sign_off)}
          `,
        }),
      };
    }

    case 'security.2fa_enabled': {
      const s = sec['2fa_enabled'];
      return {
        subject: s.subject,
        html: layout({
          locale: e.locale,
          preheader: s.preheader,
          body: `
            ${h1(s.h1)}
            ${p(s.greeting(e.first_name))}
            ${p(s.body1)}
            ${noticeBox(c.support_note)}
            ${divider()}
            ${pLast(c.sign_off)}
          `,
        }),
      };
    }

    case 'security.2fa_disabled': {
      const s = sec['2fa_disabled'];
      return {
        subject: s.subject,
        html: layout({
          locale: e.locale,
          preheader: s.preheader,
          body: `
            ${h1(s.h1)}
            ${p(s.greeting(e.first_name))}
            ${p(s.body1)}
            ${p(s.body2)}
            ${noticeBox(c.support_note)}
            ${divider()}
            ${pLast(c.sign_off)}
          `,
        }),
      };
    }
  }
};
