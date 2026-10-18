// forge/hand/sketch/map-pin.mjs — clean teardrop with a crisp open hole ring (same as the line version), a pencilled
// ghost outline, and a narrow two-stroke hatch in the lower-right band that never touches the ring.
const R = (v) => Math.round(v * 100) / 100
const ring = (cx, cy, r) => {
  const pts = []
  for (let i = 0; i < 8; i++) {
    const a = (i * 45 + 200) * Math.PI / 180
    const rr = r * (1 + 0.025 * Math.sin(a * 2 + 1))
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
  }
  let d = `M${R((pts[7][0] + pts[0][0]) / 2)} ${R((pts[7][1] + pts[0][1]) / 2)}`
  for (let i = 0; i < 8; i++) {
    const p = pts[i], q = pts[(i + 1) % 8]
    d += `Q${R(p[0])} ${R(p[1])} ${R((p[0] + q[0]) / 2)} ${R((p[1] + q[1]) / 2)}`
  }
  return d + 'Z'
}
export default function render() {
  return [
    ['path', { d: 'M15.8 13.7L17.9 12M14.9 16.5L17 14.7', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: 'M12.2 21.9Q8.5 18.7 6.2 15.7Q4.4 13.1 4.3 10.1Q4.4 6.6 7.4 4.2Q10 2.2 13 2.5Q16.4 2.9 18.5 5.6Q19.9 7.7 19.5 10.6Q19.2 13.4 17 16.3Q14.9 19.1 12.2 21.9Z', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M12 21.6Q8.4 18.4 6.1 15.4Q4.3 12.8 4.4 9.8Q4.6 6.4 7.5 4Q9.7 2.4 12 2.4Q15.2 2.5 17.6 4.6Q19.6 6.6 19.6 9.8Q19.4 13 17 16Q14.8 18.9 12 21.6Z', class: 'wm-k' }],
    ['path', { d: ring(12, 10, 2.9), 'stroke-width': 1.3, class: 'wm-a' }],
  ]
}
