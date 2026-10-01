// PreToolUse(Bash|Edit|MultiEdit|Write): 시크릿이 새는 두 경로를 막는다.
//   1. 파일에 쓰는 경로: 작성하는 내용에 자격증명 패턴이 있으면 막는다.
//   2. 읽어서 꺼내는 경로: Bash로 .env나 키 파일 내용을 출력하면 막는다.
//      `cat .env` 한 번이면 값이 대화와 로그에 그대로 남고, 실제로는 이쪽이 더 흔한 유출 경로다.
//      (Read 도구로 읽는 것은 settings.json의 permissions.deny가 막는다)
import { basename } from "node:path";
import { block, readInput, stripMessages } from "./lib.mjs";

const input = readInput();
const { tool_name: toolName, tool_input: toolInput = {} } = input;

const SECRET_PATTERNS = [
  /AKIA[0-9A-Z]{16}/,
  /gh[pousr]_[A-Za-z0-9]{36}/,
  /github_pat_[A-Za-z0-9_]{82}/,
  /sk-(?:proj-)?[A-Za-z0-9_-]{40,}/,
  /-----BEGIN\s*(?:RSA\s*|EC\s*|OPENSSH\s*)?PRIVATE KEY-----/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
];

if (["Write", "Edit", "MultiEdit"].includes(toolName)) {
  const name = basename(toolInput.file_path ?? "");
  const written = [toolInput.content, toolInput.new_string, ...(toolInput.edits ?? []).map((edit) => edit.new_string)]
    .filter(Boolean)
    .join("\n");

  const found = SECRET_PATTERNS.find((pattern) => pattern.test(written));
  if (found) {
    block(
      `[차단] ${name}에 API 키나 토큰으로 보이는 값을 쓰려고 했습니다.\n` +
        "비밀 값은 코드에 넣지 말고 환경 변수(.env.local)로 관리하세요. 값 자체는 사용자가 직접 넣도록 안내하세요.",
    );
  }
}

if (toolName === "Bash") {
  const command = stripMessages(toolInput.command ?? "");

  // 값이 비어 있는 템플릿 파일과, 값 없이 키 이름만 뽑는 grep은 허용한다.
  const withoutTemplates = command
    .replace(/\S*\.env\.(?:example|sample|template)\b/g, "")
    .replace(/grep\s+-o\s+(["'])\^\[A-Z_\]\*=\1\s+\S+/g, "");

  const READERS = "(?:cat|head|tail|less|more|bat|xxd|od|strings|base64|cp|scp|sed|awk|grep|source|\\.)";
  const SECRET_FILES = "(?:\\S*\\.env(?:\\.[a-z]+)?|\\S*\\.(?:pem|key|p8|p12|jks|keystore)|\\S*id_(?:rsa|ed25519))";
  const readsSecret = new RegExp(`(?:^|[|;&\\s])${READERS}\\s+(?:[^|;&]*\\s)?["']?${SECRET_FILES}["']?(?=$|[\\s|;&])`);

  if (readsSecret.test(withoutTemplates)) {
    block(
      "[차단] 시크릿 파일을 직접 읽으려 했습니다. 값이 대화와 로그에 그대로 남습니다.\n" +
        "값이 아니라 존재나 형식만 확인하려던 거라면 이렇게 하세요.\n" +
        "  ls -l <file>                   존재 여부\n" +
        "  grep -o '^[A-Z_]*=' <file>     .env의 키 이름만 (값 제외)",
    );
  }
}
