/** Catalog key (`errors` namespace) shown under a field the server rejected. */
export const SERVER_FIELD_ERROR_MESSAGE = 'errors:invalidField';

/** Structural subset of react-hook-form `setError`, so core takes no form dependency. */
export type SetFieldError<Name extends string> = (
  name: Name,
  error: { type: string; message: string },
) => void;

/**
 * Puts the server `fields` of an `ApiError` onto react-hook-form fields.
 *
 * `fieldMap` maps a server property to a form field name (`slotDurationMinutes` to `duration`).
 * Server messages are technical English and never shown: each mapped field gets the stable
 * `errors:invalidField` code, which the form renders through its catalog.
 *
 * Returns `true` when at least one field was set, so the caller can skip the generic banner.
 * Unmapped properties and the `_` bucket stay for the banner.
 */
export function applyServerFieldErrors<Name extends string>(
  error: unknown,
  setError: SetFieldError<Name>,
  fieldMap: Readonly<Record<string, Name>>,
): boolean {
  const fields = (error as { fields?: unknown } | null | undefined)?.fields;
  if (typeof fields !== 'object' || fields === null || Array.isArray(fields)) return false;

  let applied = false;
  for (const [property, messages] of Object.entries(fields)) {
    if (!Object.hasOwn(fieldMap, property)) continue;
    if (!Array.isArray(messages) || messages.length === 0) continue;
    setError(fieldMap[property] as Name, {
      type: 'server',
      message: SERVER_FIELD_ERROR_MESSAGE,
    });
    applied = true;
  }
  return applied;
}
