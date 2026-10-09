// KAWAII per-icon tuning. Skeletons are never edited for a style: everything
// icon-specific (expression, colour, face position, no-face) lives here.
//
//   face:   false            -> no face (gets a heart / sparkle accent instead)
//           { x, y, s }      -> force the face centre (eye line) and scale
//           { dx, dy, s }    -> nudge the automatic position / cap its scale
//   expr:   smile | cat | joy | wink | sleepy | shock | sad | dizzy | love | calm
//   color:  1..6             -> palette slot of the main body
//   accent: 'heart' | 'sparkle' | false
//   blush:  false            -> keep the face, drop the cheeks
//   cheeks: [[x, y], ...]    -> blush only, for icons that already draw a face
//   hide:   [i, ...]         -> skip these skeleton paths (a padlock's keyhole makes way for a face)
//   hideCuts: [i, ...]       -> skip these cutouts too (the hole a hidden path left behind)
//   fills:  false            -> no pastel body (fills authored as slabs that the outline does not hold)
//           true             -> keep the pastel body even where no outline holds it (a scanned face disc)

// The candy box. Body colours are mid-pastels laid at FILL_OPACITY so they read
// as soft pastels on white and as muted jewel tones on #0B0B12, where the light
// outline and face still contrast.
export const PALETTE = [
  // [var role, colour, opacity]  warm hues sit more opaque so they stay sunny on dark
  ['fill-1', '#FF6FA5', 0.55],   // strawberry milk
  ['fill-2', '#FF9A66', 0.66],   // peach
  ['fill-3', '#FFD23A', 0.72],   // lemon custard
  ['fill-4', '#45D99A', 0.55],   // mint
  ['fill-5', '#5AB4FF', 0.55],   // baby blue
  ['fill-6', '#A98BFF', 0.58],   // lavender
]
export const BLUSH = ['blush', '#FF6F9C']
export const BLUSH_OPACITY = 0.55
export const SHINE = ['shine', '#FFFFFF']
export const ACCENT = ['accent', '#FF5C9A']
export const SPARKLE = ['sparkle', '#FFB627']

// colour by meaning first (a sun is lemon, a cloud is baby blue), else by name hash
const MEANING = [
  [/heart|gift|bookmark|tag|ticket|flag|smile|award|crown|trophy|pill|music|palette|sparkle/, 1],
  [/flame|fire|coffee|cookie|package|box|archive|bread|gauge|hammer|briefcase|store|truck|car/, 2],
  [/sun|star|zap|bolt|light|bulb|lightbulb|bell|key|coin|dollar|banknote|wallet|lemon|sticky|folder|lock|unlock|award/, 3],
  [/leaf|tree|plant|sprout|recycle|battery|check|map|landmark|globe|mountain|cactus|clipboard|calculator/, 4],
  [/cloud|droplet|water|snow|wind|umbrella|mail|message|send|wifi|phone|cloud|database|server|shield|anchor|plane|navigation/, 5],
  [/moon|night|magic|wand|brain|gamepad|headphones|camera|video|film|image|book|bot|user|crystal|planet/, 6],
]
export function colorFor(name, hash) {
  const t = TUNE[name]
  if (t && t.color) return t.color - 1
  for (const [re, c] of MEANING) if (re.test(name)) return c - 1
  return hash % PALETTE.length
}

// glyphs that should never wear a face: directional, typographic, punctuation
export const NO_FACE = /(-off$)|^((alert|check|plus|minus|x|help|info|play|pause|stop|arrow|chevron)-(circle|square|triangle)|(circle|square)-|arrow|chevron|corner|move|hash|at-sign|percent|bold|italic|underline|strikethrough|heading|type|text|align|list|quote|code|braces|pilcrow|minus|plus|check$|close|x$|menu|more-|drag-|maximize|minimize|sort|swap|shuffle|repeat|redo|undo|reply|rotate|refresh|trending|activity|chart-line|signal|loader|equal|divide|asterisk|slash|terminal|sliders|columns|sidebar|layout|table$|kanban|barcode|qr-code|link|unlink|external-link|log-in|log-out|share|git-|route|webhook|wifi|rss|fingerprint|scissors|crop|crosshair|filter|percent)/

