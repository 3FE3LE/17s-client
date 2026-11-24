## Resumen

<!-- Qué cambia y por qué. Enlaza el issue: repo#n -->

## Área

- [ ] web / mobile / paquete compartido
- [ ] contrato de API (`api-schema.ts` regenerado)

## Regresión

<!-- Regla del repo: todo fix de bug entra con el test que fallaba antes del fix. -->

- [ ] No es un fix de bug
- [ ] Es un fix de bug y añade un test de regresión (unit, componente o E2E) que falla sin el fix
- [ ] Es un fix de bug sin test: motivo y issue de seguimiento:

## Verificación

- [ ] `pnpm ready` en verde para el último commit (el hook `pre-push` lo exige)
- [ ] Un solo PR para esta funcionalidad (no hay otro abierto sobre el mismo alcance; si lo hay, extiende esa rama)

- [ ] `pnpm lint && pnpm typecheck`
- [ ] Tests relevantes pasan; la cobertura de dominio y servicios no baja de su umbral

## Capturas (cambios de UI)
