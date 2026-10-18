// forge/hand/blueprint/croissant.mjs — the drafted croissant: a fat crescent of five chunky lobes (centre, two mids and two
// horns that taper to pointed tips) split by four heavy dividers that fan out from the hollow of the crescent. The generated
// drawing cut it into thin segments inside a keyline circle, so it read as a blob or a crown; here the silhouette is one
// scalloped outline with a clear curved horn on each side, and the only construction is a dimension line under the horns.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (d, w = 0.45, o = 0.5) => ['path', { d, color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': o, class: 'wm-deco' }]
const f = v => String(Math.round(v * 100) / 100)
const R = Math.PI / 180
const CX = 12, CY = 17.8
// point at angle a (degrees from straight up, clockwise) and radius r around the crescent centre
const P = (a, r) => `${f(CX + r * Math.sin(a * R))} ${f(CY - r * Math.cos(a * R))}`

export default function render() {
  const RO = 10.4, RI = 5.2, BULGE = 12.4
  const tipA = 97, tipR = 10.6
  const outer = [[-tipA, tipR], [-56, RO], [-21, RO], [21, RO], [56, RO], [tipA, tipR]]
  let d = `M${P(-tipA, tipR)}`
  // lobes along the outside, each one bulging past the notch radius
  const mids = [-77, -38.5, 0, 38.5, 77]
  for (let i = 1; i < outer.length; i++) d += `Q${P(mids[i - 1], i === 1 || i === 5 ? 12 : BULGE)} ${P(outer[i][0], outer[i][1])}`
  // inner edge back round the hollow of the crescent
  d += `Q${P(75, 6.6)} ${P(56, RI)}Q${P(0, RI - 3.6)} ${P(-56, RI)}Q${P(-75, 6.6)} ${P(-tipA, tipR)}Z`
  let div = ''
  for (const a of [-56, -21, 21, 56]) div += `M${P(a, RO)}L${P(a, RI + (Math.abs(a) < 30 ? -0.9 : 0))}`
  return [
    con('M2.5 22.6H21.5M2.5 21.4V23.8M21.5 21.4V23.8'),
    con('M1.85 23.25L3.15 21.95M20.85 23.25L22.15 21.95', 0.5, 0.75),
    ['path', { d, class: 'wm-k' }],
    ['path', { d: div, class: 'wm-a' }],
  ]
}
