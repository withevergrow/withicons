// `withicons` — with icons from the terminal. Data, search and code generation come from @withicons/mcp/lib.
import fs from 'node:fs'
import path from 'node:path'
import { TOOLS, init, env, findTool, installSkill, skillText, zipSkill } from './init.mjs'

const HELP = `withicons — 300 icons x 7 styles from the terminal (https://withicons.com)

Usage
  withicons search <words...>        find icons by meaning ("throw away", "settigns", "money")
  withicons get <name>               print one icon (SVG by default)
  withicons add <name...>            print import lines + usage for a framework
  withicons resolve <name>           check a name or alias
  withicons styles                   list the 7 styles
  withicons categories [category]    list categories, or the icons in one
  withicons mcp                      run the MCP server over stdio (same as npx -y @withicons/mcp)
  withicons init [tool...]           add the with-icons skill + MCP server to your AI coding tools
  withicons skill                    print the agent skill (SKILL.md); --zip, --out <dir>, --path

AI tools (init)
  claude-code, codex, cursor, opencode, vscode, windsurf, claude-desktop, lovable
  No tool given: the ones found in this project (or in your home folder with --global).
  --global                  install for your user instead of this project
  --mcp <remote|local|none> remote = https://withicons.com/mcp (default), local = npx -y @withicons/mcp
  --no-skill, --no-mcp      skip one half
  --dry-run                 show what would change, write nothing
  --force                   replace an existing "withicons" MCP entry

Options
  --style, -s <style>       line (default), solid, duo, gloss, engrave, blueprint, sketch
  --format, -f <format>     get: svg (default), react, vue, svelte, angular, solid, html-class, web-component, data-uri
  --framework, --fw <name>  add: react (default), vue, svelte, angular, solid, web-component, html-class
  --size <px>               get: pixel size (default 24)
  --color <css color>       get: replace currentColor (svg, data-uri)
  --limit, -n <n>           search: max results (default 10)
  --category, -c <name>     search: only this category
  --json                    machine-readable output (for scripts and agents)
  --version, -v | --help, -h

Examples
  npx withicons search "throw away"
  npx withicons get home --style solid --format react
  npx withicons add home settings --framework react
  npx withicons get trash --format svg --size 32 > trash.svg
  npx withicons init cursor
  npx withicons init claude-code codex --global --mcp local`

const FLAGS = { s: 'style', f: 'format', n: 'limit', c: 'category', fw: 'framework', v: 'version', h: 'help' }
const BOOL = new Set(['json', 'version', 'help', 'raw', 'no-color', 'global', 'g', 'dry-run', 'force', 'no-mcp', 'no-skill', 'print', 'path', 'zip', 'list'])
function parseArgs(argv) {
  const args = [], o = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--') { args.push(...argv.slice(i + 1)); break }
    const m = a.match(/^--?([a-z-]+)(?:=(.*))?$/i)
    if (!m || /^-\d/.test(a)) { args.push(a); continue }
    const k = FLAGS[m[1]] || m[1]
    if (m[2] !== undefined) o[k] = m[2]
    else if (BOOL.has(k)) o[k] = true
    else o[k] = argv[++i]
  }
  return { args, o }
}

async function load(sub) {
  try { return await import('@withicons/mcp/' + sub) } catch (e) {
    if (e && e.code !== 'ERR_MODULE_NOT_FOUND' && e.code !== 'MODULE_NOT_FOUND') throw e
    const rel = `../../mcp/dist/${sub}.mjs` // monorepo checkout
    return await import(new URL(rel, import.meta.url).href)
  }
}

const tty = process.stdout.isTTY && !process.env.NO_COLOR
const c = (code, s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s)
const bold = s => c(1, s), dim = s => c(2, s), green = s => c(32, s), yellow = s => c(33, s), cyan = s => c(36, s)

