#!/usr/bin/env node
// emit-motion — @withicons/motion (forge/MOTION.md): optional, separately importable icon animations.
//
//   packages/motion/dist/motion.css   every preset (@keyframes wm-<preset>[-loop]), triggers, explicit presets, swaps,
//                                     reduced motion. Driven by CSS variables, so one keyframe serves every icon.
//   packages/motion/dist/icons.css    per-icon defaults: [data-wm="<name>"], with-icon[name="<name>"] { --wmL…; --wmH… }
//   packages/motion/dist/icons/<name>.css  one icon's defaults alone (the element links it on a CDN page without icons.css)
//   packages/motion/dist/runtime.js   the runtime without the spec table (what element.js imports)
//   packages/motion/dist/icons.js     { <name>: spec }   (forge/motion/<name>.json, or a derived spec with auto: true)
//   packages/motion/dist/index.js     motionFor, motion, swap, pauseWhenOffscreen, PRESETS, EFFECTS (+ meta.js, keyframes.js)
//   packages/motion/dist/element.js   <with-icon motion=… preset=… swap-to=… swap-effect=…>
//   packages/motion/dist/export.js    animatedSvg, animatedSwapSvg, renderFrames, encodeGif, gif, video, webm
//   site/vendor/motion/motion.css     motion.css + icons.css in one file (and icons.css beside it)
//   site/vendor/motion/motion.js      classic script: window.WithMotion (runtime + element upgrade + export helpers)
//   site/data/motion.js               window.WITH_MOTION = { <name>: spec }
//
// Hand-written sources live in packages/motion/src (and README.md). Runs inside forge/build.mjs, or standalone:
//   node forge/lib/emit-motion.mjs
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const PKG = 'packages/motion'
const SRC = path.join(ROOT, PKG, 'src')
const imp = f => import(pathToFileURL(path.join(SRC, f)).href)
const J = v => JSON.stringify(v)

