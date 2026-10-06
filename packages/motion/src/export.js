// @withicons/motion/export — self-contained animated SVGs, frame rendering and GIF / WebM encoding.
// animatedSvg() works anywhere (string in, string out). renderFrames(), gif(), video() and webm() need a browser.
import { motionFor } from './index.js'
import { resolveSpecMotion, partsPlan } from './parts.js'
import { EFFECT_DEFAULTS, EFFECTS, dirVec, pct, swapEase, swapCycle, hasParts } from './meta.js'
import { presetStops, keyframesCss, DRAW_KEYFRAMES, swapLoopStops, EFFECT_STATES, GLOW0, GLOW_HALO } from './keyframes.js'

const num = n => String(Math.round(n * 1000) / 1000)
function hash(s) {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}
/** Splits an SVG string into its root attributes and inner markup. */
export function parseSvg(svg) {
  const m = /^\s*(?:<\?xml[^>]*>\s*)?<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/i.exec(String(svg || ''))
  if (!m) throw new Error('with icons motion: not an <svg> string')
  const attrs = {}
  m[1].replace(/([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g, (_, k, __, a, b) => { attrs[k] = a != null ? a : b; return '' })
  return { attrs, inner: m[2] }
}
const esc = v => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const attrStr = a => Object.keys(a).map(k => ` ${k}="${esc(a[k])}"`).join('')
const isStroke = v => v != null && v !== 'none' && v !== 'transparent'

// pathLength="1" on stroked shapes, data-wm-fill on the rest (same rule as the runtime's prepareDraw)
function markDraw(inner, rootStroked) {
  let any = false
  const out = inner.replace(/<(path|line|polyline|polygon|circle|ellipse|rect)\b([^>]*?)(\/?)>/g, (all, tag, a, close) => {
    const own = /\sstroke="([^"]*)"/.exec(a)
    const stroked = own ? isStroke(own[1]) : rootStroked
    if (!stroked || /stroke-dasharray=/.test(a) || /pathLength=/.test(a)) return `<${tag}${a} data-wm-fill=""${close}>`
    any = true
    return `<${tag}${a} pathLength="1" data-wm-pl=""${close}>`
  })
  return { inner: out, any }
}

/** Resolves preset, timing and geometry for an export from an icon spec and/or explicit options. */
export function resolveMotion(o) {
  o = o || {}
  return resolveSpecMotion(o.spec || (o.name ? motionFor(o.name) : null), o)
}

/**
 * A self-contained animated SVG string: the icon wrapped in <g>, plus a <style> holding only the keyframes it
 * needs, scoped by a unique class so many can sit on one page. Works as a file, in <img>, or inline.
 *   animatedSvg(svg, { name: 'bell' })                         the icon's own loop
 *   animatedSvg(svg, { preset: 'spin', duration: 2 })
 *   animatedSvg(svg, { name: 'bell', trigger: 'hover' })       plays when the SVG is hovered (inline SVG only)
 *   animatedSvg(svg, { swapTo: otherSvg, effect: 'flip' })     A <-> B forever (see animatedSwapSvg)
 *   time: seconds -> a frozen frame at that moment (used for frame export)
 */
