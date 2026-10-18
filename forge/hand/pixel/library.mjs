// forge/hand/pixel/library.mjs — three separate upright books of different heights, each with two spine bands (the right one, wm-a, is the one that sways) on a 2px shelf.
// One char per 1u cell on the 24 grid. Layers are painted back to front, one merged h/v path each.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }

const MAP = Array.from({ length: 24 }, () => Array(24).fill('.'))
// a 6-wide book: outline, 3 tone cells, 1 shade cell; one outlined band across the spine; ink/tone ch chosen per book
function book(x0, top, bands, ink, tone, shade) {
  for (let y = top; y <= 19; y++) for (let i = 0; i < 6; i++) {
    const edge = i === 0 || i === 5 || y === top || y === 19 || bands.includes(y)
    MAP[y][x0 + i] = edge ? ink : i === 4 ? shade : tone
  }
  MAP[top + 1][x0 + 1] = 'o'
}
book(2, 3, [6, 16], '#', '+', '=')
book(9, 8, [11, 16], '#', '+', '=')
book(16, 5, [8, 16], 'A', 'a', 'b')
for (let y = 20; y <= 21; y++) for (let x = 1; x <= 22; x++) MAP[y][x] = '#'
const ROWS = MAP.map(r => r.join(''))
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['a', TONE, 'wm-a'], ['b', SHADE, 'wm-a'], ['A', {}, 'wm-a'], ['o', SHINE]]

// each row's runs, stacked into rectangles while the same run repeats on the next row
function pathOf(ch) {
  const rects = [], open = new Map()
  for (let j = 0; j <= ROWS.length; j++) {
    const row = ROWS[j] || '', runs = new Set()
    for (let i = 0; i < 24; i++) if (row[i] === ch) { let k = i; while (row[k + 1] === ch) k++; runs.add(i + ':' + (k - i + 1)); i = k }
    for (const [key, r] of open) if (!runs.has(key)) { rects.push(r); open.delete(key) }
    for (const key of runs) { if (open.has(key)) open.get(key).h++; else { const [x, w] = key.split(':').map(Number); open.set(key, { x, y: j, w, h: 1 }) } }
  }
  rects.sort((p, q) => p.y - q.y || p.x - q.x)
  return rects.map(r => `M${r.x} ${r.y}h${r.w}v${r.h}h-${r.w}z`).join('')
}

export default function render() {
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    const d = pathOf(ch)
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
