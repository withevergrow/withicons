const A="var(--with-accent, currentColor)";
const dot=(cx,cy,c="wm-k")=>["circle",{cx,cy,r:0.8,color:A,stroke:"currentColor","stroke-width":0.5,class:c}];
const dim=(d)=>["path",{d,color:A,stroke:"currentColor","stroke-width":0.45,"stroke-opacity":0.5,class:"wm-deco"}];
export default function render(){return [
["path",{d:"M20.24 14.55A8.5 8.5 0 1 1 19 7.5",class:"wm-k"}],
["path",{d:"M19 3.5V7.5H15",class:"wm-a"}],
dot(20.24,14.55)];}
