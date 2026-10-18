// forge/hand/coquette/avatar-person.mjs: the dressed person avatar without the hair bow.
import { people, recolor } from '../../styles/_coquette-people.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render(icon) {
  const parts = people(icon).filter(p => !(p.mat === 'bowp' && p.plate === 'deco'))
  return recolor(paint(parts, { cast: 'ink' }), icon)
}
