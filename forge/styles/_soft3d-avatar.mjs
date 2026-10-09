// SOFT 3D avatars: people as Memoji-like 3D busts, animals and monsters as cute 3D character heads. Front-facing
// (no tilt), lit from the upper left like every soft3d object, a soft contact shadow below.
//
// PEOPLE  a shaded egg-shaped head (soft cheek light, blush), ears, eyes with a dark iris and a catch-light, brows, a
//         nose by shading, a smile; hair as layered volumetric masses (a back mass behind the head for long styles, a
//         front mass with a highlight band); headwear with fabric shading (hijab frame and drape, turban wraps, cap with
//         brim, headphones); clothing with a neckline and soft folds. Each person is a recipe (PEOPLE), drawn by bust().
//         Skin: seven tones from light to deep, spread across the 21 people so related avatars never clump on one tone.
// ANIMALS + MONSTERS  a recipe per character (CHARACTERS): head shape, ears, muzzle, markings, eyes, nose, extras.
//
// Every shape is a base fill in a role colour plus one shared bounding-box gradient overlay (the volume: a lit
// upper left and a shaded rim), so one defs node of four gradients serves the whole drawing.
// PEOPLE roles follow the avatar convention every per-icon palette (forge/palettes/avatar-*.json) is authored for:
//   c1 skin, tint skin light, shadow skin shade, c2 hair, c3 the hair's shade (the back mass, the braid parting),
//   c4 clothing. When headwear or a hoodie owns c2 (turban, cap: the fabric; avatar-teen: the hoodie; avatar-man-bald:
//   the shirt, as its palettes say), c3 is that fabric's shade (turban wraps, cap brim, hood rim) and whatever hair is
//   left (beard, brows, hair under the cap, the bald man's sides) paints in ink, the palettes' darkest neutral.
//   Headphones (a secondary detail no palette names) paint in accent, the palettes' bright pop colour, so they stand
//   out from hair, skin and clothing on every palette (the default is a coral pair).
//   The kurta's placket takes c2 so it matches the turban. accent blush, ink eyes, edge whites, tint glass lenses.
// ANIMAL / MONSTER roles: c1 fur, c2 second fur, c3 third colour, c4 detail (horn, beak), as before.
import { fmt } from '../kernel/geom.mjs'
import { pathD } from './_soft3d-path.mjs'
import { BASE } from './_soft3d-tune.mjs'

export const SKINS = ['#F7D7BE', '#EEBF98', '#DDA176', '#C3845A', '#A0673F', '#7B4B2C', '#593623']
const HAIR = { black: '#2A2120', dark: '#43291D', brown: '#6E4428', auburn: '#94452A', blonde: '#D7A14A', grey: '#C4C9D1', ginger: '#C8632E' }
// the hair's shade (c3 fallback): the same ~0.72 darkening the true-to-life palettes use for their hair pairs
const shadeOf = hex => '#' + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * 0.72).toString(16).padStart(2, '0')).join('').toUpperCase()
const CLOTH = { blue: '#3F7FE0', coral: '#F06B55', teal: '#22A495', yellow: '#F4BE36', pink: '#F27BA5', mint: '#6FD3B6', navy: '#2F4170',
  lilac: '#A78BE8', green: '#4FB463', orange: '#F28A2E', red: '#E0483F', grey: '#8F99A8', purple: '#8A66DE', rose: '#D9577A', saffron: '#F29A2E', white: '#EEF1F5' }

// people: skin index, hair colour, clothing colour, second clothing/detail colour, features
const PEOPLE = {
  'avatar-man': { skin: 0, hair: 'dark', cloth: 'blue', hairStyle: 'short', top: 'tee' },
  'avatar-woman': { skin: 0, hair: 'brown', cloth: 'coral', hairStyle: 'long', top: 'tee', lashes: true },
  'avatar-person': { skin: 2, hair: 'black', cloth: 'teal', hairStyle: 'crop', top: 'hoodie' },
  'avatar-boy': { skin: 4, hair: 'black', cloth: 'yellow', hairStyle: 'spiky', top: 'tee', young: true },
  'avatar-girl': { skin: 0, hair: 'ginger', cloth: 'pink', hairStyle: 'pigtails', top: 'collar', young: true, lashes: true },
  'avatar-baby': { skin: 2, hair: 'brown', cloth: 'mint', hairStyle: 'tuft', top: 'onesie', baby: true },
  'avatar-teen': { skin: 5, hair: 'black', cloth: 'purple', hairStyle: 'swept', top: 'hoodie', young: true, wear: 'c2' },
  'avatar-older-man': { skin: 0, hair: 'grey', cloth: 'navy', hairStyle: 'receding', top: 'cardigan', moustache: true, old: true },
  'avatar-older-woman': { skin: 4, hair: 'grey', cloth: 'lilac', hairStyle: 'bun', top: 'cardigan', glasses: 'round', old: true, lashes: true },
  'avatar-man-beard': { skin: 2, hair: 'dark', cloth: 'green', hairStyle: 'short', top: 'shirt', beard: true },
  'avatar-man-afro': { skin: 6, hair: 'black', cloth: 'orange', hairStyle: 'afro', top: 'tee' },
  'avatar-man-bald': { skin: 3, hair: 'dark', cloth: 'red', hairStyle: 'bald', top: 'tee', stubble: true, wear: 'c2' },
  'avatar-man-turban': { skin: 4, hair: 'black', cloth: 'navy', detail: 'saffron', hairStyle: 'none', top: 'kurta', turban: true, beard: true },
  'avatar-man-cap': { skin: 1, hair: 'brown', cloth: 'grey', detail: 'red', hairStyle: 'short', top: 'tee', cap: true },
  'avatar-woman-curly': { skin: 1, hair: 'auburn', cloth: 'teal', hairStyle: 'curly', top: 'tee', lashes: true },
  'avatar-woman-braids': { skin: 5, hair: 'black', cloth: 'yellow', hairStyle: 'braids', top: 'tee', lashes: true },
  'avatar-woman-bun': { skin: 0, hair: 'blonde', cloth: 'purple', hairStyle: 'bun', top: 'collar', lashes: true },
  'avatar-woman-bob': { skin: 6, hair: 'black', cloth: 'coral', hairStyle: 'bob', top: 'tee', lashes: true },
  'avatar-person-glasses': { skin: 3, hair: 'brown', cloth: 'navy', hairStyle: 'short', top: 'shirt', glasses: 'square' },
  'avatar-person-headphones': { skin: 4, hair: 'dark', cloth: 'teal', detail: 'grey', hairStyle: 'crop', top: 'hoodie', headphones: true },
}

export const isAvatar = icon => String(icon?.name || '').startsWith('avatar-')

// ---------------------------------------------------------------------------
// path helpers (24 grid)
const n = v => fmt(v)
const E = (cx, cy, rx, ry = rx) => `M${n(cx - rx)} ${n(cy)}a${n(rx)} ${n(ry)} 0 1 0 ${n(2 * rx)} 0a${n(rx)} ${n(ry)} 0 1 0 ${n(-2 * rx)} 0z`
// an egg: wider at the top, a softer narrower chin (people's heads)
function egg(cx, cy, rx, ry, chin = 0.16) {
  const pts = []
  for (let i = 0; i < 48; i++) {
    const t = i / 48 * Math.PI * 2, s = Math.sin(t)
    const w = s > 0 ? 1 - chin * s * s : 1
    pts.push([cx + rx * Math.cos(t) * w, cy + ry * s])
  }
  return pathD([pts], { tol: 0.03 })
}
// a bumpy ring (curls, afro, fur): r(t) with n bumps
function bumpy(cx, cy, rx, ry, bumps, amp, phase = 0, from = 0, to = Math.PI * 2, close = null) {
  const pts = [], N = Math.max(60, bumps * 10)
  for (let i = 0; i <= N; i++) {
    const t = from + (to - from) * i / N
    const k = 1 + amp * Math.abs(Math.sin(bumps * (t + phase) / 2))
    pts.push([cx + rx * k * Math.cos(t), cy + ry * k * Math.sin(t)])
  }
  if (close) pts.push(...close)
  return pathD([pts], { tol: 0.03 })
}
const rot = (p, c, a) => { const s = Math.sin(a), co = Math.cos(a), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * co - y * s, c[1] + x * s + y * co] }
const ringD = (pts) => pathD([pts], { tol: 0.03 })

