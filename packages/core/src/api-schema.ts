/**
 * Generated OpenAPI types for the 17s-server API.
 *
 * To regenerate after server-side changes:
 *   1. cd 17s-server && pnpm export:openapi
 *   2. pnpm --filter @17suit/core gen:api-schema
 *
 * The api-client in src/api-client.ts is a generic `request<TResponse>(...)`
 * wrapper; consume this file to type responses and request bodies instead of
 * `unknown`/`any`. Example:
 *
 *   import type { components, paths } from './api-schema';
 *   type ConfirmTransactionCandidateResponse =
 *     paths['/transaction-candidates/{id}/confirm']['post']['responses']['201']['content']['application/json'];
 */
export type ApiSchema = Record<string, unknown>;

export type ApiComponents = ApiSchema;
export type ApiPaths = ApiSchema;
