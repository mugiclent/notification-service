import type { Locale } from '../../types/events.js';

// ── Types ──────────────────────────────────────────────────────────────────────

type FooterStrings = {
  rights: string;
  received: string;
};

type CommonStrings = {
  sign_off: string;
  support_note: string;
  cta_fallback: string;
  footer: FooterStrings;
};

type OtpPurposeStrings = {
  subject: string;
  preheader: (min: number) => string;
  h1: string;
  body1: string;
  notice: string;
};

type OtpStrings = {
  purposes: Record<'password_reset' | '2fa', OtpPurposeStrings>;
  greeting: (name: string) => string;
  expiry: (min: number) => string;
};

type WelcomeStrings = {
  subject: (name: string) => string;
  preheader: string;
  h1: (name: string) => string;
  body1: string;
  body2: string;
  sign_off: string;
};

type InviteStrings = {
  subject: string;
  preheader: string;
  h1: string;
  greeting: (name: string) => string;
  body1: string;
  cta: string;
  expiry: (hrs: number) => string;
};

type OrgApprovedStrings = {
  subject: (org: string) => string;
  preheader: (org: string) => string;
  h1: string;
  body1: (org: string) => string;
  body2: string;
  cta: string;
  expiry: (hrs: number) => string;
};

type SecurityStrings = {
  login_new_device: {
    subject: string;
    preheader: string;
    h1: string;
    greeting: (name: string) => string;
    body1: (device?: string) => string;
    body2: string;
  };
  password_changed: {
    subject: string;
    preheader: string;
    h1: string;
    greeting: (name: string) => string;
    body1: string;
  };
  account_suspended: {
    subject: string;
    preheader: string;
    h1: string;
    greeting: (name: string) => string;
    body1: string;
    notice: string;
  };
  '2fa_enabled': {
    subject: string;
    preheader: string;
    h1: string;
    greeting: (name: string) => string;
    body1: string;
  };
  '2fa_disabled': {
    subject: string;
    preheader: string;
    h1: string;
    greeting: (name: string) => string;
    body1: string;
    body2: string;
  };
};

type OrgStrings = {
  suspended: {
    subject: (org: string) => string;
    preheader: (org: string) => string;
    h1: string;
    body1: (org: string) => string;
    notice: string;
  };
  rejected: {
    subject: (org: string) => string;
    preheader: (org: string) => string;
    h1: string;
    body1: (org: string) => string;
    reason_label: string;
    body2: string;
  };
  contact_otp: {
    subject: (org: string) => string;
    preheader: (min: number, org: string) => string;
    h1: string;
    greeting: (name: string) => string;
    body1: (org: string) => string;
    expiry: (min: number) => string;
  };
  contact_verified: {
    subject: (org: string) => string;
    preheader: (org: string) => string;
    h1: string;
    greeting: (name: string) => string;
    body1: (org: string) => string;
  };
  application_received: {
    subject: (org: string) => string;
    preheader: (org: string) => string;
    h1: string;
    body1: string;
    body2: (org: string, type: string, email: string) => string;
    notice: string;
  };
};

type MailLocaleStrings = {
  common: CommonStrings;
  otp: OtpStrings;
  welcome: WelcomeStrings;
  invite: InviteStrings;
  org_approved: OrgApprovedStrings;
  security: SecurityStrings;
  org: OrgStrings;
};

// ── Translations ───────────────────────────────────────────────────────────────

