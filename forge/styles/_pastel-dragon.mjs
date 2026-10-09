// PASTEL hand-drawn dragon head (forge/icons/dragon-head.json stays the base; this replaces only Pastel's drawing).
// Registered in _pastel-redraws.mjs like any redraw chunk: (icon, p) => layers (forge/styles/PASTEL-GUIDE.md).
// A soft blush dragon face (c1) narrowing into a long snout, butter antlers and curling whiskers (c2), paper cheek
// tufts, brows and beard, a peach pearl (c3), ink eyes, nostrils and an ink mouth with paper teeth.
import { G } from './_sticker-dragon.mjs'

export const R = {
  'dragon-head': (icon, p) => [
    ['paper', p.path(G.tufts), p.path(G.beard)],
    ['blush@K', p.path(G.head)],
    ['butter.flat@A', p.stroke(G.antlers, 1.6), p.stroke(G.whiskers, 1.3)],
    ['paper@A', p.path(G.brows)],
    ['peach.flat@S', p.circle(...G.pearl)],
    ['blush.flat', p.path(G.nose)],
    ['ink', p.dot(...G.eyes[0], 0.8), p.dot(...G.eyes[1], 0.8), p.path(G.nostrils), p.path(G.mouth)],
    ['paper.flat@S', p.path(G.teeth)],
  ],
}
