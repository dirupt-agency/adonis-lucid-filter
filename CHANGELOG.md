# @dirupt/adonis-lucid-filter

## 6.0.4

### Patch Changes

- da3218d: Dependency upkeep: every development dependency moves to its latest AdonisJS-compatible version. Peer ranges (`@adonisjs/core ^7.0.0`, `@adonisjs/lucid ^22.0.0`, `lodash ^4.17.21`) and the `type-fest ^5.8.0` runtime dependency are unchanged, so consumers see no new requirement. The published build output is byte-identical to 6.0.3.

  Minor and patch updates, with development floors raised to the tested version:

  - `@adonisjs/assembler` 8.6.0, `@adonisjs/core` 7.6.0, `@adonisjs/eslint-config` 3.1.0, `@adonisjs/lucid` 22.4.2, `@adonisjs/prettier-config` 1.5.0
  - `@japa/runner` 5.4.0, `@poppinss/ts-exec` 1.5.2, `eslint` 10.14.0
  - `@types/lodash` 4.17.27, `@types/node` 24.19.2 (kept on the Node 24 line of `engines`)
  - `better-sqlite3` 12.11.1, `knex` 3.3.0, `lodash` 4.18.1, `luxon` 3.7.2

  Major updates, none of which changes the build or the tests:

  - `typescript` 5.9 to 6.0.3, the version AdonisJS core and Lucid develop on.
  - `tsup` 8 to 9.0.0, no configuration change.
  - `@changesets/cli` 2 to 3.0.3. The release workflow moves to `changesets/action` v2.1.2, because v1 no longer detects what CLI 3 published, which would skip the git tag and the GitHub release.
  - `c8` 11 to 12.0.0 and `del-cli` 7 to 8.0.1.

  Deferred majors, ignored in the new Dependabot configuration until they become compatible:

  - `typescript` 7: 7.0 ships no compiler API, so `typescript-eslint` (peer `<6.1.0`) and `@adonisjs/assembler` (peer `^5.0.0 || ^6.0.0`) cannot load it. To revisit with 7.1.
  - `better-sqlite3` 13: an N-API rewrite that `@adonisjs/lucid` does not test yet (still `^12.11.1`).
  - `@types/node` 26: follows the Node engine, which stays on 24.

  Repository tooling: `actions/checkout` v7.0.1 and `actions/setup-node` v7.1.0, still pinned by SHA, with setup-node caching disabled in the publishing workflow. A weekly Dependabot configuration now covers npm and GitHub Actions, with minor and patch updates grouped and majors in separate pull requests.

  Remaining `npm audit` findings: none in production dependencies. Three development-only advisories need an upstream release and are accepted:

  - `minimatch` 10 (GHSA-g3hv-75wg-m249), pulled by `eslint`, `typescript-eslint`, `@adonisjs/assembler` and `c8`
  - `glob` 13 (GHSA-3g3m-2fjr-6pw4), pulled by `c8` through `test-exclude` 8
  - `deepmerge` 4.3.1 (GHSA-gcqx-w48m-w2h4), pulled by `@adonisjs/lucid`

  The `esbuild` advisory (GHSA-g7r4-m6w7-qqqr) is cleared by `tsup` 9.

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
