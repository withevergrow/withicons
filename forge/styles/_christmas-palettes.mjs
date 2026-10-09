// CHRISTMAS palettes: data only. Roles (forge/PALETTES.md):
//   ink     outline                       c1  the main body (cranberry)     c2  pine (evergreens, holly leaves, badges)
//   c3      gold (metal, light, A parts)  c4  candy cream (candy stripes' ground, white objects)
//   tint    the snow's cool shade         accent  sparkle gold              shadow  deep shade in the body
//   shine   snow white / highlights       edge    the warm glow
// The first palette is the style's default (the hex fallbacks in every var()).
export const PALETTES = [
  { id: 'classic', name: 'Classic Christmas', tags: ['true-to-life', 'seasonal'],
    colors: { ink: '#3A0F17', c1: '#C8203A', c2: '#1F6E46', c3: '#E2A93B', c4: '#FFF5E6',
      tint: '#C9DAEC', accent: '#F4C24D', shadow: '#4A0716', shine: '#FFFFFF', edge: '#FFB347' } },
  { id: 'nordic', name: 'Nordic wood', tags: ['earthy', 'seasonal'],
    colors: { ink: '#2E2620', c1: '#B5523B', c2: '#50705A', c3: '#C79A5E', c4: '#F4EDE2',
      tint: '#D5DDE3', accent: '#E3BE7A', shadow: '#3B2A1F', shine: '#FFFFFF', edge: '#F2C98A' } },
  { id: 'midnight', name: 'Midnight silver', tags: ['dark', 'luxe'],
    colors: { ink: '#0E1838', c1: '#2A3F8F', c2: '#3A6E8F', c3: '#C3CCDA', c4: '#EEF2FA',
      tint: '#B9C8E6', accent: '#E8EEF8', shadow: '#0A1030', shine: '#FFFFFF', edge: '#9DB7FF' } },
  { id: 'candy', name: 'Candy pink', tags: ['candy', 'pastel'],
    colors: { ink: '#5A1838', c1: '#F0628F', c2: '#3FB59A', c3: '#F7C35F', c4: '#FFF2F6',
      tint: '#F5D3E2', accent: '#FFD36E', shadow: '#7A1A44', shine: '#FFFFFF', edge: '#FFA9C6' } },
  { id: 'gold-luxe', name: 'Gold luxe', tags: ['luxe', 'dark'],
    colors: { ink: '#1E1408', c1: '#B8862B', c2: '#2F4A3A', c3: '#E9C46A', c4: '#FBF1DA',
      tint: '#E8DCC2', accent: '#FFE08A', shadow: '#2A1A06', shine: '#FFFDF5', edge: '#FFCF6B' } },
  { id: 'evergreen', name: 'Evergreen', tags: ['nature', 'seasonal'],
    colors: { ink: '#10291D', c1: '#1F6E46', c2: '#2E8B57', c3: '#D9A441', c4: '#F6F1E4',
      tint: '#C8DDD3', accent: '#F0C55A', shadow: '#0B2016', shine: '#FFFFFF', edge: '#FFC56B' } },
  { id: 'frost', name: 'Winter frost', tags: ['pastel', 'seasonal'],
    colors: { ink: '#22355A', c1: '#6FA8DC', c2: '#7BC4C4', c3: '#C9D6EA', c4: '#FFFFFF',
      tint: '#CFE2F6', accent: '#BFE3FF', shadow: '#1F3A66', shine: '#FFFFFF', edge: '#A9D4FF' } },
  { id: 'mulled-wine', name: 'Mulled wine', tags: ['vintage', 'luxe'],
    colors: { ink: '#2B0A14', c1: '#7E1F3A', c2: '#3F5E3A', c3: '#D49A4A', c4: '#F7E9DA',
      tint: '#D9CBD6', accent: '#F2B85C', shadow: '#2A0610', shine: '#FFFAF4', edge: '#F59E4C' } },
  { id: 'gingerbread', name: 'Gingerbread', tags: ['earthy', 'retro'],
    colors: { ink: '#3A1E0E', c1: '#B8692E', c2: '#4F7A3A', c3: '#E3B04B', c4: '#FFF6EA',
      tint: '#E2D6C8', accent: '#F2C96B', shadow: '#4A240C', shine: '#FFFFFF', edge: '#FFB866' } },
  { id: 'retro-tinsel', name: 'Retro tinsel', tags: ['retro', 'vivid'],
    colors: { ink: '#202040', c1: '#E2453C', c2: '#1E9E8E', c3: '#F2B134', c4: '#FFF4E0',
      tint: '#CDE3E8', accent: '#FF9FC2', shadow: '#3A1530', shine: '#FFFFFF', edge: '#FFC24D' } },
]
export const DEFAULT = PALETTES[0].colors
