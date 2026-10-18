// forge/hand/pixel/lotus.mjs: a lotus of five petals: a tall pointed centre petal in front, two upright petals behind it and two low outward petals, standing on a flat base bar (the bar is the wm-s part).
const ROWS = [
  '........................',
  '...........##...........',
  '..........#ox#..........',
  '.........#*oox#.........',
  '.........#*oox#.........',
  '.........#ooox#.........',
  '...##...#ooooox#...##...',
  '..#ox#..#ooooox#..#ox#..',
  '..#*ox#.#ooooox#.#oox#..',
  '..#oooox#ooooox#oooox#..',
  '..#oooox#ooooox#oooox#..',
  '..#oooox#ooooox#oooox#..',
  '..#xooox#xoooox#oooox#..',
  '...#xooox#ooox#oooox#...',
  '.##.#xoox#xoox#ooox#.##.',
  '.#xx##ooox#xx#xoox##ox#.',
  '..#xoooox######xoooox#..',
  '...#oxxx########xxxx#...',
  '.....##############.....',
  '........................',
  '....SSSSSSSSSSSSSSSS....',
  '....SSSSSSSSSSSSSSSS....',
  '........................',
  '........................',
]
const F = 'var(--with-pixel-fill, currentColor)'
const W = 'var(--with-pixel-shine, #FFFFFF)'
// one paint per grid character, emitted back to front
const PAINT = [
  ['o', { fill: F, 'fill-opacity': '0.28' }],
  ['x', { fill: F, 'fill-opacity': '0.55' }],
  ['#', {}],
  ['a', { fill: F, 'fill-opacity': '0.28', class: 'wm-a' }],
  ['X', { fill: F, 'fill-opacity': '0.55', class: 'wm-a' }],
  ['A', { class: 'wm-a' }],
  ['s', { fill: F, 'fill-opacity': '0.28', class: 'wm-s' }],
  ['S', { class: 'wm-s' }],
  ['d', { class: 'wm-deco' }],
  ['*', { fill: W, class: 'wm-shine' }],
]
function cells(rows) {
  const out = []
  for (const [ch, attrs] of PAINT) {
    let d = ''
    rows.forEach((row, y) => {
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
export default function render() {
  return cells(ROWS)
}
