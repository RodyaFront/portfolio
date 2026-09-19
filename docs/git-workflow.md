# Git workflow

Protects production from broken builds and accidental pushes to `master`.

## Rules

1. **Never commit or push to `master` directly.** Always use a feature branch.
2. **Merge only via pull request.** GitHub ruleset on `master` requires a PR.
3. **CI must pass** before merge: `npm run typecheck` and `npm run generate`.

## Branch naming

```text
feat/...     new site capability
fix/...      bug fix
chore/...    tooling, CI, deps
content/...  copy / case data only
```

## Local setup (once per clone)

```bash
git config core.hooksPath .githooks
```

The `pre-push` hook refuses pushes whose remote ref is `master`.

## Day-to-day

```bash
git checkout master
git pull
git checkout -b feat/short-name
# ... work ...
npm run ci
git push -u origin HEAD
gh pr create
```

After CI is green, merge the PR on GitHub (squash or merge). Do not push to `master`.

## CI

Workflow: `.github/workflows/ci.yml`

| Check | Command |
| --- | --- |
| Typecheck | `npm run typecheck` |
| Static site | `npm run generate` |

Local equivalent: `npm run ci`.

## Production

`master` is the deploy branch. Only green PR merges update it. Broken typecheck or generate fails the required status check and blocks merge.
