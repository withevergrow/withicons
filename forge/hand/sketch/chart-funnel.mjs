// forge/hand/sketch/chart-funnel.mjs — three stacked tiers stepping down into a short stem (as the line design),
// wobbly pencil outline with a faint ghost line, tier dividers and hand hatching, replacing a plain cone.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const BODY = 'M4.6 4.05Q12 3.8 19.5 4.1Q21.05 4.2 21 5.6L20.95 8Q20.85 9.45 19.4 9.5L18.05 9.55L17.95 13.4Q17.9 14.9 16.4 15L15.05 15.05L14.95 19Q15 20.5 13.5 20.55L10.5 20.6Q9 20.45 9.05 19L8.95 15.1L7.5 15Q6.05 14.9 6.05 13.4L6.1 9.5L4.5 9.45Q3 9.4 3.05 8L3 5.5Q3.05 4.15 4.6 4.05'
export default function render() {
  return [
    ['path', { d: 'M5.4 8L7.8 5.3M8.8 8.1L11.2 5.3M12.2 8.1L14.6 5.3M15.6 8.1L18 5.3M8.6 13.8L10.5 10.8M11.8 13.9L13.8 10.9M14.4 13.9L15.9 11.6M10.4 19.3L11.8 16.6', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: ghost(BODY, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: 'M6.2 9.6Q12 9.35 17.9 9.6M9.2 15.05Q12 14.9 14.9 15.1', 'stroke-width': 1.1, class: 'wm-a' }],
  ]
}
