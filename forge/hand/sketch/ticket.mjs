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
  const arc=(cx,cy,rx,ry,a0,a1,n=24)=>Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*Math.PI/180;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});

  const out=[[4.5,6],[19.5,6],...arc(19.5,8.5,2.5,2.5,-90,0,5),[22,10],...arc(22,12,2,2,-90,-270,10).map(([x,y])=>[x,y]),[22,15.5],...arc(19.5,15.5,2.5,2.5,0,90,5),[4.5,18],...arc(4.5,15.5,2.5,2.5,90,180,5),[2,14],...arc(2,12,2,2,90,-90,10),[2,8.5],...arc(4.5,8.5,2.5,2.5,180,270,5)];
  const star=[];for(let i=0;i<10;i++){const a=(-90+i*36)*Math.PI/180,R=i%2?1.35:2.7;star.push([8.6+R*Math.cos(a),12.3+R*Math.sin(a)]);}
  return [hatch([[16.9,16.4,18.9,14.4],[19.2,16.4,20.2,15.4]]),
    ['path',{d:wob(out,true),class:'wm-k'}],
    ['path',{d:wob([[15,8.3],[15,9.7]],false)+wob([[15,11.3],[15,12.7]],false)+wob([[15,14.3],[15,15.7]],false)+wob(star,true),class:'wm-a'}]];
}
