const I='var(--with-coquette-ink, #7E2443)',C1='var(--with-coquette-c1, #F8BCCB)',C2='var(--with-coquette-c2, #EC8DA6)',C3='var(--with-coquette-c3, #D7385F)',C4='var(--with-coquette-c4, #FCEADD)',T='var(--with-coquette-tint, #FFE4EB)',A='var(--with-coquette-accent, #D9A45B)',SH='var(--with-coquette-shine, #FFFFFF)',SD='var(--with-coquette-shadow, #A8345C)';
const st={stroke:I,'stroke-width':1.5,'stroke-linecap':'round','stroke-linejoin':'round'};
export default function render(){return[
['ellipse',{cx:12,cy:20.9,rx:7.6,ry:1,fill:SD,'fill-opacity':0.2,class:'wm-shadow'}],
['path',{d:'M4.4 12.6L4.4 18.2C4.4 19.6 7.8 20.6 12 20.6C16.2 20.6 19.6 19.6 19.6 18.2L19.6 12.6Z',fill:C2,...st,class:'wm-k'}],
['path',{d:'M5.6 14.8C7.4 15.6 9.6 16 12 16C14.4 16 16.6 15.6 18.4 14.8L18.4 17.6C16.6 18.4 14.4 18.8 12 18.8C9.6 18.8 7.4 18.4 5.6 17.6Z',fill:C3,'fill-opacity':0.5,class:'wm-k'}],
['ellipse',{cx:12,cy:12.6,rx:7.6,ry:2.4,fill:T,...st,class:'wm-k'}],
['path',{d:'M7.4 12.2C9 11.5 10.6 11.3 12.4 11.4',fill:'none',stroke:SH,'stroke-width':0.9,'stroke-linecap':'round',class:'wm-shine'}],
['circle',{cx:6.8,cy:16.9,r:0.75,fill:A,stroke:I,'stroke-width':0.7,class:'wm-s'}],
['circle',{cx:12,cy:17.6,r:0.75,fill:A,stroke:I,'stroke-width':0.7,class:'wm-s'}],
['circle',{cx:17.2,cy:16.9,r:0.75,fill:A,stroke:I,'stroke-width':0.7,class:'wm-s'}],
['path',{d:'M4.4 18.2C4.4 19.6 7.8 20.6 12 20.6C16.2 20.6 19.6 19.6 19.6 18.2',fill:'none',...st,class:'wm-k'}],
['path',{d:'M8.6 6.2L19.8 1.9',fill:'none',stroke:I,'stroke-width':2.6,'stroke-linecap':'round',class:'wm-a'}],
['path',{d:'M8.6 6.2L19.8 1.9',fill:'none',stroke:A,'stroke-width':1.1,'stroke-linecap':'round',class:'wm-a'}],
['circle',{cx:7,cy:6.8,r:1.9,fill:C4,...st,class:'wm-a'}],
['path',{d:'M6.3 6.3C6.5 5.9 6.9 5.7 7.3 5.7',fill:'none',stroke:SH,'stroke-width':0.8,'stroke-linecap':'round',class:'wm-shine'}],
];}
