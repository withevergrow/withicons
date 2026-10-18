// forge/hand/pixel/dog.mjs: dog: a front-facing puppy: tone head with shaded floppy ears, big glinting eyes and an outlined open
// muzzle (background-coloured, so it is the lightest block on light and the darkest on dark) carrying a bold solid nose and a tongue.
// Hand-drawn 24x24 pixel sprite (1u cells). Legend: # ink, + body tone (.28), = shade (.55), o shine glint, e eye, n nose, t tongue.
const SPRITE = [
'........................', // 0
'........................', // 1
'........................', // 2
'........########........', // 3
'......###++++++###......', // 4
'...####++++++++++####...', // 5
'..#===#++++++++++#===#..', // 6
'..#===#++oe++oe++#===#..', // 7
'..#===#++ee++ee++#===#..', // 8
'..#===#++ee++ee++#===#..', // 9
'..#===#++++++++++#===#..', // 10
'..#===#++######++#===#..', // 11
'..#===#+#......#+#===#..', // 12
'..#===#+#.nnnn.#+#===#..', // 13
'..#===#+#.nnnn.#+#===#..', // 14
'...####+#..##..#+####...', // 15
'......#+#.#tt#.#+#......', // 16
'......#+#......#+#......', // 17
'.......##......##.......', // 18
'.........######.........', // 19
'........................', // 20
'........................', // 21
'........................', // 22
'........................', // 23
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
// [cells, attrs, class] in paint order
const PAINT = [['=t', SHADE, 'wm-k'], ['+', TONE, 'wm-k'], ['#', {}, 'wm-k'], ['o', SHINE, 'wm-shine'], ['e', {}, 'wm-a'], ['n', {}, 'wm-a']]

function runsD(chs) {
  let d = ''
  SPRITE.forEach((row, j) => {
    let i = 0
    while (i < row.length) {
      if (!chs.includes(row[i])) { i++; continue }
      let k = i
      while (k < row.length && chs.includes(row[k])) k++
      d += `M${i} ${j}h${k - i}v1h${i - k}z`
      i = k
    }
  })
  return d
}

export default function render() {
  const out = []
  for (const [chs, attrs, cls] of PAINT) {
    const d = runsD(chs)
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
