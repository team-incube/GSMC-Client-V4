import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

export const PROTECTED_BRANCHES = ["main", "develop"];

export function readInput() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return {};
  }
}

export function projectDir(input) {
  return process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
}

export function run(command, cwd) {
  try {
    return { ok: true, output: execSync(command, { cwd, encoding: "utf8", stdio: "pipe" }) };
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
}

export function currentBranch(cwd) {
  const { ok, output } = run("git branch --show-current", cwd);
  return ok ? output.trim() : "";
}

// 커밋 메시지와 heredoc 본문을 지운다. "git reset --hard 차단 추가" 같은 메시지 때문에
// 커밋 자체가 막히지 않게 하기 위해서다.
export function stripMessages(command) {
  return command
    .replace(/<<-?\s*['"]?(\w+)['"]?[\s\S]*?\n\s*\1\b/g, "")
    .replace(/(?:-m|--message(?:=|\s))\s*(?:"(?:[^"\\]|\\.)*"|'[^']*')/g, "");
}

// exit 2: 도구 실행을 막고(PreToolUse) 또는 Claude에게 고치라고 되돌려준다(PostToolUse, Stop).
export function block(message) {
  process.stderr.write(message);
  process.exit(2);
}

// 막지는 않고 Claude 컨텍스트에만 덧붙인다.
export function addContext(hookEventName, message) {
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName, additionalContext: message } }),
  );
  process.exit(0);
}
