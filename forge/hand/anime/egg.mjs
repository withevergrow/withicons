// forge/hand/anime/egg.mjs — the new tapered egg skeleton in anime: a cream shell (not a gold blob that read as a
// lemon or bean) with a narrow top and full base, a lavender cel shadow lower right and one short white streak on
// the lit shoulder, sitting on a soft contact shadow.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const shell = k.path('M12 2.7 C14.75 2.7 18.4 8 18.4 13.4 C18.4 18.3 15.5 21 12 21 C8.5 21 5.6 18.3 5.6 13.4 C5.6 8 9.25 2.7 12 2.7 Z')
  const ops = [
    k.surf(shell, 'tint', { shine: 'none', shade: 1.25 }),
    k.shine(k.lens(8.5, 12.4, 10.6, 7.6, 0.55)),
    k.sparkleAt(19.4, 4.6, 1.7, { mx: -1, my: 1 }),
  ]
  return compose(ops, { seed: icon.name })
}
