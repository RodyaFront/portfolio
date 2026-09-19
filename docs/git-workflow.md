# Git workflow

Convention for humans and agents. Not a hard GitHub lock on `master` - follow it anyway so prod stays green.

## Rules

1. **Never commit or push to `master` directly.** Always use a feature branch.
2. **Ship via pull request.** Open a PR into `master`; do not push the deploy branch yourself.
3. **Run CI before merge.** Wait for the `generate` check (typecheck + `nuxt generate`), or run `npm run ci` locally first.

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

Optional safety net: `pre-push` refuses a direct push whose remote ref is `master`.

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

After CI is green, merge the PR on GitHub. Do not push to `master`.

## CI

Workflow: `.github/workflows/ci.yml`

| Check | Command |
| --- | --- |
| Typecheck | `npm run typecheck` |
| Static site | `npm run generate` |

Local equivalent: `npm run ci`.

## Production

`master` is the deploy branch. Prefer only green PR merges. Broken typecheck or generate fails the PR check - do not merge red CI.
