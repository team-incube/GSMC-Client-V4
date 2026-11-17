// SessionStart: 현재 브랜치와 의존성 설치 여부를 Claude에게 알려준다.
import { existsSync } from "node:fs";
import { PROTECTED_BRANCHES, currentBranch, projectDir, readInput } from "./lib.mjs";

const input = readInput();
const root = projectDir(input);
const branch = currentBranch(root);
const notes = [`현재 브랜치: ${branch || "(알 수 없음)"}`];

if (PROTECTED_BRANCHES.includes(branch)) {
  notes.push(
    `${branch} 브랜치입니다. 코드를 수정하기 전에 이슈 번호를 확인하고, 작업 브랜치(<type>/<설명>)를 만드세요. 이슈가 없으면 /issue를 먼저 안내하세요.`,
  );
}

// 이 중 하나라도 있으면 Claude Code가 AGENTS.md를 읽지 않는다. (팀 지침이 통째로 빠진다)
const blockers = ["CLAUDE.md", ".claude/CLAUDE.md", "CLAUDE.local.md"].filter((file) => existsSync(`${root}/${file}`));
if (blockers.length > 0) {
  notes.push(
    `[경고] ${blockers.join(", ")} 파일이 있어서 이 프로젝트의 AGENTS.md(팀 지침)가 로드되지 않았습니다. ` +
      "사용자에게 바로 알리고, 이 파일의 내용을 AGENTS.md나 ~/.claude/CLAUDE.md로 옮긴 뒤 삭제하자고 안내하세요. " +
      "그 전까지는 AGENTS.md를 직접 읽고 따르세요.",
  );
}

if (!existsSync(`${root}/node_modules`)) {
  notes.push("node_modules가 없습니다. lint, 타입 체크 hook이 동작하지 않으니 `npm install`이 필요하다고 안내하세요.");
}

process.stdout.write(notes.join("\n"));
