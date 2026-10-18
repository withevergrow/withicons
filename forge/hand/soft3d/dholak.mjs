// forge/hand/soft3d/dholak.mjs — a horizontal barrel drum: a red lacquered shell that swells in the middle and closes
// round on the right, the cream drum head open on the left with a gold rim and a dark centre patch, and the slim gold
// zigzag lacing crossing the shell as an X, as in line. The generated drum was a tilted body with fat crossing sticks;
// here the drum lies level and the lacing is a thin rope.
// Same studio recipe as the other soft3d objects: contact shadow, shaded wall to the lower right, lit rim upper left.
// Roles: shell c1, lacing + rim c2, drum head c3. Motion: shell wm-k, lacing wm-a (it pulses), head wm-k, shadow wm-shadow.
const N = 'dholak'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#D9453B'), c2: v('c2', '#F2B93B'), c3: v('c3', '#F5E6C8'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))
const wall = (d, dx, dy, n = 4) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)

// the shell: swells a little in the middle, round closed end on the right
const SHELL = 'M5 6.6C8.5 5.4 14 5.4 17.2 6.4C20.6 9 20.6 15 17.2 17.6C14 18.6 8.5 18.6 5 17.4Z'
const HEAD = ell(5, 12, 2.7, 5.5)

export default function render() {
  const W = wall(SHELL, 0.8, 0.65), WH = wall(HEAD, 0.6, 0.5, 3)
  const ZIG1 = 'M9 7.6L13.4 16.6L17.6 7.9', ZIG2 = 'M9 16.6L13.4 7.6L17.6 16.3'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.2)]],
      // the barrel's roundness: lit along the top, turning into shade underneath
      ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, C.shine, 0.5), stop(0.3, C.shine, 0), stop(0.6, C.shadow, 0), stop(1, C.shadow, 0.32)]],
      ['radialGradient', { id: id(2), cx: 0.36, cy: 0.3, r: 0.78 }, [stop(0, C.shine, 0.5), stop(0.5, C.shine, 0), stop(0.8, C.shadow, 0.05), stop(1, C.shadow, 0.18)]],
    ]],
    P(ell(12.2, 21.2, 9.4, 1.4), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P(ell(12.2, 21.2, 7.5, 1.1), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P(ell(12.2, 21.2, 5.4, 0.8), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the shell with its wall
    P(W, { fill: C.c1 }, 'wm-k'), P(W, { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-k'),
    P(SHELL, { fill: C.c1 }, 'wm-k'), P(SHELL, { fill: url(1) }, 'wm-k'),
    S('M8 6.7C11 6.1 14.4 6.2 16.6 6.9', C.shine, 0.7, { 'stroke-opacity': 0.85 }, 'wm-shine'),
    // the zigzag lacing: a shaded underside, the gold rope, a lit edge
    S(mv(ZIG1, 0.35, 0.3) + mv(ZIG2, 0.35, 0.3), C.shadow, 1.1, { 'stroke-opacity': 0.3 }, 'wm-a'),
    S(ZIG1 + ZIG2, C.c2, 1.1, {}, 'wm-a'),
    S(mv(ZIG1, -0.15, -0.2) + mv(ZIG2, -0.15, -0.2), C.shine, 0.3, { 'stroke-opacity': 0.55 }, 'wm-a'),
    // the open drum head on the left: gold rim, cream skin, dark centre patch
    P(WH, { fill: C.c2 }, 'wm-k'), P(WH, { fill: C.shadow, 'fill-opacity': 0.34 }, 'wm-k'),
    P(HEAD, { fill: C.c2 }, 'wm-k'), P(HEAD, { fill: url(2) }, 'wm-k'),
    P(ell(5, 12, 2, 4.7), { fill: C.c3 }, 'wm-k'), P(ell(5, 12, 2, 4.7), { fill: url(2) }, 'wm-k'),
    P(ell(5, 12, 2, 4.7), { fill: C.shadow, 'fill-opacity': 0.1 }, 'wm-k'),
    P(ell(5.1, 12, 0.95, 2.4), { fill: C.shadow, 'fill-opacity': 0.55 }, 'wm-k'),
    S('M3.4 9.2C3.5 8.3 4 7.6 4.7 7.4', C.shine, 0.45, { 'stroke-opacity': 0.9 }, 'wm-shine'),
  ]
}
