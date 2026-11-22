// 시안 공용 그림: <div class="fig" data-svg="이름"></div> 자리에 그려 넣는다
(function(){
const F="font-family:Pretendard,sans-serif";
const t=(x,y,s,o={})=>`<text x="${x}" y="${y}" font-size="${o.size||13}" fill="${o.fill||'#1f2328'}" ${o.anchor?`text-anchor="${o.anchor}"`:''} ${o.weight?`font-weight="${o.weight}"`:''} style="${F}">${s}</text>`;
const box=(x,y,w,h,o={})=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r??6}" fill="${o.fill||'#fff'}" stroke="${o.stroke||'#c9ced6'}" stroke-width="${o.sw||1.2}" ${o.dash?'stroke-dasharray="4 3"':''}/>`;
const arrow=(x1,y1,x2,y2,c='#6e7781',id='a')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="1.8" marker-end="url(#${id})"/>`;
const defs=`<defs>
<marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#6e7781"/></marker>
<marker id="g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#3f8a1f"/></marker>
<marker id="r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#c3402b"/></marker></defs>`;
const svg=(w,h,body)=>`<svg viewBox="0 0 ${w} ${h}" role="img">${defs}${body}</svg>`;

const FIGS={
// 0. 되감기: 비도 한 발을 두 PC에서 본 모습, 세 칸
rewind:{cap:"되감기 = 지연 보상(Lag Compensation). 공격자 화면에서 맞은 공격은 맞는 쪽 PC에서도 맞게 하는 것이 목적",svg:(()=>{
 const R="#c3402b",G="#3f8a1f",B="#2f6fb5",M="#6e7781";
 const atk=`<circle cx="60" cy="26" r="11" fill="#1f2328"/>`+t(78,30,"공격자",{size:12.5,weight:700});
 const ghost=`<circle cx="60" cy="140" r="14" fill="#eaf2fb" stroke="${B}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
 const now=`<circle cx="176" cy="140" r="14" fill="${B}"/>`+t(176,116,"맞는 쪽",{anchor:"middle",size:12.5,weight:700,fill:B});
 const trail=c=>[84,102,120,138,154].map(x=>`<circle cx="${x}" cy="140" r="2.6" fill="${c}"/>`).join("");
 const knife=(c,id)=>`<line x1="60" y1="40" x2="60" y2="122" stroke="${c}" stroke-width="2.2" marker-end="url(#${id})"/>`+t(50,84,"비도",{anchor:"end",size:12,fill:M});
 const times=t(60,174,"0.1~0.17초 전",{anchor:"middle",size:11.5,fill:M})+t(176,174,"지금",{anchor:"middle",size:11.5,fill:M,weight:700});
 const sv=b=>`<svg viewBox="16 8 196 194" role="img">${defs}${b}</svg>`;
 const p1=sv(atk+knife("#1f2328","a")+
  ghost+t(84,136,"맞는 쪽",{size:12.5,weight:700,fill:B})+t(84,153,"(0.1~0.17초 전 모습)",{size:11.5,fill:M})+
  t(60,176,"명중",{anchor:"middle",size:12.5,weight:700,fill:G}));
 const p2=sv(atk+knife("#1f2328","a")+ghost+trail("#b6bec8")+now+times+
  `<path d="M53 133 L67 147 M67 133 L53 147" stroke="${R}" stroke-width="2.2"/>`+
  t(118,128,"이동 →",{anchor:"middle",size:11.5,fill:M})+
  `<circle cx="176" cy="140" r="20" fill="none" stroke="${R}" stroke-width="2.2"/>`+
  t(60,192,"비도 도착 · 빈자리",{anchor:"middle",size:12,weight:700,fill:R})+t(176,192,"판정 위치",{anchor:"middle",size:12,weight:700,fill:R}));
 const p3=sv(atk+knife("#1f2328","a")+ghost+trail(G)+now+times+
  `<path d="M160 131 C 140 100, 100 100, 79 126" fill="none" stroke="${G}" stroke-width="2" marker-end="url(#g)"/>`+t(120,97,"되감기",{anchor:"middle",size:12.5,weight:700,fill:G})+
  t(120,161,"12ms마다 기록",{anchor:"middle",size:10.5,fill:G})+
  `<circle cx="60" cy="140" r="20" fill="none" stroke="${G}" stroke-width="2.2"/>`+
  t(60,192,"판정 위치 · 명중",{anchor:"middle",size:12,weight:700,fill:G}));
 const step=(n,title,tag,cls,sv,txt)=>`<div class="step"><b class="st">${n} ${title}</b><i class="tg ${cls}">${tag}</i>${sv}<p>${txt}</p></div>`;
 return `<div class="lead2">비도(던지는 암기) 한 발을 두 PC에서 본 모습 <span>점선 원 = 과거 위치, 파란 원 = 지금 위치</span></div><div class="trio">`+
  step("①","공격자 PC 화면","화면에서는 명중","good",p1,"비도가 상대에게 맞은 것으로 보임. 단, 네트워크 지연 때문에 화면 속 상대는 0.1~0.17초 전 모습(점선 원)")+
  step("②","맞는 쪽 PC · 되감기 전","빗나감","bad",p2,"판정은 맞는 쪽 PC 담당. 내 캐릭터의 지금 위치로 판정하면, 비도가 도착한 곳은 이미 떠난 빈자리라 피해 없음")+
  step("③","맞는 쪽 PC · 되감기 후","명중","good",p3,"12ms마다 기록해 둔 내 위치 중 공격자가 보던 시점의 위치를 꺼내 판정. 되감는 시간 = 공격자 편도 지연 + 보간 버퍼(최대 0.25초)")+
 `</div>`})()
},
// 라멘가게: 내 코드와 팀원 코드의 경계
bound:{cap:"내 코드와 팀원 코드는 함수 하나로만 만남",svg:`<div class="bd"><div class="g"><b>내 코드</b><div class="row"><div class="bx">Bowl<i>담긴 재료</i></div><span class="ar"></span><div class="bx">GameManager<i>화면 흐름</i></div></div></div><span class="ar"></span><div class="lk">EvaluateRamen()<i>접점 함수 하나</i></div><span class="ar"></span><div class="g"><b>팀원 코드</b><div class="row"><div class="bx">RamenCalculator<i>채점</i></div><span class="ar"></span><div class="bx">DayManager<i>일차 · 정산</i></div></div></div></div>`},
// 1. 문제: 에디터에서 재면 흔들리고, 빌드에서 재면 안정
range: {cap:"에디터에서는 값이 흔들려 원인 확인 불가", svg:svg(520,210,
 t(0,22,"비도 판정 일치율",{weight:700,size:14})+
 `<line x1="130" y1="170" x2="500" y2="170" stroke="#c9ced6"/>`+
 [0,25,50,75,100].map(v=>`<line x1="${130+v*3.7}" y1="166" x2="${130+v*3.7}" y2="174" stroke="#c9ced6"/>`+t(130+v*3.7,192,v+"%",{size:11,fill:"#6e7781",anchor:"middle"})).join("")+
 t(0,78,"에디터에서 측정",{size:13})+
 `<rect x="${130+38*3.7}" y="64" width="${22*3.7}" height="18" rx="3" fill="#f2c9c1"/>`+t(130+60*3.7+10,78,"38~60% · 잴 때마다 다름",{size:12.5,fill:"#c3402b"})+
 t(0,122,"개발 빌드 두 개",{size:13})+t(0,140,"(출발점 고친 뒤)",{size:11.5,fill:"#6e7781"})+
 `<circle cx="${130+91*3.7}" cy="125" r="8" fill="#3f8a1f"/>`+t(130+91*3.7-14,129,"91%",{size:12.5,fill:"#3f8a1f",anchor:"end",weight:700})
)},
// 2. 측정 방법
measure:{cap:"같은 PC에 개발 빌드 창 두 개, 지연을 일부러 걸고 봇끼리 대전",svg:svg(520,250,
 box(8,8,504,234,{fill:"#fbfcfd",dash:1})+t(20,30,"PC 한 대",{size:12,fill:"#6e7781"})+
 box(30,46,190,110)+t(125,70,"방장 창",{anchor:"middle",weight:700})+t(125,94,"-host -autoplay",{anchor:"middle",size:12,fill:"#2f6fb5"})+t(125,116,"봇이 조종",{anchor:"middle",size:12,fill:"#6e7781"})+
 box(300,46,190,110)+t(395,70,"게스트 창",{anchor:"middle",weight:700})+t(395,94,"-join -autoplay",{anchor:"middle",size:12,fill:"#2f6fb5"})+t(395,116,"봇이 조종",{anchor:"middle",size:12,fill:"#6e7781"})+
 arrow(222,92,298,92)+arrow(298,112,222,112)+t(260,84,"60±10ms",{anchor:"middle",size:11.5,fill:"#c3402b"})+t(260,132,"지연 시뮬",{anchor:"middle",size:11,fill:"#6e7781"})+
 box(30,178,460,44,{fill:"#f3f8ee",stroke:"#a9d27a"})+t(260,205,"-netprobe · 5초마다 \"내 화면에서 닿음 → 실제로 맞음\" 일치율 기록",{anchor:"middle",size:12.5,fill:"#2e6b1a"})
)},
// 3. 원인: 던지는 사람 화면만 지금 자리에서 출발
cause:{cap:"걸으며 던지면, 던지는 사람 화면의 비도만 다른 자리에서 출발",svg:svg(520,260,
 `<line x1="40" y1="215" x2="300" y2="215" stroke="#c9ced6" stroke-dasharray="3 3"/>`+
 `<circle cx="80" cy="215" r="13" fill="#fff" stroke="#6e7781" stroke-width="1.5"/>`+t(80,248,"던진 순간",{anchor:"middle",size:12,fill:"#6e7781"})+
 `<circle cx="250" cy="215" r="13" fill="#1f2328"/>`+t(250,248,"조금 뒤 (걸어서 이동)",{anchor:"middle",size:12})+
 arrow(100,215,232,215)+
 `<path d="M80 200 L170 40" stroke="#3f8a1f" stroke-width="2.4" fill="none" marker-end="url(#g)"/>`+
 `<path d="M250 200 L340 40" stroke="#c3402b" stroke-width="2.4" fill="none" stroke-dasharray="6 4" marker-end="url(#r)"/>`+
 `<line x1="176" y1="58" x2="330" y2="58" stroke="#1f2328" stroke-width="1"/>`+t(253,52,"최대 0.8m",{anchor:"middle",size:12.5,weight:700})+
 t(360,90,"다른 화면들",{size:13,fill:"#3f8a1f",weight:700})+t(360,110,"던진 순간 자리에서 출발",{size:12,fill:"#3f8a1f"})+
 t(360,150,"던지는 사람 화면",{size:13,fill:"#c3402b",weight:700})+t(360,170,"'지금 자리'에서 출발",{size:12,fill:"#c3402b"})
)},
// 4. 해결: 쏘는 사람이 출발점·걸음을 보낸다
fix:{cap:"출발점과 걸음 속도를 한 번 보내고, 모든 화면이 같은 식으로 자리 계산",svg:svg(520,240,
 box(10,80,150,80,{fill:"#fff"})+t(85,108,"던지는 사람",{anchor:"middle",weight:700})+t(85,130,"출발점 from",{anchor:"middle",size:12,fill:"#2f6fb5"})+t(85,148,"걸음 vel",{anchor:"middle",size:12,fill:"#2f6fb5"})+
 arrow(162,120,232,50,'#3f8a1f','g')+arrow(162,120,232,120,'#3f8a1f','g')+arrow(162,120,232,190,'#3f8a1f','g')+t(196,100,"RPC",{anchor:"middle",size:11.5,fill:"#3f8a1f",weight:700})+
 [["방장 화면",50],["게스트 1 화면",120],["게스트 2 화면",190]].map(([n,y])=>box(236,y-24,270,48,{fill:"#f3f8ee",stroke:"#a9d27a"})+t(250,y-3,n,{size:12.5,weight:700})+t(250,y+15,"At(t) = from + vel × t",{size:12,fill:"#2e6b1a"})).join("")
)},
// 구조: 누가 무엇을 정하나
who:{cap:"판 흐름 · 체력은 방장, 피격 판정은 맞는 쪽, 출발점은 쏘는 쪽이 결정",svg:svg(560,300,
 `<g id="g-shooter">`+box(10,40,160,150)+t(90,66,"쏘는 쪽 PC",{anchor:"middle",weight:700})+t(24,96,"· 투사체 출발점",{size:12.5})+t(24,118,"· 투사체 방향",{size:12.5})+`</g>`+
 `<g id="g-victim">`+box(200,40,160,150)+t(280,66,"맞는 쪽 PC",{anchor:"middle",weight:700})+t(214,96,"· 맞았는지 (되감기)",{size:12.5})+t(214,118,"· 막기 · 튕겨내기",{size:12.5})+t(214,140,"· 기 · 자세",{size:12.5})+`</g>`+
 `<g id="g-host">`+box(390,40,160,150)+t(470,66,"방장 PC",{anchor:"middle",weight:700})+t(404,96,"· 판 흐름",{size:12.5})+t(404,118,"· 체력",{size:12.5})+t(404,140,"· 점수 · 결과",{size:12.5})+t(404,162,"· 봇 조종",{size:12.5})+`</g>`+
 arrow(172,90,198,90)+t(185,30,"출발점 · 방향",{anchor:"middle",size:11.5,fill:"#2f6fb5"})+t(185,16,"ThrowRpc → 모든 PC",{anchor:"middle",size:10.5,fill:"#6e7781"})+
 arrow(362,110,388,110)+t(375,214,"맞았다 · 피해량",{anchor:"middle",size:11.5,fill:"#2f6fb5"})+t(375,228,"ReportHitRpc",{anchor:"middle",size:10.5,fill:"#6e7781"})+`<line x1="375" y1="112" x2="375" y2="200" stroke="#c9ced6" stroke-dasharray="2 3"/>`+
 `<path d="M470 192 C470 280 90 280 90 192" fill="none" stroke="#6e7781" stroke-width="1.8" marker-end="url(#a)"/>`+`<line x1="280" y1="262" x2="280" y2="194" stroke="#6e7781" stroke-width="1.4" marker-end="url(#a)"/>`+t(300,292,"체력 · 판 흐름 (NetworkVariable) → 모든 PC",{anchor:"middle",size:11.5,fill:"#2f6fb5"})
)},
// 구조: 코드 덩어리
chunks:{cap:"네트워크를 타는 클래스는 둘뿐, 나머지는 화면 전용이다",svg:svg(520,250,
 box(10,10,240,150,{fill:"#fff",stroke:"#2f6fb5"})+t(24,34,"Duelist · 협객 하나",{weight:700})+t(24,52,"파일 22개 (partial)",{size:12,fill:"#6e7781"})+
 ["공통: 이동 · 공격 · 판정","문파 6개","경지","활약 · 처치"].map((s,i)=>box(24,64+i*22,212,18,{r:3,fill:"#eef4fb",stroke:"#c7d9ee"})+t(32,77+i*22,s,{size:11.5})).join("")+
 box(270,10,240,150,{fill:"#fff",stroke:"#2f6fb5"})+t(284,34,"DuelGame · 판 하나",{weight:700})+t(284,52,"파일 5개 (partial)",{size:12,fill:"#6e7781"})+
 ["흐름 · 부활","랭크","결과","UI"].map((s,i)=>box(284,64+i*22,212,18,{r:3,fill:"#eef4fb",stroke:"#c7d9ee"})+t(292,77+i*22,s,{size:11.5})).join("")+
 box(10,186,500,54,{fill:"#f5f7f9",dash:1})+t(260,208,"화면 전용 · 네트워크 없음 · 약 210개",{anchor:"middle",weight:700,size:13})+t(260,228,"이펙트 · 소리 · 지형 모습 · HUD → 위 두 클래스의 값을 읽기만",{anchor:"middle",size:12,fill:"#6e7781"})+
 arrow(130,184,130,163)+arrow(390,184,390,163)
)}
};
window.FIGS=FIGS;
document.querySelectorAll('.fig[data-svg]').forEach(el=>{const f=FIGS[el.dataset.svg];if(!f)return;el.innerHTML=f.svg+`<div class="cap">${f.cap}</div>`});

