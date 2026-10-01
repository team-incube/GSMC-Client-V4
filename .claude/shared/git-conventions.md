# Git conventions

Single source of truth for the work flow, branch names, commit messages, and PR titles. Skills (`issue`, `commit`, `pr`) and `AGENTS.md` refer here; change the rules only in this file.

## Work flow: issue first

Every piece of work starts with an issue, and every PR tags its issue.

1. **Issue** — before writing code, make sure an issue exists. If not, create one with `/issue`.
2. **Branch** — branch from `develop`.
3. **Commits** — `/commit`.
4. **PR** — `/pr` into `develop`, tagging the issue (`#20`) in `#️⃣연관된 이슈`.

The only PR without an issue is the `develop` → `main` release PR (title `merge to main`). It needs only the `🪽 Type: Release` label.

## Branches

```
<type>/<kebab-case-description>
```

- Same `type` vocabulary as commits. e.g. `feat/faq-accordion`, `fix/login-logo`, `design/header-icons`
- The issue number in the branch name is optional (`feat/20-faq-accordion`). If present, `/pr` uses it to tag the issue; otherwise `/pr` finds the issue another way.
- Branch from `develop`, open PRs into `develop`. `main` is updated by merging `develop`.
- Never commit or push directly to `main` or `develop` (enforced by `.claude/hooks/guard-git.mjs`).

## Commit messages

Conventional Commits, description in **Korean**.

```
type(scope): 설명
```

### type

| type | When |
|---|---|
| `feat` | new feature |
| `fix` | bug fix |
| `design` | UI, CSS, layout change with no behavior change |
| `refactor` | restructuring without behavior change |
| `style` | code formatting only (semicolons, indentation). Not for UI changes — use `design` |
| `docs` | documentation |
| `test` | tests |
| `chore` | config, dependencies, build, harness |
| `ci` | CI config |

### scope

`client` / `admin` / `ui` / `lib`, matching the package that changed. Omit it when the change spans multiple packages.

### description

- Korean, no trailing period, max 50 characters.
- End with a noun form: "~구현", "~수정", "~추가", "~조정", "~제거".
- Never end with "~했습니다", "~합니다", "~함", "~하기".
- Add a body only when the reason is not obvious from the subject.
- No AI attribution lines (disabled in `.claude/settings.json`).

### Examples

```
feat(client): FAQ 카테고리 필터 구현
fix(ui): 다크모드에서 헤더 로고 색상 수정
design(client): 로그인 버튼 hover 효과 추가
refactor(lib): queryClient 생성 로직 분리
chore: Claude Code 하네스 설정 추가
```

## PR titles

Same format as a commit message. With several commits, write one title that represents the whole PR.

```
feat(client): FAQ 페이지 구현
```