// ---------------------------------------------------------------------------
// the painter: shared gradients (bounding-box units) + role colours
function painter(icon, pal) {
  const out = [], defs = [], memo = {}
  let gi = 0
  const col = r => `var(--with-soft3d-${r}, ${pal[r] || BASE[r]})`
  const id = k => `wg-soft3d-${icon.name || 'icon'}-${k}`
  const stop = (o, r, op = 1) => ['stop', op === 1 ? { offset: o, 'stop-color': col(r) } : { offset: o, 'stop-color': col(r), 'stop-opacity': op }]
  const grad = (key, make) => memo[key] || (memo[key] = (() => { const k = gi++; defs.push(make(id(k))); return `url(#${id(k)})` })())
  const G = {
    vol: () => grad('vol', i => ['radialGradient', { id: i, cx: 0.36, cy: 0.3, r: 0.8 }, [stop(0, 'shine', 0.5), stop(0.36, 'shine', 0.06), stop(0.66, 'shadow', 0), stop(1, 'shadow', 0.3)]]),
    soft: () => grad('soft', i => ['radialGradient', { id: i, cx: 0.38, cy: 0.28, r: 0.85 }, [stop(0, 'shine', 0.3), stop(0.45, 'shine', 0), stop(0.75, 'shadow', 0), stop(1, 'shadow', 0.2)]]),
    down: () => grad('down', i => ['linearGradient', { id: i, x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, 'shadow', 0.34), stop(0.55, 'shadow', 0.04), stop(1, 'shine', 0.1)]]),
    glass: () => grad('glass', i => ['linearGradient', { id: i, x1: 0, y1: 0, x2: 0.5, y2: 1 }, [stop(0, 'tint'), stop(1, 'ink')]]),
  }
  const P = (d, a, cls = 'wm-k') => { if (d) out.push(['path', { d, ...a, class: cls }]) }
  return {
    out, defs, col, G,
    // a solid form: base colour + the volume overlay
    form: (d, role, cls = 'wm-k', shade = 'vol') => { P(d, { fill: col(role) }, cls); if (shade) P(d, { fill: G[shade]() }, cls) },
    fill: (d, role, op = 1, cls = 'wm-k') => P(d, op === 1 ? { fill: col(role) } : { fill: col(role), 'fill-opacity': n(op) }, cls),
    line: (d, role, w, op = 1, cls = 'wm-k') => P(d, { fill: 'none', stroke: col(role), 'stroke-width': n(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(op === 1 ? {} : { 'stroke-opacity': n(op) }) }, cls),
    finish() {
      const refs = new Set()
      for (const [, a] of out) { const m = /^url\(#(.+)\)$/.exec(String(a.fill || '')); if (m) refs.add(m[1]) }
      return [['defs', {}, defs.filter(g => refs.has(g[1].id))], ...out]
    },
  }
}

function shadow(p, cx = 12, cy = 22.4, rx = 7.4, ry = 0.95) {
  p.fill(E(cx + 0.3, cy, rx, ry), 'shadow', 0.07, 'wm-shadow')
  p.fill(E(cx + 0.3, cy, rx * 0.72, ry * 0.72), 'shadow', 0.1, 'wm-shadow')
}

// eyes: dark iris, a catch-light, optional lashes; brows in the hair colour
function eyes(p, y, dx, { r = 0.62, ry = 0.82, lashes = false, brow = 'c2', browY = null, cx = 12, iris = 'ink' } = {}) {
  for (const s of [-1, 1]) {
    const x = cx + s * dx
    p.form(E(x, y, r, ry), iris, 'wm-k', null)
    p.fill(E(x - r * 0.3, y - ry * 0.36, r * 0.36), 'shine', 0.95, 'wm-shine')
    if (lashes) p.line(`M${n(x + s * r * 0.55)} ${n(y - ry * 0.75)}l${n(s * 0.42)} ${n(-0.3)}`, 'ink', 0.32)
    if (brow) p.line(`M${n(x - 0.85)} ${n((browY ?? y - 1.75) + (s > 0 ? 0.08 : 0.08))}q${n(0.85)} ${n(-0.5)} ${n(1.7)} 0`, brow, 0.5, 0.95)
  }
}
const smile = (p, cx, y, w = 1.5, open = true) => {
  if (open) {
    p.fill(`M${n(cx - w)} ${n(y)}q${n(w)} ${n(w * 1.05)} ${n(2 * w)} 0q${n(-w)} ${n(w * 0.38)} ${n(-2 * w)} 0z`, 'ink', 0.85)
    p.fill(`M${n(cx - w * 0.55)} ${n(y + w * 0.36)}q${n(w * 0.55)} ${n(w * 0.32)} ${n(w * 1.1)} 0q${n(-w * 0.55)} ${n(-w * 0.12)} ${n(-w * 1.1)} 0z`, 'accent', 0.7)
  } else p.line(`M${n(cx - w)} ${n(y)}q${n(w)} ${n(w * 0.75)} ${n(2 * w)} 0`, 'ink', 0.5, 0.85)
}
const blush = (p, cx, y, dx, r = 0.95) => { for (const s of [-1, 1]) p.fill(E(cx + s * dx, y, r * 1.15, r * 0.7), 'accent', 0.22) }
const nose = (p, cx, y) => {
  p.line(`M${n(cx - 0.5)} ${n(y + 0.3)}q${n(0.5)} ${n(0.42)} ${n(1)} 0`, 'shadow', 0.42, 0.28)
  p.fill(E(cx - 0.15, y - 0.45, 0.32, 0.4), 'shine', 0.35, 'wm-shine')
}

// ---------------------------------------------------------------------------
// PEOPLE
function bust(icon, R) {
  // who owns c2: headwear (turban / cap fabric), the clothing (wear: 'c2'), or the hair (everyone else)
  const wear = R.wear || 'c4'
  const headwear = !!(R.turban || R.cap)
  const c2Hex = headwear ? CLOTH[R.detail] : wear === 'c2' ? CLOTH[R.cloth] : HAIR[R.hair]
  const pal = {
    ...BASE, ink: '#2A2226', c1: SKINS[R.skin], c2: c2Hex, c3: shadeOf(c2Hex), c4: wear === 'c4' ? CLOTH[R.cloth] : CLOTH.white,
    accent: '#F06A6A', edge: '#FFF8EE', tint: '#BFE4F5', shadow: '#2A1E1C',
  }
  R = { ...R, wear, hairC: headwear || wear === 'c2' ? 'ink' : 'c2', hairShade: headwear || wear === 'c2' ? 'ink' : 'c3' }
  const p = painter(icon, pal)
  const baby = !!R.baby
  const hx = 12, hy = baby ? 10.6 : 10.1, rx = baby ? 5.7 : 4.95, ry = baby ? 5.5 : 5.45
  shadow(p, 12, 22.5, 7.6, 0.9)

  // headwear / hair behind everything
  const back = { long: 1, bob: 1, curly: 1, afro: 1, braids: 1, pigtails: 1 }[R.hairStyle]
  if (R.hijab) {
    // the drape over the shoulders, the fabric hood behind the head
    p.form('M5.3 10.2C5.3 5.2 8.2 2.9 12 2.9s6.7 2.3 6.7 7.3c0 2.6-.4 4.5-1 5.9 1.9.8 3.4 2.6 3.6 6.4H3.3c.2-3.8 1.7-5.6 3.6-6.4-.6-1.4-1.6-3.3-1.6-5.9z', 'c2', 'wm-k')
    p.line('M7.6 17.8c1.2 1.6 2.7 2.6 4.4 2.9M16.4 17.6c-.9 1.8-2.2 3.1-3.6 3.9M5.8 19.4c.6 1.1 1.4 2.1 2.4 2.9', 'shadow', 0.5, 0.18)
  }
  if (R.turban && false) { /* turban drawn on top */ }
  if (back) backHair(p, R, hx, hy, rx, ry)

  // clothing
  if (!R.hijab) torso(p, R, baby)

  // neck
  if (!R.hijab) {
    p.form(`M${hx - 1.75} ${hy + ry - 2.2}h3.5v${baby ? 2.4 : 3.3}c0 .9-.8 1.5-1.75 1.5s-1.75-.6-1.75-1.5z`, 'c1', 'wm-k', null)
    p.fill(`M${hx - 1.75} ${hy + ry - 1.4}h3.5v1.7c-1.1.6-2.4.6-3.5 0z`, 'shadow', 0.22)
    collar(p, R, baby)
  }
  // ears
  if (!R.hijab && !R.turban || R.turban) {
    for (const s of [-1, 1]) {
      if (R.hijab) continue
      p.form(E(hx + s * (rx - 0.05), hy + 0.9, 0.95, 1.3), 'c1', 'wm-k', 'soft')
      p.fill(E(hx + s * (rx - 0.05), hy + 1, 0.42, 0.7), 'shadow', 0.16)
    }
  }
  // head
  p.form(egg(hx, hy, rx, ry, baby ? 0.1 : 0.17), 'c1', 'wm-k')
  // under-chin shade on the neck and the cheek light
  p.fill(E(hx - 1.9, hy + 1.2, 1.6, 1.3), 'shine', 0.12, 'wm-shine')
  if (R.hijab) hijabFrame(p, hx, hy, rx, ry)

  // face
  const ey = hy + (baby ? 0.9 : 0.55), edx = baby ? 2.05 : 1.95
  blush(p, hx, ey + 1.75, 2.75, 0.9)
  if (R.beard) beard(p, hx, hy, rx, ry, R)
  if (R.stubble) p.fill(`M${hx - 4.4} ${hy + 1.6}c.4 2.9 2.2 5.1 4.4 5.1s4-2.2 4.4-5.1c-.9 1.4-2.3 2.1-4.4 2.1s-3.5-.7-4.4-2.1z`, R.hairC, 0.2)
  eyes(p, ey, edx, { r: baby ? 0.7 : 0.6, ry: baby ? 0.85 : 0.78, lashes: R.lashes, brow: R.hairC, browY: ey - 1.7 })
  nose(p, hx + 0.1, ey + 1.6)
  if (R.moustache) p.form(`M${hx - 1.9} ${ey + 2.85}c.5-.6 1.3-.8 1.9-.4.6-.4 1.4-.2 1.9.4-.6.5-1.3.6-1.9.2-.6.4-1.3.3-1.9-.2z`, R.hairC, 'wm-a', 'soft')
  smile(p, hx, ey + (baby ? 2.75 : 3.0), baby ? 1.1 : 1.3, !R.moustache)

  // front hair / headwear
  frontHair(p, R, hx, hy, rx, ry)
  if (R.turban) turban(p, hx, hy)
  if (R.cap) cap(p, hx, hy)
  if (R.glasses) glasses(p, R.glasses, hx, ey, edx)
  if (R.headphones) headphones(p, hx, hy, rx)
  return p.finish()
}

function torso(p, R, baby) {
  const top = baby ? 17.4 : 16.7
  const d = baby
    ? `M5.4 22.6c0-3.1 2.4-5 4.8-5.3h3.6c2.4.3 4.8 2.2 4.8 5.3z`
    : `M3.9 22.6c0-3.9 2.6-5.9 5.6-6.1l2.5.4 2.5-.4c3 .2 5.6 2.2 5.6 6.1z`
  p.form(d, R.wear, 'wm-k')
  // soft folds and the underside of the arms
  p.line(baby ? 'M8 20.6c.4.9.9 1.5 1.4 2' : 'M7.1 19.4c.4 1.2 1 2.3 1.7 3.1M16.9 19.4c-.4 1.2-1 2.3-1.7 3.1', 'shadow', 0.55, 0.16)
  if (R.top === 'hoodie') {
    p.form(`M8.2 ${top + 0.1}c.6 1.8 2.1 2.6 3.8 2.6s3.2-.8 3.8-2.6c-1.2-.5-2.4-.7-3.8-.7s-2.6.2-3.8.7z`, R.wear, 'wm-k', 'down')
    p.line(`M10.8 ${top + 2.6}v1.9M13.2 ${top + 2.6}v1.9`, 'edge', 0.36, 0.9)
  }
  if (R.top === 'cardigan') {
    p.fill(`M12 ${top + 0.6}l-1.6 5.9h3.2z`, 'edge', 0.95)
    p.line(`M10.6 ${top + 0.5}l1.4 5.7 1.4-5.7`, 'shadow', 0.4, 0.25)
    p.fill(E(12.7, top + 3.9, 0.22), 'edge', 0.9); p.fill(E(12.95, top + 5, 0.22), 'edge', 0.9)
  }
  if (R.top === 'kurta') {
    p.fill(`M11.2 ${top + 0.4}h1.6v4.6h-1.6z`, 'c2', 0.95)
    p.fill(E(12, top + 2.2, 0.2), 'edge', 0.9); p.fill(E(12, top + 3.6, 0.2), 'edge', 0.9)
  }
  if (R.top === 'onesie') p.fill(E(12, top + 2.6, 1.9, 1.3), 'edge', 0.9)
}
function collar(p, R, baby) {
  const top = baby ? 17.3 : 16.6
  if (R.top === 'tee' || R.top === 'onesie') p.line(`M10.1 ${top + 0.1}c.5.9 1.1 1.3 1.9 1.3s1.4-.4 1.9-1.3`, R.wear, 0.75, 1, 'wm-k')
  if (R.top === 'shirt' || R.top === 'collar') {
    const role = R.top === 'shirt' ? 'edge' : 'edge'
    p.form(`M10.1 ${top - 0.1}l1.9 1.8-1.3 1.6-1.9-2.4z`, role, 'wm-k', 'soft')
    p.form(`M13.9 ${top - 0.1}l-1.9 1.8 1.3 1.6 1.9-2.4z`, role, 'wm-k', 'soft')
  }
}
function backHair(p, R, hx, hy, rx, ry) {
  const style = R.hairStyle, H = R.hairShade   // the mass behind the head sits in the hair's shade
  if (style === 'long') {
    p.form('M6.4 9.2C6.2 4.7 8.8 3.4 12 3.4s5.8 1.3 5.6 5.8c-.1 3.4 1.2 6.9 1.1 9.5-1.6.8-3 .4-3.6-.9H9c-.6 1.3-2 1.7-3.6.9-.1-2.6 1.1-6.1 1-9.5z', H, 'wm-a')
  } else if (style === 'bob') {
    p.form('M6.3 9.3C6.2 4.8 8.8 3.5 12 3.5s5.8 1.3 5.7 5.8l.2 5.6c-1 .6-2.1.5-2.6-.1H8.7c-.5.6-1.6.7-2.6.1z', H, 'wm-a')
  } else if (style === 'curly') {
    p.form(bumpy(12, 9.8, 7.3, 7.6, 15, 0.07, 0.2), H, 'wm-a')
  } else if (style === 'afro') {
    p.form(bumpy(12, 8.2, 8.2, 7.1, 17, 0.06, 0.1), H, 'wm-a')
  } else if (style === 'braids') {
    p.form('M6.6 9.3C6.4 4.9 8.9 3.6 12 3.6s5.6 1.3 5.4 5.7c0 2.4.3 4.6.6 6.6H6c.3-2 .6-4.2.6-6.6z', H, 'wm-a')
  } else if (style === 'pigtails') {
    for (const s of [-1, 1]) {
      p.form(E(12 + s * 6.4, 9.6, 1.9, 2.5), H, 'wm-a')
      p.form(E(12 + s * 5.2, 7.4, 0.75, 0.75), 'accent', 'wm-a', 'soft')
    }
  }
}
function frontHair(p, R, hx, hy, rx, ry) {
  const s = R.hairStyle, C = R.hairC
  const band = d => p.line(d, 'shine', 0.6, 0.32, 'wm-shine')
  if (s === 'short') {
    p.form('M7.05 10.6C6.5 6.3 8.8 4 12.2 4s5.5 2.2 4.8 6.4c-.4-1.5-1-2.5-1.9-3-2 .9-4.6.9-6.6 0-.8.8-1.3 1.9-1.45 3.2z', C, 'wm-a')
    band('M8.8 5.6c1.4-.9 3.2-1.1 4.8-.6')
  } else if (s === 'crop') {
    p.form('M7.1 9.8C6.8 6 9 4.1 12 4.1s5.2 1.9 4.9 5.7c-.6-1.1-1.4-1.8-2.4-2.1-1.6.6-3.4.6-5 0-1 .3-1.8 1-2.4 2.1z', C, 'wm-a')
    band('M9 5.7c1.3-.7 2.9-.8 4.3-.3')
  } else if (s === 'spiky') {
    p.form('M7 10.4C6.4 6.6 7.6 4.5 9 3.8l.6 1 1-1.5.9 1.2 1.2-1.4.7 1.4 1.3-.9.3 1.4c1.6.9 2.6 3.1 2 6.1-.5-1.4-1.2-2.4-2.1-2.9-2.1.8-4.4.8-6.6 0-.8.8-1.3 1.9-1.3 3.2z', C, 'wm-a')
    band('M9.2 5.9c1.2-.6 2.6-.7 3.9-.3')
  } else if (s === 'swept') {
    p.form('M7 10.6C6.3 6.1 8.8 3.8 12.3 3.8c3.3 0 5.3 2.3 4.7 6.3-1.6-2.1-4.5-2.7-6.4-2.5-1.6.2-2.8 1.3-3.6 3z', C, 'wm-a')
    band('M9 5.7c1.6-1 3.5-1.1 5.1-.4')
  } else if (s === 'long' || s === 'bob') {
    p.form(s === 'bob' ? 'M7.05 9.8C6.9 6 9.1 4.2 12 4.2s5.1 1.8 4.95 5.6c-1.5-1.3-3.1-1.6-4.95-1.6s-3.45.3-4.95 1.6z'
      : 'M7 10.4C6.8 6 9 4.1 12.1 4.1s5.3 2.1 4.9 6.3c-.8-2.2-2.4-3.5-4.4-3.8-1 1.3-3 2.3-5.6 3.8z', C, 'wm-a')
    band('M8.8 5.9c1.3-.9 3-1.1 4.6-.6')
  } else if (s === 'curly') {
    p.form(bumpy(12, 8.6, 5.3, 4.4, 9, 0.12, 0.35, Math.PI * 1.02, Math.PI * 1.98, [[16.9, 9.6], [15.6, 7.9], [12, 7.4], [8.4, 7.9], [7.1, 9.6]]), C, 'wm-a')
    band('M8.9 5.6c1.4-.8 3.1-.9 4.6-.4')
  } else if (s === 'afro') {
    p.form(bumpy(12, 8.4, 5.3, 4.2, 9, 0.13, 0.3, Math.PI * 1.02, Math.PI * 1.98, [[16.9, 9.1], [14.8, 7.3], [12, 7], [9.2, 7.3], [7.1, 9.1]]), C, 'wm-a')
    band('M7.4 3.9c2-1.6 5.4-2 8-.8')
  } else if (s === 'braids') {
    p.form('M7.05 10.4C6.7 6.1 9 4.1 12 4.1s5.3 2 4.95 6.3c-.5-1.8-1.8-3-3.5-3.4L12 7.6l-1.45-.6c-1.7.4-3 1.6-3.5 3.4z', C, 'wm-a')
    p.line('M12 4.4v3', R.hairShade, 0.35, 0.6)
    for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) {
      const x = 12 + sx * (5.55 - i * 0.12), y = 11.4 + i * 1.75
      p.form(E(x, y, 0.95, 1.0), C, 'wm-a', 'soft')
    }
    band('M8.9 5.7c1-.7 2-.9 2.9-.8')
  } else if (s === 'pigtails') {
    p.form('M7 10.2C6.8 6 9 4.1 12 4.1s5.2 1.9 5 6.1c-.6-1.6-1.6-2.6-2.9-3L12 7.8l-2.1-.6c-1.3.4-2.3 1.4-2.9 3z', C, 'wm-a')
    band('M8.9 5.7c1-.7 2-.9 2.9-.8')
  } else if (s === 'bun') {
    p.form(E(12, 3.6, 2.1, 1.8), C, 'wm-a')
    p.form('M7.05 10C6.8 6 9.1 4.4 12 4.4s5.2 1.6 4.95 5.6c-.6-1.4-1.8-2.4-3.4-2.8L12 6.6l-1.55.6c-1.6.4-2.8 1.4-3.4 2.8z', C, 'wm-a')
    band('M9 6c1-.6 2-.8 2.9-.7')
  } else if (s === 'tuft') {
    p.form('M11 5.4c-.2-1.3.6-2.2 1.6-2.1 1 .1 1.2 1 .6 1.5.9-.2 1.4.6.9 1.2-.9.9-2.9.9-3.1-.6z', C, 'wm-a', 'soft')
  } else if (s === 'receding') {
    for (const sx of [-1, 1]) p.form(`M${n(12 + sx * 4.95)} 10.6c${n(sx * 0.2)}-2.6 ${n(-sx * 0.1)}-4 ${n(-sx * 1.3)}-4.8 ${n(-sx * 0.1)} 1.4 ${n(-sx * 0.3)} 2.6 ${n(-sx * 0.3)} 4.4z`, C, 'wm-a', 'soft')
    p.form('M10 4.75c1.3-.4 2.7-.4 4 0-.7.5-3.3.5-4 0z', C, 'wm-a', 'soft')
  } else if (s === 'bald') {
    for (const sx of [-1, 1]) p.form(`M${n(12 + sx * 4.95)} 10.4c${n(sx * 0.15)}-1.3 ${n(-sx * 0.05)}-2.2 ${n(-sx * 0.55)}-3 ${n(-sx * 0.25)} 1 ${n(-sx * 0.3)} 2 ${n(-sx * 0.3)} 3.3z`, C, 'wm-a', 'soft')
    p.fill(E(10.3, 5.6, 1.6, 0.9), 'shine', 0.3, 'wm-shine')
  }
}
function beard(p, hx, hy, rx, ry, R) {
  p.form(`M${n(hx - rx + 0.15)} ${n(hy + 0.6)}c.1 3.6 2.2 6.6 4.85 6.6s4.75-3 4.85-6.6c-.6 1.3-1.4 2-2.3 2.3-1-.6-1.6-.8-2.55-.8s-1.55.2-2.55.8c-.9-.3-1.7-1-2.3-2.3z`, R.hairC, 'wm-a')
  p.form(`M${hx - 2} ${hy + 3.05}c.6-.65 1.4-.85 2-.45.6-.4 1.4-.2 2 .45-.65.45-1.35.55-2 .2-.65.35-1.35.25-2-.2z`, R.hairC, 'wm-a', 'soft')
  p.line(`M${hx - 1.6} ${hy + 5.6}q1.6 .7 3.2 0`, 'shine', 0.4, 0.22, 'wm-shine')
}
function hijabFrame(p, hx, hy, rx, ry) {
  // the fabric around the face: an outer hood with the face opening as its hole (even-odd), wrapped under the chin
  const outer = 'M5.9 10.1C5.9 5.6 8.5 3.4 12 3.4s6.1 2.2 6.1 6.7c0 3.6-1.3 6.6-2.9 8.1-1 .9-2 1.3-3.2 1.3s-2.2-.4-3.2-1.3c-1.6-1.5-2.9-4.5-2.9-8.1z'
  const face = egg(12, 10.5, 4.25, 4.85, 0.2)
  p.out.push(['path', { d: outer + face, fill: p.col('c2'), 'fill-rule': 'evenodd', class: 'wm-k' }])
  p.out.push(['path', { d: outer + face, fill: p.G.vol(), 'fill-rule': 'evenodd', class: 'wm-k' }])
  // the shaded inner edge of the fabric and two soft folds
  p.line('M7.9 8.6c.8-2.4 2.3-3.3 4.1-3.3s3.3.9 4.1 3.3', 'shadow', 0.55, 0.2)
  p.line('M9.6 18.4c.9.6 1.6.8 2.4.8M6.8 12.6c.3 1.8 1 3.4 2 4.6', 'shadow', 0.45, 0.2)
  p.line('M7.4 6.4c1.2-1.6 2.8-2.3 4.4-2.3', 'shine', 0.6, 0.35, 'wm-shine')
}
function turban(p, hx, hy) {
  p.form('M6.5 9.8C6 5.3 8.5 2.5 12 2.5s6 2.8 5.5 7.3c-1.6-1.3-3.6-1.9-5.5-1.1-1.9-.8-3.9-.2-5.5 1.1z', 'c2', 'wm-a')
  // wraps: overlapping bands rising to the front peak
  p.line('M7 7.4c1.6-.9 3.4-.9 5 .9M17 7.4c-1.6-.9-3.4-.9-5 .9M7.6 5.2c1.8-.6 3.3-.1 4.4 1.3M16.4 5.2c-1.8-.6-3.3-.1-4.4 1.3', 'c3', 0.45, 0.9)
  p.line('M8.4 4.2c1.3-.9 2.6-1.2 3.6-1.1', 'shine', 0.55, 0.4, 'wm-shine')
}
function cap(p, hx, hy) {
  p.form('M6.9 8.9C6.7 5.2 9 3.4 12 3.4s5.3 1.8 5.1 5.5z', 'c2', 'wm-a')
  p.form('M6.7 8.7c3-.7 8.4-.8 12.4.4.9.3.7 1.3-.3 1.2-3.6-.5-8.6-.6-12 .1-.6-.4-.6-1.4-.1-1.7z', 'c3', 'wm-a', 'soft')
  p.fill('M6.8 9.6c3.4-.6 8.2-.5 11.9.1l-.1.7c-3.6-.5-8.4-.6-11.8 0z', 'shadow', 0.25, 'wm-a')
  p.form(E(12, 3.5, 0.55, 0.4), 'c3', 'wm-a', 'soft')
  p.line('M12 3.7v5', 'shadow', 0.3, 0.22, 'wm-a')
  p.line('M8.4 5.3c1-1 2.2-1.4 3.4-1.4', 'shine', 0.55, 0.4, 'wm-shine')
}
function glasses(p, kind, hx, ey, edx) {
  for (const s of [-1, 1]) {
    const x = hx + s * edx
    const d = kind === 'round' ? E(x, ey, 1.45, 1.35) : `M${n(x - 1.55)} ${n(ey - 1.05)}h3.1a.7.7 0 0 1 .7.7v.95c0 .8-.6 1.35-1.4 1.35h-1.7c-.8 0-1.4-.55-1.4-1.35v-.95a.7.7 0 0 1 .7-.7z`
    p.fill(d, 'tint', 0.3, 'wm-a')
    p.line(d, 'ink', 0.42, 1, 'wm-a')
    p.line(`M${n(x - 0.8)} ${n(ey - 0.5)}l.6-.5`, 'shine', 0.3, 0.8, 'wm-shine')
  }
  p.line(`M${n(hx - edx + 1.45)} ${n(ey - 0.3)}q${n(edx - 1.45)} -.45 ${n(2 * (edx - 1.45))} 0`, 'ink', 0.4, 1, 'wm-a')
}
function headphones(p, hx, hy, rx) {
  p.line(`M${n(hx - rx - 0.3)} ${n(hy - 0.4)}C${n(hx - rx - 0.5)} 3.2 ${n(hx - 3)} 2.3 ${hx} 2.3S${n(hx + rx + 0.5)} 3.2 ${n(hx + rx + 0.3)} ${n(hy - 0.4)}`, 'accent', 1.1, 1, 'wm-a')
  for (const s of [-1, 1]) {
    const x = hx + s * (rx + 0.25)
    p.form(`M${n(x - 1.1)} ${n(hy - 0.9)}h2.2a.9.9 0 0 1 .9.9v2.6a.9.9 0 0 1-.9.9h-2.2a.9.9 0 0 1-.9-.9v-2.6a.9.9 0 0 1 .9-.9z`, 'accent', 'wm-a')
    p.fill(E(x - s * 0.5, hy + 0.85, 0.35, 1.2), 'shadow', 0.3)   // the cushion's shaded inner edge
  }
}

// ---------------------------------------------------------------------------
// ANIMALS + MONSTERS
const FUR = { orange: '#F08A35', amber: '#F2AE3E', brown: '#9A6440', cream: '#F7EEDF', white: '#F4F4F6', grey: '#A3ABB8', black: '#33353D',
  pink: '#F6B9C9', green: '#6CC26A', lime: '#9BD45B', purple: '#9A6BE0', teal: '#2FB3A3', red: '#E2574C', silver: '#C3CAD4', tan: '#E3B98A',
  gold: '#F2C14E', beak: '#F49A2E', sky: '#9FD6F2', lilac: '#C7A8F2', rose: '#F27BA5', dark: '#5B3A26' }
const CHARACTERS = {
  'avatar-cat': { c1: 'amber', c2: 'pink', c3: 'cream', draw: cat },
  'avatar-dog': { c1: 'tan', c2: 'brown', c3: 'cream', draw: dog },
  'avatar-fox': { c1: 'orange', c2: 'black', c3: 'white', draw: fox },
  'avatar-panda': { c1: 'white', c2: 'black', c3: 'white', draw: panda },
  'avatar-bear': { c1: 'brown', c2: 'tan', c3: 'tan', draw: bear },
  'avatar-bunny': { c1: 'white', c2: 'pink', c3: 'cream', draw: bunny },
  'avatar-owl': { c1: 'brown', c2: 'cream', c3: 'tan', c4: 'beak', draw: owl },
  'avatar-penguin': { c1: 'black', c2: 'white', c3: 'white', c4: 'beak', draw: penguin },
  'avatar-frog': { c1: 'green', c2: 'lime', c3: 'white', draw: frog },
  'avatar-koala': { c1: 'grey', c2: 'pink', c3: 'white', draw: koala },
  'avatar-tiger': { c1: 'orange', c2: 'black', c3: 'white', draw: tiger },
  'avatar-unicorn': { c1: 'white', c2: 'lilac', c3: 'rose', c4: 'gold', draw: unicorn },
  'avatar-monster': { c1: 'purple', c2: 'lilac', c3: 'white', draw: monster },
  'avatar-monster-horns': { c1: 'red', c2: 'cream', c3: 'white', draw: monsterHorns },
  'avatar-monster-fluffy': { c1: 'teal', c2: 'sky', c3: 'white', draw: fluffy },
  'avatar-alien': { c1: 'lime', c2: 'green', c3: 'white', draw: alien },
  'avatar-robot': { c1: 'silver', c2: 'sky', c3: 'red', c4: 'grey', draw: robot },
  'avatar-ghost': { c1: 'white', c2: 'sky', c3: 'white', draw: ghost },
  'avatar-dino': { c1: 'green', c2: 'orange', c3: 'lime', draw: dino },
}
function character(icon, C) {
  const pal = { ...BASE, ink: '#262A33', c1: FUR[C.c1], c2: FUR[C.c2], c3: FUR[C.c3], c4: FUR[C.c4 || 'beak'], accent: '#F36F7F', edge: '#FFFFFF', tint: '#8FE3FF', shadow: '#22202A' }
  const p = painter(icon, pal)
  shadow(p, 12, 22.3, 7.2, 0.95)
  C.draw(p)
  return p.finish()
}
// shared bits
const head = (p, d = E(12, 13.2, 7.4, 6.6)) => p.form(d, 'c1', 'wm-k')
const animalFace = (p, { y = 12.6, dx = 2.9, r = 0.85, nose: nz = true, ny = 15, muzzle = 'c3', mw = 3.2, mh = 2.3, my = 15.9, mouth = true, blushY = 15.2 } = {}) => {
  if (muzzle) p.form(E(12, my, mw, mh), muzzle, 'wm-k', 'soft')
  blush(p, 12, blushY, dx + 1.6, 0.85)
  eyes(p, y, dx, { r, ry: r * 1.15, brow: null })
  if (nz) { p.form(`M${n(12 - 0.95)} ${n(ny - 0.35)}c0-.45.45-.6.95-.6s.95.15.95.6c0 .55-.55 1-.95 1.15-.4-.15-.95-.6-.95-1.15z`, 'ink', 'wm-k', 'soft'); p.fill(E(11.75, ny - 0.6, 0.28, 0.16), 'shine', 0.6, 'wm-shine') }
  if (mouth) p.line(`M${n(12 - 1)} ${n(ny + 1.05)}q.5 .55 1 0q.5 .55 1 0`, 'ink', 0.38, 0.85)
}
function cat(p) {
  for (const s of [-1, 1]) {
    p.form(`M${n(12 + s * 6.9)} 10.2L${n(12 + s * 6.3)} 3.6c${n(-s * 0.1)}-.8 ${n(-s * 0.6)}-1 ${n(-s * 1.2)}-.6L${n(12 + s * 2.6)} 7z`, 'c1', 'wm-k')
    p.fill(`M${n(12 + s * 5.9)} 8.4L${n(12 + s * 5.6)} 5c-.05-.4 ${n(-s * 0.35)}-.5 ${n(-s * 0.6)}-.3L${n(12 + s * 3.6)} 7.2z`, 'c2', 0.9)
  }
  head(p)
  p.line('M10.6 7.4l.4 1.6M12 7.1v1.8M13.4 7.4l-.4 1.6', 'shadow', 0.55, 0.22)
  animalFace(p, { mw: 2.7, mh: 1.9, my: 15.5, ny: 14.8 })
  p.line('M8.2 15.3l-3 .5M8.3 16.4l-2.9 1M15.8 15.3l3 .5M15.7 16.4l2.9 1', 'ink', 0.28, 0.5)
}
function dog(p) {
  head(p, E(12, 12.8, 6.6, 6.5))
  for (const s of [-1, 1]) p.form(`M${n(12 + s * 5.2)} 7.2c${n(s * 2.4)}-.6 ${n(s * 3.9)} .6 ${n(s * 3.5)} 4.2-.3 2.4 ${n(-s * 1.2)} 4.4 ${n(-s * 2.6)} 4.6 ${n(-s * 1.3)}.2 ${n(-s * 1.7)}-1.9 ${n(-s * 1.5)}-4.3z`, 'c2', 'wm-a')
  p.fill(E(14.6, 10.2, 1.6, 1.4), 'c2', 0.5)
  animalFace(p, { mw: 3.4, mh: 2.6, my: 16, ny: 14.9 })
  p.form('M11.3 17.1h1.4v1.2c0 .5-.3.8-.7.8s-.7-.3-.7-.8z', 'accent', 'wm-k', 'soft')
}
function fox(p) {
  for (const s of [-1, 1]) {
    p.form(`M${n(12 + s * 7.2)} 10.8L${n(12 + s * 7.6)} 2.9c0-.6 ${n(-s * 0.5)}-.8 ${n(-s * 0.9)}-.4L${n(12 + s * 2.3)} 7.4z`, 'c1', 'wm-k')
    p.fill(`M${n(12 + s * 6.7)} 7.2L${n(12 + s * 6.9)} 4.1c0-.3 ${n(-s * 0.3)}-.4 ${n(-s * 0.5)}-.2L${n(12 + s * 4.1)} 6.8z`, 'c2', 0.85)
  }
  p.form('M4.4 11.4C4.6 7.6 8 5.6 12 5.6s7.4 2 7.6 5.8c.1 3.4-3.4 8.6-7.6 8.6s-7.7-5.2-7.6-8.6z', 'c1', 'wm-k')
  p.form('M4.6 12.4c2.2.2 4.6 1.4 7.4 1.4s5.2-1.2 7.4-1.4c-.6 3.4-3.6 7.6-7.4 7.6s-6.8-4.2-7.4-7.6z', 'c3', 'wm-k', 'soft')
  animalFace(p, { muzzle: null, y: 11.6, ny: 15.6, blushY: 14.6 })
}
function panda(p) {
  for (const s of [-1, 1]) p.form(E(12 + s * 5.6, 6.9, 2.3, 2.2), 'c2', 'wm-k')
  head(p)
  for (const s of [-1, 1]) p.form(`M${n(12 + s * 2)} 11.4c${n(s * 1.6)}-1.4 ${n(s * 3.4)}-.8 ${n(s * 3.2)} 1.2-.2 1.6 ${n(-s * 1.8)} 2.4 ${n(-s * 3)} 1.2 ${n(-s * 0.7)}-.7 ${n(-s * 0.6)}-1.7 ${n(-s * 0.2)}-2.4z`, 'c2', 'wm-k', 'soft')
  animalFace(p, { muzzle: null, y: 12.4, dx: 3.1, r: 0.7, ny: 15.4 })
}
function bear(p) {
  for (const s of [-1, 1]) { p.form(E(12 + s * 5.5, 7.1, 2.3, 2.2), 'c1', 'wm-k'); p.fill(E(12 + s * 5.5, 7.3, 1.2, 1.1), 'c2', 0.85) }
  head(p)
  animalFace(p, { mw: 3.2, mh: 2.4, my: 15.8, ny: 14.9 })
}
function bunny(p) {
  for (const s of [-1, 1]) {
    p.form(`M${n(12 + s * 3.2)} 8.6c${n(s * -0.6)}-3.4 ${n(s * -0.3)}-6.6 ${n(s * 1.2)}-6.8s${n(s * 2.1)} 3.4 ${n(s * 1.6)} 6.9z`, 'c1', 'wm-k')
    p.fill(`M${n(12 + s * 3.75)} 7.9c${n(s * -0.3)}-2.4 ${n(-s * 0.1)}-4.6 ${n(s * 0.65)}-4.8s${n(s * 1.1)} 2.4 ${n(s * 0.8)} 4.9z`, 'c2', 0.95)
  }
  head(p, E(12, 13.6, 7, 6.3))
  animalFace(p, { mw: 2.6, mh: 1.9, my: 16.1, ny: 15.2, y: 13 })
  p.form('M11.3 17.2h1.4v1c0 .3-.2.5-.4.5h-.6c-.2 0-.4-.2-.4-.5z', 'edge', 'wm-k', null)
}
function owl(p) {
  for (const s of [-1, 1]) p.form(`M${n(12 + s * 6.4)} 8.6L${n(12 + s * 7)} 3.6L${n(12 + s * 3.2)} 6.6z`, 'c1', 'wm-k')
  head(p, 'M4.6 12.6C4.6 7.6 8 5.4 12 5.4s7.4 2.2 7.4 7.2c0 4.6-3 8.4-7.4 8.4s-7.4-3.8-7.4-8.4z')
  p.form('M8.4 17.2c.9-1.4 2.2-2 3.6-2s2.7.6 3.6 2c-.6 2-2 3.4-3.6 3.4s-3-1.4-3.6-3.4z', 'c3', 'wm-k', 'soft')
  for (const s of [-1, 1]) { p.form(E(12 + s * 2.9, 11.6, 2.7, 2.7), 'c2', 'wm-k', 'soft') }
  eyes(p, 11.7, 2.9, { r: 1.25, ry: 1.3, brow: null })
  p.form('M11 13.6h2l-1 2.1z', 'c4', 'wm-k', 'soft')
  p.line('M10.4 18.3l.5.5.5-.5M12.6 18.3l.5.5.5-.5', 'shadow', 0.35, 0.3)
}
function penguin(p) {
  head(p, E(12, 12.6, 7, 7.2))
  p.form('M12 10.2c.9-1.7 2.3-2.4 3.5-1.9 1.8.8 2.2 3 2 5.1-.4 3.2-2.5 5.4-5.5 5.4s-5.1-2.2-5.5-5.4c-.2-2.1.2-4.3 2-5.1 1.2-.5 2.6.2 3.5 1.9z', 'c2', 'wm-k', 'soft')
  eyes(p, 12.6, 2.3, { r: 0.72, ry: 0.88, brow: null })
  blush(p, 12, 15.2, 3.7, 0.8)
  p.form('M10.4 14.5c1-.6 2.2-.6 3.2 0-.3 1-1 1.6-1.6 1.6s-1.3-.6-1.6-1.6z', 'c4', 'wm-k', 'soft')
}
function frog(p) {
  for (const s of [-1, 1]) p.form(E(12 + s * 3.9, 7.4, 2.6, 2.5), 'c1', 'wm-k')
  head(p, 'M3.8 13.8c0-3.8 3.6-5.6 8.2-5.6s8.2 1.8 8.2 5.6-3.6 6.6-8.2 6.6-8.2-2.8-8.2-6.6z')
  for (const s of [-1, 1]) { p.form(E(12 + s * 3.9, 7.4, 1.6, 1.6), 'c3', 'wm-k', 'soft') }
  eyes(p, 7.5, 3.9, { r: 0.85, ry: 1, brow: null })
  blush(p, 12, 15.2, 5, 0.9)
  p.line('M8.2 15.2c1.2 1.4 2.4 2 3.8 2s2.6-.6 3.8-2', 'ink', 0.5, 0.85)
  p.fill(E(10.9, 12.6, 0.25), 'shadow', 0.4); p.fill(E(13.1, 12.6, 0.25), 'shadow', 0.4)
}
function koala(p) {
  for (const s of [-1, 1]) { p.form(E(12 + s * 6.4, 8.6, 3.1, 2.9), 'c1', 'wm-k'); p.fill(E(12 + s * 6.3, 8.9, 1.8, 1.6), 'c3', 0.85) }
  head(p, E(12, 13.4, 6.6, 6.2))
  eyes(p, 12.4, 2.8, { r: 0.7, ry: 0.85, brow: null })
  blush(p, 12, 15.3, 4.3, 0.85)
  p.form('M10.6 13.4c0-.9.6-1.4 1.4-1.4s1.4.5 1.4 1.4v1.6c0 1-.6 1.6-1.4 1.6s-1.4-.6-1.4-1.6z', 'ink', 'wm-k', 'soft')
  p.fill(E(11.6, 13.2, 0.3, 0.5), 'shine', 0.45, 'wm-shine')
  p.line('M11.2 17.6q.8.5 1.6 0', 'ink', 0.35, 0.8)
}
function tiger(p) {
  for (const s of [-1, 1]) { p.form(E(12 + s * 5.5, 7, 2.2, 2.1), 'c1', 'wm-k'); p.fill(E(12 + s * 5.5, 7.2, 1.1, 1), 'c3', 0.85) }
  head(p)
  p.form('M6.2 14.8c1.8-.6 3.8.2 5.8.2s4-.8 5.8-.2c-.4 2.8-2.8 4.6-5.8 4.6s-5.4-1.8-5.8-4.6z', 'c3', 'wm-k', 'soft')
  p.line('M12 6.9v2.2M10.4 7.2l.4 1.4M13.6 7.2l-.4 1.4M5.2 12.2l2 .4M5.4 14l1.8-.1M18.8 12.2l-2 .4M18.6 14l-1.8-.1', 'c2', 0.55, 0.85)
  animalFace(p, { muzzle: null, ny: 15.4 })
}
function unicorn(p) {
  p.form('M5.6 9.6c-.6-3 1-5.6 3.6-6.2 2.8-.6 5.2.6 6 2.6-2.6-.6-5.6.4-7.2 2.6-.8 1-1.6 1.4-2.4 1z', 'c2', 'wm-a')
  for (const s of [-1, 1]) p.form(`M${n(12 + s * 6)} 9.6L${n(12 + s * 5.4)} 4.6L${n(12 + s * 2.8)} 7.2z`, 'c1', 'wm-k')
  head(p)
  p.form('M10.9 7.2L12 1.4l1.1 5.8c-.7.3-1.5.3-2.2 0z', 'c4', 'wm-a', 'soft')
  p.line('M11.2 5.6l1.5-.6M11.5 3.8l1.1-.5', 'shadow', 0.3, 0.3, 'wm-a')
  p.form('M6.4 8.4c.4-2.4 2.4-3.6 4.4-3.2-1 .8-1.4 2-1.2 3.2-.9-.6-2.1-.6-3.2 0z', 'c3', 'wm-a')
  p.form('M16.4 6.4c1.6.6 2.4 2 2.2 3.6-.7-.6-1.7-.9-2.7-.6.6-.8.8-1.9.5-3z', 'c2', 'wm-a')
  animalFace(p, { mw: 3, mh: 2, my: 16, ny: 15, muzzle: 'edge' })
}
function monster(p) {
  p.form('M5.6 20.4V10.6C5.6 6.4 8.4 3.6 12 3.6s6.4 2.8 6.4 7v9.8c-1 .4-1.6-.6-2.4-.6s-1.4 1-2 1-1.2-1-2-1-1.2 1-2 1-1.2-1-2-1-1.4 1-2.4.6z', 'c1', 'wm-k')
  p.form(E(12, 10.2, 3, 3), 'c3', 'wm-k', 'soft')
  p.form(E(12.4, 10.6, 1.6, 1.7), 'ink', 'wm-k', null)
  p.fill(E(11.8, 9.9, 0.55), 'shine', 0.95, 'wm-shine')
  p.fill('M8.6 15.4c2.2 1.2 4.6 1.2 6.8 0-.4 2-1.8 3-3.4 3s-3-1-3.4-3z', 'ink', 0.85)
  p.fill('M10 15.9l.6 1 .6-.9zM12.8 15.9l.6.9.6-1z', 'edge', 1)
  blush(p, 12, 13.8, 4.2, 0.8)
}
function monsterHorns(p) {
  for (const s of [-1, 1]) p.form(`M${n(12 + s * 4.4)} 6.6c${n(s * 0.4)}-1.8 ${n(s * 1.4)}-3.4 ${n(s * 3)}-4.4-.2 1.8 ${n(-s * 0.2)} 3.6 ${n(-s * 1)} 5.6z`, 'c2', 'wm-a')
  head(p, E(12, 12.9, 7.4, 7))
  eyes(p, 11.2, 2.7, { r: 0.85, ry: 1, brow: null })
  p.line('M8.4 9.2l1.8.8M15.6 9.2l-1.8.8', 'ink', 0.5, 0.8)
  p.fill('M7.4 14.4c3 1.4 6.2 1.4 9.2 0-.4 3-2.4 4.6-4.6 4.6s-4.2-1.6-4.6-4.6z', 'ink', 0.85)
  p.fill('M8.6 15.1l.7 1.4.8-1.1zM13.9 15.4l.8 1.1.7-1.4z', 'edge', 1)
  blush(p, 12, 13.4, 4.6, 0.8)
}
function fluffy(p) {
  p.form(bumpy(12, 12.6, 7.6, 7.6, 22, 0.08, 0.05), 'c1', 'wm-k')
  eyes(p, 11.4, 2.6, { r: 0.95, ry: 1.1, brow: null })
  p.fill('M9.4 14.6c1.8 1 3.4 1 5.2 0-.3 1.8-1.4 2.8-2.6 2.8s-2.3-1-2.6-2.8z', 'ink', 0.85)
  p.fill('M11.2 16.8c.5-.4 1.1-.4 1.6 0-.3.3-1.3.3-1.6 0z', 'accent', 0.9)
  blush(p, 12, 13.8, 4.3, 0.8)
  p.line('M7.6 7.2c.6-.9 1.6-1.6 2.6-1.8', 'shine', 0.6, 0.4, 'wm-shine')
}
function alien(p) {
  for (const s of [-1, 1]) { p.line(`M${n(12 + s * 2.6)} 5.6l${n(s * 1.6)}-3`, 'c2', 0.6, 1, 'wm-a'); p.form(E(12 + s * 4.3, 2.5, 1, 1), 'c2', 'wm-a') }
  head(p, 'M4.4 10.8C4.4 6.8 7.8 4.6 12 4.6s7.6 2.2 7.6 6.2c0 4.6-4.2 9.8-7.6 9.8s-7.6-5.2-7.6-9.8z')
  for (const s of [-1, 1]) {
    const c = [12 + s * 3, 11.4]
    const pts = []; for (let i = 0; i < 28; i++) { const t = i / 28 * Math.PI * 2; pts.push(rot([c[0] + 2 * Math.cos(t), c[1] + 1.25 * Math.sin(t)], c, s * 0.42)) }
    p.form(ringD(pts), 'ink', 'wm-k', null)
    p.fill(E(c[0] - s * 0.2 - 0.5, c[1] - 0.45, 0.45, 0.3), 'shine', 0.85, 'wm-shine')
  }
  blush(p, 12, 14.2, 4, 0.75)
  p.line('M10.9 16.4q1.1 .7 2.2 0', 'ink', 0.4, 0.85)
}
function robot(p) {
  p.line('M12 5.4V3', 'c4', 0.6, 1, 'wm-a'); p.form(E(12, 2.6, 1, 1), 'c3', 'wm-a')
  for (const s of [-1, 1]) p.form(`M${n(12 + s * 7.9 - 0.9)} 10.6h1.8v4.2h-1.8z`, 'c4', 'wm-a', 'soft')
  head(p, 'M7.4 5.4h9.2a3 3 0 0 1 3 3v8.4a3 3 0 0 1-3 3H7.4a3 3 0 0 1-3-3V8.4a3 3 0 0 1 3-3z')
  p.fill('M7.8 8h8.4a1.6 1.6 0 0 1 1.6 1.6v5.6a1.6 1.6 0 0 1-1.6 1.6H7.8a1.6 1.6 0 0 1-1.6-1.6V9.6A1.6 1.6 0 0 1 7.8 8z', 'ink', 1)
  p.fill('M7.8 8h8.4a1.6 1.6 0 0 1 1.6 1.6v5.6a1.6 1.6 0 0 1-1.6 1.6H7.8a1.6 1.6 0 0 1-1.6-1.6V9.6A1.6 1.6 0 0 1 7.8 8z', p.G.glass ? 'tint' : 'tint', 0.18)
  for (const s of [-1, 1]) p.fill(E(12 + s * 2.6, 11.4, 1, 1.1), 'c2', 1)
  p.line('M10.2 14.2q1.8 1 3.6 0', 'c2', 0.5, 1)
  p.fill('M7.2 8.4l2.6-.1-2.9 4.1z', 'shine', 0.18, 'wm-shine')
}
function ghost(p) {
  p.form('M5.2 20.6V11.4C5.2 6.8 8.2 3.8 12 3.8s6.8 3 6.8 7.6v9.2c-1 .9-2 .1-2.6-.6-.7.9-1.6 1.4-2.2 0-.6 1.4-1.8 1.4-2.4 0-.6 1.4-1.6.9-2.2 0-.6.7-1.6 1.5-2.6.6z', 'c1', 'wm-k')
  eyes(p, 10.8, 2.3, { r: 0.85, ry: 1.2, brow: null })
  p.fill(E(12, 14.2, 0.9, 1.1), 'ink', 0.85)
  blush(p, 12, 13, 4, 0.8)
}
function dino(p) {
  for (const [x, y, r] of [[7.9, 6.9, 1.2], [10.5, 5.3, 1.35], [13.5, 5.3, 1.35], [16.1, 6.9, 1.2]]) p.form(`M${n(x - r)} ${n(y + 1.2)}L${n(x)} ${n(y - r)}L${n(x + r)} ${n(y + 1.2)}z`, 'c2', 'wm-a', 'soft')
  head(p, 'M4.6 12C4.6 7.6 7.8 5.4 12 5.4s7.4 2.2 7.4 6.6c0 1.6-.3 2.6-.3 3.6 0 3-3 5.2-7.1 5.2s-7.1-2.2-7.1-5.2c0-1-.3-2-.3-3.6z')
  p.form(E(12, 16.2, 4.8, 3.2), 'c3', 'wm-k', 'soft')
  eyes(p, 11.2, 3, { r: 0.85, ry: 1, brow: null })
  p.fill(E(10.6, 15, 0.35, 0.25), 'shadow', 0.5); p.fill(E(13.4, 15, 0.35, 0.25), 'shadow', 0.5)
  p.line('M9 17.2c1.6 1.2 4.4 1.2 6 0', 'ink', 0.5, 0.85)
  blush(p, 12, 14.2, 5.1, 0.8)
}

export function avatar(icon) {
  const name = String(icon.name || '')
  if (PEOPLE[name]) return bust(icon, PEOPLE[name])
  if (CHARACTERS[name]) return character(icon, CHARACTERS[name])
  // a later person avatar: a deterministic recipe from its name (skin, hair, clothing spread by a hash)
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 131 + name.charCodeAt(i)) >>> 0
  const hs = ['short', 'long', 'crop', 'bob', 'curly', 'swept'], hc = ['dark', 'black', 'brown', 'auburn', 'blonde'], cc = Object.keys(CLOTH)
  return bust(icon, { skin: h % SKINS.length, hair: hc[(h >> 3) % hc.length], cloth: cc[(h >> 6) % cc.length], hairStyle: hs[(h >> 9) % hs.length], top: 'tee' })
}
