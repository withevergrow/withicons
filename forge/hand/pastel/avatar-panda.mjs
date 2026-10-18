// forge/hand/pastel/avatar-panda.mjs — the pastel panda avatar: a white face between two round plum ears, tilted plum eye
// patches with white eye glints and an ink nose, the face held by a deeper lavender rim; the generated drawing turned the
// panda pink with yellow goggles, so the white-face-dark-patches read was lost and it looked like a pink bear.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { swatch, paintEntries } from '../../styles/_pastel-paint.mjs'

export default function render(icon) {
  const { circle, ellipse, rot, path } = Prim
  const patchL = rot(ellipse(9, 13, 2.2, 2.85), 32, 9, 13)
  const patchR = rot(ellipse(15, 13, 2.2, 2.85), -32, 15, 13)
  const E = entriesOf([
    ['lavender@K', circle(6.25, 7, 2.75), circle(17.75, 7, 2.75)],
    ['paper@K', ellipse(12, 13.75, 7.75, 7)],
    ['lavender.flat@K', patchL, patchR],
    ['paper.flat@K', circle(9.4, 12.5, 0.85), circle(14.6, 12.5, 0.85)],
    ['ink@K', path('M10.4 16.35 C10.4 15.95 10.9 15.9 12 15.9 C13.1 15.9 13.6 15.95 13.6 16.35 C13.6 17.07 12.6 17.85 12 17.85 C11.4 17.85 10.4 17.07 10.4 16.35 Z')],
  ], icon)
  // the eye glints are bare white dots (a rim would ring them like goggles)
  for (const e of E) if (e.mode !== 'ink') e.rim = e.hue === 'paper' && e.mode === 'flat' ? 0 : 0.8
  return paintEntries(E, {
    hues: {
      // the panda's "black": a deeper plum lavender, still pastel, dark enough to hold against the white face
      lavender: { ...swatch('#A996EA', '#7F69D2', '#4F3D9C'), rim: '#8B75DA' },
      paper: { ...swatch('#FFFFFF', '#BFB0EE', '#5B47AE'), rim: '#B3A2EA' },
    },
    glint: true,
  })
}
