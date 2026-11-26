'use client';

import { SignOutButton } from '@clerk/nextjs';

/**
 * `SignOutButton` requires exactly one element child (`Children.only`). An element
 * passed from a server component can reach the client as a lazy reference once
 * React outlines the payload (over 3200 bytes), which throws during SSR. The
 * button therefore has to be created here, on the client side of the boundary.
 */
export function SignOutControl({ className, label }: { className: string; label: string }) {
  return (
    <SignOutButton redirectUrl="/">
      <button type="button" className={className}>
        {label}
      </button>
    </SignOutButton>
  );
}
