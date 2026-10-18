// hand-drawn liquid rangoli-pattern

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
 const n='rangoli-pattern';
 const d="M18.96 15.44a1.35 1.35 0 1 0 2.7 0a1.35 1.35 0 1 0 -2.7 0zM14.09 20.31a1.35 1.35 0 1 0 2.7 0a1.35 1.35 0 1 0 -2.7 0zM7.21 20.31a1.35 1.35 0 1 0 2.7 0a1.35 1.35 0 1 0 -2.7 0zM2.34 15.44a1.35 1.35 0 1 0 2.7 0a1.35 1.35 0 1 0 -2.7 0zM2.34 8.56a1.35 1.35 0 1 0 2.7 0a1.35 1.35 0 1 0 -2.7 0zM7.21 3.69a1.35 1.35 0 1 0 2.7 0a1.35 1.35 0 1 0 -2.7 0zM14.09 3.69a1.35 1.35 0 1 0 2.7 0a1.35 1.35 0 1 0 -2.7 0zM18.96 8.56a1.35 1.35 0 1 0 2.7 0a1.35 1.35 0 1 0 -2.7 0z";
 return [defs(n),shadow(n,['M12 9.7c-1.7-1.5-1.7-4.1 0-5.6 1.7 1.5 1.7 4.1 0 5.6zM12 14.3c1.7 1.5 1.7 4.1 0 5.6-1.7-1.5-1.7-4.1 0-5.6zM9.7 12c-1.5 1.7-4.1 1.7-5.6 0 1.5-1.7 4.1-1.7 5.6 0zM14.3 12c1.5-1.7 4.1-1.7 5.6 0-1.5 1.7-4.1 1.7-5.6 0z',d,'M10.4 12a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0z']),...blob(n,'M12 9.7c-1.7-1.5-1.7-4.1 0-5.6 1.7 1.5 1.7 4.1 0 5.6zM12 14.3c1.7 1.5 1.7 4.1 0 5.6-1.7-1.5-1.7-4.1 0-5.6zM9.7 12c-1.5 1.7-4.1 1.7-5.6 0 1.5-1.7 4.1-1.7 5.6 0zM14.3 12c1.5-1.7 4.1-1.7 5.6 0-1.5 1.7-4.1 1.7-5.6 0z',1,'wm-k'),...blob(n,d,3,'wm-deco'),...blob(n,'M10.4 12a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0z',2,'wm-a')];
}
