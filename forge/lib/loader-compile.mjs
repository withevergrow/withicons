// with icons — loader compiler (forge/LOADERS.md). A loader spec (forge/loaders/<name>.mjs) is a few PARTS, each a
// normal skeleton plus a motion. Every part is drawn by the style renderer exactly like an icon, then the parts are
// stacked in one SVG and animated with a few lines of CSS (transform + opacity keyframes) embedded in the file:
// no script, works as <img>, inline, background or mask, in every browser, and in every style.
//
//   loadLoaders(names?)              -> [spec]   forge/loaders/*.mjs (not "_"), validated + normalised
//   compile(spec, style, opts)       -> { id, root, body, css, svg, bytes, dur }
//   frameAt(spec, style, t, opts)    -> static <svg> of the loader at cycle time t (0..1): previews, posters, checks
//   STAGE                            styles that set the glyph on a tile (bento, dock): motion is mapped onto the tile
//
// Ids: every id the output carries starts with "wg-" (site uniqIds / runtime uniqueIds make inline copies unique).
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { ROOT, prepare, renderIcon, nodesToMarkup, attrs, resolveVars } from './load.mjs'
import { T as BENTO } from '../styles/_bento-core.mjs'
import { D as DOCK } from '../styles/_dock-core.mjs'

export const LOADER_DIR = path.join(ROOT, 'forge', 'loaders')
export const GROUPS = ['common', 'creative', 'festival', 'morph']
// styles that draw the glyph scaled onto a tile: x -> 12 + (x - 12) * s, y -> cy + (y - 12) * s
export const STAGE = { bento: { s: BENTO.S, cy: BENTO.CY }, dock: { s: DOCK.GLYPH, cy: DOCK.CY } }
// styles whose motion steps (pixel art moves in frames, not glides)
const STEPPED = { pixel: 10 }
const KEY_PROPS = ['x', 'y', 'r', 'sx', 'sy', 'o']
const DEF = { x: 0, y: 0, r: 0, sx: 1, sy: 1, o: 1 }
const n3 = v => { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r) }
const pct = t => n3(t * 100) + '%'

// ------------------------------------------------------------------ specs
export const listLoaders = () => fs.existsSync(LOADER_DIR)
  ? fs.readdirSync(LOADER_DIR).filter(f => f.endsWith('.mjs') && !f.startsWith('_')).map(f => f.slice(0, -4)).sort() : []
