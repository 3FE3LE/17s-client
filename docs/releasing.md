# Releasing

`development` → `preview` → `production`, always through pull requests.

| Branch        | History               | How changes arrive                           |
| ------------- | --------------------- | -------------------------------------------- |
| `development` | merge commits allowed | feature PRs, hotfix sync PRs                 |
| `preview`     | linear                | promotion PR from `release.sh`               |
| `production`  | linear                | promotion PR from `release.sh`, or hotfix PR |

Each promotion is one commit with exactly the tree that was on the source branch, so what was
validated on `preview` is what reaches `production`.

## Promote

```bash
./tooling/scripts/release.sh development preview v0.4.2-rc.1 --dry-run
./tooling/scripts/release.sh development preview v0.4.2-rc.1
# wait for `quality`, squash-merge the PR (keep the title), then:
./tooling/scripts/release.sh tag preview v0.4.2-rc.1

./tooling/scripts/release.sh preview production v0.4.2
# wait for `quality`, squash-merge the PR (keep the title), then:
./tooling/scripts/release.sh tag production v0.4.2
```

`quality` runs on the PR. The `build` job runs after the merge, on the push to `preview` or
`production`, so check it on `preview` before promoting to `production`.

Both rulesets must require the check named `quality` (GitHub Actions). `CI / quality` is only how
the UI displays it, and a rule with that name can never pass.

## Hotfixes

1. Branch off `production`, open a PR to `production`, squash-merge it.
2. Bring it into `development` before the next promotion:

   ```bash
   git fetch origin
   git switch -c chore/sync-<hotfix> origin/development
   git cherry-pick <squashed hotfix sha>
   git merge -s ours origin/production -m "chore(sync): record production hotfix"
   ```

   The cherry-pick carries the content. The `ours` merge only records that `production` is
   contained, which is what `release.sh` checks. Never run that merge without first
   cherry-picking every hotfix that is missing from `development`.

3. Open a PR to `development` and merge it with a **merge commit**. Squash or rebase drops the
   record and the next promotion will be refused.

`preview` receives the hotfix with the next promotion.

## When `release.sh` refuses

- **"has changes that are not in development":** someone changed `preview` directly. Bring the
  change into `development`, then promote `development` again.
- **"has changes that this promotion would revert":** `preview` is older than `production`, or a
  hotfix was not synced. Follow [Hotfixes](#hotfixes) if needed, promote to `preview`, then to
  `production`.
