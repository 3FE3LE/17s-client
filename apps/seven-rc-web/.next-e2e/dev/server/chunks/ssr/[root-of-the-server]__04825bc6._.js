module.exports = [
  '[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x('next/dist/shared/lib/no-fallback-error.external.js', () =>
      require('next/dist/shared/lib/no-fallback-error.external.js'),
    );

    module.exports = mod;
  },
  '[project]/apps/seven-rc-web/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)',
  (__turbopack_context__) => {
    __turbopack_context__.n(
      __turbopack_context__.i('[project]/apps/seven-rc-web/app/layout.tsx [app-rsc] (ecmascript)'),
    );
  },
  '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'SevenReservationsClubRoleOptions',
      () => SevenReservationsClubRoleOptions,
      'SevenReservationsClubRoles',
      () => SevenReservationsClubRoles,
      'extractSevenReservationsClubRoleFromMePayload',
      () => extractSevenReservationsClubRoleFromMePayload,
      'getSevenReservationsClubPostAuthPath',
      () => getSevenReservationsClubPostAuthPath,
      'getSevenReservationsClubRoleHint',
      () => getSevenReservationsClubRoleHint,
      'getSevenReservationsClubRoleHomePath',
      () => getSevenReservationsClubRoleHomePath,
      'isSevenReservationsClubRole',
      () => isSevenReservationsClubRole,
    ]);
    const SevenReservationsClubRoles = ['OWNER', 'PLAYER'];
    const SevenReservationsClubRoleOptions = [
      {
        role: 'OWNER',
        title: 'Soy dueno de un complejo',
        subtitle: 'Administra complejos, canchas y reservas de tus clientes.',
        cta: 'Continuar como OWNER',
      },
      {
        role: 'PLAYER',
        title: 'Soy jugador',
        subtitle: 'Busca complejos, reserva canchas y gestiona tus partidos.',
        cta: 'Continuar como PLAYER',
      },
    ];
    function isSevenReservationsClubRole(value) {
      return typeof value === 'string' && SevenReservationsClubRoles.includes(value);
    }
    function getSevenReservationsClubRoleHomePath(role) {
      return role === 'OWNER' ? '/owner' : '/play';
    }
    function getSevenReservationsClubPostAuthPath(role) {
      if (!role) {
        return '/onboarding/role';
      }
      return getSevenReservationsClubRoleHomePath(role);
    }
    function getSevenReservationsClubRoleHint(role, source) {
      if (!role) {
        return 'Selecciona tu rol para continuar.';
      }
      return `Rol actual detectado por ${source}: ${role}`;
    }
    function extractSevenReservationsClubRoleFromMePayload(payload) {
      if (!payload || typeof payload !== 'object') {
        return null;
      }
      const asRecord = payload;
      if (isSevenReservationsClubRole(asRecord.role)) {
        return asRecord.role;
      }
      const user = asRecord.user;
      if (user && typeof user === 'object') {
        const role = user.role;
        if (isSevenReservationsClubRole(role)) {
          return role;
        }
      }
      return null;
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
  '[project]/packages/modules/seven-reservations-club/src/sdk/seven-rc-api.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'SevenRcApiError',
      () => SevenRcApiError,
      'createSevenRcOwnerApi',
      () => createSevenRcOwnerApi,
      'createSevenRcPlayerApi',
      () => createSevenRcPlayerApi,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/api-types.ts [app-rsc] (ecmascript)');
    function normalizeApiBaseUrl(value) {
      return value.replace(/\/+$/, '');
    }
    function normalizeApiBaseUrls(values) {
      const unique = [];
      for (const raw of values) {
        const value = raw?.trim();
        if (!value) {
          continue;
        }
        const normalized = normalizeApiBaseUrl(value);
        if (!unique.includes(normalized)) {
          unique.push(normalized);
        }
      }
      return unique;
    }
    async function fetchWithTimeout(url, init, timeoutMs = 8_000) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, {
          ...init,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
    }
    async function parseJsonSafe(response) {
      try {
        return await response.json();
      } catch {
        return null;
      }
    }
    function extractErrorMessage(payload, fallback) {
      // Nest sends `{ message: 'Timeslot is unavailable', error: 'Conflict' }`: `message` is
      // the specific reason. The web BFF and validation errors only have a usable `error`.
      if (payload && typeof payload === 'object' && 'message' in payload) {
        const message = payload.message;
        if (typeof message === 'string' && message.length > 0) {
          return message;
        }
      }
      if (payload && typeof payload === 'object' && 'error' in payload) {
        const error = payload.error;
        if (typeof error === 'string' && error.length > 0) {
          return error;
        }
      }
      return fallback;
    }
    function toError(error, fallbackMessage) {
      return error instanceof Error ? error : new Error(fallbackMessage);
    }
    class SevenRcApiError extends Error {
      status;
      /** Parsed JSON body of the error response, when there was one. */ payload;
      constructor(message, status, payload = null) {
        super(message);
        this.name = 'SevenRcApiError';
        this.status = status;
        this.payload = payload;
      }
      /** Reservations that overlap a rejected pitch block (409 from the block endpoint). */ get conflicts() {
        const value =
          this.payload && typeof this.payload === 'object' ? this.payload.conflicts : null;
        return Array.isArray(value) ? value : [];
      }
    }
    function createRequest(options) {
      const apiBaseUrls = normalizeApiBaseUrls(options.apiBaseUrls);
      const { getAccessToken, timeoutMs = 8_000 } = options;
      return async function request(path, init) {
        const token = await getAccessToken();
        if (!token) {
          throw new Error('Unauthorized');
        }
        // Fail over to the next base URL only when no HTTP response arrived (network
        // error / timeout), and only for idempotent reads. Any HTTP response — 4xx or
        // 5xx — is the server's answer and must surface as-is; re-sending a POST to
        // another host risks a duplicate write.
        const method = (init.method ?? 'GET').toUpperCase();
        const canFailOver = method === 'GET' || method === 'HEAD';
        const candidates = canFailOver ? apiBaseUrls : apiBaseUrls.slice(0, 1);
        let lastError = null;
        for (const baseUrl of candidates) {
          let response;
          try {
            response = await fetchWithTimeout(
              `${baseUrl}${path}`,
              {
                ...init,
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${token}`,
                  ...(init.headers ?? {}),
                },
              },
              timeoutMs,
            );
          } catch (error) {
            lastError = error;
            continue;
          }
          if (response.ok) {
            return await response.json();
          }
          const payload = await parseJsonSafe(response);
          throw new SevenRcApiError(
            extractErrorMessage(payload, `Request failed (${response.status})`),
            response.status,
            payload,
          );
        }
        throw toError(lastError, 'Unable to reach API');
      };
    }
    function createSevenRcOwnerApi(options) {
      const request = createRequest(options);
      return {
        listOwnerVenues() {
          return request('/7rc/owner/venues', {
            method: 'GET',
            cache: 'no-store',
          });
        },
        createVenue(input) {
          return request('/7rc/venues', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
          });
        },
        listOwnerVenuePitches(venueId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/owner/venues/{venueId}/pitches', {
              venueId,
            }),
            {
              method: 'GET',
              cache: 'no-store',
            },
          );
        },
        createPitchForVenue(venueId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/venues/{venueId}/pitches', {
              venueId,
            }),
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        configurePitchSlots(pitchId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/slots', {
              pitchId,
            }),
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        listVenueReservations(venueId, dateFrom, dateTo, cacheBuster) {
          const query = new URLSearchParams({
            dateFrom,
            dateTo,
          });
          if (cacheBuster) {
            query.set('_', cacheBuster);
          }
          return request(
            `${(0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/venues/{venueId}/reservations', {
              venueId,
            })}?${query}`,
            {
              method: 'GET',
              cache: 'no-store',
            },
          );
        },
        confirmReservation(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/confirm', {
              id: reservationId,
            }),
            {
              method: 'PATCH',
            },
          );
        },
        rejectReservation(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/reject', {
              id: reservationId,
            }),
            {
              method: 'PATCH',
            },
          );
        },
        updateVenueSettings(venueId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/venues/{venueId}/settings', {
              venueId,
            }),
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        configurePitchPricing(pitchId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/pricing', {
              pitchId,
            }),
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        recordReservationPayment(reservationId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/payments', {
              id: reservationId,
            }),
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        markNoShow(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/no-show', {
              id: reservationId,
            }),
            {
              method: 'POST',
            },
          );
        },
        completeReservation(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/complete', {
              id: reservationId,
            }),
            {
              method: 'POST',
            },
          );
        },
        ownerCancelReservation(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/owner-cancel', {
              id: reservationId,
            }),
            {
              method: 'POST',
            },
          );
        },
        createOwnerReservation(venueId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/venues/{venueId}/reservations', {
              venueId,
            }),
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        listPitchBlocks(pitchId, from) {
          const query = from
            ? `?${new URLSearchParams({
                from,
              })}`
            : '';
          return request(
            `${(0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/blocks', {
              pitchId,
            })}${query}`,
            {
              method: 'GET',
              cache: 'no-store',
            },
          );
        },
        createPitchBlock(pitchId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/blocks', {
              pitchId,
            }),
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        deletePitchBlock(pitchId, blockId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/blocks/{blockId}', {
              pitchId,
              blockId,
            }),
            {
              method: 'DELETE',
            },
          );
        },
      };
    }
    function createSevenRcPlayerApi(options) {
      const request = createRequest(options);
      return {
        listVenues(query) {
          const search = query ? `?q=${encodeURIComponent(query)}` : '';
          return request(`/7rc/venues${search}`, {
            method: 'GET',
            cache: 'no-store',
          });
        },
        listVenuePitches(venueId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/venues/{venueId}/pitches', {
              venueId,
            }),
            {
              method: 'GET',
              cache: 'no-store',
            },
          );
        },
        getPitchAvailability(pitchId, date) {
          const query = new URLSearchParams({
            date,
          });
          return request(
            `${(0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/availability', {
              pitchId,
            })}?${query}`,
            {
              method: 'GET',
              cache: 'no-store',
            },
          );
        },
        listMyReservations() {
          return request('/7rc/reservations', {
            method: 'GET',
            cache: 'no-store',
          });
        },
        createReservation(input) {
          return request('/7rc/reservations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
          });
        },
        cancelReservation(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/cancel', {
              id: reservationId,
            }),
            {
              method: 'POST',
            },
          );
        },
      };
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/index.ts [app-rsc] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'SevenReservationsClubEntitySchema',
      () => SevenReservationsClubEntitySchema,
      'SevenReservationsClubFeatureFlags',
      () => SevenReservationsClubFeatureFlags,
      'validateSevenReservationsClubEntity',
      () => validateSevenReservationsClubEntity,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/external.js [app-rsc] (ecmascript) <export * as z>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$sdk$2f$seven$2d$rc$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/sdk/seven-rc-api.ts [app-rsc] (ecmascript)',
      );
    const SevenReservationsClubEntitySchema =
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
        'z'
      ].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
          'z'
        ]
          .string()
          .uuid(),
        tenantId:
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
            'z'
          ]
            .string()
            .min(1),
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
    const SevenReservationsClubFeatureFlags = {
      enableV2Flow: 'seven-reservations-club.enable_v2_flow',
      enableAdvancedAnalytics: 'seven-reservations-club.enable_advanced_analytics',
    };
    function validateSevenReservationsClubEntity(input) {
      return SevenReservationsClubEntitySchema.parse(input);
    }
  },
  '[project]/apps/seven-rc-web/lib/role.ts [app-rsc] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
  },
  '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-rsc] (ecmascript) <export isSevenReservationsClubRole as isAppRole>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'isAppRole',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'isSevenReservationsClubRole'
        ],
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-rsc] (ecmascript)',
      );
  },
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
  '[project]/apps/seven-rc-web/lib/platform-api.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'fetchPlatformMe',
      () => fetchPlatformMe,
      'persistOnboardingRole',
      () => persistOnboardingRole,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/core/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/env.ts [app-rsc] (ecmascript)');
    function normalizeApiBaseUrl(baseUrl) {
      const trimmed = baseUrl.replace(/\/+$/, '');
      return trimmed.replace(/\/api$/, '');
    }
    async function fetchPlatformMe(accessToken) {
      const apiBaseUrl = normalizeApiBaseUrl(
        (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'loadEnv'
        ])().API_BASE_URL,
      );
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      };
      const primaryResponse = await fetch(`${apiBaseUrl}/api/platform/me`, {
        headers: {
          ...headers,
        },
        cache: 'no-store',
      });
      let response = primaryResponse;
      if (response.status === 404) {
        response = await fetch(`${apiBaseUrl}/api/me`, {
          headers: {
            ...headers,
          },
          cache: 'no-store',
        });
      }
      if (response.status === 404) {
        response = await fetch(`${apiBaseUrl}/me`, {
          headers: {
            ...headers,
          },
          cache: 'no-store',
        });
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch profile (${response.status})`);
      }
      return await response.json();
    }
    async function persistOnboardingRole(accessToken, role) {
      const apiBaseUrl = normalizeApiBaseUrl(
        (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'loadEnv'
        ])().API_BASE_URL,
      );
      const response = await fetch(`${apiBaseUrl}/api/platform/onboarding/role`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          role,
        }),
        cache: 'no-store',
      });
      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || `Failed to persist role (${response.status})`);
      }
    }
  },
  '[project]/apps/seven-rc-web/lib/current-user-role.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['getCurrentUserRole', () => getCurrentUserRole]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+nextjs@6.37.5_next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwrigh_7fc3a0f00d05671a4e13335581eb0f57/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+nextjs@6.37.5_next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwrigh_7fc3a0f00d05671a4e13335581eb0f57/node_modules/@clerk/nextjs/dist/esm/app-router/server/currentUser.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/lib/role.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__isSevenReservationsClubRole__as__isAppRole$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-rsc] (ecmascript) <export isSevenReservationsClubRole as isAppRole>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$platform$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/lib/platform-api.ts [app-rsc] (ecmascript)',
      );
    async function getCurrentUserRole() {
      const { userId, getToken } = await (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'auth'
      ])();
      if (!userId) {
        return {
          role: null,
          source: 'none',
        };
      }
      const tokenTemplate = process.env.CLERK_JWT_TEMPLATE;
      const token = tokenTemplate
        ? await getToken({
            template: tokenTemplate,
          })
        : await getToken();
      if (token) {
        try {
          const payload = await (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$platform$2d$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
            'fetchPlatformMe'
          ])(token);
          const backendRole = (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
            'extractSevenReservationsClubRoleFromMePayload'
          ])(payload);
          if (backendRole) {
            return {
              role: backendRole,
              source: 'backend',
            };
          }
        } catch {
          // Fall back to Clerk metadata when backend is unavailable.
        }
      }
      const user = await (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$currentUser$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'currentUser'
      ])();
      const clerkRole = user?.publicMetadata?.role;
      if (
        (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__isSevenReservationsClubRole__as__isAppRole$3e$__[
          'isAppRole'
        ])(clerkRole)
      ) {
        return {
          role: clerkRole,
          source: 'clerk',
        };
      }
      return {
        role: null,
        source: 'none',
      };
    }
  },
  '[project]/apps/seven-rc-web/app/page.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['default', () => HomePage]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+nextjs@6.37.5_next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwrigh_7fc3a0f00d05671a4e13335581eb0f57/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i('[project]/packages/ui/src/index.ts [app-rsc] (ecmascript) <locals>');
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/ui-web/src/index.ts [app-rsc] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/image.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$current$2d$user$2d$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/lib/current-user-role.ts [app-rsc] (ecmascript)',
      );
    const AUDIENCES = [
      {
        title: 'Si juegas',
        steps: [
          'Busca el complejo por nombre o dirección.',
          'Elige cancha, día y uno de los horarios libres.',
          'Sigue tu reserva hasta que el complejo la confirme.',
        ],
      },
      {
        title: 'Si administras un complejo',
        steps: [
          'Publica tus canchas con sus horarios de apertura.',
          'Confirma o rechaza cada solicitud desde una sola lista.',
          'Revisa la agenda del día en la hora de tu complejo.',
        ],
      },
    ];
    /** Sign-up that lands on role onboarding with the matching option pre-selected. */ const signUpFor =
      (rol) => `/sign-up?redirect_url=${encodeURIComponent(`/onboarding/role?rol=${rol}`)}`;
    const PREVIEW_SLOTS = [
      {
        time: '6:00 p. m.',
        free: false,
      },
      {
        time: '7:00 p. m.',
        free: true,
        selected: true,
      },
      {
        time: '8:00 p. m.',
        free: true,
      },
      {
        time: '9:00 p. m.',
        free: false,
      },
    ];
    /**
     * Illustration of the booking step: free slots are chosen, taken ones are crossed out.
     * Drawn flat on a tinted plate, with no button shapes or pointer affordances, so it reads
     * as a picture of the product rather than a control on this page.
     */ function SlotPreview() {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'figure',
        {
          className:
            'm-0 grid gap-[var(--spacing-sm)] border-t border-border-default pt-[var(--spacing-lg)] lg:border-l lg:border-t-0 lg:pl-[var(--spacing-xl)] lg:pt-0',
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                'aria-hidden': true,
                inert: true,
                className:
                  'pointer-events-none grid select-none gap-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-background/70 p-[var(--spacing-md)]',
                children: [
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'p',
                    {
                      className: 'm-0 font-arvo text-md leading-[1.3] text-text',
                      children: 'Cancha 2 · Fútbol 5',
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                      lineNumber: 52,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'p',
                    {
                      className: 'm-0 text-sm leading-[18px] text-muted',
                      children: 'Sábado · hora del complejo',
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                      lineNumber: 53,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'div',
                    {
                      className: 'grid grid-cols-2 gap-[var(--spacing-xs)]',
                      children: PREVIEW_SLOTS.map((slot) =>
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          'span',
                          {
                            className: (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                              'cx'
                            ])(
                              'flex min-h-9 items-center justify-center gap-xs rounded-[var(--radius-sm)] px-2 text-sm tabular-nums',
                              !slot.free && 'text-muted line-through',
                              slot.free &&
                                !('selected' in slot) &&
                                'bg-surface font-bold text-text',
                              'selected' in slot && 'bg-action-primary-soft font-bold text-text',
                            ),
                            children: [
                              'selected' in slot
                                ? /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                    'jsxDEV'
                                  ])(
                                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                      'CheckCircle2'
                                    ],
                                    {
                                      size: 14,
                                      'aria-hidden': true,
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                      lineNumber: 65,
                                      columnNumber: 37,
                                    },
                                    this,
                                  )
                                : null,
                              slot.time,
                            ],
                          },
                          slot.time,
                          true,
                          {
                            fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                            lineNumber: 56,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                      lineNumber: 54,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'p',
                    {
                      className: 'm-0 text-sm leading-[18px] text-text',
                      children: [
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          'span',
                          {
                            className: 'font-bold',
                            children: '7:00 p. m.',
                          },
                          void 0,
                          false,
                          {
                            fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                            lineNumber: 71,
                            columnNumber: 11,
                          },
                          this,
                        ),
                        ' · pendiente de confirmación',
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                      lineNumber: 70,
                      columnNumber: 9,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                lineNumber: 47,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'figcaption',
              {
                className: 'text-pretty text-sm leading-[1.45] text-muted',
                children:
                  'Ilustración: así eliges turno. Los ocupados aparecen tachados y solo puedes elegir entre los libres.',
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                lineNumber: 74,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/apps/seven-rc-web/app/page.tsx',
          lineNumber: 46,
          columnNumber: 5,
        },
        this,
      );
    }
    async function HomePage() {
      const { userId } = await (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'auth'
      ])();
      if (userId) {
        const { role } = await (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$current$2d$user$2d$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'getCurrentUserRole'
        ])();
        (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'redirect'
        ])(
          (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
            'getSevenReservationsClubPostAuthPath'
          ])(role),
        );
      }
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'main',
        {
          className: 'relative min-h-screen overflow-clip bg-suit-landing-canvas text-text',
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                'aria-hidden': true,
                className:
                  'pointer-events-none absolute -right-[20vw] -top-[20vw] z-0 h-[min(50vw,620px)] w-[min(50vw,620px)] rotate-[-16deg] rounded-[var(--radius-xl)] bg-ambient-landing-conic',
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                lineNumber: 92,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                'aria-hidden': true,
                className:
                  'pointer-events-none absolute bottom-[-52px] left-[8vw] z-0 h-[130px] w-[min(52vw,680px)] skew-x-[-22deg] bg-ambient-cyan-line',
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                lineNumber: 96,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                className: (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'pageContainerRecipe'
                ])({
                  kind: 'landing',
                }),
                children: [
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'header',
                    {
                      className:
                        'mb-[var(--spacing-lg)] flex flex-col items-start gap-[var(--spacing-md)] md:mb-[var(--spacing-xl)] md:flex-row md:items-center md:justify-between md:gap-[var(--spacing-lg)]',
                      children: [
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                            'default'
                          ],
                          {
                            href: '/',
                            className:
                              'inline-flex flex-col items-start gap-[var(--spacing-sm)] no-underline md:flex-row md:items-center md:gap-[var(--spacing-md)]',
                            children: [
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                  'default'
                                ],
                                {
                                  src: '/logo-17suit@4x.svg',
                                  alt: '17Suit',
                                  width: 196,
                                  height: 62,
                                  className: 'h-[44px] w-auto',
                                  priority: true,
                                },
                                void 0,
                                false,
                                {
                                  fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                  lineNumber: 107,
                                  columnNumber: 13,
                                },
                                this,
                              ),
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                'span',
                                {
                                  className:
                                    'border-l-0 border-border-default pl-0 text-md leading-[1.5] text-muted md:border-l md:pl-[var(--spacing-md)]',
                                  children: 'Seven Reservations Club',
                                },
                                void 0,
                                false,
                                {
                                  fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                  lineNumber: 115,
                                  columnNumber: 13,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                            lineNumber: 103,
                            columnNumber: 11,
                          },
                          this,
                        ),
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          'nav',
                          {
                            'aria-label': 'Cuenta',
                            className: 'hidden gap-[var(--spacing-sm)] md:flex',
                            children: [
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                  'default'
                                ],
                                {
                                  href: '/sign-in?redirect_url=/',
                                  className: (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                    'cx'
                                  ])(
                                    (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                      'buttonRecipe'
                                    ])({
                                      intent: 'secondary',
                                      size: 'sm',
                                      platform: 'web',
                                      fullWidth: false,
                                    }),
                                    'flex-none',
                                  ),
                                  children: 'Iniciar sesión',
                                },
                                void 0,
                                false,
                                {
                                  fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                  lineNumber: 122,
                                  columnNumber: 13,
                                },
                                this,
                              ),
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                  'default'
                                ],
                                {
                                  href: '/sign-up?redirect_url=/',
                                  className: (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                    'cx'
                                  ])(
                                    (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                      'buttonRecipe'
                                    ])({
                                      intent: 'primary',
                                      size: 'sm',
                                      platform: 'web',
                                      fullWidth: false,
                                    }),
                                    'flex-none',
                                  ),
                                  children: 'Crear cuenta',
                                },
                                void 0,
                                false,
                                {
                                  fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                  lineNumber: 136,
                                  columnNumber: 13,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                            lineNumber: 121,
                            columnNumber: 11,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                      lineNumber: 102,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'section',
                    {
                      className:
                        'grid items-center gap-[var(--spacing-xl)] rounded-[var(--radius-xl)] border border-border-default bg-surface-panel p-[clamp(24px,4vw,44px)] shadow-panel backdrop-blur-sm lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]',
                      children: [
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          'div',
                          {
                            className: '@container min-w-0',
                            children: [
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                'h1',
                                {
                                  className:
                                    'm-0 max-w-[18ch] text-balance break-words font-arvo text-[clamp(32px,12cqi,68px)] leading-[1.08] [letter-spacing:-0.015em] text-text',
                                  children: 'Elige el horario libre y reserva tu cancha.',
                                },
                                void 0,
                                false,
                                {
                                  fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                  lineNumber: 150,
                                  columnNumber: 13,
                                },
                                this,
                              ),
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                'p',
                                {
                                  className:
                                    'mt-[var(--spacing-md)] max-w-[56ch] text-pretty text-md leading-[1.5] text-muted',
                                  children:
                                    'Seven Reservations Club muestra los turnos disponibles de cada cancha. Eliges día y hora, el complejo confirma tu reserva y ves el estado en un solo lugar, sin cadenas de mensajes por WhatsApp.',
                                },
                                void 0,
                                false,
                                {
                                  fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                  lineNumber: 154,
                                  columnNumber: 13,
                                },
                                this,
                              ),
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                'div',
                                {
                                  className:
                                    'mt-[var(--spacing-lg)] flex flex-wrap gap-[var(--spacing-sm)]',
                                  children: [
                                    /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                      'jsxDEV'
                                    ])(
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                        'default'
                                      ],
                                      {
                                        href: signUpFor('jugador'),
                                        className: (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                          'cx'
                                        ])(
                                          (0,
                                          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                            'buttonRecipe'
                                          ])({
                                            intent: 'primary',
                                            size: 'lg',
                                            platform: 'web',
                                            fullWidth: false,
                                          }),
                                          'w-full sm:w-auto',
                                        ),
                                        children: 'Reservar una cancha',
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                        lineNumber: 161,
                                        columnNumber: 15,
                                      },
                                      this,
                                    ),
                                    /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                      'jsxDEV'
                                    ])(
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                        'default'
                                      ],
                                      {
                                        href: signUpFor('complejo'),
                                        className: (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                          'cx'
                                        ])(
                                          (0,
                                          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                            'buttonRecipe'
                                          ])({
                                            intent: 'secondary',
                                            size: 'lg',
                                            platform: 'web',
                                            fullWidth: false,
                                          }),
                                          'w-full sm:w-auto',
                                        ),
                                        children: 'Publicar mi complejo',
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                        lineNumber: 175,
                                        columnNumber: 15,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                  lineNumber: 160,
                                  columnNumber: 13,
                                },
                                this,
                              ),
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                'p',
                                {
                                  className:
                                    'mt-[var(--spacing-sm)] text-md leading-[1.5] text-muted',
                                  children: [
                                    '¿Ya tienes cuenta?',
                                    ' ',
                                    /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                      'jsxDEV'
                                    ])(
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                        'default'
                                      ],
                                      {
                                        href: '/sign-in?redirect_url=/',
                                        className:
                                          'inline-flex min-h-11 items-center font-bold text-text underline underline-offset-4',
                                        children: 'Inicia sesión',
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                        lineNumber: 192,
                                        columnNumber: 15,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                  lineNumber: 190,
                                  columnNumber: 13,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                            lineNumber: 149,
                            columnNumber: 11,
                          },
                          this,
                        ),
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          SlotPreview,
                          {},
                          void 0,
                          false,
                          {
                            fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                            lineNumber: 201,
                            columnNumber: 11,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                      lineNumber: 148,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'section',
                    {
                      'aria-label': 'Cómo funciona',
                      className:
                        'mt-[var(--spacing-xl)] grid gap-[var(--spacing-xl)] md:grid-cols-2 md:gap-[var(--spacing-x2l)]',
                      children: AUDIENCES.map((audience) =>
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          'article',
                          {
                            className: 'grid content-start gap-[var(--spacing-sm)]',
                            children: [
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                'h2',
                                {
                                  className:
                                    'm-0 font-amaranth text-[clamp(24px,3vw,30px)] leading-[1.2] text-brand-dark',
                                  children: audience.title,
                                },
                                void 0,
                                false,
                                {
                                  fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                  lineNumber: 210,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                'ol',
                                {
                                  className:
                                    'm-0 grid gap-[var(--spacing-sm)] list-decimal pl-[1.25em] text-pretty text-md leading-[1.5] text-text marker:font-bold marker:text-muted',
                                  children: audience.steps.map((step) =>
                                    /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                      'jsxDEV'
                                    ])(
                                      'li',
                                      {
                                        children: step,
                                      },
                                      step,
                                      false,
                                      {
                                        fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                        lineNumber: 215,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                                  lineNumber: 213,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          audience.title,
                          true,
                          {
                            fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                            lineNumber: 209,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                      lineNumber: 204,
                      columnNumber: 9,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/apps/seven-rc-web/app/page.tsx',
                lineNumber: 101,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/apps/seven-rc-web/app/page.tsx',
          lineNumber: 91,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/apps/seven-rc-web/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)',
  (__turbopack_context__) => {
    __turbopack_context__.n(
      __turbopack_context__.i('[project]/apps/seven-rc-web/app/page.tsx [app-rsc] (ecmascript)'),
    );
  },
];

//# sourceMappingURL=%5Broot-of-the-server%5D__04825bc6._.js.map
