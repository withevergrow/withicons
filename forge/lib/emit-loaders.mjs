#!/usr/bin/env node
// emit-loaders — @withicons/loaders (forge/LOADERS.md): every loader and morph preset pre-rendered in every style.
//
//   packages/loaders/dist/svg/<style>/<name>.svg   standalone animated SVG (style colours flattened; --wl-speed /
//                                                  --wl-state still work inline). <img src> needs nothing else.
//   packages/loaders/dist/styles/<style>.js        ESM: registers that style's loader bodies (lazy-loaded by the runtime)
//   packages/loaders/dist/index.js                 runtime (svg, svgAsync, url, morph, morphAsync, search …) + line built in
//   packages/loaders/dist/element.js               <with-loader> (auto-defined)       react.js / vue.js   wrappers
//   packages/loaders/dist/catalog.json|.js         names, groups, descriptions, aliases, durations (agent-friendly)
//   packages/loaders/dist/cdn/loaders.js           classic script: window.WithLoaders + <with-loader>; styles load as
//                                                  sibling scripts from cdn/styles/<style>.js
//   packages/loaders/{package.json,README.md}, site/vendor/loaders/** (the cdn build), site/data/loaders.js
// Hand-written runtime: packages/loaders/src/{core,effects,element,react,vue}.js + index.d.ts.
// Runs inside forge/build.mjs, or standalone:  node forge/lib/emit-loaders.mjs [--no-site] [--styles line,glass] [--quiet]
// --styles (ctx.onlyStyles) is a quick partial run: it redraws only those styles (and line, the built-in one), keeps
// every other style's files in dist and site/loaders/svg, rebuilds the runtime entries over all the styles present,
// and leaves package.json, README.md and the MCP data (packages/mcp/src/loaders-data.mjs) alone: a full run writes those.
import fs from 'fs'
import os from 'os'
import path from 'path'
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import { fileURLToPath, pathToFileURL } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const PKG = path.join(ROOT, 'packages', 'loaders')
const SRC = path.join(PKG, 'src'), DIST = path.join(PKG, 'dist')
const J = v => JSON.stringify(v)
const posix = p => p.split(path.sep).join('/')
const BANNER = v => `/*! @withicons/loaders ${v} — animated loaders in every with icons style. generated, do not edit. MIT. https://withicons.com */`
// style colours flattened to their fallbacks (what core's standalone .svg files do); the loader's own --wl-* knobs stay
const flatStyle = s => { let p; do { p = s; s = s.replace(/var\(\s*--with-[\w-]+\s*,\s*([^()]*?)\s*\)/g, '$1') } while (s !== p); return s }

// ------------------------------------------------------------------ worker: compile a set of styles
if (!isMainThread && workerData && workerData.kind === 'emit-loaders') {
  const { loadStyles } = await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', 'load.mjs')).href)
  const C = await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', 'loader-compile.mjs')).href)
  const styles = await loadStyles(workerData.styles)
  const specs = []
  for (const n of C.listLoaders()) { try { specs.push(await C.loadLoader(n)) } catch (e) { if (workerData.first) parentPort.postMessage({ style: '-', errors: [`${n}: ${e.message}`] }) } }
  specs.push(...await C.loadMorphs())
  for (const s of workerData.styles) {
    const st = styles[s]
    if (!st) { parentPort.postMessage({ style: s, error: 'style not found' }); continue }
    const bodies = {}, svgs = {}, errors = []
    for (const sp of specs) {
      try { const c = C.compile(sp, st); bodies[sp.name] = c.body; svgs[sp.name] = c.svg } catch (e) { errors.push(`${sp.name}: ${e.message}`) }
    }
    parentPort.postMessage({ style: s, root: { ...st.root }, title: st.title, bodies, svgs, errors })
  }
  parentPort.postMessage({ done: true })
}

// ------------------------------------------------------------------ main
async function compileAll(styleNames, log) {
  const n = Math.max(1, Math.min(styleNames.length, (os.availableParallelism ? os.availableParallelism() : os.cpus().length) - 1, 8))
  // heavy styles first, spread round-robin so workers finish together
  const buckets = Array.from({ length: n }, () => [])
  styleNames.forEach((s, i) => buckets[i % n].push(s))
  const out = {}
  await Promise.all(buckets.filter(b => b.length).map(b => new Promise((ok, bad) => {
    const w = new Worker(fileURLToPath(import.meta.url), { workerData: { kind: 'emit-loaders', styles: b } })
    w.on('message', m => { if (m.done) { w.terminate(); ok() } else if (m.style === '-') { /* reported by main */ } else { out[m.style] = m; if (m.error) log(`  ! ${m.style}: ${m.error}`); for (const e of m.errors || []) log(`  ! ${m.style} ${e}`) } })
    w.on('error', bad)
  })))
  return out
}