export function animatedSvg(svg, opts) {
  const o = opts || {}
  if (o.swapTo) return animatedSwapSvg(svg, o.swapTo, o)
  const { attrs, inner } = parseSvg(svg)
  const m = resolveMotion(o)
  const spec = o.spec || (o.name ? motionFor(o.name) : null)
  const id = 'wm' + hash(svg + '|' + JSON.stringify(m) + (spec && (spec.parts || spec.deco) ? JSON.stringify([spec.parts, spec.deco]) : ''))
  const rootStroked = isStroke(attrs.stroke)
  const anyStroke = rootStroked || /\sstroke="(?!none")/.test(inner)
  let body = inner
  let draw = false, halo = false
  if (m.preset === 'draw' && anyStroke) { const r = markDraw(inner, rootStroked); body = r.inner; draw = r.any }
  const [dx, dy] = dirVec(m.dir)
  const frozen = o.time != null
  const iter = m.loop ? 'infinite' : '1'
  const delay = frozen ? `${num(-Number(o.time) + m.delay)}s` : `${num(m.delay)}s`
  const play = frozen ? ';animation-play-state:paused' : ''
  const name = `${id}-${m.preset}`
  const timing = `${num(m.duration)}s ${m.ease} ${delay} ${iter} both${play}`
  const on = m.trigger === 'hover' && !frozen ? `.${id}:hover ` : `.${id} `
  let css = ''
  if (draw) {
    const p = m.loop ? 'wm-draw-path-loop' : 'wm-draw-path', f = m.loop ? 'wm-draw-fill-loop' : 'wm-draw-fill'
    css += keyframesCss(`${id}-dp`, DRAW_KEYFRAMES[p]) + keyframesCss(`${id}-df`, DRAW_KEYFRAMES[f])
    css += `${on}[data-wm-pl]{stroke-dasharray:1 1.5;animation:${id}-dp ${timing}}${on}[data-wm-fill]{animation:${id}-df ${timing}}`
  } else if (hasParts(inner)) {
    css += partsCss(id, partsPlan(m, spec), on, frozen ? Number(o.time) : null)
  } else {
    const stops = presetStops(m.preset, m.loop, { k: m.k, dx, dy, em: 16 })
    // glow / twinkle: Safari ignores CSS `filter` on SVG child elements (WebKit bug 246106), so the halo is not
    // a drop-shadow keyframe on the <g>. It is a blurred copy of the icon (<use> + an SVG <filter>, which every
    // engine and most static renderers support) whose opacity animates. opacity="0" keeps it out of still renders.
    halo = !!GLOW_HALO[m.preset] && stops.some(st => st[1].filter)
    const gStops = halo ? stops.map(([at, p, e]) => { const q = Object.assign({}, p); delete q.filter; return [at, q, e] }) : stops
    css += keyframesCss(name, gStops)
    css += `.${id}-g{transform-box:view-box;transform-origin:${pct(m.origin[0])} ${pct(m.origin[1])}}`
    css += `${on}.${id}-g{animation:${name} ${timing}}`
    if (halo) {
      css += keyframesCss(`${id}-h`, stops.map(([at, p, e]) => [at, { opacity: p.filter && p.filter !== GLOW0 ? 1 : 0 }, e]))
      css += `${on}.${id}-h{animation:${id}-h ${timing}}`
      body = haloDefs(id, GLOW_HALO[m.preset], m.k) +
        `<use href="#${id}-i" xlink:href="#${id}-i" class="${id}-h" filter="url(#${id}-f)" opacity="0"/><g id="${id}-i">${body}</g>`
    }
  }
  if (!frozen) css += `@media (prefers-reduced-motion:reduce){.${id} *{animation:none!important}}`
  const a = Object.assign({}, attrs)
  a.class = a.class ? a.class + ' ' + id : id
  if (!a.xmlns) a.xmlns = 'http://www.w3.org/2000/svg'
  if (halo && !a['xmlns:xlink']) a['xmlns:xlink'] = 'http://www.w3.org/1999/xlink'
  if (o.size) { a.width = o.size; a.height = o.size }
  if (o.color) a.color = o.color
  return `<svg${attrStr(a)}><style>${css}</style><g class="${id}-g">${body}</g></svg>`
}

