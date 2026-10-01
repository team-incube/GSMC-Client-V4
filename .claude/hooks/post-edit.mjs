// PostToolUse(Edit|Write|MultiEdit):
//   - .claude/skills, .claude/agents를 고치면 다른 에이전트용 미러를 다시 생성한다.
//   - 편집한 파일을 eslint로 검사하고, 새로 쓴 코드에 hex 색상이 있으면 경고한다.
import { relative, sep } from "node:path";
import { addContext, block, projectDir, readInput, run } from "./lib.mjs";

const input = readInput();
const filePath = input.tool_input?.file_path ?? "";
const root = projectDir(input);
const relPath = relative(root, filePath).split(sep).join("/");

if (/^\.claude\/(skills|agents)\//.test(relPath)) {
  const { ok, output } = run("node .claude/scripts/sync-agents.mjs", root);
  if (!ok) block(`다른 에이전트용 미러 생성에 실패했습니다.\n${output}`);
  process.exit(0);
}

if (!/\.(tsx?|css)$/.test(filePath)) process.exit(0);

// eslint 설정은 앱마다 있으므로 apps/<app> 안의 파일만 검사한다.
const appMatch = relPath.match(/^(apps\/[^/]+)\/(.+\.tsx?)$/);
if (appMatch) {
  const [, appDir, fileInApp] = appMatch;
  const { ok, output } = run(`npx --no-install eslint "${fileInApp}"`, `${root}/${appDir}`);
  if (!ok) block(`ESLint 오류가 있습니다. 수정하세요.\n${output.slice(0, 4000)}`);
}

// 파일 전체가 아니라 이번에 작성한 코드만 본다. 기존 코드의 위반까지 매번 경고하지 않기 위해서다.
const { content, new_string: newString, edits } = input.tool_input ?? {};
const written = [content, newString, ...(edits ?? []).map((edit) => edit.new_string)]
  .filter(Boolean)
  .join("\n");

if (!relPath.endsWith("theme.css")) {
  const hexColors = [
    ...new Set(written.match(/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g) ?? []),
  ];
  if (hexColors.length > 0) {
    addContext(
      "PostToolUse",
      `[스타일 경고] ${relPath}에 hex 색상(${hexColors.join(", ")})을 직접 썼습니다. ` +
        "theme.css 토큰(text-strong, bg-surface, border-line 등)으로 바꿀 수 있는지 확인하세요. " +
        "토큰에 없는 색이면 사용자에게 토큰 추가 여부를 물어보세요. (.claude/rules/styling.md)",
    );
  }
}
