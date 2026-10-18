// forge/hand/coquette/donut.mjs — a cream dough ring under a blush icing cap set up-left, so the dough shows as a
// lower-right crescent with three clear drips running into it, round a big open hole, with bold red and wine
// sprinkles; it replaces a drawing whose three even concentric rings read as a target or life-buoy at 16px.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const CX = 12, CY = 12.2, HOLE = 3.2
// the icing sits up-left of the dough, so the dough is a crescent: thick bottom-right, a hair at the top-left
const IX = 11.35, IY = 11.5, IR = 6.95

// the icing edge: round, with three long drips (1.6-2.2u) into the lower-right dough and two soft swells
function icingPts() {
  const pts = []
  const drips = [[18, 1.7, 8], [68, 2.2, 8.5], [122, 1.6, 8], [200, 0.45, 18], [290, 0.35, 20]]
  for (let i = 0; i < 120; i++) {
    const deg = i * 3, a = deg * Math.PI / 180
    let r = IR
    for (const [c, h, w] of drips) {
      const dd = ((deg - c + 540) % 360) - 180
      // a flat-topped bump: the drip keeps its width down to a round tip instead of a sharp spike
      const g = Math.exp(-Math.pow(Math.abs(dd) / w, 2.6) / 2)
      r += h * g
    }
    pts.push([+(IX + r * Math.cos(a)).toFixed(2), +(IY + r * Math.sin(a)).toFixed(2)])
  }
  return pts
}

// a sprinkle: a bold short dash (1.2u wide, ~2u long) on the ring of radius r round the hole, tilted off the tangent
function dash(deg, tilt, r = 5.0) {
  const a = deg * Math.PI / 180, x = CX + r * Math.cos(a), y = CY + r * Math.sin(a)
  const t = (deg + 90 + tilt) * Math.PI / 180, h = 0.42
  return k.seg(x - h * Math.cos(t), y - h * Math.sin(t), x + h * Math.cos(t), y + h * Math.sin(t), 1.2)
}

export default function render() {
  const hole = k.disc(CX, CY, HOLE)
  return paint([[
    k.cream(k.cut(k.disc(CX, CY, 9.2), hole)),
    k.body(k.cut(k.poly(icingPts(), 0.3), hole), { plate: 'A', ow: 0.42 }),
    k.fill(k.union(dash(-100, 30, 5.2), dash(20, -35), dash(140, 30)), 'c3', { plate: 'A' }),
    k.fill(k.union(dash(-160, -30, 5.3), dash(-40, 35, 5.2), dash(80, -30, 4.9)), 'ink', { plate: 'A' }),
  ]].flat(Infinity).filter(Boolean))
}
