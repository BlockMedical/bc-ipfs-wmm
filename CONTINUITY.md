# Current IPFS maintenance status

Last reconciled: August 15, 2026, on the home Mac

## Current state

- Canonical repository: `BlockMedical/bc-ipfs-wmm`
- Canonical branch: `master`
- GitHub is the cross-Mac source of truth. The active local checkout is
  `~/Developer/wireless-medical-workspace/bc-ipfs-wmm-work`.
- The dependency modernization merged through PR #33, the maintained Kubo
  client and audit gate merged through PR #37, the `fast-uri` fix merged
  through PR #39, and the IPFS API loopback restriction merged through PR #19.
- No production deployment or release was performed as part of the August 15
  synchronization recovery.

## August 15 checkout recovery

The home-Mac checkout had remained at `90412d2` since July 25. An August 4
assessment found it six commits behind, but deliberately made no change because
four untracked files required an owner decision. A fresh GitHub fetch on August
15 showed a ten-commit fast-forward to `854ac1f` because four more commits had
landed in the meantime.

The checkout did not update automatically for two separate reasons:

1. The repository-managed agent startup hook refreshes only the canonical
   documentation repository. Project repositories are fetched and
   fast-forwarded only when the task runs `start-session.sh <scope>`; this
   repository requires scope `ipfs` or `all`.
2. The IPFS checkout contained two `.DS_Store` files and two untracked July 20
   remediation records. The scoped synchronizer is intentionally fail-closed,
   so any dirty repository prevents every working-tree change.

Recovery preserved the two Markdown records on branch
`recovery/ipfs-sync-2026-08-15`, marked them historical, moved the Finder
metadata out of the checkout, and fast-forwarded `master` without a reset,
merge conflict, or discarded source change. `.DS_Store` is now ignored to
prevent the same false-dirty condition.

## Required session workflow

At the start of every IPFS task on either Mac, run:

```bash
./wmm-blockmed-audit-docs/scripts/start-session.sh ipfs
```

At the end, run:

```bash
./wmm-blockmed-audit-docs/scripts/end-session.sh ipfs
```

There is no background mirroring between Macs. GitHub synchronization is
attested only when the scoped closeout reports a clean manifest branch at
exactly `0/0` against a successful fetch.

## Next action

Before any future release, exercise file upload and pinning against a
non-production Kubo daemon. Do not infer runtime readiness from dependency and
build checks alone.
