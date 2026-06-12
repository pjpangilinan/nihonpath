# agents.md

> **Canonical reference for all agents operating in this project.**
> Read this file before starting any task.

---

## Table of Contents

1. [Skill Usage](#1-skill-usage)
2. [Shared Handoff File](#2-shared-handoff-file)
3. [Writing Rules](#3-writing-rules)
4. [Before & After Every Task](#4-before--after-every-task)
5. [Context7 Usage Rules](#5-context7-usage-rules)
6. [Serena Usage Rules](#6-serena-usage-rules)
7. [MCP Server Configuration](#7-mcp-server-configuration)

---

## 1. Skill Usage

**Skills must be prioritized over general reasoning or guessing.**
Always check if a skill covers the task before proceeding independently.

### Priority Order

1. **caveman** — use first for any task it covers; minimizes token consumption and keeps responses lean and direct.
2. **frontend-design** — required before designing or modifying any UI; governs typography, spacing, color, and visual intent.
3. **web-design-guidelines** — apply when building or reviewing web layouts, responsive behavior, or accessibility patterns.
4. **frontend-ui-engineering** — apply when implementing components, handling state, or wiring UI logic.
5. **react-best-practices** — apply for all React work: component structure, hooks, performance, and patterns.
6. **react-dev** - use when building React components with TypeScript, typing hooks, handling events.
7. **browser-testing-with-devtools** — apply when debugging, profiling, or verifying front-end behavior in a browser.

### Rules

- **Read the relevant `SKILL.md` before writing any code or producing any file.** This is mandatory, not optional.
- Multiple skills may apply to one task — read all relevant ones.
- Skills encode environment-specific constraints (available libraries, rendering quirks, output paths) that are not in training data; skipping them lowers output quality.
- If a skill exists for the task, do not substitute with general knowledge.
- Record any important skill-derived constraints or findings in `WORKFLOW_STATE.md`.

---

## 2. Shared Handoff File

`WORKFLOW_STATE.md` is the **canonical workflow record** for this project. It is not optional.

### Core Rules

- **Read `WORKFLOW_STATE.md` before starting any work.**
- **Update `WORKFLOW_STATE.md` before finishing any work.**
- Never overwrite another agent's section unnecessarily.
- Preserve all decisions, assumptions, blockers, and next steps written by other agents.
- Do not rely on chat history as the source of truth — `WORKFLOW_STATE.md` is authoritative.

### Sections to Maintain

| Section | Owner | Notes |
|---|---|---|
| `## Status` | All agents | Current phase and active task |
| `## Decisions` | All agents | Architectural and design choices with rationale |
| `## Assumptions` | All agents | What was assumed when ground truth was unclear |
| `## Blockers` | All agents | Unresolved dependencies or problems |
| `## Open Questions` | All agents | Unresolved questions for humans or other agents |
| `## File Map` | All agents | Key file paths and what they do |
| `## Test Commands` | All agents | Exact commands and results |
| `## Handoff Notes` | All agents | Short note for the next agent |

### Update Protocol

1. Read the full file first.
2. Edit only sections relevant to your role and task.
3. Append to existing sections; do not replace unless content is outdated or incorrect.
4. Add a dated handoff note at the top of `## Handoff Notes` before finishing.

---

## 3. Writing Rules

These rules apply to all content written into `WORKFLOW_STATE.md`, comments, and inline documentation.

- **Keep entries short and structured.** One idea per bullet.
- **Prefer bullets over long paragraphs.** Paragraphs are for summaries only.
- **Record file paths when discussing code changes.**
  - ✅ `src/components/Button.tsx — updated variant prop`
  - ❌ "I updated the button component"
- **Record exact test commands and their results.**
  - ✅ `pnpm test --filter=auth → 12 passed, 0 failed`
  - ❌ "Tests pass"
- **Record unresolved questions under `## Open Questions`** with enough context for the next agent or a human to act on them.
- **Never use vague language** like "misc fixes", "minor changes", or "updated stuff".

---

## 4. Before & After Every Task

### Before Starting

1. Read `WORKFLOW_STATE.md` in full.
2. Identify the current status, active blockers, and open questions.
3. Read all relevant `SKILL.md` files for the task at hand.
4. Use Context7 if the task involves external libraries, frameworks, or APIs (see §5).
5. Use Serena if the task requires code navigation or understanding (see §6).

### After Finishing

1. Update only the sections of `WORKFLOW_STATE.md` relevant to your role.
2. Preserve existing content unless it is outdated or clearly incorrect — note why if removing.
3. Add a short handoff note for the next agent:
   - What you did
   - What state things are in
   - What needs to happen next
   - Any open questions or blockers you encountered
4. Record all relevant file paths, commands, and findings.

---

## 5. Context7 Usage Rules

Context7 provides up-to-date, accurate documentation for external libraries and frameworks. **Prefer it over guessing from memory.**

### When to Use Context7

| Situation | Action |
|---|---|
| Proposing a plan that uses an external library | Use Context7 before finalizing the plan |
| Implementing code that calls a third-party API | Use Context7 before writing the implementation |
| Reviewing code for correct API or framework usage | Use Context7 during review |
| Uncertain about library behavior, options, or version differences | Use Context7 immediately |

### Rules

- **Do not guess library behavior from memory.** Training data may reflect an outdated API version.
- Context7 findings that affect implementation decisions must be recorded in `WORKFLOW_STATE.md` under `## Decisions` or `## Assumptions`.
- If Context7 returns conflicting or ambiguous documentation, record it under `## Open Questions`.
- Applies to all external libraries, frameworks, and APIs — including but not limited to: React, Next.js, Tailwind, Vite, testing libraries, ORMs, and cloud SDKs.

---

## 6. Serena Usage Rules

Serena is the semantic code assistant for this project. It provides accurate, symbol-level understanding of the codebase.

### Prefer Serena Over Raw Tools

**Use Serena's MCP tools for:**

- Finding relevant files, modules, and symbols
- Understanding call graphs and data flow relationships
- Tracing where user input flows through the codebase
- Making structured, multi-file edits
- Identifying all usages of a function, type, or variable
- Understanding component hierarchies and dependencies

**Only fall back to raw `grep` / `edit` / `apply_patch` when:**

- Serena tools are clearly not applicable to the task
- The operation is purely textual with no semantic context needed

### Workflow

1. Before touching code, use Serena to understand the relevant modules and symbols.
2. Use Serena findings to inform your implementation plan before writing any code.
3. Record important Serena findings (call graphs, ownership, surprising relationships) in `WORKFLOW_STATE.md`.
4. After a Serena-guided refactor, note affected file paths in `WORKFLOW_STATE.md` under `## File Map`.

### Example Serena Use Cases

```
# Finding where a function is called
serena.find_usages("handleAuthRedirect")

# Understanding a module's exports
serena.get_module_symbols("src/lib/auth.ts")

# Tracing user input
serena.trace_data_flow(input="req.body.email", target="database.query")
```

---

## 7. MCP Server Configuration

OpenCode MCP servers are declared in `opencode.json` under the `mcp` key. All servers live in **one merged JSON object** — never split into separate files or duplicate root keys.

### Active Servers

| Name | Type | Purpose |
|---|---|---|
| `serena` | `local` via `uvx` | Semantic code navigation — used per §6 |
| `chrome-devtools` | `local` via `npx` | Browser DevTools access — used per browser-testing-with-devtools skill |

### Config File Location

Place `opencode.json` in your **project root** (checked into git). It merges with the global config at `~/.config/opencode/opencode.json`; project-level keys override global ones.

### Correct Structure

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-6",
  "autoupdate": true,
  "instructions": ["agents.md"],
  "permission": {
    "edit": "ask",
    "bash": "ask"
  },
  "mcp": {
    "serena": {
      "type": "local",
      "command": [
        "uvx",
        "--from",
        "git+https://github.com/oraios/serena",
        "serena",
        "start-mcp-server",
        "--context",
        "ide",
        "--project-from-cwd"
      ],
      "enabled": true
    },
    "chrome-devtools": {
      "type": "local",
      "command": [
        "npx",
        "-y",
        "chrome-devtools-mcp@latest",
        "--autoConnect"
      ],
      "enabled": true
    }
  }
}
```

### Common Mistakes to Avoid

- ❌ Two separate `{...}` root objects — JSON allows only one root; merge all keys.
- ❌ `mcpServers` key — that is Claude Desktop / Cline format. OpenCode uses `mcp`.
- ❌ Putting MCP config in a separate file — it belongs in `opencode.json`.
- ❌ Omitting `"type": "local"` for local process servers — it is required.

### Serena Startup Requirement

Serena launches via `uvx` which fetches and runs the package from GitHub on first use. Ensure:
- `uv` is installed (`pip install uv` or `brew install uv`)
- Internet access is available on first run (package is cached after that)
- The project working directory is correct when OpenCode starts (Serena uses `--project-from-cwd`)

### Chrome DevTools Startup Requirement

`chrome-devtools-mcp` connects to a running Chrome/Chromium instance. Ensure:
- A Chromium-based browser is running with remote debugging enabled, **or**
- `--autoConnect` will attempt to auto-attach to an existing session
- Run Chrome with `--remote-debugging-port=9222` if auto-connect fails

### Disabling a Server Temporarily

Set `"enabled": false` on any server to disable it without removing the config:

```jsonc
"serena": {
  "type": "local",
  "command": ["uvx", ...],
  "enabled": false  // temporarily off
}
```

### Token Caution

MCP tools add to context. Enable only what is needed per session. Per-agent scoping is supported if token budget is a concern — see opencode.ai/docs/mcp-servers#per-agent.

---

## Quick Reference

```
Before any task:
  1. Read WORKFLOW_STATE.md
  2. Read relevant SKILL.md files (caveman first, then domain skills)
  3. Use Context7 for external library questions
  4. Use Serena for code navigation

After any task:
  1. Update WORKFLOW_STATE.md (relevant sections only)
  2. Preserve other agents' content
  3. Write a handoff note
  4. Record file paths, commands, and findings

MCP key reminders:
  - opencode.json uses "mcp" (not "mcpServers")
  - All servers go inside one root JSON object
  - Local servers require "type": "local"
  - Serena requires uv installed; chrome-devtools requires a running browser
```
