// Live icon: an app tile with a home-screen notification badge. forge/DYNAMIC.md, parts in ./_parts-counts.mjs
import { countIcon, countParams, countExamples, countShows, keptRatio } from './_parts-counts.mjs'
import { live } from './_font.mjs'

// an app tile: the square-container keylines (3..21) with an app-icon corner radius
const TILE = 'M8 3 H16 A5 5 0 0 1 21 8 V16 A5 5 0 0 1 16 21 H8 A5 5 0 0 1 3 16 V8 A5 5 0 0 1 8 3 Z'
const BASE = { paths: [{ d: TILE, plate: 'K' }], fills: [TILE], cutouts: [] }

export default live({
  name: 'app-badge', title: 'App with badge', category: 'layout',
  description: 'An app tile with a home-screen notification badge: a number, "99+", a dot, or a plain tile at zero.',
  aliases: ['app-notification', 'app-icon-badge', 'badge-count', 'app-count', 'icon-badge', 'unread-badge', 'app-dot'],
  tags: ['app', 'badge', 'notification', 'count', 'home screen'],
  synonyms: ['app icon', 'pending updates', 'unread count', 'red badge', 'home screen badge', 'launcher', 'counter'],
  params: countParams({ count: 4 }),
  examples: countExamples(),
  shows: p => countShows(BASE, p, { badge: { dotR: 2.5 } }), kept: p => keptRatio(BASE, p, { badge: { dotR: 2.5 } }),
  build(p) { return countIcon(BASE, { ...p, badge: { dotR: 2.5 } }) },
})
