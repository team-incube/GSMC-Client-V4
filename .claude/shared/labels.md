# Labels

Single source of truth for which labels go on issues and PRs. The label set comes from the org (`team-incube/.github/labels.json`). Use names **exactly** as written here, including emoji.

## Required

| | Required | Also add |
|---|---|---|
| Issue | one **Type** + one **Priority** | the template's **Issue** label, `🌟 Status: To Do` |
| PR | one **Type** | `🌟 Status: Reviewing` |

`.claude/hooks/guard-github.mjs` blocks `gh issue create` / `gh pr create` when a required label is missing.

## Type

Pick exactly one. For PRs, derive it from the commit types on the branch (the dominant one if mixed).

| Label | When | Commit type |
|---|---|---|
| `📩 Type: Feature/Function` | new feature or improvement | `feat`, `refactor`, `chore`, `ci`, `style`, `test` |
| `🐋 Type: Publish` | UI, markup, styling work (퍼블리싱) | `design` |
| `🐞 Type: Bug/Function` | a feature does not work correctly | `fix` (logic) |
| `🪳 Type: Bug/UI` | UI looks or behaves wrong | `fix` (UI only) |
| `📜 Type: Feature/Document` | documentation | `docs` |
| `🪽 Type: Release` | release, `develop` → `main` merge | — |

## Priority

Pick exactly one. **Always ask the user**; never guess. Suggest one with a reason.

| Label | When |
|---|---|
| `⚠️ Priority: Critical` | service is broken or blocked; fix immediately |
| `⚠️ Priority: High` | blocks other work or affects many users |
| `⚠️ Priority: Medium` | normal planned work |
| `⚠️ Priority: Low` | nice to have, can wait |

## Issue (issues only)

Taken from the template's front matter: `🐌 Issue: Bug` for bug reports, `📎 Issue: Feature Request` for feature requests. `❓ Issue: Question` for questions with no template.

## Status

Set at creation only. Later status changes (`🌟 Status: in Progress`, `🌟 Status: Done`, `🌟 Status: Pending`, `🙅🏻‍♀️ Status: Reverted`) are made by people, not by these skills.

## Passing labels

```bash
gh issue create ... --label "📩 Type: Feature/Function" --label "⚠️ Priority: Medium" --label "📎 Issue: Feature Request" --label "🌟 Status: To Do"
gh pr create ... --label "📩 Type: Feature/Function" --label "🌟 Status: Reviewing"
```

If a label is missing from the repo, `gh` fails. Do not create or substitute labels; tell the user which one is missing.
