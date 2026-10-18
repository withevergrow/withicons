// forge/hand/blueprint/chart-candlestick.mjs — three drafted candles with wider 4u bodies and no keyline circle (the
// generated drawing drew 3u bodies whose 0.75u counters closed up into black bars at 16px, then ringed them with the
// chain keyline and eight fillet ticks, so the chart read as noise inside a circle): the bodies keep open counters at
// every size, the wicks stay whole, and only the dimension line under the chart shows the drafting.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3 23H21M3 21.2V23.3M21 21.2V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M4 9H6A1 1 0 0 1 7 10V14A1 1 0 0 1 6 15H4A1 1 0 0 1 3 14V10A1 1 0 0 1 4 9ZM11 5.5H13A1 1 0 0 1 14 6.5V11A1 1 0 0 1 13 12H11A1 1 0 0 1 10 11V6.5A1 1 0 0 1 11 5.5ZM18 11H20A1 1 0 0 1 21 12V16.5A1 1 0 0 1 20 17.5H18A1 1 0 0 1 17 16.5V12A1 1 0 0 1 18 11Z', class: 'wm-k' }],
    ['path', { d: 'M5 6V9M5 15V18.5M12 2.5V5.5M12 12V15.5M19 8V11M19 17.5V21', class: 'wm-a' }],
  ]
}
