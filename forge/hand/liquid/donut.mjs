const N='donut';
const V=(r,h)=>'var(--with-liquid-'+r+', '+h+')';
const id=n=>'wg-liquid-'+N+'-'+n, u=n=>'url(#'+id(n)+')';
const st=(o,c,a)=>['stop',{offset:o,'stop-color':c,'stop-opacity':a}];
const lin=(n,s)=>['linearGradient',{id:id(n),x1:'3',y1:'2',x2:'21',y2:'22',gradientUnits:'userSpaceOnUse'},s];
const DEFS=['defs',{},[
  lin(0,[st('0',V('c1','#4A9DFF'),'0.16'),st('0.6',V('c1','#4A9DFF'),'0.38'),st('1',V('c1','#4A9DFF'),'0.62')]),
  lin(1,[st('0',V('c2','#A77BFF'),'0.32'),st('1',V('c2','#A77BFF'),'0.78')]),
  lin(2,[st('0',V('c3','#1C3F9E'),'0.45'),st('1',V('c3','#1C3F9E'),'0.95')]),
  ['radialGradient',{id:id(3),cx:'8',cy:'7',r:'11',gradientUnits:'userSpaceOnUse'},[st('0',V('shine','#FFFFFF'),'0.85'),st('1',V('shine','#FFFFFF'),'0')]],
]];
const shadow=d=>['path',{d,fill:V('c4','#FF7EC1'),'fill-opacity':'0.28',class:'wm-shadow'}];
const body=(d,g=0,cls='wm-k',ex={})=>['path',{d,fill:u(g),stroke:u(2),'stroke-width':'0.9','stroke-linejoin':'round',...ex,class:cls}];
const shine=(d,w='0.9')=>['path',{d,stroke:V('shine','#FFFFFF'),'stroke-opacity':'0.9','stroke-width':w,'stroke-linecap':'round',class:'wm-shine'}];
const glow=d=>['path',{d,fill:u(3),class:'wm-shine'}];
const line=(d,c,w,cls='wm-k')=>['path',{d,stroke:c,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round',class:cls}];
export default function render(icon){
const r=(n)=>Math.round(n*100)/100;
let w='';for(let i=0;i<=48;i++){const a=i/48*Math.PI*2, rr=7.4+0.7*Math.cos(a*8);w+=(i?'L':'M')+r(12+rr*Math.cos(a))+' '+r(12+rr*Math.sin(a));}
w+='zM12 8.4A3.6 3.6 0 1 0 12 15.6A3.6 3.6 0 1 0 12 8.4z';
const ring='M12 2.6A9.4 9.4 0 1 1 12 21.4A9.4 9.4 0 1 1 12 2.6zM12 9A3 3 0 1 0 12 15A3 3 0 1 0 12 9z';
return [DEFS,shadow('M4 20.2Q12 23.6 20 20.2Q12 22.4 4 20.2z'),body(ring,0,'wm-k',{'fill-rule':'evenodd'}),
 ['path',{d:w,fill:V('c4','#FF7EC1'),'fill-opacity':'0.75','fill-rule':'evenodd',stroke:u(2),'stroke-width':'0.6','stroke-linejoin':'round',class:'wm-a'}],
 line('M8.2 7.4l1.3.5M15.6 6.6l-.6 1.2M17.4 13.4l-.9 1M7.6 15.6l1.3-.3M12.6 17.6l-1.2.3',V('shine','#FFFFFF'),'1.1','wm-deco'),
 shine('M6 9.2Q7.2 6.2 10.2 5.2'),glow('M12 3.4A8.6 8.6 0 0 0 4.6 9.6L8.8 10.6A3.6 3.6 0 0 1 12 8.4z')];
}
