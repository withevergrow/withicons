// forge/hand/sketch/tombstone.mjs — the arched headstone carries an engraved cross instead of two bars, so it reads as
// a grave rather than an equals sign, standing on a ground line with two grass tufts.
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${Math.round((+x + dx) * 100) / 100} ${Math.round((+y + dy) * 100) / 100}`)
const STONE = 'M6.1 21Q5.95 15.2 6 9.6Q6.1 3.55 12 3.5Q17.9 3.55 18 9.6Q18.05 15.2 17.9 21M1.9 20.55Q12 20.35 22.1 20.6'
const CROSS = 'M12 7.9Q12.1 11.4 12 15.1M9.6 10.35Q12 10.25 14.4 10.4'
export default function render() {
  return [
    ['path', { d: 'M9.6 18.8L12.4 16.6M13.2 18.85L16.1 16.6', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: g(STONE), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: STONE, class: 'wm-k' }],
    ['path', { d: CROSS + 'M3.9 20.4Q3.5 19.2 3.15 17.9M20.1 20.4Q20.5 19.2 20.85 17.9', class: 'wm-a' }],
  ]
}
