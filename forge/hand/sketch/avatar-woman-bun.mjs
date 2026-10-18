export default function render(icon) {
  function mk(seed){let s=seed>>>0;const r=()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296-0.5;};
const f=n=>(Math.round(n*100)/100).toString();
const samp=(pts,closed,step=1.6)=>{const o=[];const n=closed?pts.length:pts.length-1;for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%pts.length];const d=Math.hypot(b[0]-a[0],b[1]-a[1]);const k=Math.max(1,Math.round(d/step));for(let j=0;j<k;j++)o.push([a[0]+(b[0]-a[0])*j/k,a[1]+(b[1]-a[1])*j/k]);}if(!closed)o.push(pts[pts.length-1]);return o;};
const wob=(pts,closed,amp=0.22)=>{const p=samp(pts,closed).map(([x,y],i)=>[x+r()*amp,y+r()*amp]);if(closed)p.push([p[0][0]+0.5*(p[1][0]-p[0][0]),p[0][1]+0.5*(p[1][1]-p[0][1])]);return 'M'+p.map(q=>f(q[0])+' '+f(q[1])).join('L');};
const rr=(x,y,w,h,c)=>{const p=[];const arc=(cx,cy,a0)=>{for(let i=0;i<=3;i++){const a=(a0+i*30)*Math.PI/180;p.push([cx+c*Math.cos(a),cy+c*Math.sin(a)]);}};arc(x+w-c,y+c,270);arc(x+w-c,y+h-c,0);arc(x+c,y+h-c,90);arc(x+c,y+c,180);return p;};
const circ=(cx,cy,R,n=12)=>Array.from({length:n},(_,i)=>[cx+R*Math.cos(i*2*Math.PI/n),cy+R*Math.sin(i*2*Math.PI/n)]);
const hatch=segs=>['path',{d:segs.map(([a,b,c,d])=>'M'+f(a)+' '+f(b)+'L'+f(c)+' '+f(d)).join(''),'stroke-width':0.8,'stroke-opacity':0.5}];
return {r,f,wob,rr,circ,hatch};}
  const {wob,circ,hatch}=mk(37);
  const face=[[7,12.75],[6.9,15.5],[7.8,18.3],[9.6,20.6],[12,21.5],[14.4,20.6],[16.2,18.3],[17.1,15.5],[17,12.75]];
  const hair=[[5.75,14.5],[5.4,11.5],[6.6,9],[9,7.4],[12,7],[15,7.4],[17.4,9],[18.6,11.5],[18.25,14.5],[17.2,13.1],[15,12.25],[13,11.4],[11.75,10],[10.6,11.6],[9,12.5],[7.5,12.75],[6.5,13.3]];
  return [hatch([[7.2,10.6,9.2,8.4],[9.6,10.4,11.6,8.2],[13.2,10.6,14.8,8.6],[15.4,11.8,17,9.8],[12,4.8,13.2,3.6]]),
    ['path',{d:wob(face,false,0.18),class:'wm-k'}],
    ['path',{d:wob(hair,true,0.18)+wob(circ(12,4.75,2.25,10),true,0.15),class:'wm-a'}],
    ['path',{d:'M10 15.2L10 15.6M14 15.2L14 15.6M10.6 18.2Q12 19.1 13.4 18.2','stroke-width':1.4}]];
}
