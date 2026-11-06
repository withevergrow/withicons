// Shared by the svg-in-google-slides images: the with icons heart (line style) as its real path, and a "WMF round
// trip" version where every Bézier curve is replaced by a few straight segments (WMF has no curve records).
import { icon } from '../../tools/hero-kit.mjs'

const svg = icon('heart', 'line', 24)
export const HEART_D = svg.match(/<path d="([^"]+)"/)[1]

/** Flatten every cubic of a "M .. C .. Z" path into n straight segments. Returns { d, pts } in 24-unit space. */
export function jag(d = HEART_D, n = 3) {
  const t = d.match(/[MCZ]|-?\d*\.?\d+/g)
  let i = 0, cur = [0, 0], start = [0, 0]
  const pts = [], out = []
  const num = () => parseFloat(t[i++])
  while (i < t.length) {
    const c = t[i++]
    if (c === 'M') { cur = [num(), num()]; start = cur; pts.push(cur); out.push(`M${cur[0]} ${cur[1]}`) }
    else if (c === 'C') {
      while (i < t.length && !/[MCZ]/.test(t[i])) {
        const p1 = [num(), num()], p2 = [num(), num()], p3 = [num(), num()], p0 = cur
        for (let k = 1; k <= n; k++) {
          const s = k / n, a = (1 - s) ** 3, b = 3 * (1 - s) ** 2 * s, cc = 3 * (1 - s) * s * s, e = s ** 3
          const q = [a * p0[0] + b * p1[0] + cc * p2[0] + e * p3[0], a * p0[1] + b * p1[1] + cc * p2[1] + e * p3[1]].map(v => +v.toFixed(3))
          pts.push(q); out.push(`L${q[0]} ${q[1]}`)
        }
        cur = p3
      }
    } else if (c === 'Z') { out.push('Z'); cur = start }
  }
  return { d: out.join(' '), pts }
}

/** A heart drawn at size px: smooth (real icon path) or jagged (flattened), stroke in colour. */
export function heart(size, color, { jagged = false, dots = false, width = 1.75 } = {}) {
  const j = jag()
  const d = jagged ? j.d : HEART_D
  const dot = dots ? j.pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${0.42}" fill="#fff" stroke="${color}" stroke-width=".22"/>`).join('') : ''
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="${jagged ? 'butt' : 'round'}" stroke-linejoin="${jagged ? 'miter' : 'round'}" style="display:block;overflow:visible"><path d="${d}"/>${dot}</svg>`
}
