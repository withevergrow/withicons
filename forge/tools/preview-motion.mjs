#!/usr/bin/env node
// Frame strip of icon motion, rendered in node (resvg), so you can LOOK at how parts move without a browser.
//
//   node forge/tools/preview-motion.mjs sun,heart,rocket --styles line,solid,bauhaus,sticker,luxe --out .preview/motion2-x.png
//   options: --trigger loop|hover (default loop)  --frames 8  --size 64  --dark  --spec '{"loop":{"preset":"spin"}}' (override)
//            --span cycle (default: one object cycle; "cycle" = the whole cycle incl. the slower decoration loop)
//
// Each row is one icon in one style, each column one moment, evenly spaced over one loop (or over the one-shot plus a
// short rest for --trigger hover). It applies the SAME keyframes and easings as motion.css (packages/motion/src:
// keyframes.js, parts.js), per part: untagged / wm-k / wm-shine = the object, wm-a / wm-s = plates (spec `parts`),
// wm-deco = its own gentle loop, wm-shadow = stays on the ground for lifting presets. A label says which roles moved.
// Faint grey square = the 24 grid. Specs: forge/motion/<name>.json, else the engine's derived spec.
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { Resvg } from '@resvg/resvg-js'
import { loadIcon, listIcons, loadStyles, renderIcon, attrs, ROOT, resolveVars, readManifest } from '../lib/load.mjs'

const imp = f => import(pathToFileURL(path.join(ROOT, 'packages', 'motion', 'src', f)).href)
const meta = await imp('meta.js')
const { resolveSpecMotion, partsPlan, sampleRole, sampleMatrix } = await imp('parts.js')
const { autoSpec } = await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', 'emit-motion.mjs')).href)

const r3 = n => String(Math.round(n * 1000) / 1000)
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

/** The motion spec of an icon: forge/motion/<name>.json (with parts / deco), else the derived one. */
export function specOf(name) {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'forge', 'motion', name + '.json'), 'utf8'))
    if (raw && raw.loop && raw.hover && meta.PRESET_DEFAULTS[raw.loop.preset] && meta.PRESET_DEFAULTS[raw.hover.preset]) return raw
  } catch { /* none yet */ }
  let category = ''
  try { category = (readManifest().icons || []).find(i => i.name === name)?.category || '' } catch {}
  return autoSpec(name, category, meta.PRESET_DEFAULTS)
}

