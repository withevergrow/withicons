// forge/hand/pixel/candy-bucket.mjs: a hand-drawn 24-grid sprite (bold two-pixel rim, tapered bucket, a thin
// symmetric arched handle pivoting on both rim ends, a big wrapped candy and a lollipop poking out of the top).
// Key: T tone, S shade, K ink, H shine; lowercase = the treats and handle (wm-a).
const MAP = [
  '........................',
  '........................',
  '........kkkkkkkk........',
  '......kk........kk......',
  '.....k............k.....',
  '....k.........kkk..k....',
  '....k........khttk.k....',
  '...k.........kttsk..k...',
  '...k.kkkkkkk.ktssk..k...',
  '...k.skhtsks..kkk...k...',
  '...k.sktssks...k....k...',
  '...k.kkkkkkk...k....k...',
  '...KKKKKKKKKKKKKKKKKK...',
  '..KHTTTTTTTTTTTTTTTTTK..',
  '..KTTSSSSSSSSSSSSSSSSK..',
  '...KKKKKKKKKKKKKKKKKK...',
  '....KHTTTTTTTTTTTTSK....',
  '....KHTTTTTTTTTTTSSK....',
  '.....KTTTTTTTTTTSSK.....',
  '.....KTTTTTTTTTSSSK.....',
  '......KTTTTSSSSSSK......',
  '.......KKKKKKKKKK.......',
  '........................',
  '........................',
]
const PAINT = {
  T: { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.28' },
  S: { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': '0.55' },
  K: {},
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
  for (const ch of ['T', 'S', 'K', 't', 's', 'k', 'H']) {
    const d = runs(ch)
    if (d) out.push(['path', { d, ...PAINT[ch] }])
  }
  return out
}
