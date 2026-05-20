# Git & Deploy Policy

## Production deploy branch

- Production at **quantumkarma.tech** (Vercel project `prj_0jcaXegKSNQ5IQgNhAJcfkEFZo3k`) deploys from the **`main`** branch.
- Any change the user wants live on production MUST land on `main` (via merge from a feature branch or, when the user explicitly approves, a direct commit).
- Active dev branches like `feat/credit-pricing-system` are NOT auto-deployed to production.

## Default workflow at the end of any task

When the user asks Kiro to "commit and push" — or any phrasing that implies shipping work — Kiro must:

1. Run `git status` in every git repo touched (typically `astro-app` and `astro-emr`).
2. Show the user the list of uncommitted changes BEFORE committing, even ones Kiro didn't author.
3. Commit each logical group with clear messages.
4. Push to the current branch.
5. **Check whether the current branch is `main`.** If NOT:
   - Surface this prominently to the user.
   - Explicitly state: "These changes are on `<branch>` but Vercel deploys from `main`. To go live, we need to merge `<branch>` → `main`."
   - Ask the user whether to:
     - **(a)** Fast-forward merge to `main` and push (ships to production immediately).
     - **(b)** Open a PR for review.
     - **(c)** Leave as-is on the feature branch.
6. NEVER assume the user wants their changes only on a feature branch when they say "push to GitHub" — always confirm production-deploy intent.

## Verification after a production deploy

After pushing to `main`:

1. Confirm the push succeeded.
2. Wait ~2-3 minutes (Vercel build time) and verify on the live URL with cache-busting (`curl -H "Cache-Control: no-cache" "https://quantumkarma.tech/<path>?cb=$(date +%s)"`).
3. Grep for a unique marker from the new code to prove the live site reflects the change.
4. Report verification results back to the user.

## Branch hygiene

- `.gitignore` already excludes `/docs-internal/` (confidential founder docs) and `*.backup.tsx` (local backups).
- These must NEVER be committed.
- New patterns may be added as needed but the existing ones are non-negotiable.

## What NOT to do

- Do not push directly to `main` without explicit user approval (per `git_safety` rules in the system prompt) — except when the user has clearly opted in for direct deploy.
- Do not silently leave uncommitted user changes when a "commit everything" instruction is given — surface them.
- Do not commit `.dashboard.page.backup.tsx` or any `*.backup.*` file.

## astro-emr repo

- `astro-emr` deploys via Emergent's auto-commit pipeline directly to `main`.
- Treat its `main` branch as the production branch for that side.
