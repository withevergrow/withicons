// forge/hand/engrave/gavel.mjs — gavel with a large head whose two ends are solid inked ferrules (no hairline slivers to close up at 16px) and a light cylinder between them, hatched along its length on the shade side only, clearing toward the upper-left
const r = (v) => Math.round(v * 100) / 100
// one tapered burin cut from (x1,y1) to (x2,y2), widest (w) two-thirds along, as a filled sliver
function cut(x1, y1, x2, y2, w) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L
  const at = (t, o) => `${r(x1 + dx * t + nx * o)} ${r(y1 + dy * t + ny * o)}`
  return `M${at(0, 0)} L${at(0.25, w * 0.3)} L${at(0.7, w / 2)} L${at(1, 0)} L${at(0.7, -w / 2)} L${at(0.25, -w * 0.3)} Z`
}
export default function render() {
  // head axis runs along (1,-1); hatch lines parallel to it, offsets measured from the upper-left edge (x+y=12.25)
  const hatch = [
    cut(6.7, 9.3, 8.8, 7.2, 0.55),        // x+y=16: mid-tone, shorter
    cut(6.92, 10.32, 10.22, 7.02, 0.7),  // x+y=17.25: shade side, longest
  ].join('')
  return [
    ["path",{"d":"M14.48 5.81l.33.37.07.15 0 .34-.07.16-3.49 3.52-.5-.5.14-.35 3.22-3.25.05-.12 0-.26-.25-.56zM10.35 11.32l-3.52 3.49-.33.09-.32-.09-.64-.6.21-.03.25.07.25-.07 3.25-3.22.35-.14z" + hatch,"fill":"currentColor","stroke":"none","class":"wm-k"}],
    ["path",{"d":"M2.25 10 L6 13.75 L7 12.75 L3.25 9 Z M10 2.25 L13.75 6 L12.75 7 L9 3.25 Z","fill":"currentColor","class":"wm-k"}],
    ["path",{"d":"M20.72 19.8l.35.39.07.17-.03.37-.22.29-.34.13-.19-.01-.32-.18-.5-.5.22-.02.28.06.26-.1.1-.1.1-.26-.01-.15-.27-.59z","fill":"currentColor","stroke":"none","class":"wm-a"}],
    ["path",{"d":"M11.99 21.07l.15.34-.05.36-.24.28-.35.1-8.18-.03-.17-.07-.64-.62.84.07 7.65 0 .27-.08.18-.21.04-.14-.04-.28.04-.22z","fill":"currentColor","stroke":"none","class":"wm-s"}],
    ["path",{"d":"M12.55 9.18l.97.97M11.95 9.79l.97.96M10.15 11.59l.96.97M9.54 12.19l.97.97M8.94 12.79l.97.97M12.04 21.9l.99.98M11.14 22.2l.95.95M9.93 22.19l.96.96M8.73 22.19l.96.96M7.52 22.19l.96.96M6.32 22.18l.96.97M5.11 22.18l.97.97","stroke-width":0.3,"class":"wm-shadow"}],
    ["path",{"d":"M2.25 10 L10 2.25 L13.75 6 L6 13.75 Z","class":"wm-k"}],
    ["path",{"d":"M9.75 9.75 L20 20","class":"wm-a"}],
    ["path",{"d":"M3 21 H11","class":"wm-s"}],
  ]
}
