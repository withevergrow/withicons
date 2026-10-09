// Hand-drawn DRAGON HEAD for the holiday styles (utsav rangoli halloween christmas lunar valentine).
// Front view, lion-dance-meets-dragon: tall branching gold antlers, a red head narrowing into a long snout with a
// bulbous nose and nostrils, angry brows over bright eyes, cream fur tufts, an open mouth with teeth, golden
// whiskers sweeping out level then curling, a short white beard fringe. Each style adds its own festive dress.
// Roles: face c1, antlers/whiskers c2, cream c4, tint (fur shadow), shine (teeth/eye whites), accent (pearl),
// c3 (snout/nose), edge (foil rim), ink outline. Rich styles: one defs node, ids wg-<style>-dragon-head-<n>.
// Parts: head wm-k, antlers/whiskers/brows wm-a, teeth/pearl wm-s, extras wm-deco. Deterministic.

const n = v => {
  let s = String(Math.round(v * 100) / 100)
  if (s === '-0') s = '0'
  return s.replace(/^(-?)0\./, '$1.')
}
const disc = (cx, cy, r) => `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0z`
const ell = (cx, cy, rx, ry) => `M${n(cx - rx)} ${n(cy)}a${n(rx)} ${n(ry)} 0 1 0 ${n(2 * rx)} 0a${n(rx)} ${n(ry)} 0 1 0 ${n(-2 * rx)} 0z`
const heart = (x, y, s) => `M${n(x)} ${n(y + s * 0.95)}C${n(x - s * 1.25)} ${n(y + s * 0.1)} ${n(x - s * 1.05)} ${n(y - s * 0.95)} ${n(x - s * 0.5)} ${n(y - s * 0.95)}` +
  `C${n(x - s * 0.15)} ${n(y - s * 0.95)} ${n(x)} ${n(y - s * 0.6)} ${n(x)} ${n(y - s * 0.45)}C${n(x)} ${n(y - s * 0.6)} ${n(x + s * 0.15)} ${n(y - s * 0.95)} ${n(x + s * 0.5)} ${n(y - s * 0.95)}` +
  `C${n(x + s * 1.05)} ${n(y - s * 0.95)} ${n(x + s * 1.25)} ${n(y + s * 0.1)} ${n(x)} ${n(y + s * 0.95)}z`