// Parts choreography in an export: the <g> stands still and each tagged child plays its role (parts.js partsPlan),
// with literal keyframes. time != null freezes every part at that moment (frame export).
const ROLE_SEL = {
  obj: ':not(.wm-deco,.wm-shadow,.wm-a,.wm-s,defs,title,desc,style)', a: '.wm-a', s: '.wm-s', shadow: '.wm-shadow', deco: '.wm-deco',
}
// Fading presets (breathe, rise, drop, flicker, fill): opacity on each node separately lets overlapping parts show
// through each other mid-fade (an outline over its fill, the body over its cast shadow), which reads as a glitch in a
// GIF on a coloured background. So the object's opacity track plays on the <g> (the icon fades as one picture) and
// the parts that share the object's preset keep only their transforms; a cast shadow keeps its extra fade relative
// to the object's (its own opacity / the object's at the same stop).
const opOf = st => (st[1].opacity == null ? 1 : Number(st[1].opacity))
function partsCss(id, plan, on, time) {
  let css = ''
  const named = {}
  const timing = r => {
    const delay = time != null ? -time + r.delay : r.delay
    return `${num(r.duration)}s ${r.ease} ${num(delay)}s ${r.iter} both${time != null ? ';animation-play-state:paused' : ''}`
  }
  const modeOf = r => { const [dx, dy] = dirVec(r.dir || 0); return { k: r.k == null ? 1 : r.k, dx, dy, em: 16 } }
  const objStops = plan.obj.stops(modeOf(plan.obj))
  const groupOp = objStops.some(st => opOf(st) !== 1)
  if (groupOp) {
    css += keyframesCss(`${id}-op`, objStops.map(([at, p, e]) => [at, { opacity: p.opacity == null ? 1 : p.opacity }, e]))
    css += `${on}.${id}-g{animation:${id}-op ${timing(plan.obj)}}`
  }
  for (const role of ['obj', 'shadow', 'a', 's', 'deco']) {
    const r = plan[role]
    if (!r) continue
    const shared = groupOp && role !== 'deco' && r.preset === plan.obj.preset && r.duration === plan.obj.duration && r.delay === plan.obj.delay
    const key = r.key + '|' + r.k + '|' + r.dir + (shared ? '|g' : '')
    let name = named[key]
    if (!name) {
      name = named[key] = `${id}-${Object.keys(named).length}`
      // the glow / twinkle halo stays a drop-shadow here: per part, so only the parts that glow get one
      let stops = r.stops(modeOf(r))
      if (shared) {
        const own = stops !== objStops && stops.length === objStops.length && stops.every((st, i) => st[0] === objStops[i][0])
        stops = stops.map((st, i) => {
          const q = Object.assign({}, st[1])
          delete q.opacity
          if (own && role === 'shadow') { const o = opOf(objStops[i]); const rel = o > 0.001 ? opOf(st) / o : 1; if (Math.abs(rel - 1) > 0.001) q.opacity = num(Math.min(1, rel)) }
          return [st[0], q, st[2]]
        })
        if (!stops.some(st => Object.keys(st[1]).length)) stops = [[0, { transform: 'none' }], [100, { transform: 'none' }]]
      }
      css += keyframesCss(name, stops)
    }
    const origin = r.box === 'fill-box' || !r.origin ? '50% 50%' : `${pct(r.origin[0])} ${pct(r.origin[1])}`
    css += `.${id}-g>${ROLE_SEL[role]}{transform-box:${r.box};transform-origin:${origin}}`
    css += `${on}.${id}-g>${ROLE_SEL[role]}{animation:${name} ${timing(r)}}`
  }
  return css
}

// The glow / twinkle halo as an SVG filter: two blurs of the icon's alpha, tinted --wm-glow (default currentColor)
// at 42% and 22%, the same as motion.css's drop-shadows (a drop-shadow blur radius is 2 standard deviations).
function haloDefs(id, radii, k) {
  const sd = em => num(Math.max(0, em * k * 16 / 2))
  const flood = (alpha, res) => `<feFlood flood-color="currentColor" flood-opacity="${alpha}" style="flood-color:var(--wm-glow, currentColor)" result="${res}"/>`
  return `<defs><filter id="${id}-f" filterUnits="userSpaceOnUse" x="-12" y="-12" width="48" height="48" color-interpolation-filters="sRGB">` +
    `<feGaussianBlur in="SourceAlpha" stdDeviation="${sd(radii[0])}" result="b1"/><feGaussianBlur in="SourceAlpha" stdDeviation="${sd(radii[1])}" result="b2"/>` +
    flood(GLOW_HALO.alpha[0], 'c1') + `<feComposite in="c1" in2="b1" operator="in" result="g1"/>` +
    flood(GLOW_HALO.alpha[1], 'c2') + `<feComposite in="c2" in2="b2" operator="in" result="g2"/>` +
    `<feMerge><feMergeNode in="g2"/><feMergeNode in="g1"/></feMerge></filter></defs>`
}

