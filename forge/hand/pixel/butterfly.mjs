// forge/hand/pixel/butterfly.mjs — a symmetric butterfly: four rounded wings (big upper pair, small lower pair) with a notch at the waist, a two-pixel body and antennae.

// '#' ink  '+' tone  '=' shade  'o' shine | 'A' / 'a' / 'X' ink / tone / shade of the moving part (wm-a) | 'S' / 's' ink / tone of the signal part (wm-s)
const ROWS = [
  '........................', // 0
  '........................', // 1
  '.........#....#.........', // 2
  '....AAAAA.#..#.AAAAA....', // 3
  '...AaaaaXA.##.AaaaaXA...', // 4
  '..AaooaaaXA##AaaaaaaXA..', // 5
  '..Aaaaaaaaa##aaaaaaaXA..', // 6
  '..Aaaaaaaaa##aaaaaaaXA..', // 7
  '..AXaXXaaaa##aaaaXXaXA..', // 8
  '...AXXXaaaa##aaaaXXXA...', // 9
  '...AAXXXaaa##aaaXXXAA...', // 10
  '.....AAAXaa##aaXAAA.....', // 11
  '........Aaa##aXA........', // 12
  '.....AAAaaa##aaXAAA.....', // 13
  '...AAoaaaaa##aaaaaXAA...', // 14
  '...Aaaaaaaa##aaaaaaXA...', // 15
  '...AXaaaaaa##aaaaaaXA...', // 16
  '....AXaaaaa##aaaaaXA....', // 17
  '.....AXXaaa##aaaXXA.....', // 18
  '......AAXXX##XXXAA......', // 19
  '........AAA##AAA........', // 20
  '........................', // 21
  '........................', // 22
  '........................', // 23
]

const F = 'var(--with-pixel-fill, currentColor)'
const W = 'var(--with-pixel-shine, #FFFFFF)'
const PAINT = [
  ['+', { fill: F, 'fill-opacity': '0.28' }],
  ['=', { fill: F, 'fill-opacity': '0.55' }],
  ['#', {}],
  ['a', { fill: F, 'fill-opacity': '0.28', class: 'wm-a' }],
  ['X', { fill: F, 'fill-opacity': '0.55', class: 'wm-a' }],
  ['A', { class: 'wm-a' }],
  ['s', { fill: F, 'fill-opacity': '0.28', class: 'wm-s' }],
  ['S', { class: 'wm-s' }],
  ['o', { fill: W, class: 'wm-shine' }],
]

export default function render() {
  const out = []
  for (const [ch, attrs] of PAINT) {
    let d = ''
    ROWS.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] !== ch) continue
        let n = 1
        while (row[x + n] === ch) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n - 1
      }
    })
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}
