// shared helper text pasted into each hand file
const r2 = (n) => Math.round(n * 100) / 100;
const V = (role, hex) => `var(--with-liquid-${role}, ${hex})`;
const COL = { c1: '#4A9DFF', c2: '#A77BFF', c3: '#1C3F9E', c4: '#FF7EC1', accent: '#FF5F8F', shine: '#FFFFFF', shadow: '#0C1A3A', edge: '#B9E6FF' };
function lin(id, x1, y1, x2, y2, stops) {
  return ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' },
    stops.map(([o, role, op]) => ['stop', op === 1 ? { offset: o, 'stop-color': V(role, COL[role]) } : { offset: o, 'stop-color': V(role, COL[role]), 'stop-opacity': op }])];
}
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
  ]];
  const fills = { k: `url(#${P}0)`, a: `url(#${P}1)`, s: `url(#${P}3)`, d: `url(#${P}6)`, dark: V('c3', COL.c3) };
  const out = [defs];
  for (const p of parts) if (!p.noShadow) for (const sh of p.shapes(0.7, 0.9)) out.push([sh[0], { ...sh[1], fill: `url(#${P}5)`, class: 'wm-shadow' }]);
  for (const p of parts) {
    const cls = p.cls || 'wm-k';
    const fill = fills[p.fill || 'k'];
    for (const sh of p.shapes(0, 0)) {
      const a = { ...sh[1] };
      if (p.fill === 'dark') { out.push([sh[0], { ...a, fill, class: cls }]); continue; }
      out.push([sh[0], { ...a, fill, stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-width': 0.24, class: cls }]);
      out.push([sh[0], { ...a, fill: 'none', stroke: p.fill === 's' ? V('accent', COL.accent) : `url(#${P}2)`, 'stroke-width': 0.5, 'stroke-linejoin': 'round', 'stroke-opacity': 0.8, class: cls }]);
      if (!p.noShine) out.push([sh[0], { ...a, fill: `url(#${P}4)`, class: cls }]);
    }
    for (const h of (p.shine ? p.shine() : [])) out.push([h[0], { ...h[1], fill: V('edge', COL.edge), 'fill-opacity': 0.85, class: 'wm-shine' }]);
  }
  return out.map(fix);
}
function fix(n) {
  const [t, a, c] = n; const b = {};
  for (const k in a) b[k] = typeof a[k] === 'number' ? r2(a[k]) : a[k];
  return c ? [t, b, c.map(fix)] : [t, b];
}
const C = (cx, cy, r) => (dx, dy) => ['circle', { cx: cx + dx, cy: cy + dy, r }];
const E = (cx, cy, rx, ry) => (dx, dy) => ['ellipse', { cx: cx + dx, cy: cy + dy, rx, ry }];
const R = (x, y, w, h, rx) => (dx, dy) => ['rect', { x: x + dx, y: y + dy, width: w, height: h, rx }];
// path from absolute point commands: list of [cmd, ...nums] where nums are x,y pairs (arcs: A rx ry rot large sweep x y)
const Pth = (cmds, extra = {}) => (dx, dy) => ['path', { d: cmds.map(([c, ...n]) => c + (c === 'A' ? [n[0], n[1], n[2], n[3], n[4], r2(n[5] + dx), r2(n[6] + dy)] : n.map((v, i) => r2(v + (i % 2 ? dy : dx)))).join(' ')).join(''), ...extra }];
const segs = (x, w, ys) => (dx, dy) => ys.map(([a, b]) => R(x, a, w, b - a, 1.1)(dx, dy));
export default function render() {
  return liquid('bamboo', [
    { fill: 'a', shapes: (dx, dy) => [Pth([['M', 16.8, 9.4], ['C', 17.8, 6.8, 19.8, 5.6, 21.6, 5.6], ['C', 21.2, 7.8, 19.4, 9.6, 16.8, 9.4], ['Z']])(dx, dy), Pth([['M', 6.8, 13.4], ['C', 5.6, 11.2, 3.8, 10.4, 2.3, 10.6], ['C', 2.8, 12.6, 4.6, 13.8, 6.8, 13.4], ['Z']])(dx, dy)] },
    { shapes: segs(6.6, 3.6, [[2.6, 8.2], [9.1, 14.9], [15.8, 21.4]]), shine: () => [R(7.3, 3.4, 0.6, 4, 0.3)(0, 0), R(7.3, 9.9, 0.6, 4.2, 0.3)(0, 0), R(7.3, 16.6, 0.6, 4, 0.3)(0, 0)] },
    { shapes: segs(13.4, 3.6, [[5.6, 10.8], [11.7, 16.3], [17.2, 21.4]]), shine: () => [R(14.1, 6.4, 0.6, 3.6, 0.3)(0, 0), R(14.1, 12.5, 0.6, 3, 0.3)(0, 0), R(14.1, 18, 0.6, 2.6, 0.3)(0, 0)] },
    { fill: 'd', noShadow: true, cls: 'wm-deco', noShine: true, shapes: (dx, dy) => [R(6.2, 8.2, 4.4, 0.9, 0.45)(dx, dy), R(6.2, 14.9, 4.4, 0.9, 0.45)(dx, dy), R(13, 10.8, 4.4, 0.9, 0.45)(dx, dy), R(13, 16.3, 4.4, 0.9, 0.45)(dx, dy)] },
  ]);
}
