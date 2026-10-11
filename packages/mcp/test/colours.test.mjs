// Honest colours and brand themes (docs/MCP-AGENT-EVAL.md rows 3 and 10).
// node --test packages/mcp/test/colours.test.mjs   (needs the bundles: cd packages/mcp && npm run build)
import { test, describe, before, after } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const lib = await import(pathToFileURL(path.join(dist, 'lib.mjs')).href)
const parse = r => r.structuredContent || JSON.parse(r.content[0].text)
// a real renderer checks the paint model (optional dependency)
let Resvg = null
for (const from of [path.join(dist, 'stdio.mjs'), path.join(dist, '..', '..', '..', 'package.json')]) {
  try { Resvg = createRequire(from)('@resvg/resvg-js').Resvg; break } catch { /* next */ }
}
const HUE = ['c1', 'c2', 'c3', 'c4', 'accent']
const fileText = (r, filename) => {
  const c = r.content.find(x => x.type === 'text' && x.text.startsWith(`--- ${filename} ---`))
  assert.ok(c, `no inline ${filename}`)
  return c.text
}

// The area each role visibly paints in a real render: the icon drawn on white with the role's variables set to black,
// then to white (every other colour at its default); the share of the image that changes, weighted by how much.
function renderedAreas(name, style) {
  const svg = lib.svgOf(name, style)
  const roles = Object.fromEntries(lib.colorVars(name, style).map(v => [v.var, v.role]))
  const SIZE = 96
  const draw = (role, hex) => {
    let s = svg, p
    do { p = s; s = s.replace(/var\(\s*(--with-[\w-]+)\s*,\s*([^()]*?)\s*\)/g, (a, v, d) => (roles[v] === role ? hex : d)) } while (s !== p)
    s = s.replace(/^<svg/, `<svg color="${role === 'ink' ? hex : '#808080'}"`)
    return new Resvg(s, { fitTo: { mode: 'width', value: SIZE }, background: '#ffffff', font: { loadSystemFonts: false } }).render().pixels
  }
  const out = {}
  for (const role of new Set(['ink', ...Object.values(roles).filter(Boolean)])) {
    const a = draw(role, '#000000'), b = draw(role, '#ffffff')
    let d = 0
    for (let i = 0; i < a.length; i += 4) d += (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2])) / 765
    out[role] = d / (SIZE * SIZE)
  }
  return out
}

