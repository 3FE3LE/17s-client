'use client';

import { SignOutButton } from '@clerk/nextjs';
import type { CSSProperties } from 'react';

/**
 * `SignOutButton` requires exactly one element child (`Children.only`). An element
 * passed from a server component can reach the client as a lazy reference once
 * React outlines the payload (over 3200 bytes), which throws during SSR. The
 * button therefore has to be created here, on the client side of the boundary.
 */
export function SignOutControl({ style }: { style: CSSProperties }) {
  return (
    <SignOutButton redirectUrl="/sign-in?redirect_url=/">
      <button type="button" style={style}>
        Cerrar sesion
      </button>
    </SignOutButton>
  );
}
