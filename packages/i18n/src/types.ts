/**
 * Same keys as the `en` catalog (source of truth), string leaves.
 * A missing or extra key in another locale fails typecheck.
 */
export type CatalogShape<T> = {
  [K in keyof T]: T[K] extends string ? string : CatalogShape<T[K]>;
};

export type Resources = Record<string, Record<string, object>>;
