// PIXEL hand-drawn dragon head sprite (forge/icons/dragon-head.json stays the base; this replaces only Pixel's drawing).
// A 15x15 sprite on Pixel's grid (1.5u cells, cell 7 is the icon centre), front view: two branching gold antlers,
// a red head with an orange pearl, cream fur tufts and angry cream brows, dark eyes, a long snout with a dark-red
// nose and two nostrils, gold whiskers sweeping out level and curling down, a row of white teeth, a cream beard.
// The outline is currentColor (ink). Roles: head --with-pixel-fill (c1), antlers/whiskers --with-pixel-c2,
// nose --with-pixel-c3, cream --with-pixel-tint, pearl --with-pixel-accent, eyes --with-pixel-ink, teeth shine.
const SPRITE = [
  '.A..A.....A..A.',
  '..AA.......AA..',
  '...A.......A...',
  '...OOOOOOOOO...',
  'CCORRRRPRRRROCC',
  '.CORCRRRRRCROC.',
  '..ORRCRRRCRRO..',
  '..ORKKRRRKKRO..',
  '...ORRRRRRRO...',
  '.GGORNKNKNROGG.',
  'G..ORNNNNNRO..G',
  '...OWKWKWKWO...',
  '...OKKKKKKKO...',
  '...OCCCCCCCO...',
  '....C.C.C.C....',
]
const PAINT = {
  R: { fill: 'var(--with-pixel-fill, #E53935)', cls: 'wm-k' },
  A: { fill: 'var(--with-pixel-c2, #F2B33D)', cls: 'wm-a' },
  G: { fill: 'var(--with-pixel-c2, #F2B33D)', cls: 'wm-a' },
  N: { fill: 'var(--with-pixel-c3, #B71C1C)' },
  C: { fill: 'var(--with-pixel-tint, #FFF1CC)' },
  P: { fill: 'var(--with-pixel-accent, #FF8A1F)', cls: 'wm-s' },
  K: { fill: 'var(--with-pixel-ink, #23263A)' },
  W: { fill: 'var(--with-pixel-shine, #FFFFFF)', cls: 'wm-s' },
}
const X0 = 12 - 7 * 1.5 - 0.75
const n = v => +v.toFixed(2)

function runsD(chs) {
  let d = ''
  SPRITE.forEach((row, j) => {
    let i = 0
    while (i < row.length) {
      if (!chs.includes(row[i])) { i++; continue }
      let k = i
      while (k < row.length && chs.includes(row[k])) k++
      d += `M${n(X0 + i * 1.5)} ${n(X0 + j * 1.5)}h${n((k - i) * 1.5)}v1.5h${n(-(k - i) * 1.5)}z`
      i = k
    }
  })
  return d
}

export function pixelDragon() {
  const out = []
  for (const chs of ['R', 'AG', 'N', 'C', 'P', 'K', 'W']) {
    const p = PAINT[chs[0]], d = runsD(chs)
    if (d) out.push(['path', p.cls ? { d, fill: p.fill, class: p.cls } : { d, fill: p.fill }])
  }
  out.push(['path', { d: runsD('O') }])
  return out
}
