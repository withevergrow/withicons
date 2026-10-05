// Live icon: current weather — a condition glyph with the temperature written underneath.
// With the temperature on, the glyph is a compact drawing in the top band (y 2..12.25) and the number sits in the
// bottom band (cap 5, y 16.25..21.25). With it off, the glyph is drawn full size like its static siblings.
import { snap, polar } from './_layout.mjs'
import { cloud, sun, crescent, sparkle, firstFit } from './_parts-weather.mjs'
import { live } from './_font.mjs'

const CONDITIONS = ['sunny', 'partly', 'cloudy', 'rain', 'storm', 'snow', 'fog', 'night']
const UNITS = { degree: '°', celsius: '°C', fahrenheit: '°F', none: '' }

// distance from a point to a cloud's mass (three lobes + the slab under them); <= 0 inside
function cloudDist(c, x, y) {
  let d = Infinity
  for (const l of [c.L, c.R, c.T]) d = Math.min(d, Math.hypot(x - l.x, y - l.y) - l.r)
  const yb = c.L.y + c.L.r, top = Math.min(c.L.y, c.R.y)
  const dx = Math.max(c.L.x - x, 0, x - c.R.x), dy = Math.max(top - y, 0, y - yb)
  return Math.min(d, Math.hypot(dx, dy))
}

// the visible part of a sun that sits behind a cloud: an open arc + the rays that clear the cloud by `gap`
function sunBehind(c, cx, cy, r, rIn, rOut, gap, angles) {
  const ok = a => { const [x, y] = polar(cx, cy, r, a); return cloudDist(c, x, y) >= gap }
  // longest run of visible angles (1 degree steps), walking the circle once from a hidden angle
  let start = 0
  for (let a = 0; a < 360; a++) if (!ok(a)) { start = a; break }
  let best = null, run = null
  for (let i = 1; i <= 360; i++) {
    const a = start + i
    if (ok(a % 360)) { run = run ? { a0: run.a0, a1: a } : { a0: a, a1: a } }
    else if (run) { if (!best || run.a1 - run.a0 > best.a1 - best.a0) best = run; run = null }
  }
  if (run && (!best || run.a1 - run.a0 > best.a1 - best.a0)) best = run
  const paths = []
  if (best && best.a1 - best.a0 >= 30) {
    // drawn as two half-span arcs: with endpoints snapped to the grid, one arc near 180deg would flip or swell
    const am = (best.a0 + best.a1) / 2
    const [x0, y0] = polar(cx, cy, r, best.a0), [xm, ym] = polar(cx, cy, r, am), [x1, y1] = polar(cx, cy, r, best.a1)
    paths.push(`M${x0} ${y0} A${snap(r)} ${snap(r)} 0 0 1 ${xm} ${ym} A${snap(r)} ${snap(r)} 0 0 1 ${x1} ${y1}`)
  }
  const rays = []
  for (const a of angles) {
    const [x0, y0] = polar(cx, cy, rIn, a), [x1, y1] = polar(cx, cy, rOut, a)
    if (cloudDist(c, x0, y0) >= gap + 0.5 && cloudDist(c, x1, y1) >= gap + 0.5 && Math.min(x0, x1) >= 2 && Math.min(y0, y1) >= 2) rays.push(`M${x0} ${y0} L${x1} ${y1}`)
  }
  return { arc: paths, rays }
}

const streaks = (xs, y0, y1, slant) => xs.map(x => `M${snap(x)} ${snap(y0)} L${snap(x - (y1 - y0) * slant)} ${snap(y1)}`)
const dots = pts => pts.map(([x, y]) => `M${snap(x)} ${snap(y - 0.25)} V${snap(y + 0.25)}`)

