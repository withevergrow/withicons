// PIXEL hand-drawn snowman sprite (forge/icons/snowman.json stays the base; this replaces only Pixel's drawing).
// A 15x15 sprite on Pixel's grid (1.5u cells, cell 7 is the icon centre): a coal top hat with a red band and a
// shine pixel, a white head and body with light-blue shading bottom-right, coal eyes, a carrot nose pointing right,
// a red scarf with a hanging tail, three coal buttons and forked twig arms. The outline is currentColor (ink).
// Roles: body --with-pixel-fill (c1), shading --with-pixel-tint, hat band --with-pixel-c2, scarf --with-pixel-c3,
// nose --with-pixel-accent, twigs --with-pixel-shadow, coal --with-pixel-ink, shine --with-pixel-shine.
const SPRITE = [
  '.....KKKKK.....',
  '.....KHKKK.....',
  '.....BBBBB.....',
  '...KKKKKKKKK...',
  '....OWWWWWO....',
  '....OWKWKWO....',
  '....OWWNNNNN...',
  '....OWWWSSO....',
  'T..RRRRRRRRR..T',
  'T.OWWWWKWRRWO.T',
  '.TOWWWWWWRRSOT.',
  '..OWWWWKWWWSO..',
  '..OWWWWWWWSSO..',
  '..OSWWWKWSSSO..',
  '...OOOOOOOOO...',
]
const PAINT = {
  O: { cls: null },
  W: { fill: 'var(--with-pixel-fill, #FFFFFF)' },
  S: { fill: 'var(--with-pixel-tint, #B9D5F3)' },
  B: { fill: 'var(--with-pixel-c2, #E53935)', cls: 'wm-a' },
  R: { fill: 'var(--with-pixel-c3, #E53935)', cls: 'wm-a' },
  N: { fill: 'var(--with-pixel-accent, #FF8A1F)' },
  T: { fill: 'var(--with-pixel-shadow, #7A4A2A)', cls: 'wm-a' },
  K: { fill: 'var(--with-pixel-ink, #23263A)' },
  H: { fill: 'var(--with-pixel-shine, #FFFFFF)', cls: 'wm-shine' },
}
// the hat (rows 0-3) moves with the A parts
const HAT_ROWS = 4
const X0 = 12 - 7 * 1.5 - 0.75
const n = v => +v.toFixed(2)

// one merged h/v path per colour (and part), each horizontal run as a rectangle
function runsD(ch, rowFilter) {
  let d = ''
  SPRITE.forEach((row, j) => {
    if (!rowFilter(j)) return
    let i = 0
    while (i < row.length) {
      if (row[i] !== ch) { i++; continue }
      let k = i
      while (k < row.length && row[k] === ch) k++
      d += `M${n(X0 + i * 1.5)} ${n(X0 + j * 1.5)}h${n((k - i) * 1.5)}v1.5h${n(-(k - i) * 1.5)}z`
      i = k
    }
  })
  return d
}

export function pixelSnowman() {
  const out = []
  // body colours first (so the fill is the icon's first colour), then the parts, then the ink outline
  for (const ch of ['W', 'S', 'N', 'K', 'B', 'R', 'T']) {
    const p = PAINT[ch]
    if (ch === 'K') {
      const hat = runsD('K', j => j < HAT_ROWS), face = runsD('K', j => j >= HAT_ROWS)
      if (hat) out.push(['path', { d: hat, fill: p.fill, class: 'wm-a' }])
      if (face) out.push(['path', { d: face, fill: p.fill }])
      continue
    }
    const d = runsD(ch, () => true)
    if (d) out.push(['path', p.cls ? { d, fill: p.fill, class: p.cls } : { d, fill: p.fill }])
  }
  const ink = runsD('O', () => true)
  if (ink) out.push(['path', { d: ink }])
  const shine = runsD('H', () => true)
  if (shine) out.push(['path', { d: shine, fill: PAINT.H.fill, class: 'wm-shine' }])
  return out
}
