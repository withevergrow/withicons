// PIXEL — hand-drawn COUNT icons (forge/DYNAMIC.md: bell-count, mail-count, cart-count, chat-count, app-badge,
// inbox-count). The generic raster of a scaled, badge-trimmed base breaks on a 16x16 grid (a bell loses its dome, an
// envelope its flap), so the family is drawn here: one sprite per base in three sizes, and a solid ink chip with the
// number knocked out in the 5-row bitmap digits (_pixel-text.mjs), separated from the base by a one-pixel moat.
//   full   14 x 14 at cells 1..14   no badge, or a dot (the dot takes the top-right corner, the moat bites the base)
//   mid    11 x 11 bottom-left      one digit (a 7 x 7 chip top-right)
//   small   9 x  8 bottom-left      two or three characters (a 9- or 13-cell-wide chip across the top)
// The text shown is the skeleton's own (the generator's "99+" / "9+" choice), read from its glyphs.
//   '#' ink   '+' body tone   'o' glint   '.' paper
import * as G from './_pixel-core.mjs'
import { fitPixelText } from './_pixel-text.mjs'
import { textInfo } from './_live-text.mjs'

export const COUNT_ICONS = new Set(['bell-count', 'mail-count', 'cart-count', 'chat-count', 'app-badge', 'inbox-count'])

const S = {
  'bell-count': {
    full: [
      '......##......',
      '....######....',
      '...#++++++#...',
      '..#+o+++++#...',
      '..#+o++++++#..',
      '..#++++++++#..',
      '..#++++++++#..',
      '..#++++++++#..',
      '.#++++++++++#.',
      '.#++++++++++#.',
      '##############',
      '..............',
      '.....####.....',
      '......##......',
    ],
    mid: [
      '.....#.....',
      '...#####...',
      '..#+++++#..',
      '.#+o+++++#.',
      '.#+o+++++#.',
      '.#+++++++#.',
      '.#+++++++#.',
      '#+++++++++#',
      '###########',
      '...........',
      '....###....',
    ],
    small: [
      '..#####..',
      '.#+o+++#.',
      '.#+++++#.',
      '.#+++++#.',
      '#+++++++#',
      '#########',
      '.........',
      '...###...',
    ],
  },
  'mail-count': {
    full: [
      '..............',
      '..............',
      '##############',
      '##++++++++++##',
      '#+#++++++++#+#',
      '#++#++++++#++#',
      '#+++#++++#+++#',
      '#++++####++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '##############',
      '..............',
      '..............',
    ],
    mid: [
      '...........',
      '...........',
      '...........',
      '###########',
      '##+++++++##',
      '#+#+++++#+#',
      '#++#+++#++#',
      '#+++###+++#',
      '#+++++++++#',
      '#+++++++++#',
      '###########',
    ],
    small: [
      '.........',
      '#########',
      '##+++++##',
      '#+#+++#+#',
      '#++###++#',
      '#+++++++#',
      '#+++++++#',
      '#########',
    ],
  },
  'cart-count': {
    full: [
      '..............',
      '##............',
      '.#............',
      '.#############',
      '.#+o+++++++++#',
      '..#++++++++++#',
      '..#+++++++++#.',
      '...#++++++++#.',
      '...##########.',
      '...#..........',
      '...#########..',
      '..............',
      '...##.....##..',
      '...##.....##..',
    ],
    mid: [
      '...........',
      '##.........',
      '.#.........',
      '.##########',
      '.#+o++++++#',
      '..#+++++++#',
      '..#++++++#.',
      '...#######.',
      '...........',
      '...##...##.',
      '...##...##.',
    ],
    small: [
      '##.......',
      '.########',
      '.#+o++++#',
      '..#++++#.',
      '..######.',
      '.........',
      '..##..##.',
      '..##..##.',
    ],
  },
  'chat-count': {
    full: [
      '..............',
      '....######....',
      '..##++++++##..',
      '.#+o++++++++#.',
      '.#+o++++++++#.',
      '#++++++++++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '.#++++++++++#.',
      '.#+++++++++#..',
      '#+++#######...',
      '#++#..........',
      '###...........',
    ],
    mid: [
      '...#####...',
      '.##+++++##.',
      '.#+o+++++#.',
      '#+o+++++++#',
      '#+++++++++#',
      '#+++++++++#',
      '#+++++++++#',
      '.#+++++++#.',
      '#++######..',
      '#+#........',
      '##.........',
    ],
    small: [
      '..#####..',
      '.#+++++#.',
      '#+o+++++#',
      '#+++++++#',
      '.#+++++#.',
      '#++####..',
      '#+#......',
      '##.......',
    ],
  },
  'app-badge': {
    full: [
      '.############.',
      '#++++++++++++#',
      '#+o++++++++++#',
      '#+o++++++++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '.############.',
    ],
    mid: [
      '.#########.',
      '#+++++++++#',
      '#+o+++++++#',
      '#+o+++++++#',
      '#+++++++++#',
      '#+++++++++#',
      '#+++++++++#',
      '#+++++++++#',
      '#+++++++++#',
      '#+++++++++#',
      '.#########.',
    ],
    small: [
      '.#######.',
      '#+++++++#',
      '#+o+++++#',
      '#+++++++#',
      '#+++++++#',
      '#+++++++#',
      '#+++++++#',
      '.#######.',
    ],
  },
  'inbox-count': {
    full: [
      '..............',
      '..............',
      '...########...',
      '..#........#..',
      '..#........#..',
      '.#..........#.',
      '.#..........#.',
      '#............#',
      '####......####',
      '#++##....##++#',
      '#+++######+++#',
      '#++++++++++++#',
      '#++++++++++++#',
      '##############',
    ],
    mid: [
      '...........',
      '...........',
      '..#######..',
      '.#.......#.',
      '.#.......#.',
      '#.........#',
      '###.....###',
      '#++#####++#',
      '#+++++++++#',
      '#+++++++++#',
      '###########',
    ],
    small: [
      '..#####..',
      '.#.....#.',
      '#.......#',
      '##.....##',
      '#+#####+#',
      '#+++++++#',
      '#+++++++#',
      '#########',
    ],
  },
}

