import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  apiPath,
  type ApiInput,
  type ApiRequestBody,
  type ApiResponse,
  type ApiSchema,
} from './api-types';

describe('apiPath', () => {
  it('fills and encodes path parameters', () => {
    expect(apiPath('/7rc/venues/{venueId}/pitches', { venueId: 'a b/c' })).toBe(
      '/7rc/venues/a%20b%2Fc/pitches',
    );
  });

  it('throws when a parameter is missing', () => {
    expect(() => apiPath('/7rc/venues/{venueId}/pitches')).toThrow(/venueId/);
  });
});

describe('contract types', () => {
  it('resolve response and request bodies from the generated schema', () => {
    expectTypeOf<ApiResponse<'/me', 'get'>>().toEqualTypeOf<ApiSchema<'UserProfileResponseDto'>>();
    expectTypeOf<ApiRequestBody<'/platform/onboarding/role', 'post'>>().toEqualTypeOf<
      ApiSchema<'SetRoleDto'>
    >();
  });
});

describe('ApiInput', () => {
  it('lets optional fields take explicit undefined and keeps required ones required', () => {
    type Body = ApiInput<{ id: string; note?: string }>;
    expectTypeOf<{ id: 'x'; note: undefined }>().toMatchTypeOf<Body>();
    expectTypeOf<{ note: string }>().not.toMatchTypeOf<Body>();
  });
});
