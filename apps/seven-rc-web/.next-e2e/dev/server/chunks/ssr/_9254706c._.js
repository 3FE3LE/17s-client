module.exports = [
  '[project]/packages/core/src/analytics.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['analyticsClient', () => analyticsClient]);
    const analyticsClient = {
      track: (event, payload) => {
        console.info('[analytics] track', event, payload ?? {});
      },
      identify: (userId, traits) => {
        console.info('[analytics] identify', userId, traits ?? {});
      },
    };
  },
  '[project]/packages/core/src/api-client.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'ApiClient',
      () => ApiClient,
      'ApiError',
      () => ApiError,
      'TRACE_ID_HEADER',
      () => TRACE_ID_HEADER,
      'generateTraceId',
      () => generateTraceId,
      'getApiErrorDisplayMessage',
      () => getApiErrorDisplayMessage,
      'isApiError',
      () => isApiError,
      'normalizeApiBaseUrl',
      () => normalizeApiBaseUrl,
    ]);
    const TRACE_ID_HEADER = 'x-trace-id';
    class ApiError extends Error {
      code;
      status;
      path;
      payload;
      constructor(options) {
        super(options.message);
        this.name = 'ApiError';
        this.code = options.code;
        if (options.status !== undefined) {
          this.status = options.status;
        }
        if (options.path !== undefined) {
          this.path = options.path;
        }
        if (options.payload !== undefined) {
          this.payload = options.payload;
        }
        if (options.cause !== undefined) {
          this.cause = options.cause;
        }
      }
    }
    function isApiError(error) {
      return error instanceof ApiError;
    }
    function normalizeApiBaseUrl(value) {
      return value.replace(/\/+$/, '');
    }
    function getApiErrorDisplayMessage(error) {
      if (error instanceof TypeError) {
        return 'Unable to reach the API server. Check that the backend and database are running.';
      }
      if (!isApiError(error)) {
        return error instanceof Error ? error.message : 'Unexpected request error.';
      }
      if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
        return 'Unable to reach the API server. Check that the backend and database are running.';
      }
      return error.message;
    }
    class ApiClient {
      options;
      constructor(options) {
        this.options = options;
      }
      async request(path, init = {}) {
        const token = await this.options.getAccessToken?.();
        const headers = new Headers(init.headers);
        if (!headers.has('Content-Type') && init.body) {
          headers.set('Content-Type', 'application/json');
        }
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        if (!headers.has(TRACE_ID_HEADER)) {
          const fallbackTraceId = this.options.traceId ?? generateTraceId();
          headers.set(TRACE_ID_HEADER, fallbackTraceId);
        }
        const response = await fetchWithTimeout(
          `${normalizeApiBaseUrl(this.options.baseUrl)}${path}`,
          {
            ...init,
            headers,
          },
          this.options.timeoutMs,
          path,
        );
        if (!response.ok) {
          const payload = await parseResponsePayload(response);
          throw new ApiError({
            message: extractErrorMessage(
              payload,
              `Request failed (${response.status}) for ${path}`,
            ),
            code: 'HTTP_ERROR',
            status: response.status,
            path,
            payload,
          });
        }
        return await parseJsonResponse(response, path);
      }
    }
    async function fetchWithTimeout(url, init, timeoutMs = 8_000, path) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, {
          ...init,
          signal: init.signal ?? controller.signal,
        });
      } catch (error) {
        const isTimeout =
          error instanceof DOMException
            ? error.name === 'AbortError'
            : error instanceof Error && error.name === 'AbortError';
        throw new ApiError({
          message: isTimeout ? 'Request timed out.' : 'Unable to reach API server.',
          code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
          cause: error,
          ...(path === undefined
            ? {}
            : {
                path,
              }),
        });
      } finally {
        clearTimeout(timer);
      }
    }
    async function parseJsonResponse(response, path) {
      if (response.status === 204) {
        return undefined;
      }
      try {
        return await response.json();
      } catch (error) {
        throw new ApiError({
          message: `Invalid JSON response for ${path}`,
          code: 'PARSE_ERROR',
          status: response.status,
          path,
          cause: error,
        });
      }
    }
    async function parseResponsePayload(response) {
      try {
        return await response.json();
      } catch {
        try {
          return await response.text();
        } catch {
          return null;
        }
      }
    }
    function extractErrorMessage(payload, fallback) {
      if (payload && typeof payload === 'object' && 'message' in payload) {
        const message = payload.message;
        if (Array.isArray(message)) return message.join(', ');
        if (typeof message === 'string' && message.length > 0) return message;
      }
      if (payload && typeof payload === 'object' && 'error' in payload) {
        const error = payload.error;
        if (typeof error === 'string' && error.length > 0) return error;
      }
      if (typeof payload === 'string' && payload.length > 0) {
        return payload;
      }
      return fallback;
    }
    function generateTraceId() {
      return crypto.randomUUID();
    }
  },
  '[project]/packages/core/src/api-types.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

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
     */ __turbopack_context__.s(['apiPath', () => apiPath]);
    function apiPath(template, params = {}) {
      return template.replace(/\{([^}]+)\}/g, (_, name) => {
        const value = params[name];
        if (value === undefined) {
          throw new Error(`Missing path parameter "${name}" for ${template}`);
        }
        return encodeURIComponent(String(value));
      });
    }
  },
  '[project]/packages/core/src/auth.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['assertSession', () => assertSession, 'hasRole', () => hasRole]);
    function hasRole(session, role) {
      return Boolean(session?.roles.includes(role));
    }
    function assertSession(session) {
      if (!session) {
        throw new Error('Authentication required');
      }
    }
  },
  '[project]/packages/core/src/env.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['loadEnv', () => loadEnv]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>',
      );
    const EnvSchema =
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
        'z'
      ].object({
        NODE_ENV:
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
            'z'
          ]
            .enum(['development', 'test', 'production'])
            .default('development'),
        APP_ENV:
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
            'z'
          ]
            .enum(['local', 'staging', 'production'])
            .default('local'),
        API_BASE_URL:
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
            'z'
          ]
            .string()
            .url()
            .default('http://localhost:4000/api'),
      });
    function loadEnv(source = process.env) {
      return EnvSchema.parse(source);
    }
  },
  '[project]/packages/core/src/feature-flags.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['MemoryFeatureFlagClient', () => MemoryFeatureFlagClient]);
    class MemoryFeatureFlagClient {
      flags;
      constructor(flags) {
        this.flags = flags;
      }
      isEnabled(flagKey) {
        return Promise.resolve(Boolean(this.flags[flagKey]));
      }
      getValue(flagKey, fallback) {
        const value = this.flags[flagKey];
        return Promise.resolve(value ?? fallback);
      }
    }
  },
  '[project]/packages/core/src/logger.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['logger', () => logger]);
    function log(level, message, context) {
      const payload = context ? JSON.stringify(context) : '';
      console[level](`[${level.toUpperCase()}] ${message}${payload ? ` ${payload}` : ''}`);
    }
    const logger = {
      debug: (message, context) => log('debug', message, context),
      info: (message, context) => log('info', message, context),
      warn: (message, context) => log('warn', message, context),
      error: (message, context) => log('error', message, context),
    };
  },
  '[project]/packages/core/src/platform.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'PlatformOnboardingRoleRequestSchema',
      () => PlatformOnboardingRoleRequestSchema,
      'PlatformOnboardingRoleSchema',
      () => PlatformOnboardingRoleSchema,
      'PlatformUserSchema',
      () => PlatformUserSchema,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>',
      );
    const PlatformOnboardingRoleSchema =
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
        'z'
      ].enum(['OWNER', 'PLAYER']);
    const PlatformOnboardingRoleRequestSchema =
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
        'z'
      ].object({
        role: PlatformOnboardingRoleSchema,
      });
    const PlatformUserSchema =
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
        'z'
      ].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
          'z'
        ]
          .string()
          .min(1),
        clerkUserId:
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
            'z'
          ]
            .string()
            .min(1),
        role: PlatformOnboardingRoleSchema,
        email:
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
            'z'
          ]
            .string()
            .email()
            .nullable(),
        name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
          'z'
        ]
          .string()
          .min(1)
          .nullable(),
        createdAt:
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
            'z'
          ]
            .string()
            .datetime(),
        updatedAt:
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
            'z'
          ]
            .string()
            .datetime(),
      });
  },
  '[project]/packages/core/src/index.ts [app-rsc] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$analytics$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/analytics.ts [app-rsc] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$client$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/api-client.ts [app-rsc] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/api-types.ts [app-rsc] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/auth.ts [app-rsc] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/env.ts [app-rsc] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$feature$2d$flags$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/core/src/feature-flags.ts [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$logger$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/logger.ts [app-rsc] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$platform$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/platform.ts [app-rsc] (ecmascript)');
  },
  '[project]/apps/seven-rc-web/lib/public-venue-api.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'cancelPublicReservation',
      () => cancelPublicReservation,
      'createPublicReservation',
      () => createPublicReservation,
      'fetchPublicReservation',
      () => fetchPublicReservation,
      'fetchPublicVenue',
      () => fetchPublicVenue,
      'fetchPublicVenueAvailability',
      () => fetchPublicVenueAvailability,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/core/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/env.ts [app-rsc] (ecmascript)');
    function apiBaseUrl() {
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'loadEnv'
      ])()
        .API_BASE_URL.replace(/\/+$/, '')
        .replace(/\/api$/, '');
    }
    /** `null` when the venue does not exist or is not published (server answers 404). */ async function getPublic(
      path,
      init,
    ) {
      const response = await fetch(`${apiBaseUrl()}/api/7rc/public/${path}`, {
        ...init,
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.status === 404) return null;
      if (!response.ok) {
        throw new Error(`Public venue request failed (${response.status})`);
      }
      return await response.json();
    }
    function fetchPublicVenue(slug) {
      return getPublic(`venues/${encodeURIComponent(slug)}`, {
        next: {
          revalidate: 60,
        },
      });
    }
    function fetchPublicVenueAvailability(slug, date) {
      return getPublic(
        `venues/${encodeURIComponent(slug)}/availability?date=${encodeURIComponent(date)}`,
        {
          cache: 'no-store',
        },
      );
    }
    function fetchPublicReservation(token) {
      return getPublic(`reservations/${encodeURIComponent(token)}`, {
        cache: 'no-store',
      });
    }
    function errorMessage(body) {
      const message = body?.message;
      if (Array.isArray(message)) return message.join('; ');
      return typeof message === 'string' ? message : '';
    }
    async function createPublicReservation(slug, input) {
      const response = await fetch(
        `${apiBaseUrl()}/api/7rc/public/venues/${encodeURIComponent(slug)}/reservations`,
        {
          method: 'POST',
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        },
      );
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          message: errorMessage(body),
        };
      }
      return {
        ok: true,
        reservation: body,
      };
    }
    async function cancelPublicReservation(token) {
      const response = await fetch(
        `${apiBaseUrl()}/api/7rc/public/reservations/${encodeURIComponent(token)}/cancel`,
        {
          method: 'POST',
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        },
      );
      if (!response.ok)
        return {
          ok: false,
          status: response.status,
        };
      return {
        ok: true,
        reservation: await response.json(),
      };
    }
  },
  '[project]/apps/seven-rc-web/lib/phone.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    /** E.164: "+" then 8 to 15 digits, first digit not zero. */ __turbopack_context__.s([
      'E164_PATTERN',
      () => E164_PATTERN,
      'normalizePhone',
      () => normalizePhone,
    ]);
    const E164_PATTERN = /^\+[1-9]\d{7,14}$/;
    function normalizePhone(value, countryCode) {
      const trimmed = value.trim();
      if (!trimmed) return null;
      const compact = trimmed.replace(/[\s().-]/g, '');
      if (compact.startsWith('+')) return compact;
      if (countryCode === 'CO' && /^3\d{9}$/.test(compact)) return `+57${compact}`;
      return compact;
    }
  },
  '[project]/apps/seven-rc-web/app/c/[slug]/actions.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    /* __next_internal_action_entry_do_not_use__ [{"6082be61a89fff8eebe565c3997184c07efd55bcd0":"cancelReservationAction","700e9cbe8ad9d5aa2b2447107f0ee24a6d83fda53e":"reserveAction"},"",""] */ __turbopack_context__.s(
      [
        'cancelReservationAction',
        () => cancelReservationAction,
        'reserveAction',
        () => reserveAction,
      ],
    );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/cache.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$public$2d$venue$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/lib/public-venue-api.ts [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$phone$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/apps/seven-rc-web/lib/phone.ts [app-rsc] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)',
      );
    const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
    function text(data, key) {
      const value = data.get(key);
      return typeof value === 'string' ? value : '';
    }
    function failure(fieldErrors, formError) {
      return {
        fieldErrors,
        formError,
      };
    }
    async function reserveAction(slug, _previous, data) {
      const values = {
        name: text(data, 'customerName').trim(),
        phone: text(data, 'customerPhone').trim(),
        notes: text(data, 'notes').trim(),
      };
      const pitchId = text(data, 'pitchId');
      const startAt = text(data, 'startAt');
      const date = text(data, 'fecha');
      const back = `/c/${encodeURIComponent(slug)}${DATE_KEY.test(date) ? `?fecha=${date}` : ''}`;
      const venue = await (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$public$2d$venue$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'fetchPublicVenue'
      ])(slug);
      if (!venue)
        (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'redirect'
        ])(`/c/${encodeURIComponent(slug)}`);
      const fieldErrors = {};
      if (values.name.length < 2) fieldErrors.name = 'Escribe tu nombre.';
      const phone = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$phone$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'normalizePhone'
      ])(values.phone, venue.countryCode);
      if (
        !phone ||
        !__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$phone$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'E164_PATTERN'
        ].test(phone)
      ) {
        fieldErrors.phone = 'Escribe el número con indicativo, p. ej. +57 300 123 4567.';
      }
      if (!UUID.test(pitchId) || Number.isNaN(Date.parse(startAt))) {
        return failure(fieldErrors, 'Ese horario no es válido. Elige uno de la lista.');
      }
      if (fieldErrors.name || fieldErrors.phone || !phone) {
        return failure(fieldErrors, 'Revisa los campos marcados.');
      }
      let result;
      try {
        result = await (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$public$2d$venue$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'createPublicReservation'
        ])(slug, {
          pitchId,
          startAt,
          customerName: values.name,
          customerPhone: phone,
          ...(values.notes
            ? {
                notes: values.notes,
              }
            : {}),
        });
      } catch {
        return failure(
          {},
          'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.',
        );
      }
      if (result.ok) {
        (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'redirect'
        ])(`/c/${encodeURIComponent(slug)}/reserva/${result.reservation.token}`);
      }
      if (result.status === 409) {
        // Availability is re-fetched by the redirect, so the taken slot disappears from the list.
        (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'redirect'
        ])(`${back}${back.includes('?') ? '&' : '?'}conflicto=1`);
      }
      if (result.status === 429) {
        return failure({}, 'Demasiados intentos seguidos. Espera un minuto e intenta de nuevo.');
      }
      if (result.status === 404)
        (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'redirect'
        ])(`/c/${encodeURIComponent(slug)}`);
      if (result.status === 400) {
        return failure(
          {},
          'Revisa los datos e intenta de nuevo. Si el horario ya pasó, elige otro.',
        );
      }
      return failure({}, 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.');
    }
    async function cancelReservationAction(slug, token) {
      if (!UUID.test(token))
        return {
          error: 'Este enlace no es válido.',
        };
      let result;
      try {
        result = await (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$public$2d$venue$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'cancelPublicReservation'
        ])(token);
      } catch {
        return {
          error: 'No pudimos conectar con el servidor. Intenta de nuevo.',
        };
      }
      if (result.ok) {
        (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'revalidatePath'
        ])(`/c/${encodeURIComponent(slug)}/reserva/${token}`);
        return {
          error: null,
        };
      }
      if (result.status === 400) {
        return {
          error: 'Ya no se puede cancelar en línea. Comunícate con el complejo.',
        };
      }
      if (result.status === 404)
        return {
          error: 'No encontramos esta reserva.',
        };
      if (result.status === 429)
        return {
          error: 'Demasiados intentos. Espera un minuto.',
        };
      return {
        error: 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.',
      };
    }
    (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'ensureServerEntryExports'
    ])([reserveAction, cancelReservationAction]);
    (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerServerReference'
    ])(reserveAction, '700e9cbe8ad9d5aa2b2447107f0ee24a6d83fda53e', null);
    (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerServerReference'
    ])(cancelReservationAction, '6082be61a89fff8eebe565c3997184c07efd55bcd0', null);
  },
];

//# sourceMappingURL=_9254706c._.js.map
