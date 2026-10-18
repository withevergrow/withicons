// forge/hand/bauhaus/files.mjs — the file family's blue page with its yellow dog-ear, and one whole red sheet
// behind it, offset up-left and moated off the front page; replaces a thin softened L that read as a bracket.
import { rr } from '../../styles/_bauhaus-prim.mjs'
import { page } from '../../styles/_bauhaus-kit.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['c1', rr(2.5, 2, 15, 17.5, 2.5)],
    ['cut', rr(6.25, 5.25, 21.75, 23.25, 3.75)],
    ...page('c3', 'c2', 7.5, 6.5, 20.5, 22, 4.5),
  ], icon)
}