// a chip with one-cell corner cuts; a 5 x 5 dot is a pixel disc
const chipShape = (w, h) => Array.from({ length: h }, (_, j) => Array.from({ length: w }, (_, i) => ((i === 0 || i === w - 1) && (j === 0 || j === h - 1)) ? '.' : '#').join(''))

// the count the skeleton shows: its S-plate glyphs, left to right ('' for a dot or no badge)
function shown(icon) {
  const gl = (icon.paths || []).map(p => ({ p, t: textInfo(p) })).filter(o => o.t && o.p.plate === 'S')
  const x = o => Math.min(...o.p.subs.flatMap(s => s.pts.map(q => q[0])))
  return gl.sort((a, b) => x(a) - x(b)).map(o => o.t.ch).join('')
}

// does a mid sprite (stamped at col 0, bottom row 14) stay clear of a top-right 7 x 7 chip and its moat (cols >= 7,
// rows <= 8)?
const clears = rows => rows.every((r, j) => { const y = 15 - rows.length + j; return y > 8 || [...r].every((c, i) => c === '.' || i < 7) })

export function countSprite(icon) {
  const set = S[icon.name]
  if (!set) return null
  const badge = (icon.paths || []).find(p => /^badge:/u.test(p.id || ''))
  const bottom = badge ? Math.max(...badge.subs.flatMap(s => s.pts.map(q => q[1]))) > 16 : false
  const label = badge ? shown(icon) : ''
  const ink = G.grid(), tone = G.grid(), glint = G.grid(), text = G.grid()
  const put = (g, i, j, v = 1) => { if (G.inb(i, j)) g[G.ix(i, j)] = v }
  const stamp = (rows, i0, j0) => rows.forEach((r, j) => [...r].forEach((c, i) => {
    if (c === '#') put(ink, i0 + i, j0 + j)
    else if (c === '+') put(tone, i0 + i, j0 + j)
    else if (c === 'o') { put(tone, i0 + i, j0 + j); put(glint, i0 + i, j0 + j) }
  }))
  // chip (+ its moat) at the corner; returns the cells it covers
  // (the chip keeps the canvas's one-cell margin, cells 1..14, like every pixel icon)
  const chip = (w, h) => {
    const i0 = 15 - w, j0 = bottom ? 15 - h : 1
    const cells = new Set()
    for (let j = -1; j <= h; j++) for (let i = -1; i <= w; i++) {
      const ci = i0 + i, cj = j0 + j
      if (!G.inb(ci, cj)) continue
      const inChip = i >= 0 && j >= 0 && i < w && j < h && chipShape(w, h)[j][i] === '#'
      const moat = !inChip && [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]].some(([a, b]) => { const ii = i + a, jj = j + b; return ii >= 0 && jj >= 0 && ii < w && jj < h && chipShape(w, h)[jj][ii] === '#' })
      if (inChip || moat) { put(ink, ci, cj, 0); put(tone, ci, cj, 0); put(glint, ci, cj, 0) }
      if (inChip) put(ink, ci, cj)
      if (inChip || moat) cells.add(ci + ',' + cj)
    }
    return { i0, j0 }
  }
  if (!badge) { stamp(set.full, 1, 1); return { ink, tone, glint, text } }
  if (!label) { // a dot: the full base, a 4 x 4 dot in the corner with its moat
    stamp(set.full, 1, 1)
    chip(5, 5)
    return { ink, tone, glint, text }
  }
  const one = [...label].length === 1
  // a bottom-right badge takes the base's feet (wheels, a lip): the compact base sits top-left, clear of it
  // the 7 x 7 chip and its moat take cells 7..14: a one-digit count keeps the larger base only where it clears them
  const base = one && !bottom && clears(set.mid) ? set.mid : set.small, bh = base.length
  stamp(base, 0, bottom ? 1 : 15 - bh)
  const t = fitPixelText(label, 12, 5) || fitPixelText(label, 12, 4) || fitPixelText(label, 12, 4, true)
  if (!t) return { ink, tone, glint, text }
  const w = Math.min(14, Math.max(7, t.w + 4)), h = t.h + 2
  const { i0, j0 } = chip(w, h)
  const ti = i0 + Math.floor((w - t.w) / 2), tj = j0 + 1
  for (const [a, b] of t.cells) { put(ink, ti + a, tj + b, 0); put(text, ti + a, tj + b) }
  return { ink, tone, glint, text }
}
