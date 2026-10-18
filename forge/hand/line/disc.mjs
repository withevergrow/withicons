// forge/hand/line/disc.mjs — a compact disc: Ø19 rim, a clear centre hole and two short opposite glints on the
// playing surface, so it reads as a shiny spinning disc instead of a ring-and-dot target with one stray arc.
export default function render() {
  return [
    ['path', { d: 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z' }],
    ['path', { d: 'M14.5 12A2.5 2.5 0 1 1 9.5 12A2.5 2.5 0 1 1 14.5 12Z', class: 'wm-a' }],
    ['path', { d: 'M6.2 10.45A6 6 0 0 1 10.45 6.2', class: 'wm-a' }],
    ['path', { d: 'M17.8 13.55A6 6 0 0 1 13.55 17.8', class: 'wm-a' }],
  ]
}