// ------------------------------------------------------------------ specs
const DIRWORDS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0], north: [0, -1], south: [0, 1], west: [-1, 0], east: [1, 0] }
function dirOf(name) {
  let x = 0, y = 0
  for (const t of name.split('-')) if (DIRWORDS[t]) { x += DIRWORDS[t][0]; y += DIRWORDS[t][1] }
  if (!x && !y) return null
  return Math.round((Math.atan2(y, x) * 180 / Math.PI + 360) % 360)
}
const w = (...words) => new RegExp('(?:^|-)(?:' + words.join('|') + ')(?:-|$)')
// [pattern, loop, hover]  — first match wins; used only for icons without a hand-written forge/motion spec
const RULES = [
  [w('loader', 'loading', 'spinner', 'throbber'), { preset: 'tick', steps: 8, duration: 1 }, { preset: 'spin-once' }],
  [w('settings', 'cog', 'cogs', 'gear', 'gears'), { preset: 'spin', duration: 6 }, { preset: 'spin-once' }],
  [w('refresh', 'reload', 'sync', 'rotate', 'repeat', 'recycle', 'redo', 'undo'), { preset: 'spin', duration: 3 }, { preset: 'spin-once' }],
  [w('clock', 'timer', 'stopwatch', 'watch', 'time', 'history'), { preset: 'tick', steps: 12, duration: 6 }, { preset: 'spin-once' }],
  [w('hourglass'), { preset: 'rock' }, { preset: 'flip' }],
  [w('heart', 'hearts', 'love', 'like', 'health'), { preset: 'beat' }, { preset: 'pop' }],
  [w('star', 'stars', 'sparkle', 'sparkles', 'magic', 'wand', 'gem', 'diamond', 'shine'), { preset: 'twinkle' }, { preset: 'twinkle' }],
  [w('bell', 'alarm', 'notification', 'notifications'), { preset: 'ring', origin: [12, 3.5], amount: 0.7, duration: 2.6 }, { preset: 'ring', origin: [12, 3.5] }],
  [w('eye', 'eyes', 'view', 'visible', 'visibility'), { preset: 'blink' }, { preset: 'blink' }],
  [w('flame', 'fire', 'candle', 'campfire', 'torch'), { preset: 'flicker' }, { preset: 'flicker' }],
  [w('zap', 'bolt', 'lightning', 'flash', 'thunder', 'electric'), { preset: 'flicker' }, { preset: 'glow' }],
  [w('lightbulb', 'bulb', 'idea', 'lamp', 'sun', 'sunny', 'brightness', 'power'), { preset: 'glow' }, { preset: 'glow' }],
  [w('moon', 'night', 'sleep', 'bed', 'meditation', 'zen', 'yoga'), { preset: 'breathe' }, { preset: 'tilt' }],
  [w('leaf', 'leaves', 'plant', 'flower', 'tree', 'sprout', 'seedling', 'clover', 'cactus', 'palm'), { preset: 'sway' }, { preset: 'sway', amount: 1.4 }],
  [w('flag', 'flags', 'banner'), { preset: 'sway', origin: [5, 21] }, { preset: 'wiggle', origin: [5, 21] }],
  [w('rain', 'droplet', 'drop', 'water', 'drizzle', 'snow', 'snowflake'), { preset: 'drop' }, { preset: 'drop' }],
  [w('rocket', 'launch'), { preset: 'float' }, { preset: 'rise' }],
  [w('cloud', 'clouds', 'balloon', 'plane', 'airplane', 'ghost', 'bot', 'robot', 'ufo', 'bird', 'feather', 'kite'), { preset: 'float' }, { preset: 'bounce' }],
  [w('download'), { preset: 'nudge', dir: 90, amount: 0.6 }, { preset: 'pass', dir: 90, duration: 0.8 }],
  [w('upload', 'import'), { preset: 'nudge', dir: 270, amount: 0.6 }, { preset: 'pass', dir: 270, duration: 0.8 }],
  [w('send', 'share', 'external', 'paper-plane'), { preset: 'nudge', dir: 315, amount: 0.6 }, { preset: 'pass', dir: 315, duration: 0.8 }],
  [w('log-out', 'logout', 'sign-out', 'exit', 'leave'), { preset: 'nudge', dir: 0, amount: 0.6 }, { preset: 'nudge', dir: 0 }],
  [w('log-in', 'login', 'sign-in', 'enter'), { preset: 'nudge', dir: 0, amount: 0.6 }, { preset: 'nudge', dir: 0 }],
  [w('zoom-in', 'zoom-out', 'maximize', 'minimize', 'expand', 'shrink', 'fullscreen', 'focus', 'scan'), { preset: 'zoom', amount: 0.6 }, { preset: 'zoom' }],
  [w('search', 'magnifier', 'magnifying', 'find', 'lens'), { preset: 'tilt', amount: 0.6 }, { preset: 'tilt' }],
  [w('trash', 'delete', 'bin', 'remove', 'erase', 'eraser'), { preset: 'breathe' }, { preset: 'shake' }],
  [w('check', 'checks', 'done', 'success', 'tick', 'approve', 'verified', 'badge-check', 'signature', 'route', 'pen-tool'), { preset: 'draw' }, { preset: 'draw' }],
  [w('x', 'close', 'cancel', 'ban', 'error', 'alert', 'warning', 'danger', 'octagon', 'block', 'forbidden', 'denied'), { preset: 'pulse', amount: 0.6 }, { preset: 'shake' }],
  [w('plus', 'add', 'new', 'create', 'gift', 'present'), { preset: 'pulse', amount: 0.6 }, { preset: 'pop' }],
  [w('edit', 'pencil', 'pen', 'brush', 'paintbrush', 'write', 'highlighter', 'marker', 'crayon', 'palette', 'bug'), { preset: 'wiggle', amount: 0.6 }, { preset: 'wiggle' }],
  [w('lock', 'unlock', 'shield', 'key', 'keys', 'security', 'fingerprint', 'safe', 'vault', 'password'), { preset: 'breathe' }, { preset: 'shake', amount: 0.7 }],
  [w('battery', 'charging', 'signal', 'wifi', 'progress', 'volume', 'bar', 'bars', 'gauge', 'meter', 'level'), { preset: 'fill' }, { preset: 'fill' }],
  [w('play', 'pause', 'stop', 'music', 'audio', 'mic', 'microphone', 'record', 'radio', 'podcast', 'headphones', 'speaker', 'disc', 'vinyl'), { preset: 'pulse', amount: 0.6 }, { preset: 'pop' }],
  [w('chart', 'graph', 'trending', 'activity', 'analytics', 'stats', 'pulse', 'line', 'pie', 'donut'), { preset: 'draw' }, { preset: 'draw' }],
  [w('keyboard', 'terminal', 'code', 'command', 'type', 'typing', 'text', 'message', 'messages', 'chat', 'comment', 'comments', 'console', 'braces', 'brackets'), { preset: 'type' }, { preset: 'type' }],
  [w('smile', 'laugh', 'happy', 'emoji', 'face', 'kawaii', 'cat', 'dog', 'paw'), { preset: 'jelly', amount: 0.5 }, { preset: 'jelly' }],
  [w('user', 'users', 'person', 'people', 'profile', 'account', 'contact', 'team', 'avatar', 'baby'), { preset: 'breathe' }, { preset: 'nod' }],
  [w('trophy', 'award', 'medal', 'crown', 'party', 'confetti', 'celebrate', 'cake', 'firework', 'fireworks'), { preset: 'twinkle' }, { preset: 'tada' }],
  [w('cart', 'basket', 'bag', 'shopping', 'package', 'box', 'parcel', 'shop', 'store', 'ball', 'basketball', 'football', 'soccer'), { preset: 'bounce', amount: 0.6 }, { preset: 'bounce' }],
  [w('pin', 'map-pin', 'location', 'marker', 'navigation', 'gps', 'locate'), { preset: 'bounce', amount: 0.6 }, { preset: 'bounce' }],
  [w('compass', 'globe', 'earth', 'planet', 'world', 'atom', 'satellite', 'orbit'), { preset: 'orbit' }, { preset: 'spin-once' }],
  [w('coin', 'coins', 'card', 'credit-card', 'wallet', 'money', 'dollar', 'euro', 'cash', 'bitcoin', 'id-card', 'ticket'), { preset: 'flip', duration: 3 }, { preset: 'flip' }],
  [w('anchor', 'boat', 'ship', 'sailboat', 'cradle', 'swing'), { preset: 'rock' }, { preset: 'rock' }],
  [w('phone', 'call', 'telephone', 'smartphone'), { preset: 'ring', amount: 0.5, duration: 2.6 }, { preset: 'wiggle' }],
  [w('mail', 'inbox', 'envelope', 'email', 'letter'), { preset: 'float', amount: 0.6 }, { preset: 'nudge', dir: 270 }],
  [w('calendar', 'date', 'schedule', 'event'), { preset: 'breathe' }, { preset: 'flip' }],
  [w('link', 'attach', 'attachment', 'paperclip', 'chain', 'unlink'), { preset: 'rock', amount: 0.6 }, { preset: 'wiggle' }],
  [w('tag', 'tags', 'bookmark', 'label', 'price'), { preset: 'sway', origin: [12, 3] }, { preset: 'ring', origin: [12, 3] }],
  [w('filter', 'sliders', 'toggle', 'switch', 'settings-2', 'adjust', 'tune'), { preset: 'jelly', amount: 0.5 }, { preset: 'jelly' }],
  [w('thumbs-up', 'thumb', 'yes', 'approve', 'agree'), { preset: 'nod', amount: 0.6 }, { preset: 'nod' }],
  [w('camera', 'image', 'images', 'photo', 'picture', 'video', 'film', 'movie', 'aperture'), { preset: 'pulse', amount: 0.5 }, { preset: 'pop' }],
]
const CATEGORY = {
  arrows: [{ preset: 'nudge' }, { preset: 'pass' }], navigation: [{ preset: 'nudge', amount: 0.6 }, { preset: 'nudge' }],
  actions: [{ preset: 'pulse', amount: 0.5 }, { preset: 'pop' }], status: [{ preset: 'pulse' }, { preset: 'pop' }],
  media: [{ preset: 'pulse', amount: 0.6 }, { preset: 'pop' }], files: [{ preset: 'float', amount: 0.6 }, { preset: 'jelly' }],
  communication: [{ preset: 'float', amount: 0.6 }, { preset: 'wiggle' }], users: [{ preset: 'breathe' }, { preset: 'nod' }],
  commerce: [{ preset: 'float', amount: 0.6 }, { preset: 'bounce' }], time: [{ preset: 'tick', steps: 12, duration: 6 }, { preset: 'spin-once' }],
  devices: [{ preset: 'breathe' }, { preset: 'pop' }], layout: [{ preset: 'breathe' }, { preset: 'zoom' }],
  text: [{ preset: 'type' }, { preset: 'pop' }], maps: [{ preset: 'float', amount: 0.6 }, { preset: 'bounce' }],
  development: [{ preset: 'type' }, { preset: 'wiggle' }], security: [{ preset: 'breathe' }, { preset: 'shake', amount: 0.7 }],
  charts: [{ preset: 'draw' }, { preset: 'draw' }], weather: [{ preset: 'float' }, { preset: 'twinkle' }],
  objects: [{ preset: 'float', amount: 0.6 }, { preset: 'pop' }],
}
// A sensible spec for an icon that has no forge/motion/<name>.json (yet).
export function autoSpec(name, category, PRESET_DEFAULTS) {
  const dir = dirOf(name)
  let loop, hover
  if (dir != null && /(?:^|-)(arrow|arrows|chevron|chevrons|caret|corner|move|triangle|navigation)(?:-|$)/.test(name)) {
    loop = { preset: 'nudge', dir, amount: 0.6 }; hover = { preset: 'pass', dir, duration: 0.8 }
  } else {
    const rule = RULES.find(([re]) => re.test(name))
    if (rule) { loop = { ...rule[1] }; hover = { ...rule[2] } }
    else { const c = CATEGORY[category] || [{ preset: 'breathe' }, { preset: 'pop' }]; loop = { ...c[0] }; hover = { ...c[1] } }
    if (dir != null) for (const m of [loop, hover]) if (['nudge', 'pass'].includes(m.preset) && m.dir == null) m.dir = dir
  }
  for (const m of [loop, hover]) if (['nudge', 'pass'].includes(m.preset) && m.dir == null) m.dir = 0
  const intent = (PRESET_DEFAULTS[loop.preset] && PRESET_DEFAULTS[loop.preset].intent) || 'moves gently'
  return { name, intent, loop, hover, auto: true }
}

