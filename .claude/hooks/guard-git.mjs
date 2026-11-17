// PreToolUse(Bash): main/develop 직접 커밋·푸시와 force push를 막는다.
import { PROTECTED_BRANCHES, block, currentBranch, projectDir, readInput, stripMessages } from "./lib.mjs";

const input = readInput();
const command = stripMessages(input.tool_input?.command ?? "");
if (!/\bgit\b/.test(command)) process.exit(0);

// `a && b; c | d` 처럼 이어진 명령을 하나씩 나눠서 본다.
const segments = command.split(/&&|\|\||;|\|/).map((part) => part.trim().split(/\s+/));
const gitSubcommand = (tokens) => {
  const gitIndex = tokens.indexOf("git");
  if (gitIndex === -1) return null;
  const rest = tokens.slice(gitIndex + 1).filter((token) => !token.startsWith("-"));
  return { name: rest[0], args: tokens.slice(gitIndex + 1) };
};

const branch = currentBranch(projectDir(input));
let onProtected = PROTECTED_BRANCHES.includes(branch);

for (const tokens of segments) {
  const sub = gitSubcommand(tokens);
  if (!sub) continue;

  // 같은 명령 안에서 새 브랜치로 옮긴 뒤 커밋하는 경우는 허용한다.
  if ((sub.name === "checkout" && sub.args.includes("-b")) || (sub.name === "switch" && sub.args.includes("-c"))) {
    onProtected = false;
  }

  if (sub.name === "commit" && onProtected) {
    block(
      `현재 브랜치가 ${branch}입니다. ${branch}에는 직접 커밋하지 않습니다.\n` +
        "`git switch -c <type>/<설명>`으로 작업 브랜치를 만든 뒤 커밋하세요.",
    );
  }

  if (sub.name !== "push") continue;

  if (sub.args.some((arg) => arg === "-f" || arg === "--force")) {
    block("force push는 막혀 있습니다. 꼭 필요하면 사용자가 직접 실행하도록 안내하세요.");
  }

  // git push [remote] [refspec...]
  const refspecs = sub.args.filter((arg) => !arg.startsWith("-")).slice(2);
  const targets = refspecs.map((refspec) => refspec.split(":").pop());
  const pushesCurrent = targets.length === 0 || targets.includes("HEAD");

  if (targets.some((target) => PROTECTED_BRANCHES.includes(target)) || (pushesCurrent && onProtected)) {
    block(`${PROTECTED_BRANCHES.join("/")} 브랜치로 직접 push할 수 없습니다. 작업 브랜치에 push하고 PR을 올리세요.`);
  }
}
