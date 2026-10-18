// forge/hand/liquid/champagne-toast.mjs: two champagne flutes tilted inward and clinking, rose wine with bubbles, spark ticks above, in liquid glass.
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
    lin(P + 2, 2, 2, 22, 22, [[0, 'c2', 0.85], [1, 'c2', 1]]),
    lin(P + 3, 2, 2, 22, 22, [[0, 'accent', 0.8], [1, 'accent', 1]]),
    ['radialGradient', { id: P + 4, cx: 8.5, cy: 7.5, r: 10, gradientUnits: 'userSpaceOnUse' },
      [['stop', { offset: 0, 'stop-color': V('shine', COL.shine), 'stop-opacity': 0.75 }], ['stop', { offset: 1, 'stop-color': V('shine', COL.shine), 'stop-opacity': 0 }]]],
    lin(P + 5, 2, 8, 10, 23, [[0, 'shadow', 0.1], [1, 'c4', 0.34]]),
    lin(P + 6, 2, 2, 22, 22, [[0, 'c3', 0.3], [1, 'c3', 0.6]]),
  ]];
  const fills = { dark: V('c2', COL.c2), bub: V('edge', COL.edge), k: `url(#${P}0)`, a: `url(#${P}1)`, s: `url(#${P}3)`, d: `url(#${P}6)` };
  const out = [defs];
  for (const p of parts) if (!p.noShadow && !p.raw) for (const sh of p.shapes(0.7, 0.9)) out.push([sh[0], { ...sh[1], fill: `url(#${P}5)`, class: 'wm-shadow' }]);
  for (const p of parts) {
    if (p.raw) { out.push(...p.raw); continue; }
    const cls = p.cls || 'wm-k';
    const fill = fills[p.fill || 'k'];
    for (const sh of p.shapes(0, 0)) {
      const a = { ...sh[1] };
      if (p.fill === 'dark' || p.fill === 'bub') { out.push([sh[0], { ...a, fill, class: cls }]); continue; }
      out.push([sh[0], { ...a, fill, stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-width': 0.24, class: cls }]);
      out.push([sh[0], { ...a, fill: 'none', stroke: p.fill === 's' ? V('accent', COL.accent) : `url(#${P}2)`, 'stroke-width': 0.6, 'stroke-linejoin': 'round', 'stroke-opacity': 0.95, class: cls }]);
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
const DARK = V('c2', COL.c2);
const stroke = (d, w = 0.6, extra = {}) => ['path', { d, fill: 'none', stroke: DARK, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a', ...extra }];
const BODY = { shapes: (dx, dy) => [Pth([['M', 4, 21.6], ['C', 4, 17.4, 7.4, 15.4, 12, 15.4], ['C', 16.6, 15.4, 20, 17.4, 20, 21.6], ['Z']])(dx, dy)], shine: () => [E(8, 17.4, 1.6, 0.5)(0, 0)] };
const HEAD = { shapes: (dx, dy) => [C(12, 9.6, 5)(dx, dy)], shine: () => [E(9.6, 8.6, 0.6, 1.1)(0, 0)] };
const eyes = (y = 10.3, r = 0.8) => ({ fill: 'dark', noShadow: true, cls: 'wm-a', shapes: (dx, dy) => [C(10, y, r)(dx, dy), C(14, y, r)(dx, dy)] });
const smile = (y = 12.4) => ({ fill: 'dark', noShadow: true, cls: 'wm-a', shapes: (dx, dy) => [Pth([['M', 9.9, y], ['Q', 12, y + 2.1, 14.1, y], ['Q', 12, y + 1.1, 9.9, y], ['Z']])(dx, dy)] });
const WINE = (d) => ({ fill: 's', noShadow: true, noShine: true, shapes: (dx, dy) => [Pth(d)(dx, dy)] });
export default function render() {
  return liquid('champagne-toast', [
    { shapes: (dx, dy) => [Pth([['M', 6.75, 7.5], ['L', 12, 9.5], ['C', 11, 12.75, 8.25, 15.25, 6.25, 16.5], ['C', 5.5, 14.25, 5.25, 10.75, 6.75, 7.5], ['Z']])(dx, dy)], shine: () => [E(6.9, 10.2, 0.45, 1.3)(0, 0)] },
    { shapes: (dx, dy) => [Pth([['M', 17.25, 7.5], ['L', 12, 9.5], ['C', 13, 12.75, 15.75, 15.25, 17.75, 16.5], ['C', 18.5, 14.25, 18.75, 10.75, 17.25, 7.5], ['Z']])(dx, dy)], shine: () => [] },
    WINE([['M', 5.75, 12], ['L', 10.75, 12], ['C', 9.5, 14, 7.75, 15.5, 6.25, 16.5], ['C', 5.75, 15.25, 5.5, 13.75, 5.75, 12], ['Z']]),
    WINE([['M', 18.25, 12], ['L', 13.25, 12], ['C', 14.5, 14, 16.25, 15.5, 17.75, 16.5], ['C', 18.25, 15.25, 18.5, 13.75, 18.25, 12], ['Z']]),
    { fill: 'bub', noShadow: true, cls: 'wm-a', shapes: (dx, dy) => [C(7.5, 13.8, 0.55)(dx, dy), C(16.5, 13.8, 0.55)(dx, dy), C(9, 12.9, 0.35)(dx, dy), C(15, 12.9, 0.35)(dx, dy)] },
    { raw: [stroke('M6.25 16.5L5 20M3.2 20.3L6.8 20.9', 0.9), stroke('M17.75 16.5L19 20M20.8 20.3L17.2 20.9', 0.9)] },
    { raw: [stroke('M12 2V4.5M6.6 2.6L8 4.6M17.4 2.6L16 4.6', 0.95, { stroke: V('accent', COL.accent), class: 'wm-deco' })] },
  ]);
}
