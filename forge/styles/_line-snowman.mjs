// SNOWMAN, hand-drawn per style for the Essentials/Artistic mono styles (line solid duo gloss engrave blueprint sketch).
// forge/icons/snowman.json stays the base everywhere else; each of these styles swaps in its own skeleton here, so each
// draws its own snowman (hat, scarf, arms, details) and the style's renderer turns it into that style as usual.
// Plates: K = body, A = moving parts (hat, arms, face, buttons), S = the scarf (duo's accent detail).
// Pure data + arithmetic: deterministic.
import { prepare } from './_prepare.mjs'
import { dragonFor } from './_line-dragon.mjs'

const f = v => String(Math.round(v * 100) / 100)
const circ = (x, y, r) => `M${f(x + r)} ${f(y)} A${f(r)} ${f(r)} 0 1 1 ${f(x - r)} ${f(y)} A${f(r)} ${f(r)} 0 1 1 ${f(x + r)} ${f(y)} Z`
const dot = (x, y) => `M${f(x - 0.12)} ${f(y)} H${f(x + 0.12)}`
const dots = pts => pts.map(([x, y]) => dot(x, y)).join(' ')
const dotCuts = (pts, r = 0.6) => pts.map(([x, y]) => circ(x, y, r))

// where two stacked circles (upper a, lower b, same x) cross: [y, half-width]
function meet(cx, ay, ar, by, br) {
  const y = (ar * ar - br * br - ay * ay + by * by) / (2 * (by - ay))
  return [y, Math.sqrt(Math.max(0, ar * ar - (y - ay) ** 2))]
}
// outline of stacked balls [[cy, r], ...] top to bottom (x = 12); cap = y where a hat cuts the top ball (open path)
function balls(list, cap) {
  const cx = 12
  const J = list.slice(1).map((b, i) => meet(cx, list[i][0], list[i][1], b[0], b[1]))
  const [y0, r0] = list[0]
  let d
  if (cap != null) {
    const w = Math.sqrt(r0 * r0 - (cap - y0) ** 2)
    d = `M${f(cx - w)} ${f(cap)}`
  } else d = `M${f(cx - r0)} ${f(y0)}`
  // left side down
  list.forEach(([, r], i) => {
    if (i < J.length) {
      const [y, w] = J[i]
      d += ` A${f(r)} ${f(r)} 0 0 0 ${f(cx - w)} ${f(y)}`
    }
  })
  // bottom ball all the way round to the right join
  const [yl, rl] = list[list.length - 1]
  const last = J.length ? J[J.length - 1] : null
  if (last) d += ` A${f(rl)} ${f(rl)} 0 1 0 ${f(cx + last[1])} ${f(last[0])}`
  // right side up
  for (let i = J.length - 1; i >= 0; i--) {
    const r = list[i][1]
    const next = i > 0 ? J[i - 1] : null
    if (next) d += ` A${f(r)} ${f(r)} 0 0 0 ${f(cx + next[1])} ${f(next[0])}`
    else if (cap != null) { const w = Math.sqrt(r0 * r0 - (cap - y0) ** 2); d += ` A${f(r)} ${f(r)} 0 0 0 ${f(cx + w)} ${f(cap)}` }
    else d += ` A${f(r)} ${f(r)} 0 1 0 ${f(cx - r0)} ${f(y0)}`
  }
  if (!J.length) d = circ(cx, yl, rl)
  return d
}
const closed = d => d.endsWith('Z') ? d : d + ' Z'

const base = raw => ({ name: 'snowman', category: 'christmas', ...raw })

// shared proportions: a big head (the face must read at 24px under a 1.75 stroke) on a wider body ending at y 21.5
const HEAD = [8.25, 3.75], BODY = [16.5, 5]
const EYES = [[10.6, 7.6], [13.4, 7.6]], NOSE = 'M12 9.4 L13.75 9.9', NOSE_CUT = 'M12 9.4 L13.6 9.85'
const SCARF = 'M9 11.4 C11 12.6 13 12.6 15 11.4'

// SOLID: bold classic. Upright top hat with a band, one arm waving and one lowered, three buttons.
function solid() {
  const body = balls([HEAD, BODY], 5.75)
  return base({
    paths: [
      { d: body, plate: 'K' },
      { d: 'M7.5 5.75 H16.5 M9.75 5.75 V2 H14.25 V5.75', plate: 'K' },
      { d: dots(EYES), plate: 'K' },
      { d: NOSE, plate: 'K' },
      { d: SCARF, plate: 'K' },
      { d: 'M7.25 14.25 L4 10.5', plate: 'K' },
      { d: 'M16.9 16 L20.5 17.25', plate: 'K' },
      { d: dots([[12, 14.75], [12, 17], [12, 19.25]]), plate: 'K' },
    ],
    fills: [closed(body), 'M7.5 6.5 V5 H9.75 V2 H14.25 V5 H16.5 V6.5 Z'],
    cutouts: ['M9.75 4.25 H14.25', SCARF, NOSE_CUT,
      ...dotCuts(EYES, 0.65), ...dotCuts([[12, 14.75], [12, 17], [12, 19.25]], 0.65)],
  })
}

