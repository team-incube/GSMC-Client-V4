---
name: issue
argument-hint: [bug or feature description]
description: Create a GitHub issue from the team issue templates (bug report or feature request), with the template's title prefix and label.
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash(git branch:*), Bash(git log:*), Bash(git status:*), Bash(git switch:*), Bash(git pull:*), Bash(gh issue create:*), Bash(gh issue list:*)
---

# Create an issue

Templates live in `.github/ISSUE_TEMPLATE/` — the same files GitHub uses for issues opened in the browser.

| Kind | Template | Title prefix | Use when |
|---|---|---|---|
| Bug | `bug-report.md` | `[BUG]` | Something that worked, or should work, behaves wrong |
| Feature | `feature-request.md` | `[Task]` | New work: a page, a feature, an improvement, a refactor |

## 1. Pick the template

Decide from the request. If it is ambiguous (e.g. "로고가 피그마랑 달라요" could be a bug or a design task), ask the user.

## 2. Check for duplicates

```bash
gh issue list --state open --search "<keywords>" --limit 10
```

If a matching open issue exists, show it and ask whether to create a new one anyway.

## 3. Fill the template

Read the template file. Its front matter holds `title` (prefix) and `labels`; the body after the second `---` is what you fill.

- Keep every heading and `---` separator exactly as written, including emoji.
- Replace each `>` guidance quote with real content, in Korean.
- **Title**: `<prefix> <요약>`, e.g. `[BUG] 다크모드에서 헤더 로고가 보이지 않음`, `[Task] 인증제란 페이지 구현`.
- Ground the content in the codebase when it helps: name the affected route, component, or file (`apps/client/src/views/faq/ui/FaqItem.tsx`).

Bug report:
- `🐞 증상`: what the user sees, and what was expected instead.
- `🤔문제 상황`: numbered reproduction steps (route, viewport, light/dark mode, logged in or not).

Feature request:
- `📝 개요`: what to build and why.
- `📆 소요 시간`: ask the user for the expected period if they did not say. Use the template's format: `` `YYYY/MM/DD`~`YYYY/MM/DD` ``.
- `📌 해야 할 일`: concrete, checkable tasks. Split by app or layer when it helps (`views`, `@repo/ui`, API 연동).

Ask the user for anything you cannot fill from the request or the code. Never invent reproduction steps or dates.

## 4. Choose labels

Read `.claude/shared/labels.md`. An issue needs:

- one **Type** label, chosen from the request
- one **Priority** label — **ask the user**, suggesting one with a reason
- the template's **Issue** label. Its front matter writes it as an escaped string: `"\U0001F40C Issue: Bug"` is `🐌 Issue: Bug`, `"\U0001F4CE Issue: Feature Request"` is `📎 Issue: Feature Request`
- `🌟 Status: To Do`

## 5. Create

Show the title, body, and labels, and wait for the user's confirmation.

```bash
gh issue create --title "<title>" --body "<body>" \
  --label "<Type>" --label "<Priority>" --label "<Issue>" --label "🌟 Status: To Do"
```

`.claude/hooks/guard-github.mjs` blocks the command if Type or Priority is missing.

Show the created issue URL.

## 6. Start the branch

Issues come before work (`.claude/shared/git-conventions.md`), so offer to start the branch right away. Propose `<type>/<description>`, e.g. `feat/faq-accordion`, and after the user confirms:

```bash
git switch develop && git pull && git switch -c <type>/<description>
```

Remember the issue number for this session so `/pr` can tag it.

If there are uncommitted changes, ask before switching branches.
