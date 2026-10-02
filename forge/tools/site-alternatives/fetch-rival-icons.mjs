// Fetches the REAL icons behind every name-map row on the alternatives pages (Font Awesome's fa-house, Bootstrap's
// bi-house…), from each library's official npm package at a pinned version, plus its licence. Output (committed):
//   forge/tools/site-alternatives/rival-icons/<slug>/<token>.svg, LICENSE, and index.json
// Shown only next to our icons for comparison, always credited. Never used as input for with icons drawings
// (AGENTS.md "Originality"). Flaticon UIcons and the concept-only marketplaces are skipped: their licences
// don't allow redistributing the files. Re-run to refresh:  node forge/tools/site-alternatives/fetch-rival-icons.mjs
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, 'rival-icons')
const U = 'https://unpkg.com'
const GH_MAT = 'https://raw.githubusercontent.com/google/material-design-icons/master'
const strip = t => t.replace(/\s*\(.*\)$/, '').trim()

// slug -> { pkg version, licence url, credit, licence name, candidates(token) -> urls to try in order }
const SRC = {
  'font-awesome': { v: '7.3.1', lic: `${U}/@fortawesome/fontawesome-free@7.3.1/LICENSE.txt`, license: 'CC BY 4.0', credit: 'Fonticons, Inc.',
    urls: t => ['solid', 'regular', 'brands'].map(s => `${U}/@fortawesome/fontawesome-free@7.3.1/svgs/${s}/${t.replace(/^fa-/, '')}.svg`) },
  'material-symbols': { v: 'master', lic: `${GH_MAT}/LICENSE`, license: 'Apache License 2.0', credit: 'Google',
    urls: t => [`${GH_MAT}/symbols/web/${t}/materialsymbolsoutlined/${t}_24px.svg`] },
  heroicons: { v: '2.2.0', lic: `${U}/heroicons@2.2.0/LICENSE`, license: 'MIT License', credit: 'Tailwind Labs, Inc.',
    urls: t => [`${U}/heroicons@2.2.0/24/outline/${t.split(' / ')[0]}.svg`] },
  lucide: { v: '1.49.0', lic: `${U}/lucide-static@1.49.0/LICENSE`, license: 'ISC License', credit: 'Lucide Icons and Contributors',
    urls: t => [`${U}/lucide-static@1.49.0/icons/${t}.svg`] },
  feather: { v: '4.29.2', lic: `${U}/feather-icons@4.29.2/LICENSE`, license: 'MIT License', credit: 'Cole Bemis',
    urls: t => [`${U}/feather-icons@4.29.2/dist/icons/${t}.svg`] },
  phosphor: { v: '2.1.1', lic: `${U}/@phosphor-icons/core@2.1.1/LICENSE`, license: 'MIT License', credit: 'Phosphor Icons',
    urls: t => [`${U}/@phosphor-icons/core@2.1.1/assets/regular/${t}.svg`] },
  'bootstrap-icons': { v: '1.13.1', lic: `${U}/bootstrap-icons@1.13.1/LICENSE`, license: 'MIT License', credit: 'The Bootstrap Authors',
    urls: t => [`${U}/bootstrap-icons@1.13.1/icons/${t.replace(/^bi-/, '')}.svg`] },
  tabler: { v: '3.48.0', lic: `${U}/@tabler/icons@3.48.0/LICENSE`, license: 'MIT License', credit: 'Paweł Kuna',
    urls: t => [`${U}/@tabler/icons@3.48.0/icons/outline/${t.replace(/^ti-/, '')}.svg`] },
  ionicons: { v: '8.1.0', lic: `${U}/ionicons@8.1.0/LICENSE`, license: 'MIT License', credit: 'Ionic',
    urls: t => [`${U}/ionicons@8.1.0/dist/svg/${t}.svg`] },
  'remix-icon': { v: '4.9.1', lic: `${U}/remixicon@4.9.1/License`, license: 'Apache License 2.0', credit: 'Remix Design', urls: null }, // resolved via the package file list
  boxicons: { v: '2.1.4', lic: `${U}/boxicons@2.1.4/LICENSE`, license: 'MIT License', credit: 'Aniket Suvarna',
    urls: t => { const n = t.replace(/^bx[sl]?-/, ''); return [`${U}/boxicons@2.1.4/svg/regular/bx-${n}.svg`, `${U}/boxicons@2.1.4/svg/solid/bxs-${n}.svg`] } },
  iconify: { v: '7.4.47', lic: `${U}/@mdi/svg@7.4.47/LICENSE`, license: 'Apache License 2.0', credit: 'Pictogrammers (Material Design Icons)',
    urls: t => [`${U}/@mdi/svg@7.4.47/svg/${t.replace(/^mdi:/, '')}.svg`] },
  icons8: { v: '1.3.0', lic: `${U}/line-awesome@1.3.0/LICENSE.md`, license: 'MIT License', credit: 'Icons8 (Line Awesome)',
    urls: t => { const n = t.replace(/^la[srb]?-/, ''); return [`${U}/line-awesome@1.3.0/svg/${n}-solid.svg`, `${U}/line-awesome@1.3.0/svg/${n}.svg`, `${U}/line-awesome@1.3.0/svg/${n}-regular.svg`] } },
}

