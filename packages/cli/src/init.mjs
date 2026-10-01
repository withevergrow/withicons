// `withicons init` / `withicons skill` — put the with-icons agent skill and the MCP server config where each AI coding
// tool looks for them. Safe by design: JSON is merged key-by-key (files with comments are never rewritten), TOML is only
// appended to, an existing "withicons" server is left alone unless --force, and every run is idempotent.
// Facts (paths, keys, commands) and their doc URLs live in forge/integrations.json; keep both in step.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { SKILL_FILES } from './skill-data.mjs'

export const NAME = 'withicons'
export const SKILL = 'with-icons'
export const REMOTE_URL = 'https://withicons.com/mcp'
export const LOCAL_CMD = ['npx', '-y', '@withicons/mcp']
const SKILL_REPO = 'https://github.com/withevergrow/withicons/tree/main/skills/with-icons'
const GH_REF = 'https://github.com/withevergrow/withicons/blob/main/skills/with-icons/'

// .agents/skills is the cross-tool Agent Skills folder: Codex, Cursor, VS Code, OpenCode and Windsurf/Devin all read it
// (project and ~/), so one copy serves them all. Claude Code reads only .claude/skills.
const SHARED = '.agents/skills', SHARED_HOME = '~/.agents/skills'
const stdio = () => ({ command: LOCAL_CMD[0], args: LOCAL_CMD.slice(1) })

