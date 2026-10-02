// Palette roles -> each style's CSS variables, for ONE rendered icon.
// Pure, dependency-free ESM (the website ships a classic-script copy). See forge/PALETTES.md.
//
// A palette is { ink, c1, c2, c3, c4, tint, accent, shadow, shine, edge } (hex strings; any may be omitted).
// Styles paint with var(--with-<style>-<role>, #hex). "Slot families" (kawaii fills, sticker candies, retro stripes)
// are matched to c1..c4 in the ORDER THEY FIRST APPEAR in the icon's markup, so c1 is always the icon's
// first/main colour whichever slot the renderer picked for it.

export const ROLES = ['ink', 'c1', 'c2', 'c3', 'c4', 'tint', 'accent', 'shadow', 'shine', 'edge']
export const ROLE_LABELS = {
  ink: 'Outline', c1: 'Main colour', c2: 'Second colour', c3: 'Third colour', c4: 'Fourth colour',
  tint: 'Light tint', accent: 'Accent', shadow: 'Shadow', shine: 'Shine', edge: 'Border',
}

// fixed variable -> role
const FIXED = {
  '--with-duo': 'c1',
  '--with-accent': 'c1',
  '--with-glass-back': 'c1', '--with-glass-pane': 'tint', '--with-glass-etch': 'ink', '--with-glass-accent': 'accent',
  '--with-glass-frost': 'shine', '--with-glass-shine': 'shine',
  '--with-kawaii-face': 'ink', '--with-kawaii-blush': 'accent', '--with-kawaii-sparkle': 'accent', '--with-kawaii-accent': 'accent',
  '--with-kawaii-shine': 'shine',
  '--with-sticker-edge': 'edge', '--with-sticker-ink': 'ink', '--with-sticker-shadow': 'shadow', '--with-sticker-shine': 'shine',
  '--with-pixel-fill': 'c1', '--with-pixel-shine': 'shine',
  '--with-retro-shadow': 'shadow',
}
// generic role-named variables (styles from run 7 on: luxe, bauhaus, skeuo, and any later style):
// --with-<style>-<role> where <role> is one of ROLES maps straight to that role
const GENERIC = /^--with-[a-z0-9]+-(ink|c1|c2|c3|c4|tint|accent|shadow|shine|edge)$/
// slot families: matched to c1..c4 by order of first appearance
const SLOT = [/^--with-kawaii-fill-\d+$/, /^--with-sticker-(bubblegum|grape|lemon|mint|peach|sky)$/, /^--with-retro-\d+$/]
const SLOTS = ['c1', 'c2', 'c3', 'c4']

// Ordered unique list of --with-* variables used in a piece of SVG markup.
export function varsIn(markup) {
  const seen = []
  for (const m of String(markup).matchAll(/var\(\s*(--with-[\w-]+)/g)) if (!seen.includes(m[1])) seen.push(m[1])
  return seen
}

// { '--with-x': 'role' } for the variables this markup uses (unknown variables are left out).
export function rolesFor(markup) {
  const out = {}
  const n = SLOT.map(() => 0)
  for (const v of varsIn(markup)) {
    if (FIXED[v]) { out[v] = FIXED[v]; continue }
    const g = GENERIC.exec(v)
    if (g) { out[v] = g[1]; continue }
    const f = SLOT.findIndex(re => re.test(v))
    if (f >= 0) out[v] = SLOTS[Math.min(n[f]++, SLOTS.length - 1)]
  }
  return out
}

// { '--with-x': '#hex' } to apply a palette to this markup (roles the palette leaves out are skipped),
// plus `color` (the ink, for currentColor) when the palette has an ink.
export function applyPalette(markup, palette) {
  const vars = {}
  for (const [v, role] of Object.entries(rolesFor(markup))) if (palette[role]) vars[v] = palette[role]
  return { vars, color: palette.ink || null }
}

// Bake a palette into standalone SVG markup (for downloads / rasterizers): var(--with-x, d) -> chosen hex.
export function bakePalette(markup, palette) {
  const { vars, color } = applyPalette(markup, palette)
  let s = String(markup).replace(/var\(\s*(--with-[\w-]+)\s*,\s*([^()]*?)\s*\)/g, (all, v, d) => vars[v] || d)
  if (color) s = s.replace(/currentColor/g, color)
  return s
}
