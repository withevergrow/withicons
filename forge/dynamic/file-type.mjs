// Live icon: a document with its file type written across it ("PDF", "DOC", "CSV", "ZIP").
// The document is the shared PARTS.md document. Short types (1-2 narrow characters) sit inside the page; longer
// ones run across a label band wider than the page, and the side walls open where the letters pass.
import { fitFirst, fitLadder, boxDist } from './_parts-labels.mjs'
import { clipD } from './_parts-counts.mjs'
import { rr } from './_layout.mjs'
import { live, asCutouts } from './_font.mjs'

// A whole document page (the static `file` page and fold) with a SOLID LABEL laid across its lower half: the type
// is knocked out of the label in every style (outline styles fill the "badge:" panel, filled styles take it as a
// badge on its own moat). The label overhangs the page by 3u each side, so it reads as a tag on a file at 16px.
const PAGE = 'M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z'
const FOLD = 'M14 2.5 V6 A1.5 1.5 0 0 0 15.5 7.5 H19'
const LABEL = { x0: 2, y0: 10.5, x1: 22, y1: 18.5, r: 2.5 }
const BOX = { x0: 4.6, y0: 12.5, x1: 19.4, y1: 16.5 } // text centrelines 2.6u in from the label's ends: >= 1u of white at every weight
// the page's mass where it shows: above the label and its foot below (a tint never shows through the type)
const PAGE_FILLS = ['M7 2.5 H14 L19 7.5 V10.5 H5 V4.5 A2 2 0 0 1 7 2.5 Z', 'M5 18.5 H19 V19.5 A2 2 0 0 1 17 21.5 H7 A2 2 0 0 1 5 19.5 Z']
const CLEAR = 2.75                                 // page centreline <-> label edge: 0.875 + 1 white + 0.875

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
    // one cap for every type (PDF and XLSX look like siblings), condensed when the word is long
    const fit = fitFirst([s], BOX, { minCap: 4, maxCap: 4 }) || fitLadder(s, BOX, { minCap: 3.5, maxCap: 4 })
    const t = fit && fit.t
    const L = LABEL, label = rr(L.x0, L.y0, L.x1, L.y1, L.r)
    // the page gives way round the label (a clear moat), lines stay lines and arcs stay arcs
    const away = q => boxDist(q, { x0: L.x0, y0: L.y0, x1: L.x1, y1: L.y1 }) >= CLEAR - 0.875 && !(q[1] > L.y0 - CLEAR && q[1] < L.y1 + CLEAR)
    const page = clipD(PAGE, away), fold = clipD(FOLD, away)
    return {
      paths: [{ d: page, plate: 'K' }, { d: fold, plate: 'A' }, { d: label, plate: 'S', id: 'badge:label' }, ...(t ? t.paths.map(d => ({ d, plate: 'S' })) : [])],
      fills: [...PAGE_FILLS, label],
      cutouts: [FOLD, ...(t ? asCutouts(t.paths) : [])],
    }
  },
})
