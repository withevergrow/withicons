// RETRO hand-drawn dragon head (forge/icons/dragon-head.json stays the base; this replaces only Retro's drawing).
// A 70s festival patch: a coral-red dragon in a chunky ink outline with sunset-gold antlers and whiskers, cream cheek
// tufts, brows and beard, an orange pearl, a big nose with nostrils, an open mouth with teeth and the hard brown
// offset print shadow. Slots: head retro-3 (c1), antlers/whiskers retro-1 (c2), pearl retro-2, cream fixed.
import { G, disc } from './_sticker-dragon.mjs'

const PALETTE = { 1: '#F4B53F', 2: '#EF7D2D', 3: '#DE4B3A', 4: '#178A86', shadow: '#6B3323', letter: '#2A160E' }
const paint = (k, hex) => `var(--with-retro-${k}, ${hex || PALETTE[k]})`
const CREAM = '#FFF3D9'
// shift a path made only of absolute M/L/C/Z coordinate pairs
const shift = (d, dx, dy) => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)

export function retroDragon() {
  const line = (d, w, cls) => ['path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(cls ? { class: cls } : {}) }]
  const fill = (d, k, hex, cls) => ['path', { d, fill: paint(k, hex), ...(cls ? { class: cls } : {}) }]
  return [
    ['path', { d: shift(G.head + G.tufts + G.beard, 0.9, 0.9), fill: paint('shadow'), stroke: paint('shadow'), 'stroke-width': 1.5, class: 'wm-shadow' }],
    line(G.antlers + G.whiskers, 2.3, 'wm-a'),
    ['path', { d: G.antlers + G.whiskers, fill: 'none', stroke: paint(1), 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    fill(G.beard + G.tufts, 'tint', CREAM), line(G.beard + G.tufts, 0.6),
    fill(G.head, 3, null, 'wm-k'), line(G.head, 1.2),
    fill(disc(...G.pearl), 2, null, 'wm-s'), line(disc(...G.pearl), 0.8),
    fill(G.brows, 'tint', CREAM, 'wm-a'), line(G.brows, 0.6, 'wm-a'),
    ['path', { d: disc(...G.eyes[0], 0.75) + disc(...G.eyes[1], 0.75) + G.nostrils, fill: paint('letter') }],
    fill(G.nose, 3), line(G.nose, 0.8),
    ['path', { d: G.nostrils, fill: paint('letter') }],
    ['path', { d: G.mouth, fill: paint('letter') }],
    fill(G.teeth, 'tint', CREAM, 'wm-s'),
  ]
}
