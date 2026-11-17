// Stop: 변경된 TS 파일이 속한 앱을 타입 체크하고, 오류가 있으면 Claude가 계속 고치게 한다.
import { block, projectDir, readInput, run } from "./lib.mjs";

const input = readInput();
// 이미 이 hook 때문에 한 번 더 작업한 경우에는 무한 반복을 막기 위해 통과시킨다.
if (input.stop_hook_active) process.exit(0);

const root = projectDir(input);
// --untracked-files=all: 새 폴더 안의 파일도 폴더로 묶지 않고 하나씩 보여준다.
const { ok, output } = run("git status --porcelain --untracked-files=all", root);
if (!ok) process.exit(0);

const changed = output
  .split("\n")
  .map((line) => line.slice(3).split(" -> ").pop().trim())
  .filter((path) => /\.tsx?$/.test(path));
if (changed.length === 0) process.exit(0);

// packages는 앱이 소스 그대로 가져다 쓰므로, 패키지가 바뀌면 두 앱을 모두 검사한다.
const targets = new Set();
for (const path of changed) {
  if (path.startsWith("apps/client/")) targets.add("apps/client");
  if (path.startsWith("apps/admin/")) targets.add("apps/admin");
  if (path.startsWith("packages/")) {
    targets.add("apps/client");
    targets.add("apps/admin");
  }
}

const failures = [];
for (const target of targets) {
  const result = run("npx --no-install tsc --noEmit", `${root}/${target}`);
  if (!result.ok) failures.push(`## ${target}\n${result.output.slice(0, 3000)}`);
}

if (failures.length > 0) {
  block(`타입 오류가 있습니다. 수정한 뒤 마무리하세요.\n\n${failures.join("\n\n")}`);
}
