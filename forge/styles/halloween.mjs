// HALLOWEEN: creative (site group "Holidays"). Spooky-cute and polished, for seasonal campaigns, app themes and
// social posts. Build logic lives in _halloween-core.mjs; colours and palettes in _halloween-palettes.mjs.
import { halloweenNodes, fallback } from './_halloween-core.mjs'
import { snowmanNodes } from './_holiday-snowman.mjs'
import { dragonNodes } from './_holiday-dragon.mjs'

export default {
  name: 'halloween',
  title: 'Halloween',
  kind: 'creative',
  description: 'Spooky-cute Halloween: chunky pumpkin, witch-purple, midnight and bone-white forms with a dark outline, carved details glowing with candlelight, slime goo dripping from broad edges, peeking eyes, and a tiny bat, spider or moon.',
  strokeWidth: false,
  root: { fill: 'none' },
  render(icon) {
    if (icon.name === 'snowman' && !icon.params) { try { return snowmanNodes('halloween') } catch { /* below */ } }
    if (icon.name === 'dragon-head' && !icon.params) { try { return dragonNodes('halloween') } catch { /* below */ } }
    try {
      const nodes = halloweenNodes(icon)
      if (nodes && nodes.length > 1) return nodes
    } catch { /* degrade below: never throw */ }
    try { return fallback(icon) } catch { return [] }
  },
}
