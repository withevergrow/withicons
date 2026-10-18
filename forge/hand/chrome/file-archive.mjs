// chrome file-archive: the sibling file page with a bold recessed zipper column of four alternating chrome teeth and a large pull tab.
const V = (r, h) => `var(--with-chrome-${r}, ${h})`;
const SH = V('shadow', '#1A1E2A'), INK = V('ink', '#10131B'), SHINE = V('shine', '#FFFFFF');
const f = (n) => Math.round(n * 100) / 100;
const st = (o, r, h) => ['stop', { offset: String(o), 'stop-color': V(r, h) }];
const lin = (id, stops) => ['linearGradient', { id, x1: '0', y1: '0', x2: '0', y2: '1' }, stops];
function grads(name) {
  const g = (n) => `wg-chrome-${name}-${n}`;
  return ['defs', {}, [
    lin(g(0), [st(0, 'edge', '#F4F7FC'), st(0.42, 'tint', '#DCE5F2'), st(0.56, 'c1', '#8794AA'), st(0.78, 'c4', '#CDB9A4'), st(1, 'edge', '#F4F7FC')]),
    lin(g(1), [st(0, 'shine', '#FFFFFF'), st(0.24, 'tint', '#DCE5F2'), st(0.5, 'c1', '#8794AA'), st(1, 'c4', '#CDB9A4')]),
    lin(g(2), [st(0, 'c3', '#3E4556'), st(0.5, 'c4', '#CDB9A4'), st(1, 'shine', '#FFFFFF')]),
    lin(g(3), [st(0, 'shine', '#FFFFFF'), st(0.38, 'accent', '#FF3E9E'), st(1, 'accent', '#FF3E9E')]),
  ]];
}
// chrome rounded rect: dark rim, mirror body, inner sky, ground below an ink horizon, top glint
function rr(name, x, y, w, h, r, cls, hz = 0.56) {
  const u = (n) => `url(#wg-chrome-${name}-${n})`, c = cls ? { class: cls } : {};
  const R = (X, Y, W, H, Rr, fill) => ['rect', { x: f(X), y: f(Y), width: f(W), height: f(H), rx: f(Math.max(Rr, 0)), fill, ...c }];
  const yh = y + h * hz, ir = Math.max(r - 0.35, 0.2), gh = y + h - 0.35 - yh, k = Math.min(ir, 0.6);
  return [
    R(x - 0.45, y - 0.45, w + 0.9, h + 0.9, r + 0.45, SH),
    R(x, y, w, h, r, u(0)),
    R(x + 0.35, y + 0.35, w - 0.7, h - 0.7, ir, u(1)),
    R(x + 0.35, yh, w - 0.7, gh, Math.min(ir, gh / 2), u(2)),
    R(x + 0.35 + k, yh - 0.2, w - 0.7 - 2 * k, 0.4, 0.2, INK),
    ['rect', { x: f(x + Math.max(r * 0.6, 0.6)), y: f(y + 0.55), width: f(Math.max(w * 0.42, 0.5)), height: 0.5, rx: 0.25, fill: SHINE, 'fill-opacity': '0.85', class: 'wm-shine' }],
  ];
}