// Avatars (avatar-*) draw their own face: never stamp a second one. People and creatures alike
// get kawaii's blush under their own eyes (a symmetric pair of small closed cutouts), placed just
// below and outside each eye; creatures keep the heart accent, people stay quiet (no accent).
const PEOPLE = /^avatar-(baby|boy|girl|teen|man|woman|older|person)/
const NO_CHEEKS = new Set(['avatar-robot', 'avatar-alien', 'avatar-ghost', 'avatar-monster', 'avatar-owl', 'avatar-dino', 'avatar-frog'])
export function avatarTune(icon) {
  const name = String(icon && icon.name || '')
  if (!name.startsWith('avatar-')) return null
  const t = { face: false }
  if (PEOPLE.test(name)) {
    t.accent = false
    // People: the skeleton's eye dots and smile, filleted at kawaii's chubby weight, melt into the chin
    // (a beard-like blob). Hide them (paths + their cutouts) and stamp kawaii's own tiny face on the eye line.
    // With glasses the lenses are the eyes: only the smile goes, and the blush sits under the lenses.
    const bb = pts => { let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y } return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 } }
    const feat = (p) => {
      if (p.plate !== 'K' || !p.subs || p.subs.length !== 1 || p.subs[0].closed) return null
      const b = bb(p.subs[0].pts)
      if (b.w > 4.6 || b.h > 1.6 || b.cx < 8 || b.cx > 16 || b.cy < 9.5 || b.cy > 16) return null
      return b.w < 0.6 ? 'eye' : 'mouth'
    }
    const glasses = (icon.paths || []).some(p => p.plate === 'A' && p.subs && p.subs.length === 1 && p.subs[0].closed && (b => b.w > 3 && b.w < 5 && b.cy > 9 && b.cy < 13.5 && b.cx > 6.5 && b.cx < 17.5)(bb(p.subs[0].pts)))
    const hide = [], ds = new Set(), eyeAt = []
    ;(icon.paths || []).forEach((p, i) => {
      const k = feat(p)
      if (!k || (glasses && k === 'eye')) return
      hide.push(i); ds.add(p.d)
      if (k === 'eye') eyeAt.push(bb(p.subs[0].pts))
    })
    const hideCuts = []
    ;(icon.cutouts || []).forEach((c, i) => {
      if (ds.has(c.d)) { hideCuts.push(i); return }
      const s = c.subs && c.subs[0]
      if (!s || !s.closed || c.subs.length !== 1) return
      const b = bb(s.pts)
      if (b.w < 2.2 && b.h < 2.2 && eyeAt.some(e => Math.abs(e.cx - b.cx) < 0.3 && Math.abs(e.cy - b.cy) < 0.6)) hideCuts.push(i)
    })
    // a short highlight stroke on a bald scalp: at 2.2 it is an ink blob; kawaii's own shine arc does its job
    ;(icon.paths || []).forEach((p, i) => {
      if (p.plate !== 'A' || !p.subs || p.subs.length !== 1 || p.subs[0].closed) return
      const b = bb(p.subs[0].pts)
      if (Math.max(b.w, b.h) < 2.6 && b.cy > 5 && b.cy < 9 && b.cx > 7 && b.cx < 17 && b.w > 0.5) hide.push(i)
    })
    if (hide.length) { t.hide = hide; t.hideCuts = hideCuts }
    if (glasses) {
      // Glasses: at kawaii's chubby 2.2 the lens rings swallow the lenses (they read as sunglasses). The frames are
      // drawn by the core at a finer weight round clear, glazed lenses, with dot eyes behind them and a small smile.
      const idx = [], lens = []
      ;(icon.paths || []).forEach((p, i) => {
        if (p.plate !== 'A' || !p.subs || p.subs.length !== 1) return
        const q = p.subs[0], b = bb(q.pts)
        if (q.closed && b.w > 3 && b.w < 5 && b.cy > 9 && b.cy < 13.5 && b.cx > 6.5 && b.cx < 17.5) { idx.push(i); lens.push(b) }
        else if (!q.closed && b.w < 2 && b.h < 0.3 && Math.abs(b.cx - 12) < 0.5 && b.cy > 9 && b.cy < 13.5) idx.push(i) // the bridge
      })
      const mouth = (icon.paths || []).map((p, i) => hide.includes(i) && feat(p) === 'mouth' ? bb(p.subs[0].pts) : null).find(Boolean)
      t.hide = [...(t.hide || []), ...idx]
      t.glass = { idx, eyes: lens.map(b => [b.cx, b.cy]), lensBottom: Math.max(...lens.map(b => b.y1)), mouth: mouth ? [mouth.cx, mouth.cy] : [12, 14.75] }
    }
    if (eyeAt.length === 2 && !glasses) {
      const y = (eyeAt[0].cy + eyeAt[1].cy) / 2, gap = Math.abs(eyeAt[0].cx - eyeAt[1].cx)
      t.face = { x: 12, y: Math.round((y + 0.25) * 100) / 100, s: Math.round(Math.min(1.05, gap / 4.7) * 100) / 100 }
      return t
    }
  }
  if (NO_CHEEKS.has(name)) return t
  const eyes = []
  for (const c of icon.cutouts || []) for (const s of c.subs || []) {
    if (!s.closed || !s.pts.length) continue
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
    for (const [x, y] of s.pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y }
    if (x1 - x0 < 2.2 && y1 - y0 < 2.2) eyes.push([(x0 + x1) / 2, (y0 + y1) / 2])
  }
  // the topmost symmetric pair about x = 12
  eyes.sort((a, b) => a[1] - b[1] || a[0] - b[0])
  for (const L of eyes) {
    if (L[0] >= 12) continue
    const R = eyes.find(e => Math.abs(e[0] - (24 - L[0])) < 0.3 && Math.abs(e[1] - L[1]) < 0.3)
    if (!R) continue
    const dx = 0.95, dy = 2.05
    t.cheeks = [[Math.round((L[0] - dx) * 100) / 100, Math.round((L[1] + dy) * 100) / 100], [Math.round((R[0] + dx) * 100) / 100, Math.round((R[1] + dy) * 100) / 100]]
    break
  }
  return t
}

