// The style groups (Essentials, Product & brand, 3D & glass, Playful, Artistic, Holidays), the FEATURED styles and the USES ("What are
// you making?") have ONE source of truth: `GROUPS`, `FEATURED` and `USES` in site/js/site.js, which the browser uses for
// the home page, the library and every picker (site/STYLE-PICKER.md). The generators (site-seo.mjs, site-pages/lib.mjs)
// read the same arrays from that file here, so a renamed or regrouped style changes everywhere at once. The fallbacks
// below only cover a site.js that cannot be parsed.
import fs from 'fs'
import { fileURLToPath } from 'url'

const SITE_JS = fileURLToPath(new URL('../../site/js/site.js', import.meta.url))
const FALLBACK = [
  { id: 'essentials', title: 'Essentials', blurb: 'Clean icons for apps, websites and documents.', styles: ['line', 'solid', 'duo', 'suite'] },
  { id: 'product', title: 'Product & brand', blurb: 'For SaaS sites, launches and bold brand graphics: tiles, app icons and loud shapes.', styles: ['bento', 'dock', 'brutal', 'bauhaus'] },
  { id: 'depth', title: '3D & glass', blurb: 'Depth and shine for hero sections, decks and marketing.', styles: ['clay', 'glass', 'liquid', 'chrome', 'soft3d', 'luxe', 'skeuo'] },
  { id: 'playful', title: 'Playful', blurb: 'Cute, colourful and fun: for kids, social posts and games.', styles: ['kawaii', 'plush', 'sticker', 'gloss', 'pastel', 'pixel', 'retro'] },
  { id: 'artistic', title: 'Artistic', blurb: 'Illustrated looks with character: print, editorial and themed designs.', styles: ['sketch', 'engrave', 'blueprint', 'anime', 'gothic', 'coquette'] },
  { id: 'holidays', title: 'Holidays', blurb: "For festivals and seasonal campaigns: Diwali, Durga Puja, Holi, Halloween, Christmas, Lunar New Year and Valentine's.", styles: ['utsav', 'rangoli', 'halloween', 'christmas', 'lunar', 'valentine'] },
]
const FALLBACK_FEATURED = ['line', 'solid', 'duo', 'clay', 'glass', 'suite', 'soft3d', 'kawaii']
const FALLBACK_USES = [
  { id: 'app', title: 'An app or website', styles: ['line', 'duo', 'solid', 'suite'] },
  { id: 'slides', title: 'Slides and documents', styles: ['solid', 'duo', 'suite', 'clay'] },
  { id: 'saas', title: 'A SaaS landing page', styles: ['bento', 'soft3d', 'duo', 'dock'] },
  { id: 'ai', title: 'An AI product', styles: ['clay', 'liquid', 'chrome', 'glass'] },
  { id: 'brand', title: 'Something premium', styles: ['glass', 'luxe', 'chrome', 'dock'] },
  { id: 'kids', title: 'Something playful', styles: ['kawaii', 'plush', 'sticker', 'gloss'] },
  { id: 'print', title: 'Print or editorial', styles: ['engrave', 'sketch', 'blueprint', 'bauhaus'] },
  { id: 'festive', title: 'A festival or seasonal campaign', styles: ['rangoli', 'christmas', 'halloween', 'lunar'] },
]

// the array literal after `var <name> = ` in site.js, evaluated (it is plain data), or null
function arrayLiteral(src, name) {
  const at = src.indexOf(`var ${name} = [`)
  if (at < 0) return null
  const open = src.indexOf('[', at)
  let depth = 0, end = -1, quote = null
  for (let k = open; k < src.length; k++) {
    const c = src[k]
    if (quote) { if (c === '\\') k++; else if (c === quote) quote = null; continue }
    if (c === "'" || c === '"') quote = c
    else if (c === '[') depth++
    else if (c === ']' && --depth === 0) { end = k; break }
  }
  if (end < 0) return null
  try { return new Function(`return ${src.slice(open, end + 1)}`)() } catch { return null }
}
function readAll() {
  let src = ''
  try { src = fs.readFileSync(SITE_JS, 'utf8') } catch { /* fallbacks */ }
  const groups = arrayLiteral(src, 'GROUPS'), featured = arrayLiteral(src, 'FEATURED'), uses = arrayLiteral(src, 'USES')
  return {
    groups: Array.isArray(groups) && groups.length && groups.every(g => g && g.id && g.title && Array.isArray(g.styles)) ? groups : FALLBACK,
    featured: Array.isArray(featured) && featured.length && featured.every(s => typeof s === 'string') ? featured : FALLBACK_FEATURED,
    uses: Array.isArray(uses) && uses.length && uses.every(u => u && u.id && u.title && Array.isArray(u.styles)) ? uses : FALLBACK_USES,
  }
}
const ALL = readAll()

/** [{ id, title, blurb, styles, isNew? }] in display order. */
export const STYLE_GROUPS = ALL.groups
/** style name -> { id, title } of its group ({ id: 'more', title: 'More' } for a style no group lists yet). */
export const groupOfStyle = s => STYLE_GROUPS.find(g => g.styles.includes(s)) || { id: 'more', title: 'More', styles: [] }
/** Older generators still say 'universal' / 'creative' (and the retired group ids everyday / crafted / studio / storybook /
 *  ai / trend); they map to the nearest of the five groups. */
export const LEGACY_GROUP = { universal: 'essentials', everyday: 'essentials', creative: 'artistic', crafted: 'artistic', studio: 'depth', storybook: 'artistic', ai: 'product', trend: 'depth' }
/** The styles shown first in every picker (site.js FEATURED). */
export const FEATURED = ALL.featured
/** "What are you making?": [{ id, title, styles }] with the best styles for each job, best first (site.js USES). */
export const USES = ALL.uses
