const N='hand-coins';
const V=(r,h)=>'var(--with-liquid-'+r+', '+h+')';
const id=n=>'wg-liquid-'+N+'-'+n, u=n=>'url(#'+id(n)+')';
const st=(o,c,a)=>['stop',{offset:o,'stop-color':c,'stop-opacity':a}];
const lin=(n,s)=>['linearGradient',{id:id(n),x1:'3',y1:'2',x2:'21',y2:'22',gradientUnits:'userSpaceOnUse'},s];
const DEFS=['defs',{},[
  lin(0,[st('0',V('c1','#4A9DFF'),'0.55'),st('0.6',V('c1','#4A9DFF'),'0.78'),st('1',V('c1','#4A9DFF'),'0.95')]),
  lin(1,[st('0',V('c2','#A77BFF'),'0.65'),st('1',V('c2','#A77BFF'),'0.95')]),
  lin(2,[st('0',V('c3','#1C3F9E'),'0.45'),st('1',V('c3','#1C3F9E'),'0.95')]),
  ['radialGradient',{id:id(3),cx:'8',cy:'7',r:'11',gradientUnits:'userSpaceOnUse'},[st('0',V('shine','#FFFFFF'),'0.85'),st('1',V('shine','#FFFFFF'),'0')]],
]];
const shadow=d=>['path',{d,fill:V('c4','#FF7EC1'),'fill-opacity':'0.28',class:'wm-shadow'}];
const body=(d,g=0,cls='wm-k',ex={})=>['path',{d,fill:u(g),stroke:u(2),'stroke-width':'0.9','stroke-linejoin':'round',...ex,class:cls}];
const shine=(d,w='0.9')=>['path',{d,stroke:V('shine','#FFFFFF'),'stroke-opacity':'0.9','stroke-width':w,'stroke-linecap':'round',class:'wm-shine'}];
const glow=d=>['path',{d,fill:u(3),class:'wm-shine'}];
const line=(d,c,w,cls='wm-k')=>['path',{d,stroke:c,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round',class:cls}];
export default function render(icon){
const coin=(cy)=>{const a='M11.5 '+cy+'A4 1.5 0 0 0 19.5 '+cy;return [body(a+'V'+(cy+1.3)+'A4 1.5 0 0 1 11.5 '+(cy+1.3)+'Z',0,'wm-a'),body('M11.5 '+cy+'A4 1.5 0 1 1 19.5 '+cy+'A4 1.5 0 1 1 11.5 '+cy+'z',1,'wm-a')];};
return [DEFS,shadow('M2 21.6Q11 23.2 20 20Q11 22.4 2 21.6z'),
 ...coin(10.2),...coin(7.4),...coin(4.6),
 shine('M13.2 4.2Q15.5 3.5 17.6 4',"0.6"),
 body('M2 13.4H4.6V21.4H2z',1),
 body('M5.4 14.2H10.4Q12.4 14.2 12.6 15.9L16.4 14.5Q19.4 13.5 20.4 15Q21 16 19.8 16.8L14.2 20.2Q13.2 20.8 12 20.8H5.4Z',0),
 line('M8.6 17.4H12.4L12.6 15.9',V('edge','#FFFFFF'),'0.8'),
 shine('M6.4 15.4H10',"0.7"),glow('M5.6 14.4H10.6Q12 14.6 12.2 15.6L6 16.4z')];
}
