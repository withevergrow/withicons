// forge/hand/blueprint/plane-landing.mjs — the aeroplane drawn as one clean closed outline (round nose, straight swept wings, tail fins),
// tilted 25 degrees nose-down onto one plain runway line; no construction dash, so nothing competes with the silhouette.
const f = n => String(+n.toFixed(2))
const ANG = 25 * Math.PI / 180, S = 0.82, CX = 11.6, CY = 11.2
const tr = (x, y) => [CX + S * (x * Math.cos(ANG) - y * Math.sin(ANG)), CY + S * (x * Math.sin(ANG) + y * Math.cos(ANG))]
const P = (x, y) => tr(x, y).map(f).join(' ')
// plane pointing +x; top half is written once and mirrored in y for the lower half
const top = [[8.6, -1.4], [3, -1.4], [-2.4, -9.4], [-5, -9.4], [-3.8, -1.4], [-8.4, -1.4], [-10.2, -4.4], [-12, -4.4], [-11.6, -1]]
const bot = top.slice().reverse().map(([x, y]) => [x, -y])
export default function render() {
  const d = `M${P(11.4, 0)}C${P(11.4, -1)} ${P(10, -1.4)} ${P(8.6, -1.4)}` +
    top.slice(1).map(([x, y]) => `L${P(x, y)}`).join('') +
    `C${P(-12.4, -0.8)} ${P(-12.4, 0.8)} ${P(-11.6, 1)}` +
    bot.slice(1).map(([x, y]) => `L${P(x, y)}`).join('') +
    `C${P(10, 1.4)} ${P(11.4, 1)} ${P(11.4, 0)}Z`
  return [
    ['path', { d, class: 'wm-k' }],
    ['path', { d: 'M3 21.5H21', class: 'wm-a' }],
  ]
}
