const A="var(--with-accent, currentColor)";const G=(d,o=0.5)=>["path",{d,color:A,stroke:"currentColor","stroke-width":0.45,"stroke-opacity":o,class:"wm-deco"}];const N=(pts)=>["path",{d:pts.map(([x,y])=>`M${(x+0.8).toFixed(2)} ${y}A.8.8 0 1 0 ${(x-0.8).toFixed(2)} ${y}A.8.8 0 1 0 ${(x+0.8).toFixed(2)} ${y}`).join(""),color:A,stroke:"currentColor","stroke-width":0.5,class:"wm-k"}];const f=n=>+n.toFixed(2);
export default function render() {
  return [
    G("M22.5 2V11M21.7 2H23.3M21.7 11H23.3"),
    ["path", { d: "M20.5 3.5L15.25 8.75", class: "wm-k" }],
    ["path", { d: "M15.63 10.63L13.37 8.37L11.37 10.37L13.63 12.63ZM12.37 9.37L14.63 11.63", class: "wm-k" }],
    ["path", { d: "M11.37 10.37C8.5 11 4.5 15 3.75 20.25C9 19.5 13 15.5 13.63 12.63Z", class: "wm-a" }],
    N([[20.5, 3.5]]),
  ];
}