// --- tools ---------------------------------------------------------------------------------------------------------
// mcp.project / mcp.global: { file, keys, entry(kind) } for JSON, { file, toml: true } for TOML,
//   { exec: kind => argv, check: argv } to use the tool's own CLI, or { manual: kind => lines }.
// skill.project / skill.global: directory that receives with-icons/SKILL.md (+ reference/), or { rule: file } for a
//   single rules file. `detect` = paths that mean "this tool is used here".
export const TOOLS = [
  {
    id: 'claude-code', name: 'Claude Code', aliases: ['claude', 'claudecode', 'cc'],
    detect: { project: ['.claude', 'CLAUDE.md', '.mcp.json'], global: ['~/.claude'] },
    skill: { project: '.claude/skills', global: '~/.claude/skills' },
    mcp: {
      project: { file: '.mcp.json', keys: ['mcpServers', NAME], entry: k => k === 'remote' ? { type: 'http', url: REMOTE_URL } : stdio() },
      global: {
        exec: k => k === 'remote' ? ['claude', 'mcp', 'add', '--scope', 'user', '--transport', 'http', NAME, REMOTE_URL]
          : ['claude', 'mcp', 'add', '--scope', 'user', NAME, '--', ...LOCAL_CMD],
        check: ['claude', 'mcp', 'get', NAME],
      },
    },
  },
  {
    id: 'codex', name: 'OpenAI Codex', aliases: ['openai', 'codex-cli'],
    detect: { project: ['.codex'], global: ['~/.codex'] },
    skill: { project: SHARED, global: SHARED_HOME },
    mcp: {
      project: { file: '.codex/config.toml', toml: true },
      global: { file: '~/.codex/config.toml', toml: true },
    },
  },
  {
    id: 'cursor', name: 'Cursor', aliases: [],
    detect: { project: ['.cursor', '.cursorrules'], global: ['~/.cursor'] },
    skill: { project: SHARED, global: SHARED_HOME },
    mcp: {
      project: { file: '.cursor/mcp.json', keys: ['mcpServers', NAME], entry: k => k === 'remote' ? { url: REMOTE_URL } : stdio() },
      global: { file: '~/.cursor/mcp.json', keys: ['mcpServers', NAME], entry: k => k === 'remote' ? { url: REMOTE_URL } : stdio() },
    },
  },
  {
    id: 'opencode', name: 'OpenCode', aliases: ['open-code', 'sst'],
    detect: { project: ['opencode.json', 'opencode.jsonc', '.opencode'], global: ['~/.config/opencode'] },
    skill: { project: SHARED, global: SHARED_HOME },
    mcp: {
      project: { file: ['opencode.jsonc', 'opencode.json'], keys: ['mcp', NAME], schema: 'https://opencode.ai/config.json', entry: k => k === 'remote' ? { type: 'remote', url: REMOTE_URL, enabled: true } : { type: 'local', command: LOCAL_CMD, enabled: true } },
      global: { file: ['~/.config/opencode/opencode.jsonc', '~/.config/opencode/opencode.json'], keys: ['mcp', NAME], schema: 'https://opencode.ai/config.json', entry: k => k === 'remote' ? { type: 'remote', url: REMOTE_URL, enabled: true } : { type: 'local', command: LOCAL_CMD, enabled: true } },
    },
  },
  {
    id: 'vscode', name: 'VS Code (Copilot)', aliases: ['code', 'copilot', 'vs-code', 'github-copilot'],
    detect: { project: ['.vscode', '.github/copilot-instructions.md'], global: [] },
    skill: { project: SHARED, global: SHARED_HOME },
    mcp: {
      project: { file: '.vscode/mcp.json', keys: ['servers', NAME], entry: k => k === 'remote' ? { type: 'http', url: REMOTE_URL } : { type: 'stdio', ...stdio() } },
      global: { exec: k => ['code', '--add-mcp', JSON.stringify({ name: NAME, ...(k === 'remote' ? { type: 'http', url: REMOTE_URL } : { type: 'stdio', ...stdio() }) })] },
    },
  },
  {
    id: 'windsurf', name: 'Windsurf / Devin Desktop', aliases: ['devin', 'devin-desktop', 'codeium', 'cascade'],
    detect: { project: ['.windsurf', '.windsurfrules', '.devin'], global: ['~/.codeium/windsurf', devinConfigRel('')] },
    skill: { project: SHARED, global: SHARED_HOME },
    mcp: {
      project: null, // Cascade reads MCP servers from the user-level file only
      // Devin Desktop (formerly Windsurf) documents ~/.config/devin/mcp_config.json; older Windsurf builds read
      // ~/.codeium/windsurf/mcp_config.json. Write every one that exists, else create the documented one.
      global: { file: [devinConfigRel('mcp_config.json'), '~/.codeium/windsurf/mcp_config.json'], each: true, keys: ['mcpServers', NAME], entry: k => k === 'remote' ? { serverUrl: REMOTE_URL } : stdio() },
    },
  },
  {
    id: 'claude-desktop', name: 'Claude Desktop', aliases: ['claude-app', 'desktop'], globalOnly: true,
    detect: { project: [], global: [desktopConfigRel()] },
    skill: { manual: () => [`Skill: run npx withicons skill --zip, then in Claude: Customize > Skills > + > Create skill > Upload a skill (needs code execution on)`] },
    mcp: {
      global: {
        file: desktopConfigRel(), keys: ['mcpServers', NAME], localOnly: true, entry: () => stdio(),
        manual: () => [`Remote server: Customize > Connectors > + > Add custom connector, URL ${REMOTE_URL}`],
      },
    },
  },
  {
    id: 'lovable', name: 'Lovable', aliases: [], cloud: true,
    detect: { project: [], global: [] },
    skill: { manual: () => [`Skill (workspace owners/admins): Workspace settings > Skills > Add > Import from GitHub: ${SKILL_REPO}`, `  or upload the zip made by: npx withicons skill --zip`] },
    mcp: { manual: () => [`MCP: open https://lovable.dev/dashboard?connectors, + > MCP server, name "with icons", URL ${REMOTE_URL}, authentication: none`] },
  },
]

function devinConfigRel(f) {
  return (process.platform === 'win32' ? '%APPDATA%/devin/' : '~/.config/devin/') + f
}
function desktopConfigRel() {
  if (process.platform === 'win32') return '%APPDATA%/Claude/claude_desktop_config.json'
  if (process.platform === 'darwin') return '~/Library/Application Support/Claude/claude_desktop_config.json'
  return '~/.config/Claude/claude_desktop_config.json' // no official Linux build; harmless
}

export function findTool(id) {
  const k = String(id).toLowerCase()
  return TOOLS.find(t => t.id === k || t.aliases.includes(k))
}

