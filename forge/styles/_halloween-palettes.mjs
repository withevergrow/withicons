// HALLOWEEN colour: the default palette (the role fallbacks) and the style's festival palettes (data only).
// Roles (forge/PALETTES.md) and what they paint in this style:
//   ink     midnight outline round every shape
//   c1 c2   the body: a candle-lit gradient from c1 (lit centre) to c2 (deep edge)
//   c3      parts (plate A): witchy purple
//   c4      signals (plate S: badges, slashes, modifiers): slime green
//   tint    the candle light glowing through carved details (centre)
//   accent  the candle light's warm edge, the halo behind the icon and the moon
//   shadow  the soft drop under the object
//   shine   the highlight on the lit shoulder
//   edge    the little creatures in the free space (bat, spider)

export const BASE = {
  ink: '#1D1029', c1: '#FF9F2E', c2: '#E5530F', c3: '#8B55E0', c4: '#86D13A',
  tint: '#FFF1B8', accent: '#FFB52E', shadow: '#2A1642', shine: '#FFF6E2', edge: '#7344C9',
}

export const PALETTES = [
  { id: 'jack-o-lantern', name: "Jack-o'-lantern", tags: ['true-to-life', 'seasonal'], colors: BASE },
  { id: 'witching-hour', name: 'Witching hour', tags: ['seasonal', 'dark'], colors: {
    ink: '#170B26', c1: '#A57AF5', c2: '#5B2BB5', c3: '#FF8A1F', c4: '#9BE34A',
    tint: '#FFEDB0', accent: '#FFC845', shadow: '#1B0F33', shine: '#F3EAFF', edge: '#E8681A' } },
  { id: 'slime-time', name: 'Slime time', tags: ['vivid', 'seasonal'], colors: {
    ink: '#1A1326', c1: '#AEEA4E', c2: '#4C9F1C', c3: '#8B55E0', c4: '#FF8A1F',
    tint: '#F6FFC8', accent: '#D6F55A', shadow: '#1F3311', shine: '#F7FFE4', edge: '#7344C9' } },
  { id: 'candy-corn', name: 'Candy corn pastel', tags: ['pastel', 'candy'], colors: {
    ink: '#4A2E5C', c1: '#FFC08A', c2: '#FF8F6B', c3: '#C3A2FF', c4: '#9FE3B6',
    tint: '#FFF6CF', accent: '#FFD98A', shadow: '#7A5C9E', shine: '#FFFFFF', edge: '#A784EE' } },
  { id: 'ghost-story', name: 'Ghost story', tags: ['pastel', 'seasonal'], colors: {
    ink: '#1E2342', c1: '#E6F5FF', c2: '#A2C9EE', c3: '#8E7CF0', c4: '#93EBC4',
    tint: '#FFFFFF', accent: '#BFE9FF', shadow: '#2C3360', shine: '#FFFFFF', edge: '#6B66D6' } },
  { id: 'graveyard', name: 'Graveyard mono', tags: ['mono', 'grayscale'], colors: {
    ink: '#121016', c1: '#E9E7EF', c2: '#A3A0B3', c3: '#6E6A80', c4: '#C7C4D4',
    tint: '#FFFFFF', accent: '#D8D5E5', shadow: '#2A2733', shine: '#FFFFFF', edge: '#55516A' } },
  { id: 'vampire', name: 'Vampire velvet', tags: ['luxe', 'dark'], colors: {
    ink: '#1A0A12', c1: '#EC4B57', c2: '#99172D', c3: '#7446B8', c4: '#F2C14E',
    tint: '#FFE0C8', accent: '#FF7B5A', shadow: '#3A0C18', shine: '#FFE9E9', edge: '#7446B8' } },
  { id: 'neon-night', name: 'Neon night', tags: ['neon', 'on-dark'], colors: {
    ink: '#0E0718', c1: '#FF8A1F', c2: '#FF3D7F', c3: '#B455FF', c4: '#39FF88',
    tint: '#FFF47A', accent: '#FFB800', shadow: '#2A0B3D', shine: '#FFFFFF', edge: '#B455FF' } },
  { id: 'witch-brew', name: "Witch's brew", tags: ['earthy', 'vintage'], colors: {
    ink: '#2B1B14', c1: '#E7A33E', c2: '#AE5E1C', c3: '#5E3A7A', c4: '#7FA650',
    tint: '#FBE6B4', accent: '#F4C35A', shadow: '#3D2618', shine: '#FFF3DC', edge: '#5E3A7A' } },
]

// role -> paint, with the default as the literal fallback
export const C = Object.fromEntries(Object.keys(BASE).map(r => [r, `var(--with-halloween-${r}, ${BASE[r]})`]))
