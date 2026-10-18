// Live icon: a folder with a label on its front ("2025", "DOCS", "A-F", "TAX").
// The folder is the PARTS.md folder grown 1u up and 1u down (4..21) so a label row fits under the tab.
// Short labels sit inside; longer ones run the full width, the side walls opening where the letters pass.
import { fitFirst, fitLadder } from './_parts-labels.mjs'
import { rr } from './_layout.mjs'
import { live, asCutouts } from './_font.mjs'

// A folder seen from the front: the back with its tab, and the FRONT as a solid panel carrying the label knocked
// out (outline styles fill the "badge:" panel, filled styles take it as a part on its own moat), the two-tone folder
// every file manager draws. The back shows as the tab and a 2u lip above the front.
const BACK = 'M2 9 V6 A2 2 0 0 1 4 4 H8.5 L10.5 6 H20 A2 2 0 0 1 22 8 V9'
const FRONT = { x0: 2, y0: 10, x1: 22, y1: 21, r: 2.5 }
const BOX = { x0: 4, y0: 12, x1: 20, y1: 19 }    // text centrelines: 2u inside the front

export default live({
  name: 'folder-label', title: 'Labelled folder', category: 'files',
  description: 'A folder with a short label on its front, such as a year, a letter range or a project code.',
  aliases: ['labeled-folder', 'labelled-folder', 'named-folder', 'folder-name', 'folder-tag', 'tagged-folder'],
  tags: ['folder', 'label', 'files', 'organize'],
  synonyms: ['directory', 'archive', 'category', 'filing', 'year', 'project', 'collection', 'drawer', 'organise', 'sort', 'index'],
  params: {
    text: { type: 'text', maxLength: 4, default: 'DOCS', case: 'upper', label: 'Label' },
  },
  examples: [{ text: 'DOCS' }, { text: '2025' }, { text: 'A-F' }, { text: 'TAX' }, { text: '7' }, { text: 'WWWW' }],
  build({ text }) {
    const s = text || 'DOCS'
    const fit = fitFirst([s], BOX, { minCap: 4, maxCap: 5 }) || fitLadder(s, BOX, { minCap: 3.75, maxCap: 5 })
    const t = fit && fit.t
    const F = FRONT, front = rr(F.x0, F.y0, F.x1, F.y1, F.r)
    return {
      paths: [{ d: BACK, plate: 'K' }, { d: front, plate: 'S', id: 'badge:front' }, ...(t ? t.paths.map(d => ({ d, plate: 'S' })) : [])],
      fills: ['M2 9 V6 A2 2 0 0 1 4 4 H8.5 L10.5 6 H20 A2 2 0 0 1 22 8 V9 Z', front],
      cutouts: t ? asCutouts(t.paths) : [],
    }
  },
})
