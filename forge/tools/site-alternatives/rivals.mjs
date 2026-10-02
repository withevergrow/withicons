// The real icons behind each name-map row (fetched by fetch-rival-icons.mjs), shown beside ours for comparison.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'rival-icons')
const INDEX = fs.existsSync(path.join(DIR, 'index.json')) ? JSON.parse(fs.readFileSync(path.join(DIR, 'index.json'), 'utf8')) : { libraries: {} }

/** { version, license, credit, svg(token, size) } for a library slug, or null when we can't show its icons. */
export function rivalSet(slug) {
  const lib = INDEX.libraries[slug]
  if (!lib) return null
  return {
    ...lib,
    svg(token, size = 22) {
      const file = lib.icons[token]
      if (!file) return ''
      return fs.readFileSync(path.join(DIR, slug, `${file}.svg`), 'utf8').trim()
        .replace('<svg ', `<svg width="${size}" height="${size}" class="ax-rival" aria-hidden="true" focusable="false" `)
    },
  }
}

/** Publish each shown library's licence next to the pages (site/alternatives/licenses/<slug>.txt). */
export function writeRivalLicenses(siteDir) {
  const out = path.join(siteDir, 'alternatives', 'licenses')
  fs.mkdirSync(out, { recursive: true })
  for (const slug of Object.keys(INDEX.libraries)) {
    const f = path.join(DIR, slug, 'LICENSE')
    if (fs.existsSync(f)) fs.copyFileSync(f, path.join(out, `${slug}.txt`))
  }
}