function readJson(f) { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return null } }

async function loadSpecs(iconList) {
  const meta = await imp('meta.js')
  const motionDir = path.join(ROOT, 'forge', 'motion')
  let lint = null
  try { lint = (await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'check-motion.mjs')).href)).lint } catch { /* optional */ }
  const iconSet = new Set(iconList.map(i => i.name))
  const styleDir = path.join(ROOT, 'forge', 'styles')
  const styles = new Set(fs.existsSync(styleDir) ? fs.readdirSync(styleDir).filter(f => f.endsWith('.mjs') && !f.startsWith('_')).map(f => f.slice(0, -4)) : [])
  const specs = {}, warn = []
  let hand = 0
  for (const { name, category } of iconList) {
    const raw = readJson(path.join(motionDir, name + '.json'))
    let ok = raw && raw.name === name && raw.loop && raw.hover && meta.PRESET_DEFAULTS[raw.loop.preset] && meta.PRESET_DEFAULTS[raw.hover.preset]
    if (ok && lint) {
      const probs = lint(name, raw, iconSet, styles)
      // a swap to an icon that does not exist yet (being drawn right now) must not drop the whole spec
      const hard = probs.filter(p => !/swap\[\d+\]\.to/.test(p))
      if (hard.length) { ok = false; warn.push(...hard) }
      else if (probs.length) raw.swap = (raw.swap || []).filter(s => iconSet.has(String(s.to).split('@')[0]))
    }
    if (ok) {
      const s = { name, intent: raw.intent, loop: raw.loop, hover: raw.hover }
      if (raw.alt && raw.alt.length) s.alt = raw.alt.filter(a => meta.PRESET_DEFAULTS[a.preset])
      if (raw.swap && raw.swap.length) s.swap = raw.swap
      if (raw.parts && typeof raw.parts === 'object') {
        const parts = {}
        for (const k of ['A', 'S']) if (raw.parts[k] && typeof raw.parts[k] === 'object') parts[k] = raw.parts[k]
        if (Object.keys(parts).length) s.parts = parts
      }
      if (meta.DECO_KINDS.includes(raw.deco)) s.deco = raw.deco
      specs[name] = s; hand++
    } else specs[name] = autoSpec(name, category, meta.PRESET_DEFAULTS)
  }
  return { specs, hand, auto: iconList.length - hand, warn }
}

// ------------------------------------------------------------------ CSS
const chain = (user, p, s, def) => `var(${user}, var(${p}, var(${s}, ${def})))`