// each glyph -> { k: [d], a: [d], fills: [d], cuts: [d] }
const COMPACT = {
  sunny() {
    const s = sun({ cx: 12, cy: 7.25, r: 2.75, rIn: 6.25, rOut: 7.25, angles: [45, 90, 135, 225, 270, 315], keep: (x0, y0, x1, y1) => Math.min(y0, y1) >= 2 && Math.max(y0, y1) <= 12.25 })
    return { k: [], a: [s.disc, ...s.rays], fills: [s.disc], cuts: [] }
  },
  partly() {
    const c = cloud({ cx: 14.5, yb: 12.25, h: 6.75 })
    // rays start 2.75u out from the arc (centrelines; 1u of white at line) so no stroke weight joins them to the sun,
    // and the arc keeps 2.5u from the cloud; no ray straight down (clock 180): it would reach the temperature band
    const s = sunBehind(c, 8.25, 8.25, 2.5, 5.25, 6.25, 2.5, [225, 270, 315, 0, 45])
    return { k: [c.d], a: [...s.arc, ...s.rays], fills: [c.fill], cuts: [] }
  },
  cloudy() {
    const c = cloud({ cx: 12, yb: 12.25, h: 10.25 })
    return { k: [c.d], a: [], fills: [c.fill], cuts: [] }
  },
  rain() {
    const c = cloud({ cx: 12, yb: 9, h: 7, open: true })
    const r = streaks([9.25, 13.75], 7.75, 12.25, 0.5)
    return { k: [c.d], a: r, fills: [c.fill], cuts: r }
  },
  storm() {
    const c = cloud({ cx: 12, yb: 9, h: 7, open: true })
    const b = ['M13.5 6.5 L11 9.75 H14 L12 12.25']
    return { k: [c.d], a: b, fills: [c.fill], cuts: b }
  },
  snow() {
    const c = cloud({ cx: 12, yb: 8.25, h: 6.25 })
    const d = dots([[8, 12], [12, 12], [16, 12]])
    return { k: [c.d], a: d, fills: [c.fill], cuts: [] }
  },
  fog() {
    const c = cloud({ cx: 12, yb: 8.25, h: 6, open: true })
    return { k: [c.d, 'M4.5 8.25 H19.5'], a: ['M3 12.25 H10.5', 'M14.5 12.25 H21'], fills: [c.fill], cuts: [] }
  },
  night() {
    const m = crescent(10.75, 7.25, 5, { a1: 96, a2: 354, k: 0.8 })
    return { k: [m], a: [sparkle(18, 4.25, 1.25), dots([[19, 10]])[0]], fills: [m], cuts: [] }
  },
}

const FULL = {
  sunny() {
    const s = sun({ cx: 12, cy: 12, r: 4.5, rIn: 8, rOut: 10 })
    return { k: [], a: [s.disc, ...s.rays], fills: [s.disc], cuts: [] }
  },
  partly() {
    const c = cloud({ cx: 13.5, yb: 20.5, h: 10.5 })
    // the static cloud-sun's sun (centre 9.5 9.5, r 3.25, rays 6.5..7.5): 3.25u between arc and rays, 2.75u to the cloud
    const s = sunBehind(c, 9.5, 9.5, 3.25, 6.5, 7.5, 2.75, [270, 315, 0, 45, 90, 225, 180])
    return { k: [c.d], a: [...s.arc, ...s.rays], fills: [c.fill], cuts: [] }
  },
  cloudy() {
    const c = cloud({ cx: 12, yb: 18.5, h: 12.75 })
    return { k: [c.d], a: [], fills: [c.fill], cuts: [] }
  },
  rain() {
    const c = cloud({ cx: 12, yb: 14, h: 10.5 })
    const r = streaks([8.5, 13, 17.5], 17.5, 21.5, 0.5)
    return { k: [c.d], a: r, fills: [c.fill], cuts: [] }
  },
  storm() {
    const c = cloud({ cx: 12, yb: 14, h: 10.5, open: true })
    const b = ['M13.5 9 L10 16.5 H14.5 L12 21.5']
    return { k: [c.d], a: b, fills: [c.fill], cuts: ['M13.5 9 L10 16.5 H14.5 L13.25 19'] }
  },
  snow() {
    const c = cloud({ cx: 12, yb: 14, h: 10.5 })
    return { k: [c.d], a: dots([[8, 17.5], [12, 17.5], [16, 17.5], [10, 21], [14, 21]]), fills: [c.fill], cuts: [] }
  },
  fog() {
    const c = cloud({ cx: 12, yb: 13.5, h: 10 })
    return { k: [c.d.replace(/ Z$/, ''), 'M3.5 13.5 H20.5'], a: ['M2.5 17.5 H14', 'M17.5 17.5 H21.5', 'M5.5 21.5 H18.5'], fills: [c.fill], cuts: [] }
  },
  night() {
    const m = crescent(11, 12.5, 8.5, { a1: 96, a2: 354, k: 0.79 })
    return { k: [m], a: [sparkle(18.5, 4.5, 1.5)], fills: [m], cuts: [] }
  },
}

