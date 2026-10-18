// forge/hand/bauhaus/bat.mjs — the line bat: two red wings with a straight leading edge and three hanging points
// scalloped between concave arcs, a blue body with pointed ears and yellow eyes, all flat colour blocks.
import { path, flipX } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const wing = path('M14 8.5L22.25 5.25L22.25 12.5A3.1 3.1 0 0 0 17.75 13.25A3.2 3.2 0 0 0 14 15.5Z')
  return compose([
    ['c1', wing, flipX(wing)],
    ['c3', path('M9.75 5.5L11.5 8H12.5L14.25 5.5V14.25C14.25 16.5 13.25 18.25 12 18.25C10.75 18.25 9.75 16.5 9.75 14.25Z')],
    ['c2', path('M11.4 10.75a.85.85 0 1 1-1.7 0a.85.85 0 1 1 1.7 0ZM14.3 10.75a.85.85 0 1 1-1.7 0a.85.85 0 1 1 1.7 0Z')],
  ], icon)
}
