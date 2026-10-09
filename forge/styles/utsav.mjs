// UTSAV — creative. Indian festive and ethnic icons: Diwali marigold and diya light, Durga Puja red and white
// alpana, handcrafted but refined. Build logic lives in _utsav-core.mjs.
import { utsavNodes } from './_utsav-core.mjs'
import { snowmanNodes } from './_holiday-snowman.mjs'
import { dragonNodes } from './_holiday-dragon.mjs'

export default {
  name: 'utsav',
  title: 'Utsav',
  kind: 'creative',
  description: 'Indian festive craft: warm marigold forms with a plum outline, a fine gold inner line, rangoli dot-work, rosette badges and a tiny diya flame.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    if (icon.name === 'snowman' && !icon.params) { try { return snowmanNodes('utsav') } catch { /* below */ } }
    if (icon.name === 'dragon-head' && !icon.params) { try { return dragonNodes('utsav') } catch { /* below */ } }
    return utsavNodes(icon)
  },
}
