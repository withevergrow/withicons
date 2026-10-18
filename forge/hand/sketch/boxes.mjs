export default function render(icon) {
  function mk(seed){let s=seed>>>0;const r=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296-0.5;};
const f=n=>(Math.round(n*100)/100).toString();
const samp=(pts,closed,step=1.6)=>{const o=[];const n=closed?pts.length:pts.length-1;for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%pts.length];const d=Math.hypot(b[0]-a[0],b[1]-a[1]);const k=Math.max(1,Math.round(d/step));for(let j=0;j<k;j++)o.push([a[0]+(b[0]-a[0])*j/k,a[1]+(b[1]-a[1])*j/k]);}if(!closed)o.push(pts[pts.length-1]);return o;};
const wob=(pts,closed,amp=0.22)=>{const p=samp(pts,closed).map(([x,y],i)=>[x+r()*amp,y+r()*amp]);if(closed)p.push([p[0][0]+0.5*(p[1][0]-p[0][0]),p[0][1]+0.5*(p[1][1]-p[0][1])]);return 'M'+p.map(q=>f(q[0])+' '+f(q[1])).join('L');};
const rr=(x,y,w,h,c)=>{const p=[];const arc=(cx,cy,a0)=>{for(let i=0;i<=3;i++){const a=(a0+i*30)*Math.PI/180;p.push([cx+c*Math.cos(a),cy+c*Math.sin(a)]);}};arc(x+w-c,y+c,270);arc(x+w-c,y+h-c,0);arc(x+c,y+h-c,90);arc(x+c,y+c,180);return p;};
const circ=(cx,cy,R,n=12)=>Array.from({length:n},(_,i)=>[cx+R*Math.cos(i*2*Math.PI/n),cy+R*Math.sin(i*2*Math.PI/n)]);
const hatch=segs=>['path',{d:segs.map(([a,b,c,d])=>'M'+f(a)+' '+f(b)+'L'+f(c)+' '+f(d)).join(''),'stroke-width':0.8,'stroke-opacity':0.5}];
return {r,f,wob,rr,circ,hatch};}
  const {wob,hatch}=mk(53);
  return [hatch([[8.4,19.6,11.2,17.2],[8.4,17.6,11.2,15.2]]),
    ['path',{d:wob([[7.67,10.75],[12,13.25],[12,18.25],[7.67,20.75],[3.34,18.25],[3.34,13.25]],true)+wob([[16.33,10.75],[20.66,13.25],[20.66,18.25],[16.33,20.75],[12,18.25],[12,13.25]],true)+wob([[3.34,13.25],[7.67,15.75],[12,13.25]],false,0.15)+wob([[7.67,15.75],[7.67,20.75]],false,0.15)+wob([[12,13.25],[16.33,15.75],[20.66,13.25]],false,0.15)+wob([[16.33,15.75],[16.33,20.75]],false,0.15),class:'wm-k'}],
    ['path',{d:wob([[12,3.25],[16.33,5.75],[16.33,10.75],[12,13.25],[7.67,10.75],[7.67,5.75]],true)+wob([[7.67,5.75],[12,8.25],[16.33,5.75]],false,0.15)+wob([[12,8.25],[12,13.25]],false,0.15),class:'wm-a'}]];
}