// Swap CSS. `wrap` = the wrapper selector, `on` = selectors (each ending at the wrapper) that mean "show B".
// `preview` = [[at-rule or '', selectors], ...]: extra "show B" selectors, each group optionally inside an at-rule
// (hover previews only where a real hover exists: @media (hover:hover)).
// Timing per swap, all optional, on the wrapper or any ancestor: --wm-swap-dur (one transition), --wm-swap-ease (easing of
// the incoming icon; default: the effect's own), --wm-swap-delay (wait before switching), --wm-swap-hold (wm-swap-auto: the
// rest on each icon). With none of them set the output looks exactly as before they existed.
function swapCss(K, M, { wrap, on, preview = [], loops = true }) {
  const { EFFECT_STATES, SWAP_EASE, swapLoopStops, keyframesCss, propsCss } = K
  const { EFFECT_DEFAULTS, EFFECTS, SWAP_HOLD, swapCycle } = M
  const S = v => `calc(var(--_sd) * ${v})`
  const DL = v => v ? `calc(var(--_sdl) + var(--_sd) * ${v})` : 'var(--_sdl)'   // a delay inside one transition, after --wm-swap-delay
  const EZ = e => `var(--wm-swap-ease, ${e})`
  const ENTER = ease => `transform var(--_sd) ${EZ(ease)} ${DL(0.12)},opacity ${S(0.6)} linear ${DL(0.12)},filter ${S(0.8)} ease-out ${DL(0.12)}`
  const EXIT = `transform ${S(0.62)} ${SWAP_EASE.exit} ${DL(0)},opacity ${S(0.45)} linear ${DL(0)},filter ${S(0.6)} ease-in ${DL(0)}`
  const FLIP = `transform var(--_sd) ${EZ(SWAP_EASE.flip)} ${DL(0)},opacity var(--_sd) steps(2,jump-none) ${DL(0)}`
  const fx = e => `.wm-fx-${e}`
  const springs = EFFECTS.filter(e => EFFECT_STATES[e].spring)
  const clips = EFFECTS.filter(e => EFFECT_STATES[e].clip)
  const out = []
  out.push(`${wrap}{display:inline-grid;place-items:center;vertical-align:middle;line-height:0;--_sd:var(--wm-swap-dur, ${EFFECT_DEFAULTS.fade.dur}s);--_sdl:var(--wm-swap-delay, 0s)}`)
  out.push(EFFECTS.filter(e => e !== 'fade').map(e => `${wrap}${fx(e)}{--_sd:var(--wm-swap-dur, ${EFFECT_DEFAULTS[e].dur}s)}`).join(''))
  out.push(`${wrap}>*{grid-area:1/1}`)
  // slides clip to the icon box plus a little bleed for stroke caps (clip-path inset works on Safari 7+, unlike
  // overflow:clip (Safari 16+) and overflow-clip-margin (no Safari); it creates no scroll container either)
  out.push(`${wrap}:is(${clips.map(fx).join(',')}){clip-path:inset(-.15em)}`)
  out.push(`${wrap}${fx('flip')}{perspective:var(--wm-persp, 6em)}${wrap}${fx('flip')}>*{backface-visibility:hidden}`)
  // OFF: A visible (entering), B hidden (exiting)
  out.push(`${wrap}>.wm-a{transition:${ENTER(SWAP_EASE.enter)}}`)
  out.push(`${wrap}>.wm-b{opacity:0;transition:${EXIT}}`)
  for (const e of EFFECTS) { const b = { ...EFFECT_STATES[e].b }; delete b.opacity; if (Object.keys(b).length) out.push(`${wrap}${fx(e)}>.wm-b{${propsCss(b)}}`) }
  out.push(`${wrap}:is(${springs.map(fx).join(',')})>.wm-a{transition:${ENTER(SWAP_EASE.spring)}}`)
  out.push(`${wrap}${fx('flip')}>*{transition:${FLIP}}`)
  // draw: strokes retract / draw on (needs pathLength, set by the runtime: .wm-drawable); otherwise a plain fade
  const D = `${wrap}${fx('draw')}.wm-drawable`
  out.push(`${D}>* [data-wm-pl]{stroke-dasharray:1 1.5}`)
  out.push(`${D}>.wm-a{transition:opacity ${S(0.15)} linear ${DL(0)}}${D}>.wm-b{transition:opacity ${S(0.3)} linear ${DL(0.6)}}`)
  out.push(`${D}>.wm-a [data-wm-pl]{stroke-dashoffset:0;transition:stroke-dashoffset ${S(0.88)} ${K.EASE.inOut} ${DL(0.12)}}`)
  out.push(`${D}>.wm-b [data-wm-pl]{stroke-dashoffset:1.01;transition:stroke-dashoffset ${S(0.6)} ${K.EASE.in} ${DL(0)}}`)
  out.push(`${D}>* [data-wm-fill]{transition:opacity ${S(0.3)} linear ${DL(0)}}${D}>.wm-a [data-wm-fill]{transition-delay:${DL(0.7)}}${D}>.wm-b [data-wm-fill]{opacity:0}`)
  // ON: A hidden (exiting), B visible (entering). Written once for the state selectors, then per preview group.
  const onRules = list => {
    const onSel = (extra, child) => list.map(s => s + extra + child).join(',')
    const ion = (child) => onSel(fx('draw') + '.wm-drawable', child)
    const r = []
    r.push(`${onSel('', '>.wm-a')}{opacity:0;transition:${EXIT}}`)
    r.push(`${onSel('', '>.wm-b')}{opacity:1;transform:none;filter:none;transition:${ENTER(SWAP_EASE.enter)}}`)
    for (const e of EFFECTS) { const a = { ...EFFECT_STATES[e].a }; delete a.opacity; if (Object.keys(a).length) r.push(`${onSel(fx(e), '>.wm-a')}{${propsCss(a)}}`) }
    r.push(`${onSel(`:is(${springs.map(fx).join(',')})`, '>.wm-b')}{transition:${ENTER(SWAP_EASE.spring)}}`)
    r.push(`${onSel(fx('flip'), '>*')}{transition:${FLIP}}`)
    r.push(`${ion('>.wm-a')}{opacity:0;transition:opacity ${S(0.3)} linear ${DL(0.6)}}${ion('>.wm-b')}{opacity:1;transition:opacity ${S(0.15)} linear ${DL(0)}}`)
    r.push(`${ion('>.wm-a [data-wm-pl]')}{stroke-dashoffset:1.01;transition:stroke-dashoffset ${S(0.6)} ${K.EASE.in} ${DL(0)}}`)
    r.push(`${ion('>.wm-b [data-wm-pl]')}{stroke-dashoffset:0;transition:stroke-dashoffset ${S(0.88)} ${K.EASE.inOut} ${DL(0.12)}}`)
    r.push(`${ion('>.wm-a [data-wm-fill]')}{opacity:0;transition-delay:${DL(0)}}${ion('>.wm-b [data-wm-fill]')}{opacity:1;transition-delay:${DL(0.7)}}`)
    return r.join('\n')
  }
  out.push(onRules(on))
  for (const [at, list] of preview) out.push(at ? `${at}{\n${onRules(list)}\n}` : onRules(list))
  if (loops) {
    // .wm-swap.wm-loop: A and B keep alternating (cycle --wm-swap-cycle, default 2.4s)
    for (const e of EFFECTS) {
      const { a, b } = swapLoopStops(e, 2.4, EFFECT_DEFAULTS[e].dur)
      out.push(keyframesCss(`wm-fx-${e}-a`, a) + keyframesCss(`wm-fx-${e}-b`, b))
    }
    out.push(`${wrap}.wm-loop>*{transition:none;animation:var(--_fxa, wm-fx-fade-a) var(--wm-swap-cycle, 2.4s) linear var(--wm-delay, 0s) infinite both}`)
    out.push(`${wrap}.wm-loop>.wm-b{animation-name:var(--_fxb, wm-fx-fade-b)}`)
    out.push(EFFECTS.map(e => `${wrap}.wm-loop${fx(e)}{--_fxa:wm-fx-${e}-a;--_fxb:wm-fx-${e}-b}`).join(''))
    out.push(`${wrap}.wm-loop:is(.wm-paused,.wm-offscreen)>*{animation-play-state:paused}`)
    // .wm-swap-auto: turns into B and back on its own, resting --wm-swap-hold on each icon (CSS only). The keyframes carry
    // the effect's default proportions; a custom --wm-swap-dur / --wm-swap-hold stretches the whole cycle, 2 x (dur + hold).
    // The JS runtime (swap(el, { trigger: 'auto' }), <with-icon swap-trigger="auto">) times every transition exactly.
    for (const e of EFFECTS) {
      const d = EFFECT_DEFAULTS[e].dur, { a, b } = swapLoopStops(e, swapCycle(d, SWAP_HOLD), d, { hold: SWAP_HOLD })
      out.push(keyframesCss(`wm-fx-${e}-auto-a`, a) + keyframesCss(`wm-fx-${e}-auto-b`, b))
    }
    const AU = `${wrap}.wm-swap-auto:not(.wm-js)`
    out.push(`${AU}>*{transition:none;animation:var(--_fxaa, wm-fx-fade-auto-a) var(--wm-swap-cycle, calc(2 * (var(--_sd) + var(--wm-swap-hold, ${SWAP_HOLD}s)))) linear var(--_sdl) infinite both}`)
    out.push(`${AU}>.wm-b{animation-name:var(--_fxab, wm-fx-fade-auto-b)}`)
    out.push(EFFECTS.map(e => `${wrap}.wm-swap-auto${fx(e)}{--_fxaa:wm-fx-${e}-auto-a;--_fxab:wm-fx-${e}-auto-b}`).join(''))
    out.push(`${wrap}.wm-swap-auto:is(.wm-paused,.wm-offscreen)>*{animation-play-state:paused}`)
  }
  return out.join('\n')
}

