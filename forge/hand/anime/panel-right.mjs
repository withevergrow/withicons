// forge/hand/anime/panel-right.mjs — a window with an inspector pane on the right: cream frame, a heavy ink divider,
// a glossy sky side pane holding three cream property rows, and a light ink heading in the main area, so it reads as
// app chrome at 16px instead of a notebook with a blue spine.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const win = k.rr(3, 3, 21, 21, 2.4)
  const ops = [
    k.surf(win, 'tint', { shine: 'none' }),
    k.surf(k.clip(win, k.rect(14.6, 2, 22, 22)), 'c1', { cast: false, shineSize: 0.6 }),
    k.paint(k.join(k.pill(16.4, 7.4, 19.2, 8.6), k.pill(16.4, 10.4, 19.2, 11.6), k.pill(16.4, 13.4, 18.2, 14.6)), 'tint', { part: 'a' }),
    k.ink([[[14.6, 3.4], [14.6, 20.6]]], { w: 1.25, taper: false, shift: 0 }),
    k.ink([[[6.2, 7.4], [11.2, 7.4]], [[6.2, 10.4], [9.8, 10.4]]], { w: 0.8 }),
  ]
  return compose(ops, { seed: icon.name })
}
