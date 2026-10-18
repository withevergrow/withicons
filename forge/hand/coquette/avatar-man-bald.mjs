// forge/hand/coquette/avatar-man-bald.mjs: the bald man avatar without the hair bow (it read as a girl); ears, smile and
// the satin shirt stay.
import { people, recolor } from '../../styles/_coquette-people.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render(icon) {
  const parts = people(icon).filter(p => !(p.mat === 'bowp' && p.plate === 'deco'))
  return recolor(paint(parts, { cast: 'ink' }), icon)
}
