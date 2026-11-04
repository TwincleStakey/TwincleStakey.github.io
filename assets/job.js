
(function(){
  // 별 배경
  var c=document.getElementById('sky'),x=c.getContext('2d');
  function draw(){
    var w=c.width=innerWidth*devicePixelRatio, h=c.height=innerHeight*devicePixelRatio;
    var s=7, n=Math.round(innerWidth*innerHeight/7000);
    function r(){s=(s*16807)%2147483647;return (s-1)/2147483646}
    x.clearRect(0,0,w,h);
    var g=x.createRadialGradient(w*.5,h*1.15,0,w*.5,h*1.15,h*.9);
    g.addColorStop(0,'rgba(150,210,90,.13)');g.addColorStop(1,'rgba(150,210,90,0)');
    x.fillStyle=g;x.fillRect(0,0,w,h);
    for(var i=0;i<n;i++){
      var px=r()*w,py=r()*h,big=r()>.93,sz=(big?1.6:(r()>.5?1:.7))*devicePixelRatio;
      x.globalAlpha=.15+r()*.6;x.fillStyle='#fff';x.beginPath();x.arc(px,py,sz,0,7);x.fill();
    }
    x.globalAlpha=1;
  }
  draw(); addEventListener('resize',draw);

  // 문제 해결: 자세히 보기 + 탭
  document.querySelectorAll('.prob').forEach(function(card){
    var btn=card.querySelector('.more'), det=card.querySelector('.detail');
    var tabs=det.querySelector('.tabs'), panels=[].slice.call(det.querySelectorAll('[role=tabpanel]'));
    var id=card.id, cur=0;
    var buttons=panels.map(function(p,i){
      var b=document.createElement('button');
      b.type='button';b.setAttribute('role','tab');b.id=id+'-t'+i;
      b.setAttribute('aria-controls',id+'-p'+i);p.id=id+'-p'+i;p.setAttribute('aria-labelledby',b.id);
      b.innerHTML='<span class="n">0'+(i+1)+'</span>'+p.dataset.label;
      b.addEventListener('click',function(){show(i);if(tabs.getBoundingClientRect().top<0)toTop()});
      tabs.appendChild(b);return b;
    });
    tabs.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){show(Math.min(cur+1,panels.length-1));buttons[cur].focus()}
      if(e.key==='ArrowLeft'){show(Math.max(cur-1,0));buttons[cur].focus()}
    });
    var foot=document.createElement('div');foot.className='panel-foot';
    foot.innerHTML='<button class="btn" type="button">← 이전</button><button class="btn primary" type="button">다음 →</button>';
    det.appendChild(foot);
    var prev=foot.children[0],next=foot.children[1];
    prev.addEventListener('click',function(){show(Math.max(cur-1,0));toTop()});
    next.addEventListener('click',function(){show(Math.min(cur+1,panels.length-1));toTop()});
    function toTop(){
      var nav=document.querySelector('.nav'),off=(nav?nav.offsetHeight:0)+12;
      var y=tabs.getBoundingClientRect().top+scrollY-off;
      var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
      scrollTo({top:y,behavior:reduce?'auto':'smooth'});
    }
    function show(i){
      cur=i;
      panels.forEach(function(p,j){p.hidden=j!==i});
      buttons.forEach(function(b,j){b.setAttribute('aria-selected',j===i);b.tabIndex=j===i?0:-1});
      prev.disabled=i===0;next.disabled=i===panels.length-1;
      prev.style.opacity=i===0?.4:1;next.style.opacity=i===panels.length-1?.4:1;
    }
    show(0);
    btn.addEventListener('click',function(){
      var open=det.hidden;det.hidden=!open;
      btn.setAttribute('aria-expanded',open);
      btn.textContent=open?'접기 ▴':'자세히 보기 ▾';
    });
  });
  document.querySelectorAll('.yt').forEach(function(box){
    var b=box.querySelector('.yt-play');
    b.addEventListener('click',function(){
      var f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+box.dataset.id+'?autoplay=1&rel=0';
      f.title=box.dataset.title;f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;
      box.innerHTML='';box.appendChild(f);
    });
  });
  addEventListener('beforeprint',function(){document.querySelectorAll('.detail').forEach(function(d){d.hidden=false;d.querySelectorAll('[role=tabpanel]').forEach(function(p){p.hidden=false})})});
})();
(function(){
  // 타자기 비교 데모
  var LINES=['냥냥.','냥냥냥.','냥냥 냥냥냥.','냥냥냥 냥. 냥냥냥냥.'];
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-tw]').forEach(function(wrap){
    var boxes=wrap.querySelectorAll('.box2'), clicks=wrap.querySelectorAll('.click');
    if(reduce){boxes.forEach(function(b){b.textContent=LINES.join('\n')});return}
    function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
    async function run(){
      while(true){
        var txt=['',''];
        boxes.forEach(function(b){b.textContent=''});
        for(var i=0;i<LINES.length;i++){
          if(i>0){clicks.forEach(function(c){c.classList.add('on')});await sleep(450);clicks.forEach(function(c){c.classList.remove('on')});}
          var line=LINES[i];
          if(i>0){txt[0]+=(txt[0]?'\n':'')+line;boxes[0].textContent=txt[0];}
          else{txt[0]='';}
          var pre1=txt[1]?txt[1]+'\n':'', pre0=txt[0];
          for(var k=1;k<=line.length;k++){
            boxes[1].textContent=pre1+line.slice(0,k);
            if(i===0){boxes[0].textContent=line.slice(0,k);}
            await sleep(120);
          }
          if(i===0) txt[0]=line;
          txt[1]=pre1+line;
          await sleep(500);
        }
        await sleep(1800);
      }
    }
    run();
  });
})();
(function(){
  var h=location.hash.slice(1);
  var card=h&&document.getElementById(h);
  if(card&&card.classList.contains('prob')){var b=card.querySelector('.more');if(b&&b.getAttribute('aria-expanded')==='false')b.click();setTimeout(function(){card.scrollIntoView()},50);addEventListener('load',function(){card.scrollIntoView()});}
})();
(function(){
  // 사진 확대
  var sel='.did-media img,.ba img,.show img,.loop img,.media-card img,.shots img,.prob-sum figure img,.try-media img,.lm img,.ba-pair img';
  document.querySelectorAll(sel).forEach(function(img){
    img.classList.add('zoomable');img.tabIndex=0;img.setAttribute('role','button');
    function open(){
      var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-label','확대한 사진');
      var big=document.createElement('img');big.src=img.currentSrc||img.src;big.alt=img.alt;
      var cap=document.createElement('p');cap.textContent=img.alt;
      var x=document.createElement('button');x.className='lb-close';x.type='button';x.textContent='닫기 ✕';
      var box=document.createElement('div');box.appendChild(big);box.appendChild(cap);
      lb.appendChild(x);lb.appendChild(box);document.body.appendChild(lb);x.focus();
      function close(){lb.remove();removeEventListener('keydown',esc);img.focus()}
      function esc(e){if(e.key==='Escape')close()}
      lb.addEventListener('click',close);addEventListener('keydown',esc);
    }
    img.addEventListener('click',open);
    img.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
  });
})();
(function(){
  // 별자리: 별에 올리면(포커스·탭) 카드. 카드는 화면 안쪽으로 붙인다
  var map=document.querySelector('.sky-map');if(!map)return;
  var stars=[].slice.call(map.querySelectorAll('.star')),GAP=12,last='';
  // 썸네일이 안 열리면 깨진 그림 대신 배경색
  map.querySelectorAll('.sc-thumb img').forEach(function(img){
    function bad(){img.parentNode.classList.add('noimg')}
    if(img.complete&&!img.naturalWidth)bad();else img.addEventListener('error',bad);
  });
  function place(a){
    var card=a.querySelector('.star-card'),dot=a.querySelector('.dot');if(!card||!dot)return;
    var m=map.getBoundingClientRect(),d=dot.getBoundingClientRect(),o=a.getBoundingClientRect();
    var W=card.offsetWidth,H=card.offsetHeight,lo=16,hi=document.documentElement.clientWidth-16;
    var cx=d.left+d.width/2,upper=(d.top+d.height/2-m.top)<m.height/2,x,y;
    if(d.right+GAP+W<=hi)x=d.right+GAP;
    else if(d.left-GAP-W>=lo)x=d.left-GAP-W;
    if(x!=null){y=upper?d.top-6:d.bottom+6-H}
    else{x=Math.max(lo,Math.min(cx-W/2,hi-W));y=upper?d.bottom+GAP:d.top-GAP-H}
    card.style.left=Math.round(x-o.left)+'px';card.style.top=Math.round(y-o.top)+'px';
  }
  function all(){stars.forEach(place)}
  function close(except){stars.forEach(function(s){if(s!==except)s.classList.remove('open')})}
  stars.forEach(function(a){
    a.addEventListener('mouseenter',function(){place(a)});
    a.addEventListener('focus',function(){place(a)});
    a.addEventListener('mouseleave',function(){a.classList.remove('hush')});
    a.addEventListener('blur',function(){a.classList.remove('hush','open')});
  });
  addEventListener('pointerdown',function(e){last=e.pointerType},true);
  addEventListener('keydown',function(e){
    last='key';
    if(e.key==='Escape')stars.forEach(function(s){if(s.classList.contains('open')||s.matches(':hover')||s===document.activeElement){s.classList.remove('open');s.classList.add('hush')}});
  },true);
  // 터치: 첫 탭은 카드만, 열린 카드(별)를 한 번 더 탭하면 링크로
  map.addEventListener('click',function(e){
    var a=e.target.closest('.star');if(!a||e.detail===0)return;
    var touch=last==='touch'||last==='pen'||(!last&&!matchMedia('(hover:hover)').matches);
    if(!touch||a.classList.contains('open'))return;
    e.preventDefault();close(a);place(a);a.classList.remove('hush');a.classList.add('open');
  });
  document.addEventListener('click',function(e){if(!e.target.closest||!e.target.closest('.sky-map .star'))close()});
  all();addEventListener('resize',all);addEventListener('load',all);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(all);
})();
(function(){
  // 지금 보고 있는 항목 표시 + 진행 바
  var ids=['project','bugs','bug-a','bug-b','bug-c','wip','works','contact'];
  var secs=ids.map(function(i){return document.getElementById(i)}).filter(Boolean);
  var links=[].slice.call(document.querySelectorAll('.nav ul a, .float a[href^="#"], .toc a'));
  var bar=document.querySelector('.progress i'), fl=document.querySelector('.float');
  var fabTxt=document.querySelector('.fab em');
  var names={project:'대표 프로젝트',bugs:'문제 해결','bug-a':'A 엔딩 크레딧','bug-b':'B 커서 실종','bug-c':'C 클릭 두 번',wip:'만들고 있는 것',works:'그 밖의 작업',contact:'연락'};
  var ticking=false;
  function update(){
    ticking=false;
    var y=scrollY+innerHeight*.35, cur=null;
    secs.forEach(function(s){if(s.getBoundingClientRect().top+scrollY<=y)cur=s.id});
    if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)cur='contact';
    var top=cur&&cur.indexOf('bug-')===0?'bugs':cur;
    links.forEach(function(a){var h=a.getAttribute('href').slice(1);a.classList.toggle('on',h===cur||h===top)});
    var max=document.documentElement.scrollHeight-innerHeight;
    if(bar)bar.style.transform='scaleX('+(max>0?scrollY/max:0)+')';
    var toc=document.querySelector('.toc');
    var past=toc?toc.getBoundingClientRect().bottom<0:true;
    if(fl)fl.classList.toggle('is-on',past&&!!cur);
    if(fabTxt)fabTxt.textContent=cur?names[cur]:'';
  }
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  addEventListener('resize',update);addEventListener('load',update);update();
  // 목차 버튼(모바일·B안)
  var fab=document.querySelector('.fab'),pop=document.querySelector('.pop');
  if(fab&&pop){
    fab.addEventListener('click',function(){var o=pop.hidden;pop.hidden=!o;fab.setAttribute('aria-expanded',o)});
    pop.addEventListener('click',function(e){if(e.target.closest('a')){pop.hidden=true;fab.setAttribute('aria-expanded','false')}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){pop.hidden=true;fab.setAttribute('aria-expanded','false')}});
    document.addEventListener('click',function(e){if(!e.target.closest('.float')){pop.hidden=true;fab.setAttribute('aria-expanded','false')}});
  }
})();

addEventListener('beforeprint',function(){document.querySelectorAll('details').forEach(function(d){d.open=true})});
