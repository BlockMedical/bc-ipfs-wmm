# Merge Runbook — Land the Dependabot fix on `master`

Run these in your authenticated terminal (this step needs your GitHub credentials, so it can't be
done from the Cowork sandbox). Repo:
`~/Developer/wireless-medical-workspace/bc-ipfs-wmm-work`

The merge is a verified clean fast-forward (`master` is a direct ancestor of the fix branch) — no
conflicts. Fix branch already audits clean in production and builds.

---

## 0. Commit the remediation docs (so the record lands in GitHub)

```bash
cd ~/Developer/wireless-medical-workspace/bc-ipfs-wmm-work
git checkout security/07-ipfs-app-hardening-ci-2026-07-10
git add SECURITY-REMEDIATION-2026-07.md MERGE-RUNBOOK-2026-07.md
git commit -m "docs: security remediation record for Jul 2026 Dependabot alerts"
git push origin security/07-ipfs-app-hardening-ci-2026-07-10
```

## Option A — Pull Request (preferred: reviewable, CI audit runs)

```bash
# opens a PR from the fix branch into master
gh pr create \
  --base master \
  --head security/07-ipfs-app-hardening-ci-2026-07-10 \
  --title "security: resolve Jul 2026 Dependabot alerts (webpack5/babel7/web3 modernization)" \
  --body-file SECURITY-REMEDIATION-2026-07.md
```

Then: let `.github/workflows/security.yml` (npm audit gate) pass, run the runtime smoke test
(IPFS upload/download + wallet flows against the live container), and **Merge** the PR in the
GitHub UI. Use a merge/fast-forward — avoid squash so the eight remediation commits stay intact.

## Option B — Direct fast-forward push (no review)

```bash
cd ~/Developer/wireless-medical-workspace/bc-ipfs-wmm-work
git fetch origin
git checkout -B master origin/master
git merge --ff-only security/07-ipfs-app-hardening-ci-2026-07-10
git push origin master
```

## 1. Close the superseded Dependabot auto-PRs

The comprehensive fix supersedes these partial ones — close them to stop the noise:

```bash
gh pr list --state open --search "author:app/dependabot"
# then, for each stale PR number N:
gh pr close N --comment "Superseded by security/07-ipfs-app-hardening-ci-2026-07-10 (comprehensive dependency modernization)."
```

Branches to expect: `crypto-js-3.2.1`, `jquery-3.5.0`, `postcss-and-css-loader-7.0.39`,
`ansi-html-and-webpack-dev-server--removed`.

## 2. Verify alerts clear

- After the merge, Dependabot re-scans `master` and auto-closes the resolved alerts (minutes).
- Confirm at: `https://github.com/BlockMedical/bc-ipfs-wmm/security/dependabot`
- Expected residual: `elliptic` low-severity (no upstream fix) — accepted.

## 3. Sync the off-Mac mirror (per workspace CLAUDE.md)

```bash
rsync -a -i --exclude='.DS_Store' --exclude='node_modules/' --exclude='.build/' \
  --exclude='gh_*' --exclude='BlockMed-iOS/build/' --exclude='BlockMed-iOS/Pods/' \
  ~/Developer/wireless-medical-workspace/ ~/Projects/Wireless-Medical-GitHub/
```