export async function loadLoader(name) {
  const mod = await import(pathToFileURL(path.join(LOADER_DIR, name + '.mjs')).href)
  return normalize(mod.default, name)
}
/** Morph presets (forge/loaders/_morphs.mjs) as loader specs, group "morph": library icons handing over in turn. */
export async function loadMorphs(names) {
  const list = (await import(pathToFileURL(path.join(LOADER_DIR, '_morphs.mjs')).href)).default
  const { icon } = await import(pathToFileURL(path.join(LOADER_DIR, '_kit.mjs')).href)
  const { morphKeys, EFFECTS } = await import(pathToFileURL(path.join(ROOT, 'packages', 'loaders', 'src', 'effects.js')).href)
  for (const m of list) for (const n of m.icons || []) if (typeof n !== 'string' || /^(loader|icon):|^</i.test(n))
    throw new Error(`morph preset ${m.name}: item ${JSON.stringify(n)} must be a plain library icon name (presets chain icons; "loader:<name>" is runtime only)`)
  return list.filter(m => !names || names.includes(m.name)).map(m => normalize({
    name: m.name, title: m.title, group: 'morph', intent: m.intent, aliases: m.aliases, tags: ['loading', 'morph', ...m.icons],
    synonyms: m.synonyms || [], effect: m.effect,
    description: `${m.icons.join(' → ')}: each icon ${EFFECTS[m.effect].say}.`.slice(0, 160),
    duration: m.hold * m.icons.length, morph: m.icons,
    parts: m.icons.map((n, i) => ({ skel: icon(n), motion: { origin: [12, 12], keys: morphKeys(i, m.icons.length, m.effect) } })),
  }, '_morphs'))
}
export async function loadLoaders(names) {
  const out = []
  for (const n of names || listLoaders()) out.push(await loadLoader(n))
  return out
}
/** Fill defaults, build parts, normalise keys. Throws with a readable message on a broken spec. */
export function normalize(spec, file = spec && spec.name) {
  if (!spec || typeof spec !== 'object') throw new Error(`forge/loaders/${file}.mjs: no default export`)
  const where = `loader ${spec.name || file}`
  const parts0 = typeof spec.parts === 'function' ? spec.parts() : spec.parts
  if (!Array.isArray(parts0) || !parts0.length) throw new Error(`${where}: parts must be a non-empty array`)
  const dur = Number(spec.duration) || 1.2
  const parts = parts0.map((p, i) => {
    const skel = p.skel || p
    if (!skel.paths || !skel.paths.length) throw new Error(`${where}: part ${i} has no paths`)
    const m = p.motion || null
    const motion = m ? {
      origin: m.origin || [12, 12],
      keys: normKeys(m.keys || [], `${where} part ${i}`),
      lag: ((Number(m.lag) || 0) % 1 + 1) % 1,
      rep: Math.max(1, Math.round(Number(m.rep) || 1)),
      ease: m.ease || 'linear',
    } : null
    const copies = (p.copies || []).map(c => ({ x: c.x || 0, y: c.y || 0, lag: c.lag == null ? null : (((Number(c.lag) || 0) % 1) + 1) % 1 }))
    return { i, name: honestName(skel.name || p.name || 'wl-' + spec.name, skel), skel: { paths: skel.paths, fills: skel.fills || [], cutouts: skel.cutouts || [] }, motion, copies }
  })
  return {
    name: spec.name, title: spec.title, group: spec.group, description: spec.description || '',
    aliases: spec.aliases || [], tags: spec.tags || [], synonyms: spec.synonyms || [], intent: spec.intent || '',
    duration: dur, morph: (spec.morph || []).slice(), effect: spec.effect, parts, file,
  }
}
// A style may draw an icon by NAME (hand-drawn art, per-icon sprites and tuning): a part keeps an icon's name only when
// its drawing is that icon unchanged; a piece or an edited copy draws under a neutral name so its own geometry shows.
const ICON_DIR = path.join(ROOT, 'forge', 'icons')
const ICON_PATHS = new Map()
function honestName(name, skel) {
  if (!name || name.startsWith('wl-')) return name
  if (!ICON_PATHS.has(name)) {
    const f = path.join(ICON_DIR, name + '.json')
    ICON_PATHS.set(name, fs.existsSync(f) ? JSON.stringify((JSON.parse(fs.readFileSync(f, 'utf8')).paths || []).map(p => p.d)) : null)
  }
  const own = ICON_PATHS.get(name)
  return own == null || own === JSON.stringify(skel.paths.map(p => p.d)) ? name : 'wl-' + name
}
function normKeys(keys, where) {
  const ks = keys.map(([t, k]) => {
    if (!(t >= 0 && t <= 1)) throw new Error(`${where}: key time ${t} outside 0..1`)
    const o = { ...k }
    if (o.s != null) { o.sx = o.sx ?? o.s; o.sy = o.sy ?? o.s; delete o.s }
    return [t, o]
  }).sort((a, b) => a[0] - b[0])
  if (!ks.length) return []
  // carry every property forward so each keyframe states the full transform (smooth, predictable interpolation)
  let cur = { ...DEF }
  const firstOf = p => { for (const [, k] of ks) if (k[p] != null) return k[p]; return DEF[p] }
  cur = Object.fromEntries(KEY_PROPS.map(p => [p, firstOf(p)]))
  const full = ks.map(([t, k]) => { cur = { ...cur }; for (const p of KEY_PROPS) if (k[p] != null) cur[p] = k[p]; return [t, { ...cur, e: k.e }] })
  if (full[0][0] > 0) full.unshift([0, { ...full[0][1] }])
  if (full[full.length - 1][0] < 1) full.push([1, { ...full[full.length - 1][1], e: undefined }])
  return full
}

