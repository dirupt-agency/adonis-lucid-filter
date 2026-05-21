# Security Policy

## Supported Versions

Only the latest minor release on the `6.x` line receives security updates.

| Version  | Supported          |
| -------- | ------------------ |
| `6.x.x`  | :white_check_mark: |
| `< 6.0`  | :x:                |

For older `adonis-lucid-filter` (pre-fork) versions, please refer to the
upstream repository at https://github.com/lookinlab/adonis-lucid-filter.

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Report security issues privately through GitHub's
[Private Vulnerability Reporting](https://github.com/dirupt-agency/adonis-lucid-filter/security/advisories/new).

If you cannot use GitHub Security Advisories, email `security@dirupt.com`
with the following information:

- A description of the vulnerability and its potential impact
- Steps to reproduce, or a proof-of-concept
- Affected versions
- Any suggested mitigation or fix

### What to expect

- **Acknowledgment**: within 72 hours of your report
- **Initial assessment**: within 7 days
- **Fix and disclosure timeline**: communicated based on severity
- **Credit**: you will be credited in the release notes and the GitHub
  Security Advisory unless you request otherwise

We follow a coordinated disclosure model. Please give us reasonable time
to investigate and ship a fix before public disclosure.

## Supply Chain

This package is built and published via GitHub Actions using npm
[Trusted Publishers](https://docs.npmjs.com/trusted-publishers) over
OpenID Connect, with [npm provenance](https://docs.npmjs.com/generating-provenance-statements)
attestations. No long-lived publish tokens exist for this package.

You can verify the provenance of any published version with:

```bash
npm audit signatures
```
