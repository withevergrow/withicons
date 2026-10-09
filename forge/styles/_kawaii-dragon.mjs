// KAWAII hand-drawn dragon head (forge/icons/dragon-head.json stays the base; this replaces only Kawaii's drawing).
// A chibi Lunar New Year dragon in kawaii line art: stubby gold antlers, a round red head with a long snout and a
// big nose with two nostrils, cream cheek tufts, little cream brows, big shiny eyes, pink blush, an open smile with
// two tiny fangs, long gold whiskers that curl, an orange pearl and a cream beard fringe.
// Slots in order of first appearance: head fill-1 (c1), antlers/whiskers sparkle (gold), cream fill-5, pearl fill-2.
import { G, disc, oval } from './_sticker-dragon.mjs'

const RED = 'var(--with-kawaii-fill-1, #FF5A5F)'
const GOLD = 'var(--with-kawaii-sparkle, #FFD23A)'
const CREAM = 'var(--with-kawaii-fill-5, #FFF4D6)'
const PEARL = 'var(--with-kawaii-fill-2, #FF9A3D)'
const BLUSH = 'var(--with-kawaii-blush, #FF6F9C)'
const FACE = 'var(--with-kawaii-face, currentColor)'
const SHINE = 'var(--with-kawaii-shine, #FFFFFF)'

export function kawaiiDragon() {
  const filled = (d, fill, extra = {}) => ['path', { d, fill, ...extra }]
  return [
    // gold antlers and whiskers: line casing with a gold core
    ['path', { d: G.antlers + G.whiskers, 'stroke-width': 1.85, class: 'wm-a' }],
    ['path', { d: G.antlers + G.whiskers, stroke: GOLD, 'stroke-width': 0.9, class: 'wm-a' }],
    // beard + cheek tufts behind the head
    filled(G.beard + G.tufts, CREAM, { 'stroke-width': 0.6 }),
    // head
    filled(G.head, RED, { 'stroke-width': 1.2, class: 'wm-k' }),
    ['path', { d: 'M7.1 9.6Q7.5 8 8.9 7.2', stroke: SHINE, 'stroke-width': 0.85, 'stroke-opacity': 0.9, class: 'wm-shine' }],
    // pearl
    filled(disc(...G.pearl), PEARL, { 'stroke-width': 0.9, class: 'wm-s' }),
    // soft brows
    filled('M7.3 9.4Q8.9 9.3 10.3 10.3Q8.8 10.6 7.3 9.4Z M16.7 9.4Q15.1 9.3 13.7 10.3Q15.2 10.6 16.7 9.4Z', CREAM, { 'stroke-width': 0.7, class: 'wm-a' }),
    // blush, big eyes with catch-lights
    filled(oval(7.6, 13.4, 0.9, 0.55) + oval(16.4, 13.4, 0.9, 0.55), BLUSH, { 'fill-opacity': 0.6, stroke: 'none' }),
    filled(disc(9.4, 12, 1) + disc(14.6, 12, 1), FACE, { stroke: 'none' }),
    filled(disc(9.1, 11.65, 0.36) + disc(14.3, 11.65, 0.36), SHINE, { stroke: 'none', class: 'wm-shine' }),
    // nose and nostrils
    filled(G.nose, RED, { 'stroke-width': 0.9 }),
    filled(G.nostrils, FACE, { stroke: 'none' }),
    // open smile with two fangs
    filled('M9.6 18Q12 20.4 14.4 18Z', FACE, { 'stroke-width': 0.7 }),
    filled('M10.3 18L10.8 18.8L11.3 18Z M12.7 18L13.2 18.8L13.7 18Z', SHINE, { stroke: 'none', class: 'wm-s' }),
  ]
}
