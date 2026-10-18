// forge/hand/liquid/avatar-boy.mjs: a boy with spiky tuft hair, round face, eyes, smile and shoulders in liquid glass.
// Motion: shoulders and face wm-k, hair and features wm-a.
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
const BODY = 'M4.8 22 C4.8 19.6 7 18.5 9.6 18.5 C10.8 18.5 11.2 19.1 12 19.1 C12.8 19.1 13.2 18.5 14.4 18.5 C17 18.5 19.2 19.6 19.2 22 Z';
const FACE = 'M18.25 11 A6.25 6.25 0 1 1 5.75 11 A6.25 6.25 0 1 1 18.25 11 Z';
const HAIR = 'M5.75 11 C5 8.5 5.5 5.5 8.5 4.25 C8.75 3 9.75 2.25 11 2 C10.75 2.75 11 3.25 11.75 3.5 C12.75 2.5 14.5 2 16.5 2.25 C15.75 2.75 15.5 3.5 15.75 4.25 C17.75 5.25 19 8.25 18.25 11 C17.75 9.25 16.75 8 15.25 7.5 L13.75 8 C12.75 7 10.5 6.75 9 7.5 C7.5 8.25 6.25 9.25 5.75 11 Z';
export default function render() {
  return liquid('avatar-boy', [
    { d: BODY, shine: [E(8.4, 20, 1.5, 0.4)] },
    { d: FACE, shine: [E(8.6, 12.4, 0.55, 1.2)] },
    { d: HAIR, fill: 'h', shine: [E(8.6, 5.6, 1.5, 0.45)] },
    { raw: [dot(9.5, 12.25, 0.8, 1.05), dot(14.5, 12.25, 0.8, 1.05), stroke('M10 14.5 C11 15.5 13 15.5 14 14.5', 0.7)] },
  ]);
}
