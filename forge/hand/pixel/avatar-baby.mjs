// forge/hand/pixel/avatar-baby.mjs: a hand-drawn 24-grid bust (round bald head with a topknot, two eyes, a smile, small shoulders)
// replacing the generated drawing, whose grey hat-like head had no readable smile.
// Key: T tone, S shade, K ink, H shine; lowercase = hair + shoulders (wm-a).
const MAP = [
  '........................',
  '...........kk...........',
  '..........kHkk..........',
  '..........kkkk..........',
  '........KKKKKKKK........',
  '.......KTTTTTTTSK.......',
  '......KTTTTTTTTTSK......',
  '......KTTTTTTTTTSK......',
  '......KTTTTTTTTTSK......',
  '......KTTTTTTTTTSK......',
  '......KTTKTTTTKTSK......',
  '......KTTKTTTTKTSK......',
  '......KTTTTTTTTTSK......',
  '.......KTTKTTKTSK.......',
  '........KTTKKTSK........',
  '.........KTTTSK.........',
  '..........KKKK..........',
  '........................',
  '........kkk..kkk........',
  '......kktttkkttskk......',
  '.....kttttttttttssk.....',
  '.....kkkkkkkkkkkkkk.....',
  '........................',
  '........................',
]
const PAINT = {
  T: { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' },
  S: { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' },
  K: {},
  X: { class: 'wm-s' },
  t: { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28', class: 'wm-a' },
  s: { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55', class: 'wm-a' },
  k: { class: 'wm-a' },
  H: { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' },
}

// one merged h/v path per tone: each horizontal run of a character becomes a one-pixel-tall rectangle
function runs(ch) {
  let d = ''
  MAP.forEach((row, j) => {
    for (let i = 0; i < row.length;) {
      if (row[i] !== ch) { i++; continue }
      let k = i
      while (k < row.length && row[k] === ch) k++
      d += `M${i} ${j}h${k - i}v1h${i - k}z`
      i = k
    }
  })
  return d
}

export default function render() {
  const out = []
  for (const ch of ['T', 'S', 'K', 'X', 't', 's', 'k', 'H']) {
    const d = runs(ch)
    if (d) out.push(['path', { d, ...PAINT[ch] }])
  }
  return out
}
