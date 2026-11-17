// PreToolUse(Bash): 이슈·PR 생성 규칙을 강제한다.
//   이슈: Type + Priority 라벨 필수 (.claude/shared/labels.md)
//   PR: Type 라벨 필수, 본문에 연관 이슈 태그(#번호) 필수 (.claude/shared/git-conventions.md)
//       develop → main 릴리즈 PR은 이슈 태그 없이 Type 라벨만 있으면 된다.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { block, currentBranch, projectDir, readInput } from "./lib.mjs";

const input = readInput();
const command = input.tool_input?.command ?? "";

// 명령으로 실행될 때만 본다. `grep "gh pr create" ...`처럼 문자열로 언급만 하는 경우는 제외한다.
const runs = (sub) => new RegExp(`(?:^|[;&|]|\\$\\()\\s*gh\\s+${sub}\\s+create\\b`).test(command);
const kind = runs("issue") ? "issue" : runs("pr") ? "pr" : null;
if (!kind) process.exit(0);

// --flag "a" / --flag 'a' / --flag=a / --flag a 의 값을 모두 꺼낸다.
const optionValues = (names) =>
  [...command.matchAll(new RegExp(`(?:${names})(?:=|\\s+)(?:"((?:[^"\\\\]|\\\\.)*)"|'([^']*)'|([^\\s"']+))`, "g"))].map(
    ([, double, single, bare]) => double ?? single ?? bare,
  );

const labels = optionValues("--label|-l")
  .flatMap((value) => value.split(","))
  .map((label) => label.trim())
  .filter(Boolean);

const has = (category) => labels.some((label) => label.includes(`${category}: `));
const missing = [];
if (!has("Type")) missing.push("Type");
if (kind === "issue" && !has("Priority")) missing.push("Priority");

if (missing.length > 0) {
  block(
    `[차단] ${kind === "issue" ? "이슈" : "PR"}에 필수 라벨(${missing.join(", ")})이 없습니다.\n` +
      "`.claude/shared/labels.md`를 보고 라벨을 고른 뒤 `--label`로 지정하세요. Priority는 사용자에게 물어보세요.",
  );
}

if (kind === "pr") {
  // 릴리즈 PR = develop → main. --head가 없으면 현재 브랜치가 head다.
  const head = optionValues("--head|-H")[0] ?? currentBranch(projectDir(input));
  const isRelease = optionValues("--base|-B").includes("main") && head === "develop";
  if (!isRelease) {
    const bodyFile = optionValues("--body-file|-F")[0];
    const bodyPath = bodyFile && resolve(projectDir(input), bodyFile);
    const body = [
      ...optionValues("--body|-b"),
      bodyPath && existsSync(bodyPath) ? readFileSync(bodyPath, "utf8") : "",
    ].join("\n");

    if (!/(?:^|[^\w&])#\d+\b/.test(body)) {
      block(
        "[차단] PR 본문에 연관 이슈 태그(#번호)가 없습니다. `#️⃣연관된 이슈`에 이슈 번호를 적으세요. 예: #20\n" +
          "작업에 이슈가 없다면 PR을 만들지 말고 사용자에게 `/issue`로 이슈부터 만들자고 안내하세요.",
      );
    }
  }
}
