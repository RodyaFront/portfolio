# Git workflow

Convention for humans and agents. Not a hard GitHub lock on `master` - follow it anyway so prod stays green.

## Rules

1. **Never commit or push to `master` directly.** Use a **session branch** for an agent chat / stretch of work.
2. **One branch per session, not per micro-feature.** Several related changes in the same session stay on the same `session/...` branch as commits. Do not stash unfinished work just to switch to another feature branch.
3. **Ship via pull request** into `master` when ready.
4. **CI should be green** before merge: `npm run typecheck` and `npm run generate` (or wait for the PR check).

## Branch naming

```text
session/YYYY-MM-DD-short-slug   agent or human work session (preferred)
```

Examples: `session/2026-09-19-header-cases`, `session/2026-09-20-deploy`.

Legacy one-off names (`feat/`, `fix/`, `chore/`, `content/`) are fine only when the user explicitly asks for a dedicated branch.

## Local setup (once per clone)

```bash
git config core.hooksPath .githooks
```

Optional safety net: `pre-push` refuses a direct push whose remote ref is `master`.

## Day-to-day (agent session)

```bash
git checkout master
git pull
git checkout -b session/YYYY-MM-DD-short-slug
# ... all work in this session: commit as you go ...
npm run ci
git push -u origin HEAD
# when user asks to ship:
gh pr create
```

If the session already has a `session/...` branch checked out, keep using it. Do not create `feat/foo` mid-session and stash other edits.

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