// ------------------------------------------------------------------ parts choreography
// Wrapper variables for the parts of one slot (L loop, H one-shot), resolved on the wrapper and inherited by the nodes.
// Order everywhere: --wm-* (yours) > explicit preset (--wmP-*) > the icon's part (--wm<S>-a-*) > the object's value.
function partWrapVars(s) {
  const L = s === 'L'
  const v = [
    '--_dur:max(var(--_ad), var(--_am))', '--_dl:var(--wm-delay, 0s)',
    `--_sh:var(--wmP-sh${L ? 'l' : 's'}, var(--wm${s}-sh, var(--_an)))`,
    `--_dk:var(--wm-deco, var(--wmP-dc, var(--wm${s}-dc, wm-deco-breathe)))`,
    L ? '--_dd:var(--wmP-dd, var(--wmL-dd, 2.8s));--_ddl:calc(var(--_dl) - var(--_dd) / 2)' : '--_dd:var(--_dur);--_ddl:calc(var(--_dl) + .08s)',
  ]
  for (const x of ['a', 's']) {
    const q = `--wm${s}-${x}`
    v.push(`--_p${x}n:var(--wmP-${L ? 'l' : 's'}, var(${q}, var(--_an)))`,
      `--_p${x}d:${L ? `var(--wm-dur, var(--wmP-dl, var(${q}-d, var(--_dur))))` : 'var(--_dur)'}`,
      `--_p${x}k:${chain('--wm-k', '--wmP-k', q + '-k', 'var(--_k)')}`,
      `--_p${x}x:${chain('--wm-dx', '--wmP-dx', q + '-dx', 'var(--_dx)')}`,
      `--_p${x}y:${chain('--wm-dy', '--wmP-dy', q + '-dy', 'var(--_dy)')}`,
      `--_p${x}e:${chain('--wm-ease', '--wmP-e', q + '-e', 'var(--_ae)')}`,
      `--_p${x}ox:${chain('--wm-ox', '--wmP-ox', q + '-ox', 'var(--_ox)')}`,
      `--_p${x}oy:${chain('--wm-oy', '--wmP-oy', q + '-oy', 'var(--_oy)')}`,
      `--_p${x}dl:calc(var(--_dl) + var(--wmP-z, var(${q}-dl, 0s)))`)
  }
  return v.join(';')
}
// Children only animate while the wrapper's rule (loop / one-shot) hands them --_an: an idle wrapper resets it, so the
// node rules need no copy of the trigger selectors.
const WRAPS = '.wm,.wm-loop,.wm-hover,.wm-once,.wm-run,with-icon'
function partsCss(PC) {
  const TAGS = PC.PART_TAGS, partNodeRules = PC.partNodeRules
  const A = `:is(${WRAPS}):not(.wm-swap,.wm-drawing)`
  const H = `:has(>svg>:is(${TAGS}))`, HS = `:has(>:is(${TAGS}))`
  const out = []
  // 1. a wrapper the runtime marked (.wm-parts); 2. the same through :has() for CSS-only use, in rules of their own
  // (a browser without :has() drops only those and keeps animating the whole icon)
  out.push(`${A}.wm-parts{animation-name:none}`, `${A}${H},svg${A}${HS}{animation-name:none}`)
  out.push(partNodeRules([`${A}.wm-parts>svg>`, `svg${A}.wm-parts>`]))
  out.push(partNodeRules([`${A}${H}>svg>`, `svg${A}${HS}>`]))
  return out.join('\n')
}

