// forge/hand/liquid/jalebi.mjs: a jalebi as one thick glass coil, two and a quarter loose turns of syrupy tube with a clear gap between turns,
// so the spiral stays readable (the generated drawing packed the turns until they melted into a faint disc). The tube is coloured glass
// with a small clear glass bead at its centre where the batter starts. Same glass model and light as the generator (_liquid-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = n => Math.round(n * 100) / 100
// an Archimedean spiral from the centre outwards: r grows by PITCH every turn
const CX = 12, CY = 12.2, R0 = 1.1, PITCH = 3.9, TURNS = 2.1, START = -2.2
function coil() {
  const pts = []
  const n = Math.round(TURNS * 36)
  for (let i = 0; i <= n; i++) {
    const t = i / n * TURNS * 2 * Math.PI
    const r = R0 + PITCH * t / (2 * Math.PI)
    pts.push([CX + r * Math.cos(t + START), CY + r * Math.sin(t + START)])
  }
  return 'M' + pts.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L')
}

export default function render(icon) {
  const name = (icon && icon.name) || 'jalebi'
  const lines = parsePath(coil()).map(s => ({ pts: s.pts, closed: false, plate: 'A', pathId: 'p' }))
  return build({ name, paths: [], cutouts: [], fills: [], lines })
}
