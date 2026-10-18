// forge/hand/brutal/edit.mjs — a pink page open at its top-right corner and a real pencil writing into it: yellow body,
// blue eraser cap behind an ink band and a solid ink nib, casting its own hard shadow onto the page (the same pencil as
// the brutal pencil icon). Replaces the generated drawing, whose pencil was a plain yellow capsule with a thin ink seam,
// so at 16px it read as a yellow slash on a pink box rather than a pencil.
// House recipe: 2.2 ink outline, flat fills, hard ink shadow down-right. Roles: pencil c1, page c2, eraser c3, ink.
// Motion: pencil wm-k (the spec sways the whole icon on the nib at 9 15), page wm-a (parts.A), shadows wm-shadow.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)', C3 = 'var(--with-brutal-c3, #4D7CFE)'
const W = K.W, O = K.OFF, S = K.SHIFT
const f = n => +n.toFixed(2)
const AR = { M: 2, L: 2, A: 7, H: 1, V: 1, Z: 0 }
function sh(d, dx, dy) {
  let out = ''
  for (const [, cmd, args] of d.matchAll(/([A-Za-z])([^A-Za-z]*)/g)) {
    const n = (args.match(/-?\d*\.?\d+/g) || []).map(Number), k = AR[cmd]
    out += cmd
    for (let i = 0; i < n.length; i++) {
      const j = k ? i % k : 0
      let v = n[i]
      if (cmd === 'H') v += dx
      else if (cmd === 'V') v += dy
      else if (cmd === 'A') { if (j === 5) v += dx; if (j === 6) v += dy }
      else v += j % 2 ? dy : dx
      out += (i ? ' ' : '') + f(v)
    }
  }
  return out
}
const at = d => sh(d, S, S), sd = d => sh(d, S + O, S + O)

// skeleton space. The pencil's axis runs from the nib (9 15) to the cap centre (18.9 5.1), half-width 2.5.
const PENCIL = 'M9 15 L10.06 10.4 L17.13 3.33 A2.5 2.5 0 0 1 20.67 6.87 L13.6 13.94 Z'
const CAP = 'M15.72 4.74 L17.13 3.33 A2.5 2.5 0 0 1 20.67 6.87 L19.26 8.28 Z'
const NIB = 'M9 15 L10.06 10.4 L13.6 13.94 Z'
const BAND = 'M15.72 4.74 L19.26 8.28'
// the page: its outline runs into the pencil's outline at both ends and its colour closes under the pencil body, so the
// pencil lies on the page (no moat: in this style a moat fills with the page's shadow and rings the pencil in black)
const PAGE = 'M12.5 5 H5 A2 2 0 0 0 3 7 V19 A2 2 0 0 0 5 21 H17 A2 2 0 0 0 19 19 V11.5'
const PAGE_FILL = 'M12.5 5 H5 A2 2 0 0 0 3 7 V19 A2 2 0 0 0 5 21 H17 A2 2 0 0 0 19 19 V11.5 L15.5 8.5 Z'

export default function render() {
  const line = { stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['path', { d: sd(PAGE_FILL), fill: INK, class: 'wm-shadow' }],
    ['path', { d: sd(PAGE), fill: 'none', ...line, class: 'wm-shadow' }],
    ['path', { d: at(PAGE_FILL), fill: C2, class: 'wm-a' }],
    ['path', { d: at(PAGE), fill: 'none', ...line, class: 'wm-a' }],
    ['path', { d: sd(PENCIL), fill: INK, ...line, class: 'wm-shadow' }],
    ['path', { d: at(PENCIL), fill: C1, class: 'wm-k' }],
    ['path', { d: at(CAP), fill: C3, class: 'wm-k' }],
    ['path', { d: at(NIB), fill: INK, class: 'wm-k' }],
    ['path', { d: at(BAND), fill: 'none', ...line, 'stroke-width': 1.9, class: 'wm-k' }],
    ['path', { d: at(PENCIL), fill: 'none', ...line, class: 'wm-k' }],
  ]
}