const ROOT_ONLY = ['xmlns', 'xmlns:xlink', 'width', 'height', 'viewBox', 'class', 'style', 'role', 'aria-label', 'aria-hidden', 'focusable', 'part']
// A swap export's timing: { effect, dur, cycle, hold (null = legacy 2.4 s cycle), ease }
function swapTiming(o) {
  const effect = EFFECTS.includes(o.effect) ? o.effect : 'fade'
  const dur = Number(o.duration) || EFFECT_DEFAULTS[effect].dur
  const hasHold = o.hold != null && o.hold !== '' && isFinite(Number(o.hold))
  const hold = hasHold ? Math.max(0, Number(o.hold)) : null
  const cycle = Number(o.cycle) || (hasHold ? swapCycle(dur, hold) : 2.4)
  return { effect, dur, cycle, hold, ease: swapEase(o.ease) }
}
/**
 * Two icons that keep turning into each other (A, transition, B, transition, …) as one animated SVG.
 *   animatedSwapSvg(playSvg, pauseSvg, { effect: 'flip', cycle: 2.4, duration: .6 })
 *   animatedSwapSvg(playSvg, pauseSvg, { effect: 'morph', duration: .8, hold: 1.2, ease: 'springy' })   cycle = 2 x (duration + hold)
 */
export function animatedSwapSvg(aSvg, bSvg, opts) {
  const o = opts || {}
  const { effect, dur, cycle, hold, ease } = swapTiming(o)
  const A = parseSvg(aSvg), B = parseSvg(bSvg)
  const id = 'wm' + hash(aSvg + '|' + bSvg + '|' + effect + cycle + dur + (hold == null ? '' : '|' + hold + '|' + (ease || '')))
  const st = EFFECT_STATES[effect]
  const { a, b } = swapLoopStops(effect, cycle, dur, { hold: hold == null ? null : hold, ease })
  const frozen = o.time != null
  const t = `${num(cycle)}s linear ${frozen ? num(-Number(o.time)) : 0}s infinite both${frozen ? ';animation-play-state:paused' : ''}`
  let css = keyframesCss(`${id}-a`, a) + keyframesCss(`${id}-b`, b)
  css += `.${id} .${id}-a,.${id} .${id}-b{transform-box:view-box;transform-origin:50% 50%${st.flip ? ';backface-visibility:hidden' : ''}}`
  css += `.${id}-a{animation:${id}-a ${t}}.${id}-b{animation:${id}-b ${t}}`
  if (!frozen) css += `@media (prefers-reduced-motion:reduce){.${id} *{animation:none!important}}`
  // B carries opacity="0" as a presentation attribute: the keyframes override it while animating, and renderers that
  // ignore CSS animation (Figma, PowerPoint, Keynote, Illustrator, thumbnails) show A alone instead of A over B.
  const gAttrs = attrs => { const g = {}; for (const k in attrs) if (!ROOT_ONLY.includes(k)) g[k] = attrs[k]; return g }
  const root = { xmlns: 'http://www.w3.org/2000/svg', width: o.size || A.attrs.width || 24, height: o.size || A.attrs.height || 24, viewBox: A.attrs.viewBox || '0 0 24 24', class: id }
  if (o.color) root.color = o.color
  const clip = st.clip ? `<defs><clipPath id="${id}-c"><rect width="24" height="24"/></clipPath></defs>` : ''
  const open = st.clip ? `<g clip-path="url(#${id}-c)">` : '<g>'
  return `<svg${attrStr(root)}><style>${css}</style>${clip}${open}<g class="${id}-a"${attrStr(gAttrs(A.attrs))}>${A.inner}</g><g class="${id}-b"${attrStr(Object.assign(gAttrs(B.attrs), { opacity: '0' }))}>${B.inner}</g></g></svg>`
}

/** The total length of one cycle (loop) or one play (+ a short rest) for an export, in seconds. */
export function exportDuration(opts, svg) {
  const o = opts || {}
  if (o.swapTo) return swapTiming(o).cycle
  const m = resolveMotion(o)
  if (!m.loop) return m.duration + 0.3
  // parts: the decorations loop over a whole number of object cycles; record until everything is back in place
  const inner = svg ? parseSvg(svg).inner : ''
  if (m.preset !== 'draw' && hasParts(inner) && /\sclass="[^"]*\bwm-deco\b/.test(inner)) return partsPlan(m, o.spec || (o.name ? motionFor(o.name) : null)).cycle
  return m.duration
}

