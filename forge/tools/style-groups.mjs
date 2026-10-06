// The five style groups (Everyday, Crafted, Playful, Studio, Storybook) have ONE source of truth: `GROUPS` in
// site/js/site.js, which the browser uses for the home page, the library and every picker. The generators
// (site-seo.mjs, site-pages/lib.mjs) read the same array from that file here, so a renamed or regrouped style
// changes everywhere at once. The fallback below only covers a site.js that cannot be parsed.
import fs from 'fs'
import { fileURLToPath } from 'url'

const SITE_JS = fileURLToPath(new URL('../../site/js/site.js', import.meta.url))
const FALLBACK = [
  { id: 'everyday', title: 'Everyday', blurb: 'Clean and quiet. For interfaces, docs and slides.', styles: ['line', 'solid', 'duo'] },
  { id: 'crafted', title: 'Crafted', blurb: 'Illustrated looks with character.', styles: ['gloss', 'engrave', 'blueprint', 'sketch'] },
  { id: 'playful', title: 'Playful', blurb: 'Colourful, cute and nostalgic.', styles: ['glass', 'kawaii', 'sticker', 'pixel', 'retro'] },
  { id: 'studio', title: 'Studio', blurb: 'Art-directed and premium.', styles: ['luxe', 'bauhaus', 'skeuo'] },
  { id: 'storybook', title: 'Storybook', blurb: 'Illustrated worlds.', styles: ['anime', 'gothic', 'pastel', 'coquette', 'plush'] },
]

function read() {
  try {
    const src = fs.readFileSync(SITE_JS, 'utf8')
    const at = src.indexOf('var GROUPS = [')
    if (at < 0) return FALLBACK
    const open = src.indexOf('[', at)
    let depth = 0, end = -1
    for (let k = open; k < src.length; k++) { const c = src[k]; if (c === '[') depth++; else if (c === ']' && --depth === 0) { end = k; break } }
    const groups = new Function(`return ${src.slice(open, end + 1)}`)()
    return Array.isArray(groups) && groups.every(g => g && g.id && g.title && Array.isArray(g.styles)) ? groups : FALLBACK
  } catch { return FALLBACK }
}

/** [{ id, title, blurb, styles }] in display order. */
export const STYLE_GROUPS = read()
/** style name -> { id, title } of its group ({ id: 'more', title: 'More' } for a style no group lists yet). */
export const groupOfStyle = s => STYLE_GROUPS.find(g => g.styles.includes(s)) || { id: 'more', title: 'More', styles: [] }
/** Older generators still say 'universal' / 'creative'; they are the Everyday / Crafted groups. */
export const LEGACY_GROUP = { universal: 'everyday', creative: 'crafted' }
