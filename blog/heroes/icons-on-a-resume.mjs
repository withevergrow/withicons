import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// A paper CV lying on the desk beside the laptop: a name, a contact column with small orange icons next to each
// line, and two section headings, each with one quiet icon. Text is kept as bars, as on a real page at a glance.
const O = C.solid
const contact = (n, w) => `<div class="cv__ct"><span>${icon(n, 'solid', 32, '#fff')}</span><i style="width:${w}px"></i></div>`
const section = (n, title, lines) => `<div class="cv__sec"><div class="cv__h">${icon(n, 'line', 34, O.text)}<b>${title}</b><em></em></div>${lines.map(w => `<i style="width:${w}%"></i>`).join('')}</div>`

export default {
  base: 'xcv2',
  alt: 'A printed resume on a clipboard beside a laptop on marble, with a paper CV on top showing small orange with icons next to email, phone, place and link',
  photo: { filter: 'saturate(.9) brightness(.97)', pos: '50% 50%' },
  overlay: `linear-gradient(90deg, ${rgba('#2B1A10', 0.05)} 0%, ${rgba('#2B1A10', 0.18)} 100%)`,
  art: () => [
    at(`<div class="cv">
      <div class="cv__top">
        <span class="cv__ava">${icon('user', 'solid', 66, O.c)}</span>
        <div><div class="cv__name">Sam Rivera</div><i class="cv__role"></i></div>
      </div>
      <div class="cv__cts">${contact('mail', 200)}${contact('phone', 150)}${contact('map-pin', 170)}${contact('link', 190)}</div>
      ${section('briefcase', 'Experience', [92, 80, 86, 60])}
      ${section('graduation-cap', 'Education', [84, 55, 70])}
    </div>`, { x: 830, y: 115, rot: -4 }),
    chip('Readable by ATS', { x: 1060, y: 800, tone: 'color', style: 'solid', icon: ['check-circle', 'solid'], rot: -6, size: 30, z: 3 }),
  ].join(''),
  css: `
.cv { width: 540px; height: 740px; box-sizing: border-box; padding: 46px 46px; border-radius: 18px; background: #FFFDF9; font-family: var(--font-display); color: ${INK}; box-shadow: 0 1px 0 rgba(17,19,24,.06), 0 50px 90px -40px rgba(60,40,20,.65); }
.cv__top { display: flex; align-items: center; gap: 24px; padding-bottom: 28px; border-bottom: 3px solid ${O.c}; }
.cv__ava { width: 120px; height: 120px; border-radius: 50%; display: grid; place-items: center; background: ${O.soft}; }
.cv__name { font: 400 60px/1 var(--font-serif); letter-spacing: -.01em; }
.cv__role { display: block; width: 190px; height: 14px; margin-top: 16px; border-radius: 8px; background: rgba(17,19,24,.18); }
.cv__cts { display: grid; grid-template-columns: 1fr 1fr; gap: 26px 18px; margin: 34px 0 18px; }
.cv__ct { display: flex; align-items: center; gap: 14px; }
.cv__ct span { flex: none; width: 58px; height: 58px; border-radius: 17px; display: grid; place-items: center; background: ${O.c}; }
.cv__ct i { display: block; max-width: 150px; height: 12px; border-radius: 8px; background: rgba(17,19,24,.22); }
.cv__sec { margin-top: 30px; }
.cv__h { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
.cv__h b { font: 800 32px/1 var(--font-display); letter-spacing: -.02em; }
.cv__h em { flex: 1; height: 2px; background: rgba(17,19,24,.12); }
.cv__sec > i { display: block; height: 12px; margin: 14px 0; border-radius: 8px; background: rgba(17,19,24,.13); }
`,
}
