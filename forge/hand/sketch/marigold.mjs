// forge/hand/sketch/marigold.mjs — a pencil bloom of ten round outer petals around a smaller offset ring of six petals
// and a seed dot, replacing the generated tight frilly scallops that read like the rangoli pattern in flat styles.
const r2 = (n) => +n.toFixed(2)
function ring(n, rv, r, rot, cx = 12, cy = 12) {
  const pts = []
  for (let i = 0; i <= n; i++) {
    const a = rot + (i * 2 * Math.PI) / n
    pts.push([r2(cx + rv * Math.cos(a)), r2(cy + rv * Math.sin(a))])
  }
  return `M${pts[0][0]} ${pts[0][1]}` + pts.slice(1).map(([x, y]) => `A${r} ${r} 0 1 1 ${x} ${y}`).join('') + 'Z'
}
export default function render() {
  const pencil = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
  const top = -Math.PI / 2
  return [
    ['path', { d: 'M15.6 18.6l1.7-1.25M17.8 16.6l1.4-1.05', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: ring(10, 6.45, 2.25, top + Math.PI / 10 + 0.06, 12.3, 11.75), ...pencil, class: 'wm-k' }],
    ['path', { d: ring(10, 6.5, 2.2, top + Math.PI / 10), class: 'wm-k' }],
    ['path', { d: ring(6, 2.6, 1.3, top + 0.08, 12.25, 11.8), ...pencil, class: 'wm-a' }],
    ['path', { d: ring(6, 2.6, 1.3, top) + 'M12 11.25A0.75 0.75 0 1 1 12 12.75A0.75 0.75 0 1 1 12 11.25Z', class: 'wm-a' }],
  ]
}
