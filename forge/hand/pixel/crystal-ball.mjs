// forge/hand/pixel/crystal-ball.mjs: a hand-drawn 24-grid crystal ball (round glass with a bold 4-point sparkle star and a shine arc,
// a distinct stepped pedestal with a rim and foot) replacing the generated drawing, which read as a dial.
// Key: T tone, S shade, K ink, H shine, X star (wm-s); lowercase = pedestal (wm-a).
const MAP = [
  '........................',
  '........................',
  '.........KKKKK..........',
  '.......KKTTTTSKK........',
  '......KHHTTTTTTSK.......',
  '.....KHTTTTXTTTTSK......',
  '.....KHTTTXXXTTTSK......',
  '....KTTTTTXXXTTTTSK.....',
  '....KTTTXXXXXXXTTSK.....',
  '....KTTXXXXXXXXXTSK.....',
  '....KTTTXXXXXXXTTSK.....',
  '....KSTTTTXXXTTTSSK.....',
  '.....KTTTTXXXTTTSK......',
  '.....KSTTTTXTTTSSK......',
  '......KSSTTTTSSSK.......',
  '.......KKSSSSSKK........',
  '.........KKKKK..........',
  '........kttttsk.........',
  '.......ktttttssk........',
  '......kkkkkkkkkkk.......',
  '....ktHttttttttttsk.....',
  '....kkkkkkkkkkkkkkk.....',
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
