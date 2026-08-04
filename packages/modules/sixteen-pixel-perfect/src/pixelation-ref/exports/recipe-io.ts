import type { ProcessingConfig } from '../domain/config';
import { validateProcessingConfig } from '../domain/config';

/**
 * Recipe JSON serializer for the pixelation pipeline. Mirrors the
 * sixteen-pp recipe-io pattern: serialize a fully-validated config to
 * JSON bytes, and parse it back. Round-trip equality is a hard guarantee
 * — same bytes in ⇒ same config object out.
 *
 * Includes the source metadata (mime + dimensions) so reloading on a new
 * machine that does not have the original image is still meaningful.
 */

export function serializeRecipeJson(config: ProcessingConfig): Uint8Array {
  // Validate just before serialize to catch in-place mutations.
  const validated = validateProcessingConfig(config);
  return new TextEncoder().encode(JSON.stringify(validated, null, 2) + '\n');
}

export function parseRecipeJson(bytes: Uint8Array): ProcessingConfig {
  const text = new TextDecoder().decode(bytes);
  const parsed: unknown = JSON.parse(text);
  return validateProcessingConfig(parsed);
}
