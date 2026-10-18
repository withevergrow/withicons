// forge/hand/blueprint/pandal.mjs — the drafted pandal: pitched canopy, a shallow three-scallop valance, two poles with
// short tied-back drapes and a small lamp on the centre line. Earlier drafts ran long drapes to y=16 and hung a 3u lamp
// between them, so the band under the roof closed into one dark block at 16px. Here the scallops span the full eave
// (2.5-21.5, sagitta 1.2) so they leave the roof corners without slivers and meet at gentle cusps, the drapes start at
// x=8 / 16 and tie back to the poles by y=13.8 (an 8u open centre), and the lamp is a 2u diamond on a 1.5u hanger.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M16.81 20.77A10 10 0 0 1 14.59 21.66M13.91 21.82L13.51 21.88M12.82 21.97A10 10 0 0 1 10.43 21.88M9.74 21.74L9.35 21.64M8.68 21.43A10 10 0 0 1 7.14 20.74M3.66 17.52A10 10 0 0 1 2.59 15.38M2.37 14.71L2.27 14.32M2.13 13.64A10 10 0 0 1 2.03 11.24M2.11 10.55L2.15 10.26M3.45 6.82A10 10 0 0 1 4.92 4.94M5.43 4.46L5.74 4.2M6.3 3.78A10 10 0 0 1 8.42 2.66M9.08 2.44L9.46 2.33M14.2 2.25A10 10 0 0 1 16.46 3.05M17.07 3.38L17.42 3.59M17.99 3.99A10 10 0 0 1 19.72 5.65M20.15 6.2L20.37 6.53M21.86 10.31A10 10 0 0 1 21.98 12.7M21.9 13.4L21.84 13.79M21.69 14.48A10 10 0 0 1 20.82 16.71M20.47 17.31L20.31 17.56', ...con(0.34) }],
    ['path', { d: 'M2.5 23H3.3M6.7 23H17.3M20.7 23H21.5M2.5 20.8V23.3M21.5 20.8V23.3', ...con(0.5) }],
    ['path', { d: 'M12 5.3V7.7M12 18.3V20.7M12 21.4V21.8M12 22.5V23.3', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // canopy (open at the apex ring) and poles hung from the valance
    ['path', { d: 'M10.66 3.85L2.5 9H21.5L13.34 3.85M5 10.15V19.93M19 10.15V19.93', class: 'wm-k' }],
    // valance, tie-back drapes and lamp
    // (butt caps: the scallops end flush on the eave and the drapes flush on the poles)
    ['path', { d: 'M2.5 9A4.78 4.78 0 0 0 8.83 9M8.83 9A4.78 4.78 0 0 0 15.17 9M15.17 9A4.78 4.78 0 0 0 21.5 9M8 9.59C8 12 7 13.3 5 13.8M16 9.59C16 12 17 13.3 19 13.8', 'stroke-linecap': 'butt', class: 'wm-a' }],
    ['path', { d: 'M12 10.2V11.7M12 11.7L13 12.9L12 14.1L11 12.9Z', class: 'wm-a' }],
    ['path', { d: ring(12, 3) + ring(5, 21.5) + ring(19, 21.5), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
