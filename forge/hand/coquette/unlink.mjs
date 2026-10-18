// forge/hand/coquette/unlink.mjs — two closed satin links (blush and rose) parted wide on the diagonal, with
// bold ribbon-red break marks in the open corners, so it reads as a broken chain at 16px (no heart filling the gap).
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

// the centreline of a capsule link between end centres (x0, y0) and (x1, y1), radius r
function capsule(x0, y0, x1, y1, r, n = 18) {
  const a = Math.atan2(y1 - y0, x1 - x0), pts = []
  for (let i = 0; i <= n; i++) { const t = a - Math.PI / 2 + Math.PI * i / n; pts.push([x1 + r * Math.cos(t), y1 + r * Math.sin(t)]) }
  for (let i = 0; i <= n; i++) { const t = a + Math.PI / 2 + Math.PI * i / n; pts.push([x0 + r * Math.cos(t), y0 + r * Math.sin(t)]) }
  return pts
}

export default function render() {
  return paint([
    k.rose(k.tube(capsule(15.8, 8.2, 18, 6, 2.45), 2.4, true), { plate: 'K' }),
    k.body(k.tube(capsule(8.2, 15.8, 6, 18, 2.45), 2.4, true)),
    k.satin(k.tube('M6.6 6.6 L9 9 M15 15 L17.4 17.4', 2.1), { plate: 'S' }),
  ])
}
