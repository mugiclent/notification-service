import type { MailEvent } from '../../types/events.js';
import { layout, codeBlock, noticeBox, h1, p, pLast, type MailContent } from './layout.js';
import { getMailStrings } from './i18n.js';

type OtpMailEvent = Extract<MailEvent, { type: 'otp.mail' }>;

export const renderOtpMail = (e: OtpMailEvent): MailContent => {
  const s = getMailStrings(e.locale).otp;
  const c = getMailStrings(e.locale).common;
  const ps = s.purposes[e.purpose];
  const minutes = Math.ceil(e.expires_in_seconds / 60);
  return {
    subject: ps.subject,
    html: layout({
      locale: e.locale,
      preheader: ps.preheader(minutes),
      body: `
        ${h1(ps.h1)}
        ${p(s.greeting(e.first_name))}
        ${p(ps.body1)}
        ${codeBlock(e.code)}
        ${p(s.expiry(minutes))}
        ${noticeBox(ps.notice)}
        ${pLast(c.sign_off)}
      `,
    }),
  };
};
