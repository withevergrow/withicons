// forge/hand/blueprint/cloud-download.mjs — the drafted cloud with a download arrow (the generated drawing broke the
// cloud into three loose arcs at four control rings and hollowed one arrowhead wing with a ring, so at 16px the cloud
// crumbled and the head went lopsided, its tip grazing the dimension line): one unbroken cloud line with rings on its two
// free ends, a symmetric mitred arrowhead raised clear of the dimension, a ring on the arrow's tail and the arrow's chain
// axis carried on up through the cloud.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    // keyline (chain), clipped clear of the cloud
    ['path', { d: 'M20.92 16.52a10 10 0 0 1-1.33 1.99m-.48.52l-.28.28m-.53.46a10 10 0 0 1-2.03 1.27m-.64.28l-.38.14m-.67.2a10 10 0 0 1-2.37.34m-.7-.01l-.4-.03m-.69-.09a10 10 0 0 1-2.3-.65m-.64-.3l-.35-.19m-.6-.36a10 10 0 0 1-1.83-1.54m-.46-.53l-.25-.31m-.4-.58a10 10 0 0 1-1.04-2.15m-.21-.67l-.07-.26M5.43 4.46a10 10 0 0 1 .87-.67M18.07 4.05a10 10 0 0 1 1.75 1.67m.41.57l.3.47', ...con(0.34) }],
    // width dimension below, and the arrow's axis through the cloud
    ['path', { d: 'M2.55 22.9H21.48M2.55 20.7V23.3M21.48 20.7V23.3', ...con(0.5) }],
    ['path', { d: 'M12 3.7v2.4m0 .7v.4m0 .7v.85', ...con(0.5) }],
    ['path', { d: 'M1.9 23.55L3.2 22.25M20.83 23.55L22.13 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // cloud: one line, opened at both free ends for the rings
    ['path', { d: 'M3.67 13.99A4.5 4.5 0 0 1 6.2 6.6A6.2 6.2 0 0 1 18.1 7.1A4.25 4.25 0 0 1 20.47 14.01', class: 'wm-k' }],
    ['path', { d: ring(4.89, 14.97) + ring(19.25, 15), ...node('wm-k') }],
    // arrow: shaft from the tail ring, solid mitred head (the shaft stops inside the head's mitre)
    ['path', { d: 'M12 12.58V19.9M8.5 17L12 20.5L15.5 17', class: 'wm-s' }],
    ['path', { d: ring(12, 11), ...node('wm-s') }],
  ]
}
