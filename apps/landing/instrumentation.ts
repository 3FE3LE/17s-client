// Sentry instrumentation hook for Next.js.
// Runs once per server runtime (Node or Edge) at boot. Bundlers entrypoint.
// See https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.server.config');
  }
}
