// .claude/의 스킬과 에이전트를 다른 에이전트용으로 복사·변환한다.
//   .claude/skills/<name>/   → .agents/skills/<name>/   (Codex 등)
//   .claude/agents/<name>.md → .codex/agents/<name>.toml (Codex)
//
// 원본은 항상 .claude/ 쪽이다. 생성된 파일을 직접 고치면 다음 실행 때 덮어써진다.
// 사용법: node .claude/scripts/sync-agents.mjs [--check]
//   --check: 파일을 쓰지 않고, 미러가 원본과 다르면 exit 1
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const check = process.argv.includes("--check");

const GENERATED_NOTE = (source) =>
  `<!-- Generated from ${source} by .claude/scripts/sync-agents.mjs. Edit the source, not this file. -->`;

function splitFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { fields: [], body: text };
  const fields = match[1].split("\n").map((line) => {
    const index = line.indexOf(":");
    return index === -1 ? [line, null] : [line.slice(0, index).trim(), line.slice(index + 1).trim()];
  });
  return { fields, body: match[2] };
}

// Claude 전용 문법을 다른 에이전트도 이해하는 형태로 바꾼다.
function convertSkill(text, name) {
  const { fields, body } = splitFrontmatter(text);
  const userOnly = fields.some(([key, value]) => key === "disable-model-invocation" && value === "true");

  const converted = fields
    .filter(([key]) => key !== "disable-model-invocation")
    .map(([key, value]) => {
      if (value === null) return key;
      if (key === "description" && userOnly) return `${key}: ${value} Only run when the user explicitly asks for it.`;
      if (key === "allowed-tools") {
        // Codex에는 질문 도구와 subagent 도구가 없다.
        const tools = value.split(/,\s*/).filter((tool) => !["AskUserQuestion", "Agent"].includes(tool));
        return `${key}: ${tools.join(", ")}`;
      }
      return `${key}: ${value}`;
    });

  const convertedBody = body.replaceAll("${CLAUDE_SKILL_DIR}", `.agents/skills/${name}`);
  return `---\n${converted.join("\n")}\n---\n\n${GENERATED_NOTE(`.claude/skills/${name}/`)}\n${convertedBody}`;
}

function convertAgent(text, name) {
  const { fields, body } = splitFrontmatter(text);
  const field = (key) => fields.find(([k]) => k === key)?.[1] ?? "";
  const tools = field("tools").split(/,\s*/);
  const canEdit = tools.some((tool) => ["Edit", "Write", "MultiEdit"].includes(tool));
  if (body.includes("'''")) throw new Error(`${name}.md 본문에 ''' 가 있어 TOML literal string으로 변환할 수 없습니다.`);

  return [
    `# Generated from .claude/agents/${name}.md by .claude/scripts/sync-agents.mjs. Edit the source, not this file.`,
    `name = "${name}"`,
    `description = '''${field("description")}'''`,
    `model_reasoning_effort = "medium"`,
    `sandbox_mode = "${canEdit ? "workspace-write" : "read-only"}"`,
    `developer_instructions = '''`,
    body.trim(),
    `'''`,
    "",
  ].join("\n");
}

function build(outRoot) {
  const skillsSrc = join(root, ".claude/skills");
  const skillsOut = join(outRoot, ".agents/skills");
  rmSync(skillsOut, { recursive: true, force: true });
  for (const name of readdirSync(skillsSrc)) {
    const src = join(skillsSrc, name);
    if (!existsSync(join(src, "SKILL.md"))) continue;
    cpSync(src, join(skillsOut, name), { recursive: true });
    writeFileSync(join(skillsOut, name, "SKILL.md"), convertSkill(readFileSync(join(src, "SKILL.md"), "utf8"), name));
  }

  const agentsSrc = join(root, ".claude/agents");
  const agentsOut = join(outRoot, ".codex/agents");
  rmSync(agentsOut, { recursive: true, force: true });
  mkdirSync(agentsOut, { recursive: true });
  for (const file of readdirSync(agentsSrc).filter((f) => f.endsWith(".md"))) {
    const name = file.replace(/\.md$/, "");
    writeFileSync(join(agentsOut, `${name}.toml`), convertAgent(readFileSync(join(agentsSrc, file), "utf8"), name));
  }
}

function listFiles(dir, base = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? listFiles(join(dir, entry.name), base) : [relative(base, join(dir, entry.name))],
  );
}

if (check) {
  const temp = mkdtempSync(join(tmpdir(), "sync-agents-"));
  build(temp);
  const stale = [];
  for (const dir of [".agents/skills", ".codex/agents"]) {
    const expected = listFiles(join(temp, dir));
    const actual = listFiles(join(root, dir));
    for (const file of new Set([...expected, ...actual])) {
      const a = join(temp, dir, file);
      const b = join(root, dir, file);
      if (!existsSync(a) || !existsSync(b) || !readFileSync(a).equals(readFileSync(b))) stale.push(`${dir}/${file}`);
    }
  }
  rmSync(temp, { recursive: true, force: true });
  if (stale.length > 0) {
    console.error(`미러가 원본과 다릅니다. \`node .claude/scripts/sync-agents.mjs\`를 실행하세요.\n${stale.join("\n")}`);
    process.exit(1);
  }
  console.log("미러가 최신 상태입니다.");
} else {
  build(root);
  console.log("`.agents/skills`, `.codex/agents`를 다시 생성했습니다.");
}
