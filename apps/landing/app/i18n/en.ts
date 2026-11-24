/**
 * Landing catalog, `en` = source of truth. `es.ts` is typed against this shape.
 * Copy that describes products must only say what each product does: no stats,
 * prices, customer counts or testimonials.
 */
export const landing = {
  meta: {
    siteName: '17Suit',
    homeTitle: '17Suit | One account for all your apps',
    homeDescription:
      'Review your spending, book a court and, soon, plan trips, organize your closet and book your haircut with a single 17Suit account.',
    notFoundTitle: 'Product not found | 17Suit',
    contactTitle: 'Contact | 17Suit',
    contactDescription:
      'Write to us if you have questions about your 17Suit account or any of its apps.',
    privacyTitle: 'Privacy policy | 17Suit',
    privacyDescription: '17Suit privacy policy. Document under review.',
    termsTitle: 'Terms and conditions | 17Suit',
    termsDescription: '17Suit terms and conditions of use. Document under review.',
    appsTitle: 'Choose your app | 17Suit',
    appsDescription: 'Open any 17Suit app with your account.',
  },
  nav: {
    logoAlt: '17Suit, home',
    logoAltFooter: '17Suit',
    account: 'Account',
    signIn: 'Sign in',
    myApps: 'My apps',
    signOut: 'Sign out',
    home: 'Home',
    products: 'Products',
    legal: 'Legal and contact',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
  },
  footer: {
    tagline: 'One account for all 17Suit apps.',
    rights: '© 2026 17Suit',
  },
  status: {
    live: 'Available',
    beta: 'Available · beta',
    soon: 'Coming soon',
  },
  home: {
    heroTitle: 'One app for every to-do. One account for all of them.',
    heroBody:
      'Review your spending with Fifteen and book a court with Seven. Soon you will also plan trips, organize your closet and book your haircut. You sign in once and carry on in any 17Suit app.',
    createAccount: 'Create account',
    openMyApps: 'Open my apps',
    seeProducts: 'See products',
    productsTitle: 'Products',
    productsIntro:
      'Each number is an app, with an English name that says what it is for. {{available}} available today and {{upcoming}} on the way.',
    tryInApp: 'Try in the app',
    seeDetails: 'See details',
    benefitsTitle: 'With a single account:',
    benefits: [
      'You sign in once and open any 17Suit app',
      'You return to the app you came from',
      'You recover your password with a code sent to your email',
    ],
    ctaTitle: 'Start with one account',
    ctaBody: 'It is the same one for every 17Suit app.',
    haveAccount: 'I already have an account',
  },
  mocks: {
    sample: 'Sample view with fictional data.',
    heroFifteen: 'Fifteen: transactions to review. Fictional data.',
    heroSeven: 'Seven: open court slots. Fictional data.',
    fifteen: {
      title: 'To review',
      count: '{{count}} transactions',
      confirm: 'Confirm',
      movements: [
        {
          sender: 'Andean Bank',
          detail: 'Purchase at Café Lumbre',
          amount: '−$245.00',
          category: 'Food',
        },
        {
          sender: 'EasyPay',
          detail: 'Musicbox subscription',
          amount: '−$129.00',
          category: 'Subscriptions',
        },
        {
          sender: 'Andean Bank',
          detail: 'Transfer received',
          amount: '+$3,200.00',
          category: 'Income',
        },
      ],
    },
    seven: {
      venue: 'Los Álamos Sports Complex',
      court: 'Court 2 · 7-a-side football',
      slotLength: '1 h slots',
      days: ['Fri', 'Sat', 'Sun'],
      selected: 'Saturday 14 · 10:00',
      book: 'Book',
    },
    concept: {
      badge: 'Idea in development',
      caption: 'Sketch of an idea in development. The final app may look different.',
      trip: {
        title: 'Itinerary',
        days: [
          { day: 'Day 1', items: ['Outbound flight', 'Hotel'] },
          { day: 'Day 2', items: ['Museum', 'Booked dinner'] },
          { day: 'Day 3', items: ['Beach', 'Return flight'] },
        ],
        shared: 'Shared plan',
      },
      closet: {
        title: 'Your closet',
        garments: ['Shirt', 'Trousers', 'Jacket', 'Dress', 'Shoes', 'Scarf'],
        look: 'Look for work',
        save: 'Save look',
      },
      barber: {
        title: "Today's schedule",
        barbers: ['Barber 1', 'Barber 2'],
        cut: 'Haircut',
        beard: 'Beard',
        free: 'Free',
        regular: 'Regular client',
        reminder: 'Reminder',
      },
    },
  },
  product: {
    betaNote: 'Beta: you can already use it; some screens may still change.',
    tryProduct: 'Try {{name}}',
    howItWorks: 'How it works',
    howItWillWork: 'How it will work',
    backHome: 'Back to home',
    notOpen:
      '{{name}} has not opened yet. Create your 17Suit account; when {{short}} opens, it will appear in My apps and you will sign in with the same account.',
    createSuitAccount: 'Create 17Suit account',
    step: 'Step',
    whatYouCan: 'What you can do',
    whatYouWillBeAbleTo: 'What you will be able to do',
    dataTitle: 'Your data',
    policyInReview: 'The privacy policy is under review.',
    dataBody: 'Before connecting your email, review how we handle your data.',
    readPolicy: 'Read the privacy policy',
  },
  products: {
    fifteen: {
      tagline: 'Your spending, cards and fixed payments, organized from your bank emails.',
      headline: 'Know where your money went this month without typing transactions by hand.',
      summary:
        'Connect your Gmail and Fifteen reads the notifications from your banks and payment gateways. Each transaction stays in review until you confirm it, so your accounts only show what you have already validated.',
      highlights: [
        'Only the senders you approve generate transactions; you can block the rest',
        'What Fifteen does not recognize with confidence appears separately, flagged for correction',
        'What you discard or postpone leaves the queue without counting in your month, and you can restore it',
        'Each card keeps its statement day and its due day',
      ],
      steps: [
        {
          title: 'Connect your email',
          body: 'You link your Gmail and, among the senders it finds, choose those of your banks and payments.',
        },
        {
          title: 'Review each transaction',
          body: 'You confirm, discard or postpone what Fifteen detected in your emails.',
        },
        {
          title: 'See your whole month',
          body: 'Income, spending, cards and fixed payments end up in a monthly dashboard.',
        },
      ],
    },
    seven: {
      tagline: 'Book a court at your sports complex or manage the ones in your business.',
      headline: 'Book a court without phone calls, and fill your schedule if you run the complex.',
      summary:
        'Sports complexes publish their courts and schedules; players pick a free slot and book. If the complex asks for no deposit, the booking is confirmed instantly; if it does, the complex confirms it once it receives the deposit.',
      highlights: [
        'Courts with their own schedules and slot length',
        'One view for whoever manages and another for whoever plays',
        'Pending, today and upcoming bookings in one place',
      ],
      steps: [
        {
          title: 'Choose how you will use it',
          body: 'When you create your account you say whether you manage a complex or come to play.',
        },
        {
          title: 'The complex opens its schedules',
          body: 'Whoever manages registers their courts and the hours of each day.',
        },
        {
          title: 'You book your court',
          body: 'You pick a court and a time. With no deposit, your booking is confirmed instantly; with a deposit, the complex confirms it on receipt.',
        },
      ],
    },
    one: {
      tagline: 'Go from a trip idea to an itinerary everyone can follow.',
      headline: 'One trip plan, clear for everyone who goes.',
      summary:
        'One Plan Trip will gather the ideas, bookings and notes of the trip into an itinerary shared with whoever travels with you.',
      highlights: [
        'Day-by-day itinerary',
        'Key bookings and notes in the same plan',
        'Plan shared with your travel companions',
      ],
      steps: [
        {
          title: 'Gather the ideas',
          body: 'You save destinations, bookings and trip notes in one place.',
        },
        {
          title: 'Build the itinerary',
          body: 'You arrange everything into a day-by-day plan.',
        },
        {
          title: 'Share it',
          body: 'Whoever travels with you sees the same plan.',
        },
      ],
    },
    closet: {
      tagline: 'Your clothes in a visual catalog to build looks by occasion.',
      headline: 'Decide what to wear by looking at your closet, not at your pile of clothes.',
      summary:
        'For Your Closet will turn your wardrobe into a visual catalog to combine garments by occasion and see what you really wear.',
      highlights: [
        'Visual catalog of your garments',
        'Saved combinations by occasion',
        'Record of which garments you wear and which you do not',
      ],
      steps: [
        {
          title: 'Upload your garments',
          body: 'You build a visual catalog of what is in your closet.',
        },
        {
          title: 'Combine by occasion',
          body: 'You create and save looks for work, nights out or trips.',
        },
        {
          title: 'See what you wear',
          body: 'You see which garments you repeat and which have not left the closet for a while.',
        },
      ],
    },
    five: {
      tagline: 'A schedule per barber and clients who come back.',
      headline: 'One schedule per barber and clients who return on time.',
      summary:
        'Five Barber Go will organize each professional’s appointments, the history of your regular clients and attendance reminders.',
      highlights: [
        'Service schedule per professional',
        'History of recurring clients',
        'Attendance reminders',
      ],
      steps: [
        {
          title: 'Publish your schedule',
          body: 'The barbershop registers its services and the hours of each barber.',
        },
        {
          title: 'The client books an appointment',
          body: 'They pick a service, a barber and an available time.',
        },
        {
          title: 'Reminder and return',
          body: 'The client gets a reminder and their history is kept for the next visit.',
        },
      ],
    },
  },
  contact: {
    title: 'Contact',
    intro:
      'Write to us if you have questions about your 17Suit account, access to an app or your data.',
    emailLabel: 'Contact email',
    pending: 'Contact channel being set up.',
    alsoReview: 'You can also review the',
    privacyLink: 'Privacy policy',
    and: 'and the',
    termsLink: 'Terms',
  },
  legal: {
    lastUpdated: 'Last updated:',
    pending: 'Pending',
    inReview: 'Document under review.',
    toc: 'Contents',
    pendingText: 'Text pending.',
    meanwhile: 'Meanwhile, write to us from the',
    contactPage: 'contact page',
    privacy: {
      title: 'Privacy policy',
      description: 'How 17Suit handles the data of your account and of the apps you use with it.',
      sections: {
        'data-collected': 'What data we collect',
        'data-use': 'What we use it for',
        'gmail-access': 'Gmail access (Fifteen Account Check)',
        'data-sharing': 'Who we share it with',
        'data-retention': 'How long we keep it',
        'your-rights': 'Your rights and how to revoke access',
        contact: 'Contact',
      },
    },
    terms: {
      title: 'Terms and conditions',
      description: 'The rules for using your 17Suit account and the suite apps.',
      sections: {
        acceptance: 'Acceptance of the terms',
        service: 'What 17Suit offers',
        account: 'Your 17Suit account',
        'acceptable-use': 'Acceptable use',
        'third-party': 'Third-party services',
        'intellectual-property': 'Intellectual property',
        liability: 'Limitation of liability',
        suspension: 'Suspension and cancellation of the account',
        changes: 'Changes to these terms',
        contact: 'Contact',
      },
    },
  },
  account: {
    shell: {
      reasons: [
        'One account for all 17Suit apps.',
        'After signing in, you return to the app you came from.',
        'If you forget your password, you recover it with a code sent to your email.',
      ],
    },
    errors: {
      form_identifier_not_found:
        'We could not find an account with that email. Check it or create an account.',
      form_password_incorrect: 'The password is not correct. Try again or reset it.',
      form_identifier_exists: 'An account with that email already exists. Sign in.',
      form_param_format_invalid: 'Check the email address format.',
      form_param_nil: 'Fill in all the fields.',
      form_password_length_too_short: 'The password is too short. Choose a longer one.',
      form_password_pwned: 'That password appeared in a data breach. Choose a different one.',
      form_password_not_strong_enough: 'The password is too weak. Combine more characters.',
      form_password_validation_failed:
        'The password does not meet the requirements. Choose another.',
      form_code_incorrect: 'The code is not correct. Check your email and try again.',
      verification_expired: 'The code expired. Request a new one.',
      verification_failed: 'We could not verify the code. Request a new one.',
      strategy_for_user_invalid:
        'This account does not use a password. Sign in with Google or reset your password.',
      user_locked:
        'Your account is temporarily locked after several failed attempts. Wait a few minutes.',
      too_many_requests: 'Too many attempts. Wait a few minutes and try again.',
      rate_limit_exceeded: 'Too many attempts. Wait a few minutes and try again.',
      captcha_invalid: 'We could not verify you are a person. Reload the page and try again.',
      not_allowed_access:
        'This email has no access. Use another one or write to us from the contact page.',
      contactLink: 'Go to the contact page',
      mismatch: 'The passwords do not match.',
    },
    apps: {
      title: 'Choose your app',
      introSignedIn:
        'Your 17Suit account already opens these apps. Choose which one to start with.',
      introSignedOut: 'Sign in with your 17Suit account to open these apps.',
      open: 'Open {{name}}',
      upcomingTitle: 'Coming soon',
      upcomingBody:
        'When they open, they will appear in this list and you will sign in with the same account.',
      signIn: 'Sign in',
    },
    signIn: {
      title: 'Sign in to 17Suit',
      description: 'Sign in with Google or your email and carry on in the app where you were.',
      google: 'Continue with Google',
      googleOpening: 'Opening Google…',
      or: 'or with your email',
      email: 'Email address',
      emailPlaceholder: 'you@email.com',
      password: 'Password',
      passwordPlaceholder: 'Your password',
      submit: 'Sign in',
      submitting: 'Signing in…',
      createAccount: 'Create account',
      forgot: 'I forgot my password',
      incomplete: 'We could not complete the sign-in. Try again or reset your password.',
      generic: 'We could not sign you in. Try again in a few minutes.',
    },
    signUp: {
      title: 'Create your 17Suit account',
      description:
        'Sign up once with Google or your email and use the same account in all 17Suit apps.',
      forProduct: 'You will create your account to open {{name}}.',
      passwordPlaceholder: 'Create a password',
      passwordHint: 'Use at least 8 characters. Avoid passwords you already use elsewhere.',
      confirm: 'Confirm password',
      confirmPlaceholder: 'Repeat your password',
      submit: 'Create account',
      submitting: 'Creating account…',
      review: 'See the',
      terms: 'Terms',
      and: 'and the',
      privacy: 'Privacy policy',
      haveAccount: 'I already have an account',
      checkEmail: 'Check your email',
      codeSent: 'We sent a code to {{email}}. Enter it here to activate your account.',
      code: 'Verification code',
      verify: 'Verify email',
      verifying: 'Verifying…',
      resend: 'Resend code',
      resending: 'Sending code…',
      changeEmail: 'Change email',
      resent: 'We sent a new code to {{email}}.',
      resendFailed: 'We could not resend the code. Wait a few minutes and try again.',
      verifyFailed: 'We could not verify the code. Check your email and try again.',
      createFailed: 'We could not create your account. Try again.',
      generic: 'We could not create your account. Try again in a few minutes.',
    },
    forgot: {
      title: 'Recover access',
      description: 'We send a code to your email so you can choose a new password.',
      sendCode: 'Send code',
      sending: 'Sending…',
      newPassword: 'New password',
      repeatPassword: 'Repeat the password',
      confirmNewPassword: 'Confirm new password',
      update: 'Update password',
      updating: 'Updating…',
      backToSignIn: 'Back to sign in',
      resetFailed: 'We could not reset your password. Request a new code.',
      generic: 'We could not reset your password. Try again in a few minutes.',
    },
  },
};
