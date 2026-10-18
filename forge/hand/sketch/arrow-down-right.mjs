// forge/hand/sketch/arrow-down-right.mjs — a single straight-ish diagonal pencil stroke ending in one bold corner
// chevron, replacing a bent shaft whose head arms never met so the point read as a loose tick.
export default function render() {
  return [
    ['path', { d: 'M6.9 6.55Q11.5 11 15.6 15.3', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M17.95 8.4Q17.75 13.2 17.9 17.85Q13.1 18 8.4 17.85', 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: 'M6.5 6.5Q11.85 11.6 17.1 17.1', class: 'wm-k' }],
    ['path', { d: 'M17.55 8.05Q17.35 12.8 17.5 17.5Q12.75 17.65 8.05 17.45', class: 'wm-a' }],
  ]
}
