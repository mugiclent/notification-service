import type { Locale } from '../../types/events.js';

// ── Types ──────────────────────────────────────────────────────────────────────

type OtpSmsStrings = {
  purposes: Record<'phone_verification' | '2fa' | 'password_reset', string>;
  template: (purpose: string, code: string, min: number) => string;
};

type SmsLocaleStrings = {
  otp: OtpSmsStrings;
  welcome: (name: string) => string;
  invite: (name: string, link: string, hrs: number) => string;
  org_approved: (org: string, link: string, hrs: number) => string;
  security: {
    login_new_device: (name: string, device?: string) => string;
    password_changed: (name: string) => string;
    all_sessions_revoked: (name: string) => string;
    account_suspended: (name: string) => string;
    '2fa_enabled': (name: string) => string;
    '2fa_disabled': (name: string) => string;
  };
  org: {
    suspended: (org: string) => string;
    rejected: (org: string, reason?: string) => string;
    cooperative_approved: (org: string) => string;
    contact_verified: (org: string) => string;
  };
};

// ── Translations ───────────────────────────────────────────────────────────────

const translations: Record<Locale, SmsLocaleStrings> = {

  // ── Kinyarwanda ─────────────────────────────────────────────────────────────
  rw: {
    otp: {
      purposes: {
        phone_verification: 'emeza nimero yawe ya telefoni',
        '2fa': 'emeza kwinjira kwawe',
        password_reset: 'subiramo ijambo ryawe banga',
      },
      template: (purpose, code, min) =>
        `Kode yawe ya Katisha yo ${purpose} ni: ${code}. Ikora mu minota ${min}. Ntuyisangire n'umuntu.`,
    },
    welcome: (name) =>
      `Murakaza neza kuri Katisha, ${name}! Konti yawe iteguye. Injira ubu utangire gukoresha serivisi.`,
    invite: (name, link, hrs) =>
      `Muraho ${name}, watumiwe kujya kuri Katisha. Emera ubutumwe bwawe hano: ${link} (burangira mu masaha ${hrs}).`,
    org_approved: (org, link, hrs) =>
      `Amakuru meza! ${org} yemejwe kuri Katisha. Shyiraho umuryango wawe hano: ${link} (irangira mu masaha ${hrs}).`,
    security: {
      login_new_device: (name, device) =>
        `Muraho ${name}, konti yawe ya Katisha yinjiriwe uhereye ${device ? `ku ${device}` : 'ku gikoresho gishya'}. Niba ari wewe, nta gikozwe kirakenewe. Niba atari wewe, kora konti yawe vuba.`,
      password_changed: (name) =>
        `Muraho ${name}, ijambo banga rya Katisha yawe ryahindutse. Niba utabikoze, vugana na serivisi yo gufasha vuba.`,
      all_sessions_revoked: (name) =>
        `Muraho ${name}, ibikorwa byose bya Katisha byawe birangiye. Injira nanone ukomeze.`,
      account_suspended: (name) =>
        `Muraho ${name}, konti yawe ya Katisha yahagaritswe. Vugana na serivisi yo gufasha kugira amakuru.`,
      '2fa_enabled': (name) =>
        `Muraho ${name}, kwinjira kabiri bishyizweho kuri konti yawe ya Katisha.`,
      '2fa_disabled': (name) =>
        `Muraho ${name}, kwinjira kabiri bivanywemo kuri konti yawe ya Katisha. Bisubizemo kugira konti yawe irindwaho.`,
    },
    org: {
      suspended: (org) =>
        `Umuryango wawe ${org} wahagaritswe kuri Katisha. Vugana na serivisi yo gufasha kugira amakuru.`,
      rejected: (org, reason) =>
        `Umuryango wawe ${org} ntabwo wemejwe kuri Katisha${reason ? `: ${reason}` : ''}. Vugana na serivisi yo gufasha niba ufite ibibazo.`,
      cooperative_approved: (org) =>
        `Amakuru meza! ${org} yemejwe nk'ikoperative kuri Katisha. Injira utangire.`,
      contact_verified: (org) =>
        `Umuntu wa ${org} yemejwe kuri Katisha.`,
    },
  },

  // ── English ──────────────────────────────────────────────────────────────────
  en: {
    otp: {
      purposes: {
        phone_verification: 'verify your phone number',
        '2fa': 'confirm your sign-in',
        password_reset: 'reset your password',
      },
      template: (purpose, code, min) =>
        `Your Katisha code to ${purpose} is: ${code}. Valid for ${min} min. Do not share this code.`,
    },
    welcome: (name) =>
      `Welcome to Katisha, ${name}! Your account is ready. Sign in now to get started.`,
    invite: (name, link, hrs) =>
      `Hi ${name}, you've been invited to join Katisha. Accept your invitation here: ${link} (expires in ${hrs}h).`,
    org_approved: (org, link, hrs) =>
      `Congratulations! ${org} has been approved on Katisha. Set up your organisation here: ${link} (expires in ${hrs}h).`,
    security: {
      login_new_device: (name, device) =>
        `Hi ${name}, your Katisha account was accessed from ${device ? `${device}` : 'a new device'}. If this wasn't you, secure your account immediately.`,
      password_changed: (name) =>
        `Hi ${name}, your Katisha password was changed. If you didn't do this, contact support immediately.`,
      all_sessions_revoked: (name) =>
        `Hi ${name}, all active sessions on your Katisha account have been ended. Sign in again to continue.`,
      account_suspended: (name) =>
        `Hi ${name}, your Katisha account has been suspended. Contact support for assistance.`,
      '2fa_enabled': (name) =>
        `Hi ${name}, two-factor authentication has been enabled on your Katisha account.`,
      '2fa_disabled': (name) =>
        `Hi ${name}, two-factor authentication has been disabled on your Katisha account. Re-enable it to keep your account secure.`,
    },
    org: {
      suspended: (org) =>
        `Your organisation ${org} has been suspended on Katisha. Contact support for more information.`,
      rejected: (org, reason) =>
        `Your organisation ${org} was not approved on Katisha${reason ? `: ${reason}` : ''}. Contact support if you have questions.`,
      cooperative_approved: (org) =>
        `Great news! ${org} has been approved as a cooperative on Katisha. Log in to get started.`,
      contact_verified: (org) =>
        `The contact for ${org} has been verified on Katisha.`,
    },
  },

  // ── French ───────────────────────────────────────────────────────────────────
  fr: {
    otp: {
      purposes: {
        phone_verification: 'vérifier votre numéro de téléphone',
        '2fa': 'confirmer votre connexion',
        password_reset: 'réinitialiser votre mot de passe',
      },
      template: (purpose, code, min) =>
        `Votre code Katisha pour ${purpose} est : ${code}. Valable ${min} min. Ne partagez pas ce code.`,
    },
    welcome: (name) =>
      `Bienvenue sur Katisha, ${name} ! Votre compte est prêt. Connectez-vous maintenant pour commencer.`,
    invite: (name, link, hrs) =>
      `Bonjour ${name}, vous avez été invité(e) à rejoindre Katisha. Acceptez votre invitation ici : ${link} (expire dans ${hrs}h).`,
    org_approved: (org, link, hrs) =>
      `Félicitations ! ${org} a été approuvé(e) sur Katisha. Configurez votre organisation ici : ${link} (expire dans ${hrs}h).`,
    security: {
      login_new_device: (name, device) =>
        `Bonjour ${name}, votre compte Katisha a été accédé depuis ${device ? device : 'un nouvel appareil'}. Si ce n'était pas vous, sécurisez votre compte immédiatement.`,
      password_changed: (name) =>
        `Bonjour ${name}, votre mot de passe Katisha a été modifié. Si vous n'êtes pas à l'origine de cette action, contactez le support immédiatement.`,
      all_sessions_revoked: (name) =>
        `Bonjour ${name}, toutes les sessions actives de votre compte Katisha ont été terminées. Reconnectez-vous pour continuer.`,
      account_suspended: (name) =>
        `Bonjour ${name}, votre compte Katisha a été suspendu. Contactez le support pour obtenir de l'aide.`,
      '2fa_enabled': (name) =>
        `Bonjour ${name}, l'authentification à deux facteurs a été activée sur votre compte Katisha.`,
      '2fa_disabled': (name) =>
        `Bonjour ${name}, l'authentification à deux facteurs a été désactivée sur votre compte Katisha. Réactivez-la pour sécuriser votre compte.`,
    },
    org: {
      suspended: (org) =>
        `Votre organisation ${org} a été suspendue sur Katisha. Contactez le support pour plus d'informations.`,
      rejected: (org, reason) =>
        `Votre organisation ${org} n'a pas été approuvée sur Katisha${reason ? ` : ${reason}` : ''}. Contactez le support si vous avez des questions.`,
      cooperative_approved: (org) =>
        `Bonne nouvelle ! ${org} a été approuvée en tant que coopérative sur Katisha. Connectez-vous pour commencer.`,
      contact_verified: (org) =>
        `Le contact de ${org} a été vérifié sur Katisha.`,
    },
  },
};

export const getSmsStrings = (locale?: Locale): SmsLocaleStrings =>
  translations[locale ?? 'rw'];
