#!/usr/bin/env node
// emit-dynamic — @withicons/dynamic, the Live icons runtime (forge/DYNAMIC.md "Runtime and packages").
//
// Bundles (esbuild) the generators (forge/dynamic/*.mjs, not "_"), the stroke font, the kernel and EVERY style
// renderer (forge/styles/*.mjs) into:
//   packages/dynamic/dist/index.js|.cjs      full runtime, every style inline, sync render()
//   packages/dynamic/dist/lite.js            core + line; other styles load on demand (dist/styles/<style>.js)
//   packages/dynamic/dist/styles/<style>.js  one renderer per chunk; importing it registers it
//   packages/dynamic/dist/element.js         <with-live-icon> (lite, auto-defined)
//   packages/dynamic/dist/react.js, vue.js   tiny wrappers (props = params)
//   packages/dynamic/dist/cdn/dynamic.js     classic script (window.WithLive + element) + cdn/styles/<style>.js
//   packages/dynamic/README.md, package.json, LICENSE
//   site/vendor/dynamic/**                    the cdn build, for the website (works from file://)
//   site/data/live.js                         window.WITH_LIVE: the generator index (names, params, examples...)
//   site/data/live-<style>.js                 pre-rendered examples per style (static fallbacks / SEO)
// Hand-written sources: packages/dynamic/src (core.js, element.js, react.js, vue.js, README.md template).
// Runs inside forge/build.mjs, or standalone:  node forge/lib/emit-dynamic.mjs [--no-site] [--private] [--quiet]
//   --private also bundles the _example-* test generators (development only; never ship that build)
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import os from 'os'
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads'
import { performance } from 'perf_hooks'
import { fileURLToPath, pathToFileURL } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const PKG = path.join(ROOT, 'packages', 'dynamic')
const SRC = path.join(PKG, 'src')
const DIST = path.join(PKG, 'dist')
const DYN = path.join(ROOT, 'forge', 'dynamic')
const STY = path.join(ROOT, 'forge', 'styles')
const J = v => JSON.stringify(v)
const posix = p => p.split(path.sep).join('/')
const STYLE_ORDER_FALLBACK = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch', 'glass', 'kawaii', 'sticker', 'pixel', 'retro', 'luxe', 'bauhaus', 'skeuo', 'anime', 'gothic', 'pastel', 'coquette', 'plush']
const BANNER = v => `/*! @withicons/dynamic ${v} — Live icons runtime. generated, do not edit. MIT. https://withicons.com */`

