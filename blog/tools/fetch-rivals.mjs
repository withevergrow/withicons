// Downloads a small, pinned sample of icons from the libraries the Journal compares against, so comparison posts can
// show the real icons side by side with ours. Output: blog/third-party/<lib>/<variant>/<concept>.svg + LICENSE.
// These are third-party files used for comparison only, under each library's own licence. They are NEVER used as
// input for with icons skeletons (see AGENTS.md "Originality"). Re-run only to refresh: node blog/tools/fetch-rivals.mjs
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'third-party')
const U = 'https://unpkg.com'
const GH_MAT = 'https://raw.githubusercontent.com/google/material-design-icons/master'

// concept (our canonical name) -> each library's own name
const CONCEPTS = {
  //            lucide           heroicons           phosphor             tabler            font awesome       material          hugeicons
  home:         ['house',        'home',             'house',             'home',           'house',           'home',           'Home01Icon'],
  search:       ['search',       'magnifying-glass', 'magnifying-glass',  'search',         'magnifying-glass','search',         'Search01Icon'],
  settings:     ['settings',     'cog-6-tooth',      'gear',              'settings',       'gear',            'settings',       'Settings01Icon'],
  user:         ['user',         'user',             'user',              'user',           'user',            'person',         'UserIcon'],
  bell:         ['bell',         'bell',             'bell',              'bell',           'bell',            'notifications',  'Notification01Icon'],
  mail:         ['mail',         'envelope',         'envelope',          'mail',           'envelope',        'mail',           'Mail01Icon'],
  heart:        ['heart',        'heart',            'heart',             'heart',          'heart',           'favorite',       'FavouriteIcon'],
  trash:        ['trash-2',      'trash',            'trash',             'trash',          'trash',           'delete',         'Delete02Icon'],
  calendar:     ['calendar',     'calendar',         'calendar',          'calendar',       'calendar',        'calendar_today', 'Calendar03Icon'],
  'shopping-cart': ['shopping-cart', 'shopping-cart', 'shopping-cart',    'shopping-cart',  'cart-shopping',   'shopping_cart',  'ShoppingCart01Icon'],
  star:         ['star',         'star',             'star',              'star',           'star',            'star',           'StarIcon'],
  download:     ['download',     'arrow-down-tray',  'download-simple',   'download',       'download',        'download',       'Download01Icon'],
}
const COL = { lucide: 0, heroicons: 1, phosphor: 2, tabler: 3, 'font-awesome': 4, 'material-symbols': 5, hugeicons: 6 }

const LIBS = {
  lucide: { version: '1.49.0', license: `${U}/lucide-static@1.49.0/LICENSE`, variants: { line: n => `${U}/lucide-static@1.49.0/icons/${n}.svg` } },
  heroicons: { version: '2.2.0', license: `${U}/heroicons@2.2.0/LICENSE`, variants: {
    outline: n => `${U}/heroicons@2.2.0/24/outline/${n}.svg`, solid: n => `${U}/heroicons@2.2.0/24/solid/${n}.svg`,
    mini: n => `${U}/heroicons@2.2.0/20/solid/${n}.svg`, micro: n => `${U}/heroicons@2.2.0/16/solid/${n}.svg` } },
  phosphor: { version: '2.1.1', license: `${U}/@phosphor-icons/core@2.1.1/LICENSE`, variants: Object.fromEntries(['thin', 'light', 'regular', 'bold', 'fill', 'duotone']
    .map(w => [w, n => `${U}/@phosphor-icons/core@2.1.1/assets/${w}/${n}${w === 'regular' ? '' : '-' + w}.svg`])) },
  tabler: { version: '3.48.0', license: `${U}/@tabler/icons@3.48.0/LICENSE`, variants: {
    outline: n => `${U}/@tabler/icons@3.48.0/icons/outline/${n}.svg`, filled: n => `${U}/@tabler/icons@3.48.0/icons/filled/${n}.svg` } },
  'font-awesome': { version: '7.3.1', license: `${U}/@fortawesome/fontawesome-free@7.3.1/LICENSE.txt`, variants: {
    solid: n => `${U}/@fortawesome/fontawesome-free@7.3.1/svgs/solid/${n}.svg`, regular: n => `${U}/@fortawesome/fontawesome-free@7.3.1/svgs/regular/${n}.svg` } },
  'material-symbols': { version: 'master', license: `${GH_MAT}/LICENSE`, variants: {
    outlined: n => `${GH_MAT}/symbols/web/${n}/materialsymbolsoutlined/${n}_24px.svg`, rounded: n => `${GH_MAT}/symbols/web/${n}/materialsymbolsrounded/${n}_24px.svg`,
    sharp: n => `${GH_MAT}/symbols/web/${n}/materialsymbolssharp/${n}_24px.svg`, filled: n => `${GH_MAT}/symbols/web/${n}/materialsymbolsoutlined/${n}_fill1_24px.svg` } },
  hugeicons: { version: '4.3.5', license: 'https://raw.githubusercontent.com/hugeicons/hugeicons/main/LICENSE.md', variants: {
    'stroke-rounded': n => `${U}/@hugeicons/core-free-icons@4.3.5/dist/esm/${n}.js` } },
}

