// forge/hand/gothic/globe-lock.mjs — the gothic orb (sapphire quarry sea, an emerald meridian lens, a gilded equator in
// a stone ring, built like `globe`) with a big ruby-and-gilt padlock set in its own moat at the lower right; the
// generated drawing split the sphere into four rainbow panes and hung a tiny lock on it that vanished at 16px.
// Glass goes first and the stone ring is laid over it as the came, and the lock is one gilt casting, so the painter
// keeps the vignettes, leads and glints within its byte budget.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const C = g.circle(10.6, 10.6, 8.6)
  const inner = g.shrink(C, 1.4)
  const body = g.rr(12.4, 15, 21.6, 21.6, 1.5)
  const shackle = g.stroke('M14.6 15.4 V12.9 A2.4 2.4 0 0 1 19.4 12.9 V15.4', 1.4)
  const hasp = g.union(g.circle(17, 12.9, 3.1), g.rect(13.9, 12.9, 20.1, 15.4))
  return paint([
    // the orb (K): sapphire sea, emerald meridian lens, stone ring, gilded equator
    g.glass(inner, 'c2', { tracery: 'quarry', medallion: false, s: 4.2, outline: 0 }),
    g.glass(g.inter(g.path('M10.6 2 C8.1 4.8 6.9 7.6 6.9 10.6 C6.9 13.6 8.1 16.4 10.6 19.2 C13.1 16.4 14.3 13.6 14.3 10.6 C14.3 7.6 13.1 4.8 10.6 2 Z'), inner), 'c4', { outline: 0.4, glint: false, glow: 0.22 }),
    g.stone(g.rim(C, 1.4)),
    g.gilt(g.inter(g.seg(1.5, 10.6, 19.7, 10.6, 1.4), g.shrink(C, 0.9)), { thin: true, outline: 0.32 }),
    // the padlock (S) in its moat: gilt shackle and case, ruby glass face, glowing keyhole
    g.cut(g.grow(g.union(body, hasp), 1.05)),
    g.gilt(g.union(shackle, body), { plate: 'S', glint: false }),
    g.glass(g.shrink(body, 1), 'c1', { plate: 'S', outline: 0.25, dark: 0.4 }),
    g.recess(g.union(g.circle(17, 17.7, 0.95), g.poly([[16.4, 18], [17.6, 18], [17.9, 19.9], [16.1, 19.9]])), { plate: 'S', glow: 'c3', glowOp: 0.5, outline: 0.2 }),
  ])
}
