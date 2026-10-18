// forge/hand/chrome/share-2.mjs — share sheet as solid chrome slabs: a thick open-top tray (U slab) and a filled
// arrow rising out of it, with a clear gap between them so they stay apart at 16px. Both bodies go through the
// style's own layers (_chrome-core), so they get the same horizon band, warm reflection, bevel and shine as
// clipboard, copy and download.
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// tray: U slab, walls 3.2 thick, open top between x 7.7 and 16.3
const TRAY = [[3, 11], [7.7, 11], [7.7, 17.3], [16.3, 17.3], [16.3, 11], [21, 11], [21, 21.5], [3, 21.5]]
// arrow: chunky head + shaft, ending above the tray floor with a gap
const ARROW = [[12, 1.8], [18, 7.8], [14.3, 7.8], [14.3, 15.4], [9.7, 15.4], [9.7, 7.8], [6, 7.8]]

export default function render(icon) {
  const name = (icon && icon.name) || 'share-2'
  const K = F.region([TRAY], 0.6)
  const Ab = F.region([ARROW], 0.6)
  const sil = F.copy(K); F.union(sil, Ab)
  const L = layers({ T: {}, K, Af: null, Ab, S: null, sil, txt: null, seam: null })
  return emit(L, name, 0)
}
