const I='var(--with-coquette-ink, #7E2443)',C1='var(--with-coquette-c1, #F8BCCB)',C2='var(--with-coquette-c2, #EC8DA6)',C3='var(--with-coquette-c3, #D7385F)',T='var(--with-coquette-tint, #FFE4EB)',SH='var(--with-coquette-shine, #FFFFFF)',SD='var(--with-coquette-shadow, #A8345C)';
const st={stroke:I,'stroke-width':1.3,'stroke-linecap':'round','stroke-linejoin':'round'};
export default function render(){return[
['ellipse',{cx:11.5,cy:20,rx:8.5,ry:1.1,fill:SD,'fill-opacity':0.18,class:'wm-shadow'}],
['path',{d:'M3.4 15.4L1.8 16.6',fill:'none',...st,class:'wm-k'}],
['rect',{x:4.2,y:14.6,width:3.4,height:4.6,rx:1.7,fill:T,...st,class:'wm-a'}],
['rect',{x:14.8,y:14.6,width:3.4,height:4.6,rx:1.7,fill:T,...st,class:'wm-a'}],
['path',{d:'M17.4 13.8L18.6 10.4C19 9 19.6 7.4 21 7.4C22.6 7.4 23.2 9.2 22.4 10.6L20.2 14.6',fill:T,...st,class:'wm-a'}],
['circle',{cx:21.2,cy:9.3,r:0.65,fill:I,class:'wm-a'}],
['path',{d:'M2.8 15.6C2.8 10 6.4 6.2 11 6.2C15.6 6.2 19.2 10 19.2 15.6Z',fill:C1,...st,class:'wm-k'}],
['path',{d:'M9.4 9.2L12.6 9.2L14 11.8L12.6 14.4L9.4 14.4L8 11.8Z',fill:T,stroke:SD,'stroke-width':0.9,'stroke-linejoin':'round',class:'wm-k'}],
['path',{d:'M9.4 9.2L8.6 7M12.6 9.2L13.4 7M8 11.8L4.6 11.8M14 11.8L17.4 11.8M9.4 14.4L8.8 15.6M12.6 14.4L13.2 15.6',fill:'none',stroke:SD,'stroke-width':0.9,'stroke-linecap':'round','stroke-opacity':0.7,class:'wm-k'}],
['path',{d:'M2.8 15.6L19.2 15.6',fill:'none',...st,class:'wm-k'}],
['path',{d:'M5 11.4C5.6 9.4 7.1 8 8.8 7.4',fill:'none',stroke:SH,'stroke-width':1.1,'stroke-linecap':'round',class:'wm-shine'}],
['path',{d:'M20 6.6L21 7.3L20.6 6ZM22.4 6.6L21.4 7.3L21.8 6Z',fill:C3,stroke:I,'stroke-width':0.6,'stroke-linejoin':'round',class:'wm-deco'}],
];}
