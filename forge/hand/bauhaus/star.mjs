// forge/hand/bauhaus/star.mjs — the exemplar's split star (yellow | red) redrawn larger and sharper: the generated
// star rounded its 36-degree points so far back that it shrank to a stubby blob; this one uses fuller 52-degree points
// with a tight tip round, so the five points survive at 16px.
import * as P from '../../styles/_bauhaus-prim.mjs'
import * as K from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const pts = P.star(12, 12.75, 11.5, 5.75, 5)
  const body = P.poly(pts, pts.map((_, i) => (i % 2 ? 0.9 : 1.1)))
  return compose(K.split(body, 'c1', 'c2', 12, 12, 90), icon)
}
