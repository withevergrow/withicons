// The mirror of download: an arrow rises out of the tray while the tray sinks to load the spring; the tray kicks,
// the arrow launches upward, slows like a thrown thing and fades away, and a fresh arrow starts to rise.
import { line, poly, stroke, merge, E } from './_kit.mjs'

const NAME = 'wl-upload'   // not 'upload': hand-drawn upload sprites ignore the geometry
const TRAY = 'M4 13.5 V16.75 A3.25 3.25 0 0 0 7.25 20 H16.75 A3.25 3.25 0 0 0 20 16.75 V13.5'
const TRAY_FILL = 'M4 13.5 H20 V16.75 A3.25 3.25 0 0 1 16.75 20 H7.25 A3.25 3.25 0 0 1 4 16.75 Z'
const KICK = 0.3   // the tray releases and the arrow launches
export default {
  name: 'upload', title: 'Upload', group: 'common',
  description: 'An arrow rises out of a tray; the tray dips, kicks, and the arrow launches upward, slowing as it fades away.',
  intent: 'your file is going up',
  aliases: ['upload-loader', 'upload-progress-arrow', 'arrow-out-of-tray', 'uploading-arrow'],
  tags: ['loading', 'upload', 'arrow', 'transfer'], synonyms: ['loading', 'upload', 'sending', 'publishing', 'sharing'],
  duration: 1.7,
  parts: [
    // the arrow is drawn first, so it rises out from behind the tray's front
    {
      name: NAME,
      skel: merge(stroke(line(12, 12.5, 12, 7), 'A'), stroke(poly([[8.75, 10.25], [12, 7], [15.25, 10.25]], false), 'A')),
      motion: {
        origin: [12, 7],
        keys: [
          [0, { y: 6, s: 0.75, o: 0, e: E.out }],               // surfaces inside the tray
          [KICK - 0.04, { y: 4, s: 1, o: 1, e: E.in }],          // eases up as the tray loads
          [KICK, { y: 3.25, sx: 0.88, sy: 1.14, e: E.lift }],   // launch: stretched by the kick
          [KICK + 0.3, { y: -3.25, sx: 1, sy: 1, e: E.in }],   // rises, slowing like a thrown thing
          [KICK + 0.44, { y: -4, s: 0.85, o: 0 }],               // and fades away at the top
          [1, { y: 6, s: 0.75, o: 0 }],
        ],
      },
    },
    {
      name: NAME,
      skel: { paths: [{ d: TRAY, plate: 'K' }], fills: [TRAY_FILL], cutouts: [] },
      motion: {
        origin: [12, 20],
        keys: [
          [0, { sx: 1, sy: 1, e: E.ease }],
          [KICK - 0.02, { sx: 1.06, sy: 0.82, e: E.spring }],     // dips under the load
          [KICK + 0.2, { sx: 1, sy: 1 }],                         // springs back as the arrow leaves
          [1, { sx: 1, sy: 1 }],
        ],
      },
    },
  ],
}
