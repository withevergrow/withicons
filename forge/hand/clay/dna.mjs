// forge/hand/clay/dna.mjs — a teal clay double helix: two plump tube strands that twist over and under each other
// (crossing near the top and again lower down, the front strand switching at the waist), with four short orange rungs
// laid behind them where the strands are far apart. The generated helix flattened both strands into one stack of bare
// capsules and lost the twist. Same recipe as the generated clay (radial face tint -> body -> shade, a darker wall
// underneath, a crisp highlight along each tube, a soft ground shadow); the strands are drawn as lit tubes.
const V = (r, h) => `var(--with-clay-${r}, ${h})`
const r2 = n => Math.round(n * 100) / 100

// strand halves (cubic beziers), split at the widest point y 11.6 so the front strand can switch there
const X0 = 7, X1 = 17, YT = 3.3, YM = 11.6, YB = 19.9
const half = (xa, ya, xb, yb, k) => ({ p: [[xa, ya], [xa, ya + (yb - ya) * k], [xb, yb - (yb - ya) * (1 - k)], [xb, yb]] })
const S1a = half(X0, YT, X1, YM, 0.6), S2a = half(X1, YT, X0, YM, 0.6)
const S1b = half(X1, YM, X0, YB, 0.4), S2b = half(X0, YM, X1, YB, 0.4)
const at = (c, t) => {
  const [a, b, d, e] = c.p, u = 1 - t
  return [0, 1].map(i => u * u * u * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * d[i] + t * t * t * e[i])
}
// x of a strand half at a given y (bisection; y is monotone along each half)
const xAt = (c, y) => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (at(c, m)[1] < y) lo = m; else hi = m } return at(c, (lo + hi) / 2)[0] }
const pathOf = (c, dx = 0, dy = 0) => { const q = c.p.map(([x, y]) => [r2(x + dx), r2(y + dy)]); return `M${q[0].join(' ')}C${q[1].join(' ')} ${q[2].join(' ')} ${q[3].join(' ')}` }

export default function render() {
  const id = i => `wg-clay-dna-${i}`
  const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const SH = V('shadow', '#09474E')
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 12, cy: 21.5, r: 7, gradientUnits: 'userSpaceOnUse' }, [stop(0, SH, 0.3), stop(0.55, SH, 0.2), stop(1, SH, 0)]],
    ['radialGradient', { id: id(1), cx: 8.5, cy: 4.5, r: 19, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('tint', '#D0F7F0')), stop(0.4, V('c1', '#2CCDB6')), stop(1, SH)]],
    ['radialGradient', { id: id(2), cx: 8.5, cy: 8, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('c2', '#FFB257')), stop(0.6, V('c2', '#FFB257')), stop(1, V('c3', '#FF5C97'))]],
  ]]
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const out = [defs, ['ellipse', { cx: 12, cy: 21.5, rx: 6.6, ry: 1.2, fill: `url(#${id(0)})`, class: 'wm-shadow' }]]
  // rungs behind the strands: a front strand-to-strand span at each y (skeleton: between the two strands' x)
  for (const y of [5.2, 9.9, 13.3, 18.0]) {
    const top = y < YM, A = top ? S1a : S1b, B = top ? S2a : S2b
    const xa = xAt(A, y), xb = xAt(B, y)
    const x0 = Math.min(xa, xb) + 0.4, x1 = Math.max(xa, xb) - 0.4
    out.push(['path', { d: `M${r2(x0 + 0.12)} ${r2(y + 0.32)}H${r2(x1 + 0.12)}`, stroke: SH, 'stroke-opacity': 0.45, 'stroke-width': 1.5, ...round, class: 'wm-a' }])
    out.push(['path', { d: `M${r2(x0)} ${y}H${r2(x1)}`, stroke: `url(#${id(2)})`, 'stroke-width': 1.5, ...round, class: 'wm-a' }])
    out.push(['path', { d: `M${r2(x0 + 0.3)} ${r2(y - 0.3)}H${r2(x1 - 0.3)}`, stroke: V('shine', '#FFFFFF'), 'stroke-opacity': 0.55, 'stroke-width': 0.3, ...round, class: 'wm-shine' }])
  }
  // strands, back to front: the lower crossing has S1b in front, the upper has S2a in front
  for (const c of [S1a, S2b, S2a, S1b]) {
    out.push(['path', { d: pathOf(c, 0.1, 0.42), stroke: SH, 'stroke-opacity': 0.7, 'stroke-width': 2.4, ...round, class: 'wm-k' }])
    out.push(['path', { d: pathOf(c), stroke: `url(#${id(1)})`, 'stroke-width': 2.4, ...round, class: 'wm-k' }])
    out.push(['path', { d: pathOf(c, -0.35, -0.38), stroke: V('shine', '#FFFFFF'), 'stroke-opacity': 0.5, 'stroke-width': 0.5, ...round, class: 'wm-shine' }])
  }
  return out
}