// 공용 코드 블록
window.CODE=`<div class="code"><div class="hd">Duelist.cs · ThrowRpc / ThrowRoutine (요약)</div><ol>
<li><span class="c">// 던지는 사람: 지금 자리와 걸음 속도를 같이 전송</span></li>
<li class="hi">ThrowRpc(aim, id, transform.position, walkVelocity, OneWay, comboIndex);</li>
<li></li>
<li>[Rpc(SendTo.NotMe)]</li>
<li><span class="k">void</span> <span class="f">ThrowRpc</span>(Vector3 aim, <span class="k">int</span> id, Vector3 from, Vector3 vel, <span class="k">float</span> sentLag, <span class="k">int</span> combo)</li>
<li>    => BeginThrow(aim, id, from, vel, Late(sentLag), combo);</li>
<li></li>
<li><span class="c">// 모든 화면이 같은 식으로 t초 뒤 자리 계산</span></li>
<li class="hi">Vector3 <span class="f">At</span>(<span class="k">float</span> t) => DuelGame.Instance.MoveOnGround(from, from + vel * t, hitRadius);</li>
</ol></div>
<ul class="notes"><li><span>2</span>던지는 순간의 자리(from)와 걸음(vel)을 RPC 하나에 담아 전송</li><li><span>4–6</span>받는 쪽은 늦게 받은 시간(Late)만큼 예고를 줄이고 같은 자리에서 시작</li><li><span>9</span>걸으며 던져도 모든 화면이 같은 식으로 자리를 계산해 궤적이 갈라지지 않음</li></ul>`;
document.querySelectorAll('[data-code]').forEach(el=>el.innerHTML=window.CODE);
})();
