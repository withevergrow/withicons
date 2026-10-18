// hand-drawn liquid red-lantern

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
 const n='red-lantern';
 return [defs(n),shadow(n,['M12 6.6c4.4 0 7.6 2.6 7.6 5.9s-3.2 5.9-7.6 5.9-7.6-2.6-7.6-5.9 3.2-5.9 7.6-5.9z','M8.6 4.8h6.8c.5 0 .9.4.9.9v.9c0 .5-.4.9-.9.9H8.6c-.5 0-.9-.4-.9-.9v-.9c0-.5.4-.9.9-.9zM8.6 17.4h6.8c.5 0 .9.4.9.9v.9c0 .5-.4.9-.9.9H8.6c-.5 0-.9-.4-.9-.9v-.9c0-.5.4-.9.9-.9z','M11.3 20.1h1.4v2.2c0 .4-.3.7-.7.7s-.7-.3-.7-.7z']),
  ['path',{d:'M12 2.2v2.6',stroke:'currentColor','stroke-opacity':0.6,'stroke-width':1.1,'stroke-linecap':'round',class:'wm-deco'}],
  ...blob(n,'M12 6.6c4.4 0 7.6 2.6 7.6 5.9s-3.2 5.9-7.6 5.9-7.6-2.6-7.6-5.9 3.2-5.9 7.6-5.9z',0,'wm-k'),
  ['path',{d:'M12 7.6v9.8M9.1 7.6c-2 2.8-2 7 0 9.8M14.9 7.6c2 2.8 2 7 0 9.8',stroke:`url(#wg-liquid-${n}-2)`,'stroke-width':1,'stroke-linecap':'round',class:'wm-k'}],
  ...blob(n,'M8.6 4.8h6.8c.5 0 .9.4.9.9v.9c0 .5-.4.9-.9.9H8.6c-.5 0-.9-.4-.9-.9v-.9c0-.5.4-.9.9-.9zM8.6 17.4h6.8c.5 0 .9.4.9.9v.9c0 .5-.4.9-.9.9H8.6c-.5 0-.9-.4-.9-.9v-.9c0-.5.4-.9.9-.9z',1,'wm-k'),...blob(n,'M11.3 20.1h1.4v2.2c0 .4-.3.7-.7.7s-.7-.3-.7-.7z',3,'wm-a')];
}
