// Live icon: a document with its file type written across it ("PDF", "DOC", "CSV", "ZIP").
// The document is the shared PARTS.md document. Short types (1-2 narrow characters) sit inside the page; longer
// ones run across a label band wider than the page, and the side walls open where the letters pass.
import { fitFirst, fitLadder, textInk, wallCut, bandAround, bandLobes, snap } from './_parts-labels.mjs'
import { live } from './_font.mjs'

const DOC = 'M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z'
const FOLD = 'M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19'
const INSIDE = { x0: 8.25, y0: 10.75, x1: 15.75, y1: 18.25 } // centrelines inside the page walls
const ACROSS = { x0: 3.5, y0: 10.75, x1: 20.5, y1: 16.25 }  // across the band: clears the fold and the bottom corners

export default live({
  name: 'file-type', title: 'File type', category: 'files',
  description: 'A document labelled with its file type, such as PDF, DOC, CSV or ZIP.',
  aliases: ['file-extension', 'file-format', 'document-type', 'filetype', 'extension-badge'],
  tags: ['file', 'document', 'format', 'extension'],
  synonyms: ['pdf', 'doc', 'docx', 'csv', 'zip', 'xls', 'txt', 'json', 'svg', 'png', 'jpg', 'mp3', 'mp4', 'attachment'],
  params: {
    type: { type: 'text', maxLength: 4, default: 'PDF', case: 'upper', label: 'File type' },
  },
  examples: [{ type: 'PDF' }, { type: 'DOC' }, { type: 'CSV' }, { type: 'ZIP' }, { type: 'XLSX' }, { type: 'JS' }],
  build({ type }) {
    const s = type || 'FILE'
    // 1-2 characters can sit inside the page at a large size; everything else crosses the band
    const inside = s.length <= 2 && fitFirst([s], INSIDE, { minCap: 5.5, maxCap: 7 })
    const fit = inside || fitLadder(s, ACROSS, { minCap: 4, maxCap: 5.5 })
    const t = fit && fit.t
    const ink = textInk(t, 'A')
    const b = t && t.box
    const cl = b && wallCut(5, b), cr = b && wallCut(19, b)
    const paths = [], fills = [DOC]
    if (!cl && !cr) paths.push({ d: DOC, plate: 'K' })
    else {
      // walls open where the text passes; the cut never reaches the corners (ACROSS keeps it inside 7.5..19.5)
      const l0 = cl ? cl[0] : 19.5, r0 = cr ? Math.max(7.5, cr[0]) : 19.5
      const l1 = cl ? cl[1] : 19.5, r1 = cr ? cr[1] : 19.5
      paths.push({ d: `M5 ${snap(l0)} V4.5 A2 2 0 0 1 7 2.5 H14 L19 7.5${r0 > 7.5 ? ` V${snap(r0)}` : ''}`, plate: 'K' })
      paths.push({ d: `M5 ${snap(l1)}${l1 < 19.5 ? ' V19.5' : ''} A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5${r1 < 19.5 ? ` V${snap(r1)}` : ''}`, plate: 'K' })
      // the label band under the letters, so filled styles knock the type out of solid mass (one outline)
      const band = bandAround(b), { L, R } = bandLobes(band, 5, 19)
      fills[0] = `M7 2.5 H14 L19 7.5 ${R}V19.5 A2 2 0 0 1 17 21.5 H7 A2 2 0 0 1 5 19.5 ${L}V4.5 A2 2 0 0 1 7 2.5 Z`
    }
    paths.push({ d: FOLD, plate: 'A' }, ...ink.paths)
    return { paths, fills, cutouts: [FOLD, ...ink.cutouts] }
  },
})