// ------------------------------------------------------------------ discovery
function listGenerators(priv) {
  if (!fs.existsSync(DYN)) return []
  return fs.readdirSync(DYN).filter(f => f.endsWith('.mjs'))
    .filter(f => !f.startsWith('_') || (priv && f.startsWith('_example-'))).map(f => f.slice(0, -4)).sort()
}
async function loadGenerators(names, warn) {
  const out = []
  for (const file of names) {
    try {
      const g = (await import(pathToFileURL(path.join(DYN, file + '.mjs')).href)).default
      if (!g || typeof g.build !== 'function' || !g.name) { warn(`forge/dynamic/${file}.mjs: no default export with name + build() — skipped`); continue }
      // must build its default params without throwing to be shipped
      g.build(Object.freeze(Object.fromEntries(Object.entries(g.params || {}).map(([k, s]) => [k, s.default]))))
      out.push({ file, gen: g })
    } catch (e) { warn(`forge/dynamic/${file}.mjs failed — skipped: ${String(e.message).split(/\r?\n/)[0]}`) }
  }
  const seen = new Set()
  return out.filter(({ file, gen }) => { if (seen.has(gen.name)) { warn(`duplicate generator name "${gen.name}" (${file}) — skipped`); return false } seen.add(gen.name); return true })
}
async function loadStyleMeta(warn) {
  let order = STYLE_ORDER_FALLBACK
  try { order = (await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', 'emit-core.mjs')).href)).STYLE_ORDER || order } catch { /* fallback */ }
  const files = fs.readdirSync(STY).filter(f => f.endsWith('.mjs') && !f.startsWith('_')).map(f => f.slice(0, -4))
  const out = []
  for (const name of files) {
    try {
      const s = (await import(pathToFileURL(path.join(STY, name + '.mjs')).href)).default
      if (!s || typeof s.render !== 'function') { warn(`styles/${name}.mjs has no render() — skipped`); continue }
      out.push({ name: s.name || name, file: name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root || {}, mod: s })
    } catch (e) { warn(`styles/${name}.mjs failed to import — skipped: ${String(e.message).split(/\r?\n/)[0]}`) }
  }
  const rank = n => { const i = order.indexOf(n); return i < 0 ? order.length : i }
  return out.sort((a, b) => rank(a.name) - rank(b.name) || (a.name < b.name ? -1 : 1))
}

// ------------------------------------------------------------------ esbuild plugin: virtual modules
function livePlugin({ gens, styles, version, mode }) {
  const CORE = posix(path.join(SRC, 'core.js'))
  // ESM entries start render workers from ./worker.js next to themselves (bundlers such as Vite and webpack 5 follow
  // this pattern); only in a browser page, and the runtime falls back to the main thread if the worker cannot start.
  const ESM_WORKER = `\nimport { setWorker as __withSetWorker } from ${J(CORE)}\n` +
    `if (typeof window !== 'undefined' && typeof document !== 'undefined' && typeof Worker === 'function') __withSetWorker(() => new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }), true)`
  const ELEMENT = posix(path.join(SRC, 'element.js'))
  const styleFile = n => posix(path.join(STY, styles.find(s => s.name === n).file + '.mjs'))
  const KERNEL = { geom: posix(path.join(ROOT, 'forge', 'kernel', 'geom.mjs')), bool: posix(path.join(ROOT, 'forge', 'kernel', 'bool.mjs')) }
  const others = styles.filter(s => s.name !== 'line').map(s => s.name)
  const FONT = posix(path.join(DYN, '_font.mjs'))
  // the CDN lite script: each generator as metadata only (what list / get / catalog / validate read); its build() is
  // a separate file, cdn/gens/<name>.js, fetched the first time that live icon draws
  const STUB_KEYS = ['name', 'title', 'category', 'description', 'aliases', 'tags', 'synonyms', 'params', 'examples']
  const stub = g => Object.fromEntries(STUB_KEYS.filter(k => g[k] !== undefined).map(k => [k, g[k]]))
  // the classic CDN entry; lazy: generators load on demand (cdn/lite.js), else all inline (cdn/dynamic.js)
  const cdnEntry = lazy => `import * as core from ${J(CORE)}\nimport * as el from ${J(ELEMENT)}\nimport line from ${J(styleFile('line'))}\n` +
      `import * as geom from ${J(KERNEL.geom)}\nimport * as bool from ${J(KERNEL.bool)}\n${lazy ? `import * as font from ${J(FONT)}\n` : ''}` +
      `const inWorker = typeof document === 'undefined' && typeof importScripts === 'function' && typeof self !== 'undefined'\n` +
      `const cs = typeof document !== 'undefined' && (document.currentScript || [].slice.call(document.querySelectorAll ? document.querySelectorAll('script[src*="dynamic"]') : []).pop())\n` +
      `const src = inWorker ? (self.WITH_LIVE_SRC || '') : cs && cs.src ? cs.src : ''\n` +
      `const base = src ? src.replace(/[^/]*([?#].*)?$/, '') : ''\n` +
      `const file = (dir, n) => new Promise((ok, bad) => { const u = base + dir + '/' + n + '.js'; if (inWorker) { try { importScripts(u); return ok() } catch (e) { return bad(new Error('with icons live: could not load ' + u)) } } if (typeof document === 'undefined') return bad(new Error('with icons live: ' + dir + '/' + n + '.js needs a document to load; include it with a script tag')); const s = document.createElement('script'); s.src = u; s.async = true; s.onload = () => ok(); s.onerror = () => bad(new Error('with icons live: could not load ' + u)); document.head.appendChild(s) })\n` +
      `const script = n => file('styles', n)\n` +
      `core.register(line)\ncore.setLoaders({ ${others.map(n => `${J(n)}: () => script(${J(n)})`).join(', ')} })\n` +
      (lazy ? `core.setIconLoader(n => file('gens', n))\n` : '') +
      `const api = Object.assign({}, core, { WithLiveIconElement: el.WithLiveIconElement, defineLiveIcon: el.defineLiveIcon, __kernel: { geom, bool }${lazy ? ', __font: font' : ''} })\n` +
      `globalThis.WithLive = api\n` +
      `if (inWorker) core.serveWorker(self)\n` +
      `else {\n  el.defineLiveIcon()\n` +
      `  if (src && typeof Worker === 'function' && typeof Blob === 'function' && typeof URL !== 'undefined' && URL.createObjectURL) core.setWorker(() => new Worker(URL.createObjectURL(new Blob(['self.WITH_LIVE_SRC=' + JSON.stringify(src) + ';importScripts(self.WITH_LIVE_SRC)'], { type: 'text/javascript' }))))\n}`
  const mods = {
    generators: () => mode === 'cdn-lite' ? `export default ${J(gens.map(g => stub(g.gen)))}`
      : gens.map((g, i) => `import g${i} from ${J(posix(path.join(DYN, g.file + '.mjs')))}`).join('\n') +
      `\nexport default [${gens.map((_, i) => 'g' + i).join(', ')}]`,
    meta: () => `export const VERSION = ${J(version)}\nexport const DEFAULT_STYLE = 'line'\n` +
      `export const STYLE_META = ${J(styles.map(({ name, title, kind, description, strokeWidth, root }) => ({ name, title, kind, description, strokeWidth, root })))}`,
    // full: every style inline
    'entry/index': () => `import { register } from ${J(CORE)}\n` + styles.map((s, i) => `import s${i} from ${J(styleFile(s.name))}`).join('\n') +
      `\n${styles.map((_, i) => `register(s${i})`).join('\n')}\nexport * from ${J(CORE)}` + (mode === 'esm' ? ESM_WORKER : ''),
    // lite: line inline, the rest on demand (each style chunk registers itself on import). Shared by the lite entries
    // and the render worker; each entry adds its own setWorker() so `./worker.js` resolves next to the entry file.
    'lite-base': () => `import { register, setLoaders } from ${J(CORE)}\nimport line from ${J(styleFile('line'))}\nregister(line)\n` +
      `setLoaders({ ${others.map(n => `${J(n)}: () => import(${J('with-live:style/' + n)})`).join(', ')} })`,
    'entry/lite': () => `import 'with-live:lite-base'\nexport * from ${J(CORE)}` + ESM_WORKER,
    'entry/element': () => `import 'with-live:lite-base'\nimport { defineLiveIcon } from ${J(ELEMENT)}\nexport * from ${J(CORE)}\nexport { WithLiveIconElement, defineLiveIcon } from ${J(ELEMENT)}` + ESM_WORKER + `\ndefineLiveIcon()`,
    'entry/react': () => `import 'with-live:lite-base'\nexport * from ${J(posix(path.join(SRC, 'react.js')))}\nexport { default } from ${J(posix(path.join(SRC, 'react.js')))}` + ESM_WORKER,
    'entry/vue': () => `import 'with-live:lite-base'\nexport * from ${J(posix(path.join(SRC, 'vue.js')))}\nexport { default } from ${J(posix(path.join(SRC, 'vue.js')))}` + ESM_WORKER,
    // the render worker (module worker): lite + lazy styles, answers render jobs from the page
    'entry/worker': () => `import 'with-live:lite-base'\nimport { serveWorker } from ${J(CORE)}\nserveWorker(self)`,
    // classic script for the site / CDN: window.WithLive, element defined, styles fetched as sibling scripts
    // The same file is also the render worker: in a page it starts workers from a tiny blob that importScripts() it
    // (works cross-origin from a CDN); inside the worker it loads styles with importScripts and answers render jobs.
    'entry/cdn': () => cdnEntry(false),
    'entry/cdn-lite': () => cdnEntry(true),
  }
  for (const s of styles) {
    mods['style/' + s.name] = () => mode === 'cdn-style'
      ? `import s from ${J(styleFile(s.name))}\nglobalThis.WithLive.register(s)`
      : `import s from ${J(styleFile(s.name))}\nimport { register } from ${J(CORE)}\nregister(s)\nexport default s`
  }
  // cdn/gens/<name>.js: one live icon's drawing code for the lite script (registers itself on load)
  for (const g of gens) mods['gen/' + g.gen.name] = () => `import g from ${J(posix(path.join(DYN, g.file + '.mjs')))}\nglobalThis.WithLive.registerIcon(g)`
  return {
    name: 'with-live',
    setup(b) {
      b.onResolve({ filter: /^with-live:/ }, a => ({ path: a.path.slice(10), namespace: 'with-live' }))
      b.onLoad({ filter: /.*/, namespace: 'with-live' }, a => {
        const m = mods[a.path]
        if (!m) return { errors: [{ text: `unknown virtual module with-live:${a.path}` }] }
        return { contents: m(), loader: 'js', resolveDir: ROOT }
      })
      // cdn style chunks share the core's kernel instead of carrying their own copy
      // (and cdn/gens chunks share its kernel and stroke font too)
      if (mode === 'cdn-style' || mode === 'cdn-gen') {
        b.onResolve({ filter: /kernel[\\/](geom|bool)\.mjs$/ }, a => {
          const which = /geom/.test(a.path) ? 'geom' : 'bool'
          return { path: which, namespace: 'with-live-kernel' }
        })
        b.onLoad({ filter: /.*/, namespace: 'with-live-kernel' }, a => ({ contents: a.path === 'font' ? 'module.exports = globalThis.WithLive.__font' : `module.exports = globalThis.WithLive.__kernel.${a.path}`, loader: 'js' }))
        if (mode === 'cdn-gen') b.onResolve({ filter: /_font\.mjs$/ }, () => ({ path: 'font', namespace: 'with-live-kernel' }))
      }
    },
  }
}

// ------------------------------------------------------------------ type declarations
const tsKey = k => /^[A-Za-z_$][\w$]*$/.test(k) ? k : J(k)
function paramType(s) {
  switch (s.type) {
    case 'int': case 'number': case 'level': return 'number | string'
    case 'bool': return 'boolean | "true" | "false"'
    case 'enum': return (s.options || []).map(o => J(o)).join(' | ') + ' | (string & {})'
    case 'time': return '`${number}:${number}` | string'
    default: return 'string'
  }
}
function dts(gens, styles) {
  const names = gens.map(g => g.gen.name)
  const iface = gens.map(({ gen }) => `  ${J(gen.name)}: {\n${Object.entries(gen.params || {}).map(([k, s]) =>
    `    /** ${String(s.label || k).replace(/\*\//g, '')} (${s.type}${s.type === 'int' || s.type === 'number' ? ` ${s.min}..${s.max}` : ''}, default ${J(s.default)}) */\n    ${tsKey(k)}?: ${paramType(s)}`).join('\n')}\n  }`).join('\n')
  return `// @withicons/dynamic — generated, do not edit.
export type LiveIconName = ${names.length ? names.map(J).join(' | ') : 'never'}
export type LiveStyleName = ${styles.map(s => J(s.name)).join(' | ')}
/** Params of every live icon (all optional: defaults fill the rest). */
export interface LiveParamsMap {
${iface}
}
export type LiveParams<N extends string> = N extends keyof LiveParamsMap ? LiveParamsMap[N] : Record<string, unknown>
export type ParamType = 'int' | 'number' | 'level' | 'time' | 'enum' | 'text' | 'bool'
export interface ParamSchema { type: ParamType; label: string; default: unknown; min?: number; max?: number; step?: number; steps?: number; options?: string[]; maxLength?: number; case?: 'upper' }
export interface LiveIconMeta<N extends string = string> {
  name: N; title: string; category: string; description: string
  aliases: string[]; tags: string[]; synonyms: string[]
  params: Record<string, ParamSchema>
  /** example params (resolved), used for previews and static fallbacks */
  examples: Record<string, unknown>[]
  defaults: Record<string, unknown>
}
export interface StyleInfo { name: string; title: string; kind: string; description: string; strokeWidth: number | false; root: Record<string, string | number> }
export interface RenderOptions {
  /** width and height: px number or any CSS length (default 24) */
  size?: number | string
  /** paint for currentColor (default: inherit the text color) */
  color?: string
  /** CSS custom properties: { 'glass-pane': '#cde' } or { '--with-glass-pane': '#cde' } */
  vars?: Record<string, string>
  /** accessible name (role="img"); without it the svg is aria-hidden */
  label?: string
  class?: string
  /** stroke styles only */
  strokeWidth?: number | string
  absoluteStrokeWidth?: boolean
  /** resolve var() paints to plain colours (for <img>, canvas, data URIs) */
  flat?: boolean
  part?: string
  /** renderAsync only: keep just the newest pending call per icon and style (older ones reject with WITH_SUPERSEDED) */
  latest?: boolean
}
export type IconNode = [string, Record<string, string | number>]

export declare const version: string
export declare const defaultStyle: 'line'
export declare const styles: StyleInfo[]
export declare function styleNames(): LiveStyleName[]
/** Render to an SVG string. Sync and memoized. Throws WITH_STYLE_NOT_LOADED in the lite build for a style not loaded yet. */
export declare function render<N extends LiveIconName | (string & {})>(name: N, params?: LiveParams<N>, style?: LiveStyleName | (string & {}), options?: RenderOptions): string
/** Loads the style if needed; styles slower than a frame draw off the main thread (a worker when available). */
export declare function renderAsync<N extends LiveIconName | (string & {})>(name: N, params?: LiveParams<N>, style?: LiveStyleName | (string & {}), options?: RenderOptions): Promise<string>
/** Draw and cache in the background so render() becomes instant. false: replaced by a newer request of the same owner. */
export declare function warm(name: string, params?: Record<string, unknown>, style?: string, options?: { owner?: unknown }): Promise<boolean>
/** true when render() for these params is a cache hit */
export declare function cached(name: string, params?: Record<string, unknown>, style?: string): boolean
/** typical ms for one uncached render in a style (moving average) */
export declare function cost(style?: string): number
/** how to start a render worker (the builds set this); null keeps every render on the main thread */
export declare function setWorker(factory: (() => { postMessage(m: unknown): void; terminate(): void }) | null): void
/** true while render workers are running */
export declare function workers(): boolean
/** worker side of setWorker(): answer render jobs posted to this scope */
export declare function serveWorker(scope: { onmessage: unknown; postMessage(m: unknown): void }): void
export declare function dataUri<N extends LiveIconName | (string & {})>(name: N, params?: LiveParams<N>, style?: LiveStyleName | (string & {}), options?: RenderOptions): string
export declare function parts(name: string, params?: Record<string, unknown>, style?: string, options?: RenderOptions): { attrs: Record<string, string | number>; inner: string; params: Record<string, unknown> }
export declare function nodes(name: string, params?: Record<string, unknown>, style?: string): { root: Record<string, string | number>; nodes: IconNode[] }
export declare function placeholder(options?: RenderOptions): string
export declare function flatten(svg: string, vars?: Record<string, string>): string
/** names of every live icon */
export declare function list(): LiveIconName[]
export declare function catalog(): LiveIconMeta<LiveIconName>[]
export declare function get(name: string): LiveIconMeta<LiveIconName> | null
export declare function defaults<N extends LiveIconName>(name: N): Required<LiveParamsMap[N]>
export declare function defaults(name: string): Record<string, unknown>
export declare function paramsOf(name: string): Record<string, ParamSchema>
/** lenient: defaults filled in, values coerced and clamped */
export declare function resolve(name: string, params?: Record<string, unknown>): Record<string, unknown>
/** strict: a list of problems, [] when valid */
export declare function validate(name: string, params?: Record<string, unknown>): string[]
export declare function skeleton(name: string, params?: Record<string, unknown>): { name: string; paths: { d: string; plate: 'K' | 'A' | 'S' }[]; fills: string[]; cutouts: string[]; params: Record<string, unknown> }
export declare function resolveName(name: string): LiveIconName | null
export declare function suggest(name: string, count?: number): LiveIconName[]
export declare function load(style: LiveStyleName | (string & {})): Promise<unknown>
export declare function loaded(style: string): boolean
/** Load a live icon's drawing code. A no-op in every npm build; in the CDN lite script (cdn/lite.js) it fetches cdn/gens/<name>.js once. */
export declare function loadIcon(name: LiveIconName | (string & {})): Promise<LiveIconName>
/** true when the live icon can render synchronously right now (false only in the CDN lite script before loadIcon). */
export declare function iconLoaded(name: string): boolean
/** Register a live icon generator ({ name, build, params, ... }); the CDN lite script's gens/<name>.js files call this. */
export declare function registerIcon(generator: { name: string; build: (params: Record<string, unknown>) => unknown }): unknown
/** How to fetch a live icon's drawing code that is not bundled: (name) => Promise. */
export declare function setIconLoader(fn: ((name: string) => Promise<unknown>) | null): void
export declare function register(style: { name: string; render: (icon: unknown) => IconNode[] }): unknown
export declare function setLoaders(map: Record<string, () => Promise<unknown>>): void
/** local date/time as params: { day, month, weekday, year, time } */
export declare function now(date?: Date): { day: number; month: string; weekday: string; year: number; time: string }
export declare function clearCache(): void
export declare function paramAttr(param: string): string
export declare function attrParam(attr: string): string
export declare function paramAttributes(): string[]
`
}
const ELEMENT_DTS = `export * from './lite.js'
export declare class WithLiveIconElement extends HTMLElement {
  name: string | null
  variant: string | null
  size: string | null
  color: string | null
  strokeWidth: string | null
  label: string | null
  today: boolean
  params: Record<string, unknown>
}
export declare function defineLiveIcon(tagName?: string): void
declare global { interface HTMLElementTagNameMap { 'with-live-icon': WithLiveIconElement } }
`
const REACT_DTS = `import type { SVGProps, ReactElement } from 'react'
import type { LiveIconName, LiveParams, LiveStyleName } from './index.js'
export type LiveIconProps<N extends LiveIconName | (string & {}) = LiveIconName> = {
  name: N
  variant?: LiveStyleName | (string & {})
  size?: number | string
  color?: string
  strokeWidth?: number | string
  absoluteStrokeWidth?: boolean
  label?: string
  vars?: Record<string, string>
  params?: LiveParams<N>
  /** date-like icons: fill day/month/weekday/time from the viewer's clock */
  today?: boolean
} & LiveParams<N> & Omit<SVGProps<SVGSVGElement>, 'name' | 'color' | 'strokeWidth' | 'ref'>
export declare function LiveIcon<N extends LiveIconName | (string & {})>(props: LiveIconProps<N>): ReactElement
export default LiveIcon
export { render, renderAsync, load, list, get, defaults, catalog, styles, resolve, validate } from './index.js'
`
const VUE_DTS = `import type { DefineComponent } from 'vue'
export declare const LiveIcon: DefineComponent<{
  name: string; variant?: string; size?: number | string; color?: string; strokeWidth?: number | string
  absoluteStrokeWidth?: boolean; label?: string; vars?: Record<string, string>; params?: Record<string, unknown>; today?: boolean
}>
export default LiveIcon
export { render, renderAsync, load, list, get, defaults, catalog, styles, resolve, validate } from './index.js'
`

// ------------------------------------------------------------------ README
const fmtKB = n => n >= 1024 * 100 ? `${Math.round(n / 1024)} KB` : `${(n / 1024).toFixed(1)} KB`
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
function paramCell(k, s) {
  const range = s.type === 'int' || s.type === 'number' ? ` ${s.min}–${s.max}` : s.type === 'enum' ? `: ${s.options.join(', ')}` : s.type === 'text' ? ` (up to ${s.maxLength || 4})` : s.type === 'level' ? ' 0–1' : s.type === 'time' ? ' HH:MM' : ''
  return `\`${k}\` ${s.type}${range}, default \`${typeof s.default === 'string' ? s.default : J(s.default)}\` — ${s.label}`
}
function readme(tpl, { gens, styles, sizes, version }) {
  const cats = [...new Set(gens.map(g => g.gen.category))].sort()
  const table = gens.length ? cats.map(c => `### ${c}\n\n| icon | params | element |\n|---|---|---|\n` + gens.filter(g => g.gen.category === c).map(({ gen }) => {
    // the first example, as attributes: only values that differ from the defaults (booleans as bare attributes)
    const ex = gen.examples?.[0] || {}
    const BUILTIN = ['name', 'variant', 'size', 'color', 'stroke-width', 'absolute-stroke-width', 'label', 'aria-label', 'aria-labelledby', 'params', 'today', 'vars']
    let pairs = Object.entries(ex).filter(([k, v]) => J(v) !== J(gen.params?.[k]?.default))
    if (!pairs.length) pairs = Object.entries(ex).slice(0, 1)
    const attrs = pairs.map(([k, v]) => {
      let a = k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
      if (BUILTIN.includes(a)) a = 'param-' + a
      return v === true ? ` ${a}` : ` ${a}="${v}"`
    }).join('')
    return `| \`${gen.name}\`<br>${cell(gen.title || '')} | ${Object.entries(gen.params || {}).map(([k, s]) => cell(paramCell(k, s))).join('<br>')} | \`<with-live-icon name="${gen.name}"${cell(attrs)}>\` |`
  }).join('\n')).join('\n\n') : '_No live icons are bundled in this build._'
  const sizeRows = sizes.map(s => `| \`${s.file}\` | ${s.what} | ${fmtKB(s.raw)} | ${fmtKB(s.gz)} |`).join('\n')
  return tpl.replace(/\{\{version\}\}/g, version).replace('{{count}}', String(gens.length)).replace('{{styleCount}}', String(styles.length))
    .replace('{{styles}}', styles.map(s => '`' + s.name + '`').join(', ')).replace('{{table}}', table).replace('{{sizes}}', sizeRows)
}

// ------------------------------------------------------------------ emit
export default async function emit(ctx) {
  if (!isMainThread) return 'skipped in a worker'
  const argv = process.argv.slice(2)
  const quiet = argv.includes('--quiet')
  const noSite = argv.includes('--no-site')
  const priv = argv.includes('--private') || process.env.WITH_LIVE_PRIVATE === '1'
  const warnings = []
  const warn = m => { warnings.push(m); if (!quiet) console.log('  [dynamic] ' + m) }
  const version = ctx?.version || JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).withiconsVersion || '0.0.0'
  const write = ctx?.write || ((rel, text) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text) })
  const esbuild = (await import('esbuild')).default || await import('esbuild')

  const styles = await loadStyleMeta(warn)
  if (!styles.some(s => s.name === 'line')) throw new Error('emit-dynamic: the line style is required')
  const gens = await loadGenerators(listGenerators(priv), warn)
  if (priv) warn('--private: _example-* test generators are bundled (development build, do not ship)')

  // fresh dist (it is fully generated)
  fs.rmSync(DIST, { recursive: true, force: true })
  const common = { bundle: true, minify: true, legalComments: 'none', charset: 'utf8', target: 'es2020', logLevel: 'silent', banner: { js: BANNER(version) } }
  const plug = mode => [livePlugin({ gens, styles, version, mode })]
  const stylesEntries = styles.map(s => ({ in: 'with-live:style/' + s.name, out: 'styles/' + s.name }))
  // ESM with code splitting: index (full), lite, element, react, vue, styles/<style>; shared code in chunks/
  await esbuild.build({
    ...common, format: 'esm', platform: 'neutral', splitting: true, outdir: DIST, chunkNames: 'chunks/[name]-[hash]',
    entryPoints: [{ in: 'with-live:entry/index', out: 'index' }, { in: 'with-live:entry/lite', out: 'lite' }, { in: 'with-live:entry/element', out: 'element' },
      { in: 'with-live:entry/react', out: 'react' }, { in: 'with-live:entry/vue', out: 'vue' }, { in: 'with-live:entry/worker', out: 'worker' }, ...stylesEntries],
    external: ['react', 'vue'], plugins: plug('esm'), mainFields: ['module', 'main'],
  })
  // CJS: full runtime, one file
  await esbuild.build({ ...common, format: 'cjs', platform: 'neutral', outfile: path.join(DIST, 'index.cjs'), entryPoints: ['with-live:entry/index'], plugins: plug('cjs'), mainFields: ['module', 'main'] })
  // classic scripts: core + line + element, styles as sibling scripts that share the core's kernel
  await esbuild.build({ ...common, format: 'iife', platform: 'browser', outfile: path.join(DIST, 'cdn', 'dynamic.js'), entryPoints: ['with-live:entry/cdn'], plugins: plug('cdn-core') })
  await esbuild.build({
    ...common, format: 'iife', platform: 'browser', outdir: path.join(DIST, 'cdn'),
    entryPoints: styles.filter(s => s.name !== 'line').map(s => ({ in: 'with-live:style/' + s.name, out: 'styles/' + s.name })), plugins: plug('cdn-style'),
  })
  // the light classic script: same API and element, but each live icon's drawing code is its own file (cdn/gens/<name>.js,
  // fetched on first draw) next to the shared style files, so one live icon costs the core plus that icon
  await esbuild.build({ ...common, format: 'iife', platform: 'browser', outfile: path.join(DIST, 'cdn', 'lite.js'), entryPoints: ['with-live:entry/cdn-lite'], plugins: plug('cdn-lite') })
  if (gens.length) await esbuild.build({
    ...common, format: 'iife', platform: 'browser', outdir: path.join(DIST, 'cdn'),
    entryPoints: gens.map(g => ({ in: 'with-live:gen/' + g.gen.name, out: 'gens/' + g.gen.name })), plugins: plug('cdn-gen'),
  })
  // declarations
  const types = dts(gens, styles)
  const wr = (rel, text) => { const f = path.join(DIST, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text) }
  wr('index.d.ts', types); wr('index.d.cts', types); wr('lite.d.ts', `export * from './index.js'\n`)
  wr('element.d.ts', ELEMENT_DTS); wr('react.d.ts', REACT_DTS); wr('vue.d.ts', VUE_DTS)
  for (const s of styles) wr(`styles/${s.name}.d.ts`, `declare const style: { name: ${J(s.name)}; title: string; kind: string; description: string; strokeWidth: number | false; root: Record<string, string | number>; render(icon: unknown): [string, Record<string, string | number>][] }\nexport default style\n`)

  // sizes: what a user pays per entry (own file + static imports, transitively)
  const fileSize = rel => { const b = fs.readFileSync(path.join(DIST, rel)); return { raw: b.length, gz: zlib.gzipSync(b, { level: 9 }).length } }
  const files = rel => {
    const seen = new Set(), stack = [rel]
    while (stack.length) {
      const r = stack.pop(); if (seen.has(r)) continue; seen.add(r)
      const txt = fs.readFileSync(path.join(DIST, r), 'utf8')
      for (const m of txt.matchAll(/(?:^|[;}\s])(?:import|export)\s*(?:[^'"`;()]*?from\s*)?["'](\.\.?\/[^"']+)["']/g)) stack.push(posix(path.join(path.dirname(r), m[1])))
    }
    return [...seen]
  }
  const sum = list => list.reduce((a, r) => { const s = fileSize(r); return { raw: a.raw + s.raw, gz: a.gz + s.gz } }, { raw: 0, gz: 0 })
  const closure = rel => sum(files(rel))
  const liteSet = new Set(files('lite.js'))
  // a style's cost on top of lite: its entry + the chunks lite does not already have
  const extra = rel => sum(files(rel).filter(r => !liteSet.has(r)))
  const big = styles.filter(s => s.name !== 'line').map(s => ({ n: s.name, ...extra(`styles/${s.name}.js`) })).sort((a, b) => b.raw - a.raw)
  const cdnBig = styles.filter(s => s.name !== 'line').map(s => ({ n: s.name, ...fileSize(`cdn/styles/${s.name}.js`) })).sort((a, b) => b.raw - a.raw)
  const sizes = [
    { file: 'index.js', what: `full runtime, all ${styles.length} styles, sync render()`, ...closure('index.js') },
    { file: 'lite.js', what: 'core + line; other styles load on first use', ...closure('lite.js') },
    { file: 'element.js', what: '`<with-live-icon>` on lite', ...closure('element.js') },
    { file: 'react.js', what: '`<LiveIcon>` on lite (react not included)', ...closure('react.js') },
    { file: 'vue.js', what: '`<LiveIcon>` on lite (vue not included)', ...closure('vue.js') },
    { file: 'styles/<style>.js', what: `one style chunk: smallest \`${big.at(-1)?.n}\`, largest \`${big[0]?.n}\` (${fmtKB(big[0]?.raw || 0)} / ${fmtKB(big[0]?.gz || 0)} gzip)`, raw: big.at(-1)?.raw || 0, gz: big.at(-1)?.gz || 0 },
    { file: 'cdn/lite.js', what: 'classic script: `window.WithLive` + element, line inline; each live icon loads its own `cdn/gens/<name>.js` on first draw', ...fileSize('cdn/lite.js') },
    ...(gens.length ? [(() => {
      const g = gens.map(x => ({ n: x.gen.name, ...fileSize(`cdn/gens/${x.gen.name}.js`) })).sort((a, b) => a.raw - b.raw)
      const m = g[g.length >> 1]
      return { file: 'cdn/gens/<name>.js', what: `one live icon's drawing code (typical \`${m.n}\`; largest \`${g.at(-1).n}\` ${fmtKB(g.at(-1).raw)} / ${fmtKB(g.at(-1).gz)} gzip)`, raw: m.raw, gz: m.gz }
    })()] : []),
    { file: 'cdn/dynamic.js', what: 'classic script: `window.WithLive` + element, line and every live icon inline (sync `render()` of any icon)', ...fileSize('cdn/dynamic.js') },
  ]

  // package files
  const tpl = fs.readFileSync(path.join(SRC, 'README.md'), 'utf8')
  write('packages/dynamic/README.md', readme(tpl, { gens, styles, sizes, version }))
  const { LICENSE, FIRST_YEAR } = await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', 'emit-core.mjs')).href).catch(() => ({}))
  if (LICENSE) write('packages/dynamic/LICENSE', LICENSE(FIRST_YEAR))
  const exp = {
    '.': { import: { types: './dist/index.d.ts', default: './dist/index.js' }, require: { types: './dist/index.d.cts', default: './dist/index.cjs' } },
    './lite': { types: './dist/lite.d.ts', default: './dist/lite.js' },
    './element': { types: './dist/element.d.ts', default: './dist/element.js' },
    './react': { types: './dist/react.d.ts', default: './dist/react.js' },
    './vue': { types: './dist/vue.d.ts', default: './dist/vue.js' },
    './styles/*': { types: './dist/styles/*.d.ts', default: './dist/styles/*.js' },
    './cdn': './dist/cdn/dynamic.js',
    './cdn/lite': './dist/cdn/lite.js',
    './package.json': './package.json',
  }
  const pkg = {
    name: '@withicons/dynamic', version,
    description: `Live icons for with icons: ${gens.length || 'up to 50'} icons whose content you set (calendar date, clock time, badge count, battery level, weather, labels), drawn in all ${styles.length} styles at runtime. Custom element, React and Vue wrappers.`,
    license: 'MIT', author: { name: 'with icons — powered by Evergrow', url: 'https://withevergrow.com' }, homepage: 'https://withicons.com',
    repository: { type: 'git', url: 'git+https://github.com/withevergrow/withicons.git', directory: 'packages/dynamic' },
    bugs: { url: 'https://github.com/withevergrow/withicons/issues' },
    keywords: ['icons', 'svg', 'icon-library', 'withicons', 'with-icons', 'dynamic-icons', 'live-icons', 'calendar-icon', 'clock-icon',
      'battery-icon', 'notification-badge', 'weather-icons', 'svg-generator', 'web-components', 'custom-element', 'react', 'vue', 'ssr'],
    type: 'module', // every entry registers styles or defines the element when evaluated, so none may be skipped
    sideEffects: ['./dist/index.js', './dist/index.cjs', './dist/lite.js', './dist/element.js', './dist/react.js', './dist/vue.js', './dist/styles/*.js', './dist/chunks/*.js', './dist/cdn/*.js', './dist/cdn/styles/*.js', './dist/cdn/gens/*.js'],
    main: './dist/index.cjs', module: './dist/index.js', types: './dist/index.d.ts', unpkg: './dist/cdn/lite.js', jsdelivr: './dist/cdn/lite.js',
    exports: exp,
    typesVersions: { '*': { lite: ['./dist/lite.d.ts'], element: ['./dist/element.d.ts'], react: ['./dist/react.d.ts'], vue: ['./dist/vue.d.ts'], 'styles/*': ['./dist/styles/*.d.ts'] } },
    peerDependencies: { react: '>=17', vue: '>=3.2' },
    peerDependenciesMeta: { react: { optional: true }, vue: { optional: true } },
    devDependencies: { esbuild: '^0.28.2' },
    files: ['dist', 'README.md', 'LICENSE'], publishConfig: { access: 'public' },
    scripts: { test: 'node --test test/*.test.mjs' },
  }
  write('packages/dynamic/package.json', JSON.stringify(pkg, null, 2) + '\n')

  // render the examples through every style (validates the bundle, times each style, feeds the site fallbacks)
  const timing = {}, fallbacks = {}, failures = []
  // styles render in parallel worker threads (the slow ones take 50-200 ms per icon); output is identical either way
  const jobs = styles.map(s => s.name)
  const nWorkers = Math.max(1, Math.min(jobs.length, (os.availableParallelism?.() || os.cpus().length) - 1, 8))
  const results = await new Promise((done, bad) => {
    const out = {}; let next = 0, live = 0
    const spawn = () => {
      if (next >= jobs.length) { if (!live) done(out); return }
      const style = jobs[next++]; live++
      const w = new Worker(fileURLToPath(import.meta.url), { workerData: { liveRender: true, dist: path.join(DIST, 'index.js'), style } })
      w.once('message', m => { out[style] = m })
      w.once('error', bad)
      w.once('exit', () => { live--; if (!out[style]) out[style] = { fallbacks: {}, ms: [], failures: [`${style}: worker exited`] }; spawn() })
    }
    for (let i = 0; i < nWorkers; i++) spawn()
  })
  for (const s of styles) {
    const r = results[s.name]
    fallbacks[s.name] = r.fallbacks
    failures.push(...r.failures)
    const ms = r.ms.sort((a, b) => a - b)
    timing[s.name] = ms.length ? { median: ms[ms.length >> 1], max: ms.at(-1), n: ms.length } : null
  }
  const api = await import(pathToFileURL(path.join(DIST, 'index.js')).href + `?t=${process.hrtime.bigint()}`)
  failures.slice(0, 10).forEach(f => warn('render failed: ' + f))

  // site outputs
  if (!noSite) {
    const VEND = path.join(ROOT, 'site', 'vendor', 'dynamic')
    fs.rmSync(VEND, { recursive: true, force: true })
    const copy = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to) }
    copy(path.join(DIST, 'cdn', 'dynamic.js'), path.join(VEND, 'dynamic.js'))
    for (const f of fs.readdirSync(path.join(DIST, 'cdn', 'styles'))) copy(path.join(DIST, 'cdn', 'styles', f), path.join(VEND, 'styles', f))
    const index = {
      version, defaultStyle: 'line',
      styles: styles.map(({ name, title, kind, strokeWidth, root }) => ({ name, title, kind, strokeWidth, root })),
      icons: api.catalog(),
    }
    write('site/data/live.js', `// generated by forge/lib/emit-dynamic.mjs — do not edit\nwindow.WITH_LIVE=${J(index)};\n`)
    const dataDir = path.join(ROOT, 'site', 'data')
    for (const f of fs.existsSync(dataDir) ? fs.readdirSync(dataDir) : []) if (/^live-[\w-]+\.js$/.test(f) && !styles.some(s => `live-${s.name}.js` === f)) fs.unlinkSync(path.join(dataDir, f))
    for (const s of styles) write(`site/data/live-${s.name}.js`, `(window.WITH_LIVE_SVG=window.WITH_LIVE_SVG||{})[${J(s.name)}]=${J(fallbacks[s.name])};\n`)
  }

  const t = Object.entries(timing).filter(([, v]) => v).map(([k, v]) => `${k} ${v.median.toFixed(1)}/${v.max.toFixed(0)}ms`).join(', ')
  const summary = `${gens.length} live icons x ${styles.length} styles; index ${fmtKB(sizes[0].raw)} (${fmtKB(sizes[0].gz)} gz), lite ${fmtKB(sizes[1].raw)} (${fmtKB(sizes[1].gz)} gz), cdn ${fmtKB(sizes[6].raw)}` +
    `${failures.length ? `; ${failures.length} RENDER FAILURES` : ''}${warnings.length ? `; ${warnings.length} warnings` : ''}`
  emit.report = { sizes, timing, failures, warnings, styleSizes: big, cdnStyleSizes: cdnBig, gens: gens.map(g => g.gen.name) }
  if (!quiet && !ctx) {
    console.log('  render ms per example (median/max): ' + t)
    console.log('  style chunks (esm): ' + big.map(b => `${b.n} ${fmtKB(b.raw)}/${fmtKB(b.gz)}gz`).join(', '))
    console.log('  style chunks (cdn): ' + cdnBig.map(b => `${b.n} ${fmtKB(b.raw)}`).join(', '))
  }
  if (failures.length) process.exitCode = 1
  return summary
}

// worker: render every live icon's examples in one style
if (!isMainThread && workerData?.liveRender) {
  const api = await import(pathToFileURL(workerData.dist).href)
  const fallbacks = {}, ms = [], failures = []
  for (const name of api.list()) {
    const meta = api.get(name)
    const exs = meta.examples.length ? meta.examples : [meta.defaults]
    fallbacks[name] = exs.map(ex => {
      try {
        const t = performance.now()
        const out = api.parts(name, ex, workerData.style).inner
        ms.push(performance.now() - t)
        return out
      } catch (e) { failures.push(`${workerData.style}/${name} ${J(ex)}: ${String(e.message).split('\n')[0]}`); return '' }
    })
  }
  parentPort.postMessage({ fallbacks, ms, failures })
}

if (isMainThread && process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  emit().then(s => console.log('emit-dynamic: ' + s), e => { console.error(e); process.exit(1) })
}
