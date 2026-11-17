---
name: pr
description: Build a PR title and body from the current branch's commits using the team PR template, and open a pull request into develop — or a develop → main release PR.
disable-model-invocation: true
allowed-tools: Read, Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(git push:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(gh issue view:*), Bash(gh issue list:*)
---

# Create a PR

If the user asks for a release or "merge to main" (`develop` → `main`), skip to **Release PR** at the end.

## 1. Gather context

```bash
git branch --show-current
git status --porcelain --untracked-files=all
git log origin/develop..HEAD --oneline
git diff origin/develop...HEAD --stat
git diff origin/develop...HEAD
```

- If there are uncommitted changes, ask the user whether to run `/commit` first.
- The base is `develop`. Change it only if the user names another branch.
- If `gh pr view` shows a PR already exists for this branch, show its URL and stop.

## 2. Review

Run the `reviewer` agent on the changes. If it reports violations, show them and ask whether to fix them before continuing.

For non-trivial changes (new data fetching, state logic, auth), suggest `/review-diff` as well. Do not run it automatically; it fans out several subagents.

## 3. Find the related issue

**Every PR must tag its issue** (issue-first flow in `.claude/shared/git-conventions.md`). Only the `develop` → `main` release PR is exempt. Look for the issue number in this order:

1. The branch name (`feat/20-faq-accordion` → `#20`) or commit messages (`#20`)
2. Open issues whose title matches the work: `gh issue list --state open --limit 20`

Confirm with `gh issue view <number>` that it exists and matches the work. If none is found, ask the user for the number. **If there is no issue, stop**: offer to create one with `/issue`, then continue the PR afterwards. Never open a PR without an issue tag; `.claude/hooks/guard-github.mjs` blocks it.

## 4. Write the title and body

**Title**: follow the "PR titles" section of `.claude/shared/git-conventions.md`.

**Body**: read the team template at `.github/PULL_REQUEST_TEMPLATE.md` (the same file GitHub uses for PRs opened in the browser) and fill it in Korean:

- Keep every heading exactly as written, including emoji.
- Replace each `>` guidance quote with real content; delete the `ex)` examples.
- `#️⃣연관된 이슈`: the issue from Step 3, e.g. `#20`.
- `📝작업 내용`: one summary sentence, then the main changes as a list. Explain why, not just what, when the reason is not obvious. Wrap file names, component names, and code in backticks.
- `스크린샷 (선택)`: for UI changes, leave a light/dark placeholder for the user to attach images. Otherwise remove the section.
- `💬리뷰 요구사항(선택)`: what reviewers should look at closely, or known limitations. Remove the section if there is nothing.

## 5. Choose labels

Read `.claude/shared/labels.md`. A PR needs one **Type** label derived from the branch's commit types, plus `🌟 Status: Reviewing`. A `develop` → `main` PR uses `🪽 Type: Release`.

## 6. Create

Show the title, body, and labels, and wait for the user's confirmation.

```bash
git push -u origin HEAD
gh pr create --base develop --title "<title>" --body "<body>" \
  --label "<Type>" --label "🌟 Status: Reviewing"
```

`.claude/hooks/guard-github.mjs` blocks the command if the Type label or the issue tag (`#20`) in the body is missing.

Show the created PR URL.

## Release PR (`develop` → `main`)

A release PR needs **no issue**, only the `🪽 Type: Release` label. The hook exempts it from the issue tag only when the base is `main` and the head is `develop`; a feature branch opened against `main` is still blocked.

1. Collect what is being released:

   ```bash
   git fetch origin
   git log origin/main..origin/develop --merges --oneline
   ```

2. Title: `merge to main` (the team's existing convention).
3. Body: the same template, in Korean.
   - `#️⃣연관된 이슈`: `없음 (릴리즈 PR)`
   - `📝작업 내용`: the PRs included in this release, one per line (`- #19 인증제란 페이지 구현`). Tagging the PR numbers here is fine.
   - Remove the optional sections unless there is something to say.
4. Show the title, body, and label, wait for confirmation, then:

   ```bash
   gh pr create --base main --head develop --title "merge to main" --body "<body>" --label "🪽 Type: Release"
   ```
