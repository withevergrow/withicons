// forge/hand/bauhaus/tombstone.mjs — a blue arched headstone with a cream cross (the two text bars read as "="),
// standing on a green grass pill with two small tufts at its foot.
import * as Prim from '../../styles/_bauhaus-prim.mjs'
import * as Kit from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const p = { ...Prim, ...Kit }
  return compose([
    ['c3', p.arch(5.75, 3, 18.25, 20.5)],
    ['tint', p.seg2(12, 7.5, 12, 15.5, 2.25), p.seg2(9.25, 10.25, 14.75, 10.25, 2.25)],
    ['accent', p.pill(2.5, 19.25, 21.5, 21.75)],
  ], icon)
}
