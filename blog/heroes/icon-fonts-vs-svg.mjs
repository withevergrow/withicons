import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: typographic poster around "Aa". The open-book photo is duotoned violet; a giant serif "Aa" (an icon font
// is just letters) with a missing-glyph box, a handwritten "vs", and one crisp duo SVG star on a tile with its path
// points showing. Violet (basics) accent.
const V = C.duo
// a few of the star's outer points, in the 24-unit icon grid, drawn as vector handles
const PTS = [[12, 2.6], [21.4, 9.3], [17.8, 20.4], [6.2, 20.4], [2.6, 9.3]]

export default {
  base: 'xgloss0',
  alt: 'An open book duotoned in violet behind a typographic poster: a giant serif Aa with an empty missing-glyph box, a handwritten vs, and one crisp violet duo star SVG on a white tile with its vector points showing',
  photo: { filter: 'grayscale(1) contrast(1.15) brightness(1.05)', pos: '50% 60%' },
  overlay: `linear-gradient(135deg, ${V.c} 0%, #3A1FB8 100%)`,
  art: () => [
    at('<span class="tp__aa">Aa</span>', { x: 170, y: 100 }),
    at('<span class="tp__tofu"></span>', { x: 615, y: 385, rot: 6 }),
    chip('Icon font', { x: 210, y: 528, tone: 'card', icon: ['type', 'line'], size: 30, rot: -4 }),
    at('<span class="tp__vs">vs</span>', { cx: 800, cy: 330, rot: -8 }),
    at(`<div class="tp__svg">${icon('star', 'duo', 360, V.c)}<svg class="tp__pts" viewBox="0 0 24 24">${PTS.map(([x, y]) => `<rect x="${x - 0.55}" y="${y - 0.55}" width="1.1" height="1.1" rx=".2"/>`).join('')}</svg></div>`, { x: 900, y: 170, rot: 4 }),
    chip('SVG', { x: 1240, y: 610, tone: 'sun', icon: ['code-xml', 'line'], size: 40, rot: -5 }),
  ].join(''),
  css: `
.stage__overlay { mix-blend-mode: multiply; }
.tp__aa { display: block; font: 400 520px/.9 var(--font-serif); color: #fff; letter-spacing: -.04em; text-shadow: 0 30px 60px rgba(20,0,60,.35); }
.tp__tofu { display: block; width: 92px; height: 128px; border: 6px solid rgba(255,255,255,.85); border-radius: 8px; background: linear-gradient(to top right, transparent calc(50% - 3px), rgba(255,255,255,.85) calc(50% - 3px) calc(50% + 3px), transparent calc(50% + 3px)), linear-gradient(to top left, transparent calc(50% - 3px), rgba(255,255,255,.85) calc(50% - 3px) calc(50% + 3px), transparent calc(50% + 3px)); }
.tp__vs { display: block; font: 700 150px/1 var(--font-hand); color: #FFD23F; }
.tp__svg { position: relative; width: 480px; height: 480px; border-radius: 120px; background: #fff; display: grid; place-items: center; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 60px 100px -40px rgba(20,0,60,.75); }
.tp__pts { position: absolute; left: 60px; top: 60px; width: 360px; height: 360px; overflow: visible; }
.tp__pts rect { fill: #fff; stroke: ${INK}; stroke-width: .22; }
`,
}
