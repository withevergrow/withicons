/** @withicons/loaders — animated loaders in every with icons style. */
export type LoaderGroup = 'common' | 'creative' | 'festival' | 'morph'
export type MorphEffect = 'bloom' | 'spin' | 'flip' | 'slide-up' | 'slide-left' | 'drop' | 'zoom' | 'fade'
export interface LoaderMeta {
  name: string; title: string; group: LoaderGroup; description: string; intent: string
  aliases: string[]; tags: string[]; synonyms: string[]; duration: number; morph?: string[]; effect?: MorphEffect
}
export interface LoaderOptions {
  /** style name (default 'line'); `variant` is an alias */
  style?: string; variant?: string
  /** px number or CSS length (default 24) */
  size?: number | string
  /** ink colour (default currentColor) */
  color?: string
  /** 1 = as designed, 2 = twice as fast */
  speed?: number | string
  paused?: boolean
  /** accessible name (default 'Loading'); '' = decorative */
  label?: string
  /** style colour roles: { 'glass-tint': '#...' } or { '--with-glass-tint': '#...' } */
  vars?: Record<string, string>
  class?: string
  /** suffix for gradient ids (many inline copies of a rich style on one page) */
  idSuffix?: string
  /** resolve var() paints (for <img>, canvas, data URIs) */
  flat?: boolean
}
export interface MorphOptions extends LoaderOptions { effect?: MorphEffect; hold?: number | string; id?: string; enter?: boolean }
export function svg(name: string, options?: LoaderOptions): string
export function svgAsync(name: string, options?: LoaderOptions): Promise<string>
export function url(name: string, style?: string, version?: string): string
export function dataUri(name: string, options?: LoaderOptions): string
export function morph(items: string[], options?: MorphOptions): string
export function morphAsync(names: string[] | string, options?: MorphOptions): Promise<string>
export function iconSvg(name: string, style?: string): Promise<string>
export function iconUrl(name: string, style?: string): string
export function setIconSource(fn: ((name: string, style: string) => string | Promise<string>) | null): void
export function list(): string[]
export function catalog(): LoaderMeta[]
export function get(name: string): LoaderMeta | null
export function search(query: string, limit?: number): { name: string; title: string; group: LoaderGroup; score: number }[]
export function effects(): { name: MorphEffect; title: string; description: string }[]
export function styles(): string[]
export function version(): string
export function load(style: string): Promise<unknown>
export function loaded(style?: string): boolean
export function register(style: string, data: { root: Record<string, string | number>; loaders: Record<string, string> }): unknown
/** add one loader of a style (e.g. fetched as a single file) */
export function registerOne(style: string, name: string, file: { root: Record<string, string | number>; body: string }): unknown
/** make sure a loader can draw in a style: already loaded, fetched alone (configure({ one })), or its whole style */
export function ensure(name: string, style?: string): Promise<void>
export function configure(options: { one?: ((name: string, style: string) => Promise<{ root: Record<string, string | number>; body: string }>) | null; iconSource?: ((name: string, style: string) => string | Promise<string>) | null }): void
export function uniqueIds(markup: string, suffix: string): string
export function flatten(svg: string, vars?: Record<string, string>): string
export const EFFECTS: Record<MorphEffect, { title: string; say: string }>
