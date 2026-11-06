import { at, chip, icon, C, rgba } from '../tools/hero-kit.mjs'

// Treatment: a real silver picture frame on a grey wall, fitted with a cream passe-partout (mat) that has two windows.
// The left window is sized right: the blueprint home icon sits on its 24-unit graph paper with room to spare. The right
// window is too small for the same icon, so its roof and walls are cut off at the dashed edge. Frame = width/height,
// graph paper = viewBox. Blueprint cyan (code) accent.
const B = C.blueprint
// the frame's opening in stage pixels (photo c1 at pos 50% 100%)
const OP = { x: 485, y: 166, w: 824, h: 539 } // a slightly skewed quad, matched with clip-path below
const grid = n => `background-image: linear-gradient(${rgba(B.c, 0.18)} 1.5px, transparent 1.5px), linear-gradient(90deg, ${rgba(B.c, 0.18)} 1.5px, transparent 1.5px); background-size: ${n}px ${n}px;`

export default {
  photoFile: 'svg-icon-cut-off-or-blurry-c1.jpg',
  credit: { by: 'Pict4life', profile: 'https://unsplash.com/@pict4life', source: 'https://unsplash.com/photos/empty-silver-picture-frame-on-a-wall-MgUVqNIo04Q', license: 'Unsplash License' },
  alt: 'A silver picture frame on a grey wall with a cream mat cut into two windows: in the left one a cyan blueprint home icon fits on its grid, in the smaller right one the same icon is cut off at a red dashed edge',
  photo: { filter: 'saturate(.85) brightness(.95)', pos: '50% 100%' },
  overlay: `radial-gradient(70% 70% at 56% 45%, transparent 40%, ${rgba('#14161C', 0.35)} 100%)`,
  art: () => [
    at(`<div class="pp">
      <span class="pp__ghost">${icon('home', 'blueprint', 330, B.c)}</span>
      <div class="pp__win is-fit" style="${grid(12.5)}">${icon('home', 'blueprint', 220, B.c)}</div>
      <div class="pp__win is-cut" style="${grid(16.6)}"><span class="pp__big">${icon('home', 'blueprint', 330, B.c)}</span></div>
    </div>`, { x: OP.x, y: OP.y, w: OP.w, h: OP.h }),
    chip('fits', { cx: 720, cy: 545, tone: 'color', style: 'blueprint', icon: ['check', 'solid'], size: 34, rot: -3 }),
    at(`<span class="hk-chip pp__red" style="font-size:34px">${icon('scissors', 'solid', 39, '#fff')}<b>cut off</b></span>`, { cx: 1120, cy: 548, rot: 3 }),
  ].join(''),
  css: `
.pp { position: relative; clip-path: polygon(0 16px, 791px 0, 824px 514px, 13px 539px); width: 100%; height: 100%; background: linear-gradient(160deg, #F7F3EA, #E9E3D6); box-shadow: inset 0 0 0 2px rgba(0,0,0,.08), inset 0 10px 18px -8px rgba(0,0,0,.35); }
.pp__win { position: absolute; display: grid; place-items: center; overflow: hidden; background-color: #fff; box-shadow: inset 0 0 0 7px #FCFBF7, inset 5px 6px 14px rgba(0,0,0,.22); }
.pp__win.is-fit { left: 82px; top: 62px; width: 300px; height: 300px; }
.pp__win.is-cut { left: 512px; top: 112px; width: 216px; height: 216px; outline: 5px dashed #E5484D; outline-offset: -6px; }
.pp__big { position: absolute; left: -66px; top: -74px; line-height: 0; }
.pp__ghost { position: absolute; left: 446px; top: 38px; line-height: 0; opacity: .16; }
.pp__red { background: #E5484D; color: #fff; }
`,
}
