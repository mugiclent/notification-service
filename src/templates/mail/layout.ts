import { config } from '../../config/index.js';
import { getMailStrings } from './i18n.js';
import type { Locale } from '../../types/events.js';

export type MailContent = { subject: string; html: string };

const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
const DARK  = `#0a0a0a`;
const BODY_TEXT  = `#3d3d3d`;
const MUTED = `#737373`;
const BORDER = `#e5e5e5`;
const PAGE_BG = `#f0f0ef`;

const LOGO_URL = config.mail.logoUrl;

// ── Reusable blocks ────────────────────────────────────────────────────────────

/** Black CTA button — renders correctly in Outlook via VML */
export const ctaButton = (href: string, label: string): string => `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px 0;">
  <tr>
    <td align="center" style="border-radius:8px;background-color:${DARK};">
      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        href="${href}" style="height:52px;v-text-anchor:middle;width:220px;"
        arcsize="15%" stroke="f" fillcolor="${DARK}">
        <w:anchorlock/>
        <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:600;">${label}</center>
      </v:roundrect><![endif]-->
      <!--[if !mso]><!-->
      <a href="${href}" target="_blank"
         style="background-color:${DARK};border-radius:8px;color:#ffffff;display:inline-block;
                font-family:${FONT};font-size:16px;font-weight:600;line-height:1;
                padding:16px 36px;text-align:center;text-decoration:none;
                -webkit-text-size-adjust:none;">
        ${label}
      </a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;

/** Monospaced OTP / verification code block */
export const codeBlock = (code: string): string => `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%"
       style="margin:28px 0;background-color:#f5f5f5;border-radius:10px;border:1px solid ${BORDER};">
  <tr>
    <td style="padding:28px;text-align:center;">
      <span style="font-family:'Courier New',Courier,monospace;font-size:44px;font-weight:800;
                   letter-spacing:14px;color:${DARK};display:block;line-height:1;">
        ${code}
      </span>
    </td>
  </tr>
</table>`;

/** Subtle notice box — for security / warning callouts */
export const noticeBox = (text: string): string => `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%"
       style="margin:24px 0;border-radius:8px;background-color:#fafafa;border-left:3px solid ${DARK};">
  <tr>
    <td style="padding:14px 18px;font-family:${FONT};font-size:14px;line-height:1.6;color:#525252;">
      ${text}
    </td>
  </tr>
</table>`;

/** Horizontal rule */
export const divider = (): string => `
<table role="presentation" cellpadding="0" cellspacing="0" width="100%"
       style="margin:28px 0;">
  <tr>
    <td style="border-top:1px solid ${BORDER};font-size:0;line-height:0;">&nbsp;</td>
  </tr>
</table>`;

// ── Main layout wrapper ────────────────────────────────────────────────────────

export const layout = (opts: {
  preheader: string;
  body: string;
  locale?: Locale;
}): string => {
  const year = new Date().getFullYear();
  const { footer } = getMailStrings(opts.locale).common;
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml"
                xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no" />
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width:600px) {
      .card    { border-radius:0 !important; }
      .content { padding:32px 24px !important; }
      .footer  { padding:24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;width:100%;word-break:break-word;
             -webkit-font-smoothing:antialiased;background-color:${PAGE_BG};">

  <!-- Preheader: shows in inbox preview, hidden in email body -->
  <div aria-hidden="true"
       style="display:none;font-size:1px;line-height:1px;
              max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${opts.preheader}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
         style="background-color:${PAGE_BG};">
    <tr>
      <td align="center" style="padding:48px 20px;">

        <table role="presentation" class="card" cellpadding="0" cellspacing="0" width="560"
               style="max-width:560px;width:100%;background-color:#ffffff;border-radius:16px;
                      overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.09);">

          <!-- ── Header ─────────────────────────────────────────────────────── -->
          <tr>
            <td style="background-color:${DARK};padding:32px 48px;text-align:center;">
              <img src="${LOGO_URL}" alt="Katisha" width="130" height="auto"
                   style="border:0;display:block;height:auto;margin:0 auto;
                          max-width:130px;-ms-interpolation-mode:bicubic;" />
            </td>
          </tr>

          <!-- ── Content ────────────────────────────────────────────────────── -->
          <tr>
            <td class="content"
                style="padding:48px 48px 40px;font-family:${FONT};
                       font-size:16px;line-height:1.7;color:${BODY_TEXT};">
              ${opts.body}
            </td>
          </tr>

          <!-- ── Footer ─────────────────────────────────────────────────────── -->
          <tr>
            <td class="footer"
                style="background-color:#fafafa;border-top:1px solid ${BORDER};
                       padding:28px 48px;text-align:center;font-family:${FONT};">
              <p style="margin:0 0 6px;font-size:12px;color:${MUTED};">
                &copy; ${year} Katisha &middot; ${footer.rights}
              </p>
              <p style="margin:0;font-size:12px;color:#a3a3a3;">
                ${footer.received}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

// ── Convenience shorthands for template body HTML ─────────────────────────────

export const h1 = (text: string): string =>
  `<h1 style="margin:0 0 20px;font-size:26px;font-weight:700;line-height:1.3;
              color:#0a0a0a;letter-spacing:-0.4px;font-family:${FONT};">
    ${text}
  </h1>`;

export const p = (text: string, extra = ''): string =>
  `<p style="margin:0 0 16px;font-size:16px;line-height:1.7;
             color:${BODY_TEXT};font-family:${FONT};${extra}">
    ${text}
  </p>`;

export const pLast = (text: string): string => p(text, 'margin-bottom:0;');
