const A="var(--with-accent, currentColor)";
const dot=(cx,cy,c="wm-k")=>["circle",{cx,cy,r:0.8,color:A,stroke:"currentColor","stroke-width":0.5,class:c}];
const dim=(d)=>["path",{d,color:A,stroke:"currentColor","stroke-width":0.45,"stroke-opacity":0.5,class:"wm-deco"}];
export default function render(){return [
["path",{d:"M3 12H21A9 8 0 0 1 3 12Z",class:"wm-k"}],
["path",{d:"M4.5 12Q4 7.5 8 7Q8.5 10.5 6.5 12",class:"wm-a"}],
["path",{d:"M19.5 12Q20 7.5 16 7Q15.5 10.5 17.5 12",class:"wm-a"}],
["ellipse",{cx:12,cy:8.5,rx:2.6,ry:3.4,class:"wm-s"}],
dot(12,9.3,"wm-s"),dim("M5 22.5H19M5 21.5V23.3M19 21.5V23.3")];}
