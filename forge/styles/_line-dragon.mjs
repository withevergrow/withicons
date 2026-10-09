// DRAGON HEAD, hand-drawn for the mono styles (line solid duo gloss engrave blueprint sketch), hooked via snowmanFor.
// Same proportions as the holiday dragon (_holiday-dragon.mjs), in ink: tall branching antlers, a wide brow narrowing
// into a long snout that widens to a big nose with nostrils, angry brows, cheek fur tufts, an open mouth with fangs,
// beard spikes as part of the jaw, whiskers running out level then curling up.
// Plates: K = head (+ tufts), A = antlers / whiskers / brows / eyes / nostrils, S = mouth + fangs / pearl (duo's accent).
// Each style adds a small touch of its own. Pure data: deterministic.
import { prepare } from './_prepare.mjs'

const f = v => String(Math.round(v * 100) / 100)
const circ = (x, y, r) => `M${f(x + r)} ${f(y)} A${f(r)} ${f(r)} 0 1 1 ${f(x - r)} ${f(y)} A${f(r)} ${f(r)} 0 1 1 ${f(x + r)} ${f(y)} Z`
const dot = (x, y) => `M${f(x - 0.12)} ${f(y)} H${f(x + 0.12)}`
const dots = pts => pts.map(([x, y]) => dot(x, y)).join(' ')
const cuts = (pts, r) => pts.map(([x, y]) => circ(x, y, r))
// mirror an absolute M/L/C path across x = 12, and draw both halves
const mir = d => d.replace(/([MLC])([^MLCZ]*)/g, (_, c, a) => c + a.trim().split(/[\s,]+/).map((v, i) => f(i % 2 ? +v : 24 - v)).join(' ') + ' ')
const both = d => d + ' ' + mir(d).trim()

// head: skull, snout, nose bulb, then the jaw notched into three beard spikes
const HEAD = 'M12 4.6 C16.6 4.6 18.8 6.8 18.6 9.7 C18.5 11.6 17.2 12.6 16.1 13.3 L16.4 15.6 C17.6 16.2 17.8 18 16.8 19 ' +
  'C16.3 19.5 15.7 19.8 15.1 19.9 L14.4 22.2 L13.1 20.4 L12 22.9 L10.9 20.4 L9.6 22.2 L8.9 19.9 ' +
  'C8.3 19.8 7.7 19.5 7.2 19 C6.2 18 6.4 16.2 7.6 15.6 L7.9 13.3 C6.8 12.6 5.5 11.6 5.4 9.7 C5.2 6.8 7.4 4.6 12 4.6 Z'
const ANTLERS = both('M9.6 5.2 C8.8 3.9 8.1 2.8 7.8 1.4 M8.4 3.6 C7.4 3.4 6.5 2.9 5.9 2')
const TUFTS = both('M5.6 10.6 C4.3 10.7 3.1 10.2 2.5 9.3 C3.2 9.3 3.7 9.1 4 8.8 C3.3 8.3 3 7.6 3 6.9')
const BROWS = both('M7.1 6.8 L10.8 8.9')
const EYES = [[9.5, 10.6], [14.5, 10.6]]
const WHISK = both('M7.4 16.5 C5.4 16.1 3.6 16.5 2.4 16.3 C1.2 16.1 1 14.7 2 14.3 C2.8 14 3.4 14.7 3 15.3')
const WHISK_STRAIGHT = both('M7.4 16.5 L2.4 16.3')
const NOSE = 'M8.6 15.9 C10.6 15.3 13.4 15.3 15.4 15.9'
const NOSTRILS = [[10.6, 17], [13.4, 17]]
const MOUTH = 'M9.2 18.5 C11 19.1 13 19.1 14.8 18.5'
const FANGS = both('M10.1 18.8 L10.4 19.7')
const PEARL = [12, 6.2]
const DOUBLE = both('M9.9 4.9 C9.2 3.8 8.6 2.9 8.3 1.7')

const OPTS = {
  line: { tufts: true, roundEyes: true },
  solid: { mouthK: true },
  duo: { tufts: true, pearl: true },
  gloss: { eyeR: 0.95 },
  engrave: { tufts: true, pearl: true },
  blueprint: { straight: true, marks: true },
  sketch: { tufts: true, roundEyes: true, double: true },
}

function make(style) {
  const o = OPTS[style]
  const paths = [
    { d: HEAD, plate: 'K' },
    { d: ANTLERS, plate: 'A' },
    { d: o.straight ? WHISK_STRAIGHT : WHISK, plate: 'A' },
    { d: BROWS, plate: 'A' },
    o.roundEyes ? { d: cuts(EYES, 0.75).join(' '), plate: 'A', solid: true } : { d: dots(EYES), plate: 'A' },
    { d: NOSE, plate: 'A' },
    { d: dots(NOSTRILS), plate: 'A' },
    o.mouthK ? null : { d: MOUTH + ' ' + FANGS, plate: 'S' },
  ].filter(Boolean)
  // solid: face details stay on the head plate (cut-outs only), so the jaw and beard never split off
  if (o.mouthK) paths.forEach(q => { if (q.d === NOSE || q.d === BROWS || q.d === dots(NOSTRILS) || q.d === dots(EYES)) q.plate = 'K' })
  const cutouts = [BROWS, NOSE, MOUTH, ...cuts(EYES, o.eyeR || 0.75), ...cuts(NOSTRILS, 0.55)]
  if (o.tufts) paths.push({ d: TUFTS, plate: 'K' })
  if (o.pearl) { paths.push({ d: circ(PEARL[0], PEARL[1], 0.7), plate: 'S' }); cutouts.push(circ(PEARL[0], PEARL[1], 0.8)) }
  if (o.double) paths.push({ d: DOUBLE, plate: 'A' })
  if (o.marks) paths.push({ d: circ(2.4, 16.3, 0.6) + ' ' + circ(21.6, 16.3, 0.6), plate: 'A' })
  const raw = { name: 'dragon-head', paths, fills: [HEAD], cutouts }
  const p = prepare(raw)
  p.paths.forEach((q, i) => { if (raw.paths[i].solid) q.solid = true })
  return p
}

const CACHE = {}
export function dragonFor(style, icon) {
  if (!icon || icon.name !== 'dragon-head' || icon.params || !OPTS[style]) return icon
  const own = CACHE[style] || (CACHE[style] = make(style))
  return { ...icon, paths: own.paths, fills: own.fills, cutouts: own.cutouts, lines: own.lines, fillSet: own.fillSet }
}
