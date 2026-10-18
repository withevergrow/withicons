// forge/hand/pixel/paintbrush.mjs: a 45-degree brush with a heavy shaded handle (the moving part, wm-a), a light metal ferrule band and a plump bristle head that ends in a drop of paint (c2).
// The three parts are rasterised from a thickness profile along the diagonal axis, outlined in ink on the silhouette, then filled.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' }
const PAINT = { fill: 'var(--with-pixel-c2, #2E86DE)' }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }

const R2 = Math.SQRT2
const U0 = 24 // the axis is the line of cell centres with x + y + 1 = U0
const HANDLE_END = -12.4
const FERRULE_START = -3.4
const HEAD_START = -0.2
const TIP = 11.8
const handleP = (s) => Math.min(2.1, 0.9 + (s - HANDLE_END) * 1.4)
const ferruleP = () => 2.9
const headP = (s) => (s < 2.6 ? 3.9 : 3.9 * (1 - (s - 2.6) / (TIP - 2.6)) ** 0.75)
const PAINT_FROM = 6

function build() {
  const grid = new Map()
  for (let y = 0; y < 24; y++) {
    for (let x = 0; x < 24; x++) {
      const s = (y - x) / R2
      const d = Math.abs(x + y + 1 - U0) / R2
      let part = -1
      if (s >= HANDLE_END && s < FERRULE_START && d <= handleP(s)) part = 0
      else if (s >= FERRULE_START && s < HEAD_START && d <= ferruleP()) part = 1
      else if (s >= HEAD_START && s <= TIP && d <= headP(s)) part = 2
      if (part >= 0) grid.set(`${x},${y}`, [part, s])
    }
  }
  return grid
}

const has = (list, x, y) => list.some(([px, py]) => px === x && py === y)

export default function render() {
  const grid = build()
  const partAt = (x, y) => (grid.has(`${x},${y}`) ? grid.get(`${x},${y}`)[0] : -1)
  // the ferrule only gets an ink rim on its sides: the handle's end and the head's top edge divide it
  const same = (x, y, k) => partAt(x, y) === k || (k === 1 && partAt(x, y) >= 0)
  const buckets = { ink: [], handleInk: [], handle: [], tone: [], paint: [], shine: [] }
  for (const [key, [k, s]] of grid) {
    const [x, y] = key.split(',').map(Number)
    const edge = !same(x - 1, y, k) || !same(x + 1, y, k) || !same(x, y - 1, k) || !same(x, y + 1, k)
    if (k === 0) (edge ? buckets.handleInk : buckets.handle).push([x, y])
    else if (edge || k === 1) buckets.ink.push([x, y])
    else if (k === 2 && s >= PAINT_FROM) buckets.paint.push([x, y])
    else buckets.tone.push([x, y])
  }
  // shine: a short streak down the lit (upper left) side of the bristles
  const bristle = buckets.tone.filter(([x, y]) => grid.get(`${x},${y}`)[0] === 2).sort((p, q) => p[1] - q[1] || p[0] - q[0])
  const lit = bristle.filter(([x, y]) => !has(buckets.tone, x - 1, y)).slice(0, 2)
  buckets.shine.push(...lit)
  buckets.tone = buckets.tone.filter(([x, y]) => !has(buckets.shine, x, y))
  const path = (list, attrs) => {
    const rows = {}
    for (const [x, y] of list) (rows[y] = rows[y] || []).push(x)
    let d = ''
    for (const y of Object.keys(rows).map(Number).sort((a, b) => a - b)) {
      const xs = rows[y].sort((a, b) => a - b)
      for (let i = 0; i < xs.length;) {
        let w = 1
        while (xs[i + w] === xs[i] + w) w++
        d += `M${xs[i]} ${y}h${w}v1h-${w}z`
        i += w
      }
    }
    return d ? ['path', { d, ...attrs }] : null
  }
  return [
    path(buckets.tone, TONE),
    path(buckets.paint, PAINT),
    path(buckets.shine, SHINE),
    path(buckets.handle, { ...SHADE, class: 'wm-a' }),
    path(buckets.ink, {}),
    path(buckets.handleInk, { class: 'wm-a' }),
  ].filter(Boolean)
}
