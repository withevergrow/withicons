// forge/hand/blueprint/rewind.mjs — the drafted rewind as the exact mirror of blueprint fast-forward (the generated
// drawing kept the skeleton's rounded small triangles, so the trailing tip ran into the leading triangle's back edge and
// the pair fused into one blob at 16px, with no control rings): two sharp triangles with a clear 2u gap, rings on the
// leading triangle's three vertices and the trailing back edge, chain centre lines and the keyline, so the flip swap to
// fast-forward lands on the same drawing.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    // keyline (chain), clipped clear of the triangles and rings
    ['path', { d: 'M2.26 14.28a10 10 0 0 0 .82 2.25m.34.61l.21.34m.41.57a10 10 0 0 0 1.66 1.72m.56.42l.33.22m.61.36a10 10 0 0 0 2.22.89m.68.16l.4.07m.69.08a10 10 0 0 0 2.39-.1m.69-.13l.39-.1m.67-.21a10 10 0 0 0 2.14-1.06m.57-.4l.32-.25m.52-.46l.34-.34M19.22 5.08a10 10 0 0 0-1.85-1.52m-.61-.35l-.35-.19m-.64-.28a10 10 0 0 0-2.31-.63m-.69-.08l-.4-.02m-.7 0a10 10 0 0 0-2.37.36m-.67.21l-.37.15m-.64.28a10 10 0 0 0-2.01 1.3m-.52.46l-.29.29m-.47.52a10 10 0 0 0-1.3 2m-.29.64l-.14.38m-.22.66l-.12.46', ...con(0.34) }],
    // overall width dimension, below
    ['path', { d: 'M21.5 20.9H2.5M21.5 20.8V21.6M2.5 18.7V21.6', ...con(0.5) }],
    // centre lines through both triangles
    ['path', { d: 'M20.1 12h-2.4m-.7 0h-.4m-.7 0h-.7M9.7 12h-2.4m-.7 0h-.4m-.7 0h-.7', ...con(0.5) }],
    ['path', { d: 'M1.85 21.55L3.15 20.25M20.85 21.55L22.15 20.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // leading triangle (left) and trailing triangle (right), broken open at the rings
    ['path', { d: 'M11 7.08V16.93M9.75 17.54L3.75 12.96M3.75 11.04L9.75 6.46', class: 'wm-k' }],
    ['path', { d: 'M21.5 7.08V16.93M20.25 17.54L13 12L20.25 6.46', class: 'wm-a' }],
    ['path', { d: ring(11, 5.5) + ring(11, 18.5) + ring(2.5, 12), ...node('wm-k') }],
    ['path', { d: ring(21.5, 5.5) + ring(21.5, 18.5), ...node('wm-a') }],
  ]
}