/** A frozen frame at `time` seconds. */
export function frameSvg(svg, opts, time) {
  const o = Object.assign({}, opts, { time })
  if (o.trigger === 'hover') o.trigger = 'once'
  return animatedSvg(svg, o)
}

function loadImage(src) {
  return new Promise((res, rej) => { const img = new Image(); img.onload = () => res(img); img.onerror = () => rej(new Error('with icons motion: frame failed to render')); img.src = src })
}
const nowMs = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now())
// a macrotask that background tabs do not throttle to 1 s (unlike setTimeout), so long exports keep the page responsive
function yieldTask() {
  return new Promise(res => {
    if (typeof MessageChannel === 'undefined') { setTimeout(res, 0); return }
    const ch = new MessageChannel()
    ch.port1.onmessage = () => { ch.port1.close(); res() }
    ch.port2.postMessage(0)
  })
}
// Frame times for an export: n frames spread evenly over `seconds` (so loops close seamlessly), at most maxFrames.
function timeline(seconds, fps, maxFrames) {
  const n = Math.max(1, Math.min(maxFrames, Math.round(seconds * fps)))
  const times = []
  for (let i = 0; i < n; i++) times.push(i * seconds / n)
  return { n, times, step: seconds / n }
}
// Renders the frames at `times` one by one into ONE reused canvas and hands each frame's ImageData to cb.
// Memory stays at a single frame whatever the length (iOS Safari caps total canvas memory and blanks canvases past it).
async function eachFrame(svg, opts, f, times, cb) {
  const size = Math.round(f.size || 256)
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d', { willReadFrequently: true })
  const o = Object.assign({}, opts, { size, color: f.color || (opts && opts.color) || '#000' })
  let last = nowMs()
  try {
    for (let i = 0; i < times.length; i++) {
      const img = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(frameSvg(svg, o, times[i])))
      g.clearRect(0, 0, size, size)
      if (f.background) { g.fillStyle = f.background; g.fillRect(0, 0, size, size) }
      g.drawImage(img, 0, 0, size, size)
      await cb(g.getImageData(0, 0, size, size), i)
      if (nowMs() - last > 30) { await yieldTask(); last = nowMs() }
    }
  } finally { c.width = c.height = 0 }
}

/**
 * Renders frames of an animated icon to canvases (browser only).
 *   renderFrames(svg, { name: 'bell' }, { size: 256, fps: 30, color: '#111', background: '#fff' })
 * Returns Promise<HTMLCanvasElement[]>. Every frame stays in memory: for GIFs use gif(), which streams.
 */
export async function renderFrames(svg, opts, frameOpts) {
  const f = frameOpts || {}
  const size = Math.round(f.size || 256), fps = f.fps || 30
  const { times } = timeline(f.seconds || exportDuration(opts, svg), fps, f.maxFrames || 600)
  const frames = []
  await eachFrame(svg, opts, Object.assign({}, f, { size }), times, d => {
    const c = document.createElement('canvas')
    c.width = c.height = size
    c.getContext('2d').putImageData(d, 0, 0)
    frames.push(c)
  })
  return frames
}

