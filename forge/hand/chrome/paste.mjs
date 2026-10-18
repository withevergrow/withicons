// hand-drawn chrome override
const V = (r, h) => 'var(--with-chrome-' + r + ', ' + h + ')';
const C = { edge: V('edge', '#F4F7FC'), tint: V('tint', '#DCE5F2'), c1: V('c1', '#8794AA'), c2: V('c2', '#5E6A82'), c3: V('c3', '#3E4556'), c4: V('c4', '#CDB9A4'), shine: V('shine', '#FFFFFF'), shadow: V('shadow', '#1A1E2A'), ink: V('ink', '#10131B') };
const n = (v) => String(Math.round(v * 100) / 100);
const rr = (x, y, w, h, r) => 'M' + n(x + r) + ' ' + n(y) + 'H' + n(x + w - r) + 'A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(x + w) + ' ' + n(y + r) + 'V' + n(y + h - r) + 'A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(x + w - r) + ' ' + n(y + h) + 'H' + n(x + r) + 'A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(x) + ' ' + n(y + h - r) + 'V' + n(y + r) + 'A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(x + r) + ' ' + n(y) + 'Z';
const STOPS = {
  body: [[0, 'edge'], [0.42, 'tint'], [0.56, 'c1'], [0.78, 'c4'], [1, 'edge']],
  inner: [[0, 'shine'], [0.24, 'tint'], [0.5, 'c1'], [1, 'c4']],
  dark: [[0, 'tint'], [0.5, 'c2'], [1, 'c1']],
  light: [[0, 'shine'], [0.5, 'edge'], [0.62, 'tint'], [1, 'edge']],
};
function mk(icon) {
  const grads = [];
  const g = (kind, y1, y2) => {
    const id = 'wg-chrome-' + icon + '-' + grads.length;
    grads.push(['linearGradient', { id, x1: '0', y1: n(y1), x2: '0', y2: n(y2), gradientUnits: 'userSpaceOnUse' },
      STOPS[kind].map(([o, r]) => ['stop', { offset: String(o), 'stop-color': C[r] }])]);
    return 'url(#' + id + ')';
  };
  return { g, defs: () => ['defs', {}, grads] };
}
function part(m, out, cls, d, y1, y2, kind = 'body', innerKind = 'inner') {
  out.push(['path', { d: d(0.45, 0.6, 0), fill: C.shadow, 'fill-opacity': '0.2', class: 'wm-shadow' }]);
  out.push(['path', { d: d(0, 0, 0), fill: m.g(kind, y1, y2), stroke: C.shadow, 'stroke-width': '0.55', 'stroke-linejoin': 'round', class: cls }]);
  if (innerKind) out.push(['path', { d: d(0, 0, 0.55), fill: m.g(innerKind, y1, y2), class: cls }]);
}

export default function render() {
  const m = mk('paste'); const o = [];
  part(m, o, 'wm-k', (dx, dy, i) => rr(3.6 + dx + i, 4.2 + dy + i, 13.2 - 2 * i, 16.8 - 2 * i, 2 - i * 0.6), 4.2, 21, 'body', 'dark');
  part(m, o, 'wm-a', (dx, dy, i) => rr(7.2 + dx + i, 2.4 + dy + i, 6 - 2 * i, 3.6 - 2 * i, 1.1 - i / 2), 2.4, 6);
  o.push(['circle', { cx: '10.2', cy: '3.5', r: '0.5', fill: C.shadow, class: 'wm-a' }]);
  part(m, o, 'wm-s', (dx, dy, i) => rr(10.2 + dx + i, 9.6 + dy + i, 10.2 - 2 * i, 12 - 2 * i, 1.4 - i / 2), 9.6, 21.6, 'light', 'light');
  o.push(['rect', { x: '12.4', y: '13.2', width: '5.8', height: '1.2', rx: '0.6', fill: C.c2, class: 'wm-s' }]);
  o.push(['rect', { x: '12.4', y: '16.4', width: '4', height: '1.2', rx: '0.6', fill: C.c2, class: 'wm-s' }]);
  return [m.defs(), ...o];
}
