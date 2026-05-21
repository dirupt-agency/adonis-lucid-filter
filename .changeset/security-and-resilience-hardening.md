---
'@dirupt/adonis-lucid-filter': patch
---

Security and resilience hardening:

- Block lifecycle and internal helpers (`handle`, `setup`, `whitelistMethod`, `$filterByInput`, `$getFilterMethod`, `$methodIsCallable`, `$methodIsBlacklisted`, `constructor`) from being invoked through input keys.
- Replace `for...in` with `Object.keys()` in `$filterByInput` and `removeEmptyInput` to prevent prototype pollution and guarantee deterministic iteration order.
- Add an actionable error when `$filter()` is missing on the model (instead of an opaque `TypeError`), via a new `resolveFilter` helper used by both the mixin and the query builder macro.
- Neutralize non-object input (`null`, arrays, primitives) to an empty object in the constructor.
- Tighten internal types: `$query` and `setup($query)` now use `ModelQueryBuilderContract<LucidModel, LucidRow>` instead of `any`; the duplicated filter resolution pattern is centralized in `resolveFilter`.
- Remove the no-op `StaticImplements` decorator.

No public API changes.