async function run(argv) {
  const { args, o } = parseArgs(argv)
  const cmd = (args.shift() || '').toLowerCase()
  if (o.version) { const lib = await load('lib'); console.log(lib.info().version); return 0 }
  if (!cmd || o.help || cmd === 'help') { console.log(HELP); return 0 }
  if (cmd === 'mcp' || cmd === 'serve') { await load('stdio'); return null }
  if (cmd === 'init' || cmd === 'setup') return initCmd(args, o)
  if (cmd === 'skill' || cmd === 'skills') return skillCmd(args, o)
  const lib = await load('lib')
  const out = v => console.log(JSON.stringify(v, null, 2))
  try {
    switch (cmd) {
      case 'search': case 's': case 'find': {
        const query = args.join(' ')
        if (!query.trim()) { console.error('withicons search: give some words, e.g. withicons search "throw away"'); return 2 }
        const r = lib.searchIcons({ query, limit: o.limit ? +o.limit : 10, style: o.style, category: o.category, format: o.format || o.framework || 'react' })
        if (o.json) { out(r); return r.count ? 0 : 1 }
        if (!r.count) {
          console.log(`No icons for "${query}".` + (r.suggestions.length ? ` Did you mean: ${r.suggestions.map(cyan).join(', ')}?` : ''))
          return 1
        }
        const w = Math.max(...r.results.map(x => x.name.length))
        for (const x of r.results) console.log(`  ${bold(x.name.padEnd(w))}  ${dim(x.category.padEnd(13))} ${dim(x.reason)}`)
        console.log(dim(`\n  withicons get ${r.results[0].name}${r.style !== 'line' ? ' --style ' + r.style : ''} --format react   ·   ${r.results[0].url}`))
        return 0
      }
      case 'get': case 'g': case 'svg': {
        if (!args.length) { console.error('withicons get: which icon? e.g. withicons get home --format react'); return 2 }
        const results = args.map(name => lib.getIcon({ name, style: o.style, format: o.format || (cmd === 'svg' ? 'svg' : 'svg'), size: o.size ? +o.size : undefined, color: o.color }))
        if (o.json) { out(results.length === 1 ? results[0] : results); return 0 }
        for (const r of results) {
          if (r.requested) console.error(dim(`"${r.requested}" -> ${r.name}`))
          console.log(r.code)
        }
        return 0
      }
      case 'add': case 'import': {
        if (!args.length) { console.error('withicons add: which icons? e.g. withicons add home settings --framework react'); return 2 }
        const fw = lib.checkFormat(o.framework || o.format || 'react')
        const style = lib.checkStyle(o.style || 'line')
        const names = args.flatMap(a => a.split(',')).filter(Boolean)
        const resolved = names.map(n => ({ requested: n, name: lib.resolveName(n) }))
        const uniq = [...new Set(resolved.map(r => r.name))]
        const install = fw === 'web-component' || fw === 'html-class' ? null : `npm install @withicons/${fw}`
        const importLine = lib.importLine(uniq, fw, style)
        const usage = uniq.map(n => lib.usageLine(n, fw, style)).filter(Boolean)
        if (fw === 'svg') {
          const files = uniq.map(n => ({ name: n, svg: lib.getIcon({ name: n, style, format: 'svg' }).code }))
          if (o.json) { out({ framework: fw, style, icons: files }); return 0 }
          for (const f of files) console.log(`<!-- ${f.name} -->\n${f.svg}`)
          return 0
        }
        if (o.json) { out({ framework: fw, style, install, import: importLine, usage, icons: resolved }); return 0 }
        for (const r of resolved) if (r.requested !== r.name) console.error(dim(`"${r.requested}" -> ${r.name}`))
        if (install) console.log(dim(`# ${install}   (launching soon)`))
        console.log(green(importLine))
        console.log('')
        for (const u of usage) console.log(u)
        return 0
      }
      case 'resolve': case 'r': {
        const r = lib.resolveIcon(args.join(' '))
        if (o.json) { out(r); return r.status === 'resolved' ? 0 : 1 }
        if (r.status === 'resolved') console.log(`${bold(r.name)}${r.via === 'alias' ? dim(`  (alias "${r.alias}")`) : ''}`)
        else if (r.status === 'ambiguous') console.log(`${yellow('ambiguous')}: ${r.candidates.join(', ')}`)
        else console.log(`${yellow('unknown')}${r.nearest.length ? ` — nearest: ${r.nearest.join(', ')}` : ''}`)
        return r.status === 'resolved' ? 0 : 1
      }
      case 'styles': {
        const s = lib.listStyles()
        if (o.json) { out({ styles: s }); return 0 }
        for (const x of s) console.log(`  ${bold(x.name.padEnd(10))} ${dim(x.description || '')}`)
        return 0
      }
      case 'categories': case 'category': case 'list': {
        const r = lib.listCategories(args[0])
        if (o.json) { out(r); return 0 }
        if (r.icons) for (const i of r.icons) console.log(`  ${bold(i.name)}  ${dim(i.description || '')}`)
        else for (const x of r.categories) console.log(`  ${bold(x.name.padEnd(14))} ${String(x.count).padStart(3)}  ${dim(x.examples.join(', '))}`)
        return 0
      }
      default:
        console.error(`withicons: unknown command "${cmd}". Try: withicons --help`)
        return 2
    }
  } catch (e) {
    if (e && e.name === 'IconError') {
      if (o.json) { const { message, name, stack, ...rest } = e; out({ error: e.message, ...rest }) }
      else console.error(`withicons: ${e.message}`)
      return 1
    }
    throw e
  }
}

