// forge/hand/pixel/trash-2.mjs — a bin with its own lid and arched handle (moving part) over a tapered body with three thin vertical slats, so it no longer reads as a pause button.
// Legend: + body tone, = shade, # outline, o shine pixels, a lid ink, b lid tone, c lid shade (moving part).
const MAP = [
  '........................',
  '........................',
  '.........aaaaaaa........',
  '........a.......a.......',
  '........a.......a.......',
  '....aaaaaaaaaaaaaaaaa...',
  '...abbbbbbbbbbbbbbccca..',
  '....aaaaaaaaaaaaaaaaa...',
  '......#++++++++++=#.....',
  '......#oo++++++++=#.....',
  '......#o+#++#++#+=#.....',
  '......#++#++#++#+=#.....',
  '......#++#++#++#+=#.....',
  '......#++#++#++#+=#.....',
  '.......#+#++#++#=#......',
  '.......#+#++#++#=#......',
  '.......#+#++#++#=#......',
  '.......#+#++#++#=#......',
  '.......#+#++#++#=#......',
  '.......#++++++++=#......',
  '.......#=========#......',
  '........#########.......',
  '........................',
  '........................',
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }
const PAINT = { '+': TONE, '=': SHADE, '#': {}, o: SHINE, a: { class: 'wm-a' }, b: { ...TONE, class: 'wm-a' }, c: { ...SHADE, class: 'wm-a' } }
const ORDER = ['+', '=', '#', 'b', 'c', 'a', 'o']
// one merged h/v path per paint: each row's runs, stacked into rectangles while the run repeats on the next row
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
  return ORDER.map(ch => ['path', { d: pathOf(ch), ...PAINT[ch] }]).filter(n => n[1].d)
}