export default async function emit(ctx = {}) {
  const t0 = Date.now()
  const quiet = ctx.quiet
  const log = m => { if (!quiet) console.log(m) }
  const version = ctx.version || JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).withiconsVersion || '0.1.0'
  const core = await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', 'emit-core.mjs')).href)
  const C = await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', 'loader-compile.mjs')).href)
  const allStyles = core.STYLE_ORDER.filter(s => fs.existsSync(path.join(ROOT, 'forge', 'styles', s + '.mjs')))
  const partial = !!(ctx.onlyStyles && ctx.onlyStyles.length)
  // a partial run still draws line: the runtime and the CDN script carry it built in
  const styleNames = partial ? allStyles.filter(s => s === 'line' || ctx.onlyStyles.includes(s)) : allStyles
  const specs = []
  for (const n of C.listLoaders()) { try { specs.push(await C.loadLoader(n)) } catch (e) { log(`  ! skipped ${n}: ${e.message}`) } }
  specs.push(...await C.loadMorphs())
  if (!specs.length) return 'no loaders'
  const meta = sp => ({ name: sp.name, title: sp.title, group: sp.group, description: sp.description, intent: sp.intent, aliases: sp.aliases,
    tags: sp.tags, synonyms: sp.synonyms, duration: Math.round(sp.duration * 1000) / 1000, ...(sp.morph.length ? { morph: sp.morph } : {}), ...(sp.effect ? { effect: sp.effect } : {}) })
  const GROUP_RANK = { common: 0, creative: 1, festival: 2, morph: 3 }
  const catalog = specs.map(meta).sort((a, b) => GROUP_RANK[a.group] - GROUP_RANK[b.group] || (a.name < b.name ? -1 : 1))
  const res = await compileAll(styleNames, log)
  const cdnMap = Object.fromEntries(allStyles.map(s => [s, core.cdnPkg(s, 'core')]))

  // ---- clean + write (a partial run cleans only the styles it redraws)
  if (!partial) fs.rmSync(DIST, { recursive: true, force: true })
  else for (const s of styleNames) if (res[s] && res[s].bodies) for (const rel of [`svg/${s}`, `styles/${s}.js`, `cdn/styles/${s}.js`]) fs.rmSync(path.join(DIST, rel), { recursive: true, force: true })
  const W = (rel, text) => { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text) }
  let files = 0, bytes = 0
  for (const s of styleNames) {
    const r = res[s]
    if (!r || !r.bodies) continue
    for (const [name, svg] of Object.entries(r.svgs)) { const f = flatStyle(svg); W(`svg/${s}/${name}.svg`, f); files++; bytes += f.length }
    const data = { root: r.root, loaders: r.bodies }
    W(`styles/${s}.js`, `${BANNER(version)}\nimport { register } from '../lib/core.js'\nexport default register(${J(s)}, ${J(data)})\n`)
    W(`cdn/styles/${s}.js`, `${BANNER(version)}\nglobalThis.WithLoaders.register(${J(s)}, ${J(data)});\n`)
  }
  // runtime sources
  for (const f of ['core.js', 'effects.js', 'element.js', 'react.js', 'vue.js']) W(`lib/${f}`, `${BANNER(version)}\n` + fs.readFileSync(path.join(SRC, f), 'utf8'))
  W('catalog.json', JSON.stringify(catalog, null, 1) + '\n')
  W('catalog.js', `${BANNER(version)}\nexport default ${J(catalog)}\n`)
  // every style whose files are in dist (all of them after a full run; a partial run keeps the others' files)
  const shipped = allStyles.filter(s => (res[s] && res[s].bodies) || (partial && fs.existsSync(path.join(DIST, 'styles', s + '.js'))))
  const metaObj = { version, styles: shipped, cdn: cdnMap }
  const configure = `L.configure({ catalog, meta: ${J(metaObj)}, loader: s => import('./styles/' + s + '.js') })`
  W('index.js', `${BANNER(version)}\nimport * as L from './lib/core.js'\nimport catalog from './catalog.js'\nimport './styles/line.js'\n${configure}\nexport * from './lib/core.js'\nexport { EFFECTS, EASE, morphKeys } from './lib/effects.js'\n`)
  W('element.js', `${BANNER(version)}\nimport './index.js'\nimport { defineLoader } from './lib/element.js'\nexport * from './index.js'\nexport { WithLoaderElement, defineLoader } from './lib/element.js'\ndefineLoader()\n`)
  W('react.js', `${BANNER(version)}\nimport './index.js'\nexport * from './lib/react.js'\nexport { default } from './lib/react.js'\n`)
  W('vue.js', `${BANNER(version)}\nimport './index.js'\nexport * from './lib/vue.js'\nexport { default } from './lib/vue.js'\n`)
  for (const f of ['index.d.ts', 'react.d.ts', 'vue.d.ts', 'element.d.ts']) if (fs.existsSync(path.join(SRC, f))) W(f, fs.readFileSync(path.join(SRC, f), 'utf8'))

  // ---- classic CDN script (esbuild IIFE): runtime + element + catalog + line; other styles as sibling scripts
  const esbuild = (await import('esbuild')).default || await import('esbuild')
  const lineData = res.line ? { root: res.line.root, loaders: res.line.bodies } : null
  const cdnEntry = `import * as L from ${J(posix(path.join(SRC, 'core.js')))}\nimport * as FX from ${J(posix(path.join(SRC, 'effects.js')))}\n` +
    `import { defineLoader, WithLoaderElement } from ${J(posix(path.join(SRC, 'element.js')))}\n` +
    `const cs = typeof document !== 'undefined' && (document.currentScript || [].slice.call(document.querySelectorAll('script[src*="loaders"]')).pop())\n` +
    `const src = cs && cs.src ? cs.src : ''\n${core.withBareBase}\n` +
    `const base = src ? withBareBase(src, 'loaders', ${J(version)}, 'dist/cdn/') || src.replace(/[^/]*([?#].*)?$/, '') : ''\n` +
    `const pending = {}\nconst script = s => pending[s] || (pending[s] = new Promise((ok, bad) => { const el = document.createElement('script'); el.src = base + 'styles/' + s + '.js'; el.async = true; el.onload = () => ok(); el.onerror = () => { delete pending[s]; bad(new Error('with icons loaders: could not load ' + el.src)) }; document.head.appendChild(el) }))\n` +
    `const api = Object.assign({}, L, { EFFECTS: FX.EFFECTS, EASE: FX.EASE, morphKeys: FX.morphKeys, defineLoader, WithLoaderElement })\nglobalThis.WithLoaders = api\n` +
    `L.configure({ catalog: ${J(catalog)}, meta: ${J(metaObj)}, loader: script })\n` +
    (lineData ? `L.register('line', ${J(lineData)})\n` : '') + `defineLoader()\n`
  await esbuild.build({
    stdin: { contents: cdnEntry, resolveDir: ROOT, sourcefile: 'with-loaders-cdn.js', loader: 'js' },
    bundle: true, format: 'iife', platform: 'browser', target: 'es2019', minify: true, legalComments: 'none',
    banner: { js: BANNER(version) }, outfile: path.join(DIST, 'cdn', 'loaders.js'), logLevel: 'silent',
  })

  // ---- package.json + README + MCP data: full runs only (a partial run would describe only its own styles)
  if (!partial) writePackage(version, catalog, shipped)

  // ---- site
  if (!ctx.noSite) {
    const vend = path.join(ROOT, 'site', 'vendor', 'loaders')
    fs.rmSync(vend, { recursive: true, force: true })
    fs.cpSync(path.join(DIST, 'cdn'), vend, { recursive: true })
    // one file per loader and style (colour variables kept, so palettes recolour them): the gallery fetches only what
    // is on screen; also public URLs (withicons.com/loaders/svg/<style>/<name>.svg)
    const sdir = path.join(ROOT, 'site', 'loaders', 'svg')
    if (!partial) fs.rmSync(sdir, { recursive: true, force: true })
    for (const s of styleNames) {
      if (!res[s] || !res[s].svgs) continue
      if (partial) fs.rmSync(path.join(sdir, s), { recursive: true, force: true })
      for (const [name, svg] of Object.entries(res[s].svgs)) {
        const f = path.join(sdir, s, name + '.svg'); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, svg)
      }
    }
    const { EFFECTS } = await import(pathToFileURL(path.join(SRC, 'effects.js')).href)
    // sizes of the standalone files; styles a partial run did not redraw are measured from their files in dist
    // (in catalogue order either way, so a partial run writes the same bytes a full run does)
    const sizeOf = s => Object.fromEntries(catalog.map(l => {
      if (res[s] && res[s].svgs) return res[s].svgs[l.name] == null ? null : [l.name, flatStyle(res[s].svgs[l.name]).length]
      const f = path.join(DIST, 'svg', s, l.name + '.svg')
      return fs.existsSync(f) ? [l.name, fs.readFileSync(f, 'utf8').length] : null
    }).filter(Boolean))
    const site = { version, styles: shipped, loaders: catalog, effects: Object.entries(EFFECTS).map(([name, e]) => ({ name, title: e.title, say: e.say })),
      sizes: Object.fromEntries(shipped.map(s => [s, sizeOf(s)])) }
    const f = path.join(ROOT, 'site', 'data', 'loaders.js')
    fs.writeFileSync(f, `/* generated by forge/lib/emit-loaders.mjs, do not edit */\nwindow.WITH_LOADERS=${J(site)};\n`)
  }
  const n50 = catalog.filter(l => l.group !== 'morph').length
  return `${n50} loaders + ${catalog.length - n50} morphs x ${styleNames.length} styles${partial ? ` (partial: ${styleNames.join(', ')}; package.json, README and MCP data left as they were)` : ''} = ${files} svgs, ${(bytes / 1048576).toFixed(1)} MB (${((Date.now() - t0) / 1000).toFixed(1)}s)`
}

