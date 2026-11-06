// 오로라 배경: 별 세 겹(색·크기·반짝임이 제각각) + 천천히 일렁이는 오로라 띠.
// 스크롤하면 겹마다 다른 속도로 아주 천천히 움직인다(시차).
(function(){
const C=window.SKY||{};
const cv=document.createElement('canvas');
Object.assign(cv.style,{position:'fixed',left:0,top:0,width:'100%',height:'100%',zIndex:-1,pointerEvents:'none'});
document.body.prepend(cv);
const ctx=cv.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let W=0,H=0,dpr=1,seed=1,tiles=[],bright=[],sky=null,low=null,lctx=null,texs=[],ground=null;
const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
// 별의 종류: 흰색이 가장 많고, 푸른 별·노란 별·주황 별·붉은 별 순으로 드물다
const KINDS=[['#ffffff',40],['#d6e4ff',26],['#fff3cf',16],['#ffd2a6',10],['#ffaf9b',5],['#bfe9ff',3]];
const pickColor=()=>{let r=rnd()*100;for(const[c,w]of KINDS){if((r-=w)<0)return c}return '#fff'};
const off=(w,h,s=dpr)=>{const c=document.createElement('canvas');c.width=Math.max(1,w*s);c.height=Math.max(1,h*s);const g=c.getContext('2d');g.scale(s,s);return[c,g]};

function starTile(n,rmin,rmax){
  const[c,g]=off(W,H);
  for(let i=0;i<n;i++){const x=rnd()*W,y=rnd()*H,r=rmin+Math.pow(rnd(),3)*(rmax-rmin);
    g.globalAlpha=.2+rnd()*.7;g.fillStyle=pickColor();g.beginPath();g.arc(x,y,r,0,7);g.fill()}
  g.globalAlpha=1;return c;
}
function texture(c1,c2){ // 오로라 기둥 하나: 아래는 밝고 위로 갈수록 색이 바뀌며 옅어진다
  const[c,g]=off(1,128,1);const gr=g.createLinearGradient(0,0,0,128);
  gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.45,c2);gr.addColorStop(.86,c1);gr.addColorStop(.93,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=gr;g.fillRect(0,0,1,128);return c;
}
function setup(){
  dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;seed=C.seed||5;
  [sky]=off(W,H);const sg=sky.getContext('2d');const gr=sg.createLinearGradient(0,0,0,H);(C.sky||['#050914','#071226','#0b1d2e']).forEach((c,i,a)=>gr.addColorStop(i/(a.length-1),c));sg.fillStyle=gr;sg.fillRect(0,0,W,H);
  tiles=[[starTile(Math.round(W*H/2200),.25,.7),.02],[starTile(Math.round(W*H/8000),.4,1.1),.045]];
  bright=[];const n=Math.round(W*H/26000);
  for(let i=0;i<n;i++){const big=rnd()<.18;bright.push({x:rnd()*W,y:rnd()*H*1.6,r:big?1.4+rnd()*1.1:.8+rnd()*.7,c:pickColor(),tw:.6+rnd()*2.2,ph:rnd()*7,spike:big&&rnd()<.7,k:.08+rnd()*.05})}
  const s=.25;[low,lctx]=off(Math.ceil(W*s),Math.ceil(H*s),1);lctx.scale(1,1);
  texs=(C.bands||[]).map(b=>texture(b.c1,b.c2));
  ground=null;if(C.ridge){const[c,g]=off(W,220);g.fillStyle=C.ridge;g.beginPath();g.moveTo(0,220);
    for(let x=0;x<=W;x+=8){const y=120+Math.sin(x*.004+1)*34+Math.sin(x*.013)*16+Math.sin(x*.041)*5;g.lineTo(x,y)}g.lineTo(W,220);g.fill();ground=c}
}
const wob=(x,t,s)=>Math.sin(x*.011+t*.21+s)*.5+Math.sin(x*.027-t*.13+s*2)*.3+Math.sin(x*.063+t*.37+s*3)*.2;
function drawAurora(t,sy){
  const s=.25,w=low.width,h=low.height;lctx.clearRect(0,0,w,h);lctx.globalCompositeOperation='lighter';
  (C.bands||[]).forEach((b,i)=>{const tex=texs[i];
    for(let x=0;x<w;x++){const X=x/s;
      const cy=(b.y*H+Math.sin(X*b.freq+t*b.speed+b.seed)*b.amp*H+wob(X,t,b.seed)*b.amp*.5*H-sy*.03)*s;
      const hh=b.h*H*s*(.55+.45*(wob(X*1.7,t*1.3,b.seed+5)+1)/2);
      const inten=Math.max(0,.35+.65*wob(X*.6,t*.8,b.seed+9));
      lctx.globalAlpha=inten*b.a;lctx.drawImage(tex,x,cy-hh,1.6,hh*1.12)}});
  lctx.globalAlpha=1;lctx.globalCompositeOperation='source-over';
  ctx.save();ctx.globalCompositeOperation='screen';ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.drawImage(low,0,0,w,h,0,0,W,H);ctx.restore();
}
function drawBright(t,sy){
  bright.forEach(o=>{let y=(o.y-sy*o.k)%(H*1.6);if(y<0)y+=H*1.6;if(y>H+10)return;
    const a=reduce?.85:.55+.45*Math.sin(t*o.tw+o.ph);
    const gr=ctx.createRadialGradient(o.x,y,0,o.x,y,o.r*6);gr.addColorStop(0,o.c);gr.addColorStop(1,'rgba(0,0,0,0)');
    ctx.globalAlpha=a*.35;ctx.fillStyle=gr;ctx.fillRect(o.x-o.r*6,y-o.r*6,o.r*12,o.r*12);
    ctx.globalAlpha=a;ctx.fillStyle=o.c;ctx.beginPath();ctx.arc(o.x,y,o.r,0,7);ctx.fill();
    if(o.spike){ctx.globalAlpha=a*.55;ctx.strokeStyle=o.c;ctx.lineWidth=.6;const L=o.r*(5+2*Math.sin(t*o.tw+o.ph));
      ctx.beginPath();ctx.moveTo(o.x-L,y);ctx.lineTo(o.x+L,y);ctx.moveTo(o.x,y-L);ctx.lineTo(o.x,y+L);ctx.stroke()}});
  ctx.globalAlpha=1;
}
let t0=performance.now(),lastAur=0;
function frame(now){
  const t=reduce?3:(now-t0)/1000*(C.pace||1),sy=scrollY;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.drawImage(sky,0,0,W,H);
  tiles.forEach(([c,k])=>{const oy=-((sy*k)%H);ctx.drawImage(c,0,oy,W,H);ctx.drawImage(c,0,oy+H,W,H)});
  drawAurora(t,sy);
  drawBright(t,sy);
  if(ground){ctx.globalAlpha=1;ctx.drawImage(ground,0,H-220+Math.min(60,sy*.02),W,220)}
  if(!reduce)requestAnimationFrame(frame);
}
setup();requestAnimationFrame(frame);
addEventListener('resize',()=>{setup();if(reduce)requestAnimationFrame(frame)});
if(reduce)addEventListener('scroll',()=>requestAnimationFrame(frame),{passive:true});
})();
