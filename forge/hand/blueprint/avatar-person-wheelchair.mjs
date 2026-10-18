const A="var(--with-accent, currentColor)";
const dot=(cx,cy,c="wm-k")=>["circle",{cx,cy,r:0.8,color:A,stroke:"currentColor","stroke-width":0.5,class:c}];
const dim=(d)=>["path",{d,color:A,stroke:"currentColor","stroke-width":0.45,"stroke-opacity":0.5,class:"wm-deco"}];
export default function render(){return [
["circle",{cx:9,cy:4.5,r:2.2,class:"wm-k"}],
["path",{d:"M9 8.2V14H15.5L17.5 19.5",class:"wm-k"}],
["path",{d:"M9 10.5H13.5",class:"wm-k"}],
["circle",{cx:10,cy:16.5,r:5,class:"wm-a"}],
dot(10,16.5,"wm-a"),dot(17.5,19.5)];}
