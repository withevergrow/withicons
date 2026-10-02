// PIXEL per-icon tuning. Never edits skeletons; only how Pixel draws an icon.
//
//   map:   16 rows of 16 chars, a hand-drawn sprite that replaces the rasterised one
//          X  silhouette (outline where it meets paper, body tone inside)
//          #  ink        +  tone        o  shine        =  shade        .  paper
//          Shine and shade are computed automatically unless the map uses o or =.
//   dots:  1 or 2, force the pixel size of tiny circles (default: 2x2 from r 0.85u)
//   shift: [dx, dy] in user units added before rasterising (move a drawing half a pixel)
//   ink / del / tone / clear: "i,j i,j ..." cell edits applied after rasterising
//   notone: true draws the line art only (no body tone)
//
// The grid's cell 7 is the icon centre (12,12); full-bleed drawings use cells 0-14.
export const TUNE = {
  // magnifiers: a two-pixel handle reads as a handle, not a hairline
  search: { ink: '12,11 13,12 14,13' },
  'zoom-in': { ink: '12,11 13,12 14,13' },
  'zoom-out': { ink: '12,11 13,12 14,13' },
  wifi: { dots: 1 },
  // body tone that only half fills an open bracket or a ring reads as a smudge
  'log-in': { notone: true },
  'log-out': { notone: true },
  target: { notone: true },
  // three evenly spaced title-bar dots
  'app-window': { tone: '8,4', ink: '9,4' },
  'wifi-off': { dots: 1 },
  settings: {
    map: [
      '......###......',
      '..##..###..##..',
      '..###XXXXX###..',
      '...XXXXXXXXX...',
      '..XXXXXXXXXXX..',
      '..XXXX...XXXX..',
      '##XXX.....XXX##',
      '##XXX.....XXX##',
      '##XXX.....XXX##',
      '..XXXX...XXXX..',
      '..XXXXXXXXXXX..',
      '...XXXXXXXXX...',
      '..###XXXXX###..',
      '..##..###..##..',
      '......###......',
    ],
  },
  cloud: {
    map: [
      '',
      '',
      '',
      '.....XXXX......',
      '....XXXXXX.....',
      '....XXXXXXXX...',
      '..XXXXXXXXXXX..',
      '.XXXXXXXXXXXXX.',
      'XXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXX',
      '.XXXXXXXXXXXXX.',
    ],
  },
  'badge-check': {
    map: [
      '.......X........',
      '......XXX.......',
      '..XXXXXXXXXXX...',
      '..XXXXXXXXXXX...',
      '..XXXXXXXXXXX...',
      '..XXXXXXXX#XX...',
      '.XXXXXXXX#XXXX..',
      'XXXX#XXX#XXXXXX.',
      '.XXXX#X#XXXXXX..',
      '..XXXX#XXXXXX...',
      '..XXXXXXXXXXX...',
      '..XXXXXXXXXXX...',
      '..XXXXXXXXXXX...',
      '......XXX.......',
      '.......X........',
    ],
  },
  bluetooth: {
    map: [
      '',
      '.......#.......',
      '.......##......',
      '.......#.#.....',
      '....#..#..#....',
      '.....#.#.#.....',
      '......###......',
      '.......#.......',
      '......###......',
      '.....#.#.#.....',
      '....#..#..#....',
      '.......#.#.....',
      '.......##......',
      '.......#.......',
    ],
  },
  'qr-code': {
    map: [
      '',
      '.#####...#####.',
      '.#...#...#...#.',
      '.#.#.#...#.#.#.',
      '.#...#...#...#.',
      '.#####...#####.',
      '',
      '',
      '',
      '.#####...##.##.',
      '.#...#...##.##.',
      '.#.#.#.........',
      '.#...#...##.##.',
      '.#####...##.##.',
    ],
  },
  'battery-charging': {
    map: [
      '',
      '',
      '',
      '.........#.....',
      '#####...##.###.',
      '#......##....#.',
      '#.....##.....##',
      '#....######..##',
      '#.......##...##',
      '#......##....#.',
      '####..##..####.',
      '......#........',
    ],
  },
  car: {
    map: [
      '',
      '',
      '',
      '....#######....',
      '...#....#..#...',
      '..#.....#...#..',
      '.XXXXXXXXXXXXX.',
      'XXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXX',
      '..####...####..',
      '...##.....##...',
    ],
  },
  bell: {
    map: [
      '',
      '......XXX......',
      '....XXXXXXX....',
      '...XXXXXXXXX...',
      '...XXXXXXXXX...',
      '...XXXXXXXXX...',
      '...XXXXXXXXX...',
      '..XXXXXXXXXXX..',
      '..XXXXXXXXXXX..',
      '.XXXXXXXXXXXXX.',
      'XXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXX',
      '',
      '......###......',
    ],
  },
  zap: {
    map: [
      '',
      '........XXXXX..',
      '.......XXXXX...',
      '......XXXXX....',
      '.....XXXXX.....',
      '....XXXXXXXXX..',
      '...XXXXXXXXX...',
      '......XXXXX....',
      '.....XXXXX.....',
      '....XXXXX......',
      '...XXXX........',
      '...XX..........',
      '...............',
    ],
  },
}

// hand-drawn sprites (see _pixel-maps.mjs); a map replaces the rasterised sprite
import { MAPS } from './_pixel-maps.mjs'
for (const [name, map] of Object.entries(MAPS)) TUNE[name] = { ...(TUNE[name] || {}), map }
