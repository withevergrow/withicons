const G = { color: "var(--with-accent, currentColor)", stroke: "currentColor", "stroke-width": 0.45, "stroke-opacity": 0.5, class: "wm-deco" };
export default function render() {
  return [
    ["path", { d: "M12 5.5V12.5M8.5 9H15.5", ...G }],
    ["circle", { cx: 12, cy: 9, r: 6, class: "wm-k" }],
    ["circle", { cx: 12, cy: 9, r: 3, "stroke-width": 0.9, class: "wm-a" }],
    ["path", { d: "M9.2 14.4L7.6 21.2L10.1 20L11.2 21.8L12 15M14.8 14.4L16.4 21.2L13.9 20L12.8 21.8L12 15", class: "wm-k" }],
  ];
}
