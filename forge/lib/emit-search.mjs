// Emits @withicons/search: the engine (ESM, CJS, browser global) and a compact prebuilt index.
//   packages/search/dist/index.js | index.cjs | index.d.ts   engine
//   packages/search/dist/with-search.js                       classic script -> window.WithSearch
//   packages/search/dist/index.json | data.js | data.cjs      prebuilt index
//   site/vendor/with/search.js                                window.WithSearch
//   site/data/search-index.js                                 window.WITH_SEARCH_INDEX
// Source of truth for the engine: packages/search/src/engine.mjs.
// Runs inside forge/build.mjs, or standalone: `node forge/lib/emit-search.mjs` (reads skeleton JSON only).
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import { fileURLToPath, pathToFileURL } from 'url'
import { basePkg, writePkg, dual, sortStyles } from './emit-core.mjs'

// site/vendor/with/ is wiped and rewritten by emit-classes — write after it
export const after = ['classes']

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DESC_STOP = new Set('a an the of for to in on at by with and or as is are its it that this from into onto over under used use showing shows one two any each per'.split(' '))

// README template (packages/search/src/readme.template.md: npm ships every root README*, so it lives in src/) placeholders: {{version}} {{icons}} {{styles}} {{styleList}} {{total}} {{indexKB}} {{indexGzKB}}
export const fill = (text, vars) => text.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? String(vars[k]) : m))

const clean = list => {
  const out = [], seen = new Set()
  for (const x of list || []) { const s = String(x).trim().replace(/\|/g, ' '); const k = s.toLowerCase(); if (s && !seen.has(k)) { seen.add(k); out.push(s) } }
  return out
}

export function buildIndex({ icons, styles, version }) {
  const categories = [...new Set(icons.map(i => i.category))].sort()
  const rows = icons.map(ic => {
    const aliases = clean(ic.aliases)
    const al = new Set(aliases.map(a => a.toLowerCase()))
    const synonyms = clean(ic.synonyms).filter(s => !al.has(s.toLowerCase()))
    const sy = new Set(synonyms.map(s => s.toLowerCase()))
    const tags = clean(ic.tags).filter(t => !al.has(t.toLowerCase()) && !sy.has(t.toLowerCase()) && t.toLowerCase() !== ic.name)
    const have = new Set([ic.name, ...aliases, ...synonyms, ...tags].join(' ').toLowerCase().split(/[^a-z0-9]+/))
    const desc = [...new Set(String(ic.description || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/)
      .filter(w => w.length > 1 && !DESC_STOP.has(w) && !have.has(w)))].join(' ')
    let mask = 0
    if (ic.render) styles.forEach((s, k) => { if (!ic.render[s.name]) mask |= 1 << k })
    const row = [ic.name, categories.indexOf(ic.category), aliases.join('|'), synonyms.join('|'), tags.join('|'), desc]
    if (mask) row.push(mask)
    return row
  })
  return { format: 'withicons-search@1', version, styles: styles.map(s => [s.name, s.title || s.name]), categories, icons: rows }
}

// engine.mjs -> three module formats
export function engineBuilds(src, version) {
  const body = src.replace(/^export (const|function) /gm, '$1 ')
  const names = [...src.matchAll(/^export (?:const|function) (\w+)/gm)].map(m => m[1])
  const banner = `/*! @withicons/search v${version} | MIT | https://withicons.com */\n`
  const esm = banner + src
  const cjs = banner + `'use strict'\n${body}\nmodule.exports = { ${names.join(', ')} }\n`
  const umd = banner + `;(function (root, factory) {\n  var api = factory()\n  if (typeof module === 'object' && module.exports) module.exports = api\n  else root.WithSearch = api\n})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {\n'use strict'\n${body}\nreturn { ${names.join(', ')} }\n})\n`
  return { esm, cjs, umd }
}

const DTS = `// readonly arrays, so the raw JSON index (import index from '@withicons/search/index.json') type-checks too
export interface SearchIndex { format: string; version: string; styles: ReadonlyArray<ReadonlyArray<string>>; categories: ReadonlyArray<string>; icons: ReadonlyArray<unknown> }
export type MatchField = 'name' | 'alias' | 'synonym' | 'tag' | 'category' | 'description'
export type MatchKind = 'exact' | 'prefix' | 'stem' | 'typo' | 'similar' | 'phonetic' | 'concept'
export interface SearchResult { name: string; title: string; category: string; score: number; match: { field: MatchField; term: string; typo: boolean; kind: MatchKind } }
export interface SearchOptions { limit?: number; category?: string; style?: string }
export type Resolution = { name: string; alias?: string } | { ambiguous: string[] } | { unknown: true; nearest: string[] }
/** A query word and its position in ParsedQuery.all */
export interface QueryToken { w: string; pos: number }
/** all: every word after normalisation; words: the meaningful ones; required: must all match; soft: only add score;
 *  style: a style named in the query ('cute heart' -> 'kawaii'); split: a run-together word was split */
export interface ParsedQuery { all: string[]; words: string[]; required: QueryToken[]; soft: QueryToken[]; style: string | null; split: boolean }
export interface Engine {
  version: string; dataVersion: string; size: number
  search(query: string, options?: SearchOptions): SearchResult[]
  suggest(query: string, n?: number): string[]
  didYouMean(query: string): string | null
  warm(): boolean
  resolve(name: string): Resolution
  parse(query: string): ParsedQuery
  styles(): { name: string; title: string }[]
  categories(): { name: string; count: number }[]
  icons(category?: string): { name: string; title: string; category: string }[]
  get(name: string): { name: string; title: string; category: string; aliases: string[]; tags: string[]; description: string } | null
}
export declare const ENGINE_VERSION: string
export declare function create(index: SearchIndex): Engine
export declare function words(text: string): string[]
export declare function stem(word: string): string
export declare function fold(text: string): string
export declare function distance(a: string, b: string, max?: number): number
export declare function weightedDistance(a: string, b: string, max?: number): number
export declare function phonetic(word: string): string
export declare function titleOf(name: string): string
`