// ENGRAVE: Victorian. A tall stovepipe hat with a hatband and a curled brim, a scarf with a long end, a long carrot,
// forked twig arms, three coal buttons.
function engrave() {
  const body = balls([HEAD, BODY], 6)
  const crown = 'M9.6 6 L10 1.75 H14 L14.4 6'
  return base({
    paths: [
      { d: body, plate: 'K' },
      { d: 'M7.5 5.6 C10 6.4 14 6.4 16.5 5.6', plate: 'A' },
      { d: crown, plate: 'A' },
      { d: 'M9.8 4.25 H14.2', plate: 'A' },
      { d: dots(EYES), plate: 'A' },
      { d: 'M12 9.4 L15 10.1', plate: 'A' },
      { d: SCARF + ' M14 12.1 L15 15.5', plate: 'S' },
      { d: 'M7.25 15 L3.5 13.5 M5.25 14.25 L4.5 12.25', plate: 'A' },
      { d: 'M16.75 15 L20.5 13.5 M18.75 14.25 L19.5 12.25', plate: 'A' },
      { d: dots([[12, 15], [12, 17.25], [12, 19.5]]), plate: 'A' },
    ],
    fills: [closed(body), crown + ' Z'],
    cutouts: ['M9.8 4.25 H14.2', SCARF, 'M12 9.4 L14.8 10.05', ...dotCuts(EYES, 0.55), ...dotCuts([[12, 15], [12, 17.25], [12, 19.5]], 0.55)],
  })
}

// BLUEPRINT: drafted, not drawn. Two exact snowballs, a rectangular top hat, straight stick arms and a triangular carrot.
function blueprint() {
  const body = balls([HEAD, BODY], 5.75)
  return base({
    paths: [
      { d: body, plate: 'K' },
      { d: 'M8 5.75 H16', plate: 'A' },
      { d: 'M9.75 5.75 V2 H14.25 V5.75', plate: 'A' },
      { d: dots(EYES), plate: 'A' },
      { d: 'M12 9.4 L14.75 10', plate: 'A' },
      { d: 'M7.6 14.25 L3 11.5 M16.4 14.25 L21 11.5', plate: 'A' },
      { d: dots([[12, 15], [12, 18]]), plate: 'A' },
    ],
    fills: [closed(body), 'M9.75 5.75 V2 H14.25 V5.75 Z'],
    cutouts: ['M8.25 5.75 H15.75', ...dotCuts([...EYES, [12, 15], [12, 18]], 0.5)],
  })
}

// LINE: airy. A small beanie (clear cuff, pompom) above an open face (dot eyes, short carrot), a scarf with a hanging
// end at the neck, thin Y twig arms well clear of the body, two buttons.
function line() {
  const body = balls([[8, 4], [16.5, 5]], 5.25)
  const hat = 'M9.6 5.25 C9.6 3 14.4 3 14.4 5.25'
  const scarf = 'M9 11.6 C11 12.6 13 12.6 15 11.6'
  return base({
    paths: [
      { d: body, plate: 'K' },
      { d: hat, plate: 'A' },
      { d: 'M9.1 5.25 H14.9', plate: 'A' },
      { d: dot(12, 2.5), plate: 'A' },
      { d: circ(10.4, 7.2, 0.7) + ' ' + circ(13.6, 7.2, 0.7), plate: 'A', solid: true },
      { d: 'M12.1 9.5 L14.6 10', plate: 'A' },
      { d: scarf + ' M13.9 12.3 L14.4 14.5', plate: 'S' },
      { d: 'M7.4 15 L3.25 12.25 M4.9 13.3 L4.5 11', plate: 'A' },
      { d: 'M16.6 15 L20.75 12.25 M19.1 13.3 L19.5 11', plate: 'A' },
      { d: dots([[12, 16], [12, 19]]), plate: 'A' },
    ],
    fills: [closed(body), hat + ' Z', circ(12, 2.5, 0.85)],
    cutouts: ['M9.25 5.25 H14.75', scarf, 'M12.1 9.5 L14.4 9.95', ...dotCuts([[10.4, 7.2], [13.6, 7.2]], 0.7), ...dotCuts([[12, 16], [12, 19]], 0.55)],
  })
}

