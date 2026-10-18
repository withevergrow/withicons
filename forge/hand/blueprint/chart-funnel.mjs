// forge/hand/blueprint/chart-funnel.mjs — the drafted three-tier funnel with its centre axis shown only where it
// overhangs above and below (the generated drawing ran the chain centre line down through all three tiers and hung
// fillet ticks off the middle steps, so the narrow lower tiers filled with dashes at 16px): the tiers stay clean and
// open, with the keyline arcs, the two top-corner fillet marks and the dimension line kept faint behind.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M8.41 2.67a10 10 0 0 1 2.32-.59m.7-.06l.4-.02m.7.01a10 10 0 0 1 2.36.42m.66.22l.09.03M21.74 9.72a10 10 0 0 1 .26 2.38m-.03.7l-.04.4m-.11.69a10 10 0 0 1-.73 2.28m-.32.63l-.19.34m-.38.59a10 10 0 0 1-1.6 1.78m-.54.45l-.33.23m-.58.38a10 10 0 0 1-2.19.98m-.67.19l-.4.08m-.69.11a10 10 0 0 1-2.39 0m-.69-.11l-.39-.08m-.68-.19a10 10 0 0 1-2.19-.97m-.58-.38l-.33-.24m-.54-.44a10 10 0 0 1-1.6-1.78m-.38-.59l-.2-.34m-.31-.63a10 10 0 0 1-.74-2.28m-.11-.69l-.04-.4m-.03-.7a10 10 0 0 1 .25-2.34', ...con(0.34) }],
    ['path', { d: 'M21.93 4H23.1M21 1.9V3.1M3 3.1V1.9M.9 4H2.1M3 22.9H21M3 20.7V23.3M21 20.7V23.3', ...con(0.5) }],
    ['path', { d: 'M12 1.8v.9M12 21.8v.9', ...con(0.5) }],
    ['path', { d: 'M2.35 23.55L3.65 22.25M20.35 23.55L21.65 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M4.5 4H19.5A1.5 1.5 0 0 1 21 5.5V8A1.5 1.5 0 0 1 19.5 9.5H18V13.5A1.5 1.5 0 0 1 16.5 15H15V19A1.5 1.5 0 0 1 13.5 20.5H10.5A1.5 1.5 0 0 1 9 19V15H7.5A1.5 1.5 0 0 1 6 13.5V9.5H4.5A1.5 1.5 0 0 1 3 8V5.5A1.5 1.5 0 0 1 4.5 4Z', class: 'wm-k' }],
    ['path', { d: 'M6 9.5H18M9 15H15', class: 'wm-a' }],
  ]
}
