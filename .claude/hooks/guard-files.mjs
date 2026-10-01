// PreToolUse(Edit|Write|MultiEdit): 생성 파일과 환경 변수 파일 편집을 막는다.
import { basename } from "node:path";
import { block, readInput } from "./lib.mjs";

const input = readInput();
const filePath = input.tool_input?.file_path ?? "";
const name = basename(filePath);

if (/(?:^|\/)(?:\.agents\/skills|\.codex\/agents)\//.test(filePath)) {
  block(
    ".agents/skills와 .codex/agents는 .claude/에서 자동 생성되는 미러입니다. " +
      ".claude/skills 또는 .claude/agents의 원본을 수정하세요. 수정하면 미러는 자동으로 다시 생성됩니다.",
  );
}

if (name === "next-env.d.ts") {
  block("next-env.d.ts는 Next.js가 자동 생성하는 파일이라 직접 수정하지 않습니다.");
}

if (name === "package-lock.json") {
  block("package-lock.json은 직접 수정하지 않습니다. `npm install <패키지>`로 의존성을 바꾸세요.");
}

if (/^\.env(\..+)?$/.test(name) && name !== ".env.example") {
  block(`${name}에는 비밀 값이 들어갈 수 있어 수정하지 않습니다. 필요한 변수는 사용자에게 직접 추가하도록 안내하세요.`);
}
