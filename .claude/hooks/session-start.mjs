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

if (!existsSync(`${root}/node_modules`)) {
  notes.push("node_modules가 없습니다. lint, 타입 체크 hook이 동작하지 않으니 `npm install`이 필요하다고 안내하세요.");
}

process.stdout.write(notes.join("\n"));
