import type { MailEvent } from '../../types/events.js';
import { layout, codeBlock, noticeBox, h1, p, pLast, type MailContent } from './layout.js';
import { getMailStrings } from './i18n.js';

type OtpMailEvent = Extract<MailEvent, { type: 'otp.mail' }>;

export const renderOtpMail = (e: OtpMailEvent): MailContent => {
  const s = getMailStrings(e.locale).otp;
  const c = getMailStrings(e.locale).common;
  const minutes = Math.ceil(e.expires_in_seconds / 60);
  return {
    subject: s.subject,
    html: layout({
      locale: e.locale,
      preheader: s.preheader(minutes),
      body: `
        ${h1(s.h1)}
        ${p(s.greeting(e.first_name))}
        ${p(s.body1)}
        ${codeBlock(e.code)}
        ${p(s.expiry(minutes))}
        ${noticeBox(s.notice)}
        ${pLast(c.sign_off)}
      `,
    }),
  };
};
