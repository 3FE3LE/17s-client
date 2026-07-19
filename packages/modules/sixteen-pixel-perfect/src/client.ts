'use client';

// Client-safe re-exports for the Sixteen Pixel Perfect module.
// MVP has no client data-source / query stack yet — only role primitives that
// the web auth shell needs. Expand when the generation pipeline lands.
export {
  getSixteenPixelPerfectRoleHomePath,
  getSixteenPixelPerfectPostAuthPath,
  isSixteenPixelPerfectRole,
  type SixteenPixelPerfectRole,
  type SixteenPixelPerfectRoleSource,
} from './index';
