(function(){
/* MUSIC: put your file in the music folder and change SRC if you rename it */
const SRC='audio/music.mp3',VOL=0.8;
const a=new Audio(SRC);a.loop=true;a.preload='auto';a.volume=0;
let started=false;
function fade(){let v=0;const t=setInterval(()=>{v=Math.min(VOL,v+0.04);a.volume=v;if(v>=VOL)clearInterval(t)},120)}
function start(){if(started)return;a.play().then(()=>{started=true;fade();off()}).catch(()=>{})}
const ev=['pointerdown','touchend','click','keydown'];
function off(){ev.forEach(e=>removeEventListener(e,start,true))}
ev.forEach(e=>addEventListener(e,start,true));
start();
})();
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* PHOTO SLIDER: auto fade, delay is 4200 (ms) */
(function(){const s=[...document.querySelectorAll('.sl')];if(!s.length)return;let i=0;
function go(n){i=(n+s.length)%s.length;s.forEach((e,k)=>e.className='sl'+(k==i?' c':''))}
go(0);setInterval(()=>go(i+1),4200);
})();

/* GOOGLE MAP BOX: edit address (shown on the map) and link (opened by the button; leave '' to use the address) */
(function(){const MAP={address:'',link:'https://maps.app.goo.gl/9dpF9BxSAyNDHojN9?g_st=ic'};
const q=encodeURIComponent(MAP.address);
document.getElementById('mapaddr').textContent=MAP.address;
document.getElementById('maplink').href=MAP.link||'https://www.google.com/maps/search/?api=1&query='+q;})();

/* ITINERARY: draws icons, fills the line while scrolling, highlights the current row */
(function(){const tl=document.querySelector('.tl');if(!tl)return;const rows=[...tl.querySelectorAll('.row')];
tl.querySelectorAll('svg *').forEach(e=>e.setAttribute('pathLength','1'));
function upd(){const r=tl.getBoundingClientRect(),mid=innerHeight*.6;
tl.style.setProperty('--p',Math.max(0,Math.min(1,(mid-r.top)/r.height)));
let best=null,bd=1e9;rows.forEach(w=>{const b=w.getBoundingClientRect(),d=Math.abs(b.top+b.height/2-mid);if(d<bd){bd=d;best=w}w.classList.remove('cur')});
if(best&&r.top<mid&&r.bottom>mid*.6)best.classList.add('cur')}
addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();})();

(function(){
function parts(t,km){return t.split(/(\s+)/).filter(Boolean).map(x=>({t:x,w:!/^\s+$/.test(x)}))}
function split(el){const km=!!el.closest('[lang="km"]');let i=0;const tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),L=[];
while(tw.nextNode())L.push(tw.currentNode);
L.forEach(nd=>{if(!nd.nodeValue.trim())return;const f=document.createDocumentFragment();
parts(nd.nodeValue,km).forEach(p=>{if(p.w){const s=document.createElement('span');s.className='w';s.style.setProperty('--i',i++);s.textContent=p.t;f.appendChild(s)}else f.appendChild(document.createTextNode(p.t))});
nd.replaceWith(f)});el.classList.add('wv')}
const io2=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io2.unobserve(x.target)}}),{threshold:.2});
document.querySelectorAll('.story h2,.story .kh,.iti h2,.when b,.when span,.loc h2,.loc .kh,footer').forEach(el=>{split(el);io2.observe(el)});
[['.names',400],['.tag',3300]].forEach(([q,d])=>{const el=document.querySelector(q);if(el){split(el);setTimeout(()=>el.classList.add('on'),d)}});
})();

/* STORY SLIDER: swipe / drag with finger or mouse, tap the dots, auto-plays every 2.5s */
(function(){const box=document.querySelector('.hs');if(!box)return;
const tr=box.querySelector('.hs-track'),n=tr.children.length,d=[...box.querySelectorAll('.hs-dots i')];
let i=0,x0=0,dx=0,drag=false,t;
function set(k){i=Math.max(0,Math.min(n-1,k));tr.style.transform='translateX(-'+i*100+'%)';d.forEach((e,j)=>e.className=j==i?'c':'')}
function auto(){clearInterval(t);t=setInterval(()=>set(i>=n-1?0:i+1),2500)}
set(0);auto();
box.addEventListener('pointerdown',e=>{drag=true;x0=e.clientX;dx=0;box.classList.add('drag');try{box.setPointerCapture(e.pointerId)}catch(_){}clearInterval(t)});
box.addEventListener('pointermove',e=>{if(!drag)return;dx=e.clientX-x0;let o=dx;if((i==0&&dx>0)||(i==n-1&&dx<0))o=dx*.3;tr.style.transform='translateX(calc(-'+i*100+'% + '+o+'px))'});
function end(){if(!drag)return;drag=false;box.classList.remove('drag');set(Math.abs(dx)>box.clientWidth*.15?i+(dx<0?1:-1):i);auto()}
['pointerup','pointercancel'].forEach(ev=>box.addEventListener(ev,end));
d.forEach((e,j)=>e.addEventListener('click',ev=>{ev.stopPropagation();set(j);auto()}));
})();

