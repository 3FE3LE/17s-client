export const shell = {
  meta: {
    description:
      'Book courts by picking a free slot and get the venue confirmation, without WhatsApp chains.',
  },
  brand: {
    suite: '17Suit',
    product: 'Seven Reservations Club',
  },
  footer: {
    productTagline: 'Court bookings and scheduling for sports venues.',
    goToDashboard: 'Go to my dashboard',
    signIn: 'Sign in',
    signUp: 'Create account',
    signOut: 'Sign out',
  },
  home: {
    audiencePlayerTitle: 'If you play',
    audiencePlayerSteps: {
      step1: 'Search for the venue by name or address.',
      step2: 'Pick a court, a day and one of the free slots.',
      step3: 'Follow your booking until the venue confirms it.',
    },
    audienceOwnerTitle: 'If you run a venue',
    audienceOwnerSteps: {
      step1: 'Publish your courts with their opening hours.',
      step2: 'Confirm or reject each request from a single list.',
      step3: "Check today's schedule in your venue's time.",
    },
    previewTimeFormat: '{{hour}}:00 p.m.',
    previewCourt: 'Court 2 · Five-a-side',
    previewDay: 'Saturday · venue time',
    previewPending: 'pending confirmation',
    previewCaption:
      'Illustration: this is how you pick a slot. Taken ones appear crossed out and you can only choose from the free ones.',
    accountNav: 'Account',
    heroTitle: 'Pick the free slot and book your court.',
    heroBody:
      'Seven Reservations Club shows the available slots for each court. You pick the day and time, the venue confirms your booking and you see the status in one place, without WhatsApp message chains.',
    bookCourt: 'Book a court',
    publishVenue: 'Publish my venue',
    haveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    howItWorks: 'How it works',
  },
  roleSwitch: {
    ownerToPlayer: {
      label: 'Switch to player mode',
      title: 'Switch to player mode?',
      body: 'You will see court search and your bookings as a player. Your venue, courts and requests stay saved; you return to them by switching to owner mode.',
      confirm: 'Switch to player',
    },
    playerToOwner: {
      label: 'Switch to owner mode',
      title: 'Switch to owner mode?',
      body: 'You will see the dashboard to manage a venue. Your bookings as a player stay saved; you return to them by switching to player mode.',
      confirm: 'Switch to owner',
    },
    pending: 'Switching…',
    dismiss: 'Stay here',
    error: 'Could not switch mode. Try again.',
  },
  onboarding: {
    title: 'How will you use Seven Reservations Club?',
    subtitle:
      'Pick an option. It sets what you see on entry, and you can change it any time above, next to "Sign out".',
    player: {
      title: 'I want to book courts',
      description: 'Search venues, pick a free slot and follow the status of your bookings.',
      cta: 'Continue as player',
    },
    owner: {
      title: 'I run a venue',
      description: 'Publish your courts and hours, and confirm or reject requests.',
      cta: 'Continue as venue owner',
    },
    done: 'Done. Taking you to your dashboard…',
    saveError: 'Could not save your choice. Try again.',
    roleCheckError: 'We could not check your account. You can choose anyway or retry.',
    retry: 'Retry',
    saving: 'Saving…',
  },
  roleSelector: {
    pickRole: 'Select your role to continue.',
    currentRole: 'Current role detected by {{source}}: {{role}}',
    retryLoad: 'Retry loading role',
    saving: 'Saving...',
    clearError: 'Dismiss error and retry',
    ownerTitle: 'I own a venue',
    ownerSubtitle: 'Manage venues, courts and your customers’ bookings.',
    ownerCta: 'Continue as OWNER',
    playerTitle: 'I am a player',
    playerSubtitle: 'Search venues, book courts and manage your matches.',
    playerCta: 'Continue as PLAYER',
  },
} as const;
