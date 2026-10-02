// Live icon: Wi-Fi strength, 0-3 arcs. Unlit arcs stay as dotted ghosts so strength reads without colour.
import { WIFI, dotsOnArc, sector } from './_parts-power.mjs'
import { arc, circle } from './_layout.mjs'
import { live } from './_font.mjs'

export default live({
  name: 'wifi-strength', title: 'Wi-Fi strength', category: 'devices',
  description: 'The Wi-Fi fan with as many arcs lit as you choose; the rest stay as dotted ghosts.',
  aliases: ['wifi-level', 'wifi-bars', 'wireless-strength', 'wifi-signal-level', 'wlan-strength', 'live-wifi'],
  tags: ['wifi', 'wireless', 'signal', 'network', 'level', 'live'],
  synonyms: ['wifi signal', 'weak wifi', 'full wifi', 'internet connection', 'hotspot', 'router', 'reception',
    'connection quality', 'wireless network', 'wlan', 'wi-fi', 'signal strength'],
  params: {
    strength: { type: 'int', min: 0, max: 3, default: 2, label: 'Arcs lit' },
    ghost: { type: 'bool', default: true, label: 'Show unlit arcs as dots' },
  },
  examples: [{ strength: 3 }, { strength: 2 }, { strength: 1 }, { strength: 0 }, { strength: 1, ghost: false }],
  build({ strength, ghost }) {
    const { cx, cy, radii, a } = WIFI
    const paths = [{ d: circle(cx, cy, WIFI.dotR), plate: 'K' }]
    radii.forEach((r, i) => {
      if (i < strength) paths.push({ d: arc(cx, cy, r, -a, a), plate: 'K' })
      else if (ghost) for (const d of dotsOnArc(cx, cy, r, -a, a, 6)) paths.push({ d, plate: 'A' })
    })
    // filled styles: the wedge up to the outermost lit arc, with the white bands between arcs knocked out
    if (!strength) return { paths, fills: [circle(cx, cy, WIFI.dotR + 1)], cutouts: [] }
    const fills = [sector(cx, cy, 0, radii[strength - 1], -a, a)]
    const edges = [WIFI.dotR + 1, ...radii.slice(0, strength).flatMap(r => [r - 1, r + 1])]
    const cutouts = []
    for (let k = 0; k + 1 < edges.length; k += 2) cutouts.push(sector(cx, cy, edges[k], edges[k + 1], -a - 15, a + 15))
    return { paths, fills, cutouts }
  },
})
