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
/** an exact match: what the query names (high) or a sound, direct match (medium); `results` holds only these */
export interface SearchResult {
  name: string; title: string; category: string; score: number
  confidence?: Confidence
  reason: string; match: SearchMatch
  snippet: string; url: string
}
/** a similar icon, not an exact match (low confidence, or reached only through a related concept: "bread" -> bakery
 *  icons). Short on purpose: no snippet, get_icon returns the code of the one that fits. */
export interface AdditionalResult {
  name: string; title: string; category: string; score: number
  confidence?: Confidence
  /** set when confidence is low */
  weak?: true
  reason: string; url: string
}
/** a strong match the category filter hid */
export interface OutsideResult { name: string; title: string; category: string; score: number; confidence?: Confidence; url: string }
export interface SearchResponse { query: string; style: string
  /** the number of exact matches (results.length) */
  count: number
  /** exact matches only, best first */
  results: SearchResult[]
  /** true when no icon carries the query's words (count is 0): look at `additional`, or try another word */
  noExactMatch?: true
  /** up to 5 similar icons, apart from the matches: loosely related, use one only if it fits. Beside exact matches only
   *  related-concept icons appear; low-confidence guesses are listed only when there is no exact match. */
  additional?: AdditionalResult[]
  /** names closest to the query, only when there are neither matches nor additional results */
  suggestions: string[]
  /** confidence of the top exact match, null when there is none */
  confidence: Confidence | null
  /** the query as the engine understood it, when the top result needed a spelling correction */
  didYouMean?: string
  /** no exact match: what to do next (use an additional result only if it fits, a simpler word, or where to browse) */
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
/** Brand colours: primary goes on the icon's largest colour part, secondary the next, tertiary the third (hex). */
export interface Theme { primary: string; secondary?: string; tertiary?: string; ink?: string }
/** where a theme's colours went on one icon in one style: the role each one landed on */
export interface ThemeParts { primary?: PaletteRole | null; secondary?: PaletteRole; tertiary?: PaletteRole }
export interface AppliedTheme {
  theme: Theme; parts: ThemeParts
  /** primary shows unmixed on most of what it paints (flat styles); false where gradients, tones or shading mix it */
  exact: boolean; exactShare: number
  /** the icon is drawn mostly in the ink, which the theme keeps as the style draws it: theme.ink colours it */
  inkLeads?: true
}
export interface IconResponse {
  name: string; requested?: string; title: string; category: string; style: string; format: Format; size: number
  code: string; url: string
  appliedPalette?: AppliedPalette
  appliedTheme?: AppliedTheme
  /** style-wide palette variables and their defaults (palette styles only) */
  palette?: Record<string, string>
  /** multi-colour styles only: this icon's colour variables and its palette ids */
  colors?: { note: string; variables: ColorVariable[]
    /** the colour role that paints the largest visible part (measured on the render) and every role's share of the drawn icon */
    mainRole: PaletteRole; roleAreas: Partial<Record<PaletteRole, number>>
    palettes: number; suggestions?: { id: string; name: string; tags: string[] }[]; hint?: string }
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
  /** brand colours put on this icon's own parts ("#hex" = { primary }); not with palette */
  theme?: string | Theme
  /** false: leave out colors.suggestions (default true) */
  includePalettes?: boolean
}): IconResponse

export interface PalettesResponse {
  name: string; requested?: string; auto: boolean; count: number; total: number
  roles: Record<PaletteRole, string>; multiColourStyles: string[]
  style?: string; variables?: ColorVariable[]
  /** with a style: the colour role that paints the largest visible part (measured on the render); 'ink' for one-colour
   *  styles; mainRoleShare is its share of the drawn icon, roleAreas every role's share */
  mainRole?: PaletteRole; mainRoleShare?: number; mainRoleNote?: string; roleAreas?: Partial<Record<PaletteRole, number>>
  palettes: (Palette & { vars?: Record<string, string>; css?: string })[]
  howTo: string; note?: string
}
export declare function listPalettes(opts: { name: string; style?: string; tag?: string; limit?: number }): PalettesResponse
export declare function applyColors(name: string, style: string, opts: { palette?: string; colors?: PaletteColors }): AppliedPalette
export declare function colorWarning(name: string, style: string, applied: AppliedPalette | null): string | null
export declare function colorVars(name: string, style: string): ColorVariable[]
/** One note / warning per colour for a whole command (several icons or styles) instead of one per icon. */
export declare function colorSummary(entries: { name: string; style: string; applied: AppliedPalette | null; theme?: { theme: Theme; parts: ThemeParts; exact: boolean; inkLeads?: true } }[],
  opts?: { keys?: string[]; palette?: boolean; label?: (key: string) => string }): { notes: string[]; warnings: string[] }