function buildMotionCss(K, M, version, PC) {
  const { PRESET_DEFAULTS, PRESETS, keyframeName, hasLoopVariant, pct } = M
  const out = []
  out.push(`/* @withicons/motion ${version} — motion.css. MIT. https://withicons.com\n` +
    `   Classes: wm (base) + wm-loop | wm-hover | wm-once | wm-inview (JS) | wm-paused | wm-force; explicit preset wm-p-<preset>;\n` +
    `   swaps: wm-swap + wm-fx-<effect> with children wm-a / wm-b. Per-icon defaults: icons.css ([data-wm="<name>"]).\n` +
    `   Variables: --wm-dur --wm-k --wm-ox --wm-oy --wm-dx --wm-dy --wm-ease (or --wm-steps) --wm-delay --wm-swap-dur --wm-swap-ease --wm-swap-delay --wm-swap-hold --wm-swap-cycle.\n` +
    `   Swap triggers: state (is-on, aria-pressed / -expanded / -checked), hover or focus of a .wm-trigger, wm-swap-focus, wm-swap-auto, wm-loop. */`)
  // keyframes
  const kf = []
  for (const p of PRESETS) {
    kf.push(K.keyframesCss('wm-' + p, K.presetStops(p, false)))
    if (hasLoopVariant(p)) kf.push(K.keyframesCss('wm-' + p + '-loop', K.presetStops(p, true)))
  }
  for (const [n, stops] of Object.entries(K.DRAW_KEYFRAMES)) kf.push(K.keyframesCss(n, stops))
  kf.push(PC.partKeyframes())
  out.push(kf.join('\n'))
  // base
  out.push(`:where(span,i).wm{display:inline-block;line-height:0}`)
  out.push(`svg .wm{transform-box:view-box}`)
  out.push(`.wm[style*="--wm-steps"]{--wm-ease:steps(var(--wm-steps))}`)
  // loop
  const LOOP = '.wm-loop,with-icon[motion="loop"]'
  out.push(`:where(${WRAPS}){--_an:initial}`)
  // duration with a floor (--_am): flicker never runs faster than PRESET_DEFAULTS.flicker.min (WCAG 2.3.1 flashes)
  const DUR = 'max(var(--_ad), var(--_am))'
  const vars = s => [
    `--_k:${chain('--wm-k', '--wmP-k', `--wm${s}-k`, 1)}`,
    `--_dx:${chain('--wm-dx', '--wmP-dx', `--wm${s}-dx`, 1)}`,
    `--_dy:${chain('--wm-dy', '--wmP-dy', `--wm${s}-dy`, 0)}`,
    `--_ad:${chain('--wm-dur', s === 'L' ? '--wmP-dl' : '--wmP-ds', `--wm${s}-d`, '1s')}`,
    `--_ae:${chain('--wm-ease', '--wmP-e', `--wm${s}-e`, 'linear')}`,
    `--_am:var(--wmP-m, var(--wm${s}-m, 0s))`,
    `--_ox:${chain('--wm-ox', '--wmP-ox', `--wm${s}-ox`, '50%')}`,
    `--_oy:${chain('--wm-oy', '--wmP-oy', `--wm${s}-oy`, '50%')}`,
    'transform-origin:var(--_ox) var(--_oy)',
    partWrapVars(s),
  ].join(';')
  out.push(`:is(${LOOP}){${vars('L')};--_an:var(--wmP-l, var(--wmL, none));--_ai:infinite;animation:var(--_an) ${DUR} var(--_ae) var(--wm-delay, 0s) infinite both}`)
  // one-shots: hover/focus of the element or of a .wm-trigger ancestor (CSS), once on load, or .wm-run (JS)
  const H = '.wm-hover:not(.wm-js)', WH = 'with-icon[motion="hover"]:not(.wm-js)'
  const SHOT = [`${H}:hover`, `${H}:focus-visible`, `.wm-trigger:hover ${H}`, `.wm-trigger:focus-visible ${H}`,
    `${WH}:hover`, `.wm-trigger:hover ${WH}`, `.wm-trigger:focus-visible ${WH}`,
    '.wm-once', 'with-icon[motion="once"]', '.wm-run'].join(',')
  out.push(`:is(${SHOT}){${vars('H')};--_an:var(--wmP-s, var(--wmH, none));--_ai:1;animation:var(--_an) ${DUR} var(--_ae) var(--wm-delay, 0s) 1 both}`)
  // parts: inside an inline SVG whose renderer tagged its nodes, each part plays its own role (MOTION.md "Parts
  // choreography"): the wrapper stands still, object nodes play the preset, plates their override, decorations their
  // own counter-phased loop, cast shadows stay on the ground. .wm-parts (set by motion() / the element) or :has().
  out.push(partsCss(PC))
  // draw: strokes draw on when the runtime prepared them (.wm-drawing); the element itself stays still
  out.push(`.wm-drawing{animation-name:none!important}`)
  out.push(`:is(${LOOP}).wm-drawing [data-wm-pl]{stroke-dasharray:1 1.5;animation:wm-draw-path-loop var(--_ad) linear var(--wm-delay, 0s) infinite both}`)
  out.push(`:is(${LOOP}).wm-drawing [data-wm-fill]{animation:wm-draw-fill-loop var(--_ad) linear var(--wm-delay, 0s) infinite both}`)
  out.push(`:is(${SHOT}).wm-drawing [data-wm-pl]{stroke-dasharray:1 1.5;animation:wm-draw-path var(--_ad) linear var(--wm-delay, 0s) 1 both}`)
  out.push(`:is(${SHOT}).wm-drawing [data-wm-fill]{animation:wm-draw-fill var(--_ad) linear var(--wm-delay, 0s) 1 both}`)
  // wm-offscreen: set by the JS helper / element while a loop is scrolled out of view (IntersectionObserver)
  out.push(`:is(.wm-paused,.wm-offscreen),:is(.wm-paused,.wm-offscreen) :is([data-wm-pl],[data-wm-fill],svg>*),with-icon[paused]{animation-play-state:paused!important}`)
  // explicit presets
  const fmt = n => String(Math.round(n * 1e4) / 1e4).replace(/^0\./, '.')
  out.push(PRESETS.map(p => {
    const d = PRESET_DEFAULTS[p]
    const o = d.origin || [12, 12]
    const [dx, dy] = M.dirVec(d.dir || 0)
    return `.wm-p-${p},with-icon[preset="${p}"]{--wmP-l:${keyframeName(p, true)};--wmP-s:${keyframeName(p, false)};--wmP-dl:${fmt(d.cycle)}s;--wmP-ds:${fmt(d.shot)}s;` +
      `--wmP-e:${d.ease || 'linear'};--wmP-ox:${pct(o[0])};--wmP-oy:${pct(o[1])};--wmP-k:1;--wmP-dx:${fmt(dx)};--wmP-dy:${fmt(dy)};--wmP-m:${fmt(d.min || 0)}s;` +
      `--wmP-shl:${M.GROUND_PRESETS.includes(p) ? 'wm-shadow-' + p + (hasLoopVariant(p) ? '-loop' : '') : keyframeName(p, true)};--wmP-shs:${M.GROUND_PRESETS.includes(p) ? 'wm-shadow-' + p : keyframeName(p, false)};` +
      `--wmP-dc:wm-deco-${M.decoOf(p)};--wmP-dd:${fmt(d.cycle * M.decoTimes(d.cycle))}s;--wmP-z:0s}`
  }).join('\n'))
  // glow / twinkle halo without color-mix() (Safari < 16.2, Chromium < 111): a later @keyframes of the same name wins
  out.push(`@supports not (color:color-mix(in srgb,red,red)){` + ['glow', 'twinkle'].flatMap(p => {
    const kfs = [K.keyframesCss('wm-' + p, K.presetStops(p, false, { css: true, legacyGlow: true }))]
    if (hasLoopVariant(p)) kfs.push(K.keyframesCss('wm-' + p + '-loop', K.presetStops(p, true, { css: true, legacyGlow: true })))
    return kfs
  }).join('') + '}')
  // swaps. State (is-on / aria-pressed / -expanded / -checked) always wins. Hover and keyboard focus of a .wm-trigger
  // only *preview* B, and only on a trigger that carries no state of its own: a toggle button follows its state, so
  // sticky :hover after a tap (touch) or :focus-visible (keyboard) can never hold the wrong icon. Hover previews also
  // need a real hover (@media (hover:hover)), so phones and tablets never get a stuck preview.
  const ON = ['.wm-swap.is-on', '.wm-swap[aria-pressed="true"]', '.wm-swap[aria-expanded="true"]', '.wm-swap[aria-checked="true"]',
    '.is-on .wm-swap', '[aria-pressed="true"] .wm-swap', '[aria-expanded="true"] .wm-swap', '[aria-checked="true"] .wm-swap']
  const NS = ':not([aria-pressed]):not([aria-expanded]):not([aria-checked])'   // stateless (chained :not works everywhere)
  // swaps that follow hover / keyboard focus: not the ones a script drives (.wm-js), focus swaps, auto swaps or loops
  const OWN = ':not(.wm-js):not(.wm-swap-focus):not(.wm-swap-auto):not(.wm-loop)'
  const prev = st => [`.wm-trigger${NS}${st} .wm-swap${NS}${OWN}`, `.wm-swap.wm-trigger${NS}${OWN}${st}`]
  // wm-swap-focus: B while the trigger (a button, a field's label...) or the swap itself holds focus, from mouse, touch or keys
  const focus = ['.wm-trigger:focus-within .wm-swap.wm-swap-focus:not(.wm-js)', '.wm-swap.wm-swap-focus:not(.wm-js):focus-within']
  out.push(swapCss(K, M, { wrap: '.wm-swap', on: ON, preview: [['@media (hover:hover)', prev(':hover')], ['', prev(':focus-visible')], ['', focus]] }))
  // reduced motion: everything stops (swaps become an instant-ish crossfade) unless .wm-force
  out.push(`@media (prefers-reduced-motion:reduce){` +
    `:is(.wm,with-icon[motion]):not(.wm-force),:is(.wm,with-icon[motion]):not(.wm-force) *,.wm-swap:not(.wm-force)>*,.wm-swap:not(.wm-force) [data-wm-pl]{animation:none!important}` +
    `.wm-swap:not(.wm-force)>*{transition:opacity .15s linear!important;transform:none!important;filter:none!important}` +
    `.wm-swap:not(.wm-force) [data-wm-pl]{transition:none!important;stroke-dasharray:none!important}}`)
  return out.join('\n') + '\n'
}

