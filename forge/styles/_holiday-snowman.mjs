// Hand-drawn SNOWMAN for the holiday styles (utsav rangoli halloween christmas lunar valentine).
// Each style gets its own drawing (hat, scarf, details), sharing only the two balls and twig arms.
// Roles (per-icon palette forge/palettes/snowman.json): body shine -> tint, hat c2, scarf c3, carrot accent,
// coal / twigs / outline ink. Rich styles: one defs node, ids wg-<style>-snowman-<n>, stops are role vars.
// Parts: balls + face wm-k, hat wm-a (the skeleton's A plate), scarf wm-s, extras wm-deco. Deterministic.

const n = v => {
  let s = String(Math.round(v * 100) / 100)
  if (s === '-0') s = '0'
  return s.replace(/^(-?)0\./, '$1.')
}
const disc = (cx, cy, r) => `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0z`
const ell = (cx, cy, rx, ry) => `M${n(cx - rx)} ${n(cy)}a${n(rx)} ${n(ry)} 0 1 0 ${n(2 * rx)} 0a${n(rx)} ${n(ry)} 0 1 0 ${n(-2 * rx)} 0z`
// a little heart centred at x,y, size s (width about 2s)
const heart = (x, y, s) => `M${n(x)} ${n(y + s * 0.95)}C${n(x - s * 1.25)} ${n(y + s * 0.1)} ${n(x - s * 1.05)} ${n(y - s * 0.95)} ${n(x - s * 0.5)} ${n(y - s * 0.95)}` +
  `C${n(x - s * 0.15)} ${n(y - s * 0.95)} ${n(x)} ${n(y - s * 0.6)} ${n(x)} ${n(y - s * 0.45)}C${n(x)} ${n(y - s * 0.6)} ${n(x + s * 0.15)} ${n(y - s * 0.95)} ${n(x + s * 0.5)} ${n(y - s * 0.95)}` +
  `C${n(x + s * 1.05)} ${n(y - s * 0.95)} ${n(x + s * 1.25)} ${n(y + s * 0.1)} ${n(x)} ${n(y + s * 0.95)}z`
