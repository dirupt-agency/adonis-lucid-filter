# @dirupt/adonis-lucid-filter

## 6.0.2

### Patch Changes

- b951cb3: Security and resilience hardening:
  - Block lifecycle and internal helpers (`handle`, `setup`, `whitelistMethod`, `$filterByInput`, `$getFilterMethod`, `$methodIsCallable`, `$methodIsBlacklisted`, `constructor`) from being invoked through input keys.
  - Replace `for...in` with `Object.keys()` in `$filterByInput` and `removeEmptyInput` to prevent prototype pollution and guarantee deterministic iteration order.
  - Add an actionable error when `$filter()` is missing on the model (instead of an opaque `TypeError`), via a new `resolveFilter` helper used by both the mixin and the query builder macro.
  - Neutralize non-object input (`null`, arrays, primitives) to an empty object in the constructor.
  - Tighten internal types: `$query` and `setup($query)` now use `ModelQueryBuilderContract<LucidModel, LucidRow>` instead of `any`; the duplicated filter resolution pattern is centralized in `resolveFilter`.
  - Remove the no-op `StaticImplements` decorator.

  No public API changes.

## 6.0.1

### Patch Changes

- 3ea77a5: Internal cleanup and tooling improvements for the Dirupt maintenance fork.
  - Remove unused `@poppinss/hooks` runtime dependency
  - Clean up `.npmrc` (drop pnpm-specific config that triggered npm warnings)
  - Add GitHub Actions CI (lint, typecheck, test on Node 24)
  - Add release workflow via Changesets with npm provenance
  - Replace `np` release tool with Changesets
  - Set `author` to Dirupt (Lookin Anton kept in `contributors`)
  - Add a per-instance `$blacklist` isolation test
  - Document the migration path from `adonis-lucid-filter`
  - Document the `InputObject<>` type helper for input inference
  - Mention Node 24+ and TypeScript strict mode prerequisites
  - Add a CI status badge to the README
