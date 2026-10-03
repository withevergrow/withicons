// Real icons from the libraries we compare against (fetched by blog/tools/fetch-rivals.mjs into blog/third-party/).
// Used only to show them side by side with ours, always with the library's licence credit next to them.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'third-party')
const INDEX = JSON.parse(fs.readFileSync(path.join(DIR, 'index.json'), 'utf8'))

export const RIVALS = {
  lucide: { name: 'Lucide', url: 'https://lucide.dev', license: 'ISC License', credit: 'Lucide Icons and Contributors', variants: { line: 'Line' }, main: 'line' },
  heroicons: { name: 'Heroicons', url: 'https://heroicons.com', license: 'MIT License', credit: 'Tailwind Labs, Inc.', variants: { outline: 'Outline 24', solid: 'Solid 24', mini: 'Mini 20', micro: 'Micro 16' }, main: 'outline' },
  phosphor: { name: 'Phosphor', url: 'https://phosphoricons.com', license: 'MIT License', credit: 'Phosphor Icons', variants: { thin: 'Thin', light: 'Light', regular: 'Regular', bold: 'Bold', fill: 'Fill', duotone: 'Duotone' }, main: 'regular' },
  tabler: { name: 'Tabler Icons', url: 'https://tabler.io/icons', license: 'MIT License', credit: 'Paweł Kuna', variants: { outline: 'Outline', filled: 'Filled' }, main: 'outline' },
  'font-awesome': { name: 'Font Awesome Free', url: 'https://fontawesome.com', license: 'CC BY 4.0', credit: 'Fonticons, Inc.', variants: { solid: 'Solid', regular: 'Regular' }, main: 'solid' },
  'material-symbols': { name: 'Material Symbols', url: 'https://fonts.google.com/icons', license: 'Apache License 2.0', credit: 'Google', variants: { outlined: 'Outlined', rounded: 'Rounded', sharp: 'Sharp', filled: 'Outlined, filled' }, main: 'outlined' },
  hugeicons: { name: 'Hugeicons Free', url: 'https://hugeicons.com', license: 'MIT License', credit: 'Hugeicons', variants: { 'stroke-rounded': 'Stroke Rounded' }, main: 'stroke-rounded' },
}
for (const [k, r] of Object.entries(RIVALS)) { r.version = INDEX.libraries[k].version; r.names = INDEX.names[k]; r.have = INDEX.libraries[k].variants }
export const CONCEPTS = Object.keys(INDEX.names.lucide)

export const usedRivals = new Set()

/** Inline SVG of a rival icon, or '' when that library/variant has no such icon. */
export function rivalIcon(lib, concept, variant, size = 28) {
  const r = RIVALS[lib]
  if (!r) throw new Error(`blog: unknown rival "${lib}". One of ${Object.keys(RIVALS).join(', ')}`)
  variant ||= r.main
  if (!r.variants[variant]) throw new Error(`blog: ${lib} has no variant "${variant}". One of ${Object.keys(r.variants).join(', ')}`)
  if (!CONCEPTS.includes(concept)) throw new Error(`blog: no rival concept "${concept}". One of ${CONCEPTS.join(', ')}`)
  const f = path.join(DIR, lib, variant, `${concept}.svg`)
  if (!fs.existsSync(f)) return ''
  usedRivals.add(lib)
  return fs.readFileSync(f, 'utf8').trim().replace('<svg ', `<svg width="${size}" height="${size}" class="rv" aria-hidden="true" focusable="false" `)
}

export const rivalCredit = lib => {
  const r = RIVALS[lib]
  return `${r.name} icons © ${r.credit}, <a href="assets/licenses/${lib}.txt">${r.license}</a> (v${r.version}), shown for comparison.`
}

export function copyLicenses(outDir) {
  fs.mkdirSync(outDir, { recursive: true })
  for (const lib of usedRivals) fs.copyFileSync(path.join(DIR, lib, 'LICENSE'), path.join(outDir, `${lib}.txt`))
}
