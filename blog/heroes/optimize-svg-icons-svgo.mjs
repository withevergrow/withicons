import { at, icon, C, INK, rgba } from '../tools/hero-kit.mjs'
import { BEFORE, AFTER } from '../media/optimize-svg-icons-svgo/_bell.mjs'

// Treatment: vacuum packing. Over a photo of hands pressing the air out of a storage bag, a puffy plush bell sits in an
// inflated clear pouch with a big byte tag; a cyan squeeze arrow leads to the same bell as a neat line icon, sealed flat
// in a tight pouch with a small tag. The byte counts are the real sizes of the before / after files used in the post.
const B = C.blueprint
const size = s => `${Buffer.byteLength(s).toLocaleString('en-US')} B`
const tag = (text, tone) => `<span class="vp-tag is-${tone}"><i></i>${text}</span>`

export default {
  photoFile: 'optimize-svg-icons-svgo-c4.jpg',
  credit: { by: 'Timur Weber', profile: 'https://www.pexels.com/@timur-weber/', source: 'https://www.pexels.com/photo/a-woman-packing-using-a-vacuum-bag-9186215/', license: 'Pexels License' },
  alt: 'Hands pressing the air out of a vacuum storage bag, with a puffy plush bell in an inflated clear pouch tagged 1,112 bytes and a cyan arrow to the same bell as a neat line icon sealed flat in a tight pouch tagged 281 bytes',
  photo: { filter: 'saturate(.8) brightness(.66)', pos: '50% 100%' },
  overlay: `linear-gradient(180deg, ${rgba('#0E1A22', 0.25)} 0%, ${rgba('#0E1A22', 0.1)} 50%, ${rgba('#0E1A22', 0.45)} 100%)`,
  art: () => [
    at(`<div class="vp-puff">${icon('bell', 'plush', 320)}</div>`, { x: 200, y: 190, w: 450, h: 400 }),
    at(tag(size(BEFORE), 'big'), { x: 470, y: 160, rot: 8, z: 3 }),
    at(`<svg width="300" height="160" viewBox="0 0 300 160" fill="none">
      <path d="M20 80 H230" stroke="#fff" stroke-width="34" stroke-linecap="round"/>
      <path d="M210 30 L270 80 L210 130" stroke="#fff" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 80 H230" stroke="${B.c}" stroke-width="18" stroke-linecap="round"/>
      <path d="M210 30 L270 80 L210 130" stroke="${B.c}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`, { x: 690, y: 320, cls: 'vp-arrow' }),
    at(`<span class="vp-tool">${icon('package', 'line', 36, B.text)}<b>SVGO</b></span>`, { cx: 825, cy: 300, z: 3 }),
    at(`<div class="vp-flat"><span class="vp-ic">${icon('bell', 'line', 150, INK)}</span></div>`, { x: 1040, y: 262, w: 300, h: 300, rot: -3 }),
    at(tag(size(AFTER), 'small'), { x: 1230, y: 505, rot: -6, z: 3 }),
  ].join(''),
  css: `
.vp-puff { position: relative; width: 100%; height: 100%; display: grid; place-items: center; border-radius: 46% 54% 48% 52% / 52% 46% 54% 48%;
  background: radial-gradient(60% 50% at 32% 26%, rgba(255,255,255,.75) 0%, rgba(255,255,255,0) 60%), radial-gradient(120% 120% at 50% 50%, rgba(235,244,250,.28) 40%, rgba(255,255,255,.62) 100%);
  border: 3px solid rgba(255,255,255,.75); box-shadow: inset 0 -30px 60px rgba(255,255,255,.35), inset 0 20px 40px rgba(255,255,255,.25), 0 50px 90px -40px rgba(0,0,0,.7);
  backdrop-filter: blur(6px) saturate(1.2); }
.vp-puff::after { content: ''; position: absolute; left: 50%; top: -14px; translate: -50% 0; width: 150px; height: 30px; border-radius: 12px; background: linear-gradient(#EAF6FB, #BFDCE8); box-shadow: 0 6px 12px rgba(0,0,0,.25); }
.vp-puff .hk-icon { filter: drop-shadow(0 24px 30px rgba(0,0,0,.35)); }
.vp-flat { position: relative; box-sizing: border-box; width: 100%; height: 100%; display: grid; place-items: center; border-radius: 34px; background:
  linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.55) 38%, rgba(255,255,255,0) 46%),
  linear-gradient(115deg, rgba(255,255,255,0) 58%, rgba(255,255,255,.35) 62%, rgba(255,255,255,0) 66%), #F6F9FB;
  border: 10px solid rgba(226,240,246,.95); box-shadow: inset 0 0 0 2px rgba(17,19,24,.06), 0 40px 70px -30px rgba(0,0,0,.7); }
.vp-flat::before { content: ''; position: absolute; inset: 22px; border-radius: 22px; border: 3px dashed ${rgba(B.c, 0.55)}; }
.vp-ic { line-height: 0; position: relative; }
.vp-tool { display: inline-flex; align-items: center; gap: 10px; padding: 12px 22px 12px 16px; border-radius: 999px; background: #fff; box-shadow: 0 18px 36px -16px rgba(0,0,0,.6); }
.vp-tool b { font: 800 32px/1 var(--font-mono); color: ${INK}; letter-spacing: -.02em; }
.vp-arrow { filter: drop-shadow(0 16px 24px rgba(0,0,0,.4)); }
.vp-tag { position: relative; display: inline-flex; align-items: center; gap: 14px; padding: 16px 26px 16px 22px; border-radius: 14px 999px 999px 14px; font: 800 40px/1 var(--font-mono); letter-spacing: -.03em; white-space: nowrap; box-shadow: 0 20px 40px -16px rgba(0,0,0,.6); }
.vp-tag i { width: 18px; height: 18px; border-radius: 50%; background: rgba(255,255,255,.9); box-shadow: inset 0 0 0 3px rgba(17,19,24,.25); }
.vp-tag.is-big { background: #E5484D; color: #fff; }
.vp-tag.is-small { background: ${B.c}; color: #fff; font-size: 34px; }
`,
}