const get = async url => { const r = await fetch(url); return r.ok ? r.text() : null }

// keep only geometry + the attributes that matter; colour always follows currentColor
function clean(svg, lib) {
  const comment = (svg.match(/<!--[\s\S]*?-->/) || [''])[0] // Font Awesome's attribution comment must stay
  const vb = svg.match(/viewBox="([^"]+)"/)[1]
  const rootAttrs = {}
  for (const a of ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin']) { const m = svg.match(new RegExp(`<svg[^>]*\\s${a}="([^"]+)"`)); if (m) rootAttrs[a] = m[1] }
  if (!rootAttrs.fill && !rootAttrs.stroke) rootAttrs.fill = 'currentColor' // FA + Material paths default to black
  if (rootAttrs.fill && rootAttrs.fill !== 'none') rootAttrs.fill = 'currentColor'
  if (rootAttrs.stroke) rootAttrs.stroke = 'currentColor'
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<rect width="256" height="256" fill="none"\s*\/>/g, '').replace(/\s(class|data-slot)="[^"]*"/g, '').trim()
  const attrs = Object.entries(rootAttrs).map(([k, v]) => ` ${k}="${v}"`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${attrs}>${comment}${inner}</svg>\n`
}
function hugeToSvg(js) {
  const nodes = [...js.matchAll(/\["(\w+)",\s*\{([^}]*)\}\]/g)].map(([, tag, body]) => {
    const attrs = [...body.matchAll(/(\w+):\s*"([^"]*)"/g)].filter(([, k]) => k !== 'key')
      .map(([, k, v]) => ` ${k.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}="${v}"`).join('')
    return `<${tag}${attrs}/>`
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${nodes.join('')}</svg>\n`
}

const report = {}
for (const [lib, cfg] of Object.entries(LIBS)) {
  fs.mkdirSync(path.join(OUT, lib), { recursive: true })
  const lic = await get(cfg.license)
  if (lic) fs.writeFileSync(path.join(OUT, lib, 'LICENSE'), lic)
  report[lib] = { version: cfg.version, variants: {} }
  for (const [variant, url] of Object.entries(cfg.variants)) {
    fs.mkdirSync(path.join(OUT, lib, variant), { recursive: true })
    const got = []
    await Promise.all(Object.entries(CONCEPTS).map(async ([concept, names]) => {
      const name = names[COL[lib]]
      const raw = await get(url(name))
      if (!raw) return
      fs.writeFileSync(path.join(OUT, lib, variant, `${concept}.svg`), lib === 'hugeicons' ? hugeToSvg(raw) : clean(raw, lib))
      got.push(concept)
    }))
    report[lib].variants[variant] = got.sort()
  }
}
const names = Object.fromEntries(Object.keys(COL).map(lib => [lib, Object.fromEntries(Object.entries(CONCEPTS).map(([c, n]) => [c, n[COL[lib]]]))]))
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ fetched: '2026-10-02', libraries: report, names }, null, 1) + '\n')
for (const [lib, r] of Object.entries(report)) console.log(lib.padEnd(17), r.version.padEnd(8), Object.entries(r.variants).map(([v, c]) => `${v}:${c.length}`).join(' '))
