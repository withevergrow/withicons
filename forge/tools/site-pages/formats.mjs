// Download formats, read from the site's own export modules (site/js/export/*.js, registry.js = WithExport) so the
// docs list exactly what the Download panel offers, with the same plain-language notes. Used by the "Which file should I
// use?" guide, developers.html#export and the FAQ. Every caller must cope with a format being absent.
import fs from 'fs'
import { createRequire } from 'module'
import { SITE, esc } from './lib.mjs'

const require = createRequire(import.meta.url)
const MODULES = ['vector', 'raster', 'animated', 'lottie', 'office', 'code', 'app']

export const FORMATS = (() => {
  const reg = SITE + '/js/export/registry.js'
  if (!fs.existsSync(reg)) return []
  try {
    const R = require(reg)
    for (const m of MODULES) {
      const f = `${SITE}/js/export/${m}.js`
      if (!fs.existsSync(f)) continue
      try { const mod = require(f); (mod.register || mod)(R) } catch (e) { console.warn(`site-pages: export/${m}.js did not load (${e.message})`) }
    }
    return R.formats.map(f => ({ id: f.id, label: f.label, ext: f.ext, group: f.group, audience: f.audience || [], transparent: f.transparent, animated: !!f.animated, note: f.note || '' }))
  } catch (e) { console.warn('site-pages: export registry did not load (' + e.message + ')'); return [] }
})()

// The formats `withicons export` can write (packages/cli/src/export.mjs EXPORT_FORMATS); the rest need a browser.
export const CLI_FORMATS = (() => {
  const f = SITE + '/../packages/cli/src/export.mjs'
  if (!fs.existsSync(f)) return []
  const m = fs.readFileSync(f, 'utf8').match(/export const EXPORT_FORMATS = \[([^\]]*)\]/)
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]) : []
})()

const BY_ID = new Map(FORMATS.map(f => [f.id, f]))
export const fmt = id => BY_ID.get(id) || null
export const hasFmt = id => BY_ID.has(id)

// Short names for chips and tables (the descriptor label is the long one).
const SHORT = { 'svg-flat': 'SVG', svg: 'SVG for code', pdf: 'PDF', 'png-set': 'PNG set', 'webp-animated': 'Animated WebP', webm: 'WebM', mp4: 'MP4', 'png-sequence': 'PNG frames', lottie: 'Lottie', dotlottie: 'dotLottie', pptx: 'PowerPoint slide', 'pptx-sheet': 'All-styles deck', docx: 'Word document', jsx: 'React', tsx: 'React (TS)', android: 'Android', ios: 'iOS', 'data-uri': 'Data URI', apng: 'APNG', gif: 'GIF' }
export const short = id => SHORT[id] || (fmt(id) ? fmt(id).label : id)

// Plain words for transparency. WebM is the only format whose answer depends on the browser.
export function seeThrough(f) {
  if (!f) return ['', '']
  if (f.id === 'webm') return ['partly', 'See-through in Chrome and Edge']
  if (f.transparent === '1-bit') return ['edges', 'See-through, hard edges']
  if (f.transparent === true) return ['yes', 'See-through']
  return ['no', 'Solid background']
}

export const GROUPS = [
  ['image', 'Pictures', 'Everyday images that work almost everywhere.', 'image'],
  ['vector', 'Sharp at any size', 'Vector files: they never go blurry, from a sticker to a billboard.', 'pen-tool'],
  ['animated', 'Moving icons', 'Your icon with its motion (or its Turn into switch) built in.', 'film'],
  ['office', 'PowerPoint & Word', 'Ready-made files to open in Microsoft Office, Keynote or Google.', 'file-text'],
  ['app', 'App & website icons', 'The files phones, browsers and app stores ask for.', 'smartphone'],
  ['code', 'Code', 'For developers: paste-ready components and snippets.', 'code'],
]

/** A small file chip: <span class="wf-chip wf-chip--group">LABEL</span> (falls back to the plain id when absent). */
export function chip(id, label) {
  const f = fmt(id)
  return `<span class="wf-chip wf-chip--${f ? f.group : 'image'}">${esc(label || short(id))}</span>`
}
