import { at, icon, glow, C, INK, rgba } from '../tools/hero-kit.mjs'

// A blue-lit laptop keyboard, close up. Floating over it, one oversized white search field: the with icons search icon
// sits inside its start edge, a dashed cyan box marks the padding the icon lives in, and a text caret waits after the
// placeholder. Nothing else: the field is the whole idea.
const BLUE = C.blueprint.c
const F = { x: 230, y: 390, w: 1140, h: 190 }
const PAD = 190 // the padding zone at the start of the field

export default {
  photoFile: 'icon-inside-input-field-keys.jpg',
  credit: { by: 'Eric Feng', profile: 'https://www.pexels.com/@erix07/', source: 'https://www.pexels.com/photo/close-up-shot-of-black-laptop-keyboard-10843996/', license: 'Pexels License' },
  alt: 'A blue-lit laptop keyboard close up, with an oversized white search field floating over it: the with icons search icon sits inside a dashed cyan padding box at its start, before the placeholder Search icons and a text caret',
  photo: { filter: 'saturate(1.1) brightness(.62)', pos: '50% 60%', scale: 1.05 },
  overlay: `radial-gradient(70% 60% at 50% 45%, ${rgba('#06102A', 0.1)} 0%, ${rgba('#06102A', 0.6)} 100%)`,
  art: () => [
    glow({ cx: F.x + F.w / 2, cy: F.y + F.h / 2, r: 420, color: BLUE, opacity: 0.35, blur: 110 }),
    at(`<div class="field">
      <div class="pad"><span class="ic">${icon('search', 'line', 116, BLUE)}</span></div>
      <span class="ph">Search icons</span><i class="caret"></i>
    </div>`, { x: F.x, y: F.y, w: F.w, h: F.h }),
    // the padding measure above the field
    at(`<div class="meas"><span>padding</span><b></b></div>`, { x: F.x + 22, y: F.y - 96, w: PAD - 22 }),
    at(`<span class="ptr">${icon('cursor', 'solid', 70, '#fff')}</span>`, { x: F.x + 128, y: F.y + 112, z: 4 }),
  ].join(''),
  css: `
.field { box-sizing: border-box; width: 100%; height: 100%; display: flex; align-items: center; border-radius: 999px; background: #fff; box-shadow: 0 0 0 10px ${rgba('#ffffff', 0.18)}, 0 0 0 4px ${BLUE} inset, 0 80px 140px -40px rgba(0,0,0,.9); }
.pad { box-sizing: border-box; flex: none; width: ${PAD}px; height: 100%; display: grid; place-items: center; padding-left: 26px; }
.pad .ic { box-sizing: border-box; width: ${PAD - 46}px; height: 132px; display: grid; place-items: center; border: 4px dashed ${BLUE}; border-radius: 30px; background: ${rgba(BLUE, 0.08)}; }
.ph { font: 600 84px/1 var(--font-display); color: #8A909C; letter-spacing: -.02em; white-space: nowrap; }
.caret { display: block; width: 6px; height: 96px; margin-left: 10px; border-radius: 3px; background: ${INK}; }
.meas { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 14px; color: #fff; font: 600 30px/1 var(--font-mono); }
.meas b { display: block; width: 100%; height: 16px; box-sizing: border-box; border: 3px solid rgba(255,255,255,.85); border-bottom: 0; border-radius: 6px 6px 0 0; }
.ptr { display: block; line-height: 0; filter: drop-shadow(0 0 2px ${INK}) drop-shadow(0 10px 16px rgba(0,0,0,.5)); }
`,
}