export const TUNE = {
  star: { expr: 'wink' },
  sparkles: { face: false, accent: false },
  moon: { expr: 'sleepy' },
  sun: { expr: 'joy' },
  heart: { expr: 'joy' },
  'heart-pulse': { face: false },
  // the dragon trades its angry brows and eyes for kawaii's own face; antlers and whiskers stay
  'dragon-head': { hide: [3, 4, 5, 6, 7], hideCuts: [0, 1, 2, 3, 4, 5], face: { x: 12, y: 15.25, s: 1 }, expr: 'smile', color: 1, accent: false },
  smile: { face: false, accent: false, cheeks: [[6.6, 12.9], [17.4, 12.9]] },
  bot: { face: false, accent: false, cheeks: [[7.5, 16.7], [16.5, 16.7]] },
  signal: { fills: false },
  battery: { face: false },
  camera: { face: { near: [12, 7.4, 1.6], sMin: 0.6 } },
  lock: { hide: [2] },
  unlock: { hide: [2] },
  user: { face: { near: [12, 7.8, 1.6] } },
  users: { face: { near: [9, 8.2, 1.4], sMin: 0.55 } },
  'user-plus': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-check': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-minus': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-x': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-circle': { face: { x: 12, y: 9.75, s: 0.56, blush: false } },
  'calendar-days': { face: false },
  'calendar-plus': { face: false },
  'calendar-check': { face: false },
  'zoom-out': { face: false },
  'zoom-in': { face: false },
  wrench: { face: false },
  history: { face: false },
  'video-call': { face: false },
  'file-video': { face: false },
  'bell-off': { face: false },
  'shield-alert': { face: false },
  'phone-off': { face: false },
  'microphone-off': { face: false },
  'wifi-off': { face: false },
  cloud: { expr: 'calm' },
  'cloud-rain': { expr: 'sad' },
  'cloud-lightning': { expr: 'shock' },
  'cloud-snow': { expr: 'calm' },
  'alert-triangle': { face: false },
  'alert-circle': { face: false },
  'info-circle': { face: false },
  'help-circle': { face: false },
  'x-circle': { face: false },
  'plus-circle': { face: false },
  'minus-circle': { face: false },
  'check-circle': { face: false },
  'check-square': { face: false },
  ban: { face: false },
  trash: { expr: 'sad' },
  'thumbs-down': { expr: 'sad' },
  'thumbs-up': { expr: 'joy' },
  bug: { expr: 'dizzy' },
  gift: { face: false },
  coffee: { expr: 'calm' },
  rocket: { expr: 'joy' },
  bell: { expr: 'joy' },
  'bell-ring': { expr: 'shock' },
  'bell-off': { expr: 'sleepy' },
  'volume-off': { face: true, expr: 'sleepy' },
  'eye-off': { expr: 'sleepy' },
  clock: { face: false },
  'alarm-clock': { face: false },
  timer: { face: false },
  watch: { face: false },
  compass: { face: false },
  gauge: { face: false },
  target: { face: false },
  globe: { face: false },
  'chart-pie': { face: false },
  'pause': { face: false },
  'stop': { expr: 'calm' },
  // ---- final QA (all 500 icons) ---------------------------------------------
  // icons that already draw a face: never stamp a second one, blush their own
  cat: { face: false, accent: false, cheeks: [[6.3, 14.9], [17.7, 14.9]] },
  frown: { face: false, accent: false, cheeks: [[6.4, 12.6], [17.6, 12.6]] },
  meh: { face: false, accent: false, cheeks: [[6.4, 12.6], [17.6, 12.6]] },
  laugh: { face: false, accent: false, cheeks: [[6.1, 12.4], [17.9, 12.4]] },
  angry: { face: false, accent: false },
  dog: { face: false },
  rabbit: { face: false },
  'scan-face': { fills: true, face: false, accent: false, cheeks: [[7.3, 12.6], [16.7, 12.6]] },
  // a face crammed beside an inner glyph, or right above one (reads as two mouths)
  'address-book': { face: false },
  'id-card': { face: false },
  'sticky-note': { face: false },
  'folder-search': { face: false },
  'folder-minus': { face: false },
  'file-minus': { face: false },
  'message-circle-more': { face: false },
  'cloud-upload': { face: false },
  'cloud-download': { face: false },
  // placed by hand
  'piggy-bank': { hide: [5, 7], hideCuts: [1], fills: true, color: 1, face: { x: 14.25, y: 13.75, s: 0.8 } },
  hotel: { face: { x: 13.5, y: 10.4, s: 0.74 } },
  bus: { face: { x: 12, y: 9.25, s: 0.8 } },
  'user-cog': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-search': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
  'user-pen': { face: { x: 8.5, y: 7.8, s: 0.6, blush: false } },
}
