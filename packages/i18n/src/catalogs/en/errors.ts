export const errors = {
  unknown: 'Something went wrong. Please try again.',
  network: 'Could not reach the server. Check your connection.',
  unauthorized: 'Your session expired. Sign in again.',
  badRequest: 'The request is not valid.',
  validation: 'Some fields are not valid. Review them and try again.',
  forbidden: 'You do not have permission to do that.',
  notFound: 'We could not find what you asked for.',
  conflict: 'That action conflicts with the current state. Refresh and try again.',
  rateLimited: 'Too many attempts. Wait a minute and try again.',
} as const;
