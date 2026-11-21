/**
 * Typed access to the generated OpenAPI contract (`api-schema.ts`).
 *
 * Use these helpers instead of hand-written response interfaces so server
 * DTO changes surface as client type errors. Regenerate the schema with
 * `pnpm --filter @17suit/core gen:api-schema` after `pnpm export:openapi`
 * in 17s-server.
 *
 * Paths are relative to the API prefix (the base URL already includes
 * `/api`), matching how ApiClient and the product SDKs build URLs.
 */
import type { components, paths } from './api-schema';

export type ApiPaths = paths;
export type ApiComponents = components;
export type ApiSchemas = components['schemas'];

/** A named DTO from the server contract, e.g. `ApiSchema<'ReservationResponseDto'>`. */
export type ApiSchema<Name extends keyof ApiSchemas> = ApiSchemas[Name];

export type ApiPath = keyof paths;
export type ApiMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

/** Methods actually defined for a path. */
export type ApiMethodsOf<P extends ApiPath> = {
  [M in ApiMethod]: paths[P][M] extends undefined ? never : M;
}[ApiMethod];

export type ApiOperation<P extends ApiPath, M extends ApiMethodsOf<P>> = NonNullable<paths[P][M]>;

type SuccessStatus = 200 | 201 | 202 | 204;

type JsonContent<R> = R extends { content: { 'application/json': infer Body } } ? Body : undefined;

/** JSON body of the first 2xx response declared for the operation. */
export type ApiResponse<P extends ApiPath, M extends ApiMethodsOf<P>> =
  ApiOperation<P, M> extends { responses: infer Responses }
    ? {
        [S in keyof Responses]: S extends SuccessStatus ? JsonContent<Responses[S]> : never;
      }[keyof Responses]
    : never;

/** JSON request body declared for the operation (`never` when none). */
export type ApiRequestBody<P extends ApiPath, M extends ApiMethodsOf<P>> =
  ApiOperation<P, M> extends { requestBody?: infer Body } ? JsonContent<NonNullable<Body>> : never;

export type ApiPathParams<P extends ApiPath, M extends ApiMethodsOf<P>> =
  ApiOperation<P, M> extends { parameters: { path?: infer Params } } ? NonNullable<Params> : never;

export type ApiQueryParams<P extends ApiPath, M extends ApiMethodsOf<P>> =
  ApiOperation<P, M> extends { parameters: { query?: infer Params } } ? NonNullable<Params> : never;

/**
 * Builds a concrete URL path from an OpenAPI path template, e.g.
 * `apiPath('/7rc/venues/{venueId}/pitches', { venueId })`.
 * Values are URI-encoded; a missing parameter throws instead of producing
 * a silently wrong URL.
 */
export function apiPath<P extends ApiPath>(
  template: P,
  params: Record<string, string | number> = {},
): string {
  return template.replace(/\{([^}]+)\}/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) {
      throw new Error(`Missing path parameter "${name}" for ${template}`);
    }
    return encodeURIComponent(String(value));
  });
}
