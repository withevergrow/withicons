// forge/hand/pixel/lightbulb.mjs — round pixel bulb with a glowing Y filament (wm-a), a tapered neck and a banded screw base, top-left shine.
// One char per 1u cell on the 24 grid. Layers are painted back to front, one merged h/v path each.
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }
const MAP = [
  '........................', // 0
  '........................', // 1
  '........########........', // 2
  '......##++++++++##......', // 3
  '.....#+oo+++++++++#.....', // 4
  '.....#+o++++++++++#.....', // 5
  '.....#++++++++++++#.....', // 6
  '.....#+++++++++++=#.....', // 7
  '.....#+++a++++a++=#.....', // 8
  '.....#++++a++a+++=#.....', // 9
  '.....#+++++aa++++=#.....', // 10
  '.....#+++++aa+++==#.....', // 11
  '.....#+++++aa+++==#.....', // 12
  '......##+++aa+==##......', // 13
  '........#++aa+=#........', // 14
  '........#++aa+=#........', // 15
  '........########........', // 16
  '........#+++++=#........', // 17
  '........########........', // 18
  '.........#+++=#.........', // 19
  '.........######.........', // 20
  '..........####..........', // 21
  '........................', // 22
  '........................', // 23
]
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['a', {}, 'wm-a'], ['o', SHINE]]

// each row's runs, stacked into rectangles while the same run repeats on the next row
function pathOf(ch) {
  const rects = [], open = new Map()
  for (let j = 0; j <= MAP.length; j++) {
    const row = MAP[j] || '', runs = new Set()
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
