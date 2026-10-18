// old (pre-rework) drawing restored on request, plus a half egg centred in the bowl
export default function render() {
  return [
    ["path", { d: "M2.5 12 H21.5 A9.5 9 0 0 1 2.5 12 Z" }],
    ["path", { d: "M6.25 12 A4.25 4.25 0 0 1 3 7 A4.25 4.25 0 0 1 6.25 12 Z", class: "wm-a" }],
    ["path", { d: "M9 12 C9 8 10.4 5.5 12 5.5 C13.6 5.5 15 8 15 12", class: "wm-a" }],
    ["circle", { cx: 12, cy: 9.6, r: 1.5, fill: "currentColor", stroke: "none", class: "wm-a" }],
    ["path", { d: "M20.75 6.75 A1.75 1.75 0 1 1 17.25 6.75 A1.75 1.75 0 1 1 20.75 6.75 Z", class: "wm-a" }],
  ];
}
