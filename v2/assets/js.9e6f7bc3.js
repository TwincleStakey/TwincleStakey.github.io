(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};


  /* 우주 배경: 별이 깜빡이고 가끔 하나씩 반짝 뜬다 */
  (function(){var c=document.getElementById('sky');if(!c||!c.getContext)return;var x=c.getContext('2d'),W,H,S=[],P=[],dpr=Math.min(2,window.devicePixelRatio||1);
    var still=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function rs(){W=c.width=innerWidth*dpr;H=c.height=innerHeight*dpr;c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';S=[];var n=Math.round(innerWidth*innerHeight/2600);
      for(var i=0;i<n;i++){var r=Math.random();S.push({x:Math.random()*W,y:Math.random()*H,s:(r<.92?.5+Math.random()*.8:1.2+Math.random()*1.2)*dpr,a:.25+Math.random()*.7,t:Math.random()*6.28,v:.4+Math.random()*1.6,c:Math.random()<.12?'#cfe8ff':(Math.random()<.08?'#e8ffd0':'#ffffff')})}}
    function pop(){P.push({x:Math.random()*W,y:Math.random()*H,life:0,max:1.6+Math.random()*1.4,s:(1.4+Math.random()*1.6)*dpr})}
    var last=0;function f(t){var dt=Math.min(.05,(t-last)/1000||0);last=t;x.clearRect(0,0,W,H);
      for(var i=0;i<S.length;i++){var s=S[i];x.globalAlpha=still?s.a:s.a*(.55+.45*Math.sin(s.t+t/1000*s.v));x.fillStyle=s.c;x.beginPath();x.arc(s.x,s.y,s.s,0,6.283);x.fill()}
      if(!still&&Math.random()<.035)pop();
      for(var j=P.length-1;j>=0;j--){var p=P[j];p.life+=dt;var k=p.life/p.max;if(k>=1){P.splice(j,1);continue}var a=Math.sin(k*Math.PI),r=p.s*(1+a);
        x.globalAlpha=a;x.fillStyle='#fff';x.beginPath();x.arc(p.x,p.y,r*.6,0,6.283);x.fill();x.globalAlpha=a*.7;x.strokeStyle='#dff3ff';x.lineWidth=dpr*.8;x.beginPath();x.moveTo(p.x-r*3,p.y);x.lineTo(p.x+r*3,p.y);x.moveTo(p.x,p.y-r*3);x.lineTo(p.x,p.y+r*3);x.stroke()}
      x.globalAlpha=1;if(!still&&!document.hidden)requestAnimationFrame(f)}
    addEventListener('resize',rs);document.addEventListener('visibilitychange',function(){if(!document.hidden&&!still)requestAnimationFrame(f)});rs();requestAnimationFrame(f);})();

  var burger=$('.nav .burger'), menu=$('.nav ul');
  if(burger&&menu){burger.addEventListener('click',function(){menu.classList.toggle('open')});
    $$('a',menu).forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open')})});}

  /* scroll spy: [data-spy] elements; book/pop highlight exact id, rail opens current chapter */
  var spies=$$('[data-spy]');
  var prog=$('.progress'), cur='';
  var l2=$$('.rail .s').map(function(a){return a.getAttribute('href').slice(1)});
  var l3=$$('.rail .s3').map(function(a){return a.getAttribute('href').slice(1)});
  function spy(){
    if(prog){var h=document.documentElement,max=h.scrollHeight-h.clientHeight;prog.style.transform='scaleX('+(max>0?h.scrollTop/max:0)+')';}
    if(!spies.length)return;
    var y=window.scrollY+140, el=null, sub='', sub3='';
    for(var i=0;i<spies.length;i++){var top=spies[i].getBoundingClientRect().top+window.scrollY;if(top<=y){el=spies[i];if(l2.indexOf(spies[i].id)>=0){sub=spies[i].id;sub3='';}if(l3.indexOf(spies[i].id)>=0)sub3=spies[i].id;}}
    var id=el?el.id:'', topId=el?(el.getAttribute('data-top')||el.id):'';
    var key=id+'|'+sub+'|'+sub3; if(key===cur)return; cur=key;
    $$('.book a, .pop a').forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+id)});
    $$('.nav li a').forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+topId)});
    $$('.rail .g').forEach(function(g){var on=g.getAttribute('data-ch')===topId;g.classList.toggle('on',on);
      $$('.s',g).forEach(function(a){a.classList.toggle('cur',on&&a.getAttribute('href')==='#'+sub)});
      $$('.s3w',g).forEach(function(w){w.classList.toggle('open',on&&w.getAttribute('data-for')===sub)});
      $$('.s3',g).forEach(function(a){a.classList.toggle('cur',on&&a.getAttribute('href')==='#'+sub3)});});
  }
  window.addEventListener('scroll',spy,{passive:true});window.addEventListener('resize',spy);spy();

  var fab=$('.fab'),pop=$('.pop');
  if(fab&&pop){fab.addEventListener('click',function(e){e.stopPropagation();pop.classList.toggle('open')});
    $$('a',pop).forEach(function(a){a.addEventListener('click',function(){pop.classList.remove('open')})});
    document.addEventListener('click',function(e){if(!pop.contains(e.target))pop.classList.remove('open')});}

  /* lazy videos */
  var vids=$$('video[data-src]');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;
      if(e.isIntersecting){if(!v.src){v.src=v.getAttribute('data-src');v.load();}if(v.hasAttribute('loop')){v.play().catch(function(){})}}
      else if(v.hasAttribute('loop')&&!v.paused){v.pause()}})},{rootMargin:'200px 0px'});
    vids.forEach(function(v){io.observe(v)});
  }else{vids.forEach(function(v){v.src=v.getAttribute('data-src')})}

  $$('.chapters button').forEach(function(b){b.addEventListener('click',function(){
    var v=document.getElementById(b.getAttribute('data-for'));if(!v)return;
    if(!v.src&&v.getAttribute('data-src')){v.src=v.getAttribute('data-src');}
    v.currentTime=parseFloat(b.getAttribute('data-t'))||0;v.play().catch(function(){});
  })});

  var more=$('.more-btn');if(more){more.addEventListener('click',function(){var s=$('.strip');s.classList.remove('hid');more.remove();})}

  var lb=document.createElement('div');lb.className='lb';var lbi=document.createElement('img');lb.appendChild(lbi);document.body.appendChild(lb);
  document.addEventListener('click',function(e){var t=e.target.closest('img.zoom, .legacy figure img, .legacy .media-card img, .legacy .ba-block img, .legacy .try-media img');if(!t)return;lbi.src=t.currentSrc||t.src;lb.classList.add('open');});
  lb.addEventListener('click',function(){lb.classList.remove('open');lbi.src='';});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){lb.classList.remove('open');if(pop)pop.classList.remove('open');}});

  /* 목차 이동: 접힌 곳은 펼치고, 이동하는 동안 위쪽 그림·영상이 늦게 불러와져 자리가 밀리면 다시 맞춘다 */
  var NAVH=76, fixT=0;
  function goTo(id, smooth){
    var el=document.getElementById(id); if(!el) return false;
    var p=el.closest('details'); while(p){p.open=true;p=p.parentElement&&p.parentElement.closest('details')}
    function y(){return el.getBoundingClientRect().top+window.scrollY-NAVH}
    window.scrollTo({top:y(),behavior:smooth?'smooth':'auto'});
    var t0=performance.now(), last=-1; cancelAnimationFrame(fixT);
    (function chk(){
      var now=performance.now(), want=y();
      if(now-t0>(smooth?700:0) && Math.abs(window.scrollY-want)>3){ window.scrollTo({top:want,behavior:'auto'}); }
      if(now-t0<2500) fixT=requestAnimationFrame(chk);
    })();
    var stop=function(){cancelAnimationFrame(fixT);window.removeEventListener('wheel',stop);window.removeEventListener('touchstart',stop);window.removeEventListener('keydown',stop)};
    window.addEventListener('wheel',stop,{passive:true});window.addEventListener('touchstart',stop,{passive:true});window.addEventListener('keydown',stop);
    return true;
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href^="#"]'); if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey) return;
    var id=decodeURIComponent(a.getAttribute('href').slice(1)); if(!id) return;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(goTo(id,!reduce)){ e.preventDefault(); history.pushState(null,'','#'+id); }
  });
  window.addEventListener('beforeprint',function(){$$('details').forEach(function(d){d.open=true})});
  function openHash(){var h=location.hash;if(h)goTo(decodeURIComponent(h.slice(1)),false)}
  window.addEventListener('popstate',openHash);if(location.hash)window.addEventListener('load',openHash);
})();
