// forge/hand/liquid/black-cat.mjs: the arched black cat (pointed ears, slit-pupil eyes, curled tail) in glossy navy liquid glass.
// Motion: body wm-k, tail and face features wm-a.
const r2 = (n) => Math.round(n * 100) / 100;
const V = (role, hex) => `var(--with-liquid-${role}, ${hex})`;
const COL = { c1: '#4A9DFF', c2: '#A77BFF', c3: '#1C3F9E', c4: '#FF7EC1', accent: '#FF5F8F', shine: '#FFFFFF', shadow: '#0C1A3A', edge: '#B9E6FF' };
const DARK = V('c3', COL.c3);
function lin(id, x1, y1, x2, y2, stops) {
  return ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' },
    stops.map(([o, role, op]) => ['stop', op === 1 ? { offset: o, 'stop-color': V(role, COL[role]) } : { offset: o, 'stop-color': V(role, COL[role]), 'stop-opacity': op }])];
}
// shift an absolute path string (M L C Q A H V Z) by dx, dy
function shift(d, dx, dy) {
  const out = [];
  for (const m of d.matchAll(/([MLCQAHVZ])([^MLCQAHVZ]*)/g)) {
    const c = m[1], n = (m[2].match(/-?\d*\.?\d+/g) || []).map(Number);
    if (c === 'Z') { out.push('Z'); continue; }
    if (c === 'H') { out.push('H' + r2(n[0] + dx)); continue; }
    if (c === 'V') { out.push('V' + r2(n[0] + dy)); continue; }
    if (c === 'A') { out.push('A' + [n[0], n[1], n[2], n[3], n[4], r2(n[5] + dx), r2(n[6] + dy)].join(' ')); continue; }
    out.push(c + n.map((v, i) => r2(v + (i % 2 ? dy : dx))).join(' '));
  }
  return out.join('');
}
// parts: { d | shape(dx,dy), fill: k|a|h|s|d, cls, noShadow, noShine, shine: [[tag, attrs]] }
function liquid(icon, parts) {
  const P = `wg-liquid-${icon}-`;
  const defs = ['defs', {}, [
    lin(P + 0, 2, 2, 22, 22, [[0, 'c1', 0.2], [0.6, 'c1', 0.45], [1, 'c1', 0.72]]),
    lin(P + 1, 2, 2, 22, 22, [[0, 'c2', 0.35], [1, 'c2', 0.8]]),
    lin(P + 2, 2, 2, 22, 22, [[0, 'c3', 0.45], [1, 'c3', 1]]),
    lin(P + 3, 2, 2, 22, 22, [[0, 'accent', 0.8], [1, 'accent', 1]]),
    ['radialGradient', { id: P + 4, cx: 8.5, cy: 7.5, r: 10, gradientUnits: 'userSpaceOnUse' },
      [['stop', { offset: 0, 'stop-color': V('shine', COL.shine), 'stop-opacity': 0.75 }], ['stop', { offset: 1, 'stop-color': V('shine', COL.shine), 'stop-opacity': 0 }]]],
    lin(P + 5, 2, 8, 10, 23, [[0, 'shadow', 0.1], [1, 'c4', 0.34]]),
    lin(P + 6, 2, 2, 22, 22, [[0, 'c3', 0.3], [1, 'c3', 0.6]]),
    lin(P + 7, 2, 2, 22, 22, [[0, 'c2', 0.8], [1, 'c3', 0.95]]),
  ]];
  const fills = { k: `url(#${P}0)`, a: `url(#${P}1)`, s: `url(#${P}3)`, d: `url(#${P}6)`, h: `url(#${P}7)`, n: `url(#${P}2)`, dark: DARK };
  const out = [defs];
  const shapeOf = (p, dx, dy) => p.d ? ['path', { d: shift(p.d, dx, dy) }] : p.shape(dx, dy);
  for (const p of parts) if (!p.noShadow && !p.raw) { const s = shapeOf(p, 0.7, 0.9); out.push([s[0], { ...s[1], fill: `url(#${P}5)`, class: 'wm-shadow' }]); }
  for (const p of parts) {
    if (p.raw) { out.push(...p.raw); continue; }
    const cls = p.cls || 'wm-k';
    const fill = fills[p.fill || 'k'];
    const sh = shapeOf(p, 0, 0), a = { ...sh[1] };
    if (p.fill === 'dark') { out.push([sh[0], { ...a, fill, class: cls }]); continue; }
    out.push([sh[0], { ...a, fill, stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-width': 0.24, class: cls }]);
    out.push([sh[0], { ...a, fill: 'none', stroke: p.fill === 's' ? V('accent', COL.accent) : `url(#${P}2)`, 'stroke-width': 0.5, 'stroke-linejoin': 'round', 'stroke-opacity': 0.8, class: cls }]);
    if (!p.noShine) out.push([sh[0], { ...a, fill: `url(#${P}4)`, class: cls }]);
    for (const h of (p.shine || [])) out.push([h[0], { ...h[1], fill: V('edge', COL.edge), 'fill-opacity': 0.85, class: 'wm-shine' }]);
  }
  return out.map(fix);
}
function fix(n) {
  const [t, a, c] = n; const b = {};
  for (const k in a) b[k] = typeof a[k] === 'number' ? r2(a[k]) : a[k];
  return c ? [t, b, c.map(fix)] : [t, b];
}
const E = (cx, cy, rx, ry) => ['ellipse', { cx, cy, rx, ry }];
const C = (cx, cy, r) => ['circle', { cx, cy, r }];
const stroke = (d, w = 0.7, col = DARK, cls = 'wm-a') => ['path', { d, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }];
const dot = (cx, cy, rx, ry) => ['ellipse', { cx, cy, rx, ry, fill: DARK, class: 'wm-a' }];
const CAT = 'M6 21.5 C6 18 5.5 15 6 12.5 C7 9 9 6.5 11.5 6.5 C13 6.5 14 7.25 14.75 8 C14.75 6.5 15 5.25 15.5 3.75 L17.25 5.75 H18.75 L20.5 3.75 C21 5.25 21.25 6.5 21.25 8.5 C21.25 10.75 20 12.25 18 12.5 C17.5 12.75 17.25 13.25 17.25 14 L17.5 21.5 H15.25 L15 16.5 C13.5 14.5 10 14.5 8.25 16.5 L8 21.5 Z';
const TAIL = 'M6 13.5 C3.25 12.5 2.5 9 3.5 6.5 C4 5.25 3.75 4 2.5 3.5';
const NAVY = 'n';
const eye = (cx) => ['ellipse', { cx, cy: 9, rx: 1.2, ry: 1.75, fill: V('edge', COL.edge), stroke: V('accent', COL.accent), 'stroke-width': 0.3, class: 'wm-a' }];
const inner = (d) => ['path', { d, fill: V('c4', COL.c4), 'fill-opacity': 0.75, class: 'wm-a' }];
const tube = (w, col, op, extra = {}) => ['path', { d: TAIL, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-opacity': op, class: 'wm-a', ...extra }];
export default function render() {
  const base = liquid('black-cat', [
    { d: CAT, fill: 'n', shine: [E(8.1, 10.8, 0.6, 2.1), E(16.7, 5.2, 0.6, 0.35)] },
    { raw: [
      inner('M15.75 5.4 L16.7 6.3 L15.45 7 Z'), inner('M20.25 5.4 L19.3 6.3 L20.55 7 Z'),
      eye(16.5), eye(19.5),
      ['path', { d: 'M16.5 7.7 V10.3', fill: 'none', stroke: DARK, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-a' }],
      ['path', { d: 'M19.5 7.7 V10.3', fill: 'none', stroke: DARK, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-a' }],
    ] },
  ]);
  const P = 'wg-liquid-black-cat-';
  // the tail: a glossy navy tube drawn behind the body
  const tail = [
    ['path', { d: shift(TAIL, 0.7, 0.9), fill: 'none', stroke: `url(#${P}5)`, 'stroke-width': 2, 'stroke-linecap': 'round', class: 'wm-shadow' }],
    tube(2.3, 'currentColor', 0.35),
    tube(1.9, `url(#${P}2)`, 1),
    tube(0.45, V('edge', COL.edge), 0.8),
  ];
  const at = base.findIndex((n, i) => i > 0 && n[1].class !== 'wm-shadow');
  return [...base.slice(0, at), ...tail.map(fix), ...base.slice(at)];
}
