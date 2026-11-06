// 우주 배경: 별 세 겹 + 성운 + 행성·위성·소행성. 스크롤하면 겹마다 다른 속도로 아주 천천히 움직인다(시차).
(function(){
const C=window.SKY||{};
const cv=document.createElement('canvas');
Object.assign(cv.style,{position:'fixed',left:0,top:0,width:'100%',height:'100%',zIndex:-1,pointerEvents:'none'});
document.body.prepend(cv);
const ctx=cv.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let W=0,H=0,dpr=1,seed=1,tiles=[],neb=null,belt=[],rocks=[],sats=[];
const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const off=(w,h)=>{const c=document.createElement('canvas');c.width=w*dpr;c.height=h*dpr;const g=c.getContext('2d');g.scale(dpr,dpr);return[c,g]};

function starTile(n,rmin,rmax,glow){
  const[c,g]=off(W,H);
  for(let i=0;i<n;i++){
    const x=rnd()*W,y=rnd()*H,r=rmin+Math.pow(rnd(),3)*(rmax-rmin),a=.25+rnd()*.75;
    const col=C.starColors[(rnd()*C.starColors.length)|0];
    if(glow&&r>1.1){const gr=g.createRadialGradient(x,y,0,x,y,r*5);gr.addColorStop(0,col+'55');gr.addColorStop(1,col+'00');g.fillStyle=gr;g.fillRect(x-r*5,y-r*5,r*10,r*10)}
    g.globalAlpha=a;g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.globalAlpha=1;
  }
  return c;
}
function nebulaTile(){
  const h=H*2,[c,g]=off(W,h);
  (C.nebula||[]).forEach(([fx,fy,fr,col,a])=>{const x=fx*W,y=fy*h,r=fr*Math.max(W,H);
    const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=a;g.fillStyle=gr;g.fillRect(0,0,W,h)});
  g.globalAlpha=1;
  if(C.milky){ // 은하수 띠: 기울어진 띠를 따라 작은 별을 몰아 찍는다
    g.save();g.translate(W*.5,h*.35);g.rotate(-.42);
    const gr=g.createLinearGradient(0,-170,0,170);gr.addColorStop(0,'rgba(150,170,255,0)');gr.addColorStop(.5,'rgba(170,185,255,.10)');gr.addColorStop(1,'rgba(150,170,255,0)');
    g.fillStyle=gr;g.fillRect(-W*1.2,-170,W*2.4,340);
    for(let i=0;i<1400;i++){const x=(rnd()-.5)*W*2.4,y=(rnd()+rnd()+rnd()-1.5)*90;g.globalAlpha=.15+rnd()*.5;g.fillStyle='#dfe6ff';g.fillRect(x,y,rnd()<.9?1:1.6,rnd()<.9?1:1.6)}
    g.restore();g.globalAlpha=1;
  }
  return c;
}
function rockShape(r){const n=9,p=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,k=.7+rnd()*.45;p.push([Math.cos(a)*r*k,Math.sin(a)*r*k])}return p}
function setup(){
  dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;
  seed=C.seed||7;
  tiles=[[starTile(Math.round(W*H/2600),.3,.8,false),.02],[starTile(Math.round(W*H/9000),.5,1.3,true),.05],[starTile(Math.round(W*H/40000),.9,1.9,true),.1]];
  neb=nebulaTile();
  rocks=(C.rocks||[]).map(o=>({...o,shape:rockShape(o.r),rot:rnd()*6}));
  sats=(C.sats||[]).map(o=>({...o,t:rnd()*10}));
  belt=[];if(C.planet&&C.planet.belt){for(let i=0;i<260;i++)belt.push({a:rnd()*Math.PI*2,d:1.7+rnd()*.35,s:.5+rnd()*1.2,al:.2+rnd()*.5})}
}
function sphere(x,y,r,c1,c2,shadow=.75){
  const gr=ctx.createRadialGradient(x-r*.4,y-r*.45,r*.1,x,y,r);gr.addColorStop(0,c1);gr.addColorStop(1,c2);
  ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
  const sh=ctx.createLinearGradient(x-r,y-r,x+r,y+r);sh.addColorStop(.45,'rgba(3,6,14,0)');sh.addColorStop(1,`rgba(3,6,14,${shadow})`);
  ctx.fillStyle=sh;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();
  const rim=ctx.createRadialGradient(x,y,r*.92,x,y,r*1.08);rim.addColorStop(0,'rgba(160,190,255,0)');rim.addColorStop(.5,'rgba(160,190,255,.18)');rim.addColorStop(1,'rgba(160,190,255,0)');
  ctx.fillStyle=rim;ctx.beginPath();ctx.arc(x,y,r*1.08,0,7);ctx.fill();
}
function drawPlanet(sy,time){
  const P=C.planet;if(!P)return;
  const x=P.fx*W,y=P.y-sy*P.k,r=P.r;
  if(y<-r*3||y>H+r*3)return;
  const ring=(front)=>{if(!P.ring)return;ctx.save();ctx.translate(x,y);ctx.rotate(-.35);ctx.beginPath();
    if(front)ctx.rect(-r*3,0,r*6,r*3);else ctx.rect(-r*3,-r*3,r*6,r*3);ctx.clip();
    for(let i=0;i<3;i++){ctx.strokeStyle=`rgba(${P.ringColor},${.28-i*.07})`;ctx.lineWidth=r*(.09-i*.02);ctx.beginPath();ctx.ellipse(0,0,r*(1.6+i*.18),r*(.42+i*.05),0,0,7);ctx.stroke()}
    ctx.restore()};
  if(P.orbits){ctx.save();ctx.translate(x,y);ctx.rotate(-.2);ctx.strokeStyle='rgba(180,200,255,.10)';ctx.lineWidth=1;[2.2,3.1].forEach(k=>{ctx.beginPath();ctx.ellipse(0,0,r*k,r*k*.38,0,0,7);ctx.stroke()});ctx.restore()}
  if(belt.length){ctx.save();ctx.translate(x,y);ctx.rotate(-.2);belt.forEach(b=>{const a=b.a+time*.004;ctx.globalAlpha=b.al*(Math.sin(a)>0?1:.5);ctx.fillStyle='#c9c2b4';ctx.fillRect(Math.cos(a)*r*b.d,Math.sin(a)*r*b.d*.38,b.s,b.s)});ctx.restore();ctx.globalAlpha=1}
  ring(false);sphere(x,y,r,P.c1,P.c2,.8);
  if(P.bands){ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.clip();ctx.globalAlpha=.12;ctx.fillStyle=P.bands;for(let i=-3;i<=3;i++){ctx.fillRect(x-r,y+i*r*.26,r*2,r*.09)}ctx.restore();ctx.globalAlpha=1}
  ring(true);
  if(P.moon){const a=time*.05+1.2,mx=x+Math.cos(a)*r*2.2*Math.cos(-.2)-Math.sin(a)*r*2.2*.38*Math.sin(-.2),my=y+Math.cos(a)*r*2.2*Math.sin(-.2)+Math.sin(a)*r*2.2*.38*Math.cos(-.2);
    if(Math.sin(a)>-.15||Math.hypot(mx-x,my-y)>r) sphere(mx,my,r*.13,'#e9e6df','#6f6a63',.85)}
}
function drawRock(o,sy,time){
  let x=(o.x+time*o.vx)%(W+200);if(x<-100)x+=W+200;const y=o.y-sy*o.k+Math.sin(time*.1+o.x)*6;
  if(y<-60||y>H+60)return;
  ctx.save();ctx.translate(x,y);ctx.rotate(o.rot+time*o.spin);
  const gr=ctx.createLinearGradient(-o.r,-o.r,o.r,o.r);gr.addColorStop(0,'#8b8378');gr.addColorStop(1,'#2a2724');
  ctx.globalAlpha=o.a||.75;ctx.fillStyle=gr;ctx.beginPath();o.shape.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.arc(o.r*.2,o.r*.1,o.r*.22,0,7);ctx.fill();ctx.restore();ctx.globalAlpha=1;
}
function drawSat(o,sy,time){
  let x=(o.x+time*o.vx)%(W+120);if(x<-60)x+=W+120;const y=o.y-sy*o.k+time*o.vy;
  const yy=((y%(H+80))+H+80)%(H+80)-40;
  ctx.save();ctx.translate(x,yy);ctx.rotate(o.ang+Math.sin(time*.2)*.05);ctx.globalAlpha=o.a||.8;const s=o.s;
  ctx.fillStyle='#3c5a8c';ctx.fillRect(-s*3.2,-s*.55,s*2.2,s*1.1);ctx.fillRect(s,-s*.55,s*2.2,s*1.1);
  ctx.strokeStyle='rgba(160,190,240,.5)';ctx.lineWidth=.5;for(let i=1;i<3;i++){ctx.beginPath();ctx.moveTo(-s*3.2+i*s*.73,-s*.55);ctx.lineTo(-s*3.2+i*s*.73,s*.55);ctx.moveTo(s+i*s*.73,-s*.55);ctx.lineTo(s+i*s*.73,s*.55);ctx.stroke()}
  ctx.fillStyle='#c9ced6';ctx.fillRect(-s*.9,-s*.7,s*1.8,s*1.4);ctx.fillStyle='#8a929c';ctx.fillRect(-s*.9,s*.2,s*1.8,s*.5);
  if((time+o.t)%2.4<.25){ctx.fillStyle='#ff5a4e';ctx.beginPath();ctx.arc(0,-s*.9,s*.35,0,7);ctx.fill()}
  ctx.restore();ctx.globalAlpha=1;
}
let shoot=null,nextShoot=6;
function drawShoot(time){
  if(!C.shooting||reduce)return;
  if(!shoot&&time>nextShoot){shoot={x:W*(.55+Math.random()*.4),y:H*Math.random()*.4,t:time};nextShoot=time+14+Math.random()*10}
  if(!shoot)return;const p=(time-shoot.t)/1.1;if(p>1){shoot=null;return}
  const x=shoot.x-p*260,y=shoot.y+p*110,gr=ctx.createLinearGradient(x,y,x+90,y-38);
  gr.addColorStop(0,`rgba(255,255,255,${.7*(1-p)})`);gr.addColorStop(1,'rgba(255,255,255,0)');ctx.strokeStyle=gr;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+90,y-38);ctx.stroke();
}
let t0=performance.now();
function frame(now){
  const time=reduce?0:(now-t0)/1000,sy=scrollY;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=C.bg||'#060a13';ctx.fillRect(0,0,W,H);
  if(neb){const hh=H*2,oy=-((sy*.015)%hh);ctx.drawImage(neb,0,oy,W,hh);ctx.drawImage(neb,0,oy+hh,W,hh)}
  tiles.forEach(([c,k],i)=>{const oy=-((sy*k)%H);
    ctx.globalAlpha=i===2&&!reduce?.85+Math.sin(time*1.3)*.15:1;ctx.drawImage(c,0,oy,W,H);ctx.drawImage(c,0,oy+H,W,H)});
  ctx.globalAlpha=1;
  drawPlanet(sy,time);
  rocks.forEach(o=>drawRock(o,sy,time));
  sats.forEach(o=>drawSat(o,sy,time));
  drawShoot(time);
  if(!reduce)requestAnimationFrame(frame);
}
setup();requestAnimationFrame(frame);
addEventListener('resize',()=>{setup();if(reduce)requestAnimationFrame(frame)});
if(reduce)addEventListener('scroll',()=>requestAnimationFrame(frame),{passive:true});
})();
