---
'@dirupt/adonis-lucid-filter': patch
---

Dependency upkeep: every development dependency moves to its latest AdonisJS-compatible version. Peer ranges (`@adonisjs/core ^7.0.0`, `@adonisjs/lucid ^22.0.0`, `lodash ^4.17.21`) and the `type-fest ^5.8.0` runtime dependency are unchanged, so consumers see no new requirement. The published build output is byte-identical to 6.0.3.

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
