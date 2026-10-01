@AGENTS.md

## Claude Code

Everything above is shared with other agents. This section is Claude-specific.

- Rules in `.claude/rules/` load automatically by path; no need to open them manually.
- Hooks in `.claude/settings.json` enforce the Git, label, secret, and destructive-command rules, run ESLint after edits, and type check before you finish. If a hook blocks you, follow its message instead of working around it.
- Invoke workflow skills as slash commands: `/issue`, `/commit`, `/pr`, `/planning`, `/review-diff`.
- Before a PR, run the `reviewer` agent (conventions) and suggest `/review-diff` (defects) for non-trivial changes.
- After editing anything in `.claude/skills/` or `.claude/agents/`, the mirrors for other agents are regenerated automatically by a hook.
