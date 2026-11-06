// Building blocks for designed Journal heroes (blog/heroes/<slug>.mjs). Each hero is an Unsplash photo used as the
// base, with a topic-specific composition of REAL with icons on top, in the site's own look (tokens, fonts, radii).
// The stage is always 1600 x 1000 px; every helper takes stage pixels (x, y = top-left corner, or cx/cy = centre).
//
// SAFE ZONES (the same image is cropped in several places):
//   article hero, desktop: 2:1 crop  -> only y 100..900 is visible
//   article hero, phone:   4:3 crop  -> only x 135..1465 is visible
//   cards: 16:10 (all of it). Social card (og.jpg): y 80..920, with a title card over the bottom-left.
//   RESERVED: the bottom-left corner (x < 700 and y > 600) holds the floating stickers on the article page and the
//   title card on the social image. Keep it to photo / background only.
//   BASE (pick one): base: "<key>" a photo from blog/images.json | photoFile: "<file>" a new photo saved in blog/heroes/assets/
//   with credit: { by, profile, source, license } (Unsplash or Pexels, free licence) | neither: pure artwork, set bg (CSS).
//   => put the focal art inside x 160..1440, y 120..880, and keep it out of the reserved corner.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { icon as blockIcon, useStyles, STYLES } from '../lib/blocks.mjs'
import { loadStyles } from '../../forge/lib/load.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', '..')
if (!STYLES.length) useStyles(await loadStyles())

