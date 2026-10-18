// PIXEL per-icon tuning. Never edits skeletons; only how Pixel draws an icon.
//
//   map:   24 rows of 24 chars, a hand-drawn sprite that replaces the rasterised one
//          X  silhouette (outline where it meets paper, body tone inside)
//          #  ink        +  tone        o  shine        =  shade        .  paper
//          Shine and shade are computed automatically unless the map uses o or =.
//   dots:  1 or 2, force the pixel size of tiny circles
//   shift: [dx, dy] in user units added before rasterising (move a drawing half a pixel)
//   ink / del / tone / clear: "i,j i,j ..." cell edits applied after rasterising
//   notone: true draws the line art only (no body tone)
//
// Static icons are drawn on the 24 grid (cell 11 is the icon centre (12,12)). The 16-grid maps and cell fixes of
// the previous pixel generation are kept out of the build (.preview/fix/pixel16-backup/); only the grid-independent
// switches survive.
export const TUNE = {
  // the fan's wedge fill is for the solid styles: pixel draws three arcs and a dot on paper
  wifi: { dots: 3, notone: true },
  'wifi-off': { dots: 3, notone: true },
  // body tone that only half fills an open bracket or a ring reads as a smudge
  'log-in': { notone: true },
  'log-out': { notone: true },
  target: { notone: true },
  // a gear: eight square teeth (the skeleton's thin 45deg teeth rasterise into spikes)
  settings: {
    map: [
      '........................',
      '.........XXXXX..........',
      '.........XXXXX..........',
      '....XXX..XXXXX..XXX.....',
      '....XXX.XXXXXXX.XXX.....',
      '....XXXXXXXXXXXXXXX.....',
      '......XXXXXXXXXXX.......',
      '.....XXXXXXXXXXXXX......',
      '....XXXXXXXXXXXXXXX.....',
      '.XXXXXXXXX...XXXXXXXXX..',
      '.XXXXXXXX.....XXXXXXXX..',
      '.XXXXXXXX.....XXXXXXXX..',
      '.XXXXXXXX.....XXXXXXXX..',
      '.XXXXXXXXX...XXXXXXXXX..',
      '....XXXXXXXXXXXXXXX.....',
      '.....XXXXXXXXXXXXX......',
      '......XXXXXXXXXXX.......',
      '....XXXXXXXXXXXXXXX.....',
      '....XXX.XXXXXXX.XXX.....',
      '....XXX..XXXXX..XXX.....',
      '.........XXXXX..........',
      '.........XXXXX..........',
    ],
  },
}
