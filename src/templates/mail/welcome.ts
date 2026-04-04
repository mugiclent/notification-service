import type { MailEvent } from '../../types/events.js';
import { layout, divider, h1, p, pLast, type MailContent } from './layout.js';
import { getMailStrings } from './i18n.js';

type WelcomeMailEvent = Extract<MailEvent, { type: 'welcome.mail' }>;

export const renderWelcomeMail = (e: WelcomeMailEvent): MailContent => {
  const s = getMailStrings(e.locale).welcome;
  return {
    subject: s.subject(e.first_name),
    html: layout({
      locale: e.locale,
      preheader: s.preheader,
      body: `
        ${h1(s.h1(e.first_name))}
        ${p(s.body1)}
        ${p(s.body2)}
        ${divider()}
        ${pLast(s.sign_off)}
      `,
    }),
  };
};
