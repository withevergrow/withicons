// Live icon: a folder with a label on its front ("2025", "DOCS", "A-F", "TAX").
// The folder is the PARTS.md folder grown 1u up and 1u down (4..21) so a label row fits under the tab.
// Short labels sit inside; longer ones run the full width, the side walls opening where the letters pass.
import { fitFirst, fitLadder, textInk, boxDist, wallCut, bandAround, bandLobes } from './_parts-labels.mjs'
import { live } from './_font.mjs'

const FOLDER = 'M3 6 A2 2 0 0 1 5 4 H9 L11 6 H19 A2 2 0 0 1 21 8 V18.5 A2.5 2.5 0 0 1 18.5 21 H5.5 A2.5 2.5 0 0 1 3 18.5 Z'
const INSIDE = { x0: 6.25, y0: 11.25, x1: 17.75, y1: 17.75 }
const ACROSS = { x0: 3.5, y0: 11.25, x1: 20.5, y1: 16.75 }

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
    const inside = fitFirst([s], INSIDE, { minCap: 5, maxCap: 6.5 })
    const fit = inside || fitLadder(s, ACROSS, { minCap: 4, maxCap: 5.5 })
    const t = fit && fit.t, ink = textInk(t, 'A')
    const paths = [], fills = [FOLDER]
    if (!t || inside) paths.push({ d: FOLDER, plate: 'K' })
    else {
      const b = t.box
      const cl = wallCut(3, b), cr = wallCut(21, b)
      const a = cl ? Math.max(6, cl[0]) : 18.5, ar = cr ? Math.max(8, cr[0]) : 18.5
      paths.push({ d: `M3 ${a}${a > 6 ? ' V6' : ''} A2 2 0 0 1 5 4 H9 L11 6 H19 A2 2 0 0 1 21 8${ar > 8 ? ` V${ar}` : ''}`, plate: 'K' })
      const start = cl && cl[1] <= 18.5 ? `M3 ${cl[1]} V18.5 A2.5 2.5 0 0 0 5.5 21` : boxDist([3.5, 20], b) >= 3 ? 'M3.5 20 A2.5 2.5 0 0 0 5.5 21' : 'M5.5 21'
      const end = cr && cr[1] <= 18.5 ? ` A2.5 2.5 0 0 0 21 18.5 V${cr[1]}` : boxDist([20.5, 20], b) >= 3 ? ' A2.5 2.5 0 0 0 20.5 20' : ''
      paths.push({ d: `${start} H18.5${end}`, plate: 'K' })
      const band = bandAround(b, { dy: 1.5 }), lobes = bandLobes(band, 3, 21)
      fills[0] = `M5 4 H9 L11 6 H19 A2 2 0 0 1 21 8 ${lobes.R}V18.5 A2.5 2.5 0 0 1 18.5 21 H5.5 A2.5 2.5 0 0 1 3 18.5 ${lobes.L}V6 A2 2 0 0 1 5 4 Z`
    }
    return { paths: [...paths, ...ink.paths], fills, cutouts: ink.cutouts }
  },
})