// DUO: festive. A Santa hat flopping to the side, sitting on its fur band clear of the face, a pompom, twig arms, a scarf
// with a hanging tail (the accent), a snow line underfoot.
function duo() {
  const body = balls([[10, 3], [17, 4.5]])
  const hat = 'M9.75 5.5 C10 3.5 11.75 2.75 14 3.05 C15.6 3.25 16.75 4.15 17.25 5.25'
  return base({
    paths: [
      { d: body, plate: 'K' },
      { d: 'M3.5 21.5 H20.5', plate: 'K' },
      { d: hat, plate: 'A' },
      { d: 'M8.75 5.5 H15.25', plate: 'A' },
      { d: dot(17.6, 6.15), plate: 'A' },
      { d: dots([[10.75, 9.6], [13.25, 9.6]]), plate: 'A' },
      { d: 'M12 10.9 L13.4 11.25', plate: 'A' },
      { d: 'M9.5 13 C11 13.8 13 13.8 14.5 13 M10.25 13.5 L9.75 15.5', plate: 'S' },
      { d: 'M7.6 16 L3.75 13.5 M5.25 14.5 L5 12.25', plate: 'A' },
      { d: 'M16.4 16 L20.25 13.5 M18.75 14.5 L19 12.25', plate: 'A' },
      { d: dots([[12, 17], [12, 19.5]]), plate: 'A' },
    ],
    fills: [closed(body), hat + ' L15.25 5.25 L15.25 5.5 H8.75 Z'],
    cutouts: ['M9.5 13 C11 13.8 13 13.8 14.5 13', 'M12 10.9 L13.3 11.2', ...dotCuts([[10.75, 9.6], [13.25, 9.6], [12, 17], [12, 19.5]], 0.55)],
  })
}

// GLOSS: chubby and round. A top hat (brim + crown with a cut band) standing clear of the head, cut-out dot eyes and
// carrot, no scarf (gloss turns a neck groove into a grin), straight twig arms, two buttons.
function gloss() {
  const body = balls([[9, 3.5], [16.75, 4.75]], 6.75)
  const hat = 'M7.5 6 V5 H9.5 V2 H14.5 V5 H16.5 V6 Z'
  return base({
    paths: [
      { d: body, plate: 'K' },
      { d: hat, plate: 'A' },
      { d: dots([[10.6, 8.75], [13.4, 8.75]]), plate: 'A' },
      { d: 'M12 10.25 L13.75 10.6', plate: 'A' },
      { d: 'M7.4 15 L3.5 12.5', plate: 'A' },
      { d: 'M16.6 15 L20.5 12.5', plate: 'A' },
      { d: dots([[12, 16], [12, 18.75]]), plate: 'A' },
    ],
    fills: [closed(body), hat],
    cutouts: ['M9.5 4 H14.5', 'M12 10.25 L13.6 10.55', ...dotCuts([[10.6, 8.75], [13.4, 8.75]], 0.6), ...dotCuts([[12, 16], [12, 18.75]], 0.6)],
  })
}

// SKETCH: playful. A tilted bucket for a hat, dot eyes and a carrot, a scarf with a short end, one twig arm waving.
function sketch() {
  const body = balls([[8.75, 3.75], [16.75, 4.75]], 6.1)
  const hat = 'M9 6 L15 5.1 L14 2.1 L10.25 2.6 Z'
  const scarf = 'M9.25 12 C11 12.9 13 12.9 14.75 12'
  return base({
    paths: [
      { d: body, plate: 'K' },
      { d: hat, plate: 'A' },
      { d: dots([[10.75, 8.4], [13.25, 8.4]]), plate: 'A' },
      { d: 'M12 9.9 L13.75 10.35', plate: 'A' },
      { d: scarf + ' M13.75 12.6 L14.5 14.75', plate: 'S' },
      { d: 'M7.5 14.75 L3.75 11.25', plate: 'A' },
      { d: 'M16.5 15.5 L20.5 14', plate: 'A' },
      { d: dots([[12, 16], [12, 19]]), plate: 'A' },
    ],
    fills: [closed(body), hat],
    cutouts: [scarf, 'M12 9.9 L13.6 10.3', ...dotCuts([[10.75, 8.4], [13.25, 8.4], [12, 16], [12, 19]], 0.55)],
  })
}

const MAKERS = { line, solid, duo, gloss, engrave, blueprint, sketch }
const CACHE = {}

// line keeps the eyes as filled dots: a path flagged solid is painted, not stroked
function make(style) {
  const raw = MAKERS[style](), p = prepare(raw)
  p.paths.forEach((q, i) => { if (raw.paths[i].solid) q.solid = true })
  return p
}

// The style's own snowman skeleton (prepared), or the icon unchanged for any other icon / live icon.
export function snowmanFor(style, icon) {
  if (icon && icon.name === 'dragon-head' && MAKERS[style]) return dragonFor(style, icon)
  if (!icon || icon.name !== 'snowman' || icon.params || !MAKERS[style]) return icon
  const own = CACHE[style] || (CACHE[style] = make(style))
  return { ...icon, paths: own.paths, fills: own.fills, cutouts: own.cutouts, lines: own.lines, fillSet: own.fillSet }
}
