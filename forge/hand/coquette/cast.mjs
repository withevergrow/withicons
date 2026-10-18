// forge/hand/coquette/cast.mjs — a blush screen with a cream panel whose lower-left corner is bitten away in a quarter
// circle, so two rose signal arcs and a red satin corner dot sit in clear open space; it replaces the old outline-only
// frame whose arcs hugged the corner and read as an RSS feed.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const CX = 2.8, CY = 20

export default function render() {
  return paint([[
    k.body(k.cut(k.rr(CX, 3.8, 21.4, CY, 2.4), k.disc(CX, CY, 10.7))),
    k.cream(k.cut(k.rr(4.9, 5.9, 19.3, 17.9, 1.1), k.disc(CX, CY, 12.8)), { ow: 0.5 }),
    k.rose(k.tube(`M${CX} 15.6 A4.4 4.4 0 0 1 ${CX + 4.4} ${CY} M${CX} 11.9 A8.1 8.1 0 0 1 ${CX + 8.1} ${CY}`, 2), { plate: 'A' }),
    k.satin(k.inter(k.disc(CX, CY, 2.2), k.rect(CX, CY - 2.2, CX + 2.2, CY)), { plate: 'A', ow: 0.5 }),
    k.bow(20.4, 4.2, 0.52, 18),
  ]].flat(Infinity).filter(Boolean))
}