export default async function emit(ctx) {
  const root = ctx.root || ROOT
  const write = ctx.write || ((rel, text) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text) })
  const version = ctx.version || '0.1.0'
  // synonyms are not on ctx.icons — read the raw skeletons
  const icons = ctx.icons.map(ic => {
    const raw = JSON.parse(fs.readFileSync(path.join(root, 'forge', 'icons', `${ic.name}.json`), 'utf8'))
    return { ...ic, aliases: raw.aliases || ic.aliases || [], synonyms: raw.synonyms || [], tags: raw.tags || ic.tags || [], description: raw.description || ic.description || '', category: raw.category || ic.category }
  })
  const index = buildIndex({ icons, styles: ctx.styles, version })
  const json = JSON.stringify(index)
  const src = fs.readFileSync(path.join(root, 'packages', 'search', 'src', 'engine.mjs'), 'utf8')
  const { esm, cjs, umd } = engineBuilds(src, version)

  write('packages/search/dist/index.js', esm)
  write('packages/search/dist/index.cjs', cjs)
  write('packages/search/dist/index.d.ts', DTS)
  write('packages/search/dist/index.d.cts', DTS)
  write('packages/search/dist/with-search.js', umd)
  write('packages/search/dist/index.json', json)
  write('packages/search/dist/data.js', `export default ${json}\n`)
  write('packages/search/dist/data.cjs', `module.exports = ${json}\n`)
  write('packages/search/dist/data.d.ts', `import type { SearchIndex } from './index.js'\ndeclare const index: SearchIndex\nexport default index\n`)
  write('packages/search/dist/data.d.cts', `import type { SearchIndex } from './index.cjs'\ndeclare const index: SearchIndex\nexport = index\n`)
  write('site/vendor/with/search.js', umd)
  write('site/data/search-index.js', `window.WITH_SEARCH_INDEX=${json};\n`)
  const pkg = {
    ...basePkg({ version }, '@withicons/search', `Fast, typo-tolerant, dependency-free search engine and prebuilt index for the with icons library (${icons.length} icons x ${ctx.styles.length} styles).`,
      ['search', 'icon-search', 'fuzzy-search', 'typo-tolerant', 'mcp']),
    // the classic-script build sets window.WithSearch: a bare import of '@withicons/search/browser' must survive tree shaking
    type: 'module', sideEffects: ['./dist/with-search.js'],
    main: './dist/index.cjs', module: './dist/index.js', types: './dist/index.d.ts',
    unpkg: './dist/with-search.js', jsdelivr: './dist/with-search.js',
    exports: {
      '.': dual('dist/index'),
      './data': dual('dist/data'),
      './index.json': './dist/index.json',
      './browser': './dist/with-search.js',
      './package.json': './package.json',
    },
    files: ['dist', 'README.md', 'LICENSE'],
    publishConfig: { access: 'public' },
    scripts: { test: 'node --test test/*.test.mjs' },
  }
  const readmeSrc = path.join(root, 'packages', 'search', 'src', 'readme.template.md')
  const readme = fs.existsSync(readmeSrc) ? fill(fs.readFileSync(readmeSrc, 'utf8'), { version, icons: icons.length, styles: ctx.styles.length, styleList: ctx.styles.map(s => s.name).join(', '), total: (icons.length * ctx.styles.length).toLocaleString('en-US'),
    indexKB: Math.round(json.length / 1024), indexGzKB: Math.round(zlib.gzipSync(json, { level: 9 }).length / 1024) }) : '# @withicons/search\n'
  writePkg({ write, version }, 'search', pkg, readme)
  const syn = icons.reduce((n, i) => n + (i.synonyms || []).length, 0)
  return `search index ${(json.length / 1024).toFixed(1)} KB (${icons.length} icons, ${syn} synonyms), engine ${(umd.length / 1024).toFixed(1)} KB`
}

// standalone: node forge/lib/emit-search.mjs
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const names = fs.readdirSync(path.join(ROOT, 'forge', 'icons')).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort()
  const icons = names.map(name => { const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'forge', 'icons', `${name}.json`), 'utf8')); return { name, category: r.category } })
  const styleNames = sortStyles(fs.readdirSync(path.join(ROOT, 'forge', 'styles')).filter(f => f.endsWith('.mjs') && !f.startsWith('_')).map(f => f.slice(0, -4)), n => n)
  const titles = {}
  for (const s of styleNames) { try { const m = await import(pathToFileURL(path.join(ROOT, 'forge', 'styles', s + '.mjs')).href); titles[s] = m.default?.title } catch {} }
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  const version = pkg.withiconsVersion || pkg.egopeniconsVersion || '0.1.0'
  console.log(await emit({ root: ROOT, version, icons, styles: styleNames.map(n => ({ name: n, title: titles[n] || n[0].toUpperCase() + n.slice(1) })) }))
}