/** The hue role (c1-c4, accent) painting the largest visible area in a real render; else tint / shadow / edge / shine; else the ink. */
export declare function mainRole(name: string, style: string): { role: PaletteRole; share: number | null }
/** Each role's share of the icon's drawn area in a style, largest first. */
export declare function roleAreas(name: string, style: string): Partial<Record<PaletteRole, number>>
export declare const THEME_KEYS: ('primary' | 'secondary' | 'tertiary' | 'ink')[]
/** "#hex" or a theme object -> clean #rrggbb values (IconError code invalid_theme / invalid_color); partial: primary optional */
export declare function checkTheme(theme: string | Partial<Theme>, opts?: { partial?: boolean; what?: string }): Theme
/** A theme resolved onto one icon in one style: the role colours to apply, where each brand colour went, and exactness. */
export declare function themeColors(name: string, style: string, theme: string | Theme, opts?: { shades?: Partial<Record<PaletteRole, string>> }):
  { colors: Record<string, string>; parts: ThemeParts; exact: boolean; exactShare: number; inkLeads?: true; theme: Theme }
/** Another icon's palette on an icon that lacks it, matched by part size: { colors, parts: { <icon role>: <donor role> } } */
export declare function borrowColors(name: string, style: string, donor: string, palette: string):
  { colors: Record<string, string>; parts: Partial<Record<PaletteRole, PaletteRole>>; from: string; palette: string }
/** A style's colour roles as its rendered icons paint them (empty roles: one colour, the ink). */
export interface StyleColours {
  icons: number
  roles: { role: PaletteRole; label: string | null; vars: string[]; icons: number; paints: 'solid' | 'tone' | 'gradient'; as: 'fill' | 'stroke' | 'fill and stroke'; opacity?: number }[]
  inkFollowsColor: boolean
  /** a theme's primary shows unmixed on most of what it paints */
  exact: boolean; exactShare: number | null
  summary: string
}
export declare function styleColours(style: string): StyleColours | null
/** styles a brand hex shows exactly in (flat) and the ones that shade it */
export declare function brandExactness(): { exact: string[]; shaded: string[] }
/** Removes the @withicons/motion part classes (wm-a, wm-k, wm-deco, …) from SVG markup, for files. */
export declare function stripMotion(svg: string): string
export declare function multiColourStyles(name: string): string[]

export interface AnimationResponse {
  name: string; style: string; trigger: Trigger; format: MotionFormat; code: string
  preset?: string; to?: string; effect?: string; intent: string | null
  motion: unknown; presets?: string[]; effects?: string[]; notes: string[]
  /** the icon's other tuned motions (pass one as preset) and the most energetic presets */
  alternates?: MotionSlot[]; lively?: string[]
  /** 3D styles (and soft3d): the motion plays in 3D (wm-3d), and the moves the icon offers in this style (soft3d: 3-5) */
  motion3d?: boolean; moves?: MotionSlot[]
  install: { npm: string; css: string[]; cdn: string[] }
}
export declare function animateIcon(opts: {
  name: string; style?: string; trigger?: Trigger; preset?: string; to?: string; effect?: string; format?: MotionFormat | string; duration?: number
}): AnimationResponse
export declare function listMotion(): { animated: number; triggers: Trigger[]; presets: string[]; effects: string[]; formats: MotionFormat[]; install: { npm: string; css: string[]; cdn: string[] } }
export declare function motionFor(name: string): unknown | null
export interface MotionSlot { preset: string; duration?: number; amount?: number; dir?: number; delay?: number }
/** One icon's tuned motions: default loop / hover presets, intent, part lags, alternates and suggested swaps. */
export declare function iconMotions(name: string, style?: string): {
  name: string; tuned: boolean; intent: string | null; loop: MotionSlot | null; hover: MotionSlot | null
  parts?: Record<string, MotionSlot>; deco?: string; alternates: MotionSlot[]; swaps: { to: string; effect: string }[]
  lively: string[]; presets: string[]; howTo: string
  /** with a style: whether it plays in 3D and the moves the icon offers in it */
  style?: string; motion3d?: boolean; moves?: MotionSlot[]
}

