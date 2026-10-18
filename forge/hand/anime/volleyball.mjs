// forge/hand/anime/volleyball.mjs - the volleyball: a glossy cream ball with the skeleton's three curved spokes and
// three long wrapping seams, so it reads as stitched panels and not a swirl.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

const S = 0.96
const T = v => +(12 + (v - 12) * S).toFixed(2)
const R = v => +(v * S).toFixed(2)

export default function render(icon) {
  const ball = k.circle(12, 12, 9.1)
  const spoke = (x, y) => `M12 12 A${R(9.5)} ${R(9.5)} 0 0 0 ${T(x)} ${T(y)}`
  const wrap = (a, b, c, d) => `M${T(a)} ${T(b)} A${R(13.5)} ${R(13.5)} 0 0 1 ${T(c)} ${T(d)}`
  return compose([
    k.surf(ball, 'tint', { shine: 'streak', shineSize: 0.9 }),
    k.ink([
      spoke(20.23, 7.25), spoke(12, 21.5), spoke(3.77, 7.25),
      wrap(21.5, 12.09, 10.76, 15.94), wrap(7.17, 20.18, 9.2, 8.96), wrap(7.33, 3.73, 16.03, 11.1),
    ], { w: 0.85, taper: false, shift: 0 }),
  ], { seed: icon.name })
}