// ---- GIF (89a, global palette, transparent index, infinite loop). Small, dependency-free, streaming.
function byteBuf(cap) {
  let a = new Uint8Array(cap || 4096), n = 0
  const room = k => {
    if (n + k <= a.length) return
    let m = a.length * 2
    while (m < n + k) m *= 2
    const b = new Uint8Array(m); b.set(a.subarray(0, n)); a = b
  }
  return {
    byte(v) { room(1); a[n++] = v },
    bytes(list) { room(list.length); for (let i = 0; i < list.length; i++) a[n++] = list[i] },
    done() { return a.slice(0, n) },
  }
}
function lzw(indices, minSize, out) {
  const clear = 1 << minSize, eoi = clear + 1
  let size = minSize + 1, next = eoi + 1, cur = 0, shift = 0
  let table = new Map()
  const bytes = byteBuf(indices.length >> 1)
  const emit = code => { cur |= code << shift; shift += size; while (shift >= 8) { bytes.byte(cur & 255); cur >>>= 8; shift -= 8 } }
  emit(clear)
  let prefix = indices[0]
  for (let i = 1; i < indices.length; i++) {
    const k = indices[i]
    const key = (prefix << 8) | k
    const code = table.get(key)
    if (code === undefined) {
      emit(prefix)
      if (next === 4096) { emit(clear); next = eoi + 1; size = minSize + 1; table = new Map() }
      else { if (next >= (1 << size)) size++; table.set(key, next++) }
      prefix = k
    } else prefix = code
  }
  emit(prefix); emit(eoi)
  if (shift > 0) bytes.byte(cur & 255)
  const data = bytes.done()
  out.byte(minSize)
  for (let i = 0; i < data.length; i += 255) { const n = Math.min(255, data.length - i); out.byte(n); out.bytes(data.subarray(i, i + n)) }
  out.byte(0)
}
// palette: popularity over 15-bit colour buckets, averaged
function gifHistogram() {
  const count = new Uint32Array(32768), sr = new Float64Array(32768), sg = new Float64Array(32768), sb = new Float64Array(32768)
  const h = { count, sr, sg, sb, transparent: false }
  h.add = d => {
    const p = d.data
    for (let i = 0; i < p.length; i += 4) {
      if (p[i + 3] < 128) { h.transparent = true; continue }
      const key = (p[i] >> 3) << 10 | (p[i + 1] >> 3) << 5 | (p[i + 2] >> 3)
      count[key]++; sr[key] += p[i]; sg[key] += p[i + 1]; sb[key] += p[i + 2]
    }
  }
  return h
}
function gifPalette(h) {
  const { count, sr, sg, sb, transparent } = h
  const max = transparent ? 255 : 256
  const keys = []
  for (let k = 0; k < 32768; k++) if (count[k]) keys.push(k)
  keys.sort((a, b) => count[b] - count[a])
  const pal = keys.slice(0, max).map(k => [sr[k] / count[k], sg[k] / count[k], sb[k] / count[k]].map(Math.round))
  if (!pal.length) pal.push([0, 0, 0])
  const tIndex = transparent ? pal.length : -1
  const map = new Int16Array(32768).fill(-1)
  const nearest = key => {
    if (map[key] >= 0) return map[key]
    const r = (key >> 10 & 31) * 8 + 4, g = (key >> 5 & 31) * 8 + 4, b = (key & 31) * 8 + 4
    let best = 0, bd = Infinity
    for (let i = 0; i < pal.length; i++) {
      const dr = pal[i][0] - r, dg = pal[i][1] - g, db = pal[i][2] - b
      const dd = dr * dr * 2 + dg * dg * 4 + db * db * 3
      if (dd < bd) { bd = dd; best = i }
    }
    return (map[key] = best)
  }
  return { pal, transparent, tIndex, nearest }
}
function gifHeader(w, h, P, loop) {
  const out = byteBuf(1024)
  const u16 = v => { out.byte(v & 255); out.byte((v >> 8) & 255) }
  for (const c of 'GIF89a') out.byte(c.charCodeAt(0))
  u16(w); u16(h)
  out.bytes([0xf7, 0, 0])
  for (let i = 0; i < 256; i++) out.bytes(P.pal[i] || [0, 0, 0])
  out.bytes([0x21, 0xff, 0x0b]); for (const c of 'NETSCAPE2.0') out.byte(c.charCodeAt(0))
  out.bytes([0x03, 0x01]); u16(loop == null ? 0 : loop); out.byte(0)
  return out.done()
}
// 15-bit colour keys of a frame (2 bytes/pixel; 0x8000 = transparent): what the encoder needs, at half the memory
function gifKeys(d) {
  const p = d.data, keys = new Uint16Array(d.width * d.height)
  for (let i = 0, j = 0; i < p.length; i += 4, j++) keys[j] = p[i + 3] < 128 ? 0x8000 : (p[i] >> 3) << 10 | (p[i + 1] >> 3) << 5 | (p[i + 2] >> 3)
  return keys
}
// one frame (graphic control extension + image) as bytes; delay in centiseconds
function gifFrame(w, h, keys, P, delay) {
  const out = byteBuf((w * h >> 1) + 64)
  const u16 = v => { out.byte(v & 255); out.byte((v >> 8) & 255) }
  out.bytes([0x21, 0xf9, 0x04, (P.transparent ? (2 << 2) | 1 : 0), delay & 255, delay >> 8, P.transparent ? P.tIndex : 0, 0])
  out.byte(0x2c); u16(0); u16(0); u16(w); u16(h); out.byte(0)
  const idx = new Uint8Array(w * h)
  for (let j = 0; j < idx.length; j++) idx[j] = keys[j] & 0x8000 ? P.tIndex : P.nearest(keys[j])
  lzw(idx, 8, out)
  return out.done()
}
function concatBytes(parts) {
  let n = 0
  for (const x of parts) n += x.length
  const all = new Uint8Array(n)
  let o = 0
  for (const x of parts) { all.set(x, o); o += x.length }
  return all
}
/**
 * Encodes frames (canvases or ImageData of equal size) to an animated GIF.
 *   encodeGif(frames, { delay: 33, loop: 0 }) -> Uint8Array
 * Pixels with alpha < 50% become transparent; pass a background to renderFrames() for smooth edges.
 */
