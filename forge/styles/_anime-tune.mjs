// ANIME helper — palette, measures and the automatic colour casting.
//
// Every colour is a role-named variable --with-anime-<role> with a literal fallback
// (forge/lib/palette-map.mjs maps the roles to the editor's pickers):
//   ink     #2B2148  line art: a deep plum-indigo, never pure black (modern anime line colour)
//   c1      #4BA8F5  sky blue (Shinkai sky)          main colour of most props
//   c2      #FF8DB6  sakura pink                     second colour, hearts, gifts, flowers
//   c3      #FFC740  warm gold                       light, metal, stars, bells, keys, coins
//   c4      #5FCF8C  fresh leaf green                nature, success, money
//   tint    #FFF5EC  cream white                     paper, clouds, cloth, faces, panels
//   accent  #FF5D78  coral red                       alerts, flames, stop, record, badges
//   shadow  #4B2C8F  the cel-shadow tone, printed at SHADE_OP over any colour (cool violet multiply)
//   shine   #FFFFFF  specular streaks, glints, eye sparkles
//   edge    #BFE6FF  rim light on big surfaces (the bounce light on the shadow side)

export const PALETTE = {
  ink: '#2B2148', c1: '#4BA8F5', c2: '#FF8DB6', c3: '#FFC740', c4: '#5FCF8C',
  tint: '#FFF5EC', accent: '#FF5D78', shadow: '#4B2C8F', shine: '#FFFFFF', edge: '#BFE6FF',
}
// the shadow tone printed over each colour: [overlay role, opacity]. Warm colours shade towards
// coral (gold -> amber, pink -> rose), cool ones towards violet, cream towards lavender.
export const SHADE_TONE = {
  c1: ['shadow', 0.32], c2: ['shadow', 0.26], c3: ['accent', 0.42], c4: ['shadow', 0.3],
  tint: ['shadow', 0.17], accent: ['shadow', 0.3], ink: ['c1', 0.3], edge: ['shadow', 0.3], shine: ['shadow', 0.17],
}
export const ROLES = Object.keys(PALETTE)
// hex: optional per-icon fallbacks (people avatars carry their own skin / hair / clothing defaults)
export const paint = (role, hex) => `var(--with-anime-${role}, ${(hex && hex[role]) || PALETTE[role] || PALETTE.ink})`

// measures (24-grid units)
export const M = {
  OL: 0.5,            // outline beyond a surface on the lit side
  OL_SHIFT: [0.3, 0.48],   // extra outline on the shadow side (outline = dilate + shifted dilate)
  INK: 0.75,          // detail ink line width
  INK_SHIFT: [0.1, 0.15],  // detail lines thicken towards the shadow side
  TAPER: 1.4,         // length over which a free line end tapers
  TAPER_MIN: 0.35,    // tip width as a fraction of the line width
  TUBE: 1.55,         // coloured tube core (open lines outside the mass)
  TUBE_OL: 0.5,       // tube outline (each side)
  LIGHT: [-0.53, -0.85],  // direction TO the light (upper left, mostly from above)
  SHADE: 0.3,         // crescent shift as a fraction of the surface's smaller size
  SHADE_MIN: 0.7, SHADE_MAX: 4,
  SHADE_OP: 0.3,      // shadow overlay opacity
  CAST: [0.45, 0.75], // cast shadow offset of an upper surface onto the ones below
  MARGIN: 1.8,        // field reach
  DEC: 2,             // decimals in path data
  TOL: 0.035,         // simplify tolerance for traced contours
}

