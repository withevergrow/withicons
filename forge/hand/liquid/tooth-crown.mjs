// forge/hand/liquid/tooth-crown.mjs — a dental crown lifted off its tooth: the crown cap, with two cusps and a crisp
// notch, is the coloured glass (wm-a, the part the motion floats) and the two-rooted tooth below it is clear glass, a
// slightly narrower stump so the cap visibly fits over it. The generator made the cap the pale clear piece (with a
// stray cut in it) and the root the coloured one, so on white the crown, the subject, faded out; giving the cap the
// colour, a notch the glass tube cannot round away and a clear gap keeps it a crisp, separate shape at 16px. Same
// model and paint as the generator (_liquid-core.mjs build); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'
import * as F from '../../styles/_liquid-field.mjs'

// the crown's exact silhouette (pre-frame units; the style scales it into its frame)
const CROWN = 'M4.1 9.3 C3.4 6.6 3.9 3.2 6.9 2.3 C9.1 1.65 11 3.1 12 5.6 C13 3.1 14.9 1.65 17.1 2.3 C20.1 3.2 20.6 6.6 19.9 9.3 C16 10.3 8 10.3 4.1 9.3 Z'
// the tooth's centre line: the glass tube grows it 1.3 all round (a stump a little narrower than the cap, two long roots)
const TOOTH = 'M6.75 13.6 C9.25 14.3 14.75 14.3 17.25 13.6 C17.15 15.6 16.85 17.6 16.35 19.6 C16.05 20.9 15.65 21.75 15 21.75 C14.35 21.75 14.1 21 13.9 20 C13.6 18.6 13 17.6 12 17.6 C11 17.6 10.4 18.6 10.1 20 C9.9 21 9.65 21.75 9 21.75 C8.35 21.75 7.95 20.9 7.65 19.6 C7.15 17.6 6.85 15.6 6.75 13.6 Z'

const rings = d => parsePath(d).map(s => s.pts)
// the crown's outline is inset by half the coloured tube's width, so the tube adds nothing to its silhouette and the
// notch between the cusps stays sharp
const inset = (d, e, plate) => F.trace(F.offset(F.region(rings(d), 2), e), 0.02, 0.2).map(pts => ({ pts, closed: true, plate }))

// the cap's coloured glass a step deeper than the generator's (as flame.mjs does), so the subject holds on white
function deepen(nodes) {
  const defs = nodes && nodes[0]
  if (defs && defs[0] === 'defs') for (const g of defs[2]) {
    if (g[1].id.endsWith('-1')) g[2] = g[2].map((st, i) => ['stop', { ...st[1], 'stop-opacity': [0.42, 0.85][i] }])
  }
  return nodes
}

export default function render(icon) {
  const tooth = parsePath(TOOTH)
  return deepen(build({
    name: (icon && icon.name) || 'tooth-crown', paths: [], cutouts: [],
    lines: [
      ...inset(CROWN, 1.15, 'A'),
      ...tooth.map(s => ({ pts: s.pts, closed: s.closed, plate: 'K', pathId: 'tooth' })),
    ],
    fills: [{ subs: parsePath(CROWN) }, { subs: tooth }],
  }))
}
