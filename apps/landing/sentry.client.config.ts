// This file configures the initialization of Sentry on the browser/client.
// The config you add here will be used whenever a page is visited.
//
// See https://docs.sentry.io/platforms/javascript/guides/nextjs/ for more information.

import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE
      ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE)
      : 0.1,
    // Don't send PII by default; route through beforeSend if we ever need to.
    sendDefaultPii: false,
  });
}
