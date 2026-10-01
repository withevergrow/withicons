# withicons

**with icons** from the terminal — search 300 icons x 7 styles in plain English, print SVG or framework code,
and get import lines. Works offline; everything ships in the package.

> Not published to npm yet — launching soon.

```sh
npx withicons search "throw away"
#   trash         actions       matched related word "throw away"
npx withicons get home --style solid --format react
npx withicons add home settings delete --framework react
#   import { Home, Settings, Trash } from '@withicons/react'
npx withicons get trash --size 32 > trash.svg
```

| command | |
|---|---|
| `search <words...>` | ranked icons, typo-tolerant (`settigns`), synonyms (`bin`), phrases (`recycle bin`), natural language (`money`) |
| `get <name...>` | code for one or more icons; names or aliases (`delete` -> trash) |
| `add <name...>` | import line + usage for `--framework` react (default), vue, svelte, angular, solid, web-component, html-class, svg |
| `resolve <name>` | does a name/alias map to one icon? |
| `styles` · `categories [category]` | the catalogue |
| `mcp` | run the MCP server over stdio (same as `npx -y @withicons/mcp`) |
| `init [tool...]` | add the agent skill + MCP server to your AI coding tools (below) |
| `skill` | print the agent skill; `--zip` (upload to Claude / Lovable), `--out <dir>`, `--path` |

Options: `--style/-s`, `--format/-f` (svg, react, vue, svelte, angular, solid, html-class, web-component, data-uri),
`--framework/--fw`, `--size`, `--color`, `--limit/-n`, `--category/-c`, and **`--json`** for scripts and AI agents
(stable JSON on stdout; exit code 0 = found, 1 = not found / ambiguous, 2 = usage error).

## Add with icons to your AI coding tool

```sh
npx withicons init                 # every tool found in this project
npx withicons init cursor          # or name them: claude-code codex cursor opencode vscode windsurf claude-desktop lovable
npx withicons init claude-code codex --global --mcp local
```

| tool | skill goes to | MCP server goes to |
|---|---|---|
| Claude Code | `.claude/skills/with-icons/` | `.mcp.json` (`--global`: runs `claude mcp add --scope user`) |
| Codex | `.agents/skills/with-icons/` | `.codex/config.toml` (`--global`: `~/.codex/config.toml`) |
| Cursor | `.agents/skills/with-icons/` | `.cursor/mcp.json` (`--global`: `~/.cursor/mcp.json`) |
| OpenCode | `.agents/skills/with-icons/` | `opencode.json` (`--global`: `~/.config/opencode/opencode.json`) |
| VS Code (Copilot) | `.agents/skills/with-icons/` | `.vscode/mcp.json` (`--global`: runs `code --add-mcp`) |
| Windsurf / Devin Desktop | `.agents/skills/with-icons/` | user `mcp_config.json` (`~/.config/devin/`, `%APPDATA%\devin\`; an existing `~/.codeium/windsurf/` one too) |
| Claude Desktop | upload `npx withicons skill --zip` | `claude_desktop_config.json` (local server); remote: Customize > Connectors |
| Lovable | import from GitHub (printed) | Connectors > + > MCP server (printed) |

`--global` uses your home folder (`~/.agents/skills`, `~/.claude/skills`). `--mcp remote` (default) points at
`https://withicons.com/mcp`; `--mcp local` runs `npx -y @withicons/mcp`; `--no-mcp` / `--no-skill` skip a half.
It is safe to re-run: JSON is merged key by key (other servers and settings are kept, files with comments are never
rewritten — you get the snippet instead), TOML is only appended to, an existing `withicons` entry is kept unless
`--force`, and `--dry-run` shows every change first. `.agents/skills` is the shared Agent Skills folder that Codex,
Cursor, VS Code, OpenCode and Windsurf all read, so one copy serves them all.

MIT © with icons — powered by Evergrow · https://withicons.com
