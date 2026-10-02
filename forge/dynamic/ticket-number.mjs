// Live icon: an admit-one ticket (scooped corners) with a number on it: queue, raffle, seat or order number.
import { asCutouts, live } from './_font.mjs'
import { fitChain } from './_parts-misc.mjs'

// landscape ticket 2..22 x 5..19 with concave r 2.5 corners: the sides stay straight so the number gets the full width
const TICKET = 'M4.5 5 H19.5 A2.5 2.5 0 0 0 22 7.5 V16.5 A2.5 2.5 0 0 0 19.5 19 H4.5 A2.5 2.5 0 0 0 2 16.5 V7.5 A2.5 2.5 0 0 0 4.5 5 Z'

export default live({
  name: 'ticket-number', title: 'Ticket number', category: 'commerce',
  description: 'A ticket with a number on it, for queue numbers, raffles, seats, orders and support tickets.',
  aliases: ['queue-number', 'raffle-ticket', 'numbered-ticket', 'ticket-no', 'order-number', 'seat-number', 'take-a-number'],
  tags: ['ticket', 'number', 'queue', 'raffle', 'event'],
  synonyms: ['admit one', 'lottery', 'draw', 'turn', 'waiting line', 'deli counter', 'support ticket', 'pass', 'entry', 'coupon'],
  params: {
    number: { type: 'int', min: 0, max: 999, default: 42, label: 'Number' },
    hash: { type: 'bool', default: false, label: 'Show # before the number' },
  },
  examples: [
    { number: 1, hash: false },
    { number: 42, hash: false },
    { number: 7, hash: true },
    { number: 128, hash: false },
    { number: 999, hash: true },
  ],
  build({ number, hash }) {
    const n = String(number)
    const opts = { outline: TICKET, cx: 12, ys: [12, 11.75, 12.25], minCap: 4 }
    // 1-2 digits print large; 3 shrink; "#" is dropped before the digits shrink below legibility. The widest
    // 3-digit numbers (999, 866...) need the last 0.5u of white: still 1u clear of the wall, never touching.
    const hit = (hash && fitChain(['#' + n], { ...opts, minCap: 5 })) || fitChain([n], opts) || fitChain([n], { ...opts, clearance: 3 })
    const txt = hit ? hit.t.paths : []
    return {
      paths: [{ d: TICKET, plate: 'K' }, ...txt.map(d => ({ d, plate: 'A' }))],
      fills: [TICKET],
      cutouts: asCutouts(txt),
    }
  },
})