// ---------------------------------------------------------------------------
// automatic colour casting by meaning (name words, then category)
const WORDS = {
  c3: 'sun sunrise sunset star stars sparkles zap bolt lightning bell key coins coin trophy award crown medal lightbulb lamp wand hourglass dollar euro pound rupee lock unlock compass scale taxi bus cookie pizza burger beer egg moon gauge flashlight hand-coins sticky folder school graduation receipt',
  c2: 'heart hearts gift flower cake ice donut piggy hand-heart balloon party palette butterfly gem smile laugh music bed rabbit ticket notebook bookmark tag',
  accent: 'alert ban siren flame fire stop x-circle square-x heart-crack shield-alert thumbs-down phone-missed phone-off off apple wine cup-soda ambulance hospital briefcase-medical fuel traffic-cone pdf angry trash record minus-circle bug video-off camera-off microphone-off volume-off wifi-off cloud-off bell-off eye-off shield-off unlink youtube',
  c4: 'leaf tree sprout palm salad check checks success shield-check banknote trending-up spreadsheet turtle map mountain plant recycle battery plug sliders toggle percent bird fish',
  tint: 'file files clipboard newspaper scroll notepad library message messages chat inbox cloud mail receipt id-card address-book chef-hat snowflake tooth bandage toilet refrigerator washing-machine printer document page paper sheep book book-open',
}
const CATEGORY = {
  navigation: 'c1', arrows: 'c1', actions: 'c1', status: 'c3', media: 'c2', files: 'tint', communication: 'c1',
  users: 'c1', commerce: 'c3', time: 'c1', devices: 'c1', layout: 'c1', text: 'c1', maps: 'c4', development: 'c4',
  security: 'c3', charts: 'c1', weather: 'c1', objects: 'c3', food: 'c3', health: 'accent', education: 'c1',
  nature: 'c4', home: 'c1', travel: 'c1', sports: 'accent',
}
const LOOKUP = (() => {
  const m = new Map()
  for (const [role, s] of Object.entries(WORDS)) for (const w of s.split(/\s+/)) if (w && !m.has(w)) m.set(w, role)
  return m
})()
// the second colour that sits beside each main colour (A parts, panels on matching fields)
export const SECOND = { c1: 'c3', c2: 'c1', c3: 'c1', c4: 'c3', tint: 'c1', accent: 'c3', ink: 'c1' }

// screens, lenses and windows of devices print as glossy ink glass
const GLASS_CATS = new Set(['devices', 'media'])

// Per-icon overrides of the automatic casting (only for icons that are left automatic).
// { main, second, panel, tube, badge, deco: false, shine: false }
export const TUNE = {
  'cloud': { main: 'tint', second: 'c1' },
  'cloud-sun': { main: 'tint', second: 'c3' },
  'sun-moon': { main: 'c3', second: 'c1' },
  'droplet': { main: 'c1' }, 'umbrella': { main: 'c2', second: 'c1' }, 'snowflake': { main: 'c1' },
  'thermometer': { main: 'tint', second: 'accent' }, 'rainbow': { main: 'c2', second: 'c1' }, 'wind': { main: 'c1' },
  'search': { main: 'c1', panel: 'tint' }, 'zoom-in': { main: 'c1', panel: 'tint' }, 'zoom-out': { main: 'c1', panel: 'tint' },
  'eye': { main: 'tint', second: 'c1' }, 'moon': { main: 'c3' },
}

export function cast(icon) {
  const name = String(icon?.name || '')
  const tune = TUNE[name] || {}
  const words = name.split('-')
  let main = tune.main
  if (!main) {
    // the whole name first (e.g. "x-circle"), then each word from the end ("calendar-check" -> check)
    main = LOOKUP.get(name)
    if (!main) for (let i = words.length - 1; i >= 0 && !main; i--) {
      main = LOOKUP.get(words[i]) || (i > 0 ? LOOKUP.get(words[i - 1] + '-' + words[i]) : null)
    }
    // the modifier word picks the badge, the object word picks the body: "calendar-check" stays a calendar
    if (main && words.length > 1 && ['check', 'checks', 'plus', 'minus', 'x', 'off'].includes(words.at(-1))) {
      const head = words.slice(0, -1).join('-')
      const h = LOOKUP.get(head) || LOOKUP.get(words[0])
      if (h) main = h
      else if (main === 'c4' || main === 'accent') main = CATEGORY[icon?.category] || 'c1'
    }
    if (!main) main = CATEGORY[icon?.category] || 'c1'
  }
  const second = tune.second || SECOND[main] || 'c3'
  const last = words.at(-1)
  const badge = tune.badge || (['check', 'checks', 'plus'].includes(last) ? 'c4'
    : ['x', 'minus', 'off', 'alert', 'ban'].includes(last) ? 'accent'
    : main === 'accent' ? 'c1' : 'accent')
  const glass = GLASS_CATS.has(icon?.category)
  const panel = tune.panel || (glass ? 'ink' : main === 'tint' ? 'c1' : 'tint')
  return { main, second, badge, panel, tube: tune.tube || main, glass, tune }
}
