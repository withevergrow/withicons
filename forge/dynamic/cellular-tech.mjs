// Live icon: the mobile network badge ("5G", "LTE", "4G+", "EDGE") in a rounded chip, or bare.
import { fitText, text, asCutouts, clean, snap, live, markText } from './_font.mjs'
import { rr } from './_layout.mjs'
import { fitLabel } from './_parts-labels.mjs'

const CHIP = rr(2, 5, 22, 19, 3)
const IN_CHIP = { x0: 4.9, y0: 7.9, x1: 19.1, y1: 16.1 } // 2.9u inside the walls
const BARE = { x0: 2, y0: 8.5, x1: 22, y1: 15.5 } // centrelines may reach the live-area edge

export default live({
  name: 'cellular-tech', title: 'Network type', category: 'devices',
  description: 'The mobile network type you choose, such as 5G, LTE or 4G+, set in a rounded chip.',
  aliases: ['network-type', 'mobile-data-type', 'cell-tech', '5g-badge', 'lte-badge', 'network-badge', 'data-badge'],
  tags: ['cellular', 'network', '5g', 'lte', 'mobile', 'live'],
  synonyms: ['5g', '4g', 'lte', '3g', 'edge', 'mobile data', 'cellular data', 'data connection', 'carrier',
    'network speed', 'status bar', 'roaming'],
  params: {
    tech: { type: 'text', maxLength: 4, default: '5G', case: 'upper', label: 'Network (up to 4 characters)' },
    chip: { type: 'bool', default: true, label: 'Set it in a chip' },
  },
  examples: [{ tech: '5G' }, { tech: 'LTE' }, { tech: '4G+' }, { tech: 'EDGE' }, { tech: '3G', chip: false }, { tech: 'E' }],
  build({ tech, chip }) {
    const s = clean(tech, 4).trim() || '5G'
    // fit order: in the chip (cap >= 4.5), else bare (cap >= 4.5), else the first 3 characters bare.
    // A trailing "+" is set as a small superscript plus, so "4G+" keeps cap-5 letters instead of shrinking.
    const tries = chip ? [[s, IN_CHIP, true], [s, BARE, false]] : [[s, BARE, false]]
    tries.push([s.slice(0, 3), BARE, false])
    let hit = null
    for (const [str, box, inChip] of tries) { const t = setTech(str, box); if (t) { hit = { t, inChip }; break } }
    const glyphs = hit ? hit.t : []
    if (!glyphs.length) return { paths: [{ d: CHIP, plate: 'K' }], fills: [CHIP], cutouts: [] }
    if (!hit.inChip) return { paths: glyphs.map(d => ({ d, plate: 'K' })), fills: [], cutouts: [] }
    return {
      paths: [{ d: CHIP, plate: 'K' }, ...glyphs.map(d => ({ d, plate: 'A' }))],
      fills: [CHIP], cutouts: asCutouts(glyphs),
    }
  },
})

// text paths for the network name in box, or null when it would go below cap 4.5
function setTech(str, box) {
  const plus = str.length >= 2 && str.endsWith('+') && !str.slice(0, -1).includes('+')
  if (!plus) { const t = fitLabel(str, box, { minCap: 4.25, maxCap: 6.5 }); return t && t.paths }
  const P = 1.5, GAP = 2.75 // plus arm, gap to the letters (centrelines)
  const room = { ...box, x1: box.x1 - (2 * P + GAP) }
  const t0 = fitLabel(str.slice(0, -1), room, { minCap: 4.25, maxCap: 6.5 })
  if (!t0) return null
  // re-set the letters left-aligned in a box that centres letters + plus as one group (same cap, cut and spacing)
  const gw = t0.width + GAP + 2 * P, gx = snap((box.x0 + box.x1) / 2 - gw / 2)
  const u = fitLabel(str.slice(0, -1), { ...room, x0: gx, x1: gx + t0.width + 0.01 }, { minCap: t0.cap, maxCap: t0.cap, align: 'left' }) || t0
  const cx = snap(u.box.x1 + GAP + P), cy = snap(u.top + P)
  return [...u.paths, markText(`M${cx - P} ${cy} H${cx + P} M${cx} ${cy - P} V${cy + P}`, '+', u.cap)]
}
