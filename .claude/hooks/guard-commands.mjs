// PreToolUse(Bash): 되돌릴 수 없는 명령을 막는다.
//
// 기준은 "위험해 보이는가"가 아니라 "되돌릴 수 있는가"다. `rm -rf .next`는 다시 빌드하면 되니
// 막지 않는다. 그런 것까지 막으면 hook을 끄게 되고, 그러면 정작 위험한 명령도 같이 열린다.
// (force push는 guard-git.mjs에서 막는다)
import { block, readInput, stripMessages } from "./lib.mjs";

const input = readInput();
const command = stripMessages(input.tool_input?.command ?? "");
if (!command) process.exit(0);

const RULES = [
  [/\bsudo\s+rm\b/, "관리자 권한 삭제는 되돌릴 수 없습니다. 필요하면 사용자가 직접 실행하도록 안내하세요."],
  [/(?:^|\s)dd\s+if=/, "dd는 대상을 덮어씁니다."],
  [/(?:^|\s)mkfs/, "파일시스템을 새로 만드는 명령입니다."],
  [/(?:curl|wget)[^|]*\|\s*(?:sudo\s+)?(?:ba|z)?sh\b/, "내려받은 스크립트를 바로 실행합니다. 파일로 받아 내용을 확인한 뒤 실행하세요."],
  [/\bgit\s+reset\s+[^|;&]*--hard\b/, "커밋하지 않은 변경이 사라집니다. `git stash`로 치워두고 진행하세요."],
  [/\bgit\s+clean\s+-[a-zA-Z]*f/, "추적되지 않은 파일이 영구 삭제됩니다. `git clean -n`으로 먼저 확인하세요."],
  [/\bgh\s+api\b[^|;&]*(?:-X|--method)\s*DELETE\b/, "원격 리소스를 삭제합니다. 무엇을 지우는지 확인한 뒤 사용자가 직접 실행하도록 안내하세요."],
  [/\bgh\s+(?:repo|release|secret)\s+delete\b/, "원격 리소스를 삭제합니다. 사용자가 직접 실행하도록 안내하세요."],
];

for (const [pattern, message] of RULES) {
  if (pattern.test(command)) block(`[차단] ${message}`);
}

// rm -r은 대상이 홈, 루트, 현재 디렉터리 전체, .git일 때만 막는다.
const recursiveRm = /(?:^|[\s;&|])rm\s+(?:-[a-zA-Z]*[rR][a-zA-Z]*|--recursive)\s+([^|;&]*)/g;
for (const [, args] of command.matchAll(recursiveRm)) {
  const targets = args.split(/\s+/).filter((arg) => arg && !arg.startsWith("-"));
  if (targets.some((target) => ["/", "/*", "~", "~/", "~/*", "$HOME", ".", "./", "..", "*"].includes(target))) {
    block("[차단] 삭제 대상이 홈, 루트, 현재 디렉터리 전체입니다. 지울 경로를 구체적으로 지정하세요.");
  }
  if (targets.some((target) => /(?:^|\/)\.git\/?$/.test(target))) {
    block("[차단] .git을 지우면 저장소 히스토리가 사라집니다.");
  }
}
