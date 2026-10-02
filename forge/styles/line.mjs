// LINE — universal. The skeleton itself, stroked. Emits the authored path data
// verbatim, so files are tiny and curves stay exact.
//
// Parts (forge/MOTION.md "Parts choreography"): every authored path stays its own
// node, so A (moving part) and S (badge/modifier) plates are tagged wm-a / wm-s.
// K paths stay untagged (motion treats untagged geometry as wm-k) to keep files small.
export const PLATE_CLASS = { A: 'wm-a', S: 'wm-s' }

export default {
  name: 'line',
  title: 'Line',
  kind: 'universal',
  description: 'A precise 1.75px outline with round caps and joins. The default for any interface.',
  strokeWidth: 1.75,
  root: { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  render(icon) {
    return icon.paths.map(p => ['path', PLATE_CLASS[p.plate] ? { d: p.d, class: PLATE_CLASS[p.plate] } : { d: p.d }])
  },
}
