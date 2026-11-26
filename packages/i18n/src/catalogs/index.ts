import { common as enCommon } from './en/common';
import { errors as enErrors } from './en/errors';
import { common as esCommon } from './es/common';
import { errors as esErrors } from './es/errors';

export const sharedResources = {
  en: { common: enCommon, errors: enErrors },
  es: { common: esCommon, errors: esErrors },
} as const;

export const SHARED_NAMESPACES = ['common', 'errors'] as const;
export type SharedNamespace = (typeof SHARED_NAMESPACES)[number];
