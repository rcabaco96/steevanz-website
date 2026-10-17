---
name: steevanz-entregas
description: How to work and ship in this repo fast and without stepping on other agents — quick checks instead of full builds, one build at a time, branches in git worktrees with Vercel preview links for the owner to approve, and how to publish. Use for any code change that will be deployed, especially when several agents work at once.
---

# Como entregar (rápido e sem atropelos)

Measured 2026-10-18 on this PC: `npx tsc --noEmit -p .` ≈ 4 s (incremental), `npx eslint <file>` ≈ 5 s, `npm test` ≈ 2 s.
What made agents slow was running `next build` (minutes) after every small change, often several at once on the same PC.

## Verificar depressa

1. While iterating: `npx eslint <changed files>`, `npx tsc --noEmit -p .`, `npm test`. Seconds, not minutes.
2. Visual checks: `npx next dev -p <free port>` (never 3112) and Playwright against it. Hot reload, no rebuild.
3. Run `next build` **once**, at the end, before pushing.
4. **One build at a time on this PC.** Before `next build` or `next start`, check that no other is running
   (PowerShell: `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | ? CommandLine -match 'next (build|start|dev)'`).
   If one is, wait for it. Stop the servers you started.

## Trabalhar em paralelo: um ramo e uma pasta por agente

The main working tree is shared: an agent with files half-edited there blocks everyone else's `git pull --rebase`.

1. `git worktree add ..\steevanz-wt\<name> -b <name> origin/main` (outside the repo, so tsc/eslint never see it).
2. In the worktree: `mklink /J node_modules C:\code\steevanz-website\node_modules` (cmd) and copy `.env.local`
   (git-ignored; never print it).
3. Work, check, commit there. `git push -u origin <name>`.
4. **Vercel builds a preview for every branch.** Find its URL with the Vercel API
   (`/v6/deployments?projectId=…&limit=20`, match `meta.githubCommitRef`) and give it to the owner.
   Previews have the Supabase, Resend and admin variables (separate Preview entries in Vercel; checked 2026-10-18), so
   database pages work there too. Treat previews as touching real data.
5. After the owner approves: `git rebase origin/main`, push to `main`, and remove the worktree
   (`git worktree remove …`, `git branch -d <name>`).

Small fixes the owner asked for directly can go straight to `main` from a clean tree.

## Publicar

- Commit messages: one descriptive English line in the repo style, ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. `git add` only your own files.
- `git pull --rebase` before pushing `main` (other sessions push too).
- `main` deploys to www.steevanz.com. Wait for READY (scratchpad `prodwait.mjs` with the commit sha) and check the page on
  production at 360 px.
- Never kill processes you didn't start; never run prettier on whole files; never print secrets.
