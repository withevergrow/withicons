// node --test packages/cli/test/init.test.mjs   — `withicons init` / `withicons skill`, temp dirs only
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const cli = path.join(here, '..', 'dist', 'cli.mjs')
const SKILL = fs.readFileSync(path.join(here, '..', '..', '..', 'skills', 'with-icons', 'SKILL.md'), 'utf8').replace(/\r\n/g, '\n')
const REMOTE = 'https://withicons.com/mcp'

function sandbox() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'withicons-init-'))
  const proj = path.join(root, 'proj'), home = path.join(root, 'home')
  fs.mkdirSync(proj); fs.mkdirSync(home)
  const run = (...args) => spawnSync(process.execPath, [cli, ...args], {
    cwd: proj, encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1', WITHICONS_HOME: home, WITHICONS_NO_EXEC: '1' },
  })
  const p = (...a) => path.join(proj, ...a), h = (...a) => path.join(home, ...a)
  const read = f => fs.readFileSync(f, 'utf8'), json = f => JSON.parse(read(f))
  const put = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s) }
  return { root, proj, home, run, p, h, read, json, put }
}
const snapshot = dir => {
  const out = {}
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); e.isDirectory() ? walk(f) : (out[path.relative(dir, f)] = fs.readFileSync(f, 'utf8')) } }
  walk(dir)
  return out
}

test('init cursor: shared skill folder + .cursor/mcp.json (remote by default)', () => {
  const s = sandbox()
  const r = s.run('init', 'cursor')
  assert.equal(r.status, 0, r.stderr)
  assert.equal(s.read(s.p('.agents/skills/with-icons/SKILL.md')), SKILL)
  assert.ok(fs.existsSync(s.p('.agents/skills/with-icons/reference/icons.md')))
  assert.deepEqual(s.json(s.p('.cursor/mcp.json')), { mcpServers: { withicons: { url: REMOTE } } })
  assert.match(r.stdout, /\.cursor\/mcp\.json/)
})

test('idempotent: a second run changes nothing and says so', () => {
  const s = sandbox()
  s.run('init', 'claude-code', 'codex', 'opencode', 'vscode')
  const before = snapshot(s.proj)
  const r = s.run('init', 'claude-code', 'codex', 'opencode', 'vscode')
  assert.equal(r.status, 0)
  assert.deepEqual(snapshot(s.proj), before)
  assert.doesNotMatch(r.stdout, /created|added|updated/)
  assert.match(r.stdout, /unchanged/)
})

test('per-tool config shapes', () => {
  const s = sandbox()
  s.run('init', 'claude-code', 'codex', 'opencode', 'vscode')
  assert.deepEqual(s.json(s.p('.mcp.json')).mcpServers.withicons, { type: 'http', url: REMOTE })
  assert.equal(s.read(s.p('.codex/config.toml')), `[mcp_servers.withicons]\nurl = "${REMOTE}"\n`)
  assert.deepEqual(s.json(s.p('opencode.json')), { $schema: 'https://opencode.ai/config.json', mcp: { withicons: { type: 'remote', url: REMOTE, enabled: true } } })
  assert.deepEqual(s.json(s.p('.vscode/mcp.json')), { servers: { withicons: { type: 'http', url: REMOTE } } })
  assert.equal(s.read(s.p('.claude/skills/with-icons/SKILL.md')), SKILL)
  assert.ok(fs.existsSync(s.p('.agents/skills/with-icons/SKILL.md')))
  // --mcp local
  const l = sandbox()
  l.run('init', 'claude-code', 'codex', 'cursor', 'opencode', '--mcp', 'local')
  assert.deepEqual(l.json(l.p('.mcp.json')).mcpServers.withicons, { command: 'npx', args: ['-y', '@withicons/mcp'] })
  assert.deepEqual(l.json(l.p('.cursor/mcp.json')).mcpServers.withicons, { command: 'npx', args: ['-y', '@withicons/mcp'] })
  assert.equal(l.read(l.p('.codex/config.toml')), '[mcp_servers.withicons]\ncommand = "npx"\nargs = ["-y", "@withicons/mcp"]\n')
  assert.deepEqual(l.json(l.p('opencode.json')).mcp.withicons, { type: 'local', command: ['npx', '-y', '@withicons/mcp'], enabled: true })
})