// ---------------------------------------------------------------- colours: each style's signature trio from tokens.css
const TOKENS = fs.readFileSync(path.join(ROOT, 'site', 'css', 'tokens.css'), 'utf8').split(/:root\[data-theme="dark"\]|@media \(prefers-color-scheme: dark\)/)[0]
export const C = {}
for (const m of TOKENS.matchAll(/--c-([a-z0-9]+)(-text|-soft)?:\s*(#[0-9A-Fa-f]{6})/g)) {
  const [, s, kind, hex] = m
  C[s] ||= {}
  C[s][kind ? kind.slice(1) : 'c'] = hex
}
// fallbacks for styles without a trio in tokens.css
for (const s of STYLES) C[s] ||= { c: '#2F5BFF', text: '#2448D8', soft: '#E3E9FF' }
export const PAPER = '#FBF8F3', INK = '#111318', SUN = '#FFD23F'
/** hex + alpha (0..1) -> rgba() */
export const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})` }

// ---------------------------------------------------------------- positioning
const px = v => typeof v === 'number' ? `${v}px` : v
/** Absolutely place any HTML on the stage. o: { x, y | cx, cy, w, h, rot, z, scale, cls, style } */
export function at(html, o = {}) {
  const { x, y, cx, cy, w, h, rot = 0, z, scale, cls = '', style = '' } = o
  const pos = cx != null ? `left:${px(cx)};top:${px(cy)};translate:-50% -50%;` : `left:${px(x ?? 0)};top:${px(y ?? 0)};`
  return `<div class="hk-at ${cls}" style="${pos}${w ? `width:${px(w)};` : ''}${h ? `height:${px(h)};` : ''}${rot ? `rotate:${rot}deg;` : ''}${scale ? `scale:${scale};` : ''}${z != null ? `z-index:${z};` : ''}${style}">${html}</div>`
}

// ---------------------------------------------------------------- icons
/** A real with icons SVG (any style in STYLE_ORDER), at any size. */
export const icon = (name, style = 'line', size = 64, color) => `<span class="hk-icon" style="${color ? `color:${color};` : ''}width:${size}px;height:${size}px">${blockIcon(name, style, size)}</span>`

/**
 * A sticker-like icon tile (the site's rounded square). o: { size = 180, tone: 'soft' | 'card' | 'glass' | 'ink' | 'color', ring, shadow = true, label, ...at }
 * The icon gets ~58% of the tile. Line/solid/duo icons take the style colour; multi-colour styles keep their own colours.
 */
export function tile(name, style = 'line', o = {}) {
  const { size = 180, tone = 'soft', label, iconScale = 0.58, shadow = true } = o
  const c = C[style] || C.line
  const bg = { soft: c.soft, card: '#fff', glass: 'rgba(255,255,255,.62)', ink: INK, color: c.c }[tone] || tone
  const fg = tone === 'ink' || tone === 'color' ? '#fff' : (c.text || c.c)
  const inner = `<div class="hk-tile${tone === 'glass' ? ' is-glass' : ''}${shadow ? '' : ' no-shadow'}" style="width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.27)}px;background:${bg};color:${fg};--k:${c.c}">${icon(name, style, Math.round(size * iconScale))}</div>${label ? `<span class="hk-tile__label">${label}</span>` : ''}`
  return o.x != null || o.cx != null ? at(`<div class="hk-tilebox">${inner}</div>`, o) : `<div class="hk-tilebox">${inner}</div>`
}

/** A pill label, optionally with a small icon. o: { style, tone: 'card' | 'ink' | 'color' | 'soft' | 'glass', icon: [name, style], size = 26, ...at } */
export function chip(text, o = {}) {
  const { style = 'line', tone = 'card', size = 26 } = o
  const c = C[style] || C.line
  const bg = { card: '#fff', ink: INK, color: c.c, soft: c.soft, glass: 'rgba(255,255,255,.7)', sun: SUN }[tone] || tone
  const fg = tone === 'ink' || tone === 'color' ? '#fff' : (tone === 'soft' ? c.text : INK)
  const ic = o.icon ? icon(o.icon[0], o.icon[1] || style, Math.round(size * 1.15)) : ''
  return at(`<span class="hk-chip${tone === 'glass' ? ' is-glass' : ''}" style="background:${bg};color:${fg};font-size:${size}px">${ic}<b>${text}</b></span>`, o)
}

/** A white (or frosted glass / ink) card with any content. o: { tone: 'card' | 'glass' | 'ink' | 'paper', pad = 32, radius = 36, ...at } */
export function card(html, o = {}) {
  const { tone = 'card', pad = 32, radius = 36 } = o
  return at(`<div class="hk-card is-${tone}" style="padding:${px(pad)};border-radius:${radius}px;height:100%">${html}</div>`, o)
}

/** An app / browser window with three dots and an optional title. o: { tone: 'card' | 'ink' | 'glass', url, ...at } */
export function win(title, html, o = {}) {
  const { tone = 'card' } = o
  return at(`<div class="hk-win is-${tone}"><div class="hk-win__bar"><i></i><i></i><i></i>${o.url ? `<span class="hk-win__url">${o.url}</span>` : title ? `<span>${title}</span>` : ''}</div><div class="hk-win__body">${html}</div></div>`, o)
}

/** Monospace code lines. Pass an array of lines; wrap words in <em> for the accent colour, <s> for muted. */
export const code = (lines, { size = 24, style = 'line' } = {}) => `<pre class="hk-code" style="font-size:${size}px;--k:${(C[style] || C.line).c}">${lines.join('\n')}</pre>`

/** Big display text (short labels only: one to four words; the post title is already above the hero). */
export const word = (text, o = {}) => at(`<span class="hk-word" style="font-size:${px(o.size || 96)};color:${o.color || INK};${o.font ? `font-family:${o.font};` : ''}">${text}</span>`, o)

/** A soft glowing blob of colour (for depth behind a group). o: { r = 300, color, blur = 80, opacity = .55, ...at with cx/cy } */
export const glow = (o = {}) => at(`<div style="width:${o.r * 2 || 600}px;height:${o.r * 2 || 600}px;border-radius:50%;background:${o.color || C.line.c};filter:blur(${o.blur ?? 80}px);opacity:${o.opacity ?? 0.55}"></div>`, { ...o, z: o.z ?? 0 })

/** A grid of tiles, laid out from (x, y). names: [[name, style], ...] or names + one style. o: { cols, size, gap, tone } */
export function tiles(list, o = {}) {
  const { cols = 4, size = 140, gap = 28, tone = 'soft', x = 0, y = 0, style = 'line', rotate = 0 } = o
  return list.map((it, i) => {
    const [n, s] = Array.isArray(it) ? it : [it, style]
    const r = rotate ? ((i * 37) % 7 - 3) * rotate : 0
    return tile(n, s, { size, tone, x: x + (i % cols) * (size + gap), y: y + Math.floor(i / cols) * (size + gap), rot: r })
  }).join('')
}

// ---------------------------------------------------------------- the stage CSS every hero shares
export const KIT_CSS = `
.hk-at { position: absolute; }
.hk-icon { display: inline-grid; place-items: center; line-height: 0; }
.hk-icon svg { width: 100%; height: 100%; overflow: visible; }
.hk-tilebox { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.hk-tile { display: grid; place-items: center; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 30px 60px -28px rgba(17,19,24,.5); border: 1.5px solid color-mix(in srgb, var(--k) 16%, transparent); }
.hk-tile.no-shadow { box-shadow: none; }
.hk-tile.is-glass, .hk-chip.is-glass, .hk-card.is-glass, .hk-win.is-glass { backdrop-filter: blur(18px) saturate(1.3); -webkit-backdrop-filter: blur(18px) saturate(1.3); border: 1.5px solid rgba(255,255,255,.7); }
.hk-tile__label { font: 700 22px/1 var(--font-display); color: #fff; text-shadow: 0 1px 8px rgba(0,0,0,.35); letter-spacing: -.01em; }
.hk-chip { display: inline-flex; align-items: center; gap: .4em; padding: .42em .8em .42em .7em; border-radius: 999px; font-family: var(--font-display); white-space: nowrap; box-shadow: 0 18px 40px -20px rgba(17,19,24,.55); letter-spacing: -.01em; }
.hk-chip b { font-weight: 700; }
.hk-card { box-sizing: border-box; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 50px 100px -40px rgba(17,19,24,.55); font-family: var(--font-display); color: ${INK}; }
.hk-card.is-card { background: #fff; } .hk-card.is-paper { background: ${PAPER}; } .hk-card.is-glass { background: rgba(255,255,255,.55); }
.hk-card.is-ink { background: ${INK}; color: #F4F0E8; }
.hk-win { height: 100%; display: flex; flex-direction: column; border-radius: 28px; overflow: hidden; box-shadow: 0 2px 0 rgba(17,19,24,.04), 0 50px 100px -40px rgba(17,19,24,.6); font-family: var(--font-display); }
.hk-win.is-card { background: #fff; color: ${INK}; } .hk-win.is-ink { background: #15171E; color: #F4F0E8; } .hk-win.is-glass { background: rgba(255,255,255,.6); color: ${INK}; }
.hk-win__bar { display: flex; align-items: center; gap: 10px; padding: 18px 22px; border-bottom: 1.5px solid rgba(17,19,24,.08); font: 600 20px/1 var(--font-display); }
.hk-win.is-ink .hk-win__bar { border-color: rgba(255,255,255,.08); }
.hk-win__bar i { width: 14px; height: 14px; border-radius: 50%; background: #FF5F57; } .hk-win__bar i:nth-child(2) { background: #FEBC2E; } .hk-win__bar i:nth-child(3) { background: #28C840; }
.hk-win__bar span { margin-left: 14px; opacity: .6; }
.hk-win__url { flex: 1; margin-left: 18px !important; padding: 8px 16px; border-radius: 999px; background: rgba(17,19,24,.06); opacity: .8 !important; font: 500 18px/1 var(--font-mono); }
.hk-win__body { flex: 1; position: relative; padding: 28px; }
.hk-code { margin: 0; font-family: var(--font-mono); line-height: 1.55; white-space: pre; }
.hk-code em { font-style: normal; color: var(--k); } .hk-code s { text-decoration: none; opacity: .5; }
.hk-word { font-family: var(--font-display); font-weight: 800; letter-spacing: -.035em; line-height: .95; white-space: nowrap; }
`
