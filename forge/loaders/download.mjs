// An arrow drops into an open tray: it appears at the top, falls with gravity, lands, and the tray takes the
// weight with a squash and a springy nod while the arrow sinks in and fades. Then the next one comes.
import { line, poly, stroke, merge, E } from './_kit.mjs'

const NAME = 'wl-download'   // not 'download': hand-drawn download sprites ignore the geometry
const TRAY = 'M4 13.5 V16.75 A3.25 3.25 0 0 0 7.25 20 H16.75 A3.25 3.25 0 0 0 20 16.75 V13.5'
const TRAY_FILL = 'M4 13.5 H20 V16.75 A3.25 3.25 0 0 1 16.75 20 H7.25 A3.25 3.25 0 0 1 4 16.75 Z'
const LAND = 0.4, APPEAR = 0.84   // the moment the arrow hits the tray; the next one starts to appear
export default {
  name: 'download', title: 'Download', group: 'common',
  description: 'An arrow falls into an open tray with gravity; the tray squashes and nods as it lands, and the arrow sinks in.',
  intent: 'something is coming down to you',
  aliases: ['download-loader', 'download-progress-arrow', 'arrow-into-tray', 'downloading-arrow'],
  tags: ['loading', 'download', 'arrow', 'transfer'], synonyms: ['loading', 'download', 'saving', 'receiving', 'fetching'],
  duration: 1.7,
  parts: [
    // the arrow is drawn first, so the tray's front covers it as it sinks in
    {
      name: NAME,
      skel: merge(stroke(line(12, 4, 12, 10.5), 'A'), stroke(poly([[8.75, 7.25], [12, 10.5], [15.25, 7.25]], false), 'A')),
      motion: {
        origin: [12, 10.5],
        keys: [
          [0, { y: -1, s: 1, o: 1, e: E.gravity }],              // hangs a moment, then falls faster and faster
          [LAND, { y: 6, sx: 1, sy: 1, e: E.out }],               // impact
          [LAND + 0.06, { y: 6.6, sx: 1.14, sy: 0.8, e: E.in }],
          [LAND + 0.2, { y: 7.5, sx: 0.8, sy: 0.8, o: 0 }],       // sinks in and fades
          [APPEAR, { y: -1.75, s: 0.7, o: 0, e: E.out }],          // the next arrow materialises at the top
          [1, { y: -1, s: 1, o: 1 }],
        ],
      },
    },
    {
      name: NAME,
      skel: { paths: [{ d: TRAY, plate: 'K' }], fills: [TRAY_FILL], cutouts: [] },
      motion: {
        origin: [12, 20],
        keys: [
          [0, { sx: 1, sy: 1 }],
          [LAND, { sx: 1, sy: 1, e: E.out }],
          [LAND + 0.07, { sx: 1.07, sy: 0.8, e: E.spring }],     // takes the weight
          [LAND + 0.3, { sx: 1, sy: 1 }],                       // springs back with a little nod
          [1, { sx: 1, sy: 1 }],
        ],
      },
    },
  ],
}
