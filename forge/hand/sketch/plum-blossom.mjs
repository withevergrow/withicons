// forge/hand/sketch/plum-blossom.mjs — a large five-petal blossom with a solid centre on a short curving branch with
// one bud, so the flower leads at 16px; no stray tick marks at the stem tip.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const CX = 14.4, CY = 9.6, PD = 3.7, PR = 3
const petals = [0, 1, 2, 3, 4].map(k => { const a = (-90 + 72 * k) * Math.PI / 180; return [CX + Math.cos(a) * PD, CY + Math.sin(a) * PD] })
// union outline: farthest hit of each ray from the centre with the petal circles
function outline() {
  const P = []
  for (let i = 0; i <= 100; i++) {
    const a = (-90 + 3.6 * i + 0.8 * Math.sin(i * 0.9)) * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a)
    let best = 0
    for (const [px, py] of petals) {
      const ox = CX - px, oy = CY - py, b = ox * ux + oy * uy, c = ox * ox + oy * oy - PR * PR, disc = b * b - c
      if (disc >= 0) best = Math.max(best, -b + Math.sqrt(disc))
    }
    P.push([CX + ux * best, CY + uy * best])
  }
  let d = `M${r2(P[0][0])} ${r2(P[0][1])}`
  for (let i = 1; i < P.length; i++) d += `L${r2(P[i][0])} ${r2(P[i][1])}`
  return d
}
const FLOWER = outline()
const BRANCH = 'M2.6 21.6Q6.4 19.2 8 16.4Q9.2 14.3 10.6 13.2M6.3 18.5Q4.9 17.6 4.3 15.6'
const BUD = 'M4.2 15.4C3 15.2 2.6 13.8 3.3 13C4 12.3 5.3 12.6 5.4 13.7C5.5 14.6 5 15.3 4.1 15.3'
const VEINS = 'M14.4 7.9L14.4 6.3M16 9.1L17.5 8.6M15.4 11L16.3 12.3M13.4 11L12.5 12.3M12.8 9.1L11.3 8.6'
export default function render() {
  return [
    ['path', { d: ghost(BRANCH, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BRANCH, class: 'wm-k' }],
    ['path', { d: BUD, class: 'wm-k' }],
    ['path', { d: ghost(FLOWER, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: FLOWER, class: 'wm-a' }],
    ['path', { d: VEINS, 'stroke-width': 0.9, 'stroke-opacity': 0.8, class: 'wm-a' }],
    ['circle', { cx: CX, cy: CY, r: 1.3, fill: 'currentColor', class: 'wm-s' }],
  ]
}
