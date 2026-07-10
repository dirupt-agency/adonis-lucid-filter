---
'@dirupt/adonis-lucid-filter': patch
---

Dependency updates:

- Bump `type-fest` from `^4.21.0` to `^5.8.0`. The only types consumed (`CamelCase`, `SnakeCase`, `Split` in the public `InputObject` type) are unaffected by the v5 breaking changes: `SnakeCase` is untouched, `Split` only changed for non-literal inputs, and `CamelCase`'s `preserveConsecutiveUppercase` flip cannot apply to the snake_case keys it receives. Requires TypeScript >= 5.9, already implied by the toolchain.
- Align `@types/node` with the `engines` floor (`^24` instead of `^25`, Node 25 is EOL and typings should match the minimum supported runtime).
- Refresh transitive dev dependencies to clear npm audit: `@adonisjs/prettier-config` 1.5.0 drops the `prettier-plugin-edgejs`/`lodash-es` chain (GHSA-r5fr-rjxr-66jc, GHSA-f23m-r3pf-42rh) and `js-yaml` moves to patched releases (GHSA-h67p-54hq-rp68). No lockfile is committed, so fresh installs pick these up automatically.

No runtime code changes. `src/types/filter.ts` was reformatted by the updated Prettier config, with identical type semantics.
