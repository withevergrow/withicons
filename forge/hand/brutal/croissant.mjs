// forge/hand/brutal/croissant.mjs — a chunky crescent croissant: yellow arch body with three ink ridge seams,
// hard ink shadow down-right and a paper keyline behind it all so the ink outline survives on dark pages.
const INK = 'var(--with-brutal-ink, #16130F)'
const C1 = 'var(--with-brutal-c1, #FFD23F)'
const PAPER = 'var(--with-brutal-shine, #FFFDF5)'
// paper keyline behind every part (the brutal sticker edge): invisible on light pages, keeps the ink readable on dark
const halo = nodes => nodes.map(([t, a]) => [t, { ...a, fill: a.fill === 'none' ? 'none' : PAPER, stroke: PAPER, 'stroke-width': +((+a['stroke-width'] || 0) + 1.6).toFixed(2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shadow' }])
const f = n => +n.toFixed(2)
const P=[[2,17.5],"C",[2.5,9],[7,5],[12,5],"C",[17,5],[21.5,9],[22,17.5],"C",[20,17],[18.5,16],[17.5,15],"C",[16,12.5],[14.5,12],[12,12],"C",[9.5,12],[8,12.5],[6.5,15],"C",[5.5,16],[4,17],[2,17.5]]
const body = (d = 0) => "M" + P.map(p => typeof p === "string" ? p : f(p[0] + d) + " " + f(p[1] + d)).join(" ").replace(/ C /g, "C") + "Z"
export default function render() {
  const shadow = ['path', { d: body(1.25), fill: INK, class: 'wm-shadow' }]
  const main = ['path', { d: body(), fill: C1, stroke: INK, 'stroke-width': 2.2, 'stroke-linejoin': 'round', class: 'wm-k' }]
  return [
    ...halo([shadow, main]),
    shadow, main,
    ['path', { d: 'M7.4 6.6C8.7 8.5 9.2 10.6 8.9 12.8M12 5.4V11.6M16.6 6.6C15.3 8.5 14.8 10.6 15.1 12.8', fill: 'none', stroke: INK, 'stroke-width': 2.2, 'stroke-linecap': 'round', class: 'wm-k' }],
  ]
}
