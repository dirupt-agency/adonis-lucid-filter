# @dirupt/adonis-lucid-filter

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
