import { at, icon, C, rgba, INK } from '../tools/hero-kit.mjs'

// A magazine cover: a giant "2026" serif masthead over coded pastel artwork (gradient wash, glass blobs), one big glass icon as the
// cover star, and four cover lines, each with its trend shown as a real icon. A second issue peeks out behind it.
const line = (name, style, text) => `<li><span>${icon(name, style, 58)}</span>${text}</li>`

export default {
  base: 'trends1',
  alt: 'Blue and violet flowing shapes behind a magazine cover with a big serif 2026 masthead, a glass sparkle icon as cover star and lines for glass, pixel, Bauhaus and cute trends',
  photo: { filter: 'saturate(1.1) brightness(.55) blur(6px)', pos: '50% 50%', scale: 1.06 },
  overlay: `linear-gradient(90deg, ${rgba(INK, 0.1)} 0%, ${rgba(INK, 0.35)} 100%)`,
  art: () => [
    at(`<div class="mg is-back"><i class="mg__wave"></i><i class="mg__wave is-2"></i></div>`, { x: 760, y: 160, w: 500, h: 680, rot: -8 }),
    at(`<div class="mg">
      <i class="mg__blob is-a"></i><i class="mg__blob is-b"></i><i class="mg__blob is-c"></i>
      <span class="mg__kick">with icons journal</span>
      <span class="mg__mast">2026</span>
      <span class="mg__star">${icon('sparkles', 'glass', 300)}</span>
      <ul class="mg__lines">${line('cloud-sun', 'glass', 'Glass')}${line('heart', 'pixel', 'Pixel')}${line('sun', 'bauhaus', 'Bauhaus')}${line('cat', 'kawaii', 'Cute')}</ul>
      <span class="mg__tag">Trends</span>
    </div>`, { x: 860, y: 120, w: 560, h: 760, rot: 3 }),
  ].join(''),
  css: `
.mg { position: relative; width: 100%; height: 100%; border-radius: 20px; overflow: hidden; background: #EDE8FF; box-shadow: 0 2px 0 rgba(0,0,0,.05), 0 70px 120px -40px rgba(0,0,0,.9); color: ${INK}; }
.mg { background: radial-gradient(80% 60% at 20% 15%, #CFE6FF 0%, transparent 60%), radial-gradient(70% 60% at 90% 90%, #FFE3C4 0%, transparent 60%), radial-gradient(90% 70% at 70% 45%, #D9CCFF 0%, transparent 70%), linear-gradient(160deg, #EAF2FF 0%, #E6DEFF 50%, #FBE7EF 100%); }
.mg__blob { position: absolute; border-radius: 50%; }
.mg__blob.is-a { width: 380px; height: 380px; left: 110px; top: 220px; background: radial-gradient(circle at 32% 28%, rgba(255,255,255,.95) 0%, rgba(214,204,255,.75) 35%, rgba(150,130,255,.55) 70%, rgba(120,170,255,.4) 100%); box-shadow: inset -20px -30px 60px rgba(114,82,255,.25), 0 40px 70px -30px rgba(80,50,200,.45); }
.mg__blob.is-b { width: 90px; height: 90px; left: 70px; top: 190px; background: radial-gradient(circle at 35% 30%, #fff 0%, #FFD8B0 55%, #F5A9C8 100%); }
.mg__blob.is-c { width: 44px; height: 44px; left: 150px; top: 160px; background: radial-gradient(circle at 35% 30%, #fff 0%, #BFD9FF 60%, #9CB4FF 100%); }
.mg.is-back { background: linear-gradient(170deg, #9B7BFF 0%, ${C.duo.c} 45%, #3E6BE0 100%); }
.mg__wave { position: absolute; left: -30%; right: -30%; height: 60%; top: 52%; border-radius: 50% 50% 0 0; background: linear-gradient(180deg, rgba(255,160,200,.75), rgba(255,140,90,.4)); }
.mg__wave.is-2 { top: 70%; background: linear-gradient(180deg, rgba(56,189,248,.8), rgba(46,100,230,.6)); rotate: -8deg; }
.mg__kick { position: absolute; left: 34px; top: 30px; font: 700 22px/1 var(--font-display); letter-spacing: .02em; }
.mg__mast { position: absolute; left: 22px; right: 22px; top: 50px; font: 400 236px/1 var(--font-serif); letter-spacing: -.04em; color: ${INK}; text-align: center; }
.mg__star { position: absolute; right: 30px; top: 300px; filter: drop-shadow(0 30px 40px rgba(60,30,160,.35)); }
.mg__lines { position: absolute; left: 30px; bottom: 30px; margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.mg__lines li { display: flex; align-items: center; gap: 14px; padding: 6px 20px 6px 6px; border-radius: 999px; background: rgba(255,255,255,.88); font: 800 34px/1 var(--font-display); letter-spacing: -.02em; width: fit-content; }
.mg__lines li span { display: grid; place-items: center; width: 64px; height: 64px; }
.mg__tag { position: absolute; right: 28px; bottom: 34px; padding: 12px 22px; border-radius: 999px; background: ${C.duo.c}; color: #fff; font: 700 28px/1 var(--font-display); rotate: -6deg; }
`,
}