// ------------------------------------------------------------------ drawing parts through a style
const RENDERS = new Map()
function drawPart(style, name, skel) {
  const key = style.name + '\u0001' + name + '\u0001' + JSON.stringify(skel)
  if (RENDERS.has(key)) return RENDERS.get(key)
  let nodes
  try { nodes = renderIcon(style, prepare({ name, category: 'loader', ...skel })) } catch (e) { throw new Error(`style ${style.name} failed on a part of ${name}: ${e.message}`) }
  RENDERS.set(key, nodes)
  return nodes
}
/** Forget every cached part drawing and chrome probe, so the next compile() really draws again (determinism checks). */
export function resetCaches() { RENDERS.clear(); CHROME.clear() }
// a node's markup with every id and url reference blanked: what the node LOOKS like, wherever its gradients live
const sig = n => nodesToMarkup([n]).replace(/(\sid="|url\(#|href="#)[^")]+/g, '$1#')
// Style chrome: nodes a style draws whatever the glyph is (a tile, its rim, a corner sparkle). Found by drawing two
// different probes; the nodes both share are chrome. Loaders draw chrome once, still, under the moving parts.
const CHROME = new Map()
function chromeOf(style, name) {
  const key = style.name + '\u0001' + name
  if (CHROME.has(key)) return CHROME.get(key)
  const probe = (cx, cy, r) => drawPart(style, name, { paths: [{ d: `M${cx + r} ${cy} A${r} ${r} 0 0 1 ${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z`, plate: 'K' }], fills: [`M${cx + r} ${cy} A${r} ${r} 0 0 1 ${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z`], cutouts: [] })
  let a = probe(7, 7, 1.5), b = probe(17, 16, 2.5)
  // a style that ignores the geometry for this name (a hand-drawn sprite keyed by icon name) draws both probes the
  // same: that is not chrome, so probe again under a neutral name
  const same = (x, y) => x.length === y.length && x.every((n, i) => sig(n) === sig(y[i]))
  if (same(a, b) && name !== 'wl-probe') return (CHROME.set(key, chromeOf(style, 'wl-probe')), CHROME.get(key))
  const sb = new Set(b.map(sig))
  const sigs = new Set(a.filter(n => n[0] !== 'defs' && sb.has(sig(n))).map(sig))
  // keep the probe's chrome nodes plus its defs (the chrome's gradients live there)
  const nodes = sigs.size ? a.filter(n => n[0] === 'defs' || sigs.has(sig(n))) : []
  const out = { sigs, nodes }
  CHROME.set(key, out)
  return out
}
// give every id (and its references) in a markup a suffix
const suffixIds = (m, sfx) => m.replace(/(\sid="|url\(#|href="#)([^")\s]+)/g, '$1$2' + sfx)

// ------------------------------------------------------------------ motion -> CSS
const mapKey = (k, st) => st ? { ...k, x: k.x * st.s, y: k.y * st.s } : k
const mapOrigin = (o, st) => st ? [12 + (o[0] - 12) * st.s, st.cy + (o[1] - 12) * st.s] : o
function usedProps(keys) {
  const u = { t: false, r: false, s: false, o: false }
  for (const [, k] of keys) { if (k.x || k.y) u.t = true; if (k.r) u.r = true; if (k.sx !== 1 || k.sy !== 1) u.s = true; if (k.o !== 1) u.o = true }
  return u
}
function transformOf(k, u) {
  const t = []
  if (u.t) t.push(`translate(${n3(k.x)}px,${n3(k.y)}px)`)
  if (u.r) t.push(`rotate(${n3(k.r)}deg)`)
  if (u.s) t.push(k.sx === k.sy ? `scale(${n3(k.sx)})` : `scale(${n3(k.sx)},${n3(k.sy)})`)
  return t.join(' ')
}
function keyframesCss(name, keys, ease, st, stepped, dur) {
  const u = usedProps(keys)
  const body = keys.map(([t, k0], i) => {
    const k = mapKey(k0, st)
    const decl = []
    if (u.t || u.r || u.s) decl.push('transform:' + (transformOf(k, u) || 'none'))
    if (u.o) decl.push('opacity:' + n3(k.o))
    if (i < keys.length - 1) {
      const e = stepped ? `steps(${Math.max(1, Math.round((keys[i + 1][0] - t) * dur * stepped))})` : (k0.e || ease)
      if (e && e !== 'linear') decl.push('animation-timing-function:' + e)
    }
    return `${pct(t)}{${decl.join(';')}}`
  }).join('')
  return { css: `@keyframes ${name}{${body}}`, used: u }
}

// ------------------------------------------------------------------ compile
/**
 * One loader in one style.
 *   opts.size (24) width/height of the standalone svg, opts.label ('Loading'), opts.id (wl-<name>-<style>)
 * The svg reads three custom properties from any ancestor (inline use): --wl-speed (1 = authored speed),
 * --wl-state (running | paused), and the style's own --with-<style>-<role> colours; the ink is currentColor.
 */
export function compile(spec, style, opts = {}) {
  const id = opts.id || `wl-${spec.name}-${style.name}`
  const st = STAGE[style.name] || null
  const stepped = STEPPED[style.name] || 0
  const dur = spec.duration
  const D = s => `calc(${n3(s)}s*var(--wl-k,1)/var(--wl-speed,1))`
  const css = [`.${id}{--wl-k:1;overflow:visible}`, `@media (prefers-reduced-motion:reduce){.${id}{--wl-k:2.4}}`]
  const kfs = new Map()  // keyframes body -> name (identical motions share one block)
  const defs = [], layers = []
  let chromeDone = false
  for (const p of spec.parts) {
    const nodes = drawPart(style, p.name, p.skel)
    const ch = chromeOf(style, p.name)
    let partNodes = nodes
    if (ch.sigs.size) {
      partNodes = nodes.filter(n => !ch.sigs.has(sig(n)))
      if (!chromeDone) { layers.push(`<g class="wl-c">${suffixIds(nodesToMarkup(ch.nodes), '-' + id + '-c')}</g>`); chromeDone = true }
    }
    const markup = suffixIds(nodesToMarkup(partNodes), `-${id}-${p.i}`)
    if (!p.motion || !p.motion.keys.length) {
      if (p.copies.length) {
        defs.push(`<g id="wg-${id}-b${p.i}">${markup}</g>`)
        for (const c of p.copies) layers.push(`<use href="#wg-${id}-b${p.i}" transform="translate(${n3(st ? c.x * st.s : c.x)} ${n3(st ? c.y * st.s : c.y)})"/>`)
      } else layers.push(`<g>${markup}</g>`)
      continue
    }
    const m = p.motion, pdur = dur / m.rep
    const k = keyframesCss('@', m.keys, m.ease, st, stepped, pdur)
    let kname = kfs.get(k.css)
    if (!kname) { kname = `${id}-${kfs.size}`; kfs.set(k.css, kname); css.push(k.css.replace('@keyframes @', '@keyframes ' + kname)) }
    const o = mapOrigin(m.origin, st)
    const base = `transform-box:view-box;transform-origin:${n3(o[0])}px ${n3(o[1])}px;animation:${kname} ${D(pdur)} linear infinite;animation-play-state:var(--wl-state,running)`
    const delay = lag => lag ? `;animation-delay:${D(-(1 - lag) * pdur)}` : ''
    if (p.copies.length) {
      defs.push(`<g id="wg-${id}-b${p.i}">${markup}</g>`)
      // one shared rule for the part; each copy adds only its own delay
      const pc = `${id}-p${p.i}`
      css.push(`.${pc}{${base}}`)
      p.copies.forEach((c, j) => {
        const lag = c.lag ?? m.lag, cls = `${pc}-${j}`
        if (lag) css.push(`.${cls}{${delay(lag).slice(1)}}`)
        layers.push(`<g transform="translate(${n3(st ? c.x * st.s : c.x)} ${n3(st ? c.y * st.s : c.y)})"><use class="${pc}${lag ? ' ' + cls : ''}" href="#wg-${id}-b${p.i}"/></g>`)
      })
    } else {
      const cls = `${id}-p${p.i}`
      css.push(`.${cls}{${base}${delay(m.lag)}}`)
      layers.push(`<g class="${cls}">${markup}</g>`)
    }
  }
  const cssText = css.join('')
  const body = `<style>${cssText}</style>${defs.length ? `<defs>${defs.join('')}</defs>` : ''}${layers.join('')}`
  const size = opts.size || 24
  const root = { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', ...style.root, class: `wl ${id}`, role: 'img', 'aria-label': opts.label || 'Loading' }
  const svg = `<svg${attrs(root)}>${body}</svg>`
  return { id, root, body, css: cssText, svg, bytes: Buffer.byteLength(svg), dur }
}

// ------------------------------------------------------------------ static frames (previews / posters / checks)
// cubic-bezier(x1,y1,x2,y2) at x -> y (Newton + bisection), steps(n)
function easeAt(e, x) {
  if (!e || e === 'linear') return x
  const st = /^steps\((\d+)/.exec(e)
  if (st) { const n = +st[1]; return Math.floor(x * n) / n }
  const m = /cubic-bezier\(([^)]+)\)/.exec(e)
  if (!m) return x
  const [x1, y1, x2, y2] = m[1].split(',').map(Number)
  const B = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3
  let lo = 0, hi = 1, t = x
  for (let i = 0; i < 40; i++) { const v = B(x1, x2, t); if (Math.abs(v - x) < 1e-5) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2 }
  return B(y1, y2, t)
}
export function sample(keys, u, ease = 'linear', stepped = 0, dur = 1) {
  if (!keys.length) return { ...DEF }
  let i = 0
  while (i < keys.length - 2 && u >= keys[i + 1][0]) i++
  const [t0, a] = keys[i], [t1, b] = keys[Math.min(i + 1, keys.length - 1)]
  const span = t1 - t0
  const raw = span > 0 ? Math.min(1, Math.max(0, (u - t0) / span)) : 1
  const e = stepped ? `steps(${Math.max(1, Math.round(span * dur * stepped))})` : (a.e || ease)
  const w = easeAt(e, raw)
  const out = {}
  for (const p of KEY_PROPS) out[p] = a[p] + (b[p] - a[p]) * w
  return out
}
/** The loader frozen at cycle time t (0..1), motion baked into transform attributes: for resvg previews and posters. */
export function frameAt(spec, style, t, opts = {}) {
  const c = compile(spec, style, opts)
  const st = STAGE[style.name] || null
  const stepped = STEPPED[style.name] || 0
  let body = c.body.replace(/<style>[\s\S]*?<\/style>/, '')
  const parts = new Map(spec.parts.map(p => [p.i, p]))
  // swap each animated class for a baked transform
  let copyN = {}
  body = body.replace(/(<g|<use) class="([\w-]+)-p(\d+)(?: [\w-]+-p\d+-(\d+))?"/g, (all, tag, _id, pi, ci) => {
    const p = parts.get(+pi)
    if (!p || !p.motion) return all
    // copies without their own class run on the part's lag; count them in order to find which copy this is
    const j = tag === '<use' ? (copyN[pi] = (copyN[pi] ?? -1) + 1) : null
    const m = p.motion, lag = j != null ? (p.copies[j].lag ?? m.lag) : m.lag
    const u = (((t * m.rep - lag) % 1) + 1) % 1
    const k = mapKey(sample(m.keys, u, m.ease, stepped, spec.duration / m.rep), st)
    const [ox, oy] = mapOrigin(m.origin, st)
    const tf = `translate(${n3(ox + k.x)} ${n3(oy + k.y)}) rotate(${n3(k.r)}) scale(${n3(k.sx)} ${n3(k.sy)}) translate(${n3(-ox)} ${n3(-oy)})`
    return `${tag} transform="${tf}"${k.o < 1 ? ` opacity="${n3(Math.max(0, k.o))}"` : ''}`
  })
  const root = { ...c.root }
  delete root.class
  return `<svg${attrs(root)}>${body}</svg>`
}
export { resolveVars }
