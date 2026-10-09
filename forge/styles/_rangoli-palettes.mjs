// RANGOLI festival palettes: data for the palette system (forge/PALETTES.md roles).
// One palette switches the whole set from Diwali to Durga Puja to Holi: every colour in a Rangoli icon is a
// role variable --with-rangoli-<role>, so setting the ten roles (CSS, the editor, @withicons/core palettes) re-themes
// every icon at once. The first palette is the style's default (the hex fallbacks baked into every icon).
//
// How the roles paint in Rangoli:
//   c1 -> c2   the body gradient (light top-left -> deep bottom-right): the object itself
//   accent -> c1  fire: flames and sparks (so keep accent warm: gold, saffron, yellow)
//   c3 -> c4   the second gradient: A parts (handles, lids, flames), lotus petals, petal-ring long petals
//   accent     the motif's bright pop (marigold rim, gold petals, sparkles, Holi dots)
//   tint       light panes set into the body (screens, pages, windows)
//   ink        detail drawn on a light pane (text lines, hands of a clock on a pane)
//   shadow     the thin depth lip under the body, the marigold heart
//   shine      the soft top-left highlight on the body, badge glyphs
//   edge       light inlay motifs on the body (paisley, toran leaves, alpana curls)
// Every palette reads on white and on #0B0B12: the body and motif colours are mid-tone and saturated.

export const PALETTES = [
  { id: 'diwali', name: 'Diwali night', festival: 'Diwali', tags: ['vivid', 'seasonal'],
    colors: { ink: '#2B1660', c1: '#FFB21F', c2: '#F2462C', c3: '#E81F7A', c4: '#7B2FE0',
      tint: '#FFF3D8', accent: '#FFC21A', shadow: '#5A1240', shine: '#FFFFFF', edge: '#FFE9AE' } },
  { id: 'durga-puja', name: 'Durga Puja', festival: 'Durga Puja', tags: ['true-to-life', 'seasonal'],
    colors: { ink: '#5C0A16', c1: '#F0402F', c2: '#A3101F', c3: '#E6B53A', c4: '#B7791F',
      tint: '#FFF8EF', accent: '#F4C542', shadow: '#4A0710', shine: '#FFFFFF', edge: '#FFF6E8' } },
  { id: 'holi', name: 'Holi colours', festival: 'Holi', tags: ['vivid', 'candy'],
    colors: { ink: '#2A1A5E', c1: '#FF4FA3', c2: '#8B3DFF', c3: '#22C76A', c4: '#16B8E0',
      tint: '#FFFFFF', accent: '#FFC800', shadow: '#3B1670', shine: '#FFFFFF', edge: '#FFF1F8' } },
  { id: 'navratri', name: 'Navratri garba', festival: 'Navratri', tags: ['vivid', 'seasonal'],
    colors: { ink: '#1E1B4B', c1: '#FF7A1A', c2: '#D81E6A', c3: '#14A37F', c4: '#2A4FD6',
      tint: '#FFF5E6', accent: '#FFC107', shadow: '#4C0F3A', shine: '#FFFFFF', edge: '#FFE8B8' } },
  { id: 'durga-pandal', name: 'Pandal lights', festival: 'Durga Puja', tags: ['luxe', 'seasonal'],
    colors: { ink: '#3D0A12', c1: '#E7B43C', c2: '#B5651D', c3: '#D7263D', c4: '#7C0A1E',
      tint: '#FFF6E2', accent: '#FF5A3C', shadow: '#3A1A08', shine: '#FFFFFF', edge: '#FFF2D0' } },
  { id: 'pongal', name: 'Pongal harvest', festival: 'Pongal', tags: ['earthy', 'seasonal'],
    colors: { ink: '#3B2412', c1: '#F7B731', c2: '#D2601A', c3: '#3E9E4A', c4: '#1F6F3A',
      tint: '#FFF6DC', accent: '#FFDA47', shadow: '#5A2E10', shine: '#FFFFFF', edge: '#FFF0C4' } },
  { id: 'onam', name: 'Onam kasavu', festival: 'Onam', tags: ['nature', 'seasonal'],
    colors: { ink: '#2F2410', c1: '#FFC93C', c2: '#EF7A1A', c3: '#2E9446', c4: '#C7372F',
      tint: '#FFF8E6', accent: '#F2B705', shadow: '#5B3A0C', shine: '#FFFFFF', edge: '#FFF4D6' } },
  { id: 'eid-jewels', name: 'Jewel tones', festival: 'Eid', tags: ['luxe', 'dark'],
    colors: { ink: '#0F2A3A', c1: '#1FB59A', c2: '#0B6A78', c3: '#E2B33F', c4: '#4A35A8',
      tint: '#EFFBF6', accent: '#F4CB5A', shadow: '#0A2F38', shine: '#FFFFFF', edge: '#D9F5EC' } },
  { id: 'rakhi', name: 'Rakhi thread', festival: 'Raksha Bandhan', tags: ['candy', 'seasonal'],
    colors: { ink: '#3A0F2E', c1: '#FF8A5B', c2: '#E3245F', c3: '#F5B700', c4: '#9B2FC4',
      tint: '#FFF2EC', accent: '#FFD23F', shadow: '#5E1035', shine: '#FFFFFF', edge: '#FFE3D6' } },
  { id: 'ganesh', name: 'Ganesh Chaturthi', festival: 'Ganesh Chaturthi', tags: ['vivid', 'seasonal'],
    colors: { ink: '#3A1206', c1: '#FFA21F', c2: '#E2372A', c3: '#2F9E44', c4: '#C2185B',
      tint: '#FFF4DE', accent: '#FFD000', shadow: '#5A1A08', shine: '#FFFFFF', edge: '#FFEBB5' } },
]

export const DEFAULT = PALETTES[0].colors
export const paletteById = id => PALETTES.find(p => p.id === id) || PALETTES[0]
// CSS custom properties for one palette, e.g. paletteCss('holi') -> "--with-rangoli-ink:#2A1A5E;..."
export const paletteCss = id => Object.entries(paletteById(id).colors).map(([r, h]) => `--with-rangoli-${r}:${h}`).join(';')