export default live({
  name: 'weather', title: 'Weather now', category: 'weather',
  description: 'The current weather: a condition (sun, cloud, rain, storm, snow, fog or night) with the temperature written under it.',
  aliases: ['weather-now', 'current-weather', 'forecast', 'weather-temperature', 'weather-widget', 'conditions', 'live-weather'],
  tags: ['weather', 'forecast', 'temperature', 'live'],
  synonyms: ['sunny', 'partly cloudy', 'rainy', 'stormy', 'snowy', 'foggy', 'clear night', 'outside temperature', 'degrees', 'weather app', 'today weather', 'climate'],
  params: {
    condition: { type: 'enum', options: CONDITIONS, default: 'partly', label: 'Condition' },
    temperature: { type: 'int', min: -99, max: 199, default: 21, label: 'Temperature' },
    unit: { type: 'enum', options: Object.keys(UNITS), default: 'degree', label: 'Unit after the number' },
    showTemperature: { type: 'bool', default: true, label: 'Show the temperature' },
  },
  examples: [
    { condition: 'sunny', temperature: 31, unit: 'degree', showTemperature: true },
    { condition: 'partly', temperature: 21, unit: 'celsius', showTemperature: true },
    { condition: 'rain', temperature: 8, unit: 'degree', showTemperature: true },
    { condition: 'storm', temperature: 104, unit: 'fahrenheit', showTemperature: true },
    { condition: 'snow', temperature: -12, unit: 'degree', showTemperature: true },
    { condition: 'night', temperature: 0, unit: 'none', showTemperature: false },
  ],
  // what the icon writes: the unit letter, then the degree sign, give way before the number shrinks below cap 4.5
  shows: p => { if (!p.showTemperature) return ''; const n = String(p.temperature), u = UNITS[p.unit] ?? '°'; return [n + u, n + '°', n] },
  build({ condition = 'partly', temperature = 21, unit = 'degree', showTemperature = true }) {
    const cond = CONDITIONS.includes(condition) ? condition : 'partly'
    const n = String(Math.round(Number(temperature) || 0))
    const u = UNITS[unit] ?? '°'
    // longest first; the unit letter goes, then the degree sign, before the text shrinks below cap 4.5
    const t = showTemperature
      ? firstFit([n + u, u.length > 1 ? n + '°' : null, n], { x0: 3, y0: 16.25, x1: 21, y1: 21.25 }, { prefer: 'small', minCap: 4.5 })
      : null
    const g = (t ? COMPACT : FULL)[cond]()
    return {
      paths: [
        ...g.k.map(d => ({ d, plate: 'K' })),
        ...g.a.map(d => ({ d, plate: 'A' })),
        ...(t ? t.paths : []).map(d => ({ d, plate: 'A' })),
      ],
      fills: g.fills,
      cutouts: g.cuts,
    }
  },
})
