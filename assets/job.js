
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
})();