export default function render() {
  const N = 'file-archive';
  const teeth = [];
  [[3.2, 0], [4.9, 1], [6.6, 0], [8.3, 1]].forEach(([y, s]) => {
    const x = s ? 10.1 : 8.3;
    teeth.push(['rect', { x: f(x - 0.4), y: f(y - 0.4), width: 2.4, height: 1.9, rx: 0.5, fill: SH, class: 'wm-k' }]);
    teeth.push(['rect', { x: f(x), y: f(y), width: 1.6, height: 1.1, rx: 0.3, fill: 'url(#wg-chrome-file-archive-1)', class: 'wm-k' }]);
  });
  return [
    grads(N),
    ...[["path",{"d":"M13 2.6c-.1 1-.2 3.5.2 4.4 .1-1.1-.3-3.5.2-4.4h-.4zM14.3 6.7c0 .3.1 1 .6 1l4.2.1 .2-.1c-.2-.3-.4-.6-.7-.8h-3.7c-.2 0-.4-.1-.6-.2zM19.3 8.8l-.1.2v9.2c0 1.4-1.3 2.9-2.7 2.9h-9.2c-1.2 0-2.1-.8-2.7-1.8 .1 1.5 1.5 2.6 3 2.6h9.1c1.5 0 2.8-1.5 2.8-2.9v-10c-.1 0-.2-.1-.2-.2z","fill":"var(--with-chrome-shadow, #1A1E2A)","fill-opacity":"0.2","class":"wm-shadow"}],["path",{"d":"M4.37 5.1l.01 13.1c0 1.44 1.36 2.87 2.82 2.87h9.2c1.68 0 2.83-1.62 2.83-3.17v-9.4c.01-.66-.99-.44-1.43-.44-.8 0-2.75.13-3.43-.07-.31-.09-.6-.25-.83-.48-.22-.23-.39-.51-.47-.81-.21-.75-.09-2.54-.09-3.4 0-.46.22-1.48-.48-1.48h-5.2c-1.81.01-2.94 1.6-2.93 3.28zM14.2 2.55l-.06.35v3.3c0 .47.45.71.86.71h3.2c.36 0 .58-.4.31-.67l-3.75-3.75c-.26-.26-.35-.07-.56.06z","fill":"var(--with-chrome-shadow, #1A1E2A)","class":"wm-k"}],["path",{"d":"M4.57 5.1l.01 13.1c0 1.4 1.33 2.68 2.72 2.68l9.1-.01c1.26 0 2.33-1.1 2.57-2.27 .11-.49.06-1.01.06-1.5v-6.4c0-.78.04-1.59-.03-2.36-.81-.2-2.3-.08-3.2-.08-1.23 0-2.43-.04-2.9-1.41-.25-.74-.12-2.86-.12-3.75l-.01-.9-.09-.14-.18-.04h-5.1c-1.76 0-2.84 1.42-2.83 3.08zM14.5 2.58l-.11.05-.05.27v3.3c.01.36.36.51.66.51h3.1c.13 0 .17-.04.28-.07l.04-.14-.05-.12-3.7-3.7-.17-.1z","fill":"url(#wg-chrome-file-archive-0)","class":"wm-k"}],["path",{"d":"M7.3 20.58l9-.01c1.2 0 2.27-1.02 2.41-2.19 .13-1.15.02-2.42.02-3.58v-6.18c-.99-.16-2.11-.06-3.13-.06-.44 0-.89.03-1.31-.07-.97-.25-1.67-1.08-1.79-2.06l-.02-3.93c0-.06-.07-.1-.08-.16l-3.4-.02c-.73 0-1.53-.09-2.24.08-.35.09-.65.26-.94.47-.95.71-.96 1.86-.95 2.93v10.6c0 .7-.11 1.51.06 2.2 .27 1.07 1.22 1.98 2.37 1.98zM14.7 3.17l-.06.13v2.7c0 .14.05.22.08.33l.12.07 3.08-.01c-.46-.54-1-1.04-1.51-1.55l-1.71-1.67z","fill":"url(#wg-chrome-file-archive-1)","class":"wm-k"}],["path",{"d":"M4.92 11.48c-.11.7-.05 1.49-.05 2.22v3c.01.67-.1 1.44.11 2.08 .31.92 1.19 1.78 2.22 1.78l9.3-.01c1.25 0 2.23-1.39 2.23-2.55v-5.2l-.03-.2c-.39.33-.89.48-1.4.52l-.9.07c-.72.05-3.47.09-3.88-.57l-.14-1.14h-7.46z","fill":"url(#wg-chrome-file-archive-2)","class":"wm-k"}],["path",{"d":"M4.92 10.99c-.01.07-.05.12-.05.21v1.1c0 .09.04.14.05.21l.63.09 1.35.06 5.48.01c.05.24.03.77.13.97 .23.44 1.75.51 2.19.51h1.7c.54 0 2.05-.12 2.31-.69 .11-.26.02-.98-.01-1.27-.93.72-3.43.63-4.59.52-.45-.05-1.17-.1-1.51-.46-.25-.27-.17-.89-.19-1.24-.09-.07.04-.09-.11-.09l-5.6.01-1.78.06z","fill":"var(--with-chrome-ink, #10131B)","class":"wm-k"}],["path",{"d":"M5.3 19.43c-.04-.28-.12-.62-.12-.93l-.01-13c-.01-1.4.89-2.77 2.43-2.78h4.7l.15-.04c0-.09.01-.19.01-.28-.12-.06 0-.08-.16-.08h-5c-1.19.01-2.28 1.03-2.41 2.2-.12 1.14-.02 2.33-.02 3.48v7l.01 2.3c0 .4-.04.82.03 1.21 .07.34.21.63.39.92zM14.7 3.17l-.06.13v2.8l.04.18c.06.04.14.09.21.13l.05-.21v-2.5l.08-.2-.32-.33zM13.4 8.07c0 .03 0 .06-.01.09 .33.32.67.57 1.11.7 .71.21 3.34.13 4.18.08 .02-.09.03-.22.05-.32l-.05-.05-2.78-.01c-.53 0-1.09.06-1.61-.07-.32-.09-.6-.25-.89-.42z","fill":"var(--with-chrome-shine, #FFFFFF)","fill-opacity":"0.85","class":"wm-shine"}]],
    ['rect', { x: 9.5, y: 2.6, width: 1, height: 7.8, fill: SH, 'fill-opacity': '0.55', class: 'wm-k' }],
    ...teeth,
    ...rr(N, 7.8, 10.6, 4.4, 6.4, 1.3, 'wm-a', 0.6),
    ['rect', { x: 9.1, y: 13.3, width: 1.8, height: 2.3, rx: 0.6, fill: SH, class: 'wm-a' }],
  ];
}
