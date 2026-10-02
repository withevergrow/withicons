// Live icon: a map pin with a number or letter in its head (route stops, search results, clusters).
import { asCutouts, live } from './_font.mjs'
import { fitChain, dot } from './_parts-misc.mjs'

// the static map-pin's teardrop, grown to a head of r 8 so a cap-7 digit fits (same 4u from head to tip)
const PIN = 'M20 10 C20 14.5 16 18.5 12 22 C8 18.5 4 14.5 4 10 A8 8 0 0 1 20 10 Z'

export default live({
  name: 'map-pin-number', title: 'Map pin number', category: 'maps',
  description: 'A map pin with a number or letter in its head, for numbered stops, results and places.',
  aliases: ['numbered-pin', 'pin-number', 'numbered-marker', 'map-marker-number', 'location-number', 'waypoint-number', 'stop-number'],
  tags: ['map', 'pin', 'marker', 'number', 'location'],
  synonyms: ['route stop', 'search result', 'place number', 'step', 'waypoint', 'delivery stop', 'cluster', 'pin a', 'pin b'],
  params: {
    label: { type: 'text', maxLength: 2, default: '3', case: 'upper', label: 'Number or letter' },
  },
  examples: [{ label: '1' }, { label: '7' }, { label: 'A' }, { label: '12' }, { label: '99' }, { label: '' }],
  build({ label }) {
    const s = String(label || '').trim()
    // head text sits on the head's centre or a touch lower, where the teardrop is widest
    const hit = fitChain([s, s.slice(0, 1)], { outline: PIN, cx: 12, ys: [10, 10.25, 10.5, 10.75], minCap: 4 })
    if (!hit) {
      // nothing to show: the classic pin with its ring
      const ring = dot(12, 10, 3)
      return { paths: [{ d: PIN, plate: 'K' }, { d: ring, plate: 'A' }], fills: [PIN], cutouts: [ring] }
    }
    const txt = hit.t.paths
    return {
      paths: [{ d: PIN, plate: 'K' }, ...txt.map(d => ({ d, plate: 'A' }))],
      fills: [PIN],
      cutouts: asCutouts(txt),
    }
  },
})