const get = async url => { try { const r = await fetch(url); return r.ok ? r.text() : null } catch { return null } }

// keep geometry only; colour follows currentColor; keep Font Awesome's attribution comment
function clean(svg, slug) {
  const comment = (svg.match(/<!--![\s\S]*?-->/) || [''])[0]
  const vb = (svg.match(/viewBox="([^"]+)"/) || [, '0 0 24 24'])[1]
  const root = (svg.match(/<svg[^>]*>/) || [''])[0]
  const attrs = {}
  for (const a of ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin']) { const m = root.match(new RegExp(`\\s${a}="([^"]+)"`)); if (m) attrs[a] = m[1] }
  if (!attrs.fill && !attrs.stroke) attrs.fill = 'currentColor'
  if (attrs.fill && attrs.fill !== 'none') attrs.fill = 'currentColor'
  if (attrs.stroke) attrs.stroke = 'currentColor'
  let inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<title>[\s\S]*?<\/title>/g, '')
    .replace(/<rect width="256" height="256" fill="none"\s*\/>/g, '').replace(/\s(class|data-slot|id)="[^"]*"/g, '')
    .replace(/(stroke|fill)="#(000|000000)"/gi, '$1="currentColor"').replace(/stroke:#000;?|fill:#000;?/gi, '')
  // Ionicons style its strokes with a class (.ionicon-stroke-width); make them explicit
  if (slug === 'ionicons') inner = inner.replace(/<(path|circle|rect|line|polyline|polygon|ellipse)(?![^>]*\sfill=)([^>]*\sstroke-linecap=)/g, '<$1 fill="none" stroke="currentColor" stroke-width="32"$2')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${Object.entries(attrs).map(([k, v]) => ` ${k}="${v}"`).join('')}>${comment}${inner.trim()}</svg>\n`
}

const libs = await import(pathToFileURL(path.join(HERE, 'libraries-open.mjs')).href)
const libs2 = await import(pathToFileURL(path.join(HERE, 'libraries.mjs')).href)
const ALL = [...Object.values(libs), ...Object.values(libs2)].flat().filter(l => l && l.slug && l.migrate && !l.migrate.concept)
const bySlug = new Map(ALL.map(l => [l.slug, l]))

let remix = null
const index = { fetched: '2026-10-02', libraries: {} }
for (const [slug, src] of Object.entries(SRC)) {
  const lib = bySlug.get(slug)
  if (!lib) { console.warn('no library data for', slug); continue }
  fs.mkdirSync(path.join(OUT, slug), { recursive: true })
  const lic = await get(src.lic); if (lic) fs.writeFileSync(path.join(OUT, slug, 'LICENSE'), lic); else console.warn('! no licence', slug)
  if (slug === 'remix-icon' && !remix) remix = JSON.parse(await get(`${U}/remixicon@${src.v}/?meta`)).files.map(f => f.path).filter(p => p.startsWith('/icons/'))
  const icons = {}
  await Promise.all(lib.migrate.map.map(async ([raw]) => {
    const token = strip(raw)
    const file = token.split(' / ')[0].replace(/[^a-z0-9_-]+/gi, '_')
    const urls = slug === 'remix-icon'
      ? remix.filter(p => p.endsWith(`/${token.replace(/^ri-/, '')}.svg`)).map(p => `${U}/remixicon@${src.v}${p}`)
      : src.urls(token)
    for (const u of urls) { const svg = await get(u); if (svg && svg.includes('<svg')) { fs.writeFileSync(path.join(OUT, slug, `${file}.svg`), clean(svg, slug)); icons[raw] = file; return } }
    console.warn(`! ${slug}: no icon for "${raw}"`)
  }))
  index.libraries[slug] = { version: src.v, license: src.license, credit: src.credit, icons: Object.fromEntries(Object.entries(icons).sort()) }
  console.log(slug.padEnd(17), src.v.padEnd(8), `${Object.keys(icons).length}/${lib.migrate.map.length}`)
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1) + '\n')
