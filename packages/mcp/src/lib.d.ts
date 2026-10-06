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
/** the most energetic motion presets (offered as `lively`) */
export declare const LIVELY_PRESETS: string[]

export declare class IconError extends Error {
  code: 'unknown_icon' | 'ambiguous' | 'unknown_style' | 'unknown_format' | 'unknown_category' | 'missing_style' | 'unknown_trigger'
    | 'unknown_preset' | 'unknown_effect' | 'missing_swap_target' | 'unknown_palette' | 'unknown_role' | 'invalid_color' | 'unknown_tag' | string
  nearest?: string[]
  candidates?: string[]
  [extra: string]: unknown
}

/** high: what the query names; medium: a sound but looser match (spelling fix, related concept, partial match);
 *  low: a guess, show it as "related" (also flagged weak: true) */
export type Confidence = 'high' | 'medium' | 'low'
export type MatchKind = 'exact' | 'prefix' | 'stem' | 'typo' | 'similar' | 'phonetic' | 'concept'
export interface SearchMatch { field: 'name' | 'alias' | 'synonym' | 'tag' | 'category' | 'description' | string; term: string; typo?: boolean; kind?: MatchKind }
export interface SearchResult {
  name: string; title: string; category: string; score: number
  confidence?: Confidence
  /** set when confidence is low: a loosely related icon, not what the query names */
  weak?: true
  reason: string; match: SearchMatch
  snippet: string; url: string
}
/** a strong match the category filter hid */
export interface OutsideResult { name: string; title: string; category: string; score: number; confidence?: Confidence; url: string }
export interface SearchResponse { query: string; style: string; count: number; results: SearchResult[]; suggestions: string[]
  /** confidence of the top result, null when there is none */
  confidence: Confidence | null
  /** the query as the engine understood it, when the top result needed a spelling correction */
  didYouMean?: string
  /** no results, or only low-confidence ones: where to browse instead */
  hint?: string
  /** the best matches the category filter hid (only when the filtered results are weak) */
  outside?: OutsideResult[] }
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
  /** the roles this style paints this icon with (ink first) */
  usedRoles: PaletteRole[]
  /** roles / variables passed that change nothing here */
  ignored?: string[]
}
export interface IconResponse {
  name: string; requested?: string; title: string; category: string; style: string; format: Format; size: number
  code: string; url: string
  appliedPalette?: AppliedPalette
  /** style-wide palette variables and their defaults (palette styles only) */
  palette?: Record<string, string>
  /** multi-colour styles only: this icon's colour variables and its palette ids */
  colors?: { note: string; variables: ColorVariable[]; palettes: number; suggestions?: { id: string; name: string; tags: string[] }[]; hint?: string }
  notes?: string[]
  /** colours that change nothing in this style, and the roles it uses */
  warnings?: string[]
  motion: null | { intent?: string; loop?: string; hover?: string; alt: string[]; swap: string[]; howTo: string }
}
export declare function getIcon(opts: {
  name: string; style?: string; format?: Format | string; size?: number; color?: string; strokeWidth?: number; flat?: boolean
  /** id (or name) of one of the icon's palettes */
  palette?: string
  colors?: PaletteColors
  /** false: leave out colors.suggestions (default true) */
  includePalettes?: boolean
}): IconResponse

export interface PalettesResponse {
  name: string; requested?: string; auto: boolean; count: number; total: number
  roles: Record<PaletteRole, string>; multiColourStyles: string[]
  style?: string; variables?: ColorVariable[]
  /** with a style: the role that paints most of the icon body (set it for a brand colour); 'ink' for one-colour styles */
  mainRole?: PaletteRole; mainRoleShare?: number; mainRoleNote?: string
  palettes: (Palette & { vars?: Record<string, string>; css?: string })[]
  howTo: string; note?: string
}
export declare function listPalettes(opts: { name: string; style?: string; tag?: string; limit?: number }): PalettesResponse
export declare function applyColors(name: string, style: string, opts: { palette?: string; colors?: PaletteColors }): AppliedPalette
export declare function colorWarning(name: string, style: string, applied: AppliedPalette | null): string | null
export declare function colorVars(name: string, style: string): ColorVariable[]
/** One note / warning per colour for a whole command (several icons or styles) instead of one per icon. */
export declare function colorSummary(entries: { name: string; style: string; applied: AppliedPalette | null }[],
  opts?: { keys?: string[]; palette?: boolean; label?: (key: string) => string }): { notes: string[]; warnings: string[] }
/** The colour role covering the largest visible area of the icon body in a style, with its share of the drawn area. */
export declare function mainRole(name: string, style: string): { role: PaletteRole; share: number | null }
/** Removes the @withicons/motion part classes (wm-a, wm-k, wm-deco, …) from SVG markup, for files. */
export declare function stripMotion(svg: string): string
export declare function multiColourStyles(name: string): string[]

export interface AnimationResponse {
  name: string; style: string; trigger: Trigger; format: MotionFormat; code: string
  preset?: string; to?: string; effect?: string; intent: string | null
  motion: unknown; presets?: string[]; effects?: string[]; notes: string[]
  /** the icon's other tuned motions (pass one as preset) and the most energetic presets */
  alternates?: MotionSlot[]; lively?: string[]
  install: { npm: string; css: string[]; cdn: string[] }
}
export declare function animateIcon(opts: {
  name: string; style?: string; trigger?: Trigger; preset?: string; to?: string; effect?: string; format?: MotionFormat | string; duration?: number
}): AnimationResponse
export declare function listMotion(): { animated: number; triggers: Trigger[]; presets: string[]; effects: string[]; formats: MotionFormat[]; install: { npm: string; css: string[]; cdn: string[] } }
export declare function motionFor(name: string): unknown | null
export interface MotionSlot { preset: string; duration?: number; amount?: number; dir?: number; delay?: number }
/** One icon's tuned motions: default loop / hover presets, intent, part lags, alternates and suggested swaps. */
export declare function iconMotions(name: string): {
  name: string; tuned: boolean; intent: string | null; loop: MotionSlot | null; hover: MotionSlot | null
  parts?: Record<string, MotionSlot>; deco?: string; alternates: MotionSlot[]; swaps: { to: string; effect: string }[]
  lively: string[]; presets: string[]; howTo: string
}

export declare function resolveIcon(name: string):
  | { status: 'resolved'; name: string; via: 'name' | 'alias'; alias?: string; title: string; category: string; aliases: string[] }
  /** not a name or alias, but a word that means this icon ("favourites" -> star / heart, "orders" -> receipt) */
  | { status: 'synonym'; name: string; via: string; term: string; title: string; category: string; aliases: string[]; candidates?: string[]; nearest: string[]; note: string }
  | { status: 'ambiguous'; candidates: string[] }
  | { status: 'unknown'; nearest: string[]; didYouMean?: string; hint?: string }
export declare function resolveName(name: string): string
export declare function listStyles(): { name: string; title: string; kind: string; description: string; default: boolean
  /** smallest size (px) the style reads well at */
  minSize: 16 | 32 | 48
  /** how to use it on a dark background */
  onDark: string
  palette?: boolean; vars?: Record<string, string> }[]
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