export declare function resolveIcon(name: string):
  | { status: 'resolved'; name: string; via: 'name' | 'alias'; alias?: string; title: string; category: string; aliases: string[] }
  /** not a name or alias, but a word that means this icon ("favourites" -> star / heart, "orders" -> receipt) */
  | { status: 'synonym'; name: string; via: string; term: string; title: string; category: string; aliases: string[]; candidates?: string[]; nearest: string[]; note: string }
  | { status: 'ambiguous'; candidates: string[] }
  | { status: 'unknown'; nearest: string[]; didYouMean?: string; hint?: string }
export declare function resolveName(name: string): string
export declare function listStyles(): { name: string; title: string; kind: string; description: string; default: boolean
  /** the style group (Essentials, Product & brand, 3D & glass, Playful, Artistic, Holidays) and what it is good for */
  group: string; goodFor?: string; motion3d?: true
  /** smallest size (px) the style reads well at */
  minSize: 16 | 32 | 48
  /** how to use it on a dark background */
  onDark: string
  palette?: boolean; vars?: Record<string, string>
  /** the roles the style's icons really paint, and whether a brand hex shows exactly */
  colours?: StyleColours }[]
export declare function listCategories(): { total: number; categories: { name: string; count: number; examples: string[] }[] }
export declare function listCategories(category: string): { category: string; count: number; icons: { name: string; title: string; description: string }[] }
export declare function info(): { version: string; icons: number; styles: string[]; groups: { id: string; title: string; styles: string[] }[]; uses: StyleUse[]; paletteStyles: string[]; formats: Format[]; site: string; animated: number; palettes: number }

// ---- choosing a style
export interface StyleGroup { id: string; title: string; blurb: string; styles: string[] }
/** a "What are you making?" job and its best styles, best first */
export interface StyleUse { id: string; title: string; styles: string[] }
export interface DuoPreset { id: string; title: string; description: string; vars: Record<string, string>; strokeWidth?: number; where: string; css?: string }
export interface StyleInfo {
  style: string; title?: string; group: string; looks?: string; goodFor?: string; minSize?: number
  motion3d: boolean; moves?: string
  react: string; webComponent: string; classes: string
  /** npm packages holding the style's raw files (framework packages, <with-icon> and the class loader carry every style) */
  files?: { svgAndNodes: string; prebuiltSvg: string; classes: string; nodes: string }
  /** https://withicons.com/downloads/with-icons-<style>.zip */
  zip: string
  /** holiday styles: festival palettes (stylePalette(style, id) gives the CSS variables) */
  stylePalettes?: { id: string; name: string; tags: string[]; colors: Partial<Record<PaletteRole, string>> }[]; stylePalettesHow?: string
  /** duo only */
  presets?: DuoPreset[]
  page?: string
}
export declare function styleGroups(): StyleGroup[]
export declare function styleUses(): StyleUse[]
export declare function styleInfo(style: string, icon?: string): StyleInfo
export declare function duoPresets(): DuoPreset[]
export declare function stylePalette(style: string, id?: string): { style: string; id: string; name: string; tags: string[]; colors: Partial<Record<PaletteRole, string>>; vars: Record<string, string>; css: string; /** for the CLI: --colors "<flags>" */ flags: string }
export declare function recommendStyles(opts?: { for?: string; use?: string; icon?: string; limit?: number }): {
  query: string | null; matched: boolean; uses: StyleUse[]
  festivals?: { festival: string; styles: string[]; category: string }[]
  avatars?: { category: 'avatars'; paletteTag: 'true-to-life' }
  recommendations: StyleInfo[]
  hint?: string; allUses?: StyleUse[]; groups?: StyleGroup[]
  notes: string[]; downloads: { style: string; all: string }
}

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
