const D = { color: "var(--with-accent, currentColor)", stroke: "currentColor", "stroke-width": 0.45, "stroke-opacity": 0.5, class: "wm-deco" };
const T = { color: "var(--with-accent, currentColor)", stroke: "currentColor", "stroke-width": 0.5, "stroke-opacity": 0.75, class: "wm-deco" };
const dim = (a, b) => [["path", { d: `M${a} 23H${b}M${a} 21.7V23.3M${b} 21.7V23.3`, ...D }], ["path", { d: `M${a - 0.65} 23.65L${a + 0.65} 22.35M${b - 0.65} 23.65L${b + 0.65} 22.35`, ...T }]];
export default function render() {
  return [
    ...dim(3.5, 20.5),
    ["path", { d: "M16.5 5.5C15.5 4.5 14 4 12 4C8.75 4 6.5 5.75 6.5 8C6.5 10.25 8.5 11.4 11 12C14.5 12.8 17.5 13.75 17.5 16C17.5 18.25 15.25 20 12 20C10 20 8.5 19.5 7.5 18.5", class: "wm-k" }],
    ["path", { d: "M3.5 12H20.5", "stroke-width": 2, class: "wm-a" }]
  ];
}