function buildShadowCss(K, M) {
  // inside <with-icon>'s shadow root: swaps (host state) and draw strokes (host trigger)
  const host = ':host(:is(.is-on,[aria-pressed="true"],[data-wm-on]))'
  const sw = swapCss(K, M, { wrap: '.wm-swap', on: [host + ' .wm-swap'], loops: false })
  const kf = Object.entries(K.DRAW_KEYFRAMES).map(([n, s]) => K.keyframesCss(n, s)).join('')
  const L = ':host([motion="loop"].wm-drawing)', S = ':host(.wm-drawing:is([motion="once"],.wm-run,[motion="hover"]:not(.wm-js):hover))'
  const t = 'var(--_ad, 1.6s) linear var(--wm-delay, 0s)'
  const draw = `${L} [data-wm-pl]{stroke-dasharray:1 1.5;animation:wm-draw-path-loop ${t} infinite both}${L} [data-wm-fill]{animation:wm-draw-fill-loop ${t} infinite both}` +
    `${S} [data-wm-pl]{stroke-dasharray:1 1.5;animation:wm-draw-path ${t} 1 both}${S} [data-wm-fill]{animation:wm-draw-fill ${t} 1 both}` +
    `:host(:is([paused],.wm-paused,.wm-offscreen)) *{animation-play-state:paused!important}`
  const rm = `@media (prefers-reduced-motion:reduce){:host(:not(.wm-force)) *{animation:none!important}:host(:not(.wm-force)) .wm-swap>*{transition:opacity .15s linear!important;transform:none!important;filter:none!important}}`
  return [sw, kf, draw, rm].join('\n')
}

// icons.css (every icon) and, per icon, the same rule alone: dist/icons/<name>.css
function iconRules(M, specs) {
  const out = {}
  for (const name of Object.keys(specs)) {
    const v = M.specVars(specs[name])
    const body = Object.keys(v).map(k => `${k}:${v[k]}`).join(';')
    if (body) out[name] = `[data-wm="${name}"],with-icon[name="${name}"]{${body}}`
  }
  return out
}
function buildIconsCss(rules, version) {
  const lines = [`/* @withicons/motion ${version} — icons.css: each icon's own loop (--wmL…) and hover (--wmH…) defaults. MIT. */`]
  for (const name of Object.keys(rules)) lines.push(rules[name])
  return lines.join('\n') + '\n'
}

// ------------------------------------------------------------------ JS
const src = f => fs.readFileSync(path.join(SRC, f), 'utf8')
// strip ESM syntax so several source files can share one classic-script scope
function classic(code) {
  return code.replace(/\r\n/g, '\n').replace(/^import [^\n]*\n/gm, '').replace(/^export \{[^}]*\}( from [^\n]*)?\n/gm, '').replace(/^export (function|const|async function|let|class) /gm, '$1 ')
}
function mustReplace(s, a, b) { if (!s.includes(a)) throw new Error(`emit-motion: marker not found: ${a}`); return s.replace(a, b) }

function buildSiteJs(version, shadowCss) {
  const runtime = classic(src('runtime.js'))
  let index = classic(src('index.js'))
  index = mustReplace(index, 'const specTable = () => SPECS', "const specTable = () => (typeof window !== 'undefined' && window.WITH_MOTION) || {}")
  const parts = [classic(src('meta.js')), classic(src('keyframes.js')), classic(src('parts.js')), classic(src('parts-css.js')), runtime, index, `const SHADOW_CSS = ${J(shadowCss)}`,
    mustReplace(classic(src('element.js')), 'String(import.meta.url)', "''"), classic(src('export.js'))]
  const api = ['motionFor', 'motion', 'motionAttrs', 'swap', 'prepareDraw', 'unprepareDraw', 'upgradeMotion', 'PRESETS', 'EFFECTS', 'PRESET_DEFAULTS', 'EFFECT_DEFAULTS',
    'specVars', 'slotVars', 'keyframeName', 'presetStops', 'keyframesCss', 'swapLoopStops', 'parseSvg', 'resolveMotion', 'animatedSvg', 'animatedSwapSvg',
    'exportDuration', 'frameSvg', 'renderFrames', 'encodeGif', 'gif', 'video', 'webm', 'pauseWhenOffscreen',
    'SWAP_HOLD', 'SWAP_EASES', 'swapEase', 'swapCycle', 'EFFECT_STATES', 'SWAP_EASE',
    'partsPlan', 'resolveSpecMotion', 'sampleRole', 'sampleMatrix', 'easeFn', 'partRole', 'hasParts', 'partsSvg', 'partVars', 'decoOf', 'DECO_KINDS', 'shadowPartsCss']
  return `/* @withicons/motion ${version} — website build: window.WithMotion (same API as the npm package + export helpers). MIT. Generated, do not edit. */\n` +
    `;(function () {\n'use strict'\n${parts.join('\n')}\n` +
    `const api = { version: ${J(version)}, ${api.join(', ')} }\nif (typeof window !== 'undefined') window.WithMotion = api\n})();\n`
}

