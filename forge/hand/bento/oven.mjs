// bento/oven: control strip (display + two knobs), window with heat waves, drawer, two feet.
const V = (r, h) => `var(--with-bento-${r}, ${h})`;
const SH = V('shadow', '#312E81'), C1 = V('c1', '#6366F1'), SN = V('shine', '#FFFFFF');
const TILE = 'M9.4 2H14.6C20.08 2 22 3.92 22 9.4V14.6C22 20.08 20.08 22 14.6 22H9.4C3.92 22 2 20.08 2 14.6V9.4C2 3.92 3.92 2 9.4 2Z';
const body = (dy) => { const t = 5.6 + dy, b = 17.4 + dy; return `M7.9 ${t}H16.1A1.3 1.3 0 0 1 17.4 ${(t + 1.3).toFixed(2)}V${(b - 1.3).toFixed(2)}A1.3 1.3 0 0 1 16.1 ${b.toFixed(2)}H7.9A1.3 1.3 0 0 1 6.6 ${(b - 1.3).toFixed(2)}V${(t + 1.3).toFixed(2)}A1.3 1.3 0 0 1 7.9 ${t.toFixed(2)}Z`; };
const WIN = 'M9 9.7H15A0.6 0.6 0 0 1 15.6 10.3V13.3A0.6 0.6 0 0 1 15 13.9H9A0.6 0.6 0 0 1 8.4 13.3V10.3A0.6 0.6 0 0 1 9 9.7Z';
const DISP = 'M8.2 6.75H10.9V7.55H8.2Z';
const LINES = 'M6.6 8.7H17.4M6.6 15.1H17.4M8.6 18.7H9.8M14.2 18.7H15.4';
const HANDLE = 'M10.6 16.25H13.4';
const HEAT = 'M10.7 10.75C10.25 11.15 10.25 11.55 10.7 11.85C11.15 12.15 11.15 12.55 10.7 12.85M12 10.75C11.55 11.15 11.55 11.55 12 11.85C12.45 12.15 12.45 12.55 12 12.85M13.3 10.75C12.85 11.15 12.85 11.55 13.3 11.85C13.75 12.15 13.75 12.55 13.3 12.85';
export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-bento-oven-0', x1: 0, y1: 2, x2: 0, y2: 22, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1, 'stop-opacity': 0 }], ['stop', { offset: 1, 'stop-color': C1, 'stop-opacity': 0.17 }]]],
      ['linearGradient', { id: 'wg-bento-oven-1', x1: 2, y1: 0, x2: 22, y2: 0, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SN, 'stop-opacity': 0 }], ['stop', { offset: 0.3, 'stop-color': SN, 'stop-opacity': 0.95 }],
        ['stop', { offset: 0.7, 'stop-color': SN, 'stop-opacity': 0.95 }], ['stop', { offset: 1, 'stop-color': SN, 'stop-opacity': 0 }]]],
      ['linearGradient', { id: 'wg-bento-oven-2', x1: 0, y1: 5.6, x2: 0, y2: 17.4, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1, 'stop-opacity': 0.3 }], ['stop', { offset: 1, 'stop-color': C1, 'stop-opacity': 0.55 }]]],
    ]],
    ['path', { d: TILE, fill: V('tint', '#EEF0FF'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: 'url(#wg-bento-oven-0)', stroke: C1, 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62', stroke: 'url(#wg-bento-oven-1)', 'stroke-width': 0.5, class: 'wm-deco' }],
    ['path', { d: body(0.55), fill: SH, stroke: SH, 'stroke-width': 2.6, opacity: 0.07, class: 'wm-shadow' }],
    ['path', { d: body(0.3), fill: SH, stroke: SH, 'stroke-width': 1.55, opacity: 0.08, class: 'wm-shadow' }],
    ['path', { d: 'M8.6 19.25H9.8M14.2 19.25H15.4', stroke: SH, 'stroke-width': 1.55, 'stroke-opacity': 0.08, class: 'wm-shadow' }],
    ['path', { d: body(0), fill: SN }],
    ['path', { d: body(0), fill: 'url(#wg-bento-oven-2)' }],
    ['path', { d: WIN + DISP, fill: SN, 'fill-opacity': 0.85 }],
    ['path', { d: body(0) + LINES + HANDLE, stroke: SH, 'stroke-width': 1.1 }],
    ['path', { d: WIN + DISP, stroke: SH, 'stroke-width': 1.1, class: 'wm-a' }],
    ['path', { d: WIN + DISP, stroke: C1, 'stroke-opacity': 0.72, 'stroke-width': 1.1, class: 'wm-a' }],
    ['circle', { cx: 13.75, cy: 7.15, r: 0.6, fill: SH, class: 'wm-a' }],
    ['circle', { cx: 15.65, cy: 7.15, r: 0.6, fill: SH, class: 'wm-a' }],
    ['path', { d: HEAT, stroke: V('ink', '#1E1B4B'), 'stroke-width': 1, class: 'wm-s' }],
    ['path', { d: HEAT, stroke: V('accent', '#F43F75'), 'stroke-opacity': 0.8, 'stroke-width': 1, class: 'wm-s' }],
  ];
}