// --- environment -----------------------------------------------------------------------------------------------------
export function env(o = {}) {
  const home = o.home || process.env.WITHICONS_HOME || os.homedir()
  const cwd = o.cwd || process.cwd()
  const appdata = o.home || process.env.WITHICONS_HOME ? path.join(home, 'AppData', 'Roaming') : process.env.APPDATA || path.join(home, 'AppData', 'Roaming')
  const abs = p => p.startsWith('~/') ? path.join(home, p.slice(2)) : p.startsWith('%APPDATA%/') ? path.join(appdata, p.slice(10)) : path.resolve(cwd, p)
  const show = p => {
    const rel = path.relative(cwd, p)
    if (!rel.startsWith('..') && !path.isAbsolute(rel)) return rel.split(path.sep).join('/') || '.'
    const h = path.relative(home, p)
    return !h.startsWith('..') && !path.isAbsolute(h) ? '~/' + h.split(path.sep).join('/') : p
  }
  return { home, cwd, appdata, abs, show, exec: o.exec !== undefined ? o.exec : process.env.WITHICONS_NO_EXEC ? null : runExec }
}

function runExec(argv) {
  const win = process.platform === 'win32'
  const q = a => /^[\w@./:=-]+$/.test(a) ? a : win ? `"${a.replace(/"/g, '\\"')}"` : `'${a.replace(/'/g, `'\\''`)}'`
  const r = win ? spawnSync(argv.map(q).join(' '), { shell: true, encoding: 'utf8' }) : spawnSync(argv[0], argv.slice(1), { encoding: 'utf8' })
  return { ok: r.status === 0, missing: !!(r.error && r.error.code === 'ENOENT') || (win && r.status !== 0 && /not recognized|not found/i.test(r.stderr || '')), out: (r.stdout || '') + (r.stderr || '') }
}

export function detect(e, global) {
  return TOOLS.filter(t => !t.cloud && (global ? t.detect.global : t.detect.project).map(e.abs).some(p => fs.existsSync(p)))
}

// --- skill files -----------------------------------------------------------------------------------------------------
export function skillFiles() { return SKILL_FILES }
export function skillText() { return SKILL_FILES['SKILL.md'] }

function writeFile(file, text, dry) {
  const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null
  if (cur === text) return 'unchanged'
  if (!dry) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text) }
  return cur === null ? 'created' : 'updated'
}

export function installSkill(dir, dry) {
  const counts = { created: 0, updated: 0, unchanged: 0 }
  for (const [rel, text] of Object.entries(SKILL_FILES)) counts[writeFile(path.join(dir, SKILL, ...rel.split('/')), text, dry)]++
  return counts
}

// --- JSON / TOML merging -----------------------------------------------------------------------------------------------
function stripJsonc(s) {
  let out = '', i = 0, str = false
  while (i < s.length) {
    const c = s[i]
    if (str) { out += c; if (c === '\\') { out += s[i + 1] || ''; i += 2; continue } if (c === '"') str = false; i++; continue }
    if (c === '"') { str = true; out += c; i++; continue }
    if (c === '/' && s[i + 1] === '/') { while (i < s.length && s[i] !== '\n') i++; continue }
    if (c === '/' && s[i + 1] === '*') { i = s.indexOf('*/', i + 2); i = i < 0 ? s.length : i + 2; continue }
    out += c; i++
  }
  return out.replace(/,(\s*[}\]])/g, '$1')
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

export function mergeJson(file, keys, entry, { dry, force, schema } = {}) {
  const exists = fs.existsSync(file)
  let raw = exists ? fs.readFileSync(file, 'utf8').replace(/^﻿/, '') : ''
  let doc = {}, indent = 2
  if (raw.trim()) {
    try { doc = JSON.parse(raw) } catch {
      let ok = false
      try { JSON.parse(stripJsonc(raw)); ok = true } catch {}
      return { status: 'manual', reason: ok ? 'file has comments, so it was not rewritten' : 'file is not valid JSON' }
    }
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) return { status: 'manual', reason: 'unexpected file shape' }
    const m = raw.match(/\n([ \t]+)"/); if (m) indent = m[1].includes('\t') ? '\t' : m[1].length
  } else if (schema) doc.$schema = schema
  let node = doc
  for (const k of keys.slice(0, -1)) {
    if (node[k] == null) node[k] = {}
    if (typeof node[k] !== 'object' || Array.isArray(node[k])) return { status: 'manual', reason: `"${k}" is not an object` }
    node = node[k]
  }
  const last = keys[keys.length - 1], prev = node[last]
  if (prev !== undefined && same(prev, entry)) return { status: 'unchanged' }
  if (prev !== undefined && !force) return { status: 'kept', reason: `a "${last}" server already exists (use --force to replace it)` }
  node[last] = entry
  if (!dry) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(doc, null, indent) + '\n') }
  return { status: prev !== undefined ? 'replaced' : exists ? 'added' : 'created' }
}

export function tomlBlock(kind) {
  const s = JSON.stringify
  return kind === 'remote' ? `[mcp_servers.${NAME}]\nurl = ${s(REMOTE_URL)}\n`
    : `[mcp_servers.${NAME}]\ncommand = ${s(LOCAL_CMD[0])}\nargs = [${LOCAL_CMD.slice(1).map(a => s(a)).join(', ')}]\n`
}
export function mergeToml(file, kind, { dry } = {}) {
  const exists = fs.existsSync(file)
  const raw = exists ? fs.readFileSync(file, 'utf8') : ''
  const re = new RegExp(`^\\s*\\[\\s*mcp_servers\\s*\\.\\s*(?:${NAME}|"${NAME}"|'${NAME}')\\s*\\]`, 'm')
  if (re.test(raw)) {
    return raw.includes(tomlBlock(kind).trim()) || raw.replace(/\r\n/g, '\n').includes(tomlBlock(kind).trim()) ? { status: 'unchanged' }
      : { status: 'kept', reason: `[mcp_servers.${NAME}] already exists (edit it by hand to change it)` }
  }
  if (/^\s*mcp_servers\s*=/m.test(raw)) return { status: 'manual', reason: 'mcp_servers is defined inline, so it was not edited' }
  const sep = !raw ? '' : raw.endsWith('\n\n') ? '' : raw.endsWith('\n') ? '\n' : '\n\n'
  if (!dry) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, raw + sep + tomlBlock(kind)) }
  return { status: exists ? 'added' : 'created' }
}

// --- snippets (for manual steps and --print) ---------------------------------------------------------------------------
export function snippet(t, scope, kind) {
  const m = t.mcp[scope]
  if (!m) return null
  if (m.toml) return tomlBlock(kind)
  if (m.exec) return m.exec(kind).map(a => /^[\w@./:=-]+$/.test(a) ? a : `'${a}'`).join(' ')
  if (m.keys) {
    const o = {}; let n = o
    for (const k of m.keys.slice(0, -1)) n = n[k] = {}
    n[m.keys[m.keys.length - 1]] = m.entry(kind)
    return JSON.stringify(o, null, 2)
  }
  return null
}

// --- init ---------------------------------------------------------------------------------------------------------------
export function init(opts = {}) {
  const e = env(opts)
  const log = []
  const say = (tool, what, status, where, note) => log.push({ tool, what, status, where, note })
  const global = !!opts.global, dry = !!opts.dryRun
  let tools = (opts.tools || []).map(id => {
    const t = findTool(id)
    if (!t) throw Object.assign(new Error(`unknown tool "${id}". Tools: ${TOOLS.map(x => x.id).join(', ')}`), { usage: true })
    return t
  })
  let detected = false
  if (!tools.length) { tools = detect(e, global); detected = true }
  const kindWanted = opts.mcp || 'remote'
  const VERB = { created: 'create', added: 'add', replaced: 'replace', updated: 'update' }
  const st = s => dry && VERB[s] ? 'would ' + VERB[s] : s
  const what = kind => kind === 'remote' ? REMOTE_URL : LOCAL_CMD.join(' ')
  const done = new Map() // skill dir -> first tool that got it
  for (const t of [...new Set(tools)]) {
    const scope = global || t.globalOnly ? 'global' : 'project'
    // skill
    if (opts.skill !== false) {
      const s = t.skill
      if (s.manual) for (const line of s.manual()) say(t.id, 'skill', 'manual', null, line)
      else {
        const dir = e.abs(s[scope]), n = Object.keys(SKILL_FILES).length
        if (done.has(dir)) say(t.id, 'skill', 'shared', e.show(path.join(dir, SKILL)) + '/', `same folder as ${done.get(dir)}`)
        else {
          done.set(dir, t.name)
          const c = installSkill(dir, dry)
          say(t.id, 'skill', st(c.created === n ? 'created' : c.created || c.updated ? 'updated' : 'unchanged'), e.show(path.join(dir, SKILL)) + '/', `${n} files`)
        }
      }
    }
    // mcp
    if (opts.mcp === 'none' || opts.mcp === false) continue
    if (t.mcp.manual) for (const line of t.mcp.manual()) say(t.id, 'mcp', 'manual', null, line)
    let m = t.mcp[scope], note = ''
    if (!m && scope === 'project' && t.mcp.global) { m = t.mcp.global; note = ` (${t.name} has no project MCP file, so the user config is used)` }
    if (!m) continue
    let kind = kindWanted
    if (m.localOnly && kind === 'remote') {
      if (m.manual) for (const line of m.manual()) say(t.id, 'mcp', 'manual', null, line)
      if (opts.mcp) continue // explicitly asked for remote: nothing to write
      kind = 'local'
    }
    if (m.exec) {
      const argv = m.exec(kind), cmd = argv.map(a => /^[\w@./:=-]+$/.test(a) ? a : `'${a}'`).join(' ')
      if (dry) { say(t.id, 'mcp', 'would run', null, cmd); continue }
      if (!e.exec) { say(t.id, 'mcp', 'manual', null, `run: ${cmd}`); continue }
      if (m.check && e.exec(m.check).ok) { say(t.id, 'mcp', 'kept', null, `a "${NAME}" server already exists (${m.check.join(' ')})`); continue }
      const r = e.exec(argv)
      say(t.id, 'mcp', r.ok ? 'added' : 'manual', null, r.ok ? cmd : `${r.missing ? `${argv[0]} is not on PATH` : 'the command failed'}; run it yourself: ${cmd}`)
    } else if (m.toml) {
      const file = e.abs(m.file)
      const r = mergeToml(file, kind, { dry })
      say(t.id, 'mcp', st(r.status), e.show(file), (r.reason || what(kind)) + note)
      if (r.status === 'manual') say(t.id, 'mcp', 'manual', null, 'add this:\n' + tomlBlock(kind))
    } else if (m.keys) {
      const files = [].concat(m.file).map(f => e.abs(f)), existing = files.filter(f => fs.existsSync(f))
      const targets = m.each ? (existing.length ? existing : [files[0]]) : [existing[0] || files[files.length - 1]]
      const entry = m.entry(kind)
      for (const file of targets) {
        const r = mergeJson(file, m.keys, entry, { dry, force: opts.force, schema: m.schema })
        say(t.id, 'mcp', st(r.status), e.show(file), (r.reason || what(kind)) + note)
        if (r.status === 'manual') say(t.id, 'mcp', 'manual', null, `add under ${m.keys.slice(0, -1).map(k => `"${k}"`).join(' > ')}:\n` + JSON.stringify({ [NAME]: entry }, null, 2))
      }
    }
  }
  return { tools: tools.map(t => t.id), detected, global, dryRun: dry, log }
}

// --- zip (stored, no compression) for skill uploads ---------------------------------------------------------------------
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })()
const crc32 = b => { let c = ~0; for (const x of b) c = CRC[(c ^ x) & 0xFF] ^ (c >>> 8); return ~c >>> 0 }
export function zipSkill() {
  const parts = [], central = []
  let off = 0
  for (const [rel, text] of Object.entries(SKILL_FILES)) {
    const name = Buffer.from(`${SKILL}/${rel}`), data = Buffer.from(text), crc = crc32(data)
    const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(0, 8)
    h.writeUInt32LE(0x00210000, 10); h.writeUInt32LE(crc, 14); h.writeUInt32LE(data.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(name.length, 26)
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8)
    c.writeUInt32LE(0x00210000, 12); c.writeUInt32LE(crc, 16); c.writeUInt32LE(data.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(name.length, 28); c.writeUInt32LE(off, 42)
    parts.push(h, name, data); central.push(c, name); off += 30 + name.length + data.length
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(central.length / 2, 8); end.writeUInt16LE(central.length / 2, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(off, 16)
  return Buffer.concat([...parts, cd, end])
}

export { GH_REF, SKILL_REPO }
