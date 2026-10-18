// forge/hand/pixel/accessibility.mjs: the universal-access figure on a blue disc in an ink ring: round head, wide-open arms, torso and legs splayed in a V (light figure, wm-a).
// Legend: # ring ink, o disc (c2), s disc shade, w shine, A figure (tint, wm-a).
const SPAN = { 3: [9, 14], 4: [7, 16], 5: [5, 18], 6: [5, 18], 7: [4, 19], 8: [4, 19], 9: [3, 20], 10: [3, 20], 11: [3, 20], 12: [3, 20], 13: [3, 20], 14: [3, 20], 15: [4, 19], 16: [4, 19], 17: [5, 18], 18: [5, 18], 19: [7, 16], 20: [9, 14] }
// figure cells: [y, x0, x1]
const FIG = [
  [4, 11, 12], [5, 10, 13], [6, 10, 13], [7, 11, 12], // head
  [9, 5, 18], [10, 5, 18], // arms
  [11, 11, 12], [12, 11, 12], [13, 11, 12], [14, 10, 13], // torso and hips
  [15, 9, 10], [15, 13, 14], [16, 8, 9], [16, 14, 15], [17, 7, 8], [17, 15, 16], // legs
]
const SHINE = [[4, 7, 8], [5, 6, 6]]

const g = Array.from({ length: 24 }, () => Array(24).fill('.'))
for (const y in SPAN) for (let x = SPAN[y][0]; x <= SPAN[y][1]; x++) g[y][x] = 'o'
// shade: the right and lower rim of the disc
for (const y in SPAN) {
  const [a, b] = SPAN[y]
  if (y >= 5 && y <= 18) g[y][b] = 's'
}
for (let x = 9; x <= 14; x++) g[20][x] = 's'
for (let x = 7; x <= 16; x++) g[19][x] = 's'
for (const [y, a, b] of SHINE) for (let x = a; x <= b; x++) g[y][x] = 'w'
for (const [y, a, b] of FIG) for (let x = a; x <= b; x++) g[y][x] = 'A'
// 4-neighbour ink outline round the disc
const solid = (x, y) => x >= 0 && y >= 0 && x < 24 && y < 24 && g[y][x] !== '.'
const ink = []
for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
  if (g[y][x] === '.' && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) ink.push([x, y])
}
for (const [x, y] of ink) g[y][x] = '#'

const F = 'var(--with-pixel-fill, currentColor)'
const LAYERS = [
  ['o', { fill: 'var(--with-pixel-c2, #4F9BE8)' }],
  ['s', { fill: 'var(--with-pixel-shadow, #2F6CB5)' }],
  ['#', {}],
  ['A', { fill: 'var(--with-pixel-tint, #FFFFFF)', class: 'wm-a' }],
  ['w', { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-shine' }],
]

export default function render() {
  const out = []
  for (const [ch, attrs] of LAYERS) {
    let d = ''
    g.forEach((row, y) => {
      for (let x = 0; x < 24; x++) {
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
