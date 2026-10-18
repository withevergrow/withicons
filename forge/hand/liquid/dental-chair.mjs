const N='dental-chair';
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
return [DEFS,shadow('M5 21.4Q11 23 17 21.4Q11 22.4 5 21.4z'),
 line('M15 13.2V5.4H17.6V6',V('c1','#4A9DFF'),'1.5','wm-a'),
 body('M13.8 8.4Q17.6 1.8 21.4 8.4z',1,'wm-a'),
 body('M10.2 15.8H12.4V19.8H10.2z',0),
 body('M5.6 19.8H17Q17.6 19.8 17.6 20.5Q17.6 21.1 17 21.1H5.6Q5 21.1 5 20.5Q5 19.8 5.6 19.8z',1,'wm-k'),
 body('M7.4 13H15.8L20.2 17.2Q20.6 17.8 19.9 18.3Q19.4 18.6 18.9 18.2L15.2 15.2H7.4Q6.2 15.2 6.2 14.1Q6.2 13 7.4 13z',0),
 body('M4.6 12.4L2.8 6.2Q2.5 5 3.6 4.7Q4.6 4.5 5 5.6L6.8 11.8Q7 12.8 6 13Q5 13.2 4.6 12.4z',0),
 body('M2.4 3.4A1.3 1.3 0 1 1 4.6 2.2A1.3 1.3 0 1 1 2.4 3.4z',1),
 shine('M8 13.9H14.6',"0.6"),shine('M4 6.2L5.2 10.4',"0.6"),glow('M15.6 7Q17.4 4.2 19.2 6.2z')];
}
