// forge/hand/bauhaus/santa-hat.mjs — Santa hat: a red cone with a clear fold flopping right, a cream fur brim and
// pom-pom outlined in ink so they belong to the hat and stay legible at 16px.
import { path, pill, circle, stroke } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const CONE = 'M5 17.5C5 10 7.5 4 12.5 4C16 4 18 6.5 18.5 9.5L15.5 10.5C15 9 14.25 8 13.5 7.75C13.5 11 14.5 14.5 16.5 17.5Z'

export default function render(icon) {
  return compose([
    ['c1', path(CONE)],
    ['ink', stroke('M13.5 7.75C14.5 8 15.25 9 15.5 10.5', 1.25)],
    ['tint', circle(18.5, 10.5, 2.75)],
    ['ink', stroke('M15.75 10.5A2.75 2.75 0 0 1 21.25 10.5A2.75 2.75 0 0 1 15.75 10.5Z', 1.25)],
    ['tint', pill(3, 16, 21, 21.5)],
    ['ink', stroke('M5.75 16H18.25A2.75 2.75 0 0 1 18.25 21.5H5.75A2.75 2.75 0 0 1 5.75 16Z', 1.25)],
  ], icon)
}
