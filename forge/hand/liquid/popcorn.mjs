// hand-drawn liquid popcorn

const V=(r,h)=>`var(--with-liquid-${r}, ${h})`;
const C1=V('c1','#4A9DFF'),C2=V('c2','#A77BFF'),C3=V('c3','#1C3F9E'),C4=V('c4','#FF7EC1'),SH=V('shine','#FFFFFF'),SD=V('shadow','#0C1A3A'),ED=V('edge','#B9E6FF');
const st=(o,c,op)=>['stop',op==null?{offset:o,'stop-color':c}:{offset:o,'stop-color':c,'stop-opacity':op}];
const lin=(id,x1,y1,x2,y2,s)=>['linearGradient',{id,x1,y1,x2,y2,gradientUnits:'userSpaceOnUse'},s];
function defs(n){const g=i=>`wg-liquid-${n}-${i}`;return ['defs',{},[
 lin(g(0),2,2,22,22,[st(0,C1,0.18),st(0.6,C1,0.4),st(1,C1,0.68)]),
 lin(g(1),2,2,22,22,[st(0,C2,0.35),st(1,C2,0.8)]),
 lin(g(2),2,2,22,22,[st(0,C3,0.45),st(1,C3,0.95)]),
 lin(g(3),2,2,22,22,[st(0,C4,0.55),st(1,C4,0.9)]),
 ['radialGradient',{id:g(4),cx:8.5,cy:7.5,r:10,gradientUnits:'userSpaceOnUse'},[st(0,SH,0.8),st(1,SH,0)]],
 lin(g(5),2,10,8,22,[st(0,SD,0.1),st(1,C4,0.32)])]];}
const sh=(d,dx=0.35,dy=0.55)=>d.replace(/M(-?[d.]+) (-?[d.]+)/g,(m,x,y)=>'M'+(+(+x+dx).toFixed(2))+' '+(+(+y+dy).toFixed(2)));
function blob(n,d,fill,cls){const u=i=>`url(#wg-liquid-${n}-${i})`;return [
 ['path',{d,fill:u(fill),stroke:'currentColor','stroke-opacity':0.3,'stroke-width':0.22,class:cls}],
 ['path',{d,stroke:u(2),'stroke-width':0.5,'stroke-linejoin':'round',class:cls}],
 ['path',{d,fill:u(4),class:'wm-shine'}]];}
function shadow(n,ds){return ['path',{d:ds.map(d=>sh(d)).join(''),fill:`url(#wg-liquid-${n}-5)`,class:'wm-shadow'}];}

export default function render(){
 const n='popcorn';
 const k=["M5.6 10a2.3 2.3 0 1 0 4.6 0a2.3 2.3 0 1 0 -4.6 0z","M13.8 10a2.3 2.3 0 1 0 4.6 0a2.3 2.3 0 1 0 -4.6 0z","M9.4 8.4a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0z","M7.5 5.6a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0z","M12.1 5.6a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0z"];
 return [defs(n),shadow(n,['M5.6 12.8h12.8l-1.4 8.6c-.06.4-.4.6-.8.6H7.8c-.4 0-.74-.2-.8-.6z',...k]),...blob(n,'M5.6 12.8h12.8l-1.4 8.6c-.06.4-.4.6-.8.6H7.8c-.4 0-.74-.2-.8-.6z',0,'wm-k'),
  ['path',{d:'M9 13.4h1.7l-.2 7.9H9.4zM13.3 13.4H15l-.4 7.9h-1.1z',fill:`url(#wg-liquid-${n}-3)`,class:'wm-k'}],
  ...k.flatMap(d=>blob(n,d,1,'wm-a'))];
}