describe('colours (stdio server)', () => {
  let client
  before(async () => {
    client = new Client({ name: 'withicons-colours-test', version: '1.0.0' })
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(dist, 'stdio.mjs')], stderr: 'ignore' }))
  })
  after(async () => { await client.close() })
  const call = async (name, args) => client.callTool({ name, arguments: args })

  // ---------------------------------------------------------------- (a) export_icon says what get_icon says
  test('export_icon: ignored colours per icon and style, the same as get_icon, first in the text', async () => {
    const colors = { tint: '#e0f2fe', accent: '#f59e0b' }
    const g = parse(await call('get_icon', { name: 'tooth', style: 'duo', colors }))
    assert.deepEqual(g.appliedPalette.ignored, ['tint', 'accent'])
    const raw = await call('export_icon', { name: 'tooth', style: 'duo', format: 'svg-flat', colors })
    assert.ok(!raw.isError, raw.content[0].text)
    const s = parse(raw)
    const e = s.colorReport.find(x => x.name === 'tooth' && x.style === 'duo')
    assert.ok(e, JSON.stringify(s.colorReport))
    assert.deepEqual(e.ignored, g.appliedPalette.ignored)
    assert.deepEqual(e.paintedWith, g.appliedPalette.usedRoles)
    assert.ok(s.warnings.some(w => /tint/.test(w) && /changes nothing on tooth/.test(w)), JSON.stringify(s.warnings))
    // the text block leads with the warnings: an agent reading only the text sees them first
    assert.ok(raw.content[0].text.startsWith('{"warnings":["'), raw.content[0].text.slice(0, 80))
    // several icons: one entry per icon and style, only where something was ignored
    const many = parse(await call('export_icon', { names: ['tooth', 'smile'], style: 'duo', format: 'svg-flat', colors: { accent: '#f59e0b' } }))
    const ignoredBy = n => (many.colorReport.find(x => x.name === n && x.ignored) || {}).ignored
    const smileUsesAccent = lib.colorVars('smile', 'duo').some(v => v.role === 'accent')
    assert.deepEqual(ignoredBy('tooth'), ['accent'])
    assert.equal(ignoredBy('smile'), smileUsesAccent ? undefined : ['accent'])
  })
  test('get_icon / export_icon: a colour painted only as a see-through tone says so (duo c1 at 20%)', async () => {
    const pal = parse(await call('list_palettes', { name: 'tooth', limit: 1 })).palettes[0].id
    const g = parse(await call('get_icon', { name: 'tooth', style: 'duo', palette: pal }))
    assert.ok((g.notes || []).some(n => /c1/.test(n) && /20%/.test(n)), JSON.stringify(g.notes))
    const s = parse(await call('export_icon', { name: 'tooth', style: 'duo', format: 'svg-flat', palette: pal }))
    assert.ok(s.notes.some(n => /c1/.test(n) && /20%/.test(n) && /tooth/.test(n)), JSON.stringify(s.notes))
  })

  // ---------------------------------------------------------------- (b) roles per style, from the renderers' output
  test('list_styles: every style lists the roles its icons really paint (data, not prose)', async () => {
    const { styles } = parse(await call('list_styles', {}))
    const total = lib.data().meta.icons.length
    const duo = styles.find(s => s.name === 'duo')
    assert.deepEqual(duo.colours.roles.map(r => r.role).sort(), ['accent', 'c1'], 'duo has no tint')
    const tone = duo.colours.roles.find(r => r.role === 'c1')
    assert.deepEqual(tone.vars, ['--with-duo'])
    assert.equal(tone.paints, 'tone')
    assert.equal(tone.opacity, 0.2)
    assert.ok(tone.icons > 0 && tone.icons <= total)
    const accent = duo.colours.roles.find(r => r.role === 'accent')
    assert.ok(accent.icons < total, 'duo accent is on some icons only')
    for (const one of ['line', 'solid']) {
      const s = styles.find(x => x.name === one)
      assert.deepEqual(s.colours.roles, [], one)
      assert.equal(s.colours.exact, true, one)
    }
    assert.equal(styles.find(s => s.name === 'clay').colours.exact, false)
    // every variable an icon uses in a style is listed under its role for that style
    const sample = lib.data().meta.icons.filter((_, i) => i % 61 === 0).map(i => i.name)
    for (const s of styles) for (const n of sample) {
      let vars
      try { vars = lib.colorVars(n, s.name) } catch { continue }
      for (const v of vars) if (v.role) assert.ok(s.colours.roles.some(r => r.role === v.role && r.vars.includes(v.var)), `${s.name}: ${v.var} (${v.role}) on ${n}`)
    }
  })
  test('no text claims duo has a tint; the colour lines name each style\'s real roles', async () => {
    const instructions = client.getInstructions()
    const { tools } = await client.listTools()
    const texts = [instructions, ...tools.map(t => t.description), ...tools.flatMap(t => Object.values(t.inputSchema.properties || {}).map(p => p.description || ''))]
    for (const t of texts) assert.doesNotMatch(String(t), /duo('s)?[^.;]{0,40}\btint\b/i, String(t).slice(0, 200))
    assert.match(instructions, /duo[^.]*c1[^.]*20%/i)
    const rec = parse(await call('recommend_styles', { for: 'feature list for a SaaS landing page' }))
    for (const n of rec.notes) assert.doesNotMatch(n, /duo('s)?[^.;]{0,40}\btint\b/i)
  })

  // ---------------------------------------------------------------- (c) one brand theme, resolved per icon
  test('theme: single-colour styles take the primary exactly', async () => {
    const g = parse(await call('get_icon', { name: 'tooth', style: 'solid', theme: { primary: '#0ea5e9' } }))
    assert.equal(g.appliedTheme.exact, true)
    assert.match(g.code, /#0ea5e9/i)
    const flat = parse(await call('get_icon', { name: 'tooth', style: 'line', theme: '#0ea5e9', flat: true }))
    assert.match(flat.code, /stroke="#0ea5e9"/i)
    assert.doesNotMatch(flat.code, /currentColor/)
  })
  test('export_icon theme: one call recolours a mixed clay set onto each icon\'s own main part', async () => {
    const set = ['camera', 'avatar-woman', 'tooth', 'trending-up']
    const raw = await call('export_icon', { names: set, style: 'clay', format: 'svg-flat', theme: { primary: '#0ea5e9', secondary: '#f59e0b' } })
    assert.ok(!raw.isError, raw.content[0].text)
    const s = parse(raw)
    const got = {}
    for (const n of set) {
      const e = s.colorReport.find(x => x.name === n && x.style === 'clay')
      assert.ok(e && e.theme, n)
      const main = parse(await call('list_palettes', { name: n, style: 'clay', limit: 1 })).mainRole
      assert.equal(e.theme.primary, main, `${n}: primary goes on its main part`)
      assert.equal(e.theme.exact, false, 'clay shades every colour')
      assert.match(fileText(raw, `${n}-clay.svg`), /#0ea5e9/i)
      got[n] = main
    }
    assert.notEqual(got.camera, got['avatar-woman'], 'the main part differs per icon, the theme follows it')
    assert.ok(s.notes.some(n => /theme/i.test(n) && /clay/.test(n)), JSON.stringify(s.notes))
  })
  test('export_icon per_icon: different colours for different icons in one call', async () => {
    const raw = await call('export_icon', { names: ['tooth', 'heart', 'star'], style: 'solid', format: 'svg-flat', theme: '#0ea5e9',
      per_icon: { heart: '#e11d48', star: { primary: '#f59e0b' } } })
    assert.ok(!raw.isError, raw.content[0].text)
    assert.match(fileText(raw, 'tooth-solid.svg'), /#0ea5e9/i)
    assert.match(fileText(raw, 'heart-solid.svg'), /#e11d48/i)
    assert.match(fileText(raw, 'star-solid.svg'), /#f59e0b/i)
    assert.doesNotMatch(fileText(raw, 'heart-solid.svg'), /#0ea5e9/i)
    const s = parse(raw)
    assert.ok(s.colorReport.every(e => e.theme.exact === true))
    // per_icon names must be among the exported icons; theme and palette exclude each other; colours must be hex
    for (const bad of [{ per_icon: { home: '#000000' } }, { palette: 'classic-red' }, { theme: { primary: 'url(x)' } }, { theme: { brand: '#000000' } }]) {
      const r = await call('export_icon', { names: ['tooth', 'heart'], style: 'solid', format: 'svg-flat', theme: '#0ea5e9', ...bad })
      assert.equal(r.isError, true, JSON.stringify(bad))
    }
  })
  test('per_icon role keys keep a part (a people avatar\'s skin); an icon drawn mostly in ink takes primary there', async () => {
    const skin = '#f6d2b6'
    const raw = await call('export_icon', { names: ['avatar-woman', 'camera'], style: 'suite', format: 'svg-flat', theme: '#0ea5e9', per_icon: { 'avatar-woman': { c1: skin } } })
    assert.ok(!raw.isError, raw.content[0].text)
    assert.match(fileText(raw, 'avatar-woman-suite.svg'), new RegExp(skin, 'i'))
    assert.doesNotMatch(fileText(raw, 'camera-suite.svg'), new RegExp(skin, 'i'))
    // kawaii draws trending-up almost all in ink (one small coloured heart): the outline stays the style's ink on every
    // icon of a set, so the result flags it and names theme.ink; with theme.ink the arrow takes the brand colour
    const areas = lib.roleAreas('trending-up', 'kawaii')
    const parts = HUE.reduce((n, r) => n + (areas[r] || 0), 0)
    if ((areas.ink || 0) > 2 * parts) {
      const g = parse(await call('get_icon', { name: 'trending-up', style: 'kawaii', theme: '#0ea5e9', flat: true }))
      assert.equal(g.appliedTheme.inkLeads, true)
      assert.ok(g.notes.some(n => /theme\.ink/.test(n) && /trending-up/.test(n)), JSON.stringify(g.notes))
      const inked = parse(await call('get_icon', { name: 'trending-up', style: 'kawaii', theme: { primary: '#0ea5e9', ink: '#0ea5e9' }, flat: true }))
      assert.doesNotMatch(inked.code, /currentColor/)
      assert.ok(inked.code.split('#0ea5e9').length > 2, inked.code)
      const s = parse(await call('export_icon', { names: ['trending-up', 'tooth'], style: 'kawaii', format: 'svg-flat', theme: '#0ea5e9' }))
      assert.ok(s.notes.some(n => /theme\.ink/.test(n) && /trending-up/.test(n)), JSON.stringify(s.notes))
    }
  })
  test('the command line for a theme (hosted server, PNG formats) carries it', async () => {
    const { exportCommand } = await import(pathToFileURL(path.join(dist, '..', 'src', 'export-command.mjs')).href)
    const cmd = exportCommand({ name: ['tooth', 'heart'], format: 'png', theme: { primary: '#0ea5e9', secondary: '#f59e0b', ink: '#111827' }, per_icon: { heart: '#e11d48', tooth: { secondary: '#ffffff', c1: '#000000' } } })
    assert.match(cmd, / --theme "#0ea5e9,#f59e0b,ink=#111827"/)
    assert.match(cmd, / --per-icon "heart=#e11d48,tooth=secondary:#ffffff\/c1:#000000"/)
  })
  test('export_icon describes which styles show a brand hex exactly, from the data', async () => {
    const { tools } = await client.listTools()
    const x = tools.find(t => t.name === 'export_icon')
    const desc = x.inputSchema.properties.theme.description
    const exact = /exact[^:]*:\s*([a-z0-9, ]+)/i.exec(desc), shaded = /shaded[^:]*:\s*([a-z0-9, ]+)/i.exec(desc)
    assert.ok(exact && shaded, desc)
    const list = m => m[1].split(/,\s*/).map(s => s.trim()).filter(Boolean)
    const styles = lib.listStyles()
    assert.deepEqual(list(exact).sort(), styles.filter(s => s.colours.exact).map(s => s.name).sort())
    assert.deepEqual(list(shaded).sort(), styles.filter(s => !s.colours.exact).map(s => s.name).sort())
    assert.ok(list(exact).includes('solid') && list(shaded).includes('clay'))
    assert.ok(tools.find(t => t.name === 'get_icon').inputSchema.properties.theme)
  })

  // ---------------------------------------------------------------- (d) mainRole matches a real render
  test('list_palettes mainRole: suite camera is c1 and the avatars name their largest part (not accent)', async () => {
    const cam = parse(await call('list_palettes', { name: 'camera', style: 'suite', limit: 1 }))
    assert.equal(cam.mainRole, 'c1')
    assert.ok(cam.mainRoleShare > 0.5, String(cam.mainRoleShare))
    const av = parse(await call('list_palettes', { name: 'avatar-woman', style: 'suite', limit: 1 }))
    assert.notEqual(av.mainRole, 'accent')
    assert.ok(av.roleAreas && av.roleAreas[av.mainRole] > 0, JSON.stringify(av.roleAreas))
    for (const r of HUE) if (av.roleAreas[r] != null) assert.ok(av.roleAreas[av.mainRole] >= av.roleAreas[r], r)
  })
  test('mainRole is the colour role that paints the largest area in a real render (sample x every multi-colour style)', { skip: !Resvg && 'no @resvg/resvg-js' }, () => {
    const styles = lib.data().styleNames.filter(st => /var\(\s*--with-/.test(lib.svgOf('home', st)))
    const icons = ['camera', 'avatar-woman', 'trending-up', 'tooth', ...lib.data().meta.icons.filter((_, i) => i % 97 === 0).map(i => i.name)]
    let checked = 0
    for (const n of icons) for (const st of styles) {
      try { lib.svgOf(n, st) } catch { continue }
      const areas = renderedAreas(n, st)
      const got = lib.mainRole(n, st).role
      // hue roles first; then the other colour roles; the ink only when nothing else shows
      const tiers = [HUE, ['tint', 'shadow', 'edge', 'shine']]
      const tier = tiers.find(t => t.some(r => (areas[r] || 0) > 0.002))
      if (!tier) { assert.equal(got, 'ink', `${n} ${st}`); continue }
      const best = Math.max(...tier.map(r => areas[r] || 0))
      // near-ties (within 10%) may go either way
      assert.ok(tier.includes(got) && (areas[got] || 0) >= 0.9 * best,
        `${n} in ${st}: mainRole ${got} (${(areas[got] || 0).toFixed(3)}) but the render's largest is ${tier.find(r => areas[r] === best)} (${best.toFixed(3)})`)
      checked++
    }
    assert.ok(checked > 100, String(checked))
  })

  // ---------------------------------------------------------------- (e) borrowed palettes
  test('a borrowed palette is matched by part size, never by role name, and the warning says so', async () => {
    const id = 'wedding-maroon'
    const donorHas = parse(await call('list_palettes', { name: 'diya' })).palettes.some(p => p.id === id)
    const recipientHas = parse(await call('list_palettes', { name: 'trending-up' })).palettes.some(p => p.id === id)
    if (!donorHas || recipientHas) return
    const raw = await call('export_icon', { names: ['diya', 'trending-up'], style: 'rangoli', format: 'svg-flat', palette: id })
    assert.ok(!raw.isError, raw.content[0].text)
    const s = parse(raw)
    const e = s.colorReport.find(x => x.name === 'trending-up' && x.style === 'rangoli')
    assert.ok(e && e.borrowed, JSON.stringify(s.colorReport))
    assert.equal(e.borrowed.from, 'diya')
    const main = n => lib.mainRole(n, 'rangoli').role
    assert.equal(e.borrowed.parts[main('trending-up')], main('diya'), 'the main part wears the donor\'s main colour')
    assert.ok(s.warnings.some(w => w.includes(`trending-up has no palette "${id}"`) && /part size/.test(w)), JSON.stringify(s.warnings))
    // a colour of a part diya barely shows (its green c4) never lands on trending-up
    const pal = parse(await call('list_palettes', { name: 'diya', style: 'rangoli' })).palettes.find(p => p.id === id)
    const used = new Set(Object.values(e.borrowed.parts))
    const file = fileText(raw, 'trending-up-rangoli.svg')
    for (const r of HUE) if (!used.has(r) && pal.colors[r] && !Object.values(e.borrowed.parts).some(x => pal.colors[x] === pal.colors[r]))
      assert.ok(!file.toLowerCase().includes(pal.colors[r].toLowerCase()), `${r} ${pal.colors[r]} leaked onto trending-up`)
  })
})
