// UTSAV festival palettes: data for the palette system (forge/PALETTES.md roles). Every colour in an Utsav icon is a
// role variable --with-utsav-<role>, so one palette re-themes the whole set. The first palette is the style's default
// (the hex fallbacks baked into every icon, _utsav-core.mjs `C`).
//
// How the roles paint in Utsav:
//   c1 -> c2   the body gradient (the K mass), c2 alone on live icons
//   c3         A parts (lids, flames, handles) and the rangoli rosette's petals, the marigold's heart
//   c4         S parts (badges, modifiers)
//   accent     gold: badge rosette petals, the marigold's petals
//   edge       the fine inner double line, the saree-border arches, the rosette's bindu
//   shine      the cream bindu dot-work under the arches
//   ink        the outline
//   tint, shadow  not painted (kept for the editor)
// Every palette reads on white and on #0B0B12 (the ink outline carries the edge on dark).

export const PALETTES = [
  { id: 'diwali', name: 'Diwali marigold', festival: 'Diwali', tags: ['vivid', 'seasonal'],
    colors: { ink: '#3B0A45', c1: '#F59E0B', c2: '#F97316', c3: '#E11D74', c4: '#0F766E',
      tint: '#FFF4DC', accent: '#D4A017', shadow: '#3B0A45', shine: '#FFF4DC', edge: '#F4C95D' } },
  { id: 'durga-puja', name: 'Durga Puja', festival: 'Durga Puja', tags: ['true-to-life', 'seasonal'],
    colors: { ink: '#4A0A10', c1: '#E23B2E', c2: '#A8141F', c3: '#F7EFE0', c4: '#C9961F',
      tint: '#FFF6EC', accent: '#F2C14E', shadow: '#3A070C', shine: '#FFFFFF', edge: '#FFF1DA' } },
  { id: 'holi', name: 'Holi gulal', festival: 'Holi', tags: ['vivid', 'candy'],
    colors: { ink: '#2A1A5E', c1: '#FF4FA3', c2: '#8B3DFF', c3: '#22C76A', c4: '#16B8E0',
      tint: '#FFF1F8', accent: '#FFC800', shadow: '#2A1A5E', shine: '#FFFFFF', edge: '#FFE3F1' } },
  { id: 'navratri', name: 'Navratri garba', festival: 'Navratri', tags: ['vivid', 'seasonal'],
    colors: { ink: '#1E1B4B', c1: '#FF7A1A', c2: '#D81E6A', c3: '#14A37F', c4: '#2A4FD6',
      tint: '#FFF5E6', accent: '#FFC107', shadow: '#1E1B4B', shine: '#FFF5E6', edge: '#FFE8B8' } },
  { id: 'pongal', name: 'Pongal harvest', festival: 'Pongal', tags: ['earthy', 'seasonal'],
    colors: { ink: '#3B2412', c1: '#F7B731', c2: '#D2601A', c3: '#3E9E4A', c4: '#1F6F3A',
      tint: '#FFF6DC', accent: '#FFDA47', shadow: '#3B2412', shine: '#FFF6DC', edge: '#FFF0C4' } },
  { id: 'onam', name: 'Onam kasavu', festival: 'Onam', tags: ['nature', 'seasonal'],
    colors: { ink: '#2F2410', c1: '#FFC93C', c2: '#EF7A1A', c3: '#2E9446', c4: '#C7372F',
      tint: '#FFF8E6', accent: '#F2B705', shadow: '#2F2410', shine: '#FFF8E6', edge: '#FFF4D6' } },
  { id: 'temple-gold', name: 'Temple gold', festival: 'Diwali', tags: ['luxe', 'dark'],
    colors: { ink: '#2A1406', c1: '#E8B84A', c2: '#A86A12', c3: '#8E1B2C', c4: '#1F5F5B',
      tint: '#FFF3D6', accent: '#F6D06B', shadow: '#2A1406', shine: '#FFF3D6', edge: '#FFE6A3' } },
]
