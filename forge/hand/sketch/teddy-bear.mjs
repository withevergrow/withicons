export default function render(icon) {
    function mk(seed){let s=seed>>>0;const r=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296-0.5;};
const f=n=>(Math.round(n*100)/100).toString();
const samp=(pts,closed,step=1.6)=>{const o=[];const n=closed?pts.length:pts.length-1;for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%pts.length];const d=Math.hypot(b[0]-a[0],b[1]-a[1]);const k=Math.max(1,Math.round(d/step));for(let j=0;j<k;j++)o.push([a[0]+(b[0]-a[0])*j/k,a[1]+(b[1]-a[1])*j/k]);}if(!closed)o.push(pts[pts.length-1]);return o;};
const wob=(pts,closed,amp=0.22)=>{const p=samp(pts,closed).map(([x,y],i)=>[x+r()*amp,y+r()*amp]);if(closed)p.push([p[0][0]+0.5*(p[1][0]-p[0][0]),p[0][1]+0.5*(p[1][1]-p[0][1])]);return 'M'+p.map(q=>f(q[0])+' '+f(q[1])).join('L');};
const rr=(x,y,w,h,c)=>{const p=[];const arc=(cx,cy,a0)=>{for(let i=0;i<=3;i++){const a=(a0+i*30)*Math.PI/180;p.push([cx+c*Math.cos(a),cy+c*Math.sin(a)]);}};arc(x+w-c,y+c,270);arc(x+w-c,y+h-c,0);arc(x+c,y+h-c,90);arc(x+c,y+c,180);return p;};
const circ=(cx,cy,R,n=12)=>Array.from({length:n},(_,i)=>[cx+R*Math.cos(i*2*Math.PI/n),cy+R*Math.sin(i*2*Math.PI/n)]);
const hatch=segs=>['path',{d:segs.map(([a,b,c,d])=>'M'+f(a)+' '+f(b)+'L'+f(c)+' '+f(d)).join(''),'stroke-width':0.8,'stroke-opacity':0.5}];
return {r,f,wob,rr,circ,hatch};}
  const {wob,r,f,circ}=mk(29);
  const arc=(cx,cy,rx,ry,a0,a1,n=24)=>Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*Math.PI/180;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});

  const outside=(pts,cx,cy,R)=>{const m=pts.length;let s=pts.findIndex(p=>Math.hypot(p[0]-cx,p[1]-cy)>R);if(s<0)return [];const runs=[];let cur=[];for(let k=0;k<m;k++){const p=pts[(s+k)%m];if(Math.hypot(p[0]-cx,p[1]-cy)>R)cur.push(p);else if(cur.length){runs.push(cur);cur=[];}}if(cur.length)runs.push(cur);return runs;};
  const hd=[12,9.6,5.4];
  const d=ps=>ps.map(q=>wob(q,false)).join('');
  const earL=outside(circ(6.4,4.9,2.6,32),hd[0],hd[1],hd[2]+0.6);
  const earR=outside(circ(17.6,4.9,2.6,32),hd[0],hd[1],hd[2]+0.6);
  const body=outside(arc(12,18.2,5.4,4.5,0,360,64),hd[0],hd[1],hd[2]+0.1);
  const heart=Array.from({length:24},(_,i)=>{const t=i*2*Math.PI/24;return [12+0.17*16*Math.pow(Math.sin(t),3),19.2-0.17*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))];});
  const eyes=[[9.9,8.6],[14.1,8.6]].map(([x,y])=>['circle',{cx:x,cy:y,r:0.35,fill:'currentColor'}]);
  return [
    ['path',{d:wob(circ(12,9.6,5.4,32),true)+d(earL)+d(earR),class:'wm-k'}],
    ['path',{d:d(body),class:'wm-k'}],
    ['path',{d:wob(heart,true),class:'wm-a'}],
    ['path',{d:wob(arc(12,11.4,2.1,1.5,0,360,16),true)+wob([[12,10.5],[12,10.9]],false),class:'wm-a'}],
    ...eyes];
}