function dtsIcons(names) {
  return `import type { MotionSpec } from './index.js'\nexport type MotionIconName = ${names.length ? names.map(J).join(' | ') : 'string'}\n` +
    `declare const specs: Record<MotionIconName, MotionSpec>\nexport default specs\n`
}

// ------------------------------------------------------------------ emit
function iconsFromDisk() {
  const dir = path.join(ROOT, 'forge', 'icons')
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort()
    .map(name => ({ name, category: (readJson(path.join(dir, name + '.json')) || {}).category || '' }))
}

export default async function emit(ctx) {
  ctx = ctx || {}
  const version = ctx.version || JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).withiconsVersion || '0.1.0'
  const write = ctx.write || ((rel, text) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text) })
  const writeIfChanged = (rel, text) => { const f = path.join(ROOT, rel); if (fs.existsSync(f) && fs.readFileSync(f, 'utf8') === text) return; write(rel, text) }
  const M = await imp('meta.js'), K = await imp('keyframes.js')
  const iconList = ctx.icons ? ctx.icons.map(i => ({ name: i.name, category: i.category })) : iconsFromDisk()
  const { specs, hand, auto, warn } = await loadSpecs(iconList)

  const PC = await imp('parts-css.js')
  const motionCss = buildMotionCss(K, M, version, PC)
  const rules = iconRules(M, specs)
  const iconsCss = buildIconsCss(rules, version)
  const shadowCss = buildShadowCss(K, M)
  const header = `// @withicons/motion ${version} — generated from packages/motion/src, do not edit. MIT.\n`

  // dist
  const D = PKG + '/dist/'
  const files = {
    'motion.css': motionCss, 'icons.css': iconsCss,
    'icons.js': `${header}export default ${J(specs)}\n`,
    'icons.d.ts': dtsIcons(Object.keys(specs)),
    'shadow-css.js': `${header}export const SHADOW_CSS = ${J(shadowCss)}\n`,
  }
  for (const f of ['meta.js', 'keyframes.js', 'parts.js', 'parts-css.js', 'runtime.js', 'index.js', 'element.js', 'export.js']) files[f] = header + src(f)
  for (const f of fs.readdirSync(SRC).filter(f => f.endsWith('.d.ts'))) files[f] = src(f)
  // one icon's defaults alone: what a CDN page without icons.css loads (the element links them by itself)
  for (const name of Object.keys(rules)) files[`icons/${name}.css`] = rules[name] + '\n'
  const distDir = path.join(ROOT, D)
  if (fs.existsSync(distDir)) for (const f of fs.readdirSync(distDir)) if (!files[f] && f !== 'icons') fs.rmSync(path.join(distDir, f), { recursive: true, force: true })
  const iconDir = path.join(distDir, 'icons')
  if (fs.existsSync(iconDir)) for (const f of fs.readdirSync(iconDir)) if (!files['icons/' + f]) fs.rmSync(path.join(iconDir, f), { recursive: true, force: true })
  for (const [f, text] of Object.entries(files)) writeIfChanged(D + f, text)

  // package.json + LICENSE (README.md is hand-written)
  const pkg = {
    name: '@withicons/motion', version,
    description: 'Optional animations for with icons: 32 CSS presets, per-icon defaults, icon-to-icon swaps and animated SVG/GIF export. Pure CSS core, tiny dependency-free JS.',
    license: 'MIT', author: { name: 'with icons — powered by Evergrow', url: 'https://withevergrow.com' }, homepage: 'https://withicons.com',
    repository: { type: 'git', url: 'git+https://github.com/withevergrow/withicons.git', directory: 'packages/motion' },
    bugs: { url: 'https://github.com/withevergrow/withicons/issues' },
    keywords: ['icons', 'svg', 'icon-library', 'withicons', 'with-icons', 'animation', 'animated-icons', 'css-animation', 'micro-interactions', 'motion', 'hover', 'keyframes', 'icon-animation', 'animated-svg', 'svg-animation', 'gif', 'web-components', 'react', 'vue', 'svelte', 'reduced-motion'],
    type: 'module',
    sideEffects: ['*.css', './dist/element.js'],
    main: './dist/index.js', module: './dist/index.js', types: './dist/index.d.ts',
    exports: {
      '.': { types: './dist/index.d.ts', default: './dist/index.js' },
      './runtime': { types: './dist/runtime.d.ts', default: './dist/runtime.js' },
      './element': { types: './dist/element.d.ts', default: './dist/element.js' },
      './export': { types: './dist/export.d.ts', default: './dist/export.js' },
      './icons': { types: './dist/icons.d.ts', default: './dist/icons.js' },
      './motion.css': './dist/motion.css',
      './icons.css': './dist/icons.css',
      './icons/*': './dist/icons/*',
      './package.json': './package.json',
    },
    typesVersions: { '*': { runtime: ['./dist/runtime.d.ts'], element: ['./dist/element.d.ts'], export: ['./dist/export.d.ts'], icons: ['./dist/icons.d.ts'] } },
    style: './dist/motion.css',
    unpkg: './dist/motion.css', jsdelivr: './dist/motion.css',
    files: ['dist', 'README.md', 'LICENSE'],
    publishConfig: { access: 'public' },
    scripts: { test: 'node --test test/*.test.mjs' },
  }
  writeIfChanged(PKG + '/package.json', JSON.stringify(pkg, null, 2) + '\n')
  const lic = path.join(ROOT, 'packages', 'core', 'LICENSE')
  if (fs.existsSync(lic)) writeIfChanged(PKG + '/LICENSE', fs.readFileSync(lic, 'utf8'))

  // website
  const siteSpecs = `/* with icons motion specs (forge/motion), generated. */\nwindow.WITH_MOTION=${J(specs)};\n`
  writeIfChanged('site/data/motion.js', siteSpecs)
  writeIfChanged('site/vendor/motion/motion.css', motionCss + '\n' + iconsCss)
  writeIfChanged('site/vendor/motion/icons.css', iconsCss)
  writeIfChanged('site/vendor/motion/motion.js', buildSiteJs(version, shadowCss))

  const kb = s => (Buffer.byteLength(s) / 1024).toFixed(1) + ' KB'
  const msg = `${iconList.length} icons (${hand} hand specs, ${auto} derived); motion.css ${kb(motionCss)}, icons.css ${kb(iconsCss)}` +
    (warn.length ? `; ${warn.length} spec problem(s) -> derived: ${warn.slice(0, 3).join(' / ').trim()}` : '')
  return msg
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  emit().then(m => console.log('emit-motion: ' + m), e => { console.error(e); process.exitCode = 1 })
}
