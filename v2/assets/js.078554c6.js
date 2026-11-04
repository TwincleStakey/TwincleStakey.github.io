(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  var burger=$('.nav .burger'), menu=$('.nav ul');
  if(burger&&menu){burger.addEventListener('click',function(){menu.classList.toggle('open')});
    $$('a',menu).forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open')})});}

  /* scroll spy: every [data-spy] element; rail/nav match its data-top */
  var spies=$$('[data-spy]');
  var prog=$('.progress'), cur='';
  function spy(){
    if(prog){var h=document.documentElement,max=h.scrollHeight-h.clientHeight;prog.style.transform='scaleX('+(max>0?h.scrollTop/max:0)+')';}
    if(!spies.length)return;
    var y=window.scrollY+140, el=null;
    for(var i=0;i<spies.length;i++){var top=spies[i].getBoundingClientRect().top+window.scrollY;if(top<=y)el=spies[i];}
    var id=el?el.id:'', topId=el?(el.getAttribute('data-top')||el.id):'';
    if(id===cur)return;cur=id;
    $$('.tree a, .pop a').forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+id)});
    $$('.rail a, .nav li a').forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+topId)});
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

  window.addEventListener('beforeprint',function(){$$('details').forEach(function(d){d.open=true})});
  function openHash(){var h=location.hash;if(!h)return;var el=document.getElementById(decodeURIComponent(h.slice(1)));if(!el)return;var p=el.closest('details');while(p){p.open=true;p=p.parentElement&&p.parentElement.closest('details')}}
  window.addEventListener('hashchange',openHash);openHash();
})();
