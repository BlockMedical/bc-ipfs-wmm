# HISTORICAL EVIDENCE ONLY — NOT CURRENT STATE

Preserved from an untracked July 20, 2026 session artifact during the
August 15, 2026 checkout recovery. The pending merge described below completed
through PR #33, and later dependency work completed through PRs #37 and #39.
Use `CONTINUITY.md` on `master` for current state.

# Security Remediation — Dependabot Alerts (July 2026)

**Repo:** BlockMedical/bc-ipfs-wmm
**Trigger:** GitHub Dependabot digest, week of Jul 7–14 2026 (24 vulnerable dependencies in `bc-ipfs/package-lock.json`)
**Remediation branch:** `security/07-ipfs-app-hardening-ci-2026-07-10` (cumulative tip of `security/01…07-*-2026-07-10`)
**Status:** Fixed in code and verified. Pending merge to `master`.
**Verified:** Jul 20, 2026

---

## Summary

All 24 flagged vulnerabilities were remediated on July 10, 2026 through a dependency/toolchain
modernization (removing `node-forge`/`request`, upgrading web3, migrating to webpack 5, Babel 7,
PostCSS 8, and a modern ipfs-http-client). That work was pushed to `origin` across seven
`security/*-2026-07-10` branches but **never merged into `master`**, which is the branch Dependabot
scans. As a result the alerts continued to fire against the unchanged (June 24) `master` lockfile.

Merging `security/07-ipfs-app-hardening-ci-2026-07-10` into `master` resolves them. The merge is a
clean **fast-forward** (master is a direct ancestor), so there are no conflicts.

## Verification (Jul 20, 2026)

Performed on a clean checkout of the remediation branch (`npm ci` from lockfile):

- **Production audit** (`npm audit --omit=dev`): **0 vulnerabilities.**
- **Full audit** (incl. dev/build deps): 6 **low**-severity, all transitive `elliptic` (via
  `create-ecdh`). `elliptic@6.6.1` is the latest release — no upstream fix exists (matches the
  email's "elliptic ≤ 6.6.1, no fix available"). Dev/build-time only; not shipped to users.
- **Production build** (`npm run build`, webpack 5): **succeeds.** Only non-blocking bundle-size
  performance warnings.

> Runtime smoke test still recommended before/after merge: IPFS upload/download and wallet flows
> against the live IPFS container, which cannot be exercised in CI.

## What changed (fix branch commits landing on master)

```
dd83e55 build: replace config-webpack with native config injection
f36e14d security: modernize IPFS client and enforce CI audit
1793b14 build: migrate Babel 6 to Babel 7
de2ead8 build: migrate CSS minification to PostCSS 8
e26ab24 build: migrate to webpack 5 and dev-server 6
3dfa958 security: patch node-forge with RSA compatibility test
d1edd6c security: upgrade web3 and remove swarm chain
703cad1 security: patch request transitive vulnerabilities
```

Also adds `.github/workflows/security.yml` — a CI `npm audit` gate so future regressions are caught
on PRs instead of weeks later by email.

## Dependency resolution (all 24 from the digest)

| Dependency | Vulnerable range (CVEs) | Resolution on fix branch |
|-----------|--------------------------|--------------------------|
| node-forge | < 1.0.0 (13 CVEs incl. CVE-2026-33896) | Removed |
| loader-utils | < 1.4.1 (CVE-2022-37601, Critical) | Removed |
| json5 | < 1.0.2 (CVE-2022-46175) | Removed |
| request | ≤ 2.88.2 (deprecated) | Removed |
| serialize-javascript | < 2.1.1 (3 CVEs) | 7.0.7 |
| tough-cookie | < 4.1.3 (CVE-2023-26136) | Removed |
| postcss | < 8.4.31 (CVE-2023-44270, CVE-2026-41305) | 8.5.16 |
| crypto-js | < 4.2.0 (CVE-2023-46233, Critical) | 4.2.0 |
| webpack-dev-middleware | ≤ 5.3.3 (CVE-2024-29180) | 8.0.3 |
| babel-traverse | < 7.23.2 | Removed (→ @babel/traverse) |
| tar | < 6.2.1 (8 CVEs, 2026) | Removed |
| ip | ≤ 2.0.1 (no fix) | Removed |
| braces | < 3.0.3 (CVE-2024-4068) | 3.0.3 |
| micromatch | < 4.0.8 (CVE-2024-4067) | 4.0.8 |
| webpack-dev-server | ≤ 5.2.0 (4 CVEs) | 6.0.0 |
| form-data | < 2.5.4 (CVE-2025-7783, Critical) | Removed |
| web3-core-subscriptions | ≤ 2.0.0-alpha.1 (no fix) | Removed |
| bootstrap | 1.4.0–3.4.1 | Removed |
| qs | < 6.14.1 (CVE-2025-15284) | 6.15.2 |
| elliptic | ≤ 6.6.1 (no fix) | 6.6.1 (latest — residual, dev-only) |
| bn.js | < 4.12.3 (CVE-2026-2739) | 4.12.3 |
| uuid | < 11.1.1 (CVE-2026-41907) | Removed |
| http-proxy-middleware | < 2.0.10 (CVE-2026-55602) | 4.2.0 |
| js-yaml | < 3.15.0 (CVE-2026-53550) | Removed |

## Residual / accepted risk

- `elliptic@6.6.1`: 6 low-severity advisories, no upstream patch, build-time transitive only.
  Accepted; monitor for a future release.

## How to land (see MERGE-RUNBOOK-2026-07.md)

1. Merge `security/07-ipfs-app-hardening-ci-2026-07-10` → `master` (fast-forward) — via PR (preferred)
   or direct push.
2. Close the four superseded Dependabot auto-PRs.
3. Confirm `.github/workflows/security.yml` runs on master PRs.
