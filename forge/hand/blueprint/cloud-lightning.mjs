// forge/hand/blueprint/cloud-lightning.mjs — the drafted storm cloud: one fully closed three-lobe outline and a bold solid bolt
// that cuts through its base. The generated drawing broke the cloud into two arcs around a control ring, ran a dimension line
// down the right edge and drew the bolt as three loose dashes; here the cloud closes (its base only breaks to clear the bolt),
// the bolt is one filled zigzag, and the only construction left is the baseline dimension.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3 23H21M3 21.7V23.3M21 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // cloud: left lobe, top lobe, right lobe, base broken for the bolt
    ['path', { d: 'M6.5 12.5A3.8 3.8 0 1 1 7.49 5.03A5 5 0 0 1 16.83 5.92A3.3 3.3 0 1 1 17.2 12.5M6.5 12.5H9.4M15.6 12.5H17.2', class: 'wm-k' }],
    // bolt
    ['path', { d: 'M14.2 8L9.8 15.2H12.4L10.8 21.6L16 14H13.4Z', fill: 'currentColor', 'stroke-width': 0.75, 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
