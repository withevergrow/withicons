// forge/hand/pixel/avatar-ghost.mjs: friendly ghost: domed sheet with a three-lobe scalloped hem, big dark eyes and an o mouth (floats; eyes are the blink part)
// Map: # ink  + tone  = shade  o shine  | a tone / b shade / A ink of the moving part (wm-a)
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '........########........', // 3
  '......##++++++++##......', // 4
  '.....#o+++++++++++#.....', // 5
  '....#o++++++++++++=#....', // 6
  '....#o++++++++++++=#....', // 7
  '....#+++++++++++++=#....', // 8
  '....#+++AA++++AA++=#....', // 9
  '....#+++AA++++AA++=#....', // 10
  '....#+++AA++++AA++=#....', // 11
  '....#++++++++++++==#....', // 12
  '....#++++++##++++==#....', // 13
  '....#++++++##++++==#....', // 14
  '....#++++++++++++==#....', // 15
  '....#++++++++++++==#....', // 16
  '....#++++++++++++==#....', // 17
  '....#++++++++++++==#....', // 18
  '....#+++##++++##+++#....', // 19
  '....#++#..#++#..#++#....', // 20
  '.....##....##....##.....', // 21
  '........................', // 22
  '........................', // 23
]
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['a', TONE, 'wm-a'], ['b', SHADE, 'wm-a'], ['A', {}, 'wm-a'], ['o', SHINE, 'wm-shine']]
export default function render() {
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    let d = ''
    MAP.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        if (row[x] !== ch) { x++; continue }
        let n = 1
        while (row[x + n] === ch) n++
        d += `M${x} ${y}h${n}v1h-${n}z`
        x += n
      }
    })
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
