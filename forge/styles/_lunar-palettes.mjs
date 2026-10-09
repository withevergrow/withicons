// LUNAR palettes: festival colour sets for the Lunar New Year style, as data.
// Every palette sets all ten roles (forge/PALETTES.md); the renderer maps them to --with-lunar-<role>:
//   ink     deep lacquer: fine detail lines, the tassel cord, blossom outlines
//   c1      the body's lit top (lucky red by default)
//   c2      the body's deep foot (the gradient's second stop)
//   c3      jade: badges, modifiers and signals (plate S), the tassel bead
//   c4      blossom petals (peach)
//   tint    paper: light cutout panes and the tassel's knot
//   accent  gold: rims, gold parts (plate A), the paper-cut inner line, the cloud medallion
//   shadow  deep shade (the lower foil band's end, petal outlines on dark grounds)
//   shine   foil highlight
//   edge    deep gold, the foil's dark band
// The first palette is the default (its colours are the renderer's hex fallbacks).
export const PALETTES = [
  { id: 'classic', name: 'Lucky red & gold', tags: ['true-to-life', 'vivid'],
    colors: { ink: '#4A0A10', c1: '#E8282E', c2: '#B0101E', c3: '#11896A', c4: '#F79A8A', tint: '#FFF1D6',
              accent: '#E8B030', shadow: '#6E0A14', shine: '#FFEBA6', edge: '#A8700F' } },
  { id: 'jade-gold', name: 'Jade & gold', tags: ['luxe', 'nature'],
    colors: { ink: '#06322A', c1: '#1FA37C', c2: '#0B6B53', c3: '#D9282F', c4: '#F7B0A0', tint: '#EAFBF2',
              accent: '#E5B23A', shadow: '#053B2F', shine: '#FFF0B3', edge: '#A0700F' } },
  { id: 'ink-wash', name: 'Ink wash & cinnabar', tags: ['dark', 'luxe'],
    colors: { ink: '#0E0E10', c1: '#3A3A40', c2: '#141418', c3: '#D3262C', c4: '#E84B4B', tint: '#F4EFE6',
              accent: '#D8342F', shadow: '#000000', shine: '#FF8A7A', edge: '#8E1418' } },
  { id: 'peach-blossom', name: 'Peach blossom', tags: ['pastel', 'seasonal'],
    colors: { ink: '#6B1F35', c1: '#F7829A', c2: '#D94C6E', c3: '#5DB88F', c4: '#FFD3DC', tint: '#FFF4F6',
              accent: '#E9B14A', shadow: '#8E2546', shine: '#FFF0C4', edge: '#B57C22' } },
  { id: 'imperial', name: 'Imperial yellow', tags: ['luxe', 'vivid'],
    colors: { ink: '#4A1A06', c1: '#FFC629', c2: '#E68A00', c3: '#C8102E', c4: '#E8323A', tint: '#FFF8DC',
              accent: '#C8102E', shadow: '#7A2E05', shine: '#E8323A', edge: '#8E0A1E' } },
  { id: 'modern-red', name: 'Modern minimal red', tags: ['corporate', 'accessible'],
    colors: { ink: '#2B0A0C', c1: '#E3262D', c2: '#E3262D', c3: '#E3262D', c4: '#FFB4A8', tint: '#FFFFFF',
              accent: '#FFFFFF', shadow: '#9C0F17', shine: '#FFFFFF', edge: '#F2D9D9' } },
  { id: 'midnight-gold', name: 'Midnight lacquer', tags: ['dark', 'luxe', 'on-dark'],
    colors: { ink: '#05070F', c1: '#1E2A55', c2: '#0B1230', c3: '#D9282F', c4: '#F79A8A', tint: '#E9EEFF',
              accent: '#E8B030', shadow: '#03060F', shine: '#FFEBA6', edge: '#A8700F' } },
  { id: 'mandarin', name: 'Mandarin orange', tags: ['vivid', 'nature'],
    colors: { ink: '#4A1D04', c1: '#FF9A1F', c2: '#E8590C', c3: '#1F8A4C', c4: '#FFD08A', tint: '#FFF4E0',
              accent: '#E8B030', shadow: '#7A2E05', shine: '#FFF0B3', edge: '#A8700F' } },
  { id: 'porcelain', name: 'Blue & white porcelain', tags: ['vintage', 'mono'],
    colors: { ink: '#0D2A66', c1: '#2F5DB8', c2: '#163B8C', c3: '#C8302E', c4: '#DCE6FA', tint: '#F4F7FF',
              accent: '#F4F7FF', shadow: '#0A1F4D', shine: '#FFFFFF', edge: '#9DB4E3' } },
]

export const DEFAULT = PALETTES[0].colors
