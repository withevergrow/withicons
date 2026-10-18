// forge/hand/pixel/plug-zap.mjs — an electric plug: two prongs (wm-a) into a tone body, a cord down, and a solid lightning bolt as the badge (wm-s).
// '#' ink  '+' tone  '=' shade  'o' shine | 'A' ink / 'a' tone / 'X' shade of the moving part (wm-a) | 'S' ink / 's' tone of the badge (wm-s)
const ROWS = [
  '........................', // 0
  '.......AA...AA..........', // 1
  '.......AA...AA..........', // 2
  '.......AA...AA..........', // 3
  '.......AA...AA..........', // 4
  '.....###########........', // 5
  '....#+o++++++++=#.......', // 6
  '....#o+++++++++=#.......', // 7
  '....#o+++++++++=#.......', // 8
  '....#++++++++++=#.......', // 9
  '....#=+++++++++=#.......', // 10
  '.....#=+++++++=#........', // 11
  '......#=+++++=#....SS...', // 12
  '.......#=====#....SS....', // 13
  '........#AAA#....SS.....', // 14
  '.........AAA....SSSSS...', // 15
  '.........AAA.......SS...', // 16
  '.........AAA......SS....', // 17
  '.........AAA.....SS.....', // 18
  '.........AAA....SS......', // 19
  '.........AAA....S.......', // 20
  '.........AAA............', // 21
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
        d += 'M' + x + ' ' + y + 'h' + n + 'v1h-' + n + 'z'
        x += n - 1
      }
    })
    if (d) out.push(['path', { d, ...attrs }])
  }
  return out
}
