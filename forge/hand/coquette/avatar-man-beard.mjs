// forge/hand/coquette/avatar-man-beard.mjs: the man avatar without the hair bow; coquette stays in the palette and a small
// ribbon-red bow tie at the collar.
import { people, recolor } from '../../styles/_coquette-people.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'
import * as K from '../../styles/_coquette-kit.mjs'

export default function render(icon) {
  const parts = people(icon).filter(p => !(p.mat === 'bowp' && p.plate === 'deco'))
  parts.push(...K.bow(12, 18.9, 0.5, 0, { mat: 'bowp' }))
  return recolor(paint(parts, { cast: 'ink' }), icon)
}