function writePackage(version, catalog, styleNames) {
  const pkg = {
    name: '@withicons/loaders', version,
    description: `${catalog.filter(l => l.group !== 'morph').length} animated loaders (common, creative, festival) + icon morph sequences in all ${styleNames.length} with icons styles. One self-contained SVG each: works as <img>, inline, <with-loader>, React or Vue. Pure CSS animation, zero dependencies.`,
    license: 'MIT', author: { name: 'with icons — powered by Evergrow', url: 'https://withevergrow.com' }, homepage: 'https://withicons.com/loaders.html',
    repository: { type: 'git', url: 'git+https://github.com/withevergrow/withicons.git', directory: 'packages/loaders' },
    bugs: { url: 'https://github.com/withevergrow/withicons/issues' },
    keywords: ['loader', 'loaders', 'spinner', 'spinners', 'loading', 'loading-indicator', 'activity-indicator', 'animated-svg', 'svg-animation', 'css-animation', 'skeleton', 'progress', 'morph', 'icons', 'withicons', 'with-icons', 'web-components', 'react', 'vue', 'reduced-motion', 'ai-agents'],
    type: 'module', sideEffects: ['./dist/element.js', './dist/styles/*.js', './dist/index.js', './dist/react.js', './dist/vue.js'],
    main: './dist/index.js', module: './dist/index.js', types: './dist/index.d.ts',
    exports: {
      '.': { types: './dist/index.d.ts', default: './dist/index.js' },
      './element': { types: './dist/element.d.ts', default: './dist/element.js' },
      './react': { types: './dist/react.d.ts', default: './dist/react.js' },
      './vue': { types: './dist/vue.d.ts', default: './dist/vue.js' },
      './styles/*': './dist/styles/*.js',
      './svg/*': './dist/svg/*',
      './catalog.json': './dist/catalog.json',
      './cdn': './dist/cdn/loaders.js',
      './package.json': './package.json',
    },
    jsdelivr: './dist/cdn/loaders.js', unpkg: './dist/cdn/loaders.js',
    files: ['dist', 'README.md', 'LICENSE'], publishConfig: { access: 'public' },
    peerDependencies: { react: '>=17', vue: '>=3' }, peerDependenciesMeta: { react: { optional: true }, vue: { optional: true } },
    scripts: { test: 'node --test test/*.test.mjs' },
  }
  fs.writeFileSync(path.join(PKG, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')
  fs.writeFileSync(path.join(PKG, 'README.md'), readme(version, catalog, styleNames))
  // the MCP server's get_loader tool reads this (bundled into @withicons/mcp; no dependency on this package)
  fs.writeFileSync(path.join(ROOT, 'packages', 'mcp', 'src', 'loaders-data.mjs'), `// Generated by forge/lib/emit-loaders.mjs, do not edit.\nexport default ${J({ version, styles: styleNames, loaders: catalog })}\n`)
}

function readme(version, catalog, styles) {
  const by = g => catalog.filter(l => l.group === g)
  const row = l => `| \`${l.name}\` | ${l.title} | ${l.intent || l.description} |`
  const table = g => `| name | title | says |\n|---|---|---|\n${by(g).map(row).join('\n')}`
  const n = catalog.filter(l => l.group !== 'morph').length
  return `# @withicons/loaders

**${n} animated loaders** (${by('common').length} common, ${by('creative').length} creative, ${by('festival').length} festival) and **${by('morph').length} morph
sequences** (library icons that keep turning into one another while something loads), each pre-rendered in **all ${styles.length}
[with icons](https://withicons.com) styles**. Every loader is one small self-contained SVG animated with CSS
(transform + opacity only, so it runs on the compositor at 60 fps), honours \`prefers-reduced-motion\`, and needs no JavaScript.

Design your own in the **Loader Studio**: https://withicons.com/loaders.html

## The one-liner (no install, no JS)

\`\`\`html
<img src="https://cdn.jsdelivr.net/npm/@withicons/loaders@${version}/dist/svg/line/spinner.svg" width="32" height="32" alt="Loading">
\`\`\`

Swap \`line\` for any style (${styles.join(', ')}) and \`spinner\` for any loader name below.

## Web component (themeable, any framework)

\`\`\`html
<script src="https://cdn.jsdelivr.net/npm/@withicons/loaders@${version}/dist/cdn/loaders.js"></script>
<with-loader name="orbit" variant="glass" size="48" speed="1.2" color="#7c5cff"></with-loader>
<with-loader morph="file,cloud-upload,check-circle" effect="slide-up"></with-loader>
\`\`\`

\`el.done('check-circle')\` turns a running loader into a finished icon (always the library icon, even when a loader
has the same name); \`el.reset()\` starts it again; \`paused\` pauses. The finish is announced through a polite
\`role="status"\` live region.

**Morph items are library icon names.** Since 0.6.0 a plain name in \`morph="…"\`, \`<Morph items>\`, \`morph()\` and
\`morphAsync()\` is always an icon, even when a loader has the same name (\`rocket\`, \`download\`, \`gift\` …). To put a
loader in the chain, ask for it: \`loader:<name>\` (or \`{ loader: '<name>' }\`), e.g.
\`morph="file,loader:upload,check-circle"\`. Earlier versions turned a name that was also a loader into the loader.

## npm

\`\`\`bash
npm i @withicons/loaders
\`\`\`

\`\`\`js
import { svg, svgAsync, url, morphAsync, search } from '@withicons/loaders'
el.innerHTML = svg('spinner', { size: 32, color: '#16a34a', label: 'Saving' })   // line is built in (sync)
el.innerHTML = await svgAsync('fireworks', { style: 'utsav', size: 64 })          // other styles load on demand
search('ai thinking')     // -> [{ name: 'ai-sparkle', … }, { name: 'morph-ai', … }]
el.innerHTML = await morphAsync(['wrench', 'settings', 'rocket'], { effect: 'spin' })   // three icons
el.innerHTML = await morphAsync(['file', 'loader:upload', 'check-circle'])              // an icon, the upload loader, an icon
\`\`\`

React / Vue:

\`\`\`jsx
import { Loader, Morph } from '@withicons/loaders/react'   // or '@withicons/loaders/vue'
<Loader name="dots-typing" variant="kawaii" size={40} />
<Morph items={['package', 'truck', 'home']} effect="slide-left" />
\`\`\`

## Control

| knob | how |
|---|---|
| colour | \`color\` (currentColor ink) and style colours \`--with-<style>-<role>\` |
| speed | \`speed\` option / attribute, or CSS \`--wl-speed: 1.5\` on any ancestor |
| pause | \`paused\`, or CSS \`--wl-state: paused\` |
| size | any number or CSS length; the drawing is a 24-unit grid that stays crisp |
| a11y | \`label\` (default "Loading"); \`label=""\` makes it decorative. Reduced motion slows it, never freezes it |

## Loaders

### Common
${table('common')}

### Creative
${table('creative')}

### Festival
${table('festival')}

### Morph sequences
${table('morph')}

Morph effects: bloom, spin, flip, slide-up, slide-left, drop, zoom, fade.

MIT. Powered by Evergrow.
`
}

if (isMainThread && process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2)
  const i = a.indexOf('--styles')
  console.log(await emit({ noSite: a.includes('--no-site'), quiet: a.includes('--quiet'), onlyStyles: i >= 0 ? a[i + 1].split(',') : null }))
}
