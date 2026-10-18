// forge/hand/brutal/love-scroll.mjs — a love letter scroll in neo-brutalism: a flat yellow sheet between two tall
// orange rolls (wider than the sheet, each with an ink curl at one end), a small pink heart centred on the sheet with
// clear margins, and a wide green quill standing well clear to the right with its ink nib, every shape ringed in ink
// with one hard ink shadow. Replaces the earlier drawing, where the heart filled the sheet and the mostly-ink quill
// fused with the scroll. Roles: sheet c1, rolls accent, heart c2, quill c4 with a tint vein, outline + shadow ink.
// Motion: scroll wm-k, heart wm-a (beat about 10.25 11), quill wm-s (wiggle about 13 19).
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const C4 = 'var(--with-brutal-c4, #3DDC97)', ACC = 'var(--with-brutal-accent, #FF8A3D)'
const TINT = 'var(--with-brutal-tint, #FFF4D6)'
const W = K.W, O = K.OFF, S = K.SHIFT
const f = n => +n.toFixed(2)
const AR = { M: 2, L: 2, T: 2, C: 6, S: 4, Q: 4, A: 7, H: 1, V: 1, Z: 0 }
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
const LINE = { stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }

// skeleton space (24 grid)
const SHEET = 'M3 5 H12.5 V19 H3 Z'
const ROLL_T = 'M4.25 1.75 H11.25 A2.25 2.25 0 0 1 11.25 6.25 H4.25 A2.25 2.25 0 0 1 4.25 1.75 Z'
const ROLL_B = 'M4.25 17.75 H11.25 A2.25 2.25 0 0 1 11.25 22.25 H4.25 A2.25 2.25 0 0 1 4.25 17.75 Z'
const CURL = 'M4.25 3.25 A0.75 0.75 0 1 1 4.25 4.75 A0.75 0.75 0 1 1 4.25 3.25 Z M11.25 19.25 A0.75 0.75 0 1 1 11.25 20.75 A0.75 0.75 0 1 1 11.25 19.25 Z'
// heart about 5u wide, centred on the visible sheet (x 7.75, y 12)
const HEART = 'M7.75 14.25 C6.6 13.5 5.25 12.4 5.25 11 C5.25 10.15 5.9 9.5 6.65 9.5 C7.15 9.5 7.55 9.8 7.75 10.2 C7.95 9.8 8.35 9.5 8.85 9.5 C9.6 9.5 10.25 10.15 10.25 11 C10.25 12.4 8.9 13.5 7.75 14.25 Z'
// a wide feather leaning right, its nib clear of the scroll
const QUILL = 'M17.75 16.25 C15.75 11 17.25 5 22.25 1.75 C23.5 7.5 21.75 13 17.75 16.25 Z'
const NIB = 'M17.75 16.25 L17 19.75'
const VEIN = 'M18.25 14.25 C18.75 10.5 19.75 7.25 21.5 4.75'

export default function render() {
  return [
    ['path', { d: [SHEET, ROLL_T, ROLL_B, HEART, QUILL].map(sd).join(''), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: sd(NIB), fill: 'none', ...LINE, class: 'wm-shadow' }],
    ['path', { d: at(SHEET), fill: C1, ...LINE, class: 'wm-k' }],
    ['path', { d: at(ROLL_T) + at(ROLL_B), fill: ACC, ...LINE, class: 'wm-k' }],
    ['path', { d: at(CURL), fill: INK, class: 'wm-k' }],
    ['path', { d: at(HEART), fill: C2, ...LINE, class: 'wm-a' }],
    ['path', { d: at(NIB), fill: 'none', ...LINE, class: 'wm-s' }],
    ['path', { d: at(QUILL), fill: C4, ...LINE, class: 'wm-s' }],
    ['path', { d: at(VEIN), fill: 'none', stroke: TINT, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-s' }],
  ]
}