const MARK = { created: '+', added: '+', updated: '~', replaced: '~', unchanged: '=', shared: '=', kept: '=', skipped: '-', manual: '>', 'would run': '?' }
function initCmd(args, o) {
  if (o.list) {
    for (const t of TOOLS) console.log(`  ${bold(t.id.padEnd(15))} ${dim(t.name + (t.aliases.length ? '  (' + t.aliases.join(', ') + ')' : ''))}`)
    return 0
  }
  const mcp = o['no-mcp'] ? 'none' : o.mcp
  if (mcp && !['remote', 'local', 'none'].includes(mcp)) { console.error('withicons init: --mcp must be remote, local or none'); return 2 }
  let r
  try {
    r = init({ tools: args, global: !!(o.global || o.g), mcp, skill: !o['no-skill'], dryRun: !!o['dry-run'], force: !!o.force })
  } catch (e) { if (e.usage) { console.error(`withicons init: ${e.message}`); return 2 } throw e }
  if (o.json) { console.log(JSON.stringify(r, null, 2)); return r.tools.length ? 0 : 2 }
  if (!r.tools.length) {
    console.error(`No AI tools found ${r.global ? 'in your home folder' : 'in this project'}. Name one or more:\n` +
      `  npx withicons init ${TOOLS.map(t => t.id).join(' | ')}${r.global ? '' : '\n  (or add --global to install for your user)'}`)
    return 2
  }
  if (r.detected) console.log(dim(`found: ${r.tools.join(', ')}`))
  let last = ''
  for (const x of r.log) {
    const name = TOOLS.find(t => t.id === x.tool).name
    if (x.tool !== last) { console.log(bold(name)); last = x.tool }
    const status = x.status
    const mark = MARK[status] || (status.startsWith('would') ? '?' : ' ')
    const col = /created|added|updated|replaced/.test(status) ? green : /manual|kept/.test(status) ? yellow : dim
    const [first, ...rest] = String(x.note || '').split('\n')
    console.log(`  ${col(mark + ' ' + x.what.padEnd(5) + ' ' + status.padEnd(11))} ${x.where ? x.where + '  ' + dim(first) : first}`)
    for (const line of rest) console.log('      ' + line)
  }
  if (r.dryRun) console.log(dim('\ndry run: nothing was written'))
  else if (r.log.some(x => /created|added|updated|replaced/.test(x.status))) console.log(dim('\nRestart the tool (or reload its MCP servers) to pick up the changes.'))
  return 0
}

function skillCmd(args, o) {
  if (o.zip) {
    const file = path.resolve(typeof o.out === 'string' ? o.out : 'with-icons.zip')
    fs.writeFileSync(file, zipSkill())
    console.log(file)
    return 0
  }
  if (o.out) {
    const c = installSkill(path.resolve(o.out), false)
    console.log(`${path.join(path.resolve(o.out), 'with-icons')}  ${dim(`${c.created} created, ${c.updated} updated, ${c.unchanged} unchanged`)}`)
    return 0
  }
  if (o.path) {
    const e = env(), g = !!(o.global || o.g)
    const tools = args.length ? args.map(findTool).filter(Boolean) : TOOLS
    for (const t of tools) {
      const dir = t.skill.manual ? null : t.skill[g || t.globalOnly ? 'global' : 'project']
      console.log(`  ${t.id.padEnd(15)} ${dir ? e.show(e.abs(dir + '/with-icons/SKILL.md')) : dim('upload: npx withicons skill --zip')}`)
    }
    return 0
  }
  process.stdout.write(skillText())
  return 0
}

run(process.argv.slice(2)).then(code => { if (code !== null) process.exitCode = code }, e => { console.error(e); process.exitCode = 1 })
