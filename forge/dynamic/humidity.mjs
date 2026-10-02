// Live icon: relative humidity — a drop with the percentage written inside, or filled to that level.
// The drop is the static `droplet` grown to the full keyline (tip 2, body r 7.75 centred 12,14.25) so two digits
// fit at cap 5 inside the round body. "100" cannot fit legibly, so 100% shows a full drop instead of tiny text.
import { snap } from './_layout.mjs'
import { fitText, asCutouts, live } from './_font.mjs'
import { drop } from './_parts-weather.mjs'

const CX = 12, TIP = 2, CY = 14.25, R = 7.75

// point on the drop outline (centreline) at height y, right half: x offset from the axis
function halfWidth(y, r = R, tip = TIP) {
  if (y >= CY) return Math.sqrt(Math.max(0, r * r - (y - CY) ** 2))
  // the taper: sample the cubic from tip to (CX + r, CY)
  const H = CY - tip, p0 = [0, tip], p1 = [0.357 * r, tip + 0.29 * H], p2 = [r, CY - 0.375 * H], p3 = [r, CY]
  let best = 0, bd = Infinity
  for (let i = 0; i <= 64; i++) {
    const t = i / 64, u = 1 - t
    const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0]
    const yy = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
    if (Math.abs(yy - y) < bd) { bd = Math.abs(yy - y); best = x }
  }
  return best
}

export default live({
  name: 'humidity', title: 'Humidity', category: 'weather',
  description: 'Relative humidity as a water drop with the percentage inside, or a drop filled to that level.',
  aliases: ['humidity-percent', 'relative-humidity', 'humidity-level', 'moisture-level', 'dew-point', 'water-level-drop', 'rh'],
  tags: ['weather', 'water', 'humidity', 'level', 'live'],
  synonyms: ['moisture', 'damp', 'humid', 'muggy', 'dry', 'water drop', 'percent', 'hygrometer', 'indoor climate', 'air quality'],
  params: {
    humidity: { type: 'int', min: 0, max: 100, default: 64, label: 'Humidity (%)' },
    display: { type: 'enum', options: ['number', 'level'], default: 'number', label: 'Show as' },
  },
  examples: [
    { humidity: 64, display: 'number' },
    { humidity: 8, display: 'number' },
    { humidity: 100, display: 'number' },
    { humidity: 45, display: 'level' },
    { humidity: 0, display: 'level' },
    { humidity: 88, display: 'number' },
  ],
  // what the icon writes: the number, except 100 (a full drop) and the level display
  shows: p => (p.display === 'number' && p.humidity < 100 ? String(p.humidity) : ''),
  build({ humidity = 64, display = 'number' }) {
    const h = Math.max(0, Math.min(100, Math.round(Number(humidity) || 0)))
    const body = drop(CX, TIP, CY, R)
    const paths = [{ d: body, plate: 'K' }], cutouts = []
    // two digits at cap 5 sit low in the round body; the box keeps every corner ~3.5u inside the wall
    const t = display === 'number' ? fitText(String(h), { x0: 7.25, y0: 12.5, x1: 16.75, y1: 17.5 }, { prefer: 'small', maxCap: 5, minCap: 4.5 }) : null
    if (t) {
      paths.push(...t.paths.map(d => ({ d, plate: 'A' })))
      cutouts.push(...asCutouts(t.paths))
    } else {
      // water level: a gentle wave from wall to wall at the level's height (the drop's inner height 5..19.5)
      const lv = h / 100, yTop = 8.5, yBot = 19.5
      const y = snap(yBot - lv * (yBot - yTop))
      if (lv > 0) {
        const hw = Math.max(0, halfWidth(y) - 2.75)
        if (hw >= 2) {
          const x0 = snap(CX - hw), x1 = snap(CX + hw), q = snap((x1 - x0) / 4), a = hw > 3.5 ? 0.75 : 0.5
          const wave = `M${x0} ${y} C${snap(x0 + q)} ${snap(y - a)} ${snap(x0 + q)} ${snap(y - a)} ${snap(CX)} ${y} S${snap(x1 - q)} ${snap(y + a)} ${x1} ${y}`
          paths.push({ d: wave, plate: 'A' })
        }
      }
      // filled styles: knock out the dry part above the water (polygon traced 1.75u inside the wall)
      if (lv < 0.97) {
        const pts = [], yCut = Math.min(snap(y - 1), yBot)
        const steps = 18, yS = TIP + 4.5
        if (yCut - yS >= 1.5) {
          for (let i = 0; i <= steps; i++) { const yy = yS + (yCut - yS) * i / steps; pts.push([CX + Math.max(0, halfWidth(yy) - 1.75), yy]) }
          const right = pts.map(([x, yy]) => `${snap(x)} ${snap(yy)}`)
          const left = pts.slice().reverse().map(([x, yy]) => `${snap(2 * CX - x)} ${snap(yy)}`)
          const poly = [...right, ...left].filter((p, i, a) => i === 0 || p !== a[i - 1])
          cutouts.push(`M${poly.join(' L')} Z`)
        }
      }
    }
    return { paths, fills: [body], cutouts }
  },
})
