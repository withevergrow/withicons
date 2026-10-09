// VALENTINE festival palettes (data only). Roles follow forge/PALETTES.md; what each role paints in Valentine:
//   ink     the warm cartoon outline, faces, and the outlines of the floating hearts (never black)
//   c1      pink: the hero body (top of the body gradient)     c2  red: the gradient's deep end, hearts, bows, headers
//   c3      chocolate: food, teddy, cardboard, parts            c4  cream: paper, mugs, clouds, the die-cut rim
//   tint    gold: champagne, stars, bells, rings, sprinkles     accent  green: leaves and stems
//   shadow  the gentle shade along the bottom edge              shine   white: highlights, polka dots, marshmallows
//   edge    the blush on the cheeks
// The first palette is the style's default (the fallbacks written into every icon).
export const PALETTES = [
  { id: 'classic-love', name: 'Classic love', tags: ['true-to-life', 'vivid', 'seasonal'],
    colors: { ink: '#6A1B3A', c1: '#FF6B8E', c2: '#E8304F', c3: '#8B4A36', c4: '#FFF3E3',
      tint: '#F5C451', accent: '#5DB86A', shadow: '#A3163F', shine: '#FFFFFF', edge: '#FF8FB0' } },
  { id: 'blush-pastel', name: 'Blush pastel', tags: ['pastel', 'candy'],
    colors: { ink: '#8A3A5C', c1: '#FFB8CC', c2: '#F98BA9', c3: '#B9806C', c4: '#FFF8EF',
      tint: '#F8DB8C', accent: '#9FD6A2', shadow: '#D45F88', shine: '#FFFFFF', edge: '#FF9DBA' } },
  { id: 'chocolate-cream', name: 'Chocolate & cream', tags: ['earthy', 'true-to-life'],
    colors: { ink: '#4A2418', c1: '#E9819B', c2: '#C7415F', c3: '#7A4330', c4: '#FFF0D9',
      tint: '#E2B266', accent: '#7FA35B', shadow: '#55291C', shine: '#FFF8EE', edge: '#F7899F' } },
  { id: 'lavender-love', name: 'Lavender love', tags: ['pastel', 'candy'],
    colors: { ink: '#4E2A6B', c1: '#C9A9F7', c2: '#9C72E3', c3: '#8E5B7A', c4: '#FAF4FF',
      tint: '#F4CF7A', accent: '#86CFA8', shadow: '#6E4AB0', shine: '#FFFFFF', edge: '#FF9CC2' } },
  { id: 'galentines-peach', name: "Galentine's peach", tags: ['pastel', 'sunset'],
    colors: { ink: '#7A2E2E', c1: '#FFB08A', c2: '#FF6F7F', c3: '#9A5A3C', c4: '#FFF5E8',
      tint: '#FFD66B', accent: '#8CC97A', shadow: '#C9503E', shine: '#FFFFFF', edge: '#FF8FA0' } },
  { id: 'dark-romance', name: 'Dark romance', tags: ['dark', 'luxe'],
    colors: { ink: '#2A0A16', c1: '#C2184A', c2: '#7A0A2B', c3: '#4A2219', c4: '#F4D9C6',
      tint: '#D9A84E', accent: '#3E7A4A', shadow: '#3A0414', shine: '#FFD7DF', edge: '#E8607E' } },
  { id: 'candy-hearts', name: 'Candy hearts', tags: ['candy', 'vivid'],
    colors: { ink: '#5C2346', c1: '#FF8FC0', c2: '#F2569A', c3: '#A98BFF', c4: '#FFF7D6',
      tint: '#FFE45C', accent: '#6FD6B8', shadow: '#B83C78', shine: '#FFFFFF', edge: '#FF6FA0' } },
  { id: 'strawberry-milk', name: 'Strawberry milk', tags: ['pastel', 'true-to-life'],
    colors: { ink: '#7B2F45', c1: '#FFC2D4', c2: '#F2557A', c3: '#A8674E', c4: '#FFFDF5',
      tint: '#F7D27A', accent: '#7CC48A', shadow: '#D86A8C', shine: '#FFFFFF', edge: '#FF7FA2' } },
  { id: 'red-roses', name: 'Red roses', tags: ['true-to-life', 'nature'],
    colors: { ink: '#4A1020', c1: '#F0405A', c2: '#B5122E', c3: '#6B3A2A', c4: '#FFF0E8',
      tint: '#E8B84A', accent: '#3F8F4E', shadow: '#7E0C22', shine: '#FFE3E8', edge: '#FF7A93' } },
]

export const DEFAULT = PALETTES[0].colors
