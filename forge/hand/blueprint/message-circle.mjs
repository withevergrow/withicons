const A="var(--with-accent, currentColor)";const G=(d,o=0.5)=>["path",{d,color:A,stroke:"currentColor","stroke-width":0.45,"stroke-opacity":o,class:"wm-deco"}];const N=(pts)=>["path",{d:pts.map(([x,y])=>`M${(x+0.8).toFixed(2)} ${y}A.8.8 0 1 0 ${(x-0.8).toFixed(2)} ${y}A.8.8 0 1 0 ${(x+0.8).toFixed(2)} ${y}`).join(""),color:A,stroke:"currentColor","stroke-width":0.5,class:"wm-k"}];const f=n=>+n.toFixed(2);
export default function render() {
  return [
    G("M12 .5V1.75M12 20.5V21.75M.75 11.5H2M22 11.5H23.25M3.5 23.25H21"),
    ["path", { d: "M7.75 18.86A8.5 8.5 0 1 0 4.64 15.75L3.5 20.5Z", class: "wm-k" }],
    ["path", { d: "M8 10.5H16M8 13.5H13", class: "wm-a" }],
    N([[3.5, 20.5], [20.5, 11.5]]),
  ];
}
