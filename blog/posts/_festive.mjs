// Shared data and blocks for the holiday and festival posts (files starting with _ are not posts).
// Every count comes from forge/manifest.json and demos/_data/demos.json, never typed by hand.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { p, h2, steps, code, L, MANIFEST, N_ICONS, STYLE_LABEL } from '../lib/blocks.mjs'
import { cdnSvgUrl, cdnPkg } from '../../forge/lib/emit-core.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DEMO_FILE = path.join(HERE, '..', '..', 'demos', '_data', 'demos.json')
const DEMOS = (() => { const d = JSON.parse(fs.readFileSync(DEMO_FILE, 'utf8')); return Array.isArray(d) ? d : (d.demos || Object.values(d)) })()

/** icon names in a manifest category, in manifest order */
export const inCat = cat => MANIFEST.icons.filter(i => i.category === cat).map(i => i.name)
export const nCat = cat => inCat(cat).length
/** link to a category page on the site */
export const catLink = (cat, text) => `<a href="../categories/${cat}.html">${text}</a>`
/** a live demo page; throws if the demo does not exist so links never rot */
export function demo(slug, text) {
  const d = DEMOS.find(x => x.slug === slug)
  if (!d) throw new Error(`blog: unknown demo "${slug}" (demos/_data/demos.json)`)
  return `<a href="../demos/${slug}.html">${text || d.title}</a>`
}
export const demoInfo = slug => DEMOS.find(x => x.slug === slug)
export const demosHome = (text = 'the live demos') => `<a href="../demos/index.html">${text}</a>`
/** PascalCase component name, as the React package exports it */
export const pascal = n => n.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')

// the festive calendar for the 2026-27 season (checked October 2026)
export const DATES = {
  halloween: { day: 'Saturday 31 October 2026', short: '31 Oct 2026' },
  diwali: { day: 'Sunday 8 November 2026', short: '8 Nov 2026' },
  christmas: { day: 'Friday 25 December 2026', short: '25 Dec 2026' },
  lunar: { day: 'Saturday 6 February 2027', short: '6 Feb 2027' },
  valentine: { day: 'Sunday 14 February 2027', short: '14 Feb 2027' },
}

/** The how-to section every festival post shares: copy, slides, Canva, then a short developer snippet. */
export function howTo(style, icons, { app = 'Canva' } = {}) {
  const [a, b] = icons
  const pkg = cdnPkg(style, 'core')
  return `${h2(`How do you use ${STYLE_LABEL[style].toLowerCase() === 'lunar' ? 'Lunar New Year' : STYLE_LABEL[style]} icons in slides, Canva or a website?`)}
${p(`You do not need an account or any design software. Every icon has its own page with buttons to copy it or download it, and every page lets you switch to the ${L.style(style, `${STYLE_LABEL[style]} style`)} first.`)}
${steps([
  ['Open the icon', `Search ${L.icons('the library')} for what you need (try “${a}”), or open the ${L.icon(a)} page directly.`],
  ['Pick the style', `Choose ${STYLE_LABEL[style]} in the style picker. If you want different colours, pick one of the icon’s ready-made palettes.`],
  ['Copy or download', 'Press <strong>Copy image</strong> to paste it straight into a slide or chat, <strong>Download PNG</strong> for a picture with a see-through background, or <strong>Download SVG</strong> for a file that stays sharp at any size.'],
  ['Drop it in', `Paste or drag it onto your ${app} design, ${L.guide('google-slides', 'Google Slides')} or ${L.guide('powerpoint', 'PowerPoint')} slide. Our ${L.guide('canva', 'Canva guide')} shows each click.`],
])}
${p(`If you build websites, the same icons ship on npm. The holiday styles live in their own package, <code>@withicons/${pkg}</code>, and the React components import by name from the style you want:`)}
${code(`npm i @withicons/react

import { ${pascal(a)}, ${pascal(b)} } from '@withicons/react/${style}'

<${pascal(a)} size={48} />`, 'jsx')}
${p(`Or skip the install and point an image at the CDN copy of the SVG. The ${L.page('developers.html', 'developer docs')} cover Vue, Svelte, Angular, web components and CSS classes too.`)}
${code(`<img src="${cdnSvgUrl(style, a)}" width="48" height="48" alt="${a.replace(/-/g, ' ')}">`)}
`
}

export const LICENCE = `All ${N_ICONS} icons are MIT licensed: free for personal and commercial use, including products you sell, with no credit required.`
