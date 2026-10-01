---
name: commit
description: Split changes into logical units and commit them following the team convention (Conventional Commits with Korean descriptions).
disable-model-invocation: true
allowed-tools: Read, Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(git switch:*), Bash(git branch:*)
---

# Commit

Read `.claude/shared/git-conventions.md` first. It defines branch names, commit types, scopes, and message rules.

## 1. Check the branch

```bash
git branch --show-current
```

On `main` or `develop`, never commit. Propose a branch name per the conventions, and after the user confirms, create it with `git switch -c <type>/<description>`.

## 2. Split changes into units

```bash
git status --porcelain --untracked-files=all
git diff
git diff --staged
```

- One commit, one purpose. Split unrelated refactoring out of a feature commit.
- If files are already staged, treat them as an intentional group and commit them together.
- Never commit `.env*`, build output, or personal settings (`settings.local.json`).

## 3. Commit each unit

For each unit:

1. Stage only its files with `git add <file>...`. Never use `git add .` or `git add -A`.
2. Write the message per the conventions.
3. `git commit -m "<message>"`

## 4. Report

Show the result with `git log --oneline -n <count>`. Push only when the user asks.
