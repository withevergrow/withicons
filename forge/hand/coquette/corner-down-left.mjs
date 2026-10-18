// forge/hand/coquette/corner-down-left.mjs — the arrows family build: a blush satin ribbon that drops and turns left
// to a broad head, with a small bow tied on the tail end, well clear of the head; the arrow and its bow both carry
// wm-a so the spec's head-led nudge moves them as one.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.body(k.union(k.tube('M19 7 V10.6 A4.6 4.6 0 0 1 14.4 15.2 H5', 3), k.tube('M10.2 10 L5 15.2 L10.2 20.4', 3)), { plate: 'A' }),
    k.bow(19, 5.9, 0.6, 0, { plate: 'A' }),
  ]].flat(Infinity).filter(Boolean))
}
