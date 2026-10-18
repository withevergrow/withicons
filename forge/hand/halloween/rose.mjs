// forge/hand/halloween/rose.mjs — a pumpkin-orange spiral bloom on a slime-green stem with two leaves, ink rim,
// no glow halo so the silhouette stays crisp at 16px.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), C4 = V('c4', '#86D13A')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-rose-${n}`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const BLOOM = 'M12 2.6C15.6 2.6 18 4.9 18 8.3C18 11.7 15.4 14.2 12 14.2C8.6 14.2 6 11.7 6 8.3C6 4.9 8.4 2.6 12 2.6Z'
const BLOOM_SH = 'M12.15 3.45C15.75 3.45 18.15 5.75 18.15 9.15C18.15 12.55 15.55 15.05 12.15 15.05C8.75 15.05 6.15 12.55 6.15 9.15C6.15 5.75 8.55 3.45 12.15 3.45Z'
const LEAF_L = 'M12 18C10.6 15.6 8 15 5.6 15.6C6.6 18 9.2 19 12 18Z'
const LEAF_R = 'M12 16.4C13.4 14 16 13.4 18.4 14C17.4 16.4 14.8 17.4 12 16.4Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 9.2, r: 7.4, fx: 10, fy: 6.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C1), st(0.5, C1), st(1, C2)]],
    ]],
    ['path', { d: BLOOM_SH, fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: 'M12 13.5V21.6', fill: 'none', stroke: INK, 'stroke-width': 2.6, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M12 13.5V21.6', fill: 'none', stroke: C4, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: LEAF_L, fill: C4, stroke: INK, 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: LEAF_R, fill: C4, stroke: INK, 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: BLOOM, fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.9, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M12.2 8.4C11.6 8 11.2 8.8 11.8 9.3C12.6 9.9 13.6 9 13.4 8C13.1 6.7 11.4 6.4 10.4 7.3C9.2 8.4 9.6 10.6 11.2 11.2C13 11.9 15.1 10.8 15.4 8.8C15.7 6.9 14.4 5.2 12.6 4.8', fill: 'none', stroke: INK, 'stroke-width': 0.85, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M7.6 7.4C7.9 5.6 9.2 4.4 10.8 4', fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-shine' }],
  ]
}