const translations: Record<Locale, MailLocaleStrings> = {

  // ── Kinyarwanda ─────────────────────────────────────────────────────────────
  rw: {
    common: {
      sign_off: 'Ikipe ya Katisha',
      support_note: 'Ku bindi bisobanuro, vugana na <a href="mailto:support@katisha.online" style="color:#0a0a0a;">serivisi yacu yo gufasha</a> vuba ukore konti yawe.',
      cta_fallback: 'Buto ntikora? Kopi na pasiti iyi link ku rubuga rwo gushakisha (nka Google Chrome):',
      footer: {
        rights: `Uburenganzira bwose bwubahirijwe`,
        received: 'Wabonye ubu butumwa kubera ibikorwa kuri konti yawe ya Katisha.',
      },
    },
    otp: {
      purposes: {
        password_reset: {
          subject: `Kode yo Guhindura ijambo ryawe ry'ibanga`,
          preheader: (min) => `Kode yawe y'iminota ${min} iri aha.`,
          h1: `Hindura ijambo ryawe ry'ibanga`,
          body1: "Twabonye ubusabe bwanyu bwo guhindura ijambo ry'ibanga rya konti yanyu ya Katisha. Koresha kode iri hasi — ntabwo igumaho igihe kinini.",
          notice: `Niba utasabye guhindura ijambo ry'ibanga, irengagize ubu butumwa. Ijambo ryawe ry'ibanga <strong>ntiryahindutse</strong>.`,
        },
        '2fa': {
          subject: 'Kode yo kwemeza kwinjira kwawe kuri Katisha',
          preheader: (min) => `Kode yawe y'iminota ${min} yo kwemeza kwinjira iri aha.`,
          h1: 'Emeza kwinjira kwawe',
          body1: 'Koresha kode iri hasi kugira ngo wemeze kwinjira kwawe kuri Katisha.',
          notice: 'Niba utasabye kwinjira, fata ingamba zo kurinda konti yawe vuba.',
        },
      },
      greeting: (name) => `Muraho ${name},`,
      expiry: (min) => `Kode irarangira mu minota <strong>${min}</strong>. Ntuyisangize undi muntu.`,
    },
    welcome: {
      subject: (name) => `Murakaza neza kuri Katisha, ${name}!`,
      preheader: 'Konti yawe yafunguwe — injira utangire.',
      h1: (name) => `Murakaza neza, ${name}!`,
      body1: 'Konti yawe ya Katisha yafunguwe. Ushobora kwinjira igihe cyose ugatangira gukoresha serivisi.',
      body2: 'Niba ufite ibibazo cyangwa ubonye ikibazo, itsinda ryacu riraguha ibisobanuro byose ukeneye.',
      sign_off: 'Murakaza neza kuri Katisha — Twishimiye gukorana namwe.',
    },
    invite: {
      subject: 'Watumiwe kuri Katisha',
      preheader: "Watumiwe! — emera ubutumire mbere y'uko bugera ku iherezo.",
      h1: 'Watumiwe kuri Katisha',
      greeting: (name) => `Muraho ${name},`,
      body1: 'Umuntu yagutumiye kujya kuri Katisha. Kanda buto iri hasi wemere ubutumire maze ukore konti yawe.',
      cta: 'Emera Ubutumire',
      expiry: (hrs) => `Ubutumire burarangira mu masaha <strong>${hrs}</strong>.`,
    },
    org_approved: {
      subject: (org) => `${org} yemejwe kuri Katisha`,
      preheader: (org) => `Amakuru meza — ${org} yemejwe kuri Katisha`,
      h1: 'Kompanyi yawe yemejwe!',
      body1: (org) => `Ikaze! <strong>${org}</strong> yasuzumwe yemezwa kuri Katisha.`,
      body2: 'Kanda buto iri hasi urangize gufunguza konti yawe utangire.',
      cta: 'Fungura Konti',
      expiry: (hrs) => `Iyi link irarangira mu masaha <strong>${hrs}</strong>.`,
    },
    security: {
      login_new_device: {
        subject: 'Kwinjira gushya kuri konti yawe ya Katisha',
        preheader: 'Kwinjira gushya kubonywe kuri konti yawe.',
        h1: 'Kwinjira gushya kubonywe',
        greeting: (name) => `Muraho ${name},`,
        body1: (device) => device
          ? `Konti yawe ya Katisha yinjiriwe ku gikoresho <strong>${device}</strong>.`
          : 'Konti yawe ya Katisha yinjiriwe ku gikoresho gishya.',
        body2: 'Niba ari wowe, nta kindi gikorwa gikenewe.',
      },
      password_changed: {
        subject: `Ijambo ry'ibanga rya konti yawe ya Katisha ryahindutse`,
        preheader: `Ijambo ryawe ry'ibanga ryahindutse — emeza ko ari wowe wabikoze.`,
        h1: `Ijambo ry'ibanga ryahindutse`,
        greeting: (name) => `Muraho ${name},`,
        body1: `Ijambo ry'ibanga rya konti yawe ya Katisha ryahindutse neza.`,
      },
      account_suspended: {
        subject: 'Konti yawe ya Katisha yahagaritswe',
        preheader: "Amakuru y'ingenzi yerekeye konti yawe ya Katisha.",
        h1: 'Konti yahagaritswe',
        greeting: (name) => `Muraho ${name},`,
        body1: 'Konti yawe ya Katisha yahagaritswe.',
        notice: `Vugana na <a href="mailto:support@katisha.online" style="color:#0a0a0a;">serivisi yacu y'ubufasha</a> ku bindi bisobanuro.`,
      },
      '2fa_enabled': {
        subject: 'Kwinjira ukoresheje ibimenyetso birenga kimwe byemejwe',
        preheader: 'Kwinjira ukoresheje ibimenyetso birenga kimwe byemejwe — konti yawe irinzwe neza.',
        h1: 'Kwinjira ukoresheje ibimenyetso birenga kimwe byemejwe',
        greeting: (name) => `Muraho ${name},`,
        body1: 'Kwinjira ukoresheje ibimenyetso birenga kimwe byemejwe kuri konti yawe ya Katisha. Konti yawe noneho irinzwe neza.',
      },
      '2fa_disabled': {
        subject: 'Kwinjira ukoresheje ibimenyetso birenga kimwe bivanyweho',
        preheader: 'Kwinjira ukoresheje ibimenyetso birenga kimwe bivanywe kuri konti yawe.',
        h1: 'Kwinjira ukoresheje ibimenyetso birenga kimwe bivanyweho',
        greeting: (name) => `Muraho ${name},`,
        body1: 'Kwinjira ukoresheje ibimenyetso birenga kimwe bivanyweho kuri konti yawe ya Katisha.',
        body2: 'Turagusaba kubishyiraho nanone kugirango konti yawe irindwe neza.',
      },
    },
    org: {
      suspended: {
        subject: (org) => `${org} yahagaritswe kuri Katisha`,
        preheader: (org) => `Itangazo ry'ingenzi ryerekeye ${org}.`,
        h1: 'Kompanyi yahagaritswe',
        body1: (org) => `Kompanyi yawe <strong>${org}</strong> yahagaritswe kuri Katisha.`,
        notice: `Vugana na <a href="mailto:support@katisha.online" style="color:#0a0a0a;">serivisi y'ubufasha</a> ku bindi bisobanuro.`,
      },
      rejected: {
        subject: (org) => `Ubusabe bwa ${org} ntabwo bwemejwe`,
        preheader: (org) => `Twasuzumye ubusabe bwa ${org}.`,
        h1: 'Ubusabe ntabwo bwemejwe',
        body1: (org) => `Ubusabe bwa <strong>${org}</strong> ntabwo bwemejwe.`,
        reason_label: 'Impamvu:',
        body2: `Niba ufite ibibazo, vugana na serivisi yacu y'ubufasha kuri <a href="mailto:support@katisha.online" style="color:#0a0a0a;">support@katisha.online</a>.`,
      },
      contact_otp: {
        subject: (org) => `Emeza imeli ya ${org}`,
        preheader: (min, org) => `Kode yawe y'iminota ${min} ya ${org} iri aha.`,
        h1: 'Emeza imeli yawe',
        greeting: (name) => `Muraho ${name},`,
        body1: (org) => `Koresha kode iri hasi kugira ngo wemeze aderesi ya imeli ya <strong>${org}</strong>.`,
        expiry: (min) => `Kode irarangira mu minota <strong>${min}</strong>. Ntuyisangize undi muntu.`,
      },
      contact_verified: {
        subject: (org) => `Imeli ya ${org} yemejwe`,
        preheader: (org) => `Imeli ya ${org} yemejwe.`,
        h1: 'Imeli yemejwe',
        greeting: (name) => `Muraho ${name},`,
        body1: (org) => `Imeli ya <strong>${org}</strong> yemejwe neza.`,
      },
      application_received: {
        subject: (org) => `Twakiriye ubusabe bwa ${org}`,
        preheader: (org) => `Ubusabe bwanyu bwa ${org} buri gusuzumwa.`,
        h1: 'Ubusabe twabwakiriye',
        body1: 'Murakoze gutanga ubusabe bwo gukoresha urubuga rwa Katisha.',
        body2: (org, type, email) => `Twabonye ubusabe bwa <strong>${org}</strong> (${type}). Itsinda ryacu rirasuzuma ubu busabe kandi rizasubiza kuri <strong>${email}</strong> bitarenze itatu y'akazi.`,
        notice: 'Nta kindi musabwa gukora. Turabasubiza vuba.',
      },
    },
  },

  // ── English ──────────────────────────────────────────────────────────────────
  en: {
    common: {
      sign_off: 'The Katisha Team',
      support_note: 'If you did not make this change, contact our <a href="mailto:support@katisha.online" style="color:#0a0a0a;">support team</a> immediately and secure your account.',
      cta_fallback: "Can't click the button? Copy and paste this link into your browser:",
      footer: {
        rights: 'All rights reserved',
        received: 'You received this email because of activity on your Katisha account.',
      },
    },
    otp: {
      purposes: {
        password_reset: {
          subject: 'Your Katisha password reset code',
          preheader: (min) => `Your ${min}-minute verification code is inside.`,
          h1: 'Reset your password',
          body1: "We received a request to reset your Katisha password. Use the code below — it's only valid for a short window.",
          notice: "If you didn't request a password reset, you can safely ignore this email. Your password has <strong>not</strong> been changed.",
        },
        '2fa': {
          subject: 'Your Katisha sign-in verification code',
          preheader: (min) => `Your ${min}-minute sign-in code is inside.`,
          h1: 'Verify your sign-in',
          body1: 'Use the code below to verify your sign-in to Katisha.',
          notice: "If you didn't request this, secure your account immediately.",
        },
      },
      greeting: (name) => `Hi ${name},`,
      expiry: (min) => `This code expires in <strong>${min} minute${min !== 1 ? 's' : ''}</strong>. Do not share it with anyone.`,
    },
    welcome: {
      subject: (name) => `Welcome to Katisha, ${name}!`,
      preheader: 'Your account is ready — sign in and get started.',
      h1: (name) => `Welcome aboard, ${name}!`,
      body1: 'Your Katisha account is set up and ready to go. You can sign in at any time and start using the platform right away.',
      body2: 'If you have any questions or run into anything unexpected, our support team is always here to help.',
      sign_off: "Welcome to Katisha — we're glad you're here.",
    },
    invite: {
      subject: "You've been invited to Katisha",
      preheader: "You've been invited — accept before your invitation expires.",
      h1: "You're invited to Katisha",
      greeting: (name) => `Hi ${name},`,
      body1: 'Someone has invited you to join Katisha. Click the button below to accept your invitation and set up your account.',
      cta: 'Accept Invitation',
      expiry: (hrs) => `This invitation expires in <strong>${hrs} hour${hrs !== 1 ? 's' : ''}</strong>.`,
    },
    org_approved: {
      subject: (org) => `${org} has been approved on Katisha`,
      preheader: (org) => `Great news — ${org} is approved and ready to set up.`,
      h1: 'Your organisation is approved!',
      body1: (org) => `Congratulations! <strong>${org}</strong> has been reviewed and approved on Katisha.`,
      body2: 'Click the button below to finish setting up your organisation profile and get started.',
      cta: 'Set Up Organisation',
      expiry: (hrs) => `This link expires in <strong>${hrs} hour${hrs !== 1 ? 's' : ''}</strong>.`,
    },
    security: {
      login_new_device: {
        subject: 'New sign-in to your Katisha account',
        preheader: 'A new sign-in was detected on your account.',
        h1: 'New sign-in detected',
        greeting: (name) => `Hi ${name},`,
        body1: (device) => device
          ? `Your Katisha account was signed in to from <strong>${device}</strong>.`
          : 'Your Katisha account was signed in to from a new device.',
        body2: 'If this was you, no action is needed.',
      },
      password_changed: {
        subject: 'Your Katisha password was changed',
        preheader: 'Your password was just updated — confirm it was you.',
        h1: 'Password changed',
        greeting: (name) => `Hi ${name},`,
        body1: 'Your Katisha password was successfully changed.',
      },
      account_suspended: {
        subject: 'Your Katisha account has been suspended',
        preheader: 'Important information about your Katisha account.',
        h1: 'Account suspended',
        greeting: (name) => `Hi ${name},`,
        body1: 'Your Katisha account has been suspended.',
        notice: 'Please contact our <a href="mailto:support@katisha.online" style="color:#0a0a0a;">support team</a> for more information and to resolve this matter.',
      },
      '2fa_enabled': {
        subject: 'Two-factor authentication enabled',
        preheader: '2FA is now active — your account is more secure.',
        h1: '2FA enabled',
        greeting: (name) => `Hi ${name},`,
        body1: 'Two-factor authentication has been enabled on your Katisha account. Your account is now better protected.',
      },
      '2fa_disabled': {
        subject: 'Two-factor authentication disabled',
        preheader: '2FA has been turned off on your account.',
        h1: '2FA disabled',
        greeting: (name) => `Hi ${name},`,
        body1: 'Two-factor authentication has been disabled on your Katisha account.',
        body2: 'We strongly recommend re-enabling it to keep your account secure.',
      },
    },
    org: {
      suspended: {
        subject: (org) => `${org} has been suspended on Katisha`,
        preheader: (org) => `Important notice about ${org}.`,
        h1: 'Organisation suspended',
        body1: (org) => `Your organisation <strong>${org}</strong> has been suspended on Katisha.`,
        notice: 'Please contact our <a href="mailto:support@katisha.online" style="color:#0a0a0a;">support team</a> for more information and to resolve this matter.',
      },
      rejected: {
        subject: (org) => `Application for ${org} was not approved`,
        preheader: (org) => `We reviewed the application for ${org}.`,
        h1: 'Application not approved',
        body1: (org) => `We regret to inform you that the application for <strong>${org}</strong> was not approved at this time.`,
        reason_label: 'Reason:',
        body2: 'If you have questions or would like to appeal this decision, please contact our support team at <a href="mailto:support@katisha.online" style="color:#0a0a0a;">support@katisha.online</a>.',
      },
      contact_otp: {
        subject: (org) => `Verify your contact email for ${org}`,
        preheader: (min, org) => `Your ${min}-minute verification code for ${org} is inside.`,
        h1: 'Verify your email',
        greeting: (name) => `Hi ${name},`,
        body1: (org) => `Use the code below to verify the contact email address for <strong>${org}</strong>.`,
        expiry: (min) => `This code expires in <strong>${min} minute${min !== 1 ? 's' : ''}</strong>. Do not share it with anyone.`,
      },
      contact_verified: {
        subject: (org) => `Contact email verified for ${org}`,
        preheader: (org) => `The contact email for ${org} has been verified.`,
        h1: 'Email verified',
        greeting: (name) => `Hi ${name},`,
        body1: (org) => `The contact email for <strong>${org}</strong> has been successfully verified.`,
      },
      application_received: {
        subject: (org) => `We've received the application for ${org}`,
        preheader: (org) => `Your application for ${org} is under review.`,
        h1: 'Application received',
        body1: 'Thank you for applying to join Katisha.',
        body2: (org, type, email) => `We've received the application for <strong>${org}</strong> (${type}). Our team will review it and respond to <strong>${email}</strong> within 1–3 business days.`,
        notice: "You don't need to do anything else right now. We'll be in touch soon.",
      },
    },
  },

  // ── French ───────────────────────────────────────────────────────────────────
  fr: {
    common: {
      sign_off: "L'équipe Katisha",
      support_note: "Si vous n'êtes pas à l'origine de cette action, contactez immédiatement notre <a href=\"mailto:support@katisha.online\" style=\"color:#0a0a0a;\">équipe d'assistance</a> et sécurisez votre compte.",
      cta_fallback: 'Impossible de cliquer sur le bouton ? Copiez et collez ce lien dans votre navigateur :',
      footer: {
        rights: 'Tous droits réservés',
        received: 'Vous avez reçu cet e-mail en raison d\'une activité sur votre compte Katisha.',
      },
    },
    otp: {
      purposes: {
        password_reset: {
          subject: 'Votre code de réinitialisation de mot de passe Katisha',
          preheader: (min) => `Votre code de vérification valable ${min} minute${min !== 1 ? 's' : ''} est à l'intérieur.`,
          h1: 'Réinitialisez votre mot de passe',
          body1: "Nous avons reçu une demande de réinitialisation de votre mot de passe Katisha. Utilisez le code ci-dessous — il n'est valide que pour une courte durée.",
          notice: "Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet e-mail. Votre mot de passe <strong>n'a pas</strong> été modifié.",
        },
        '2fa': {
          subject: 'Votre code de vérification de connexion Katisha',
          preheader: (min) => `Votre code de connexion valable ${min} minute${min !== 1 ? 's' : ''} est à l'intérieur.`,
          h1: 'Vérifiez votre connexion',
          body1: 'Utilisez le code ci-dessous pour vérifier votre connexion à Katisha.',
          notice: "Si vous n'êtes pas à l'origine de cette demande, sécurisez votre compte immédiatement.",
        },
      },
      greeting: (name) => `Bonjour ${name},`,
      expiry: (min) => `Ce code expire dans <strong>${min} minute${min !== 1 ? 's' : ''}</strong>. Ne le partagez avec personne.`,
    },
    welcome: {
      subject: (name) => `Bienvenue sur Katisha, ${name} !`,
      preheader: 'Votre compte est prêt — connectez-vous et commencez.',
      h1: (name) => `Bienvenue, ${name} !`,
      body1: 'Votre compte Katisha est configuré et prêt. Vous pouvez vous connecter à tout moment et commencer à utiliser la plateforme.',
      body2: "Si vous avez des questions ou rencontrez un problème inattendu, notre équipe d'assistance est toujours disponible.",
      sign_off: 'Bienvenue sur Katisha — nous sommes ravis de vous avoir parmi nous.',
    },
    invite: {
      subject: 'Vous avez été invité(e) sur Katisha',
      preheader: "Vous avez été invité(e) — acceptez avant l'expiration de votre invitation.",
      h1: 'Vous êtes invité(e) sur Katisha',
      greeting: (name) => `Bonjour ${name},`,
      body1: "Quelqu'un vous a invité(e) à rejoindre Katisha. Cliquez sur le bouton ci-dessous pour accepter votre invitation et configurer votre compte.",
      cta: "Accepter l'invitation",
      expiry: (hrs) => `Cette invitation expire dans <strong>${hrs} heure${hrs !== 1 ? 's' : ''}</strong>.`,
    },
    org_approved: {
      subject: (org) => `${org} a été approuvé(e) sur Katisha`,
      preheader: (org) => `Bonne nouvelle — ${org} est approuvé(e) et prêt(e) à être configuré(e).`,
      h1: 'Votre organisation est approuvée !',
      body1: (org) => `Félicitations ! <strong>${org}</strong> a été examiné(e) et approuvé(e) sur Katisha.`,
      body2: "Cliquez sur le bouton ci-dessous pour terminer la configuration de votre organisation.",
      cta: "Configurer l'organisation",
      expiry: (hrs) => `Ce lien expire dans <strong>${hrs} heure${hrs !== 1 ? 's' : ''}</strong>.`,
    },
    security: {
      login_new_device: {
        subject: 'Nouvelle connexion à votre compte Katisha',
        preheader: 'Une nouvelle connexion a été détectée sur votre compte.',
        h1: 'Nouvelle connexion détectée',
        greeting: (name) => `Bonjour ${name},`,
        body1: (device) => device
          ? `Votre compte Katisha a été connecté depuis <strong>${device}</strong>.`
          : 'Votre compte Katisha a été connecté depuis un nouvel appareil.',
        body2: "Si c'était vous, aucune action n'est nécessaire.",
      },
      password_changed: {
        subject: 'Votre mot de passe Katisha a été modifié',
        preheader: "Votre mot de passe vient d'être mis à jour — confirmez que c'était vous.",
        h1: 'Mot de passe modifié',
        greeting: (name) => `Bonjour ${name},`,
        body1: 'Votre mot de passe Katisha a été modifié avec succès.',
      },
      account_suspended: {
        subject: 'Votre compte Katisha a été suspendu',
        preheader: 'Information importante concernant votre compte Katisha.',
        h1: 'Compte suspendu',
        greeting: (name) => `Bonjour ${name},`,
        body1: 'Votre compte Katisha a été suspendu.',
        notice: "Veuillez contacter notre <a href=\"mailto:support@katisha.online\" style=\"color:#0a0a0a;\">équipe d'assistance</a> pour plus d'informations et résoudre ce problème.",
      },
      '2fa_enabled': {
        subject: 'Authentification à deux facteurs activée',
        preheader: 'La 2FA est maintenant active — votre compte est mieux protégé.',
        h1: '2FA activée',
        greeting: (name) => `Bonjour ${name},`,
        body1: "L'authentification à deux facteurs a été activée sur votre compte Katisha. Votre compte est maintenant mieux protégé.",
      },
      '2fa_disabled': {
        subject: 'Authentification à deux facteurs désactivée',
        preheader: 'La 2FA a été désactivée sur votre compte.',
        h1: '2FA désactivée',
        greeting: (name) => `Bonjour ${name},`,
        body1: "L'authentification à deux facteurs a été désactivée sur votre compte Katisha.",
        body2: 'Nous vous recommandons vivement de la réactiver pour sécuriser votre compte.',
      },
    },
    org: {
      suspended: {
        subject: (org) => `${org} a été suspendu(e) sur Katisha`,
        preheader: (org) => `Avis important concernant ${org}.`,
        h1: 'Organisation suspendue',
        body1: (org) => `Votre organisation <strong>${org}</strong> a été suspendue sur Katisha.`,
        notice: "Veuillez contacter notre <a href=\"mailto:support@katisha.online\" style=\"color:#0a0a0a;\">équipe d'assistance</a> pour plus d'informations.",
      },
      rejected: {
        subject: (org) => `La candidature de ${org} n'a pas été approuvée`,
        preheader: (org) => `Nous avons examiné la candidature de ${org}.`,
        h1: 'Candidature non approuvée',
        body1: (org) => `Nous regrettons de vous informer que la candidature de <strong>${org}</strong> n'a pas été approuvée pour le moment.`,
        reason_label: 'Motif :',
        body2: "Si vous avez des questions ou souhaitez contester cette décision, contactez notre équipe à <a href=\"mailto:support@katisha.online\" style=\"color:#0a0a0a;\">support@katisha.online</a>.",
      },
      contact_otp: {
        subject: (org) => `Vérifiez l'adresse e-mail de contact de ${org}`,
        preheader: (min, org) => `Votre code de vérification de ${min} minute${min !== 1 ? 's' : ''} pour ${org} est à l'intérieur.`,
        h1: 'Vérifiez votre adresse e-mail',
        greeting: (name) => `Bonjour ${name},`,
        body1: (org) => `Utilisez le code ci-dessous pour vérifier l'adresse e-mail de contact de <strong>${org}</strong>.`,
        expiry: (min) => `Ce code expire dans <strong>${min} minute${min !== 1 ? 's' : ''}</strong>. Ne le partagez avec personne.`,
      },
      contact_verified: {
        subject: (org) => `Adresse e-mail de contact vérifiée pour ${org}`,
        preheader: (org) => `L'adresse e-mail de contact de ${org} a été vérifiée.`,
        h1: 'Adresse e-mail vérifiée',
        greeting: (name) => `Bonjour ${name},`,
        body1: (org) => `L'adresse e-mail de contact de <strong>${org}</strong> a été vérifiée avec succès.`,
      },
      application_received: {
        subject: (org) => `Nous avons reçu la candidature de ${org}`,
        preheader: (org) => `Votre candidature pour ${org} est en cours d'examen.`,
        h1: 'Candidature reçue',
        body1: 'Merci de soumettre votre candidature pour rejoindre Katisha.',
        body2: (org, type, email) => `Nous avons reçu la candidature de <strong>${org}</strong> (${type}). Notre équipe l'examinera et répondra à <strong>${email}</strong> sous 1 à 3 jours ouvrables.`,
        notice: "Vous n'avez rien d'autre à faire pour le moment. Nous vous contacterons bientôt.",
      },
    },
  },
};

export const getMailStrings = (locale?: Locale): MailLocaleStrings =>
  translations[locale ?? 'rw'];
