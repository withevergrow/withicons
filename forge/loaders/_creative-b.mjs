// with icons — shared geometry for the creative loaders gears, book, plant-grow, day-night, radar, ink-drop,
// blocks-stack, fireflies and battery-charge (forge/LOADERS.md). Pure and deterministic.
import { polar } from './_kit.mjs'

const f = n => { const r = Math.round(n * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r) }

/** A closed ellipse (axis-aligned). */
export const ellipse = (cx, cy, rx, ry) =>
  `M${f(cx + rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx)} ${f(cy)} Z`

/**
 * A spur gear outline: n trapezoid teeth around pitch radius rp (clock degrees, 0 = up).
 *   add / ded   tooth height above / below the pitch circle
 *   phase       clock angle of tooth 0's centre
 *   tip / root  half-width of a tooth at its tip / root, as a fraction of the tooth pitch
 */
export function gear(cx, cy, n, rp, { add = 1, ded = 1.1, phase = 0, tip = 0.16, root = 0.3 } = {}) {
  const P = 360 / n, ro = rp + add, ri = rp - ded
  const pt = (r, a) => { const [x, y] = polar(cx, cy, r, a); return `${f(x)} ${f(y)}` }
  let d = `M${pt(ri, phase - root * P)}`
  for (let k = 0; k < n; k++) {
    const c = phase + k * P
    d += ` L${pt(ro, c - tip * P)} A${f(ro)} ${f(ro)} 0 0 1 ${pt(ro, c + tip * P)} L${pt(ri, c + root * P)}`
    d += ` A${f(ri)} ${f(ri)} 0 0 1 ${pt(ri, c + P - root * P)}`
  }
  return d + ' Z'
}

/** A leaf (vesica) from its base (x0, y0) to its tip (x1, y1), w = half its width at the middle. */
export function leafShape(x0, y0, x1, y1, w = 1.6, bend = 0.25) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L
  const mx = x0 + dx * 0.5 + nx * w * bend, my = y0 + dy * 0.5 + ny * w * bend
  const c = s => `${f(mx + nx * w * 1.35 * s)} ${f(my + ny * w * 1.35 * s)}`
  return `M${f(x0)} ${f(y0)} Q${c(1)} ${f(x1)} ${f(y1)} Q${c(-1)} ${f(x0)} ${f(y0)} Z`
}

/** A four-point twinkle star centred on (cx, cy), radius r. */
export function twinkle(cx, cy, r, k = 0.28) {
  const q = r * k
  return `M${f(cx)} ${f(cy - r)} Q${f(cx + q)} ${f(cy - q)} ${f(cx + r)} ${f(cy)} Q${f(cx + q)} ${f(cy + q)} ${f(cx)} ${f(cy + r)} ` +
    `Q${f(cx - q)} ${f(cy + q)} ${f(cx - r)} ${f(cy)} Q${f(cx - q)} ${f(cy - q)} ${f(cx)} ${f(cy - r)} Z`
}

/** A lightning bolt centred on (cx, cy), h tall. */
export function bolt(cx, cy, h = 7) {
  const s = h / 7
  const P = (x, y) => `${f(cx + x * s)} ${f(cy + y * s)}`
  return `M${P(0.6, -3.5)} L${P(-1.9, 0.5)} H${f(cx - 0.1 * s)} L${P(-0.6, 3.5)} L${P(1.9, -0.5)} H${f(cx + 0.1 * s)} Z`
}