export function encodeGif(frames, opts) {
  const o = opts || {}
  const datas = frames.map(f => f.data ? f : f.getContext('2d').getImageData(0, 0, f.width, f.height))
  const hist = gifHistogram()
  datas.forEach(hist.add)
  const P = gifPalette(hist)
  const delay = Math.max(2, Math.round((o.delay || 33) / 10))
  const parts = [gifHeader(datas[0].width, datas[0].height, P, o.loop)]
  for (const d of datas) parts.push(gifFrame(d.width, d.height, gifKeys(d), P, delay))
  parts.push(new Uint8Array([0x3b]))
  return concatBytes(parts)
}

/**
 * Animated GIF of an icon (browser): gif(svg, { name: 'bell' }, { size: 128, fps: 25, background: '#fff' }) -> Promise<Blob>
 * Streams: one canvas is reused, each frame is quantised and compressed as soon as it is drawn, and the page gets
 * control back between frames. Long loops keep their length and drop to fewer frames per second (maxFrames, 150).
 */
export async function gif(svg, opts, frameOpts) {
  const f = Object.assign({ fps: 25, size: 128, maxFrames: 150 }, frameOpts)
  f.size = Math.round(f.size)
  const seconds = f.seconds || exportDuration(opts, svg)
  // GIF delays are whole centiseconds and browsers slow anything under 2 cs down to 10 cs: at most 50 fps
  const { n, times, step } = timeline(seconds, Math.min(50, f.fps), Math.max(1, f.maxFrames))
  const cs = i => Math.round((i + 1) * step * 100) - Math.round(i * step * 100)   // per-frame delays add up exactly
  const hist = gifHistogram()
  const parts = []
  // short exports: keep each frame as compact 15-bit colour keys (2 bytes/pixel) and render once;
  // long ones: build the palette from every few frames, then render again and encode frame by frame
  if (f.size * f.size * n * 2 <= 24e6) {
    const held = []
    await eachFrame(svg, opts, f, times, d => { hist.add(d); held.push(gifKeys(d)) })
    const P = gifPalette(hist)
    parts.push(gifHeader(f.size, f.size, P, 0))
    for (let i = 0; i < held.length; i++) {
      parts.push(gifFrame(f.size, f.size, held[i], P, Math.max(2, cs(i))))
      held[i] = null
      if (i % 8 === 7) await yieldTask()
    }
  } else {
    const stride = Math.max(1, Math.ceil(n / 40))
    await eachFrame(svg, opts, f, times.filter((_, i) => i % stride === 0), d => hist.add(d))
    const P = gifPalette(hist)
    parts.push(gifHeader(f.size, f.size, P, 0))
    await eachFrame(svg, opts, f, times, (d, i) => { parts.push(gifFrame(d.width, d.height, gifKeys(d), P, Math.max(2, cs(i)))) })
  }
  parts.push(new Uint8Array([0x3b]))
  return new Blob(parts, { type: 'image/gif' })
}

// ---- video (MediaRecorder): WebM where the browser records it, else MP4 (Safari 14.1–18.3 records MP4 only)
const VIDEO_TYPES = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4;codecs=avc1.42E01E', 'video/mp4']
const pageHidden = () => typeof document !== 'undefined' && document.visibilityState === 'hidden'
function whenVisible() {
  return new Promise(res => {
    const on = () => { if (!pageHidden()) { document.removeEventListener('visibilitychange', on); res() } }
    document.addEventListener('visibilitychange', on)
  })
}
const sleepUntil = t => new Promise(res => setTimeout(res, Math.max(0, t - nowMs())))

