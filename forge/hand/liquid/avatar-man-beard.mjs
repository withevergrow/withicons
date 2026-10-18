// forge/hand/liquid/avatar-man-beard.mjs: a bearded man (hair sweep, eyes, full beard, shoulders) in liquid glass.
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
const BODY = 'M4.5 22 C4.5 19.4 6.25 18.2 8.5 18.2 C9.75 18.2 10.75 18.85 12 18.85 C13.25 18.85 14.25 18.2 15.5 18.2 C17.75 18.2 19.5 19.4 19.5 22 Z';
const FACE = 'M17.5 10.5 A5.5 6 0 1 1 6.5 10.5 A5.5 6 0 1 1 17.5 10.5 Z';
const HAIR = 'M6.5 10.5 C6 6 8.5 3 12 3 C15.5 3 18 6 17.5 10.5 C17.25 9.5 16.75 8.75 16 8.25 C14 8.75 11.25 8.5 9.5 7.25 C8.5 8 7 9.25 6.5 10.5 Z';
const BEARD = 'M6.75 12 A5.5 6 0 0 0 17.25 12 C16.5 13.5 15.5 14 14 14 C13.25 14 12.5 13.75 12 13.5 C11.5 13.75 10.75 14 10 14 C8.5 14 7.5 13.5 6.75 12 Z';
export default function render() {
  return liquid('avatar-man-beard', [
    { d: BODY, shine: [E(8, 20.3, 1.4, 0.4)] },
    { d: FACE, shine: [E(8.5, 9.6, 0.5, 1.1)] },
    { d: HAIR, fill: 'h', shine: [E(10, 4.6, 1.5, 0.42)] },
    { d: BEARD, fill: 'n', noShadow: true, noShine: true },
    { raw: [dot(9.5, 10.75, 0.8, 1.05), dot(14.5, 10.75, 0.8, 1.05), stroke('M10.75 15.5 C11.5 16 12.5 16 13.25 15.5', 0.7, V('edge', COL.edge)),
      ['ellipse', { cx: 9.4, cy: 15.4, rx: 0.5, ry: 1.3, fill: V('shine', COL.shine), 'fill-opacity': 0.4, class: 'wm-shine' }]] },
  ]);
}