const star4 = (x, y, r) => { const q = r * 0.24; return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}z` }

const FALL = {
  christmas: { ink: '#3A0F17', shine: '#FFFFFF', tint: '#C9DAEC', c2: '#C8203A', c3: '#1F6E46', accent: '#F28A1E', c4: '#E2A93B', edge: '#FFF5E6' },
  halloween: { ink: '#1D1029', shine: '#F6F2FF', tint: '#B9AEDB', c2: '#5B2BB5', c3: '#FF8A1F', accent: '#FF9F2E', c4: '#86D13A', edge: '#7344C9' },
  lunar: { ink: '#4A0A10', shine: '#FFFDF6', tint: '#F2DCC4', c2: '#C8161E', c3: '#E8282E', accent: '#F28A1E', c4: '#E8B030', edge: '#A8700F' },
  valentine: { ink: '#6A1B3A', shine: '#FFFFFF', tint: '#F6D4DF', c2: '#E8304F', c3: '#FF6B8E', accent: '#FF8A3D', c4: '#F5C451', edge: '#FF8FB0' },
  utsav: { ink: '#3B0A45', shine: '#FFFDF6', tint: '#F4DDC0', c2: '#E11D74', c3: '#F59E0B', accent: '#F97316', c4: '#D4A017', edge: '#F4C95D' },
  rangoli: { ink: '#2B1660', shine: '#FFFFFF', tint: '#E9DCF5', c2: '#E81F7A', c3: '#FFB21F', accent: '#F2462C', c4: '#7B2FE0', edge: '#FFC21A' },
}

export function snowmanNodes(style) {
  const F = FALL[style]
  const V = r => `var(--with-${style}-${r}, ${F[r]})`
  const id = k => `wg-${style}-snowman-${k}`, url = k => `url(#${id(k)})`
  const st = (o, r, op) => ['stop', op === undefined ? { offset: o, 'stop-color': V(r) } : { offset: o, 'stop-color': V(r), 'stop-opacity': op }]
  const W = { christmas: 0.6, halloween: 0.75, lunar: 0.5, valentine: 0.7, utsav: 0.65, rangoli: 0 }[style]
  const line = W ? { stroke: V('ink'), 'stroke-width': W, 'stroke-linejoin': 'round' } : {}
  const P = (d, fill, cls, extra = {}) => ['path', { d, fill, ...line, ...(cls ? { class: cls } : {}), ...extra }]
  const F0 = (d, fill, cls, extra = {}) => ['path', { d, fill, ...(cls ? { class: cls } : {}), ...extra }]
  const TW = { christmas: 'c4', halloween: 'edge', lunar: 'c4', valentine: 'c4', utsav: 'c4', rangoli: 'c4' }[style]
  const twig = (d, w = 0.95) => ['path', { d, fill: 'none', stroke: V(TW), 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }]

  // shared bones (each style moves them a little)
  const g = {
    christmas: { by: 16.7, br: 5.1, hy: 9.6, hr: 3.5 },
    halloween: { by: 16.8, br: 5.0, hy: 10.0, hr: 3.4 },
    lunar: { by: 16.6, br: 5.2, hy: 9.8, hr: 3.5 },
    valentine: { by: 16.6, br: 5.3, hy: 9.7, hr: 3.7 },
    utsav: { by: 16.7, br: 5.1, hy: 9.9, hr: 3.5 },
    rangoli: { by: 16.4, br: 5.2, hy: 9.6, hr: 3.6 },
  }[style]
  const { by, br, hy, hr } = g
  const grads = [
    ['radialGradient', { id: id(0), cx: 10.2, cy: 8.5, r: 15, gradientUnits: 'userSpaceOnUse' },
      [st(0.25, 'shine'), st(0.95, 'tint')]],
    ['linearGradient', { id: id(1), x1: 8, y1: 2, x2: 16, y2: 9, gradientUnits: 'userSpaceOnUse' },
      [st(0, 'c2'), st(1, 'c4')]],
  ]
  const out = []
  const body = () => {
    out.push(P(disc(12, by, br), url(0), 'wm-k'))
    out.push(P(disc(12, hy, hr), url(0), 'wm-k'))
  }
  const eyes = (r = 0.48, dy = -0.5, dx = 1.25) => out.push(F0(disc(12 - dx, hy + dy, r) + disc(12 + dx, hy + dy, r), V('ink'), 'wm-k'))
  const carrot = (len = 3.2) => out.push(P(`M12 ${n(hy + 0.25)}L${n(12 + len)} ${n(hy + 0.95)}L12 ${n(hy + 1.2)}z`, V('accent'), 'wm-k', W ? { 'stroke-width': W * 0.7 } : {}))
  const smile = (dots = true) => out.push(dots
    ? F0(disc(10.6, hy + 1.85, 0.28) + disc(11.3, hy + 2.3, 0.28) + disc(12.1, hy + 2.45, 0.28) + disc(12.9, hy + 2.3, 0.28), V('ink'), 'wm-k')
    : ['path', { d: `M10.6 ${n(hy + 1.9)}Q12 ${n(hy + 2.9)} 13.4 ${n(hy + 1.9)}`, fill: 'none', stroke: V('ink'), 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-k' }])
  const buttons = (ys, r = 0.5, fill = V('ink'), shape = disc) => out.push(F0(ys.map(y => shape(12, y, r)).join(''), fill, 'wm-k'))
  const scarf = (fill, endSide = 1, extra) => {
    const y = hy + hr - 0.5, s = endSide
    out.push(P(`M${n(12 - 4.1)} ${n(y - 0.8)}Q12 ${n(y + 1.1)} ${n(12 + 4.1)} ${n(y - 0.8)}L${n(12 + 4.2)} ${n(y + 0.8)}Q12 ${n(y + 2.8)} ${n(12 - 4.2)} ${n(y + 0.8)}z`, fill, 'wm-s'))
    const x = 12 + s * 2.3
    out.push(P(`M${n(x - s * 0.9)} ${n(y + 1.1)}L${n(x + s * 1.1)} ${n(y + 0.9)}L${n(x + s * 1.9)} ${n(y + 5.3)}L${n(x + s * 0.2)} ${n(y + 5.7)}z`, fill, 'wm-s'))
    if (extra) extra(x, y, s)
  }
  const arms = (fingers = true) => {
    const ay = by - 3.2
    out.push(twig(`M${n(12 - br + 0.6)} ${n(ay)}L3.4 ${n(ay - 3.4)}` + (fingers ? `M5.0 ${n(ay - 2.2)}L3.6 ${n(ay - 1.6)}M4.4 ${n(ay - 2.7)}L4.2 ${n(ay - 4.3)}` : '')))
    out.push(twig(`M${n(12 + br - 0.6)} ${n(ay)}L20.6 ${n(ay - 3.4)}` + (fingers ? `M19.0 ${n(ay - 2.2)}L20.4 ${n(ay - 1.6)}M19.6 ${n(ay - 2.7)}L19.8 ${n(ay - 4.3)}` : '')))
  }
  const flakes = (pts, fill) => out.push(F0(pts.map(([x, y, r]) => disc(x, y, r)).join(''), fill, 'wm-deco'))

  if (style === 'christmas') {
    // Santa hat flopping right, white fur band and pompom, red mittens on stick arms, pine scarf, holly on the band
    const ay = by - 3.2
    out.push(twig(`M${n(12 - br + 0.6)} ${n(ay)}L4.2 ${n(ay - 2.6)}`), twig(`M${n(12 + br - 0.6)} ${n(ay)}L19.8 ${n(ay - 2.6)}`))
    out.push(P(`M2.6 ${n(ay - 3.6)}c-.6 1 -.2 2.4 1 2.6c1.1.2 1.9-.6 1.8-1.6l-.1-.6l.6-.7c.3-.4-.2-.9-.6-.6l-.6.5c-.6-.6-1.6-.5-2.1.4z`, V('c2'), 'wm-k'))
    out.push(P(`M21.4 ${n(ay - 3.6)}c.6 1 .2 2.4-1 2.6c-1.1.2-1.9-.6-1.8-1.6l.1-.6l-.6-.7c-.3-.4.2-.9.6-.6l.6.5c.6-.6 1.6-.5 2.1.4z`, V('c2'), 'wm-k'))
    body()
    // snow mound
    out.push(P(`M5.2 21.3Q12 19.9 18.8 21.3Q19.6 22.2 18.6 22.4H5.4Q4.4 22.2 5.2 21.3z`, url(0), 'wm-deco'))
    scarf(V('c3'), 1, (x, y, s) => out.push(F0(`M${n(x + s * 0.6)} ${n(y + 2.8)}l${n(s * 1.2)} -.15v.6l${n(-s * 1.1)} .15z`, V('edge'), 'wm-s')))
    buttons([by - 1.6, by + 0.6, by + 2.8], 0.5)
    eyes(); carrot(); smile(true)
    out.push(P(`M${n(8.9)} ${n(hy - 2.4)}C9.2 2.6 12 1.2 14.6 1.6C16.9 2 18.6 3.6 19.2 6.2L17.7 6.4C17.2 5 16.5 4.4 15.6 4.6L15.4 ${n(hy - 2.4)}z`, V('c2'), 'wm-a'))
    out.push(F0(`M9.4 ${n(hy - 2.6)}C10 3.4 12 2.2 14 2.4`, 'none', 'wm-a', { stroke: V('shine'), 'stroke-opacity': 0.35, 'stroke-width': 0.6, 'stroke-linecap': 'round' }))
    out.push(P(disc(18.6, 6.9, 1.35), V('shine'), 'wm-a'))
    out.push(P(`M8.1 ${n(hy - 1.7)}Q12 ${n(hy - 3.1)} 15.9 ${n(hy - 1.7)}L16.1 ${n(hy - 3.2)}Q12 ${n(hy - 4.7)} 7.9 ${n(hy - 3.2)}z`, V('shine'), 'wm-a'))
    // holly sprig on the band
    out.push(P(`M13.4 ${n(hy - 3.3)}q.9-.9 2.1-.5q-.5 1.1-2.1.5zM13.4 ${n(hy - 3.3)}q.2-1.3 1.3-1.7q.3 1.2-1.3 1.7z`, V('c3'), 'wm-deco', { 'stroke-width': 0.3 }))
    out.push(F0(disc(13.2, hy - 3, 0.42) + disc(12.5, hy - 3.3, 0.38), V('c2'), 'wm-deco', { stroke: V('ink'), 'stroke-width': 0.25 }))
    flakes([[3.2, 4.6, 0.45], [21, 12.6, 0.4], [2.6, 16.2, 0.4], [5.6, 2.2, 0.32]], V('tint'))
  }

  if (style === 'halloween') {
    // a witch hat with a bent tip and buckle band, pumpkin-orange scarf, carved jack-o'-lantern grin, bony twigs
    arms(true)
    body()
    out.push(P(`M6.4 21.4Q12 20.2 17.6 21.4Q18.4 22.3 17.4 22.4H6.6Q5.6 22.3 6.4 21.4z`, url(0), 'wm-deco'))
    scarf(V('c3'), -1, (x, y, s) => out.push(F0(`M${n(12 - 2.6)} ${n(y + 0.3)}v1.6M${n(12 + 0.2)} ${n(y + 1.2)}v1.4M${n(12 + 2.8)} ${n(y + 0.3)}v1.6`, 'none', 'wm-s', { stroke: V('ink'), 'stroke-width': 0.4, 'stroke-opacity': 0.5 })))
    buttons([by - 1.2, by + 1.2], 0.55)
    // triangle eyes and a jagged grin, all carved in ink
    out.push(F0(`M10.1 ${n(hy - 0.1)}l.85-1.4l.85 1.4zM12.2 ${n(hy - 0.1)}l.85-1.4l.85 1.4z`, V('ink'), 'wm-k'))
    out.push(F0(`M10.2 ${n(hy + 1.5)}Q12 ${n(hy + 3.4)} 13.8 ${n(hy + 1.5)}l-.55.5l-.4-.45l-.4.55l-.45-.5l-.45.5l-.4-.55l-.4.45z`, V('ink'), 'wm-k'))
    out.push(P(`M12 ${n(hy + 0.25)}L${n(14.4)} ${n(hy + 0.75)}L12 ${n(hy + 1)}z`, V('accent'), 'wm-k', { 'stroke-width': 0.5 }))
    // hat: brim, cone with a crooked tip, band and gold buckle
    out.push(P(`M5.6 ${n(hy - 2.6)}Q12 ${n(hy - 4.8)} 18.4 ${n(hy - 2.6)}Q12 ${n(hy - 1.2)} 5.6 ${n(hy - 2.6)}z`, V('c2'), 'wm-a'))
    out.push(P(`M8.8 ${n(hy - 3.4)}L11 3.6Q12 1.4 14.6 1.8Q13.4 2.4 13.4 3.6L15.2 ${n(hy - 3.4)}Q12 ${n(hy - 2.6)} 8.8 ${n(hy - 3.4)}z`, V('c2'), 'wm-a'))
    out.push(F0(`M9.3 ${n(hy - 4.5)}Q12 ${n(hy - 3.8)} 14.7 ${n(hy - 4.5)}L14.95 ${n(hy - 3.6)}Q12 ${n(hy - 2.8)} 9.05 ${n(hy - 3.6)}z`, V('c3'), 'wm-a'))
    out.push(F0(`M11.4 ${n(hy - 4.6)}h1.2v1.25h-1.2z`, 'none', 'wm-a', { stroke: V('c4'), 'stroke-width': 0.35 }))
    // a tiny bat and a moon-lit star
    out.push(F0(`M18.6 3.2q.7-.9 1.4 0q.7-.9 1.5-.2q-.4.1-.5.7q-.4-.3-.9.1q-.2-.5-.6 0q-.5-.4-.9-.1q-.1-.6-.5-.7q.8-.7 1.5.2z`, V('edge'), 'wm-deco'))
    out.push(F0(star4(3.6, 5, 0.9), V('accent'), 'wm-deco'))
  }

  if (style === 'lunar') {
    // a red melon cap with a gold knot, red scarf with gold edging and a tassel, a paper lantern on the right twig
    const ay = by - 3.2
    out.push(twig(`M${n(12 - br + 0.6)} ${n(ay)}L3.6 ${n(ay - 3.2)}M5.1 ${n(ay - 2.1)}L3.8 ${n(ay - 1.4)}`))
    out.push(twig(`M${n(12 + br - 0.6)} ${n(ay)}L19.4 ${n(ay - 3.4)}`))
    // lantern hanging from the right hand
    out.push(['path', { d: `M19.4 ${n(ay - 3.4)}v1.1`, fill: 'none', stroke: V('c4'), 'stroke-width': 0.4, class: 'wm-deco' }])
    out.push(P(ell(19.4, ay - 0.6, 1.9, 1.75), V('c3'), 'wm-deco'))
    out.push(F0(`M18.4 ${n(ay - 2.2)}h2v.5h-2zM18.4 ${n(ay + 0.85)}h2v.5h-2z`, V('c4'), 'wm-deco'))
    out.push(F0(`M19.4 ${n(ay - 2.2)}v3.2M18.3 ${n(ay - 1.9)}q-.6 1.3 0 2.6M20.5 ${n(ay - 1.9)}q.6 1.3 0 2.6`, 'none', 'wm-deco', { stroke: V('c4'), 'stroke-width': 0.3 }))
    out.push(['path', { d: `M19.4 ${n(ay + 1.35)}v1.6`, fill: 'none', stroke: V('c4'), 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-deco' }])
    body()
    out.push(P(`M5.4 21.3Q12 20 18.6 21.3Q19.4 22.2 18.4 22.4H5.6Q4.6 22.2 5.4 21.3z`, url(0), 'wm-deco'))
    scarf(V('c3'), -1, (x, y, s) => {
      out.push(F0(`M${n(12 - 4.1)} ${n(y + 0.15)}Q12 ${n(y + 2.05)} ${n(12 + 4.1)} ${n(y + 0.15)}`, 'none', 'wm-s', { stroke: V('c4'), 'stroke-width': 0.35 }))
      out.push(F0(`M${n(x + s * 0.15)} ${n(y + 5.75)}l${n(s * 0.8)} 1.5M${n(x + s * 0.9)} ${n(y + 5.6)}l${n(s * 0.6)} 1.5M${n(x + s * 1.6)} ${n(y + 5.4)}l${n(s * 0.4)} 1.5`, 'none', 'wm-s', { stroke: V('c4'), 'stroke-width': 0.4, 'stroke-linecap': 'round' }))
    })
    // gold coin buttons with a square hole
    out.push(F0([by - 1.4, by + 1.2].map(y => disc(12, y, 0.75) + `M11.75 ${n(y - 0.25)}v.5h.5v-.5z`).join(''), V('c4'), 'wm-k', { 'fill-rule': 'evenodd', stroke: V('edge'), 'stroke-width': 0.25 }))
    eyes(0.45); carrot(2.9); smile(false)
    out.push(F0(disc(10.1, hy + 1.1, 0.55) + disc(13.9, hy + 1.1, 0.55), V('c3'), 'wm-k', { 'fill-opacity': 0.35 }))
    // melon cap: a dome with gold seams and a knot on top
    out.push(P(`M8.4 ${n(hy - 1.6)}Q8.6 ${n(hy - 5.8)} 12 ${n(hy - 5.9)}Q15.4 ${n(hy - 5.8)} 15.6 ${n(hy - 1.6)}Q12 ${n(hy - 2.6)} 8.4 ${n(hy - 1.6)}z`, V('c2'), 'wm-a'))
    out.push(F0(`M12 ${n(hy - 5.9)}V${n(hy - 2.1)}M10 ${n(hy - 5.3)}Q9.9 ${n(hy - 3.4)} 10.2 ${n(hy - 2.3)}M14 ${n(hy - 5.3)}Q14.1 ${n(hy - 3.4)} 13.8 ${n(hy - 2.3)}`, 'none', 'wm-a', { stroke: V('c4'), 'stroke-width': 0.35 }))
    out.push(F0(`M8.3 ${n(hy - 1.5)}Q12 ${n(hy - 2.55)} 15.7 ${n(hy - 1.5)}L15.6 ${n(hy - 2.3)}Q12 ${n(hy - 3.35)} 8.4 ${n(hy - 2.3)}z`, V('c4'), 'wm-a'))
    out.push(P(disc(12, hy - 6.4, 0.75), V('c4'), 'wm-a', { 'stroke-width': 0.35 }))
    out.push(F0(star4(4, 4.2, 1) + star4(20.4, 4.4, 0.7), V('c4'), 'wm-deco'))
  }

  if (style === 'valentine') {
    // a pink beanie with a heart pompom, pink scarf with a heart, rosy cheeks, holding a heart, heart buttons
    const ay = by - 3.2
    out.push(twig(`M${n(12 - br + 0.6)} ${n(ay)}L4.4 ${n(ay - 2.8)}M5.6 ${n(ay - 2.3)}L4.9 ${n(ay - 3.6)}`))
    out.push(twig(`M${n(12 + br - 0.6)} ${n(ay)}L19.6 ${n(ay - 2.8)}`))
    out.push(P(heart(19.9, ay - 4, 1.55), V('c2'), 'wm-deco'))
    out.push(F0(disc(19.3, ay - 4.6, 0.32), V('shine'), 'wm-deco'))
    body()
    scarf(V('c3'), -1, (x, y, s) => out.push(F0(heart(x + s * 1.0, y + 4, 0.65), V('shine'), 'wm-s')))
    out.push(F0([by - 1.3, by + 1.3].map(y => heart(12, y, 0.6)).join(''), V('c2'), 'wm-k'))
    eyes(0.5, -0.4); carrot(2.6); smile(false)
    out.push(F0(ell(9.9, hy + 1.1, 0.7, 0.45) + ell(14.1, hy + 1.1, 0.7, 0.45), V('edge'), 'wm-k', { 'fill-opacity': 0.8 }))
    // beanie: dome + folded cuff + heart pompom
    out.push(P(`M8.4 ${n(hy - 2)}Q8.6 ${n(hy - 6.3)} 12 ${n(hy - 6.4)}Q15.4 ${n(hy - 6.3)} 15.6 ${n(hy - 2)}z`, V('c3'), 'wm-a'))
    out.push(P(`M8 ${n(hy - 1.3)}Q12 ${n(hy - 2.5)} 16 ${n(hy - 1.3)}V${n(hy - 2.8)}Q12 ${n(hy - 4)} 8 ${n(hy - 2.8)}z`, V('c2'), 'wm-a'))
    out.push(P(heart(12, hy - 7.2, 1.15), V('c2'), 'wm-a'))
    out.push(F0(`M10.2 ${n(hy - 4.4)}Q10.6 ${n(hy - 5.6)} 11.8 ${n(hy - 5.8)}`, 'none', 'wm-a', { stroke: V('shine'), 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-opacity': 0.7 }))
    out.push(F0(heart(3.6, 4.6, 0.8) + heart(20.8, 21, 0.6) + heart(3.2, 20.2, 0.55), V('c3'), 'wm-deco', { stroke: V('ink'), 'stroke-width': 0.35 }))
  }

  if (style === 'utsav') {
    // a jewel-pink topi with a gold border of dots, a marigold garland round the neck, a diya in the hand, rangoli dots
    const ay = by - 3.2
    out.push(twig(`M${n(12 - br + 0.6)} ${n(ay)}L3.8 ${n(ay - 3.2)}M5.2 ${n(ay - 2.1)}L4 ${n(ay - 1.4)}M4.6 ${n(ay - 2.6)}L4.4 ${n(ay - 4)}`))
    out.push(twig(`M${n(12 + br - 0.6)} ${n(ay)}L19.4 ${n(ay - 2.2)}`))
    // diya on the right hand: a clay bowl and a flame
    out.push(P(`M17.6 ${n(ay - 2.4)}Q19.6 ${n(ay - 1.6)} 21.6 ${n(ay - 2.4)}Q21.2 ${n(ay - 0.4)} 19.6 ${n(ay - 0.4)}Q18 ${n(ay - 0.4)} 17.6 ${n(ay - 2.4)}z`, V('c4'), 'wm-deco'))
    out.push(P(`M19.6 ${n(ay - 5.2)}Q20.6 ${n(ay - 3.6)} 19.6 ${n(ay - 2.6)}Q18.6 ${n(ay - 3.6)} 19.6 ${n(ay - 5.2)}z`, V('accent'), 'wm-deco', { 'stroke-width': 0.4 }))
    body()
    // rangoli dot-work on the lower ball
    out.push(F0([[-2.6, 1.6], [-3.2, 0], [2.6, 1.6], [3.2, 0], [-1.4, 3], [1.4, 3]].map(([dx, dy]) => disc(12 + dx, by + dy, 0.28)).join(''), V('edge'), 'wm-k'))
    buttons([by - 1.4, by + 0.6], 0.55, V('c2'))
    eyes(0.45); carrot(2.8); smile(false)
    out.push(F0(disc(12, hy - 1.75, 0.35), V('c2'), 'wm-k'))
    // marigold garland: a chain of blossoms with a hanging strand
    const ring = []
    for (let k = 0; k <= 6; k++) { const t = k / 6, x = 8.2 + 7.6 * t, y = hy + hr - 0.3 + Math.sin(Math.PI * t) * 1.2; ring.push([x, y]) }
    ring.push([10.6, hy + hr + 2.2], [10.2, hy + hr + 3.6])
    out.push(P(ring.map(([x, y]) => disc(x, y, 0.82)).join(''), V('c3'), 'wm-s', { 'stroke-width': W * 0.7 }))
    out.push(F0(ring.map(([x, y]) => disc(x, y, 0.28)).join(''), V('accent'), 'wm-s'))
    // topi: a low boat cap with a gold border and dots
    out.push(P(`M8.2 ${n(hy - 1.8)}L8.8 ${n(hy - 5.2)}Q12 ${n(hy - 6.4)} 15.2 ${n(hy - 5.2)}L15.8 ${n(hy - 1.8)}Q12 ${n(hy - 2.8)} 8.2 ${n(hy - 1.8)}z`, V('c2'), 'wm-a'))
    out.push(F0(`M8.3 ${n(hy - 2.4)}Q12 ${n(hy - 3.4)} 15.7 ${n(hy - 2.4)}`, 'none', 'wm-a', { stroke: V('c4'), 'stroke-width': 0.55 }))
    out.push(F0([9.8, 12, 14.2].map(x => disc(x, hy - 4.4, 0.32)).join(''), V('edge'), 'wm-a'))
    out.push(F0(star4(4.2, 4.2, 1.1) + disc(20, 4.2, 0.4) + disc(2.8, 21, 0.35) + disc(21.2, 20.6, 0.35), V('c4'), 'wm-deco'))
  }

  if (style === 'rangoli') {
    // no outline: a glowing body on a rangoli petal ring, a marigold-orange beanie and scarf, pink pompom, twinkles
    const ay = by - 3.2
    // petal ring on the ground
    const pet = []
    for (let k = 0; k < 9; k++) {
      const a = Math.PI * (k / 8), x = 12 - Math.cos(a) * 7.6, y = 21.2 - Math.sin(a) * 1.4
      pet.push(ell(x, y, 0.95, 0.6))
    }
    out.push(F0(ell(12, 21.4, 8.2, 1.25), V('c4'), 'wm-deco', { 'fill-opacity': 0.9 }))
    out.push(F0(pet.join(''), V('edge'), 'wm-deco'))
    out.push(['path', { d: `M${n(12 - br + 0.6)} ${n(ay)}L3.6 ${n(ay - 3.4)}M5 ${n(ay - 2.2)}L3.6 ${n(ay - 1.6)}M${n(12 + br - 0.6)} ${n(ay)}L20.4 ${n(ay - 3.4)}M19 ${n(ay - 2.2)}L20.4 ${n(ay - 1.6)}`, fill: 'none', stroke: V('c4'), 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-k' }])
    // body with a soft depth lip
    out.push(F0(disc(12.3, by + 0.35, br), V('tint'), 'wm-k'))
    out.push(F0(disc(12, by, br), url(0), 'wm-k'))
    out.push(F0(disc(12.25, hy + 0.3, hr), V('tint'), 'wm-k'))
    out.push(F0(disc(12, hy, hr), url(0), 'wm-k'))
    // inlaid paisley-ish swirl on the lower ball
    out.push(F0(`M12.6 ${n(by + 2.6)}c-1.6 0-2.1-1.8-1-2.4c.9-.5 1.8.3 1.3 1c-.3.4-.8.2-.8-.1`, 'none', 'wm-k', { stroke: V('c2'), 'stroke-width': 0.5, 'stroke-linecap': 'round' }))
    out.push(F0(disc(12, by - 2, 0.55) + disc(13.6, by + 0.4, 0.4), V('c4'), 'wm-k'))
    // scarf in the second gradient colours
    scarf(V('c3'), 1, (x, y, s) => out.push(F0(`M${n(x - s * 0.6)} ${n(y + 2.6)}l${n(s * 2.3)} -.3`, 'none', 'wm-s', { stroke: V('c2'), 'stroke-width': 0.5 })))
    out.push(F0(disc(10.8, hy - 0.5, 0.48) + disc(13.2, hy - 0.5, 0.48), V('ink'), 'wm-k'))
    out.push(F0(`M12 ${n(hy + 0.25)}L14.8 ${n(hy + 0.9)}L12 ${n(hy + 1.15)}z`, V('accent'), 'wm-k'))
    out.push(['path', { d: `M10.7 ${n(hy + 1.9)}Q12 ${n(hy + 2.8)} 13.3 ${n(hy + 1.9)}`, fill: 'none', stroke: V('ink'), 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-k' }])
    // beanie
    out.push(F0(`M8.4 ${n(hy - 1.8)}Q8.4 ${n(hy - 6.4)} 12 ${n(hy - 6.4)}Q15.6 ${n(hy - 6.4)} 15.6 ${n(hy - 1.8)}z`, url(1), 'wm-a'))
    out.push(F0(`M8.1 ${n(hy - 1.2)}Q12 ${n(hy - 2.3)} 15.9 ${n(hy - 1.2)}V${n(hy - 2.7)}Q12 ${n(hy - 3.8)} 8.1 ${n(hy - 2.7)}z`, V('c3'), 'wm-a'))
    out.push(F0(disc(12, hy - 7, 1.2), V('c3'), 'wm-a'))
    out.push(F0(disc(12, hy - 7, 0.5), V('c2'), 'wm-a'))
    out.push(F0(`M10 ${n(hy - 4.6)}Q10.4 ${n(hy - 5.6)} 11.4 ${n(hy - 5.8)}`, 'none', 'wm-a', { stroke: V('shine'), 'stroke-width': 0.5, 'stroke-linecap': 'round', 'stroke-opacity': 0.6 }))
    out.push(F0(star4(4, 4.6, 1.2) + star4(20.4, 5.4, 0.85), V('edge'), 'wm-deco'))
  }

  return [['defs', {}, grads], ...out.filter(Boolean)]
}
