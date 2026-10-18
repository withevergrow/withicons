// forge/hand/pixel/plane-takeoff.mjs — a climbing aeroplane (nose up-right, swept wings, tail fins) above the runway line (wm-a).
// '#' ink  '+' tone  '=' shade  'o' shine | 'A' ink / 'a' tone / 'X' shade of the moving part (wm-a) | 'S' ink / 's' tone of the badge (wm-s)
const ROWS = [
  '........................', // 0
  '..................###...', // 1
  '................##+=#...', // 2
  '...............#o++=#...', // 3
  '..............#o+++=#...', // 4
  '.....#######.#o+++=#....', // 5
  '....#=o++++=#+++++=#....', // 6
  '.....##==++++++++=#.....', // 7
  '.......##=++++++=#......', // 8
  '.........#+++++=#.......', // 9
  '........#++++++=#.......', // 10
  '.......#+++++++=#.......', // 11
  '....###+++++=++=#.......', // 12
  '...#=+++++==#=+=#.......', // 13
  '....#=+++=##.#==#.......', // 14
  '.....#=+=#....#==#......', // 15
  '......#==#.....##.......', // 16
  '.......#=#.....#........', // 17
  '........##..............', // 18
  '........................', // 19
  '........................', // 20
  '.AAAAAAAAAAAAAAAAAAAAAA.', // 21
  '.AAAAAAAAAAAAAAAAAAAAAA.', // 22
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
        d += 'M' + x + ' ' + y + 'h' + n + 'v1h-' + n + 'z'
        x += n - 1
      }
    })
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}
