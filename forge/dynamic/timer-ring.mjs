// Live icon: a countdown timer — a ring that empties toward 12 o'clock, the time left written inside, and a
// stopwatch crown on top so it never reads as a plain progress ring (forge/DYNAMIC.md).
import { measure, text, asCutouts, live } from './_font.mjs'
import { STOPWATCH, circle, arc, hand, spentDots } from './_parts-time.mjs'

const CX = 12, CY = 13.5, R = 8.5 // the static `timer` face, opened up by 0.5u so two digits breathe
const DISC = 6                    // inner mass for filled styles: 1.5u clear of the ring ink
const TEXT_R = 5                  // centrelines stay inside this circle (1.5u white to the ring, 0.25u inside the disc)

// largest cap (7 .. 4, 0.25 steps; natural spacing, then 0.25u and at the smallest sizes 0.5u tighter) whose
// centreline box fits a circle of radius TEXT_R. Wide pairs like "44" or "88" shrink, they never vanish.
function fitRound(str) {
  for (let cap = 7; cap >= 4 - 1e-9; cap -= 0.25) {
    for (const tracking of cap <= 4.5 ? [0, -0.25, -0.5] : [0, -0.25]) {
      const m = measure(str, { size: cap, tracking })
      if (Math.hypot(m.width / 2, cap / 2) <= TEXT_R) return text(str, { x: CX, y: CY, size: cap, tracking })
    }
  }
  return null
}

export default live({
  name: 'timer-ring', title: 'Countdown timer', category: 'time',
  description: 'A countdown timer: the ring shows how much of the time is left and the number inside says how much.',
  aliases: ['countdown-timer', 'countdown-ring', 'time-left', 'time-remaining', 'remaining-time', 'timer-countdown', 'kitchen-timer'],
  tags: ['time', 'timer', 'countdown', 'remaining', 'progress'],
  synonyms: ['countdown', 'seconds left', 'minutes left', 'time remaining', 'expires', 'expiring', 'ends in', 'hurry',
    'limited time', 'offer ends', 'deadline', 'pomodoro', 'focus timer', 'cooking timer', 'otp timer', 'resend code', 'session timeout'],
  params: {
    left: { type: 'int', min: 0, max: 99, default: 45, label: 'Time left (number shown)' },
    total: { type: 'int', min: 1, max: 99, default: 60, label: 'Out of (full ring)' },
    number: { type: 'bool', default: true, label: 'Show the number' },
  },
  examples: [
    { left: 45, total: 60, number: true },
    { left: 5, total: 10, number: true },
    { left: 0, total: 60, number: true },
    { left: 25, total: 25, number: true },
    { left: 99, total: 99, number: true },
    { left: 20, total: 60, number: false },
  ],
  shows: p => (p.number ? String(Math.min(p.left, Math.max(1, p.total))) : ''),
  build({ left, total, number }) {
    const t = Math.max(1, total), l = Math.max(0, Math.min(t, left))
    const span = 360 * l / t, start = 360 - span // remaining arc runs from `start` clockwise to 12 o'clock
    const paths = [{ d: STOPWATCH.crown.replace('V5.5', `V${CY - R}`), plate: 'A' }]
    if (l >= t) paths.push({ d: circle(CX, CY, R), plate: 'K' })
    else if (l > 0) paths.push({ d: arc(CX, CY, R, Math.min(start, 354), 360), plate: 'K' })
    // the spent part as dots, clear of the arc's start cap and the crown
    if (l < t) for (const d of spentDots(CX, CY, R, 0, l > 0 ? Math.min(start, 354) : 360, { step: 30, clear: 22 })) paths.push({ d, plate: 'A' })
    let inner = []
    if (number) { const g = fitRound(String(l)); if (g) inner = g.paths }
    paths.push(...inner.map(d => ({ d, plate: 'A' })))
    const cutouts = asCutouts(inner)
    // no number: a kitchen-timer pointer from the centre to where the time left begins
    if (!number) {
      const h = hand(CX, CY, 4.5, l >= t || l <= 0 ? 0 : start)
      paths.push({ d: h, plate: 'A' }); cutouts.push(h)
    }
    return { paths, fills: [circle(CX, CY, DISC)], cutouts }
  },
})
