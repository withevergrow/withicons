// Live icon: a thermometer whose column rises to a level, with the reading set AT the level it reads
// (forge/DYNAMIC.md). The thermometer is the hero: a tall tube (centre x 6.5, half-width 3) on a 4.5u bulb with a
// solid core, the mercury a column from the bulb; the number sits level with where the column ends, so the value and
// the column read as one gesture (it rises and falls with the reading). Without a reading, three scale ticks stand
// beside the tube, the nearest one long. The empty part of the tube is knocked out above the column in the filled
// styles, like the static `thermometer`.
import { snap, circle } from './_layout.mjs'
import { live } from './_font.mjs'
import { fitLabel } from './_parts-labels.mjs'

const UNITS = { degree: '°', celsius: '°C', fahrenheit: '°F', none: '' }
const T = { c: 6.5, W: 3, R: 4.5, by: 17.25, top: 2.5 }
// the level that follows the reading on a household scale (-30..50 °C = -22..122 °F), so moving the reading
// moves the column; scale 'manual' uses the level param instead
const autoLevel = (v, unit) => unit === 'fahrenheit' ? (v + 22) / 144 : (v + 30) / 80

function tube({ c, W, R, by, top }) {
  const j = snap(by - Math.sqrt(R * R - W * W)), t = top + W
  return { d: `M${c + W} ${j} V${t} A${W} ${W} 0 0 0 ${c - W} ${t} V${j} A${R} ${R} 0 1 0 ${c + W} ${j} Z`, j, t }
}

// the reading block (number; a °C / °F unit on its own line under it when it does not fit beside it), its
// number's centreline box starting at y `top`
const X0 = 12.25, X1 = 22
function reading(n, u, top = 0) {
  const opt = { minCap: 4, maxCap: 6, align: 'left', valign: 'top' }, row = { x0: X0, y0: top, x1: X1, y1: top + 6 }
  if (u) { const t = fitLabel(n + u, row, opt); if (t && t.cap >= 4.5) return { num: t } }
  const num = fitLabel(n, row, opt)
  if (!num || !u || u === '°') return { num }
  const sub = fitLabel(u, { x0: X0, y0: num.box.y1 + 2.25, x1: X1, y1: num.box.y1 + 6.5 }, { minCap: 3.75, maxCap: 4, align: 'left', valign: 'top' })
  return { num, sub }
}

export default live({
  name: 'thermometer-level', title: 'Thermometer level', category: 'weather',
  description: 'A thermometer filled to the level you choose, its reading such as 37° set beside the top of the column.',
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
    const t = tube(T)
    // column: from the bulb up to the level (just above the bulb when empty, the cap centre when full)
    const y0 = snap(T.by - T.R * 0.55), yl = snap(y0 - lv * (y0 - t.t))
    const paths = [
      { d: t.d, plate: 'K' },
      { d: `M${T.c} ${T.by} V${yl}`, plate: 'A' },
      { d: circle(T.c, T.by, 1.75), plate: 'A', id: 'solid:bulb' },
    ]
    const cutouts = []
    // filled styles: knock out the empty tube above the column (only when it is tall enough to read)
    const k = snap(T.W - 1.5), cBot = yl - k
    if (cBot - t.t >= 1.5) cutouts.push(`M${T.c - k} ${snap(cBot)} V${t.t} A${k} ${k} 0 0 1 ${T.c + k} ${t.t} V${snap(cBot)} A${k} ${k} 0 0 1 ${T.c - k} ${snap(cBot)} Z`)
    let r = showValue ? reading(n, u) : null
    if (r && r.num) {
      // the block centred on the level, kept on the canvas: laid out once to measure, then again in place
      const h = (r.sub || r.num).box.y1 - r.num.box.y0
      const cy = Math.max(2.25 + h / 2, Math.min(21.75 - h / 2, yl))
      const placed = reading(n, u, snap(cy - h / 2))
      if (placed && placed.num) r = placed
      paths.push(...[...r.num.paths, ...(r.sub ? r.sub.paths : [])].map(d => ({ d, plate: 'A' })))
    } else {
      const ys = [5.5, 9, 12.5]
      const near = ys.reduce((b, y) => Math.abs(y - yl) < Math.abs(b - yl) ? y : b, ys[0])
      for (const y of ys) paths.push({ d: `M${T.c + T.W + 2} ${y} H${y === near ? T.c + T.W + 6 : T.c + T.W + 4}`, plate: 'A' })
    }
    return { paths, fills: [t.d], cutouts }
  },
})
