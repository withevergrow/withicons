// Live icon: an avatar with one or two initials, round or squircle, with an optional presence dot.
import { asCutouts, live } from './_font.mjs'
import { rr } from './_layout.mjs'
import { fitChain, dot, ringCut, f } from './_parts-misc.mjs'

// presence badge: centre on the frame's 45-degree corner, ink radius, and the white kept around it
const BADGE = {
  online: { r: 0.75, ink: 1.75, solid: true },   // a small stroked disc: reads filled in every style
  offline: { r: 2, ink: 3, solid: false },       // a ring
}
const WHITE = 1.5, WALL = 1                       // white around the badge, half the frame's stroke

function circleFrame(badge) {
  const full = 'M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z'
  if (!badge) return { frame: full, fill: full, outline: full, b: null }
  const b = { x: 18.75, y: 18.75 }
  const c = BADGE[badge].ink + WHITE + WALL
  const [a, z] = ringCut(12, 12, 9.5, b.x, b.y, c)
  const frame = `M${a[0]} ${a[1]} A9.5 9.5 0 1 1 ${z[0]} ${z[1]}`
  const fill = `${frame} A${f(c)} ${f(c)} 0 0 0 ${a[0]} ${a[1]} Z`
  return { frame, fill, outline: full, b, c }
}

function squareFrame(badge) {
  const full = rr(3, 3, 21, 21, 5)
  if (!badge) return { frame: full, fill: full, outline: full, b: null }
  const b = { x: 19.5, y: 19.5 }
  const c = BADGE[badge].ink + WHITE + WALL
  const k = f(19.5 - Math.sqrt(c * c - 1.5 * 1.5))         // where the clearance circle meets the right / bottom edge
  const frame = `M${k} 21 H8 A5 5 0 0 1 3 16 V8 A5 5 0 0 1 8 3 H16 A5 5 0 0 1 21 8 V${k}`
  const fill = `${frame} A${f(c)} ${f(c)} 0 0 0 ${k} 21 Z`
  return { frame, fill, outline: full, b, c }
}

export default live({
  name: 'avatar-initials', title: 'Avatar initials', category: 'users',
  description: 'A profile avatar showing one or two initials, round or squircle, with an optional online or offline dot.',
  aliases: ['initials', 'avatar', 'monogram', 'profile-initials', 'user-initials', 'letter-avatar', 'name-badge'],
  tags: ['avatar', 'user', 'profile', 'initials', 'account'],
  synonyms: ['profile picture', 'account avatar', 'contact', 'person', 'member', 'presence', 'online status', 'pfp', 'letter icon'],
  params: {
    initials: { type: 'text', maxLength: 2, default: 'JD', case: 'upper', label: 'Initials' },
    shape: { type: 'enum', options: ['circle', 'square'], default: 'circle', label: 'Shape' },
    status: { type: 'enum', options: ['none', 'online', 'offline'], default: 'none', label: 'Status dot' },
  },
  examples: [
    { initials: 'JD', shape: 'circle', status: 'none' },
    { initials: 'A', shape: 'circle', status: 'online' },
    { initials: 'MW', shape: 'circle', status: 'offline' },
    { initials: 'KO', shape: 'square', status: 'online' },
    { initials: 'WM', shape: 'square', status: 'none' },
  ],
  build({ initials, shape, status }) {
    const badge = status === 'none' ? null : status
    const fr = shape === 'square' ? squareFrame(badge) : circleFrame(badge)
    const obstacles = fr.b ? [{ x: fr.b.x, y: fr.b.y, r: BADGE[badge].ink + WHITE + 1 }] : []
    const s = String(initials || '').trim()
    // two initials if they fit legibly, else the first one; nothing typed: an empty avatar frame
    const hit = fitChain([s, s.slice(0, 1)], { outline: fr.outline, obstacles, cx: 12, ys: [12, 11.75, 12.25], minCap: 4 })
    const txt = hit ? hit.t.paths : []
    const paths = [{ d: fr.frame, plate: 'K' }, ...txt.map(d => ({ d, plate: 'A' }))]
    const fills = [fr.fill], cut = asCutouts(txt)
    if (fr.b) {
      const bd = dot(fr.b.x, fr.b.y, BADGE[badge].r)
      paths.push({ d: bd, plate: 'S' })
      if (BADGE[badge].solid) fills.push(bd)
      else cut.push(dot(fr.b.x, fr.b.y, BADGE[badge].r - 1))  // keep the offline ring hollow in filled styles
    }
    return { paths, fills, cutouts: cut }
  },
})
