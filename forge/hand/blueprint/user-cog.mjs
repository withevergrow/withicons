// forge/hand/blueprint/user-cog.mjs — account settings: a head and shoulders with a big six-tooth gear at the lower right.
// The generated drawing had a small eight-tooth gear that clotted at 16px and a keyline circle with a crosshair on the head;
// here the gear is a bold part with thick teeth and a clear hub, the head is a plain circle, and only the baseline
// dimension remains.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })
const f = n => +n.toFixed(2)

// a gear: n teeth, outer radius ro, root radius rr, tooth half-angles (deg) at the tip and at the root, hub radius rh
function gear(cx, cy, n, ro, rr, tip, root, rh) {
  const p = (r, deg) => `${f(cx + r * Math.cos(deg * Math.PI / 180))} ${f(cy + r * Math.sin(deg * Math.PI / 180))}`
  let d = ''
  for (let k = 0; k < n; k++) {
    const a = -90 + k * (360 / n)
    d += (k ? `A${rr} ${rr} 0 0 1 ${p(rr, a - root)}` : `M${p(rr, a - root)}`)
    d += `L${p(ro, a - tip)}L${p(ro, a + tip)}L${p(rr, a + root)}`
  }
  d += `A${rr} ${rr} 0 0 1 ${p(rr, -90 - root)}Z`
  d += `M${f(cx + rh)} ${cy}A${rh} ${rh} 0 1 1 ${f(cx - rh)} ${cy}A${rh} ${rh} 0 1 1 ${f(cx + rh)} ${cy}Z`
  return d
}

export default function render() {
  return [
    ['path', { d: 'M2.5 23H22M2.5 21.8V23.4M22 21.8V23.4', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M21.35 23.65L22.65 22.35', ...con(0.75, 0.5) }],
    ['path', { d: 'M12 7A3.5 3.5 0 0 1 5 7A3.5 3.5 0 0 1 12 7ZM2.5 19.5V18A4.5 4.5 0 0 1 7 13.5', class: 'wm-k' }],
    ['path', { d: gear(16.5, 15.75, 6, 5.75, 4.1, 14, 23, 1.75), class: 'wm-s' }],
  ]
}
