const D = { color: "var(--with-accent, currentColor)", stroke: "currentColor", "stroke-width": 0.45, "stroke-opacity": 0.5, class: "wm-deco" };
const T = { color: "var(--with-accent, currentColor)", stroke: "currentColor", "stroke-width": 0.5, "stroke-opacity": 0.75, class: "wm-deco" };
const dim = (a, b) => [["path", { d: `M${a} 23H${b}M${a} 21.7V23.3M${b} 21.7V23.3`, ...D }], ["path", { d: `M${a - 0.65} 23.65L${a + 0.65} 22.35M${b - 0.65} 23.65L${b + 0.65} 22.35`, ...T }]];
export default function render() {
  return [
    ...dim(4.5, 19.5),
    ["path", { d: "M12 2.5L19.5 5.5V12C19.5 16 17 19.2 12 21.5C7 19.2 4.5 16 4.5 12V5.5Z", class: "wm-k" }],
    ["path", { d: "M3 3L21 21", "stroke-width": 1.75, class: "wm-s" }]
  ];
}
