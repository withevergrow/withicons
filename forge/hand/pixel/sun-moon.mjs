// forge/hand/pixel/sun-moon.mjs — a pixel disc split day/night: the lit sun half on the left with five 2px ray stubs,
// a solid ink crescent on the right; replaces the generated drawing, whose halves read as one grey blob.
const MAP = [
  '........................',
  '........................',
  '............dd..........',
  '....dd......dd..........',
  '.....dd.....dd..........',
  '......dd................',
  '............XXXX........',
  '..........XXXX####......',
  '.........XooXXX####.....',
  '.........XoXXXX####.....',
  '........XXXXXXXX####....',
  '..dddd..XXXXXXXX####....',
  '..dddd..XXXXXXXX####....',
  '........XXXXXXXX####....',
  '.........XXXXXX####.....',
  '.........XXXXXX####.....',
  '..........XXXX####......',
  '............XXXX........',
  '......dd................',
  '.....dd.....dd..........',
  '....dd......dd..........',
  '............dd..........',
  '........................',
  '........................',
]
export default function render() { return paint(MAP) }

// ---- sprite map -> merged h/v paths (one per tone and part) ----
// X silhouette (outline where it meets paper or another part, body tone inside, shade on the inner bottom-right rim)
// Y silhouette of the A part; # ink; a ink (A part); s ink (S part); d ink (deco); + tone; = shade; o shine; . paper
const PART = { X: 'k', '#': 'k', '+': 'k', '=': 'k', o: 'k', Y: 'a', a: 'a', s: 's', d: 'd' }
const CLS = { k: null, a: 'wm-a', s: 'wm-s', d: 'wm-deco' }
function paint(map) {
  if (map.length !== 24 || map.some(r => r.length !== 24)) throw new Error('map must be 24x24')
  const at = (i, j) => (j < 0 || j > 23 || i < 0 || i > 23) ? '.' : map[j][i]
  const out = map.map(() => Array(24).fill(null))
  const edge = (i, j) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([di, dj]) => {
    const c = at(i + di, j + dj)
    return c === '.' || PART[c] !== PART[at(i, j)]
  })
  for (let j = 0; j < 24; j++) for (let i = 0; i < 24; i++) {
    const c = at(i, j)
    if (c === '.') continue
    const p = PART[c]
    if (c === 'X' || c === 'Y') out[j][i] = [edge(i, j) ? 'ink' : 'auto', p]
    else if (c === '+') out[j][i] = ['tone', p]
    else if (c === '=') out[j][i] = ['shade', p]
    else if (c === 'o') out[j][i] = ['shine', p]
    else out[j][i] = ['ink', p]
  }
  // auto body cells: shade where the outline is right of or below them, tone elsewhere
  const rim = (i, j) => { const c = at(i, j); return (c === 'X' || c === 'Y') && out[j][i][0] === 'ink' }
  for (let j = 0; j < 24; j++) for (let i = 0; i < 24; i++) {
    const o = out[j][i]
    if (o && o[0] === 'auto') o[0] = rim(i + 1, j) || rim(i, j + 1) ? 'shade' : 'tone'
  }
  const FILL = {
    tone: { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' },
    shade: { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' },
    ink: {},
    shine: { fill: 'var(--with-pixel-shine, #FFFFFF)' },
  }
  const nodes = []
  for (const t of ['tone', 'shade', 'ink', 'shine']) for (const p of ['k', 'a', 's', 'd']) {
    let d = ''
    for (let j = 0; j < 24; j++) {
      let i = 0
      while (i < 24) {
        const o = out[j][i]
        if (!o || o[0] !== t || o[1] !== p) { i++; continue }
        let k = i
        while (k < 24 && out[j][k] && out[j][k][0] === t && out[j][k][1] === p) k++
        d += `M${i} ${j}h${k - i}v1h${i - k}z`
        i = k
      }
    }
    if (!d) continue
    const cls = t === 'shine' ? 'wm-shine' : CLS[p]
    nodes.push(['path', { d, ...FILL[t], ...(cls ? { class: cls } : {}) }])
  }
  return nodes
}
