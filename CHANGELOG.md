# @dirupt/adonis-lucid-filter

## 6.0.3

### Patch Changes

- 0ecbce0: Dependency updates:

  - Bump `type-fest` from `^4.21.0` to `^5.8.0`. The only types consumed (`CamelCase`, `SnakeCase`, `Split` in the public `InputObject` type) are unaffected by the v5 breaking changes: `SnakeCase` is untouched, `Split` only changed for non-literal inputs, and `CamelCase`'s `preserveConsecutiveUppercase` flip cannot apply to the snake_case keys it receives. Requires TypeScript >= 5.9, already implied by the toolchain.
  - Align `@types/node` with the `engines` floor (`^24` instead of `^25`, Node 25 is EOL and typings should match the minimum supported runtime).
  - Refresh transitive dev dependencies to clear npm audit: `@adonisjs/prettier-config` 1.5.0 drops the `prettier-plugin-edgejs`/`lodash-es` chain (GHSA-r5fr-rjxr-66jc, GHSA-f23m-r3pf-42rh) and `js-yaml` moves to patched releases (GHSA-h67p-54hq-rp68). No lockfile is committed, so fresh installs pick these up automatically.

  No runtime code changes. `src/types/filter.ts` was reformatted by the updated Prettier config, with identical type semantics.

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
