// forge/hand/anime/captions.mjs — closed captions as the skeleton now draws them: a glossy sky screen box with a dark
// ink glass panel carrying a bold cream CC mark (plate A, it fills in), replacing the old text-bar card that read as
// a keyboard.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const cc = k.join(
    k.stroke('M10.4 8.9 H8.7 C7.3 8.9 6.3 9.9 6.3 11.3 V12.7 C6.3 14.1 7.3 15.1 8.7 15.1 H10.4', 1.9),
    k.stroke('M17.7 8.9 H16 C14.6 8.9 13.6 9.9 13.6 11.3 V12.7 C13.6 14.1 14.6 15.1 16 15.1 H17.7', 1.9),
  )
  const ops = [
    k.surf(k.rr(2.4, 4.2, 21.6, 19.8, 2.4), 'c1', { shineSize: 0.85 }),
    k.surf(k.rr(4.3, 6.1, 19.7, 17.9, 1.4), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
    k.paint(cc, 'tint', { part: 'a' }),
  ]
  return compose(ops, { seed: icon.name })
}