const star4 = (x, y, r) => { const q = r * 0.24; return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}z` }
// mirror an absolute-command path (M L C Q Z only) across x = 12
const mir = d => d.replace(/([MLCQ])([^MLCQZz]*)/g, (_, c, args) => {
  const v = args.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  return c + v.map((x, i) => n(i % 2 ? x : 24 - x)).join(' ')
})
const both = d => d + mir(d)

const FALL = {
  lunar: { ink: '#4A0A10', c1: '#D8191F', c2: '#F2B530', c3: '#F0453A', c4: '#FFF1D2', tint: '#F2D2A0', shine: '#FFFFFF', accent: '#FF8A1E', edge: '#F7C948', shadow: '#8E0E14' },
  christmas: { ink: '#3A0F17', c1: '#C8203A', c2: '#E2A93B', c3: '#E04A5C', c4: '#FFF5E6', tint: '#D6E3EF', shine: '#FFFFFF', accent: '#1F6E46', edge: '#FFF5E6', shadow: '#7E0F22' },
  halloween: { ink: '#1D1029', c1: '#E2541C', c2: '#86D13A', c3: '#FF8A3A', c4: '#F6F2FF', tint: '#B9AEDB', shine: '#FFFFFF', accent: '#7344C9', edge: '#FF9F2E', shadow: '#5B2BB5' },
  valentine: { ink: '#6A1B3A', c1: '#E8304F', c2: '#F5C451', c3: '#FF6B8E', c4: '#FFF0F4', tint: '#F6D4DF', shine: '#FFFFFF', accent: '#FF8FB0', edge: '#FF8FB0', shadow: '#A8163A' },
  utsav: { ink: '#3B0A45', c1: '#E0283C', c2: '#D4A017', c3: '#F05A4A', c4: '#FFF3DC', tint: '#F4DDC0', shine: '#FFFFFF', accent: '#F97316', edge: '#F4C95D', shadow: '#9C1230' },
  rangoli: { ink: '#2B1660', c1: '#E8263A', c2: '#FFB21F', c3: '#FF5A6E', c4: '#FFF4E0', tint: '#F2D9B8', shine: '#FFFFFF', accent: '#E81F7A', edge: '#7B2FE0', shadow: '#A0102A' },
}

// shared bones (left halves, mirrored)
const HEAD = `M12 4.4C16.6 4.4 18.9 6.7 18.7 9.7C18.6 11.6 17.3 12.6 16.2 13.3L16.5 15.6C17.7 16.2 17.9 18 16.9 19C15.8 20 14 20.2 12 20.2C10 20.2 8.2 20 7.1 19C6.1 18 6.3 16.2 7.5 15.6L7.8 13.3C6.7 12.6 5.4 11.6 5.3 9.7C5.1 6.7 7.4 4.4 12 4.4z`
const ANTLER = `M9.4 5.2C8.6 3.8 7.9 2.6 7.6 0.9M8.2 3.4C7.2 3.2 6.2 2.6 5.6 1.6M7.8 2C8.6 1.6 9 1 9.2 0.4`
const TUFT = `M6.2 7.2C4.6 6.8 3.4 5.6 3 4.2C3.9 4.9 4.6 5 5.2 4.9C4.6 4 4.6 3 5 2.2C5.6 3.6 6.6 4.4 7.8 4.9C7.1 5.6 6.6 6.4 6.2 7.2z`
const CHEEK = `M5.6 10.4C4.2 10.6 3 10.2 2.2 9.4C3 9.4 3.6 9.2 4 8.8C3.2 8.4 2.8 7.6 2.8 6.8C3.8 7.6 4.8 7.8 5.6 7.6z`
const BROW = `M11.3 8.6C10 7.7 8.6 7.2 6.7 6.2C7.4 7.6 8.6 8.6 10.6 9.4z`
const WHISK = `M7.4 16.4C5.4 16 3.6 16.4 2.4 16.2C1.2 16 1 14.6 2 14.2C2.8 13.9 3.4 14.6 3 15.2`
const BEARD = `M8.6 19.8L9 22.4L10 20.3L10.9 23.2L12 20.4L13.1 23.2L14 20.3L15 22.4L15.4 19.8z`

export function dragonNodes(style) {
  const F = FALL[style]
  const V = r => `var(--with-${style}-${r}, ${F[r]})`
  const id = k => `wg-${style}-dragon-head-${k}`, url = k => `url(#${id(k)})`
  const st = (o, r) => ['stop', { offset: o, 'stop-color': V(r) }]
  const W = { christmas: 0.6, halloween: 0.7, lunar: 0.55, valentine: 0.65, utsav: 0.6, rangoli: 0 }[style]
  const line = W ? { stroke: V('ink'), 'stroke-width': W, 'stroke-linejoin': 'round' } : {}
  const P = (d, fill, cls, extra = {}) => ['path', { d, fill, ...line, ...(cls ? { class: cls } : {}), ...extra }]
  const F0 = (d, fill, cls, extra = {}) => ['path', { d, fill, ...(cls ? { class: cls } : {}), ...extra }]
  const S = (d, col, w, cls, extra = {}) => ['path', { d, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls, ...extra }]
  const grads = [
    ['radialGradient', { id: id(0), cx: 12, cy: 9, r: 11, gradientUnits: 'userSpaceOnUse' }, [st(0, 'c3'), st(0.55, 'c1'), st(1, 'shadow')]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 0, y2: 8, gradientUnits: 'userSpaceOnUse' }, [st(0, 'edge'), st(1, 'c2')]],
    ['radialGradient', { id: id(2), cx: 11.4, cy: 16.4, r: 3.4, gradientUnits: 'userSpaceOnUse' }, [st(0, 'c3'), st(1, 'c1')]],
  ]
  const out = []
  const antW = style === 'lunar' ? 1.25 : 1.15
  // antlers: an ink under-stroke so they read on any ground, gold on top
  if (W) out.push(S(both(ANTLER), V('ink'), antW + W * 2, 'wm-a'))
  out.push(S(both(ANTLER), style === 'rangoli' ? V('c2') : url(1), antW, 'wm-a'))
  // whiskers sweep out level then curl (behind the head)
  if (W) out.push(S(both(WHISK), V('ink'), 0.85 + W * 2, 'wm-a'))
  out.push(S(both(WHISK), V('c2'), 0.85, 'wm-a'))
  // fur tufts at the top corners and the cheeks
  out.push(P(both(TUFT) + both(CHEEK), V(W ? 'c4' : 'tint'), 'wm-k'))
  // the beard fringe hangs under the jaw
  out.push(P(BEARD, V(W ? 'shine' : 'tint'), 'wm-k'))
  // head
  out.push(P(HEAD, url(0), 'wm-k'))
  // the snout ridge (lighter) running to the nose
  out.push(F0(`M10.4 11.8C10.8 13.4 10.6 14.6 10.2 15.6L13.8 15.6C13.4 14.6 13.2 13.4 13.6 11.8C12.6 12.3 11.4 12.3 10.4 11.8z`, V('c3'), 'wm-k', { 'fill-opacity': 0.6 }))
  // eyes: white with a dark pupil and a glint, under angry cream brows
  out.push(P(ell(9.4, 10, 1.35, 1.25) + ell(14.6, 10, 1.35, 1.25), V('shine'), 'wm-k', W ? { 'stroke-width': W * 0.8 } : {}))
  out.push(F0(disc(9.75, 10.2, 0.72) + disc(14.25, 10.2, 0.72), V('ink'), 'wm-k'))
  out.push(F0(disc(10, 9.9, 0.25) + disc(14.5, 9.9, 0.25), V('shine'), 'wm-k'))
  out.push(P(both(BROW), V('c4'), 'wm-a', W ? { 'stroke-width': W * 0.8 } : {}))
  // the mouth: an open dark band with a row of rounded teeth and two fangs
  out.push(F0(`M8.2 17.4C9.6 18.6 14.4 18.6 15.8 17.4C15.6 19 14.2 19.7 12 19.7C9.8 19.7 8.4 19 8.2 17.4z`, V('ink'), 'wm-k'))
  out.push(F0(`M8.9 17.9L9 18.9L9.6 18.1zM15.1 17.9L15 18.9L14.4 18.1zM9.9 18.2C10 18.8 10.8 18.8 10.9 18.3C11 18.8 11.9 18.9 12 18.3C12.1 18.9 13 18.8 13.1 18.3C13.2 18.8 14 18.8 14.1 18.2C12.7 18.5 11.3 18.5 9.9 18.2z`, V('shine'), 'wm-s'))
  // big bulbous nose with two nostrils
  out.push(P(`M12 14.6C14.6 14.6 15.9 15.6 15.9 16.7C15.9 17.8 14.4 18.2 12 18.2C9.6 18.2 8.1 17.8 8.1 16.7C8.1 15.6 9.4 14.6 12 14.6z`, url(2), 'wm-k'))
  out.push(F0(ell(10.6, 16.9, 0.7, 0.45) + ell(13.4, 16.9, 0.7, 0.45), V('ink'), 'wm-k'))
  out.push(F0(ell(11.2, 15.4, 0.9, 0.3), V('shine'), 'wm-k', { 'fill-opacity': 0.55 }))

  if (style === 'lunar') {
    // the hero: a lion-dance face. gold-foil rim, flaming orange pearl on the forehead, gold scale arcs, a cream
    // lip band, gold cheek scrolls, red silk tassels on the whisker tips, a pair of gold sparkles
    out.push(F0(`M12 4.9C15.9 4.9 18 6.9 18.1 9.4`, 'none', 'wm-k', { stroke: V('edge'), 'stroke-width': 0.4, 'stroke-linecap': 'round', 'stroke-opacity': 0.9 }))
    out.push(F0(mir(`M12 4.9C15.9 4.9 18 6.9 18.1 9.4`), 'none', 'wm-k', { stroke: V('edge'), 'stroke-width': 0.4, 'stroke-linecap': 'round', 'stroke-opacity': 0.9 }))
    // scale arcs on the brow ridge
    out.push(S(`M10.2 7.4Q11.1 6.6 12 7.4Q12.9 6.6 13.8 7.4`, V('c2'), 0.35, 'wm-k'))
    // flaming pearl
    out.push(P(`M12 4.2C12.9 4.9 13.5 5.4 13.3 6.3C13.2 7 12.6 7.2 12 7.2C11.4 7.2 10.8 7 10.7 6.3C10.5 5.4 11.1 4.9 12 4.2z`, V('c2'), 'wm-s', { 'stroke-width': 0.4 }))
    out.push(P(disc(12, 6.2, 0.75), V('accent'), 'wm-s', { 'stroke-width': 0.35 }))
    out.push(F0(disc(11.75, 5.95, 0.22), V('shine'), 'wm-s'))
    // cheek scrolls (gold)
    out.push(S(both(`M7.2 12.4C6.6 12.2 6.5 11.5 7 11.3C7.4 11.2 7.6 11.6 7.4 11.8`), V('c2'), 0.4, 'wm-k'))
    // cream lip band over the mouth corners
    out.push(P(both(`M7.4 17C7.9 16.4 8.3 16.6 8.5 17.4C8.6 18.2 8.2 18.7 7.6 18.6C7.2 18.4 7.1 17.6 7.4 17z`), V('c4'), 'wm-k', { 'stroke-width': 0.4 }))
    // tassels on the whisker curls
    out.push(S(both(`M2.4 14.4L2.1 13.2`), V('c2'), 0.35, 'wm-deco'))
    out.push(P(both(`M2.1 13.3C1.6 12.6 1.7 11.6 2.1 11.2C2.5 11.6 2.6 12.6 2.1 13.3z`), V('c1'), 'wm-deco', { 'stroke-width': 0.3 }))
    out.push(F0(star4(20.6, 4.8, 1) + star4(3.4, 20.6, 0.8) + star4(20.4, 20.8, 0.65), V('c2'), 'wm-deco'))
  }
  if (style === 'christmas') {
    // a holly sprig on the left antler, a Santa-white fur trim on the brows, snowflake dots
    out.push(P(`M7.8 4.2Q6.4 3.6 5.8 4.6Q7 5.4 7.8 4.2zM7.8 4.2Q8 2.8 9.2 2.8Q9.2 4 7.8 4.2z`, V('accent'), 'wm-deco', { 'stroke-width': 0.35 }))
    out.push(F0(disc(8, 4.6, 0.45) + disc(8.7, 4.4, 0.4), V('c1'), 'wm-deco', { stroke: V('ink'), 'stroke-width': 0.25 }))
    out.push(F0(disc(20.8, 3.6, 0.42) + disc(3.2, 21, 0.4) + disc(21, 21.2, 0.35) + disc(19.4, 1.6, 0.3), V('tint'), 'wm-deco'))
  }
  if (style === 'halloween') {
    // glowing eyes, a jack-o'-lantern pearl, a tiny bat
    out.push(F0(disc(9.75, 10.2, 0.72) + disc(14.25, 10.2, 0.72), V('edge'), 'wm-k', { 'fill-opacity': 0.55 }))
    out.push(P(ell(12, 6.4, 1.1, 0.9), V('edge'), 'wm-s', { 'stroke-width': 0.35 }))
    out.push(F0(`M11.5 6.2l.25-.4l.25.4zM12 6.2l.25-.4l.25.4zM11.4 6.7Q12 7.1 12.6 6.7z`, V('ink'), 'wm-s'))
    out.push(F0(`M18.6 2.4q.7-.9 1.4 0q.7-.9 1.5-.2q-.4.1-.5.7q-.4-.3-.9.1q-.2-.5-.6 0q-.5-.4-.9-.1q-.1-.6-.5-.7q.8-.7 1.5.2z`, V('accent'), 'wm-deco'))
  }
  if (style === 'valentine') {
    // a heart pearl, rosy cheeks, heart sparkles
    out.push(P(heart(12, 6.4, 0.95), V('accent'), 'wm-s', { 'stroke-width': 0.4 }))
    out.push(F0(ell(7.6, 12.4, 0.8, 0.45) + ell(16.4, 12.4, 0.8, 0.45), V('accent'), 'wm-k', { 'fill-opacity': 0.85 }))
    out.push(F0(heart(20.6, 3.6, 0.8) + heart(3.2, 21, 0.6) + heart(20.8, 21, 0.55), V('c3'), 'wm-deco', { stroke: V('ink'), 'stroke-width': 0.3 }))
  }
  if (style === 'utsav') {
    // a gold tilak and bindi, a marigold string under the beard, diya-flame sparkles
    out.push(P(`M12 5.2C12.6 6 12.6 7 12 7.6C11.4 7 11.4 6 12 5.2z`, V('c2'), 'wm-s', { 'stroke-width': 0.35 }))
    out.push(F0(disc(12, 8.1, 0.35), V('accent'), 'wm-s'))
    const ring = []
    for (let k = 0; k <= 6; k++) { const t = k / 6; ring.push([7.6 + 8.8 * t, 20.2 + Math.sin(Math.PI * t) * 0.9]) }
    out.push(P(ring.map(([x, y]) => disc(x, y, 0.62)).join(''), V('accent'), 'wm-deco', { 'stroke-width': 0.35 }))
    out.push(F0(ring.map(([x, y]) => disc(x, y, 0.22)).join(''), V('c2'), 'wm-deco'))
    out.push(F0(star4(20.6, 4.2, 1) + disc(3.2, 21, 0.35) + disc(20.8, 21, 0.35), V('c2'), 'wm-deco'))
  }
  if (style === 'rangoli') {
    // no outline: a soft depth lip, rangoli dot-work on the forehead, a magenta pearl, twinkles
    out.push(F0(`M8.4 6.8a.3 .3 0 1 0 .6 0a.3 .3 0 1 0-.6 0zM15 6.8a.3 .3 0 1 0 .6 0a.3 .3 0 1 0-.6 0z`, V('c2'), 'wm-k'))
    out.push(F0(disc(12, 6.4, 0.95), V('accent'), 'wm-s'))
    out.push(F0(disc(12, 6.4, 0.4), V('c2'), 'wm-s'))
    out.push(F0([0, 1, 2, 3, 4, 5].map(k => { const a = Math.PI * 2 * k / 6; return disc(12 + Math.cos(a) * 1.6, 6.4 + Math.sin(a) * 1.3, 0.22) }).join(''), V('c4'), 'wm-s'))
    out.push(F0(star4(20.6, 4.6, 1.1) + star4(3.4, 20.6, 0.8), V('edge'), 'wm-deco'))
  }
  return [['defs', {}, grads], ...out.filter(Boolean)]
}
