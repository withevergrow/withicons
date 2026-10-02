// Types for @withicons/mcp/lib (copied to dist/lib.d.ts by forge/lib/emit-mcp.mjs).
export type Format = 'svg' | 'react' | 'vue' | 'svelte' | 'angular' | 'solid' | 'html-class' | 'web-component' | 'data-uri'
export type MotionFormat = 'html' | 'react' | 'vue' | 'svelte' | 'solid' | 'angular' | 'web-component' | 'js'
export type Trigger = 'loop' | 'hover' | 'once' | 'inview' | 'swap'
export type PaletteRole = 'ink' | 'c1' | 'c2' | 'c3' | 'c4' | 'tint' | 'accent' | 'shadow' | 'shine' | 'edge'
/** Role colours (hex or CSS colour names); `--with-*` variable names are accepted too. */
export type PaletteColors = Partial<Record<PaletteRole, string>> & { [cssVariable: `--with-${string}`]: string }

export declare const FORMATS: Format[]
export declare const FRAMEWORKS: string[]
export declare const SITE: string
export declare const TRIGGERS: Trigger[]
export declare const MOTION_FORMATS: MotionFormat[]
export declare const PALETTE_ROLES: PaletteRole[]

export declare class IconError extends Error {
  code: 'unknown_icon' | 'ambiguous' | 'unknown_style' | 'unknown_format' | 'unknown_category' | 'missing_style' | 'unknown_trigger'
    | 'unknown_preset' | 'unknown_effect' | 'missing_swap_target' | 'unknown_palette' | 'unknown_role' | 'invalid_color' | 'unknown_tag' | string
  nearest?: string[]
  candidates?: string[]
  [extra: string]: unknown
}

export interface SearchResult {
  name: string; title: string; category: string; score: number
  reason: string; match: { field: string; term: string; typo?: boolean }
  snippet: string; url: string
}
export interface SearchResponse { query: string; style: string; count: number; results: SearchResult[]; suggestions: string[] }
export declare function searchIcons(opts: { query: string; limit?: number; style?: string; category?: string; format?: Format | string }): SearchResponse

export interface ColorVariable { var: string; role: PaletteRole | null; label: string | null; default: string }
export interface Palette { id: string; name: string; tags: string[]; colors: Partial<Record<PaletteRole, string>> }
export interface AppliedPalette {
  id: string; name?: string; tags?: string[]
  colors: Partial<Record<PaletteRole, string>>
  /** CSS variables this palette sets on this icon in this style */
  vars: Record<string, string>
  /** the ink (CSS `color`), or null */
  color: string | null
  inlineStyle: string; className: string; css: string
}
export interface IconResponse {
  name: string; requested?: string; title: string; category: string; style: string; format: Format; size: number
  code: string; url: string
  appliedPalette?: AppliedPalette
  /** style-wide palette variables and their defaults (palette styles only) */
  palette?: Record<string, string>
  /** multi-colour styles only: this icon's colour variables and its palette ids */
  colors?: { note: string; variables: ColorVariable[]; palettes: number; suggestions: { id: string; name: string; tags: string[] }[] }
  notes?: string[]
  motion: null | { intent?: string; loop?: string; hover?: string; alt: string[]; swap: string[]; howTo: string }
}
export declare function getIcon(opts: {
  name: string; style?: string; format?: Format | string; size?: number; color?: string; strokeWidth?: number; flat?: boolean
  /** id (or name) of one of the icon's palettes */
  palette?: string
  colors?: PaletteColors
}): IconResponse

export interface PalettesResponse {
  name: string; requested?: string; auto: boolean; count: number; total: number
  roles: Record<PaletteRole, string>; multiColourStyles: string[]
  style?: string; variables?: ColorVariable[]
  palettes: (Palette & { vars?: Record<string, string>; css?: string })[]
  howTo: string; note?: string
}
export declare function listPalettes(opts: { name: string; style?: string; tag?: string; limit?: number }): PalettesResponse
export declare function applyColors(name: string, style: string, opts: { palette?: string; colors?: PaletteColors }): AppliedPalette
export declare function colorVars(name: string, style: string): ColorVariable[]
export declare function multiColourStyles(name: string): string[]

export interface AnimationResponse {
  name: string; style: string; trigger: Trigger; format: MotionFormat; code: string
  preset?: string; to?: string; effect?: string; intent: string | null
  motion: unknown; presets?: string[]; effects?: string[]; notes: string[]
  install: { npm: string; css: string[]; cdn: string[] }
}
export declare function animateIcon(opts: {
  name: string; style?: string; trigger?: Trigger; preset?: string; to?: string; effect?: string; format?: MotionFormat | string; duration?: number
}): AnimationResponse
export declare function listMotion(): { animated: number; triggers: Trigger[]; presets: string[]; effects: string[]; formats: MotionFormat[]; install: { npm: string; css: string[]; cdn: string[] } }
export declare function motionFor(name: string): unknown | null

export declare function resolveIcon(name: string):
  | { status: 'resolved'; name: string; via: 'name' | 'alias'; alias?: string; title: string; category: string; aliases: string[] }
  | { status: 'ambiguous'; candidates: string[] }
  | { status: 'unknown'; nearest: string[] }
export declare function resolveName(name: string): string
export declare function listStyles(): { name: string; title: string; kind: string; description: string; default: boolean; palette?: boolean; vars?: Record<string, string> }[]
export declare function listCategories(): { total: number; categories: { name: string; count: number; examples: string[] }[] }
export declare function listCategories(category: string): { category: string; count: number; icons: { name: string; title: string; description: string }[] }
export declare function info(): { version: string; icons: number; styles: string[]; formats: Format[]; site: string; animated: number; palettes: number }

export declare function snippet(name: string, style?: string, format?: Format | string, opts?: { size?: number; color?: string; strokeWidth?: number; flat?: boolean }): string
export declare function svgOf(name: string, style: string, opts?: { size?: number; color?: string; strokeWidth?: number; flat?: boolean }): string
export declare function importLine(names: string[], framework?: string, style?: string): string | null
export declare function usageLine(name: string, framework?: string, style?: string): string | null
/** CSS variables -> their defaults (for files, <img>, data URIs) */
export declare function flatten(svg: string): string
export declare function isPaletteStyle(style: string): boolean
export declare function checkStyle(style?: string): string
export declare function checkFormat(format?: string): Format
export declare function data(): unknown
export declare function motionData(): { icons: Record<string, unknown>; presets: string[]; effects: string[]; css: string[]; cdn: string[]; source: string }
