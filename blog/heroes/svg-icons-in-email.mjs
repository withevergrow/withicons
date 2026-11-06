import { at, icon, chip, glow, C, INK, rgba } from '../tools/hero-kit.mjs'

// A wall of old wooden post-office boxes. Out of box 6, already stuffed with paper letters, spills a cascade of
// envelopes, each sealed with a with icons contact icon as its stamp (phone, mail, globe, calendar, map pin),
// tumbling to the right like a too-full delivery. A cyan "2x PNG" chip (the safe answer) rides on the stream.
const B = C.blueprint
// [icon, stamp colour, x, y, rot, scale]
const LETTERS = [
  ['mail', C.line.c, 700, 300, -16, 0.92],
  ['phone', C.solid.c, 960, 180, -3, 1],
  ['globe', B.c, 1170, 330, 9, 1.04],
  ['calendar', C.duo.c, 930, 500, -8, 1.08],
  ['map-pin', C.gloss.c, 1150, 630, 11, 1.12],
]
const envelope = ([n, col, x, y, rot, s]) => at(`<div class="em">
  <svg class="em__flap" viewBox="0 0 270 180" preserveAspectRatio="none"><path d="M10 12 L135 104 L260 12" fill="none" stroke="${rgba(INK, 0.16)}" stroke-width="4" stroke-linejoin="round"/></svg>
  <span class="em__stamp" style="background:${col}">${icon(n, 'solid', 66, '#fff')}</span>
  <span class="em__lines"><i></i><i></i></span>
</div>`, { x, y, w: 270, h: 180, rot, scale: s, z: 3 })

export default {
  photoFile: 'svg-icons-in-email-mailbox3.jpg',
  credit: { by: 'Hassan Bouamoud', profile: 'https://www.pexels.com/@hassan-bouamoud-1857973307/', source: 'https://www.pexels.com/photo/vintage-wooden-mailbox-with-letters-inside-32598664/', license: 'Pexels License' },
  alt: 'A wall of numbered wooden post office boxes, with white envelopes spilling out of one stuffed box, each stamped with a contact icon: mail, phone, globe, calendar and map pin, under a cyan 2x PNG label',
  photo: { filter: 'saturate(.9) brightness(.8) contrast(1.05)', pos: '50% 50%' },
  overlay: `radial-gradient(ellipse at 66% 45%, ${rgba('#2A1A0E', 0)} 0%, ${rgba('#120A05', 0.5)} 80%)`,
  art: () => [
    glow({ cx: 1060, cy: 470, r: 330, color: '#FFE2B8', opacity: 0.22, blur: 90 }),
    at(`<svg width="760" height="620" viewBox="0 0 760 620" fill="none"><path d="M20 160 C 200 -20, 440 40, 500 200 S 470 480, 660 600" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 20"/></svg>`, { x: 760, y: 200, z: 2 }),
    ...LETTERS.map(envelope),
    chip('2x PNG', { x: 330, y: 170, tone: 'color', style: 'blueprint', size: 44, rot: -5, icon: ['image', 'line'], z: 4 }),
  ].join(''),
  css: `
.em { position: relative; box-sizing: border-box; width: 100%; height: 100%; border-radius: 22px; background: linear-gradient(170deg, #FFFFFF 0%, #F3EEE4 100%);
  box-shadow: 0 2px 0 rgba(17,19,24,.06), 0 40px 70px -26px rgba(0,0,0,.75); }
.em__flap { position: absolute; inset: 0; width: 100%; height: 100%; }
.em__stamp { position: absolute; right: 22px; top: 22px; width: 96px; height: 96px; border-radius: 26px; display: grid; place-items: center;
  outline: 4px dashed rgba(255,255,255,.75); outline-offset: -10px; box-shadow: 0 12px 20px -10px rgba(17,19,24,.5); }
.em__lines { position: absolute; left: 26px; bottom: 28px; display: flex; flex-direction: column; gap: 10px; }
.em__lines i { display: block; width: 120px; height: 10px; border-radius: 6px; background: ${rgba(INK, 0.14)}; }
.em__lines i + i { width: 80px; }
`,
}
