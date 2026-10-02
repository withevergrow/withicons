// Live icon: a speaker with 0-3 sound waves, optional dotted ghosts for the silent ones, or muted.
import { SPK, dotsOnArc, cross } from './_parts-power.mjs'
import { arc } from './_layout.mjs'
import { live } from './_font.mjs'

export default live({
  name: 'volume-level', title: 'Volume level', category: 'media',
  description: 'A speaker with as many sound waves as you choose, from silent to loud, or muted.',
  aliases: ['volume-waves', 'sound-level', 'speaker-level', 'audio-level', 'volume-meter', 'live-volume'],
  tags: ['volume', 'audio', 'sound', 'speaker', 'level', 'live'],
  synonyms: ['loud', 'quiet', 'mute', 'muted', 'unmute', 'sound on', 'sound off', 'turn up', 'turn down',
    'volume control', 'loudness', 'audio output', 'speaker volume'],
  params: {
    waves: { type: 'int', min: 0, max: 3, default: 2, label: 'Sound waves' },
    ghost: { type: 'bool', default: false, label: 'Show silent waves as dots' },
    muted: { type: 'bool', default: false, label: 'Muted (cross instead of waves)' },
  },
  examples: [{ waves: 3 }, { waves: 2 }, { waves: 1, ghost: true }, { waves: 0 }, { waves: 2, muted: true }],
  build({ waves, ghost, muted }) {
    const paths = [{ d: SPK.d, plate: 'K' }]
    if (muted) for (const d of cross(16.5, 12, 2.5)) paths.push({ d, plate: 'S' })
    else SPK.waves.forEach((w, i) => {
      if (i < waves) paths.push({ d: arc(SPK.cx, SPK.cy, w.r, 90 - w.a, 90 + w.a), plate: 'A' })
      else if (ghost) for (const d of dotsOnArc(SPK.cx, SPK.cy, w.r, 90 - w.a, 90 + w.a, 5.5)) paths.push({ d, plate: 'A' })
    })
    return { paths, fills: [SPK.d], cutouts: [] }
  },
})
