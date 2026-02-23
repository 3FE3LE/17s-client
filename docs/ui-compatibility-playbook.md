# UI Compatibility Playbook (17s-client)

## Objetivo

Mantener estable la capa de presentacion mientras crece el producto, usando una base UI compartida y componentes nativos/web solo cuando corresponde.

## Regla principal

- Las apps (`apps/*`) no deben consumir componentes nativos complejos directamente.
- Deben usar wrappers de `@17suit/ui`.
- Si hace falta un componente especial, se crea en `@17suit/ui` con:
  - `index.native.tsx` para mobile
  - `index.tsx` para web

## Que va en UI compartida

- Layout base (containers flex simples)
- Tipografia
- Botones simples
- Inputs base
- Tarjetas / divisores / shells

## Que va en wrappers platform-specific

- Select complejos (dropdowns)
- Pickers nativos
- Componentes que dependen de bridge nativo (modales, menus nativos, etc.)
- Interacciones con alto riesgo de incompatibilidad entre web/mobile

## Patron de implementacion recomendado

1. Definir API comun de componente en `@17suit/ui`.
2. Implementar `index.native.tsx` y `index.tsx` con la misma interfaz.
3. Exportar desde `src/index.native.ts` y `src/index.ts`.
4. Consumir solo via `@17suit/ui` desde apps.

## Guardrails de estabilidad

- `Modal` y `ScrollView` estan permitidos en apps y en `@17suit/ui` cuando el runtime esta alineado.
- No mezclar multiples versiones de `react-native` en el monorepo. Mantener una sola version efectiva.
- Evitar importar stacks o helpers internos fuera de `@17suit/ui`.
- Validar siempre:
  - `pnpm run typecheck` en `packages/ui`
  - `pnpm exec tsc --noEmit` en app impactada
  - `pnpm --filter <app> why react-native` para confirmar una sola version resuelta

## Diagnostico rapido de errores bridge (Android/iOS)

- Errores tipo `cannot be cast` o `View config getter... undefined` suelen indicar:
  - prop con tipo incorrecto cruzando bridge
  - modulo nativo no estable/linkeado en runtime actual
  - mismatch de versiones de `react-native` o runtime desalineado

## Decision de diseño

- Si una variante nativa no es estable hoy, se prioriza:
  - fallback estable en native (aunque sea menos fancy)
  - y se conserva API comun para evolucionar luego sin romper apps.

## Navegacion (tabs / sidebar)

- Las tabs se pueden usar como router principal en mobile (`expo-router` + tab bar).
- Para web o tablet, el mismo modelo de rutas puede renderizarse como sidebar manteniendo URLs y estado.
- Recomendacion:
  - definir rutas una vez (source of truth)
  - mapear presentacion por plataforma (`tabs` en mobile, `sidebar` en web/tablet)
  - mantener la misma API de navegacion en `@17suit/ui` para no duplicar logica de negocio
