(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* nav burger */
  var burger=$('.nav .burger'), menu=$('.nav ul');
  if(burger&&menu){burger.addEventListener('click',function(){menu.classList.toggle('open')});
    $$('a',menu).forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open')})});}

  /* progress bar */
  var prog=$('.progress');
  function onScroll(){
    if(prog){var h=document.documentElement,max=h.scrollHeight-h.clientHeight;prog.style.transform='scaleX('+(max>0?h.scrollTop/max:0)+')';}
    spy();
  }

  /* scroll spy over [data-spy] sections → .toc, .rail, .pop, nav */
  var spyIds=$$('[data-spy]').map(function(el){return el.id});
  var links=$$('.toc a, .rail a, .pop a');
  var cur='';
  function spy(){
    if(!spyIds.length)return;
    var y=window.scrollY+120, id=spyIds[0];
    for(var i=0;i<spyIds.length;i++){var el=document.getElementById(spyIds[i]);if(el&&el.offsetTop<=y)id=spyIds[i];}
    if(id===cur)return;cur=id;
    links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+id)});
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* fab popup */
  var fab=$('.fab'),pop=$('.pop');
  if(fab&&pop){fab.addEventListener('click',function(){pop.classList.toggle('open')});
    $$('a',pop).forEach(function(a){a.addEventListener('click',function(){pop.classList.remove('open')})});
    document.addEventListener('click',function(e){if(!pop.contains(e.target)&&e.target!==fab)pop.classList.remove('open')});}

  /* lazy videos: load src when near; autoplay loops only when visible */
  var vids=$$('video[data-src]');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;
      if(e.isIntersecting){if(!v.src){v.src=v.getAttribute('data-src');v.load();}if(v.hasAttribute('loop')){v.play().catch(function(){})}}
      else if(v.hasAttribute('loop')&&!v.paused){v.pause()}})},{rootMargin:'200px 0px'});
    vids.forEach(function(v){io.observe(v)});
  }else{vids.forEach(function(v){v.src=v.getAttribute('data-src')})}

  /* chapters */
  $$('.chapters button').forEach(function(b){b.addEventListener('click',function(){
    var v=document.getElementById(b.getAttribute('data-for'));if(!v)return;
    if(!v.src&&v.getAttribute('data-src')){v.src=v.getAttribute('data-src');}
    v.currentTime=parseFloat(b.getAttribute('data-t'))||0;v.muted=false;v.play().catch(function(){});
    v.scrollIntoView({block:'center',behavior:'smooth'});
  })});

  /* more tiles */
  var more=$('.more-btn');if(more){more.addEventListener('click',function(){var s=$('.strip');s.classList.remove('hid');more.remove();})}

  /* lightbox for .zoom images */
  var lb=document.createElement('div');lb.className='lb';var lbi=document.createElement('img');lb.appendChild(lbi);document.body.appendChild(lb);
  document.addEventListener('click',function(e){var t=e.target.closest('img.zoom');if(!t)return;lbi.src=t.currentSrc||t.src;lb.classList.add('open');});
  lb.addEventListener('click',function(){lb.classList.remove('open');lbi.src='';});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){lb.classList.remove('open');if(pop)pop.classList.remove('open');}});

  /* open details when printing / when hash targets inside */
  window.addEventListener('beforeprint',function(){$$('details').forEach(function(d){d.open=true})});
  function openHash(){var h=location.hash;if(!h)return;var el=document.getElementById(h.slice(1));if(!el)return;var p=el.closest('details');while(p){p.open=true;p=p.parentElement&&p.parentElement.closest('details')}}
  window.addEventListener('hashchange',openHash);openHash();
})();
