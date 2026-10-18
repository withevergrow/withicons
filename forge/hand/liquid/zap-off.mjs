// hand-drawn liquid zap-off

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
 const n='zap-off';
 const d='M13.2 2L9.35 7.23L16.13 14.01L18.8 10.4L12.6 10.4zM7.55 9.67L4.8 13.4L11 13.4L10.2 22L14.32 16.44z';
 return [defs(n),shadow(n,[d,'M3.4 3.4L20.6 20.6']),...blob(n,d,0,'wm-k'),
  ['path',{d:'M3.6 3.6l16.8 16.8',stroke:`url(#wg-liquid-${n}-3)`,'stroke-width':1.6,'stroke-linecap':'round',class:'wm-s'}],
  ['path',{d:'M3.6 3.6l16.8 16.8',stroke:'currentColor','stroke-opacity':0.35,'stroke-width':0.3,'stroke-linecap':'round',class:'wm-s'}]];
}
