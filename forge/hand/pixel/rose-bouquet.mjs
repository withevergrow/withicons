// forge/hand/pixel/rose-bouquet.mjs: three big red spiral roses in one clustered silhouette over green leaves, in a cream paper cone tied with a pink bow (blooms and leaves sway as the A part)
// Cell-aligned pixel art on the 24 grid (one row of ART per pixel row, cell i spans [i, i + 1]), in colour.
const ART = [
  '..........AAAA..........',
  '.........ARRRRA.........',
  '........ARwRRRRA........',
  '........ARRrrRRA........',
  '........ARrRRrRA........',
  '....AAAA.ARrrRA.AAAA....',
  '...ARRRRA.AAAA.ARRRRA...',
  '..ARwRRRRAAGGAARwRRRRA..',
  '..ARRrrRRAAGwAARRrrRRA..',
  '..ARrRRrRAAGGAARrRRrRA..',
  '...ARrrRA.AGGA.ARrrRA...',
  '....AAAA..AAAA..AAAA....',
  '.AAA################AAA.',
  'AGGGA#wPPPPPPPPPPP#AGGGA',
  'AGwGA#wPP##PP##Ppp#AGwGA',
  '.AGGGA#P#BBKKBB#p#AGGGA.',
  '..AAA.#P#BBKKBB#p#.AAA..',
  '.......#P##KK##p#.......',
  '.......#PPP##Ppp#.......',
  '........#PPPPpp#........',
  '.........#PPPp#.........',
  '..........#Pp#..........',
  '..........####..........',
  '........................',
]
// legend: . empty | # ink | A ink (wm-a) | R rose red, r rose shade, G leaf green (wm-a) | P paper, p paper shade | B bow pink, K bow knot | w shine
const LAYERS = [
  ['P', { fill: 'var(--with-pixel-c2, #F6E7D7)' }],
  ['p', { fill: 'var(--with-pixel-shadow, #D9BFA3)' }],
  ['B', { fill: 'var(--with-pixel-c4, #FFB6C1)' }],
  ['K', { fill: 'var(--with-pixel-fill, #D7263D)' }],
  ['G', { fill: 'var(--with-pixel-c3, #3E8E4F)', class: 'wm-a' }],
  ['R', { fill: 'var(--with-pixel-fill, #D7263D)', class: 'wm-a' }],
  ['r', { fill: 'var(--with-pixel-shadow, #61111B)', class: 'wm-a' }],
  ['#', {}],
  ['A', { class: 'wm-a' }],
  ['w', { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }],
]
function cells(ch) {
  let d = ''
  ART.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== ch) continue
      let n = 1
      while (row[x + n] === ch) n++
      d += `M${x} ${y}h${n}v1h-${n}z`
      x += n - 1
    }
  })
  return d
}
export default function render() {
  const out = []
  for (const [ch, attrs] of LAYERS) { const d = cells(ch); if (d) out.push(['path', { d, ...attrs }]) }
  return out
}
