// Live icon: a thermometer whose column rises to a level you choose, with an optional reading beside it.
// The tube is 6u wide (walls at +-3u) so the column line clears both walls in the line styles; in the filled
// styles the empty part of the tube is knocked out above the column, exactly like the static `thermometer`.
import { snap, circle } from './_layout.mjs'
import { live } from './_font.mjs'
import { fitLabel } from './_parts-labels.mjs'

const UNITS = { degree: '°', celsius: '°C', fahrenheit: '°F', none: '' }
// the tube: half-width W, bulb radius R, centre line x c. The classic tube (6u wide) keeps the column line clear of
// both walls; a three-character reading ("104", "-40") gets the family's slimmer static proportions so the
// reading keeps all of its digits at a legible size instead of disappearing.
const TUBES = [
  { c: 6.5, W: 3, R: 4.5, by: 17 },      // 1-2 character readings
  { c: 5.75, W: 2.25, R: 3.75, by: 17.5 }, // 3 characters: the reading gets x 10.75 .. 22
]
// the level that follows the reading on a household scale (-30..50 °C = -22..122 °F), so moving the reading
// moves the column; scale 'manual' uses the level param instead
const autoLevel = (v, unit) => unit === 'fahrenheit' ? (v + 22) / 144 : (v + 30) / 80

function tube({ c, W, R, by }, top) {
  const j = snap(by - Math.sqrt(R * R - W * W)), t = top + W
  return { d: `M${c + W} ${j} V${t} A${W} ${W} 0 0 0 ${c - W} ${t} V${j} A${R} ${R} 0 1 0 ${c + W} ${j} Z`, j, t }
}

// the reading top-right -> { T (tube), num, sub }. "°" rides on the number ("37°", in the slim tube if it needs the
// room; text next to the slim tube keeps 0.75u of white from it); °C / °F move to a second row under the number when they do not fit beside it. Only a 3-character reading
// with a bare "°" ("104°") cannot keep its degree sign: the digits win.
const row1 = (n, T) => ({ x0: snap(T.c + T.W + (T === TUBES[0] ? 3.25 : 2.5)), y0: 3.5, x1: 22, y1: 10 })
function reading(n, u) {
  const opt = { minCap: 4, maxCap: 5.5 }
  if (u === '°') for (const [T, min] of [[TUBES[0], 4.5], [TUBES[1], 4]]) {
    const t = n.length < 3 && fitLabel(n + u, row1(n, T), opt)
    if (t && t.cap >= min) return { T, num: t }
  }
  for (const T of n.length > 2 ? [TUBES[1]] : TUBES) {
    const box = row1(n, T), num = fitLabel(n, box, opt)
    if (!num) continue
    if (!u || u === '°') return { T, num }
    const sub = fitLabel(u, { x0: Math.max(box.x0, snap(T.c + T.R + 2.25)), y0: snap(num.box.y1 + 2.5), x1: 22, y1: snap(num.box.y1 + 7) }, { minCap: 4, maxCap: 4.5 })
    if (sub) return { T, num, sub }
  }
  return { T: TUBES[n.length > 2 ? 1 : 0], num: fitLabel(n, row1(n, TUBES[1]), opt) }
}

export default live({
  name: 'thermometer-level', title: 'Thermometer level', category: 'weather',
  description: 'A thermometer filled to the level you choose, with an optional reading such as 37° beside it.',
  aliases: ['temperature-level', 'temperature-gauge', 'thermometer-reading', 'temp-level', 'heat-level', 'fever-level', 'temperature-meter'],
  tags: ['weather', 'temperature', 'health', 'level', 'live'],
  synonyms: ['hot', 'cold', 'warm', 'degrees', 'celsius', 'fahrenheit', 'body temperature', 'fever', 'room temperature', 'thermostat', 'heating', 'cooling'],
  params: {
    level: { type: 'level', default: 0.65, label: 'Level' },
    value: { type: 'int', min: -99, max: 199, default: 37, label: 'Reading' },
    unit: { type: 'enum', options: Object.keys(UNITS), default: 'degree', label: 'Unit' },
    showValue: { type: 'bool', default: true, label: 'Show the reading' },
    scale: { type: 'enum', options: ['auto', 'manual'], default: 'auto', label: 'Level: follow the reading (auto) or use Level (manual)' },
  },
  examples: [
    { value: 37, unit: 'celsius', showValue: true, scale: 'auto' },
    { value: 99, unit: 'fahrenheit', showValue: true, scale: 'auto' },
    { value: -5, unit: 'degree', showValue: true, scale: 'auto' },
    { level: 0, value: 0, unit: 'none', showValue: false, scale: 'manual' },
    { level: 0.5, value: 20, unit: 'none', showValue: false, scale: 'manual' },
    { value: 104, unit: 'fahrenheit', showValue: true, scale: 'auto' },
  ],
  // what the icon writes (check-dynamic compares it with the drawn glyphs)
  // (a bare "°" gives way only when it cannot sit beside the digits at cap 4: "104", "99")
  shows: p => !p.showValue ? '' : p.unit === 'degree' ? [p.value + '°', String(p.value)] : String(p.value) + (UNITS[p.unit] ?? ''),
  build({ level = 0.65, value = 37, unit = 'degree', showValue = true, scale = 'auto' }) {
    const v = Math.round(Number(value) || 0)
    const lv = Math.max(0, Math.min(1, scale === 'manual' ? Number(level) || 0 : autoLevel(v, unit)))
    const n = String(v), u = UNITS[unit] ?? '°'
    let num = null, sub = null, T = TUBES[0]
    if (showValue) ({ T, num, sub } = reading(n, u))
    if (!num) T = { ...TUBES[0], c: 9 }
    const c = T.c, top = 2, by = T.by
    const t = tube(T, top)
    // column: from the bulb centre up to the level (just above the bulb when empty, the cap centre when full)
    const y0 = snap(by - T.R * 0.55, 0.25)
    const yl = snap(y0 - lv * (y0 - t.t), 0.25)
    const paths = [
      { d: t.d, plate: 'K' },
      { d: `M${c} ${by} V${yl}`, plate: 'A' },
      { d: circle(c, by, 1), plate: 'A' },
    ]
    const cutouts = []
    // filled styles: knock out the empty tube above the column (only when it is tall enough to read)
    const k = snap(T.W - 1.5), cTop = t.t, cBot = yl - k
    if (cBot - cTop >= 1.5) cutouts.push(`M${c - k} ${snap(cBot)} V${cTop} A${k} ${k} 0 0 1 ${c + k} ${cTop} V${snap(cBot)} A${k} ${k} 0 0 1 ${c - k} ${snap(cBot)} Z`)
    if (num) {
      paths.push(...num.paths.map(d => ({ d, plate: 'A' })))
      if (sub) paths.push(...sub.paths.map(d => ({ d, plate: 'A' })))
    } else {
      // scale ticks; the one nearest the level is the long one
      const ys = [4.5, 8.5, 12.5]
      const near = ys.reduce((b, y) => Math.abs(y - yl) < Math.abs(b - yl) ? y : b, ys[0])
      for (const y of ys) paths.push({ d: `M16 ${y} H${y === near ? 20 : 18}`, plate: 'A' })
    }
    return { paths, fills: [t.d], cutouts }
  },
})