/**
 * A video of an icon (browser with MediaRecorder):
 *   video(svg, { name: 'bell' }, { size: 256, fps: 30, loops: 2, background: '#fff' }) -> Promise<{ blob, mimeType, ext }>
 * WebM (VP9/VP8) where supported, otherwise MP4 (H.264); `ext` is 'webm' or 'mp4'. Frames are pushed one by one
 * (captureStream(0) + requestFrame) on a wall-clock schedule, and recording pauses while the tab is hidden, so the
 * video never stretches when someone switches tabs. Frames wait as small decoded SVG images and are drawn into ONE
 * canvas as they are recorded, so memory does not grow with the length (iOS Safari caps total canvas memory).
 */
export async function video(svg, opts, frameOpts) {
  const f = Object.assign({ fps: 30, size: 256, loops: 2 }, frameOpts)
  if (typeof MediaRecorder === 'undefined') throw new Error('with icons motion: MediaRecorder is not available')
  const candidates = f.mimeTypes || VIDEO_TYPES
  const type = candidates.find(t => MediaRecorder.isTypeSupported(t))
  if (!type && f.mimeTypes) throw new Error('with icons motion: this browser cannot record ' + candidates.join(' or '))
  const size = Math.round(f.size)
  const { times } = timeline(f.seconds || exportDuration(opts, svg), f.fps, f.maxFrames || 600)
  const o = Object.assign({}, opts, { size, color: f.color || (opts && opts.color) || '#000' })
  const frames = []
  let last = nowMs()
  for (const t of times) {
    frames.push(await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(frameSvg(svg, o, t))))
    if (nowMs() - last > 30) { await yieldTask(); last = nowMs() }
  }
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  let stream = c.captureStream(0)
  let track = stream.getVideoTracks()[0]
  if (!track || typeof track.requestFrame !== 'function') { stream.getTracks().forEach(t => t.stop()); stream = c.captureStream(f.fps); track = null }
  const rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined)
  const chunks = []
  rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data) }
  const stopped = new Promise((res, rej) => { rec.onstop = res; rec.onerror = e => rej((e && e.error) || new Error('with icons motion: recording failed')) })
  const interval = 1000 / f.fps, total = frames.length * Math.max(1, f.loops)
  rec.start()
  let t0 = nowMs()
  try {
    for (let i = 0; i < total; i++) {
      if (pageHidden()) {
        if (rec.state === 'recording' && rec.pause) rec.pause()
        await whenVisible()
        if (rec.state === 'paused') rec.resume()
        t0 = nowMs() - i * interval
      }
      g.clearRect(0, 0, size, size)
      if (f.background) { g.fillStyle = f.background; g.fillRect(0, 0, size, size) }
      g.drawImage(frames[i % frames.length], 0, 0, size, size)
      if (track) track.requestFrame()
      await sleepUntil(t0 + (i + 1) * interval)
    }
  } finally {
    if (rec.state !== 'inactive') rec.stop()
    stream.getTracks().forEach(t => t.stop())
  }
  await stopped
  frames.length = 0
  c.width = c.height = 0
  const mimeType = rec.mimeType || type || (chunks[0] && chunks[0].type) || 'video/webm'
  const base = mimeType.split(';')[0].trim()
  return { blob: new Blob(chunks, { type: base }), mimeType, ext: base === 'video/mp4' ? 'mp4' : 'webm' }
}

/** WebM video of an icon: webm(svg, opts, { size, fps, loops: 2, background }) -> Promise<Blob>. Rejects where the
 *  browser cannot record WebM (Safari before 18.4): use video(), which falls back to MP4. */
export async function webm(svg, opts, frameOpts) {
  const types = VIDEO_TYPES.filter(t => t.startsWith('video/webm'))
  if (typeof MediaRecorder !== 'undefined' && !types.some(t => MediaRecorder.isTypeSupported(t))) {
    throw new Error('with icons motion: this browser cannot record WebM; use video(), which falls back to MP4')
  }
  return (await video(svg, opts, Object.assign({}, frameOpts, { mimeTypes: types }))).blob
}