test('JSON merge keeps other servers, keys and indentation; existing entry kept unless --force', () => {
  const s = sandbox()
  s.put(s.p('.cursor/mcp.json'), '{\n\t"mcpServers": {\n\t\t"other": { "command": "x" }\n\t},\n\t"extra": true\n}\n')
  s.run('init', 'cursor')
  const j = s.json(s.p('.cursor/mcp.json'))
  assert.deepEqual(j, { mcpServers: { other: { command: 'x' }, withicons: { url: REMOTE } }, extra: true })
  assert.match(s.read(s.p('.cursor/mcp.json')), /^\{\n\t"mcpServers"/)
  // a different withicons entry is left alone...
  s.put(s.p('.cursor/mcp.json'), JSON.stringify({ mcpServers: { withicons: { url: 'https://example.test/mcp' } } }))
  const r = s.run('init', 'cursor')
  assert.match(r.stdout, /kept.*--force/)
  assert.equal(s.json(s.p('.cursor/mcp.json')).mcpServers.withicons.url, 'https://example.test/mcp')
  // ...until --force
  s.run('init', 'cursor', '--force')
  assert.equal(s.json(s.p('.cursor/mcp.json')).mcpServers.withicons.url, REMOTE)
})

test('files with comments or invalid JSON are never rewritten; snippet printed instead', () => {
  const s = sandbox()
  const jsonc = '{\n  // my settings\n  "mcp": {}\n}\n'
  s.put(s.p('opencode.jsonc'), jsonc)
  const r = s.run('init', 'opencode')
  assert.equal(s.read(s.p('opencode.jsonc')), jsonc)
  assert.ok(!fs.existsSync(s.p('opencode.json')))
  assert.match(r.stdout, /comments/)
  assert.match(r.stdout, /"type": "remote"/)
  s.put(s.p('.vscode/mcp.json'), '{ nope')
  assert.match(s.run('init', 'vscode').stdout, /not valid JSON/)
  assert.equal(s.read(s.p('.vscode/mcp.json')), '{ nope')
})

test('TOML: appends without touching existing content, never duplicates', () => {
  const s = sandbox()
  const orig = 'model = "gpt-5"\n\n[mcp_servers.other]\ncommand = "x"'
  s.put(s.p('.codex/config.toml'), orig)
  s.run('init', 'codex')
  const once = s.read(s.p('.codex/config.toml'))
  assert.ok(once.startsWith(orig + '\n\n[mcp_servers.withicons]\n'))
  s.run('init', 'codex')
  s.run('init', 'codex', '--mcp', 'local')
  assert.equal(s.read(s.p('.codex/config.toml')), once)
})

test('--dry-run writes nothing; --json reports actions', () => {
  const s = sandbox()
  const r = s.run('init', 'cursor', 'claude-code', '--dry-run')
  assert.equal(r.status, 0)
  assert.deepEqual(fs.readdirSync(s.proj), [])
  assert.match(r.stdout, /would create/)
  const j = JSON.parse(s.run('init', 'cursor', '--json').stdout)
  assert.deepEqual(j.tools, ['cursor'])
  assert.ok(j.log.some(x => x.what === 'mcp' && x.status === 'created'))
})

test('detection, aliases and usage errors', () => {
  const s = sandbox()
  assert.equal(s.run('init').status, 2) // nothing to detect
  fs.mkdirSync(s.p('.cursor')); fs.mkdirSync(s.p('.claude'))
  const r = s.run('init', '--no-mcp')
  assert.equal(r.status, 0)
  assert.match(r.stdout, /found: claude-code, cursor/)
  assert.ok(!fs.existsSync(s.p('.cursor/mcp.json')))
  assert.ok(fs.existsSync(s.p('.claude/skills/with-icons/SKILL.md')))
  assert.equal(s.run('init', 'frobnicate').status, 2)
  assert.equal(s.run('init', 'cursor', '--mcp', 'sideways').status, 2)
  s.run('init', 'claude', '--no-skill') // alias
  assert.ok(fs.existsSync(s.p('.mcp.json')))
  assert.match(s.run('init', '--list').stdout, /lovable/)
})

test('--global: user folders; Claude Code via its own CLI (printed when not run)', () => {
  const s = sandbox()
  const r = s.run('init', 'claude-code', 'cursor', 'codex', '--global')
  assert.equal(r.status, 0)
  assert.equal(s.read(s.h('.claude/skills/with-icons/SKILL.md')), SKILL)
  assert.ok(fs.existsSync(s.h('.agents/skills/with-icons/SKILL.md')))
  assert.deepEqual(s.json(s.h('.cursor/mcp.json')), { mcpServers: { withicons: { url: REMOTE } } })
  assert.match(s.read(s.h('.codex/config.toml')), /\[mcp_servers\.withicons\]/)
  assert.match(r.stdout, /claude mcp add --scope user --transport http withicons https:\/\/withicons\.com\/mcp/)
  assert.deepEqual(fs.readdirSync(s.proj), [])
})

test('Windsurf writes the user MCP file(s); Claude Desktop is local-only by file; Lovable is manual', () => {
  const s = sandbox()
  s.put(s.h('.codeium/windsurf/mcp_config.json'), '{"mcpServers":{}}')
  s.run('init', 'windsurf')
  assert.deepEqual(s.json(s.h('.codeium/windsurf/mcp_config.json')), { mcpServers: { withicons: { serverUrl: REMOTE } } })
  const r = s.run('init', 'claude-desktop')
  assert.match(r.stdout, /Add custom connector/)
  const cfg = process.platform === 'win32' ? s.h('AppData/Roaming/Claude/claude_desktop_config.json')
    : process.platform === 'darwin' ? s.h('Library/Application Support/Claude/claude_desktop_config.json') : s.h('.config/Claude/claude_desktop_config.json')
  assert.deepEqual(s.json(cfg), { mcpServers: { withicons: { command: 'npx', args: ['-y', '@withicons/mcp'] } } })
  const s2 = sandbox()
  s2.run('init', 'claude-desktop', '--mcp', 'remote')
  assert.deepEqual(fs.readdirSync(s2.home), [])
  const l = s2.run('init', 'lovable')
  assert.equal(l.status, 0)
  assert.match(l.stdout, /lovable\.dev\/dashboard\?connectors/)
  assert.match(l.stdout, /github\.com\/withevergrow\/withicons\/tree\/main\/skills\/with-icons/)
  assert.deepEqual(fs.readdirSync(s2.proj), [])
})

test('skill: print, --out, --zip, --path', () => {
  const s = sandbox()
  assert.equal(s.run('skill').stdout, SKILL)
  assert.equal(s.run('skill', '--print').stdout, SKILL)
  s.run('skill', '--out', 'x')
  assert.equal(s.read(s.p('x/with-icons/SKILL.md')), SKILL)
  s.run('skill', '--zip')
  const z = fs.readFileSync(s.p('with-icons.zip'))
  assert.equal(z.readUInt32LE(0), 0x04034b50)
  assert.equal(z.readUInt32LE(z.length - 22), 0x06054b50)
  assert.ok(z.includes(Buffer.from('with-icons/SKILL.md')))
  assert.ok(z.includes(Buffer.from(SKILL)))
  assert.match(s.run('skill', '--path', 'cursor').stdout, /\.agents\/skills\/with-icons\/SKILL\.md/)
})

test('CLI config shapes match forge/integrations.json (site copy)', async () => {
  const { TOOLS } = await import('../src/init.mjs')
  const facts = JSON.parse(fs.readFileSync(path.join(here, '..', '..', '..', 'forge', 'integrations.json'), 'utf8'))
  for (const f of facts.tools) {
    const t = TOOLS.find(x => x.id === f.id)
    assert.ok(t, f.id)
    for (const [key, kind] of [['mcp', 'remote'], ['mcpLocal', 'local']]) {
      const m = f[key]
      if (!m || !m.json) continue
      const cli = t.mcp.project && t.mcp.project.keys ? t.mcp.project : t.mcp.global
      if (!cli.keys) continue
      const entry = cli.keys.reduce((n, k) => n[k], m.json)
      assert.deepEqual(cli.entry(kind), entry, `${f.id} ${kind}`)
    }
  }
})
