// Codex PreToolUse: .claude/hooks의 Bash guard를 그대로 재사용한다.
// guard가 exit 2로 막으면, Codex가 이해하는 deny JSON으로 바꿔서 돌려준다.
//
// 파일 편집 hook(eslint, 파일 보호, 타입 체크)은 연결하지 않는다. Codex는 파일을 apply_patch로
// 수정해서 Claude의 Edit/Write 입력 형식과 맞지 않는다.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const input = readFileSync(0, "utf8");

const GUARDS = ["guard-git.mjs", "guard-commands.mjs", "guard-github.mjs", "guard-secrets.mjs"];

for (const guard of GUARDS) {
  const result = spawnSync("node", [join(root, ".claude/hooks", guard)], {
    input,
    env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    encoding: "utf8",
  });
  if (result.status === 2) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: result.stderr.trim(),
        },
      }),
    );
    process.exit(0);
  }
}