const bboxCache = new Map()
function bboxOf(rootAttrs, node) {
  const key = node
  if (bboxCache.has(key)) return bboxCache.get(key)
  let b = [0, 0, 24, 24]
  try {
    const r = new Resvg(resolveVars(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="240" height="240"${attrs(rootAttrs)}>${node}</svg>`)).getBBox()
    if (r && r.width > 0) b = [r.x, r.y, r.width, r.height]
  } catch {}
  bboxCache.set(key, b)
  return b
}

/**
 * One frame of an icon as SVG inner markup (for a <svg viewBox="0 0 24 24"> with the style's root attributes).
 *   nodes: [[tag, attrs], ...] (renderer output), plan: partsPlan(), t: seconds, ids: unique prefix.
 * Returns { markup, moved: Set of roles that are away from rest }.
 */
export function frameMarkup(nodes, rootAttrs, plan, t, ids) {
  const mode = { k: plan.obj.k, dx: 0, dy: 0, em: 16 }
  const modeOf = r => { const [dx, dy] = meta.dirVec(r.dir || 0); return { k: r.k == null ? 1 : r.k, dx, dy, em: 16 } }
  const parts = nodes.some(([, a]) => meta.partRole(a.class) !== 'obj')
  const moved = new Set()
  let defs = '', body = '', n = 0
  const wrap = (role, r, inner, box) => {
    if (!r) return inner
    const s = sampleRole(r, modeOf(r), t)
    const vb = r.box === 'fill-box' ? box : [0, 0, 24, 24]
    const origin = r.origin ? r.origin : [vb[0] + vb[2] / 2, vb[1] + vb[3] / 2]
    const M = sampleMatrix(s, origin, vb)
    const id = `${ids}-${n++}`
    let a = ''
    const still = Math.abs(M[0] - 1) + Math.abs(M[1]) + Math.abs(M[2]) + Math.abs(M[3] - 1) + Math.abs(M[4]) + Math.abs(M[5]) < 1e-3
    if (!still) a += ` transform="matrix(${M.map(r3).join(' ')})"`
    if (s.opacity < 0.999) a += ` opacity="${r3(Math.max(0, s.opacity))}"`
    if (!still || s.opacity < 0.995) moved.add(role)
    if (s.clip && s.clip.some(v => Math.abs(v) > 0.01)) {
      const [ct, cr, cb, cl] = s.clip.map(v => v * 0.24)
      defs += `<clipPath id="${id}c"><rect x="${r3(cl)}" y="${r3(ct)}" width="${r3(24 - cl - cr)}" height="${r3(24 - ct - cb)}"/></clipPath>`
      a += ` clip-path="url(#${id}c)"`
    }
    if (s.glow && s.glow.some(v => v > 0.05)) {
      // the drop-shadow halo of glow / twinkle: blurred alpha tinted currentColor (42% / 22%)
      const [b1, b2] = s.glow
      defs += `<filter id="${id}f" x="-1" y="-1" width="3" height="3" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceAlpha" stdDeviation="${r3(b2 / 2)}" result="b2"/>` +
        `<feGaussianBlur in="SourceAlpha" stdDeviation="${r3((b1 || 0) / 2)}" result="b1"/><feFlood flood-color="currentColor" flood-opacity=".22"/><feComposite in2="b2" operator="in" result="g2"/>` +
        `<feFlood flood-color="currentColor" flood-opacity=".42"/><feComposite in2="b1" operator="in" result="g1"/><feMerge><feMergeNode in="g2"/><feMergeNode in="g1"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`
      inner = `<g filter="url(#${id}f)">${inner}</g>`
      moved.add(role)
    }
    return `<g${a}>${inner}</g>`
  }
  const mk = ([tag, a]) => `<${tag}${attrs(a)}/>`
  if (!parts) body = wrap('obj', plan.obj, nodes.map(mk).join(''))
  else {
    for (const nd of nodes) {
      const role = meta.partRole(nd[1].class)
      const m = mk(nd)
      const r = plan[role]
      body += wrap(role, r, m, r && r.box === 'fill-box' ? bboxOf(rootAttrs, m) : null)
    }
  }
  return { markup: (defs ? `<defs>${defs}</defs>` : '') + body, moved, parts }
}

/** Renders the strip; returns { png, width, height, rows: [{ icon, style, roles }] }. */
export async function renderStrip(o) {
  const styles = await loadStyles(o.styles)
  const names = o.icons
  const frames = Math.max(1, Number(o.frames) || 8), SIZE = Number(o.size) || 64, PAD = Math.round(SIZE * 0.5)
  const dark = !!o.dark
  const fg = dark ? '#f3f0e8' : '#15140f', bg = dark ? '#131210' : '#fbfaf7', mut = '#8a8578', grid = dark ? '#2a2824' : '#e9e6df'
  const LABEL = 190, HEAD = 44
  const trigger = o.trigger === 'hover' ? 'hover' : 'loop'
  let body = '', y = HEAD
  const rows = []
  let uid = 0
  for (const name of names) {
    const spec = o.spec ? Object.assign({ name }, specOf(name), o.spec) : specOf(name)
    const m = resolveSpecMotion(spec, { trigger: trigger === 'hover' ? 'once' : 'loop' })
    const plan0 = partsPlan(m, spec)
    for (const sn of Object.keys(styles)) {
      const st = styles[sn]
      let nodes
      try { nodes = o.nodes ? o.nodes(name, sn, renderIcon(st, loadIcon(name))) : renderIcon(st, loadIcon(name)) }
      catch (e) { body += `<text x="16" y="${y + 20}" font-size="11" fill="#e03" font-family="Segoe UI, Arial">${esc(name)} / ${sn}: ${esc(e.message)}</text>`; y += SIZE + PAD; continue }
      const root = { ...st.root }; delete root.width; delete root.height; delete root.xmlns
      const roles = new Set(), tagged = new Set(nodes.map(([, a]) => meta.partRole(a.class)))
      const plan = tagged.has('deco') ? plan0 : partsPlan(m, spec, { deco: false })
      const span = m.loop ? (o.span === 'cycle' ? plan.cycle : m.duration) : m.duration + 0.3
      let cells = ''
      for (let i = 0; i < frames; i++) {
        const t = i * span / frames
        const x = LABEL + i * (SIZE + PAD)
        const f = frameMarkup(nodes, root, plan, t, 'u' + (uid++))
        f.moved.forEach(r => roles.add(r))
        cells += `<rect x="${x}" y="${y}" width="${SIZE}" height="${SIZE}" fill="none" stroke="${grid}"/>`
        cells += `<svg x="${x}" y="${y}" width="${SIZE}" height="${SIZE}" viewBox="0 0 24 24" overflow="visible"${attrs(root)} color="${fg}">${f.markup}</svg>`
      }
      const a = spec[trigger === 'hover' ? 'hover' : 'loop']
      const info = `${a.preset}${spec.parts ? ' +parts ' + Object.keys(spec.parts).join('') : ''}${tagged.has('deco') ? ' · deco ' + (plan.deco ? plan.deco.preset : 'still') : ''}`
      body += `<text x="16" y="${y + 18}" font-family="Segoe UI, Arial" font-size="13" font-weight="700" fill="${fg}">${esc(name)}</text>`
      body += `<text x="16" y="${y + 34}" font-family="Segoe UI, Arial" font-size="11" fill="${mut}">${esc(sn)} · ${esc(info)}</text>`
      body += `<text x="16" y="${y + 50}" font-family="Segoe UI, Arial" font-size="10" fill="${mut}">tags: ${esc([...tagged].join(' '))}</text>`
      body += `<text x="16" y="${y + 64}" font-family="Segoe UI, Arial" font-size="10" fill="${mut}">moved: ${esc([...roles].join(' ') || '-')}</text>`
      body += cells
      rows.push({ icon: name, style: sn, roles: [...roles], tags: [...tagged] })
      y += Math.max(SIZE, 70) + PAD
    }
  }
  // column headers: time of each frame (for one icon set, relative to its span)
  let head = `<text x="16" y="16" font-family="Segoe UI, Arial" font-size="12" font-weight="700" fill="${fg}">${trigger} · ${frames} frames over one ${trigger === 'loop' ? (o.span === 'cycle' ? 'full cycle' : 'object cycle') : 'one-shot'}</text>`
  for (let i = 0; i < frames; i++) head += `<text x="${LABEL + i * (SIZE + PAD) + SIZE / 2}" y="36" text-anchor="middle" font-family="Segoe UI, Arial" font-size="10" fill="${mut}">${Math.round(i / frames * 100)}%</text>`
  const W = LABEL + frames * (SIZE + PAD), H = y + 4
  const svg = resolveVars(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="${bg}"/>${head}${body}</svg>`).replaceAll('currentColor', fg)
  const png = new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' }, background: bg }).render().asPng()
  return { png, width: W, height: H, rows, svg }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
if (isMain) {
  const argv = process.argv.slice(2), opt = {}, pos = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) { const k = argv[i].slice(2); const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; opt[k] = v }
    else pos.push(argv[i])
  }
  const icons = (pos.length ? pos.join(',') : String(opt.icons || 'sun,heart,rocket')).split(',').map(s => s.trim()).filter(Boolean)
  const all = listIcons()
  const bad = icons.filter(n => !all.includes(n))
  if (bad.length) { console.error('unknown icon(s): ' + bad.join(', ')); process.exit(1) }
  const styles = opt.styles && opt.styles !== 'all' ? String(opt.styles).split(',') : (opt.styles === 'all' ? undefined : ['line', 'solid', 'bauhaus', 'sticker', 'luxe'])
  const r = await renderStrip({ icons, styles, trigger: opt.trigger, frames: opt.frames, size: opt.size, dark: !!opt.dark, span: opt.span,
    spec: opt.spec ? JSON.parse(opt.spec) : null })
  const out = path.resolve(ROOT, String(opt.out || '.preview/motion2-strip.png'))
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, r.png)
  console.log(`wrote ${path.relative(ROOT, out)} (${r.rows.length} rows x ${opt.frames || 8} frames, ${r.width}x${r.height})`)
  for (const row of r.rows) console.log(`  ${row.icon}/${row.style}: tags [${row.tags.join(' ')}] moved [${row.roles.join(' ')}]`)
}
