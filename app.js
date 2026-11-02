const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[Math.random()*a.length|0];
/* Link riêng: địa chỉ máy chủ và khoá nằm sau dấu #, trình duyệt không gửi phần này lên GitHub */
const CF=(()=>{let c={};try{c=JSON.parse(localStorage.getItem('gt_cfg')||'{}')}catch(e){}const h=new URLSearchParams(location.hash.slice(1));
 if(h.get('k')){c.k=h.get('k');c.u=h.get('u');if(h.has('duyet'))c.duyet=h.get('duyet')==='1';try{localStorage.setItem('gt_cfg',JSON.stringify(c))}catch(e){}history.replaceState(null,'',location.pathname)}return c})();
/* Bài mới từ Sheet, lưu sẵn trên máy để mở là có ngay */
let KHO_MOI=[];try{KHO_MOI=JSON.parse(localStorage.getItem('gt_kho')||'[]')}catch(e){}
function apKho(ds){const bai=[];ds.forEach(m=>{const d=m.data;if(m.loai==='bai')bai.push(d);else if(m.loai==='riddle')RIDDLES.push(d);else if(m.loai==='order')ORDERS.push(d);else if(m.loai==='tip')TIPS.push(d);else if(m.loai==='speak'){SPEAK.push(d.slice(0,9));NATURAL.push(d[9]||null)}else if(m.loai==='chat')CHATS.push(d)});
 if(bai.length){bai.forEach(b=>Object.assign(LV,b.lv||{}));WORLDS.push({id:'w6',name:'Bài mới mỗi tuần',zh:'每周新课',e:'🌟',c:'#0FA3B1',d:'#0B7C87',cap:'Cấp 1–3',goal:'Từ mới được thêm hằng tuần',game:{g:'word',n:'Săn từ tuần này'},boss:{e:'🦁',n:'Sư tử múa'},lessons:bai.map(b=>({t:b.t,e:b.e,w:b.w}))})}}
apKho(KHO_MOI);
WORLDS.forEach(W=>W.lessons.forEach(L=>{L.words=L.w.split('\n').map(l=>{const[h,p,v,e,c,cp,cv]=l.split('|');return{h,p,v,e,c,cp,cv,world:W.id,lv:LV[h]||0}})}));
const ALL=WORLDS.flatMap(W=>W.lessons.flatMap(L=>L.words));
const byH=Object.fromEntries(ALL.map(w=>[w.h,w]));
const worldWords=W=>W.lessons.flatMap(L=>L.words);
const tag=w=>`<span class="tag ${w.lv?'':'ngoai'}">${w.lv?'HSK '+w.lv:'Đời thật, ngoài đề'}</span>`;

const MODES={
 mam:{n:'Mầm non',e:'🌱',d:'Hiện pinyin, không đếm giờ, sai thoải mái',py:true,timer:0,hearts:99,mult:1,types:['mean','rev','chunk','listen'],lv:'Dễ'},
 tre:{n:'Cây tre',e:'🎋',d:'Pinyin ẩn, chạm mới hiện. Có 5 tim',py:'tap',timer:0,hearts:5,mult:1.2,types:['mean','rev','listen','chunk','tone'],lv:'Vừa'},
 rong:{n:'Rồng con',e:'🐲',d:'Không pinyin, 12 giây mỗi câu, 3 tim',py:false,timer:12,hearts:3,mult:1.5,types:['rev','listen','chunk','tone'],lv:'Khó'},
 king:{n:'Bản địa',e:'👑',d:'Nghe và đọc chữ Hán là chính, 7 giây, 2 tim',py:false,timer:7,hearts:2,mult:2,types:['listen','chunk','tone'],lv:'Siêu khó'}};

const TIEN=['xp','streak','last','stars','box','boxT','exams','q','vuon'];let LICH_HOM=null,dangDong=false,henD,dongNgay=()=>{};
const henDong=()=>{clearTimeout(henD);henD=setTimeout(()=>dongNgay(),3000)};
const KEY='gt_s1',today=()=>new Date().toLocaleDateString('sv');
const SEED={xp:0,streak:0,last:'',mode:'mam',review:!!CF.duyet,sound:true,stars:{},box:{},boxT:{},exams:{},q:{},vuon:{n:0,d:'',hom:0}};
let S;try{S=Object.assign({},SEED,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){S={...SEED}}
const luuMay=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const save=()=>{luuMay();henDong()};
const mode=()=>MODES[S.mode];
const quest=()=>{if(S.q.d!==today())S.q={d:today(),learn:0,game:0,right:0};return S.q};

/* Âm thanh */
let ac;
function tone(f,t=.12,d=0,type='sine',v=.13){if(!S.sound)return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,ac.currentTime+d);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d+t);o.connect(g).connect(ac.destination);o.start(ac.currentTime+d);o.stop(ac.currentTime+d+t)}catch(e){}}
const sfx={ok(){tone(660);tone(880,.16,.09)},bad(){tone(190,.24,0,'square',.07)},pop(){tone(520,.07,0,'triangle')},win(){[523,659,784,1047].forEach((f,i)=>tone(f,.2,i*.11))},tap(){tone(400,.05,0,'triangle',.07)}};
let warned=false;
const zhVoice=()=>{try{return speechSynthesis.getVoices().find(v=>/^zh/i.test(v.lang.replace('_','-'))&&/CN|Hans/i.test(v.lang+v.name))||speechSynthesis.getVoices().find(v=>/^zh/i.test(v.lang))}catch(e){return null}};
const noVoice=()=>{try{return !('speechSynthesis' in window)||(speechSynthesis.getVoices().length>0&&!zhVoice())}catch(e){return true}};
function sayMay(t){if(noVoice()){if(!warned){warned=true;toast('Chưa phát được âm thanh trên máy này')}return}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='zh-CN';u.rate=.85;const v=zhVoice();if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}
let AUD=null,audP=null,dangPhat=0;const player=new Audio();
const taiAud=()=>audP||(audP=fetch('audio.json').then(r=>r.ok?r.json():null).then(j=>AUD=j).catch(()=>null));
const b64Blob=b=>{const x=atob(b),u=new Uint8Array(x.length);for(let i=0;i<x.length;i++)u[i]=x.charCodeAt(i);return URL.createObjectURL(new Blob([u],{type:'audio/mpeg'}))};
async function say(t){if(!S.sound)return;const lan=++dangPhat;await taiAud();if(lan!==dangPhat)return;const b=AUD&&AUD[t];if(!b)return sayMay(t);
 try{player.src='data:audio/mpeg;base64,'+b;await player.play()}catch(e){if(lan!==dangPhat||e.name==='AbortError')return;try{player.src=b64Blob(b);await player.play()}catch(e2){if(lan===dangPhat)sayMay(t)}}}
window.say=say;

function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(()=>t.hidden=true,2200)}
function fly(txt,el){const r=el?el.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0};const d=document.createElement('div');d.className='bay';d.textContent=txt;d.style.left=r.left+r.width/2-20+'px';d.style.top=r.top+'px';document.body.append(d);d.onanimationend=()=>d.remove()}

/* Pháo giấy */
const fxC=$('#fx');
function confetti(n=90){const c=fxC,x=c.getContext('2d'),w=c.width=innerWidth,h=c.height=innerHeight;const cols=['#FF6252','#FFC02E','#12B76A','#2B9DFF','#8E6BFF'];const ps=Array.from({length:n},()=>({x:w/2,y:h*.45,vx:(Math.random()-.5)*13,vy:-Math.random()*13-4,r:Math.random()*6+4,c:pick(cols),a:Math.random()*6,s:(Math.random()-.5)*.4}));let t=0;(function f(){x.clearRect(0,0,w,h);ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.32;p.a+=p.s;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6);x.restore()});if(++t<120)requestAnimationFrame(f);else x.clearRect(0,0,w,h)})()}

/* Pinyin theo chế độ */
function pyHtml(p){if(!p)return'';const m=mode().py;if(S.review||m===true)return`<span class="py">${p}</span>`;if(m==='tap')return`<span class="py an" onclick="this.classList.remove('an')">${p}</span>`;return''}
const showVi=()=>S.review||S.mode!=='king';

function syncTop(){$('#sXp').textContent=S.xp;$('#sStreak').textContent=S.streak;$('#bMode').textContent=mode().e+' '+mode().n;$('#bSound').textContent=S.sound?'🔊':'🔇'}
function addXp(n){S.xp+=n;if(S.last!==today()){S.streak=S.last?S.streak+1:S.streak;S.last=today()}save();syncTop()}
function learnWord(h,ok){S.box[h]=ok?Math.min(3,(S.box[h]||0)+1):0;S.boxT[h]=Date.now();save()}

/* ===== Chậu cây: mỗi lần hoàn thành bài là một lượt tưới, đủ lượt thì nở một loài hoa mới ===== */
const TUOI_MOI_HOA=16,TUOI_MOI_NGAY=5,MOC=[3,7,12];
const giaiDoan=p=>p>=MOC[2]?3:p>=MOC[1]?2:p>=MOC[0]?1:0;
const TEN_GD=['Hạt giống','Mầm non','Cây con','Nụ hoa'];
function svgHoa(i,to=1,cls=''){const[,,,c,t,n,rx,ry]=HOA[i%HOA.length];const c2=Array.from({length:n},(_,k)=>`<ellipse cx="0" cy="${-ry*.9}" rx="${rx}" ry="${ry}" fill="${c}" stroke="rgb(34 49 79 / .16)" stroke-width="1.2" transform="rotate(${k*360/n})"/>`).join('');return`<g class="${cls}" transform="scale(${to})">${c2}<circle r="${Math.max(9,rx*.8)}" fill="${t}" stroke="rgb(34 49 79 / .2)"/></g>`}
function svgChau(p,i){const gd=giaiDoan(p),h=[0,46,84,112][gd];return`<svg class="chau" viewBox="0 0 200 230" role="img" aria-label="${TEN_GD[gd]}"><g class="thanCay">
 ${gd?`<path d="M100 178 Q${gd>1?92:100} ${178-h/2} 100 ${178-h}" stroke="#3FA34D" stroke-width="7" fill="none" stroke-linecap="round"/>`:''}
 ${gd>=1?`<path d="M100 ${178-h*.55} q24 -22 44 -8 q-20 18 -44 8z" fill="#55C271"/>`:''}${gd>=2?`<path d="M100 ${178-h*.38} q-26 -20 -46 -6 q22 18 46 6z" fill="#46B463"/><path d="M100 ${178-h*.8} q20 -16 36 -6 q-18 14 -36 6z" fill="#6AD083"/>`:''}
 ${gd===3?`<g transform="translate(100 ${178-h})"><ellipse cy="-12" rx="13" ry="20" fill="${HOA[i%HOA.length][3]}" stroke="#3FA34D" stroke-width="3"/></g>`:''}${gd===0?'<ellipse cx="100" cy="170" rx="11" ry="7" fill="#8A5A28"/>':''}</g>
 <ellipse cx="100" cy="176" rx="58" ry="9" fill="#5B3A1E"/><path d="M38 172h124l-14 54h-96z" fill="#E8835A"/><rect x="32" y="162" width="136" height="18" rx="7" fill="#F29B74"/><path d="M50 180h100" stroke="#C9623B" stroke-width="3"/></svg>`}
function vuonCard(){const v=S.vuon,n=Math.floor(v.n/TUOI_MOI_HOA),p=v.n%TUOI_MOI_HOA,con=TUOI_MOI_HOA-p,hom=v.d===today()?v.hom:0;
 return`<section class="card vuon"><div class="vTren"><button class="vChau" id="vChau" aria-label="Chạm vào cây">${svgChau(p,n)}</button><div class="vChu"><small>Chậu cây số ${n+1}</small><h2>${TEN_GD[giaiDoan(p)]}</h2><div class="vGiot">${Array.from({length:TUOI_MOI_NGAY},(_,k)=>`<i class="${k<hom?'':'can'}">💧</i>`).join('')}</div><small>${hom>=TUOI_MOI_NGAY?'Hôm nay cây đã đủ nước':`Hôm nay tưới ${hom}/${TUOI_MOI_NGAY} lượt`}</small><div class="bar"><i style="width:${p/TUOI_MOI_HOA*100}%"></i></div><small>Còn ${con} lượt nữa là nở hoa</small></div></div>
 ${n?`<div class="vHoa"><small>Vườn hoa của bạn: ${n} bông</small><div>${Array.from({length:n},(_,k)=>`<button class="vB" data-i="${k}" aria-label="${HOA[k%HOA.length][2]}"><svg viewBox="-55 -55 110 110">${svgHoa(k)}</svg></button>`).join('')}</div></div>`:'<small class="mut">Mỗi lần xong một màn, một trò hay một đề là một lượt tưới.</small>'}</section>`}
function bindVuon(){const c=$('#vChau');if(c)c.onclick=()=>{c.classList.remove('lay');void c.offsetWidth;c.classList.add('lay');sfx.pop()};$$('.vB').forEach(b=>b.onclick=()=>moHoa(+b.dataset.i,false))}
function moHoa(i,moi=true){const[z,p,v]=HOA[i%HOA.length];const b=sheet(`<div class="lvDlg">${moi?'<div class="lvSo" style="--k:#12B76A">Hoa đã nở!</div>':''}<svg class="hoaTo" viewBox="-60 -60 120 120">${svgHoa(i,1,'noHoa')}</svg><span class="zh" style="font-size:40px;line-height:1.1">${z}</span><span class="py" style="font-size:19px">${p}</span><h2>${v}</h2><div class="two" style="width:100%"><button class="btn alt" id="hNghe">🔊 Nghe tên hoa</button><button class="btn" id="hXong">${moi?'Trồng chậu mới':'Đóng'}</button></div></div>`);b.classList.add('giua');say(z);if(moi){sfx.win();confetti(120)}b.querySelector('#hNghe').onclick=()=>say(z);b.querySelector('#hXong').onclick=()=>b.remove()}
function tuoiCay(){const v=S.vuon;if(v.d!==today()){v.d=today();v.hom=0}if(v.hom>=TUOI_MOI_NGAY)return null;v.hom++;v.n++;save();const no=v.n%TUOI_MOI_HOA===0;if(no)setTimeout(()=>moHoa(v.n/TUOI_MOI_HOA-1),1500);return{no,p:v.n%TUOI_MOI_HOA}}

/* ===== Gợi ý: một nút chung, tự nhận ra đang ở dạng bài nào. Bấm lần đầu nhắc nhẹ, bấm tiếp lộ đáp án ===== */
const xoaGoi=()=>{P.tiles=P.dich=P.quet=P.mem=P.tr=P.tn=P.wd=P.ghep=null;P.sang=false};
const MO_TA_THANH={1:'giọng giữ cao và đều, đi ngang',2:'giọng đi lên, như khi hỏi lại',3:'giọng xuống thấp rồi vòng lên',4:'giọng rơi mạnh xuống'};
function goiYBam(){if($('#eNext')){toast('Phòng thi không có gợi ý, cứ làm hết sức nhé');return}if($('#hb'))return;
 const k=($('#pB .stage')||$('#pB .ttl')||{innerText:''}).innerText;P.lanGoi=P.khoaGoi===k?P.lanGoi+1:1;P.khoaGoi=k;const n=P.lanGoi;
 const dung=t=>{P.soGoiY=(P.soGoiY||0)+1;P.lucCham=Date.now();const b=$('#pGoi');b.classList.remove('rung2');b.classList.remove('bam');void b.offsetWidth;b.classList.add('bam');sfx.pop();if(t)toast('💡 '+t)};
 const chon=$$('#pB .opt:not([disabled]),#pB .thu'),ok=chon.find(o=>o.dataset.ok);
 if(ok){if(n===1&&chon.length>2){shuf(chon.filter(o=>o!==ok)).slice(1).forEach(o=>{o.disabled=true;o.classList.add('loai')});return dung('Đã loại bớt đáp án sai, còn lại 2 lựa chọn')}ok.classList.add('goiy');return dung(ok.dataset.goi||'Đáp án đúng có viền nét đứt')}
 if(P.tiles){const{tok,lay}=P.tiles,da=lay();if(da.some((t,i)=>t!==tok[i]))return dung('Có ô đang xếp sai chỗ, chạm vào ô đó để bỏ ra');const b=$$('#pB #tl .tile:not(.an)').find(x=>x.innerText===tok[da.length]);if(b)b.classList.add('goiyT');return dung(n===1?'Ô tiếp theo đang nhấp nháy':'Cả câu: '+tok.join(' '))}
 if(P.ghep){const[a,b]=P.ghep;$$('#pB .tile').filter(x=>x.innerText===a||(n>1&&x.innerText===b)).forEach(x=>x.classList.add('goiyT'));return dung(n===1?'Một bộ phận đang nhấp nháy':'Hai bộ phận đều đang nhấp nháy')}
 if(P.dich){const w=P.dich();if(n===1)return dung(`Từ cần tìm đọc là “${w.p}”`);P.sang=true;$$('#pB .ko,#pB .bong').filter(x=>x.innerText===w.h).forEach(x=>x.classList.add(x.classList.contains('ko')?'goiyK':'goiy'));return dung(`Tìm chữ ${w.h}`)}
 if(P.wd){const{g,tim}=P.wd,O=5,w=tim.find(x=>!$(`#pB .timDs [data-h="${x.h}"]`).classList.contains('xong'));if(!w)return;let p=null;for(let i=0;i<O*O&&!p;i++)for(const D of[[1,0],[0,1],[1,1]]){const q=[...w.h].map((c,s)=>[i%O+D[0]*s,(i/O|0)+D[1]*s]);if(q.every(([x,y],s)=>x<O&&y<O&&g[y*O+x]===w.h[s])){p=q.map(([x,y])=>y*O+x);break}}
  if(p)(n===1?p.slice(0,1):p).forEach(i=>$('#bc').children[i].classList.add('goiyO'));return dung(n===1?`Chữ đầu của từ “${w.v}” đang sáng`:`Từ “${w.v}” là ${w.h}`)}
 if(P.tr){P.tr.goi();return dung('Nét chữ đã được tô đậm hơn, cứ tô theo')}
 if(P.tn){const{t,hinh}=P.tn;if(n===1)return dung('Nghe lại: '+MO_TA_THANH[t]);const x=$('#vC').getContext('2d'),m=hinh(t);x.setLineDash([12,10]);x.lineWidth=6;x.strokeStyle='#9DB0C6';x.beginPath();x.moveTo(...m[0]);m.slice(1).forEach(q=>x.lineTo(...q));x.stroke();x.setLineDash([]);return dung(`Đây là thanh ${t}, vẽ theo đường nét đứt`)}
 if(P.quet){const it=P.quet;if(it.gt)return dung(it.gt);if(it.w){say(it.w.h);return dung(n===1?`Đọc là “${it.w.p}”, nghe lại thử`:`${it.w.h} nghĩa là “${it.w.v}”`)}}
 if(P.mem){const cs=$$('#pB .mc'),l=P.mem.map((c,i)=>[c,i]).filter(([c,i])=>!cs[i].classList.contains('xong'));const[c0,i0]=l[0]||[];if(c0){const i1=l.find(([c,i])=>i!==i0&&c.w===c0.w)[1];[i0,i1].forEach(i=>{cs[i].classList.add('goiyM');setTimeout(()=>cs[i].classList.remove('goiyM'),2500)});return dung('Hai thẻ đang sáng là một cặp')}}
 if($('#bM')){$('#bM').click();return dung('Đã mở câu trả lời mẫu')}
 toast('Phần này không cần gợi ý, cứ thoải mái nhé')}
addEventListener('pointerdown',()=>{P.lucCham=Date.now();const b=$('#pGoi');if(b)b.classList.remove('rung2')},true);

/* ===== Điều hướng ===== */
let cur='map';
function go(v){cur=v;$$('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));({today:vToday,map:vMap,games:vGames,exam:vExam,words:vWords,plan:vPlan})[v]();scrollTo(0,0);if(v==='map'){const n=$('.node.ht')||$('.node');if(n)n.scrollIntoView({block:'center'})}}
function render(h){const m=$('#main');m.innerHTML=h;m.classList.remove('vao');void m.offsetWidth;m.classList.add('vao')}

const reviewBox=()=>CF.duyet?`<div class="duyet"><b>👀</b><div><b>Chế độ duyệt</b> ${S.review?'đang bật: mở hết màn, hiện pinyin, nghĩa tiếng Việt và đánh dấu sẵn đáp án.':'đang tắt: chơi như người học thật.'}</div><button class="sw ${S.review?'on':''}" aria-label="Bật tắt chế độ duyệt" onclick="toggleReview()"></button></div>`:'';
function toggleReview(){S.review=!S.review;save();go(cur);toast(S.review?'Đã bật chế độ duyệt':'Đã tắt chế độ duyệt')}

/* ===== Bản đồ ===== */
const KINDS={
 moi:{e:'🍬',n:'Từ mới',c:'#FF5E7E',d:'#D93A5C'},
 ghep:{e:'🍭',n:'Ghép nhớ',c:'#FFB020',d:'#D98A00'},
 cau:{e:'🧁',n:'Vào câu',c:'#22B8F0',d:'#0E8FC2'},
 thach:{e:'⚡',n:'Thử thách',c:'#9B6BFF',d:'#7345E0'}};
const TEN_HD={quen:'👀 Làm quen',cum:'🧩 Điền cụm',xep:'🧱 Xếp cụm',keo:'🍭 Bắn kẹo',noi:'🎙️ Nói theo',bridge:'🌉 Xây cầu',snake:'🐍 Rắn ăn chữ',fish:'🎣 Câu cá',word:'🔎 Săn từ',trace:'✍️ Tô chữ',swipe:'👉 Quẹt đúng sai',mem:'🃏 Lật thẻ',balloon:'🎈 Bóng bay',tone:'🎵 Vẽ thanh điệu'};
const NGOI=['snake','fish','word','trace','swipe','mem','balloon','tone'];
function kichBan(l){const a=NGOI[l.no*3%8],b=NGOI[(l.no*3+3)%8];return{moi:['quen',a,'cum',b],ghep:[a,'xep',b,'keo'],cau:['bridge',a,'noi',b],thach:[a,b,'keo','bridge']}[l.k]}
function levelsOf(W){const out=[];W.lessons.forEach((L,i)=>{const w=L.words;[['moi',w.slice(0,4)],['moi',w.slice(4)],['ghep',w],['cau',w],['thach',w]].forEach(([k,ws],j)=>out.push({id:`${W.id}-${i}-${j}`,k,ws,L,W,e:KINDS[k].e,n:L.t}))});
 out.push({id:`${W.id}-g`,k:'game',W,e:'🎮',n:W.game.n,run:l=>GAMES[W.game.g].run({id:l.id,p:W.game.p})},{id:`${W.id}-b`,k:'boss',W,e:W.boss.e,n:'Trùm: '+W.boss.n,run:()=>startBoss(W)});return out}
const LEVELS=WORLDS.flatMap(levelsOf);LEVELS.forEach((l,i)=>{l.no=i+1;l.i=i});
const isOpen=l=>S.review||l.i===0||!!S.stars[LEVELS[l.i-1].id];
const questCard=()=>{const q=quest();return`<div class="card"><div class="pandaBox"><span class="panda">🐼</span><div class="say">${pick(['Hôm nay 15 phút thôi, mình đi nào!','Từ nào sai, tớ sẽ mang lại cho cậu ôn tiếp.','Học cụm từ, đừng học từ lẻ nhé!'])} <span class="zh">加油!</span></div></div>
 <div class="qList">${[['📚','Học 8 từ mới',q.learn,8],['🎮','Chơi 1 trò chơi',q.game,1],['🎯','Trả lời đúng 15 câu',q.right,15]].map(([e,n,a,b])=>`<div class="q"><span>${e}</span><span>${n}</span><span class="mut">${Math.min(a,b)}/${b}</span><div class="bar"><i style="width:${Math.min(100,a/b*100)}%"></i></div></div>`).join('')}</div></div>`};
const DECOR={w1:['🌸','🏡','🌷'],w2:['🍩','🧁','🍡'],w3:['🏙️','🚦','🌆'],w4:['📚','✏️','🎒'],w5:['🏮','🎐','🐉']};
function vMap(){const curL=LEVELS.find(l=>!S.stars[l.id]);let h='';
 WORLDS.forEach(W=>{const ns=LEVELS.filter(l=>l.W===W),rh=88,H=ns.length*rh+40;
  const pts=ns.map((n,i)=>[50+30*Math.sin(i*.95),i*rh+56]);
  let d=`M${pts[0][0]} ${pts[0][1]}`;for(let i=1;i<pts.length;i++){const[a,b]=pts[i-1],[x,y]=pts[i];d+=` C${a} ${b+44} ${x} ${y-44} ${x} ${y}`}
  const dc=DECOR[W.id];
  h+=`<section class="ep" style="--w:${W.c};--wD:${W.d}"><div class="wHead"><b>${W.e}</b><div><h2>${W.name}</h2><small>${W.cap}. Màn ${ns[0].no}–${ns[ns.length-1].no}</small></div><span class="zhT">${W.zh}</span></div><div class="road" style="height:${H}px"><svg viewBox="0 0 100 ${H}" preserveAspectRatio="none"><path class="rd1" d="${d}"/><path class="rd2" d="${d}"/></svg>
  ${Array.from({length:6},(_,i)=>`<span class="deco" style="left:${i%2?4+i:84-i}%;top:${8+i*16}%;animation-delay:-${i}s">${dc[i%3]}</span>`).join('')}
  ${ns.map((n,i)=>{const op=isOpen(n),st=S.stars[n.id]||0,K=KINDS[n.k],me=curL&&n.id===curL.id;return`<div class="node n-${n.k} ${op?'':'khoa'} ${me?'ht':''}" style="left:${pts[i][0]}%;top:${pts[i][1]}px;${K?`--k:${K.c};--kD:${K.d}`:''}"><button data-n="${n.id}" aria-label="Màn ${n.no}: ${n.n}"><b>${n.k==='boss'||n.k==='game'?n.e:n.no}</b></button><em>${[1,2,3].map(x=>`<i class="${x<=st?'':'t'}">★</i>`).join('')}</em>${me?'<i class="me">🐼</i>':''}</div>`}).join('')}</div>
  </section>`});
 const side=reviewBox()+vuonCard()+todayCard()+questCard();
 render(`<div class="mapGrid"><aside class="cotBen">${side}</aside><div class="cotDuong">${h}<div class="ketDuong">🏆 Còn nhiều màn mới đang được thêm</div></div></div>`);bindToday();bindVuon();
 $$('.node button').forEach(b=>b.onclick=()=>{const l=LEVELS.find(x=>x.id===b.dataset.n);if(!isOpen(l)){sfx.bad();toast('Qua màn trước để mở màn này');return}sfx.tap();openDlg(l)})}
function vToday(){render(`${reviewBox()}${vuonCard()}${todayCard()}${questCard()}<button class="btn alt full" onclick="go('plan')">🧭 Xem đề cương học</button>`);bindToday();bindVuon()}
function openDlg(l){const K=KINDS[l.k],st=S.stars[l.id]||0,b=sheet(`<div class="lvDlg" style="--k:${K?K.c:l.W.c}"><div class="lvSo">Màn ${l.no}</div><div class="stars" style="font-size:38px">${[1,2,3].map(i=>`<span class="${i<=st?'':'tat'}">⭐</span>`).join('')}</div><h2>${l.n}</h2>${K?`<p class="mut lvK">${K.e} ${K.n}</p><div class="lvHD">${kichBan(l).map(a=>`<span>${TEN_HD[a]}</span>`).join('')}</div><div class="lvTu">${l.ws.map(w=>`<span><b class="zh">${w.h}</b>${w.v}</span>`).join('')}</div>`:`<p class="mut">${l.k==='boss'?'Đánh bại trùm bằng tất cả từ trong thế giới này.':'Trò chơi nằm trên đường đi, qua trò này để mở màn sau.'}</p>`}<button class="btn full" id="lvGo" style="--w:${K?K.c:l.W.c};--wD:${K?K.d:l.W.d}">▶ Chơi</button></div>`);
 b.classList.add('giua');b.querySelector('#lvGo').onclick=()=>{b.remove();l.k in KINDS?startLevel(l):l.run(l)}}

/* ===== Chọn chế độ ===== */
function sheet(html){const b=document.createElement('div');b.className='sheetBg';b.innerHTML=`<div class="sheet">${html}</div>`;b.onclick=e=>{if(e.target===b)b.remove()};document.body.append(b);return b}
function pickMode(){const b=sheet(`<h2>Chọn độ khó</h2><p class="mut" style="margin:0">Đổi lúc nào cũng được. Khó hơn thì điểm nhân lên nhiều hơn.</p>${Object.entries(MODES).map(([k,m])=>`<button class="mode ${k===S.mode?'on':''}" data-m="${k}"><b>${m.e}</b><div><h3>${m.n}</h3><small>${m.d}</small></div><span class="lvl">${m.lv} · x${m.mult}</span></button>`).join('')}`);
 b.querySelectorAll('.mode').forEach(x=>x.onclick=()=>{S.mode=x.dataset.m;save();syncTop();sfx.ok();b.remove();toast('Đã chuyển sang '+mode().n);if(cur==='map')vMap()})}

/* ===== Khung màn chơi ===== */
const P={el:$('#play'),timer:null};
function closePlay(){P.luot=(P.luot||0)+1;clearTimeout(P.timer);clearInterval(P.ivG);clearInterval(P.iv);P.stop&&P.stop();P.stop=null;P.el.hidden=true;P.el.innerHTML='';document.body.style.overflow='';try{speechSynthesis.cancel()}catch(e){}go(cur);window.scrollTo(0,0)}
function openPlay(color,dark){xoaGoi();P.soGoiY=0;P.lucCham=Date.now();clearInterval(P.ivG);P.ivG=setInterval(()=>{const b=$('#pGoi');if(b&&Date.now()-P.lucCham>12000)b.classList.add('rung2')},1000);P.el.style.setProperty('--w',color||'#12B76A');P.el.style.setProperty('--wD',dark||'#0B8F52');P.el.hidden=false;document.body.style.overflow='hidden';P.el.innerHTML=`<div class="pTop"><button class="pX" aria-label="Thoát" onclick="closePlay()">✕</button><div class="pBar"><i id="pFill"></i></div><button class="pGoi" id="pGoi" aria-label="Gợi ý" onclick="goiYBam()">💡</button><div class="hearts" id="pH"></div></div><div id="tWrap"></div><div id="pExtra"></div><div class="pBody" id="pB"></div><div id="pF"></div>`}
const setBar=v=>{const f=$('#pFill');if(f)f.style.width=v*100+'%'};

/* ===== Một màn: nhiều hoạt động nối nhau ===== */
function startLevel(l){const W=l.W,m=mode(),ws=l.ws,pool=worldWords(W);openPlay(l.k in KINDS?KINDS[l.k].c:W.c,l.k in KINDS?KINDS[l.k].d:W.d);
 const G={right:0,total:0,combo:0,hearts:m.hearts},luot=P.luot=(P.luot||0)+1;let si=0,lucTiep=0,daKet=false;
 const hs=()=>{const e=$('#pH');if(e)e.textContent=G.hearts>50?'❤️ ∞':'❤️ '+G.hearts};hs();
 const ve=h=>{if(P.luot!==luot)return;xoaGoi();const b=$('#pB');b.className='pBody';$('#pF').innerHTML='';$('#tWrap').innerHTML='';b.innerHTML=h};
 const good=(el,w)=>{G.right++;G.total++;G.combo++;if(w)learnWord(w.h,true);quest().right++;sfx.ok();if(G.combo>=3)tone(660+G.combo*40,.12,.14);fly(G.combo>=3?`Combo x${G.combo}`:'+10',el)};
 const bad=(el,w)=>{G.total++;G.combo=0;if(w)learnWord(w.h,false);sfx.bad();if(G.hearts<50){G.hearts--;hs();const e=$('#pH');e.classList.remove('vo');void e.offsetWidth;e.classList.add('vo')}};
 const next=()=>{if(P.luot!==luot||daKet||performance.now()-lucTiep<300)return;lucTiep=performance.now();if(P.stop){P.stop();P.stop=null}clearTimeout(P.timer);setBar(si/plan.length);if(G.hearts<=0)return ket(true);if(si>=plan.length)return ket(false);plan[si++]()};
 function ket(lose){daKet=true;setBar(1);const p=G.total?G.right/G.total:0;endScreen({id:l.id,stars:lose?0:p>=.9?3:p>=.7?2:1,lose,right:G.right,total:G.total,again:()=>startLevel(l),xpBase:G.right*5,loseMsg:'Hết tim rồi. Thử lại màn này nhé.'})}
 /* Làm quen nhiều từ cùng lúc */
 const stIntro=ds=>()=>{const seen=new Set;ve(`<div class="ttl">Làm quen ${ds.length} từ mới, chạm từng thẻ để nghe</div><div class="quen">${ds.map((w,i)=>`<button class="qT" data-i="${i}"><span class="qE">${w.e}</span><span class="zh">${w.h}</span><span class="py">${w.p}</span><strong>${w.v}</strong><small class="zh">${w.c}</small><small>${w.cv}</small></button>`).join('')}</div><button class="btn full" id="qGo" style="margin-top:auto" ${S.review?'':'disabled'}>Bắt đầu chơi</button>`);
  $$('.qT').forEach(b=>b.onclick=()=>{const w=ds[+b.dataset.i];say(w.h);sfx.pop();b.classList.add('da');if(!seen.has(w.h)){seen.add(w.h);quest().learn++;save()}if(seen.size===ds.length)$('#qGo').disabled=false});$('#qGo').onclick=next};
 /* Một câu hỏi */
 const stQ=(w,t,tm)=>()=>{const Q=buildQ(w,t,pool);ve(`<div class="stage">${Q.stage}</div><div class="ttl" style="font-size:16px">${Q.ask}</div><div class="opts">${Q.opts.map((o,i)=>`<button class="opt ${S.review&&o.ok?'goiy':''}" data-i="${i}"${o.ok?' data-ok="1"':''}>${o.label}</button>`).join('')}</div>`);$('#pB').classList.add('qz');if(Q.sp)setTimeout(()=>say(Q.sp),200);
  const tr=(i,el)=>{clearTimeout(P.timer);const t2=$('#tBar');if(t2)t2.style.animationPlayState='paused';const ok=i>=0&&Q.opts[i].ok;$$('.opt').forEach((b,x)=>{b.disabled=true;if(Q.opts[x].ok)b.classList.add('dung')});
   if(ok){good(el,w);say(w.h);$('#pF').innerHTML=`<div class="fb"><div><div class="fbR"><div><span class="zh" style="font-size:19px">${w.c}</span> <small class="mut" style="font-weight:700">${w.cv}</small></div></div></div></div>`;P.timer=setTimeout(next,1100)}
   else{if(el)el.classList.add('sai');bad(el,w);say(w.c);$('#pF').innerHTML=`<div class="fb sai"><div><h3>${i<0?'Hết giờ rồi ⏰':'Chưa đúng, nhớ lại nhé'}</h3><div><span class="zh" style="font-size:19px">${w.h}</span> <span class="py">${w.p}</span> ${w.v}<br><span class="zh">${w.c}</span> <small class="mut" style="font-weight:700">${w.cv}</small></div><button class="btn full" id="bN">Tiếp tục</button></div></div>`;$('#bN').onclick=next}};
  $$('.opt').forEach(b=>b.onclick=()=>tr(+b.dataset.i,b));const d=tm??m.timer;if(d){$('#tWrap').innerHTML=`<div id="tBar" style="animation:hetG ${d}s linear forwards"></div>`;P.timer=setTimeout(()=>tr(-1),d*1000)}};
 /* Xếp chữ thành cụm, hoặc xếp từ thành câu */
 const stTiles=(tok,vi,py,w,tip)=>()=>{const ans=tok.join(''),mix=shuf(tok);let got=[],sai=false;ve(`<div class="ttl">${tok.length>6||!w?'Xếp thành câu đúng':'Xếp thành cụm từ'}</div><div class="stage"><div class="big" style="font-size:21px">${vi}</div>${S.review?`<small class="mut" style="font-weight:700">Đáp án: ${tok.join(' ')} · ${py}</small>`:m.py===true?pyHtml(py):''}</div><div class="slot" id="sl"></div><div class="tiles" id="tl">${mix.map((t,k)=>`<button class="tile zh" data-k="${k}">${t}</button>`).join('')}</div>`);
  const rf=()=>{$('#sl').innerHTML=got.map((k,x)=>`<button class="tile zh" data-x="${x}">${mix[k]}</button>`).join('');$$('#sl .tile').forEach(b=>b.onclick=()=>{const k=got.splice(+b.dataset.x,1)[0];$(`#tl [data-k="${k}"]`).classList.remove('an');rf()});
   if(got.length===tok.length){const t=got.map(k=>mix[k]).join(''),sl=$('#sl');if(t===ans){if(sai){G.total++;G.combo=0}else good(sl,w);sl.classList.add('dung');say(ans);if(tip)toast('💡 '+tip);setTimeout(next,1300)}else{if(!sai){sai=true;bad(sl,w)}sl.classList.remove('sai');void sl.offsetWidth;sl.classList.add('sai');if(G.hearts<=0)setTimeout(next,500)}}};
  $$('#tl .tile').forEach(b=>b.onclick=()=>{b.classList.add('an');got.push(+b.dataset.k);sfx.pop();rf()});P.tiles={tok,lay:()=>got.map(k=>mix[k])}};
 /* Nói theo, tự chấm */
 const stNoi=w=>()=>{ve(`<div class="ttl">Nghe rồi nói to theo</div><div class="stage"><button class="loa" id="nL" aria-label="Nghe">🔊</button><div class="rid"><span class="zh">${w.c}</span><span class="py">${w.cp}</span><div class="mut" style="font-weight:700">${w.cv}</div></div></div><div class="two" style="margin-top:auto"><button class="btn alt" id="n0">😅 Còn vấp</button><button class="btn" id="n1">😎 Nói được</button></div>`);say(w.c);$('#nL').onclick=()=>say(w.c);$('#n0').onclick=next;$('#n1').onclick=e=>{G.right++;G.total++;fly('+10',e.target);sfx.ok();setTimeout(next,350)}};
 /* Bắn kẹo: kẹo trúng nổ, hàng trên rơi xuống */
 const stKeo=(ds,n)=>()=>{const C=4,R=4,cols=['#FF5E7E','#FFB020','#22B8F0','#9B6BFF','#12B76A'];let g=Array.from({length:C*R},()=>pick(ds)),left=n,t=pick(g),moi=[],khoa=false;const mau=w=>cols[hash(w.h)%5];
  const ve2=()=>{ve(`<div class="ttl">🍭 Bắn đúng kẹo, còn ${left} viên</div><div class="stage"><div class="big">${t.e} ${t.v}</div></div><div class="keo">${g.map((w,i)=>`<button class="ko ${moi.includes(i)?'roi':''} ${S.review&&w===t?'goiyK':''}" style="--m:${mau(w)};font-size:${w.h.length>3?13:w.h.length>2?16:21}px" data-i="${i}">${w.h}</button>`).join('')}</div>`);moi=[];P.dich=()=>t;
   $$('.ko').forEach(b=>b.onclick=()=>{if(khoa)return;const i=+b.dataset.i;if(g[i]!==t){bad(b,g[i]);b.classList.add('sai');toast(`${g[i].h} là “${g[i].v}”`);if(G.hearts<=0)setTimeout(next,450);return}good(b,t);say(t.h);b.classList.add('no2');left--;khoa=true;setTimeout(()=>{khoa=false;for(let r=Math.floor(i/C);r>0;r--){g[r*C+i%C]=g[(r-1)*C+i%C];moi.push(r*C+i%C)}g[i%C]=pick(ds);moi.push(i%C);if(left<=0)return next();t=pick(g);ve2()},260)})};ve2()};
 const r=shuf(ws),R=i=>r[i%r.length];let dem=0;
 const stMg=k=>()=>{ve('');MG[k](ws,{hit:(w,el)=>good(el,w),miss:(w,el)=>{bad(el,w);if(G.hearts<=0)next()},end:next,gon:1})};
 const hd={quen:()=>stIntro(ws),cum:()=>stQ(R(dem++),'chunk'),xep:()=>{const w=R(dem++);return stTiles([...w.c.replace(/[,!?。]/g,'')],w.cv,w.cp,w)},keo:()=>stKeo(ws,ws.length>4?6:5),noi:()=>stNoi(R(dem++))};
 const plan=kichBan(l).map(k=>hd[k]?hd[k]():stMg(k));
 next()}
function startBoss(W){openPlay('#FF6252','#D9402F');runQuiz({title:'Trùm '+W.boss.n,words:worldWords(W),pool:worldWords(W),n:12,id:`${W.id}-b`,boss:W.boss,again:()=>startBoss(W)})}

function variants(p){const T={a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù','ü':'ǖǘǚǜ'};const pos=[];[...p].forEach((c,i)=>{for(const v in T)if(T[v].includes(c))pos.push([i,v,T[v].indexOf(c)])});const out=new Set();if(!pos.length)return[];let g=0;while(out.size<3&&g++<40){const[i,v,t]=pick(pos);let n=Math.random()*4|0;if(n===t)continue;const a=[...p];a[i]=T[v][n];out.add(a.join(''))}return[...out]}

function buildQ(w,type,pool){
 let others=shuf(pool.filter(x=>x.h!==w.h&&x.v!==w.v)).slice(0,3);if(others.length<3)others=shuf(ALL.filter(x=>x.h!==w.h)).slice(0,3);
 const viGloss=x=>S.review?x.v:'';
 const hz=x=>({label:`<span class="zh">${x.h}</span>${S.review?`<small>${x.p}</small><small>${x.v}</small>`:''}`,ok:x===w});
 if(type==='listen'&&!AUD&&noVoice())type=S.mode==='king'?'chunk':'mean';
 if(type==='mean')return{stage:`<div class="tzg ${w.h.length>1?'dai':''}"><span class="zh">${w.h}</span></div>${pyHtml(w.p)}<button class="mini" onclick="say('${w.h}')" aria-label="Nghe">🔊</button>`,ask:'Từ này nghĩa là gì?',opts:shuf([w,...others]).map(x=>({label:x.v,ok:x===w})),sp:w.h};
 if(type==='rev')return{stage:`<span class="emo">${w.e}</span><div class="big">${w.v}</div>`,ask:'Chọn đúng chữ Hán',opts:shuf([w,...others]).map(hz)};
 if(type==='listen')return{stage:`<button class="loa" onclick="say('${w.h}')" aria-label="Nghe">🔊</button>${S.review?`<small class="mut">Từ đang đọc: ${w.p}</small>`:''}`,ask:'Nghe và chọn đúng từ',opts:shuf([w,...others]).map(hz),sp:w.h};
 if(type==='chunk')return{stage:`<div class="rid"><span class="zh">${w.c.replace(w.h,'＿＿')}</span>${showVi()?`<small class="mut" style="font-weight:700">${w.cv}</small>`:''}</div>`,ask:'Điền từ còn thiếu vào cụm',opts:shuf([w,...others]).map(hz)};
 const v=variants(w.p);if(v.length<3)return buildQ(w,'mean',pool);
 return{stage:`<div class="tzg ${w.h.length>1?'dai':''}"><span class="zh">${w.h}</span></div>${S.review?`<small class="mut">${w.v}</small>`:''}<button class="mini" onclick="say('${w.h}')" aria-label="Nghe">🔊</button>`,ask:'Thanh điệu nào đúng?',opts:shuf([w.p,...v]).map(x=>({label:`<span style="font-size:19px">${x}</span>`,ok:x===w.p})),sp:w.h}}

function runQuiz(c){
 const m=mode();let q=[],hearts=m.hearts,done=0,right=0,bossHp=c.boss?c.n:0,seenWrong=new Set();
 const base=shuf(c.words),types=c.types||m.types;
 for(let i=0;i<c.n;i++)q.push({w:base[i%base.length],t:types[i%types.length]});q=shuf(q);
 const total=q.length;
 const hs=()=>{const e=$('#pH');if(e)e.textContent=hearts>50?'❤️ ∞':'❤️ '+hearts};hs();
 $('#pExtra').innerHTML=c.boss?`<div style="max-width:620px;margin:0 auto;padding:0 16px"><div class="bossB" id="bB"><b>${c.boss.e}</b><div style="flex:1;min-width:0"><strong>${c.boss.n}</strong><div class="hp"><i id="hpI" style="width:100%"></i></div></div></div></div>`:'';
 function next(){clearTimeout(P.timer);$('#pF').innerHTML='';$('#tWrap').innerHTML='';setBar(done/total);
  if(!q.length||hearts<=0)return finish();
  const it=q.shift(),Q=buildQ(it.w,it.t,c.pool);
  $('#pB').innerHTML=`<div class="ttl">${c.title}</div><div class="stage">${Q.stage}</div><div class="ttl" style="font-size:16px">${Q.ask}</div><div class="opts">${Q.opts.map((o,i)=>`<button class="opt ${S.review&&o.ok?'goiy':''}" data-i="${i}"${o.ok?' data-ok="1"':''}>${o.label}</button>`).join('')}</div>`;
  if(Q.sp)setTimeout(()=>say(Q.sp),250);
  $('#pB').classList.add('qz');
  const answer=(i,el)=>{clearTimeout(P.timer);const t=$('#tBar');if(t)t.style.animationPlayState='paused';const good=i>=0&&Q.opts[i].ok,w=it.w;$$('.opt').forEach((b,x)=>{b.disabled=true;if(Q.opts[x].ok)b.classList.add('dung')});if(el&&!good)el.classList.add('sai');
   learnWord(w.h,good);
   if(good){sfx.ok();done++;if(!seenWrong.has(w.h))right++;quest().right++;fly('+10',el);if(c.boss){const d=document.createElement('div');d.className='dan';d.textContent='🎋';document.body.append(d);setTimeout(()=>{d.remove();bossHp--;const I=$('#hpI');if(I)I.style.width=Math.max(0,bossHp/total*100)+'%';const B=$('#bB');if(B){B.classList.remove('dau');void B.offsetWidth;B.classList.add('dau')}},430)}}
   else{sfx.bad();seenWrong.add(w.h);if(hearts<50){hearts--;hs();const e=$('#pH');e.classList.remove('vo');void e.offsetWidth;e.classList.add('vo')}q.push({w,t:'mean'===it.t?'rev':'mean'})}
   say(w.c);
   $('#pF').innerHTML=`<div class="fb ${good?'':'sai'}"><div><h3>${good?pick(['Chuẩn luôn! 太棒了','Giỏi quá! 真棒','Đúng rồi! 对了']):i<0?'Hết giờ mất rồi ⏰':'Chưa đúng, từ này sẽ quay lại 💪'}</h3><div class="fbR"><div><span class="zh" style="font-size:20px">${w.h}</span> <span class="py">${w.p}</span> ${w.v}<br><span class="zh">${w.c}</span> <small class="mut" style="font-weight:700">${w.cv}</small></div><button class="mini" onclick="say('${w.c}')" aria-label="Nghe">🔊</button></div><button class="btn full" id="bN">Tiếp tục</button></div></div>`;
   $('#bN').onclick=next};
  $$('.opt').forEach(b=>b.onclick=()=>answer(+b.dataset.i,b));
  const tm=c.timer??m.timer;if(tm){$('#tWrap').innerHTML=`<div id="tBar" style="animation:hetG ${tm}s linear forwards"></div>`;P.timer=setTimeout(()=>answer(-1),tm*1000)}}
 function finish(){setBar(1);const lose=hearts<=0;const pct=right/total,stars=lose?0:pct>=.9?3:pct>=.7?2:1;endScreen({id:c.id,stars,lose,right,total,again:c.again,xpBase:right*10,loseMsg:'Hết tim rồi. Làm lại nhé, từ sai đã được ghi vào sổ để ôn.'})}
 next()}
const stHet=document.createElement('style');stHet.textContent='@keyframes hetG{to{transform:scaleX(0)}}';document.head.append(stHet);

/* Màn kết thúc */
function endScreen({id,stars,lose,right,total,again,xpBase,loseMsg}){const ng=P.soGoiY||0;if(ng)stars=Math.min(stars,2);const gb=$('#pGoi');if(gb)gb.hidden=true;
 clearTimeout(P.timer);$('#pF').innerHTML='';$('#tWrap').innerHTML='';const ex=$('#pExtra');if(ex)ex.innerHTML='';
 const xp=Math.max(0,Math.round(xpBase*mode().mult)+(stars*10)-ng*5);addXp(xp);const tc=stars?tuoiCay():null;if(id&&stars>(S.stars[id]||0)){S.stars[id]=stars;save()}
 $('#pB').className='pBody end';$('#pB').innerHTML=`<span class="emo">${lose?'🥺':'🐼'}</span><h2>${lose?'Suýt nữa thì được':stars===3?'Xuất sắc! 太厉害了':'Làm tốt lắm! 不错'}</h2><div class="stars">${[1,2,3].map(i=>`<span class="${i<=stars?'':'tat'}">⭐</span>`).join('')}</div>${lose?`<p class="mut">${loseMsg}</p>`:''}<div class="nums"><div><b id="eXp">0</b>Điểm</div><div><b>${right}/${total}</b>Đúng ngay</div><div><b>${mode().e}</b>${mode().n}</div></div>${ng?`<div class="daTuoi" style="background:var(--lemon)">💡 Đã dùng ${ng} gợi ý nên màn này tối đa 2 sao</div>`:''}${tc?`<div class="daTuoi">💧 ${tc.no?'Tưới xong, hoa sắp nở!':`Đã tưới cây, còn ${TUOI_MOI_HOA-tc.p} lượt nữa nở hoa`}</div>`:''}${stars?`<button class="hongbao" id="hb" aria-label="Mở lì xì">🧧</button><small class="mut" id="hbT">Chạm bao lì xì để nhận thưởng</small>`:''}<div class="two" style="width:100%;max-width:340px"><button class="btn alt" id="eA">↻ Chơi lại</button><button class="btn" id="eX">${!lose&&LEVELS.some(l=>l.id===id)?'Màn tiếp ▶':'Xong'}</button></div>`;
 $('#eX').onclick=()=>{const l=LEVELS.find(x=>x.id===id),n=l&&!lose&&LEVELS[l.i+1];closePlay();if(n)openDlg(n)};
 let n=0;const e=$('#eXp'),iv=setInterval(()=>{n=Math.min(xp,n+Math.ceil(xp/20));e.textContent=n;if(n>=xp)clearInterval(iv)},30);
 if(!lose){sfx.win();confetti()}else sfx.bad();
 $('#eA').onclick=()=>{$('#pB').className='pBody';again()};
 const hb=$('#hb');if(hb)hb.onclick=()=>{const b=pick([5,10,20,50]);addXp(b);hb.classList.add('mo');hb.textContent='💰';hb.disabled=true;$('#hbT').innerHTML=`<b>+${b} điểm</b> · <span class="zh">恭喜恭喜</span> gōngxǐ gōngxǐ: chúc mừng`;sfx.ok();confetti(40)}}
function gameEnd(id,right,total,again){quest().game++;save();const p=right/total;endScreen({id,stars:p>=.9?3:p>=.6?2:1,right,total,again,xpBase:right*8})}

/* ===== Trò chơi ===== */
const GAMES={
 snake:{n:'Rắn ăn chữ',zh:'贪吃蛇',e:'🐍',c:'#12B76A',d:'#0B8F52',s:'Lái rắn bằng phím hoặc vuốt, ăn đúng từ để dài ra',run:o=>chay('snake',o)},
 fish:{n:'Câu cá',zh:'钓鱼',e:'🎣',c:'#2B9DFF',d:'#1577CF',s:'Canh lưỡi câu đang đung đưa, thả đúng lúc',run:o=>chay('fish',o)},
 word:{n:'Săn từ',zh:'找词语',e:'🔎',c:'#8E6BFF',d:'#6B46E0',s:'Vuốt qua các ô chữ để tìm từ giấu trong bảng',run:o=>chay('word',o)},
 trace:{n:'Tô chữ Hán',zh:'描字',e:'✍️',c:'#FF6252',d:'#D9402F',s:'Dùng ngón tay hoặc chuột tô theo nét chữ',run:o=>chay('trace',o)},
 tone:{n:'Vẽ thanh điệu',zh:'画声调',e:'🎵',c:'#E58E00',d:'#B86F00',s:'Tự tay vẽ đường lên xuống của thanh điệu',run:o=>chay('tone',o)},
 swipe:{n:'Quẹt đúng sai',zh:'左右滑',e:'👉',c:'#FF5E7E',d:'#D93A5C',s:'Quẹt phải nếu nghĩa đúng, quẹt trái nếu sai',run:o=>chay('swipe',o)},
 native:{n:'Người thật hay sách',zh:'地道说法',e:'💡',c:'#12B76A',d:'#0B8F52',s:'Quẹt thẻ: câu này người thật nói hay chỉ có trong sách?',run:o=>chay('native',o)},
 measure:{n:'Băng chuyền lượng từ',zh:'量词传送带',e:'🏭',c:'#E58E00',d:'#B86F00',s:'Hàng chạy trên băng, thả nhanh vào đúng thùng 本 杯 件',run:o=>chay('belt',o)},
 order:{n:'Xây cầu bằng câu',zh:'连词成句',e:'🌉',c:'#8E6BFF',d:'#6B46E0',s:'Bấm từng từ đúng thứ tự để nối cầu đưa gấu qua sông',run:o=>chay('bridge',o)},
 balloon:{n:'Bắn bóng bay',zh:'打气球',e:'🎈',c:'#2B9DFF',d:'#1577CF',s:'45 giây chạm đúng bóng đang bay',run:o=>chay('balloon',o)},
 memory:{n:'Lật thẻ',zh:'翻牌配对',e:'🃏',c:'#8E6BFF',d:'#6B46E0',s:'Nhớ vị trí, lật tìm cặp chữ và nghĩa',run:o=>chay('mem',o)},
 riddle:{n:'Đố chữ đèn lồng',zh:'猜字谜',e:'🏮',c:'#FF6252',d:'#D9402F',s:'Câu đố dân gian, chọn đèn lồng có chữ đúng',run:gRiddle},
 chain:{n:'Nhảy đá nối chữ',zh:'词语接龙',e:'🪨',c:'#12B76A',d:'#0B8F52',s:'Nhảy sang viên đá có từ bắt đầu bằng chữ cuối',run:gChain},
 radical:{n:'Ghép chữ',zh:'偏旁拼字',e:'🧩',c:'#E58E00',d:'#B86F00',s:'Ghép hai bộ phận thành một chữ Hán',run:gRadical},
 chat:{n:'Nhập vai đời thật',zh:'情景对话',e:'💬',c:'#12B76A',d:'#0B8F52',s:'Gọi trà sữa, đi taxi, hẹn bạn qua WeChat',run:gChat},
 speak:{n:'Luyện thi nói',zh:'口语练习',e:'🎙️',c:'#FF6252',d:'#D9402F',s:'Tự nói 30 giây rồi nghe mẫu',run:gSpeak}};
function chay(k,o={}){const g=GAMES[{belt:'measure',bridge:'order',mem:'memory'}[k]||k];openPlay(g.c,g.d);$('#pH').textContent=g.e;
 const C={right:0,total:0,hit(w,el){C.right++;C.total++;if(w)learnWord(w.h,true);quest().right++;sfx.ok();fly('+10',el)},miss(w,el){C.total++;if(w)learnWord(w.h,false);sfx.bad()},end(){if(P.stop){P.stop();P.stop=null}gameEnd(o.id,C.right,Math.max(1,C.total),()=>chay(k,o))}};
 MG[k](shuf(ALL),C)}

/* ===== Các trò, mỗi trò một cách chơi. C.hit/C.miss báo đúng sai, C.end khi xong ===== */
const veBody=h=>{xoaGoi();const b=$('#pB');b.className='pBody';b.innerHTML=h;return b};
const nen=(a,n,f)=>{const x=shuf(a.filter(f));return x.length>=n?x.slice(0,n):[...x,...shuf(ALL.filter(w=>f(w)&&!x.includes(w)))].slice(0,n)};
const vuot=(el,f)=>{let a;el.addEventListener('pointerdown',e=>{a=[e.clientX,e.clientY]});el.addEventListener('pointerup',e=>{if(!a)return;const dx=e.clientX-a[0],dy=e.clientY-a[1];a=null;f(dx,dy)})};
const MG={
 /* Lái rắn */
 snake(ws,C){const ds=nen(ws,6,w=>w.h.length<=3),O=11;let con=C.gon?3:5,sn=[[5,5],[4,5],[3,5]],dir=[1,0],nd=[1,0],foods=[],t;
  veBody(`<div class="ttl">Lái rắn tới từ có nghĩa, còn <b id="sL">${con}</b> từ</div><div class="big" id="sT" style="text-align:center"></div><canvas id="sC" class="mgCan" width="660" height="660"></canvas><div class="dpad"><button data-d="0,-1" aria-label="Lên">▲</button><button data-d="-1,0" aria-label="Trái">◀</button><button data-d="0,1" aria-label="Xuống">▼</button><button data-d="1,0" aria-label="Phải">▶</button></div>`);
  const c=$('#sC'),x=c.getContext('2d'),cs=60;
  const trong=()=>{for(;;){const p=[Math.random()*O|0,Math.random()*O|0];if(!sn.some(q=>q[0]===p[0]&&q[1]===p[1])&&!foods.some(f=>f.x===p[0]&&f.y===p[1]))return p}};
  const moi=()=>{t=pick(ds);foods=[];[t,...shuf(ds.filter(w=>w!==t)).slice(0,2)].forEach(w=>{const[a,b]=trong();foods.push({x:a,y:b,w})});$('#sT').textContent=t.e+' '+t.v};
  const ve=()=>{x.clearRect(0,0,660,660);x.fillStyle='#E9FBF1';x.fillRect(0,0,660,660);x.strokeStyle='#CFF3E0';for(let i=0;i<=O;i++){x.beginPath();x.moveTo(i*cs,0);x.lineTo(i*cs,660);x.moveTo(0,i*cs);x.lineTo(660,i*cs);x.stroke()}
   foods.forEach(f=>{const n=f.w.h.length;x.fillStyle=(S.review||P.sang)&&f.w===t?'#FFC02E':'#fff';x.strokeStyle='#22314F';x.lineWidth=3;x.beginPath();x.roundRect(f.x*cs+1,f.y*cs+8,cs-2,cs-16,12);x.fill();x.stroke();x.fillStyle='#22314F';x.font=`700 ${n>2?18:n>1?25:34}px "Noto Sans SC",sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(f.w.h,f.x*cs+cs/2,f.y*cs+cs/2)});
   sn.forEach(([a,b],i)=>{x.fillStyle=i?'#12B76A':'#0B8F52';x.beginPath();x.roundRect(a*cs+3,b*cs+3,cs-6,cs-6,16);x.fill()});x.font='38px sans-serif';x.fillText('🐼',sn[0][0]*cs+cs/2,sn[0][1]*cs+cs/2+2)};
  const buoc=()=>{dir=nd;const h=[(sn[0][0]+dir[0]+O)%O,(sn[0][1]+dir[1]+O)%O];sn.unshift(h);const f=foods.find(q=>q.x===h[0]&&q.y===h[1]);
   if(!f)sn.pop();else if(f.w===t){C.hit(t,c);say(t.h);con--;$('#sL').textContent=con;if(con<=0){clearInterval(iv);ve();setTimeout(C.end,400);return}moi()}else{C.miss(f.w,c);toast(`${f.w.h} là “${f.w.v}”`);sn.pop();if(sn.length>3)sn.pop();moi()}ve()};
  const doi=(a,b)=>{if(a!==-dir[0]||b!==-dir[1])nd=[a,b]};const K={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
  const pk=e=>{const d=K[e.key];if(d){e.preventDefault();doi(...d)}};addEventListener('keydown',pk);$$('.dpad button').forEach(b=>b.onpointerdown=()=>doi(...b.dataset.d.split(',').map(Number)));
  vuot(c,(dx,dy)=>{if(Math.abs(dx)<14&&Math.abs(dy)<14)return;Math.abs(dx)>Math.abs(dy)?doi(Math.sign(dx),0):doi(0,Math.sign(dy))});
  moi();ve();P.dich=()=>t;const iv=setInterval(buoc,270);P.stop=()=>{clearInterval(iv);removeEventListener('keydown',pk)};P.sn={buoc,get sn(){return sn},get foods(){return foods},get t(){return t},dat(a,b){doi(a,b);nd=[a,b]}}},
 /* Thả lưỡi câu đúng lúc */
 fish(ws,C){const ds=nen(ws,6,w=>w.h.length<=3),W=660,H=620,G0=[W/2,40];let con=C.gon?3:4,cu=[],goc=0,tg=0,len=70,tt='lac',bat=null,t;
  veBody(`<div class="ttl">Chạm để thả lưỡi, chạm lần nữa để giật. Còn <b id="fL">${con}</b> con</div><div class="big" id="fT" style="text-align:center"></div><canvas id="fC" class="mgCan" width="${W}" height="${H}"></canvas>`);
  const c=$('#fC'),x=c.getContext('2d');
  const moi=()=>{t=pick(ds);const d=[t,...shuf(ds.filter(w=>w!==t)).slice(0,3)];cu=shuf(d).map((w,i)=>({w,x:Math.random()*W,y:220+i*95,v:(1.1+Math.random()*1.4)*(i%2?1:-1)}));$('#fT').textContent=t.e+' '+t.v};
  const dau=()=>[G0[0]+Math.sin(goc)*len,G0[1]+Math.cos(goc)*len];
  const ve=()=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#BFEAFF');g.addColorStop(1,'#2B9DFF');x.fillStyle=g;x.fillRect(0,0,W,H);
   cu.forEach(f=>{x.save();x.translate(f.x,f.y);x.fillStyle=(S.review||P.sang)&&f.w===t?'#FFC02E':'#FF8A5B';x.beginPath();x.ellipse(0,0,66,32,0,0,7);x.fill();const d=f.v>0?-1:1;x.beginPath();x.moveTo(d*60,0);x.lineTo(d*92,-24);x.lineTo(d*92,24);x.fill();x.fillStyle='#22314F';x.textAlign='center';x.textBaseline='middle';x.font=`700 ${f.w.h.length>2?24:30}px "Noto Sans SC",sans-serif`;x.fillText(f.w.h,0,1);x.restore()});
   const[a,b]=dau();x.strokeStyle='#22314F';x.lineWidth=4;x.beginPath();x.moveTo(...G0);x.lineTo(a,b);x.stroke();x.font='34px sans-serif';x.textAlign='center';x.fillText('🪝',a,b+8);x.font='42px sans-serif';x.fillText('🐼',G0[0],26)};
  const buoc=()=>{tg+=.045;if(tt==='lac')goc=Math.sin(tg)*1.05;cu.forEach(f=>{if(f===bat)return;f.x+=f.v;if(f.x<-90)f.x=W+90;if(f.x>W+90)f.x=-90});
   if(tt==='tha'){len+=10;const[a,b]=dau();if(a<0||a>W||b>H)tt='keo'}
   if(tt==='keo'){len-=bat?9:14;if(bat){const[a,b]=dau();bat.x=a;bat.y=b}if(len<=70){len=70;tt='lac';if(bat){const w=bat.w;bat=null;if(w===t){C.hit(t,c);say(t.h);con--;$('#fL').textContent=con;if(con<=0){clearInterval(iv);setTimeout(C.end,350);return}}else{C.miss(w,c);toast(`${w.h} là “${w.v}”`)}moi()}}}ve()};
  /* Lưỡi đi xuyên qua cá, chạm lần hai mới giật con đang ở lưỡi: câu được cả con nằm dưới con khác */const tha=()=>{if(tt==='lac'){tt='tha';sfx.pop()}else if(tt==='tha'){const[a,b]=dau();bat=cu.filter(f=>Math.hypot(f.x-a,f.y-b)<62).sort((m,n)=>Math.hypot(m.x-a,m.y-b)-Math.hypot(n.x-a,n.y-b))[0]||null;tt='keo';sfx.tap()}};c.addEventListener('pointerdown',tha);const pk=e=>{if(e.key===' '){e.preventDefault();tha()}};addEventListener('keydown',pk);
  moi();P.dich=()=>t;const iv=setInterval(buoc,33);P.stop=()=>{clearInterval(iv);removeEventListener('keydown',pk)};P.fi={get cu(){return cu},get t(){return t},get tt(){return tt},tha,dau}},
 /* Vuốt tìm từ trong bảng chữ */
 word(ws,C){const O=5,ds=nen(ws,C.gon?3:4,w=>w.h.length>=2&&w.h.length<=4),g=Array(O*O).fill('');
  const dat=h=>{for(let n=0;n<80;n++){const D=pick([[1,0],[0,1],[1,1]]),a=Math.random()*O|0,b=Math.random()*O|0,cs=[...h].map((c,i)=>[a+D[0]*i,b+D[1]*i]);if(cs.every(([p,q],i)=>p<O&&q<O&&(!g[q*O+p]||g[q*O+p]===h[i]))){cs.forEach(([p,q],i)=>g[q*O+p]=h[i]);return true}}return false};
  const tim=ds.filter(w=>dat(w.h)),daTim=new Set;const nhieu=[...new Set(ALL.flatMap(w=>[...w.h]))];g.forEach((v,i)=>{if(!v)g[i]=pick(nhieu)});let con=tim.length,duong=[];
  veBody(`<div class="ttl">Vuốt qua các ô để tìm từ có nghĩa dưới đây</div><div class="timDs">${tim.map(w=>`<span data-h="${w.h}">${w.e} ${w.v}${S.review?` <b class="zh">${w.h}</b>`:''}</span>`).join('')}</div><div class="bangChu" id="bc">${g.map((c,i)=>`<div class="oC zh" data-i="${i}">${c}</div>`).join('')}</div>`);
  const bc=$('#bc'),o=i=>bc.children[i];const kiem=p=>{const st=p.map(i=>g[i]).join(''),w=tim.find(x=>x.h===st&&!daTim.has(x));p.forEach(i=>o(i).classList.remove('dang'));if(w){daTim.add(w);p.forEach(i=>o(i).classList.add('thay'));$(`.timDs [data-h="${w.h}"]`).classList.add('xong');C.hit(w,o(p[0]));say(w.h);if(--con<=0)setTimeout(C.end,500)}else if(p.length>1){C.miss(null,bc);bc.classList.remove('rung');void bc.offsetWidth;bc.classList.add('rung')}};
  const ke=(a,b)=>Math.abs(a%O-b%O)<=1&&Math.abs((a/O|0)-(b/O|0))<=1;const lay=e=>{const t=document.elementFromPoint(e.clientX,e.clientY);return t&&t.classList.contains('oC')?+t.dataset.i:null};
  bc.onpointerdown=e=>{const i=lay(e);if(i===null)return;e.preventDefault();duong=[i];o(i).classList.add('dang');sfx.pop()};
  bc.onpointermove=e=>{if(!duong.length)return;const i=lay(e);if(i===null||i===duong[duong.length-1])return;if(duong[duong.length-2]===i){o(duong.pop()).classList.remove('dang');return}if(!duong.includes(i)&&ke(duong[duong.length-1],i)){duong.push(i);o(i).classList.add('dang');sfx.pop()}};
  const het=()=>{if(duong.length){kiem(duong);duong=[]}};bc.onpointerup=het;bc.onpointercancel=het;P.wd={g,tim,kiem}},
 /* Tô theo chữ */
 trace(ws,C){const ds=nen(ws,C.gon?2:3,w=>true);let i=0;const Z=280;
  const mot=()=>{const w=ds[i],ch=w.h[0],F=`500 ${Z*.82}px "Noto Sans SC","Microsoft YaHei",sans-serif`;veBody(`<div class="ttl">Tô theo nét chữ ${i+1}/${ds.length}</div><div class="stage" style="flex:none"><div class="big" style="font-size:20px">${w.e} ${w.v} <span class="py">${w.p}</span></div></div><div class="toKhung tzg"><canvas id="tA" width="${Z}" height="${Z}"></canvas><canvas id="tB" width="${Z}" height="${Z}"></canvas></div><div class="two" style="margin-top:auto"><button class="btn alt" id="tX">🧽 Xoá nét</button><button class="btn" id="tD">Xong chữ này</button></div>`);
   const a=$('#tA').getContext('2d'),B=$('#tB'),b=B.getContext('2d',{willReadFrequently:true});a.fillStyle='#D3DDE8';a.font=F;a.textAlign='center';a.textBaseline='middle';a.fillText(ch,Z/2,Z/2+6);say(w.h);
   b.lineWidth=15;b.lineCap='round';b.lineJoin='round';b.strokeStyle='#22314F';let cu=null;const toa=e=>{const r=B.getBoundingClientRect();return[(e.clientX-r.left)*Z/r.width,(e.clientY-r.top)*Z/r.height]};
   B.onpointerdown=e=>{e.preventDefault();B.setPointerCapture(e.pointerId);cu=toa(e)};B.onpointermove=e=>{if(!cu)return;const p=toa(e);b.beginPath();b.moveTo(...cu);b.lineTo(...p);b.stroke();cu=p};B.onpointerup=()=>cu=null;$('#tX').onclick=()=>b.clearRect(0,0,Z,Z);
   const cham=()=>{const m=document.createElement('canvas');m.width=m.height=Z;const k=m.getContext('2d',{willReadFrequently:true});k.font=F;k.textAlign='center';k.textBaseline='middle';k.fillText(ch,Z/2,Z/2+6);const G1=k.getImageData(0,0,Z,Z).data;k.lineWidth=14;k.lineJoin='round';k.strokeText(ch,Z/2,Z/2+6);const G2=k.getImageData(0,0,Z,Z).data,U=b.getImageData(0,0,Z,Z).data;let g=0,gu=0,u=0,ut=0;for(let p=3;p<G1.length;p+=4){const us=U[p]>40;if(G1[p]>60){g++;if(us)gu++}if(us){u++;if(G2[p]>60)ut++}}return{phu:g?gu/g:0,dung:u?ut/u:0}};
   P.tr={cham,ve:(f)=>f(b),goi:()=>{a.fillStyle='#7F93AA';a.fillText(ch,Z/2,Z/2+6)}};
   $('#tD').onclick=()=>{const r=cham(),ok=r.phu>=.5&&r.dung>=.6;ok?C.hit(w,B):C.miss(w,B);toast(ok?`Đẹp lắm! Tô phủ ${Math.round(r.phu*100)}% chữ`:r.dung<.6?'Nét đi lệch khỏi chữ khá nhiều':'Chưa phủ hết chữ');if(++i<ds.length)setTimeout(mot,500);else setTimeout(C.end,500)}};mot()},
 /* Vẽ đường thanh điệu */
 tone(ws,C){const T='āēīōūǖ|áéíóúǘ|ǎěǐǒǔǚ|àèìòùǜ'.split('|'),sac=w=>{for(const c of w.p)for(let i=0;i<4;i++)if(T[i].includes(c))return i+1;return 0};const ds=nen(ws,C.gon?3:5,w=>w.h.length===1&&sac(w));const bo=s=>s.normalize('NFD').replace(/[̀-̄̌]/g,'').normalize('NFC');let i=0;const W=600,H=320;
  const hinh=t=>({1:[[60,90],[540,90]],2:[[60,250],[540,70]],3:[[60,130],[300,270],[540,70]],4:[[60,70],[540,270]]}[t]);
  const chia=(p)=>{if(p.length<3)return 0;const dy=p[p.length-1][1]-p[0][1],ng=H*.2;let mx=0;p.forEach((q,k)=>{if(q[1]>p[mx][1])mx=k});if(mx>p.length*.15&&mx<p.length*.85&&p[mx][1]-p[0][1]>ng*.7&&p[mx][1]-p[p.length-1][1]>ng*.7)return 3;return dy<-ng?2:dy>ng?4:1};
  const mot=()=>{const w=ds[i],t=sac(w);veBody(`<div class="ttl">Vẽ đường thanh điệu ${i+1}/${ds.length}</div><div class="stage" style="flex:none"><div class="tzg" style="width:96px;height:96px"><span class="zh" style="font-size:54px">${w.h}</span></div><div><span class="big" style="font-size:22px">${bo(w.p)}</span> <button class="mini" id="vL" aria-label="Nghe">🔊</button></div><small class="mut" style="font-weight:700">${w.v}${S.review?`, đáp án thanh ${t}`:''}</small></div><canvas id="vC" class="mgCan" width="${W}" height="${H}" style="touch-action:none"></canvas><div class="thanhMau">${[1,2,3,4].map(n=>`<span><svg viewBox="0 0 60 32" width="46" height="24"><polyline fill="none" stroke="#22314F" stroke-width="4" stroke-linecap="round" points="${hinh(n).map(([a,b])=>`${a/10},${b/10}`).join(' ')}"/></svg>${n}</span>`).join('')}</div>`);
   const c=$('#vC'),x=c.getContext('2d'),nen2=()=>{x.clearRect(0,0,W,H);x.fillStyle='#FFF9E0';x.fillRect(0,0,W,H);x.strokeStyle='#F2E3A6';[80,160,240].forEach(y=>{x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke()})};nen2();say(w.h);$('#vL').onclick=()=>say(w.h);
   let p=[],ve=false;const toa=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]};x.lineCap='round';
   const xet=q=>{const n=chia(q);if(!n)return;const ok=n===t;nen2();x.lineWidth=9;x.strokeStyle='#12B76A';const m=hinh(t);x.beginPath();x.moveTo(...m[0]);m.slice(1).forEach(a=>x.lineTo(...a));x.stroke();ok?C.hit(w,c):C.miss(w,c);if(!ok)toast(`Bạn vẽ thanh ${n}, đáp án là thanh ${t}`);say(w.h);setTimeout(()=>{++i<ds.length?mot():C.end()},900)};
   c.onpointerdown=e=>{e.preventDefault();c.setPointerCapture(e.pointerId);ve=true;p=[toa(e)];nen2()};c.onpointermove=e=>{if(!ve)return;const a=toa(e),b=p[p.length-1];p.push(a);x.lineWidth=8;x.strokeStyle='#FF6252';x.beginPath();x.moveTo(...b);x.lineTo(...a);x.stroke()};c.onpointerup=()=>{ve=false;xet(p)};P.tn={xet,hinh,t}};mot()},
 /* Quẹt thẻ trái phải */
 swipe(ws,C,theo){const n=C.gon?5:7,L=theo||nen(ws,n,w=>true).map((w,i)=>{const dg=i%2===0,kh=pick(ALL.filter(x=>x.v!==w.v));return{w,dg,top:`<span class="zh" style="font-size:46px">${w.h}</span><span class="py">${w.p}</span><strong style="font-size:21px">${dg?w.v:kh.v}</strong>`,noi:w.h}});const ds=shuf(L);let i=0;const nhan=theo?['📖 Kiểu sách','🗣️ Người thật nói']:['✗ Sai nghĩa','✓ Đúng nghĩa'];
  const ve=()=>{const it=ds[i];veBody(`<div class="ttl">${theo?'Câu này ai hay nói?':'Nghĩa này đúng không?'} ${i+1}/${ds.length}</div><div class="quetKhu"><div class="quetThe" id="qT">${it.top}${S.review?`<small class="tag">Đáp án: ${nhan[it.dg?1:0]}</small>`:''}</div></div><div class="two" style="margin-top:auto"><button class="btn alt" id="qL">◀ ${nhan[0]}</button><button class="btn" id="qR">${nhan[1]} ▶</button></div>`);
   P.quet=it;const t=$('#qT');let x0=null,dx=0,xong=false;const chot=d=>{if(xong)return;xong=true;t.style.transition='transform .3s';t.style.transform=`translateX(${d*520}px) rotate(${d*24}deg)`;const ok=(d>0)===it.dg;ok?C.hit(it.w,t):C.miss(it.w,t);if(!ok&&it.gt)toast(it.gt);say(it.noi);setTimeout(()=>{++i<ds.length?ve():C.end()},380)};
   t.onpointerdown=e=>{x0=e.clientX;t.setPointerCapture(e.pointerId);t.style.transition='none'};t.onpointermove=e=>{if(x0===null)return;dx=e.clientX-x0;t.style.transform=`translateX(${dx}px) rotate(${dx/14}deg)`};t.onpointerup=()=>{if(Math.abs(dx)>70)chot(Math.sign(dx));else{t.style.transition='transform .2s';t.style.transform=''}x0=null;dx=0};
   $('#qL').onclick=()=>chot(-1);$('#qR').onclick=()=>chot(1);P.pk&&removeEventListener('keydown',P.pk);P.pk=e=>{if(e.key==='ArrowLeft')chot(-1);if(e.key==='ArrowRight')chot(1)};addEventListener('keydown',P.pk)};ve();P.stop=()=>{removeEventListener('keydown',P.pk)}},
 native(ws,C){const L=TIPS.filter(t=>t[1]).flatMap(t=>[{dg:false,top:`<span class="zh" style="font-size:30px">${t[0]}</span><span class="py">${t[1]}</span><small class="mut">${t[4]}</small>`,noi:t[0],gt:t[5]},{dg:true,top:`<span class="zh" style="font-size:30px">${t[2]}</span><span class="py">${t[3]}</span><small class="mut">${t[4]}</small>`,noi:t[2],gt:t[5]}]);MG.swipe(ws,C,shuf(L).slice(0,8))},
 /* Băng chuyền */
 belt(ws,C){const L=shuf(MEASURE).slice(0,8);let i=0,giay=7;const all=[...new Set(MEASURE.map(m=>m[4]))];
  const mot=()=>{const[n,py,vi,e,mw,mp]=L[i],bo=shuf([mw,...shuf(all.filter(x=>x!==mw)).slice(0,2)]);veBody(`<div class="ttl">Thả hàng vào đúng thùng lượng từ ${i+1}/${L.length}</div><div class="bang"><div class="hang" id="hg" style="animation-duration:${giay}s"><span style="font-size:42px">${e}</span><span class="zh">一＿${n}</span>${showVi()?`<small>${vi}</small>`:''}</div><div class="baCh"></div></div><div class="thung">${bo.map(b=>`<button class="thu ${S.review&&b===mw?'goiyK':''}" data-b="${b}"${b===mw?' data-ok="1"':''}><span class="zh">${b}</span>📦</button>`).join('')}</div>`);
   let xong=false;const chot=(b,el)=>{if(xong)return;xong=true;clearTimeout(P.timer);const ok=b===mw;ok?C.hit(null,el):C.miss(null,el);if(!ok)toast(`一${mw}${n}: dùng ${mw}`);say('一'+mw+n);$('#hg').classList.add('roiXuong');giay=Math.max(3.5,giay-.5);setTimeout(()=>{++i<L.length?mot():C.end()},600)};
   $$('.thu').forEach(b=>b.onclick=()=>chot(b.dataset.b,b));P.timer=setTimeout(()=>chot('',$('#hg')),giay*1000)};mot()},
 /* Nối cầu theo thứ tự từ */
 bridge(ws,C){const L=shuf(ORDERS).slice(0,C.gon?1:4);let i=0;
  const mot=()=>{const[s0,py,vi,tip]=L[i],tok=s0.split('|'),mix=shuf(tok.map((t,k)=>({t,k})));let k=0,sai=false;veBody(`<div class="ttl">Bấm từng từ theo đúng thứ tự để nối cầu</div><div class="stage" style="flex:none"><div class="big" style="font-size:20px">${vi}</div>${S.review?`<small class="mut" style="font-weight:700">Đáp án: ${tok.join(' ')}</small>`:mode().py===true?pyHtml(py):''}</div><div class="song"><span class="bo">🌳</span><div class="cau" id="cu"></div><span class="bo">🏁</span><span class="gau" id="ga">🐼</span></div><div class="tiles" id="tl" style="margin-top:auto">${mix.map((m,x)=>`<button class="tile zh" data-x="${x}">${m.t}</button>`).join('')}</div>`);
   P.tiles={tok,lay:()=>tok.slice(0,k)};$$('#tl .tile').forEach(b=>b.onclick=()=>{const m=mix[+b.dataset.x];if(m.t===tok[k]){b.classList.add('an');$('#cu').insertAdjacentHTML('beforeend',`<span class="van zh">${m.t}</span>`);sfx.pop();k++;$('#ga').style.left=`calc(${k/tok.length*78+4}% )`;if(k===tok.length){if(!sai)C.hit(null,$('#cu'));say(tok.join(''));toast('💡 '+tip);setTimeout(()=>{++i<L.length?mot():C.end()},1500)}}else{if(!sai){sai=true;C.miss(null,b)}else sfx.bad();b.classList.remove('sai');void b.offsetWidth;b.classList.add('sai')}})};mot()},
 /* Lật thẻ */
 mem(ws,C){const n=C.gon?4:6,ds=nen(ws,n,w=>w.h.length<=3),cards=shuf(ds.flatMap(w=>[{w,z:1},{w,z:0}]));let mo=[],tim=0,khoa=false;
  veBody(`<div class="ttl">Lật hai thẻ cùng nghĩa</div><div class="mem">${cards.map((c,i)=>`<button class="mc" data-i="${i}" aria-label="Thẻ ${i+1}"><div><i>🐼</i><i>${c.z?`<span class="zh">${c.w.h}</span>`:c.w.e+' '+c.w.v}</i></div></button>`).join('')}</div>${S.review?`<small class="mut" style="text-align:center;font-weight:700">Gợi ý cặp: ${ds.map(w=>w.h+' = '+w.v).join(' · ')}</small>`:''}`);
  P.mem=cards;$$('.mc').forEach(b=>b.onclick=()=>{if(khoa||b.classList.contains('lat'))return;sfx.pop();b.classList.add('lat');const c=cards[b.dataset.i];if(c.z)say(c.w.h);mo.push([b,c]);if(mo.length<2)return;const[[x,a],[y,d]]=mo;mo=[];if(a.w===d.w){C.hit(a.w,y);x.classList.add('xong');y.classList.add('xong');if(++tim===n)setTimeout(C.end,500)}else{khoa=true;setTimeout(()=>{sfx.bad();x.classList.remove('lat');y.classList.remove('lat');khoa=false},800)}})},
 /* Bóng bay */
 balloon(ws,C){const giay=C.gon?18:45,pool=nen(ws,12,w=>w.h.length<=3);let left=giay,tgt,alive=true,duoc=0;const cols=['#FF6252','#FFC02E','#12B76A','#2B9DFF','#8E6BFF'];
  veBody(`<div class="stage" style="flex:none"><div class="big" id="bT"></div><small class="mut" style="font-weight:700">Còn <b id="bG">${giay}</b> giây</small></div><div class="sky" id="sky"></div>`);const sky=$('#sky');
  const newT=()=>{tgt=pick(pool);$('#bT').textContent=tgt.e+' '+tgt.v;$$('.bong').forEach(b=>b.classList.toggle('goiy',S.review&&b.dataset.h===tgt.h))};P.dich=()=>tgt;newT();
  const tha=()=>{if(!alive)return;const w=Math.random()<.42?tgt:pick(pool),b=document.createElement('button');b.className='bong';b.textContent=w.h;b.dataset.h=w.h;b.style.background=pick(cols);b.style.left=(Math.random()*Math.max(10,sky.clientWidth-90))+'px';b.style.setProperty('--h',sky.clientHeight+220+'px');b.style.animationDuration=(5.5+Math.random()*2.5)+'s';if((S.review||P.sang)&&w===tgt)b.classList.add('goiy');
   b.onclick=()=>{const r=b.getBoundingClientRect(),s=sky.getBoundingClientRect(),n=document.createElement('span');n.className='no';n.style.left=r.left-s.left+40+'px';n.style.top=r.top-s.top+40+'px';if(b.dataset.h===tgt.h){n.textContent='💥';C.hit(tgt,b);say(tgt.h);duoc++;newT();if(C.gon&&duoc>=5)xong()}else{n.textContent='💨';C.miss(byH[b.dataset.h],b);left=Math.max(1,left-3);toast(`${b.dataset.h} là “${byH[b.dataset.h].v}”, trừ 3 giây`)}sky.append(n);n.onanimationend=()=>n.remove();b.remove()};b.onanimationend=()=>b.remove();sky.append(b)};
  const xong=()=>{alive=false;clearInterval(sp);clearInterval(dh);sky.innerHTML='';C.end()};tha();const sp=setInterval(tha,850),dh=setInterval(()=>{left--;const e=$('#bG');if(e)e.textContent=left;if(left<=0)xong()},1000);P.stop=()=>{alive=false;clearInterval(sp);clearInterval(dh)}}};
function vGames(){render(`<h1 style="font-size:26px">Khu trò chơi 🎮</h1>${reviewBox()}<div class="gGrid">${Object.entries(GAMES).map(([k,g])=>`<button class="gCard" style="--c:${g.c}" data-g="${k}"><b>${g.e}</b><h3>${g.n}</h3><span class="zh">${g.zh}</span><small>${g.s}</small></button>`).join('')}</div>`);
 $$('.gCard').forEach(b=>b.onclick=()=>{sfx.tap();GAMES[b.dataset.g].run({})})}

function gRiddle(o={}){const g=GAMES.riddle;openPlay(g.c,g.d);const list=shuf(RIDDLES).slice(0,6);let i=0,right=0;$('#pH').textContent='🏮';
 function show(){setBar(i/list.length);$('#pF').innerHTML='';const[q,py,vi,a,apy,avi,why,bad]=list[i];const opts=shuf([a,...bad]);
  $('#pB').innerHTML=`<div class="ttl">Đoán một chữ Hán</div><div class="stage"><div class="rid"><span class="zh">${q}</span>${pyHtml(py)}${showVi()?`<div class="mut" style="font-weight:700">${vi}</div>`:''}</div></div><div class="dayLong">${opts.map((x,k)=>`<button class="opt long ${S.review&&x===a?'goiy':''}" data-x="${x}"${x===a?` data-ok="1" data-goi="${why}"`:''} style="animation-delay:-${k*.5}s"><span class="zh">${x}</span></button>`).join('')}</div>`;say(q);
  $$('.opt').forEach(b=>b.onclick=()=>{const ok=b.dataset.x===a;$$('.opt').forEach(x=>{x.disabled=true;if(x.dataset.x===a)x.classList.add('dung')});if(ok){right++;sfx.ok();confetti(30)}else{sfx.bad();b.classList.add('sai')}say(a);
   $('#pF').innerHTML=`<div class="fb ${ok?'':'sai'}"><div><h3>${ok?'Đoán trúng rồi! 🎉':'Chữ đúng là '+a}</h3><div class="fbR"><div><span class="zh" style="font-size:22px">${a}</span> <span class="py">${apy}</span> ${avi}<br>${why}</div></div><button class="btn full" id="bN">Tiếp tục</button></div></div>`;$('#bN').onclick=()=>{i++;i<list.length?show():gameEnd(o.id,right,list.length,()=>gRiddle(o))}})}
 show()}

function gChain(o={}){const g=GAMES.chain;openPlay(g.c,g.d);const chain=pick(CHAINS).split(';').map(s=>{const[h,p,v]=s.split('|');return{h,p,v}});const pool=CHAINS.flatMap(c=>c.split(';').map(s=>{const[h,p,v]=s.split('|');return{h,p,v}}));let i=0,right=0;const total=chain.length-1;$('#pH').textContent='🔗';
 function show(){setBar(i/total);const c=chain[i],n=chain[i+1],last=c.h.slice(-1);const bad=shuf(pool.filter(x=>x.h[0]!==last&&x.h!==c.h)).slice(0,2),opts=shuf([n,...bad]);
  $('#pB').innerHTML=`<div class="ttl">Chọn từ bắt đầu bằng chữ <span class="zh" style="color:var(--coralD);font-size:24px">${last}</span></div><div class="chain">${chain.slice(0,i+1).map((x,k)=>`${k?'<b>→</b>':''}<span class="zh ${k===i?'cuoi':''}">${k===i?x.h.slice(0,-1)+`<mark>${last}</mark>`:x.h}</span>`).join('')}</div><div class="stage"><small class="mut" style="font-weight:700">${c.p} · ${c.v}</small></div><div class="songDa">${opts.map(x=>`<button class="opt da ${S.review&&x===n?'goiy':''}" data-h="${x.h}"${x===n?' data-ok="1"':''}><span class="zh">${x.h}</span>${S.review||mode().py===true?`<small>${x.p}</small>`:''}${S.review?`<small>${x.v}</small>`:''}</button>`).join('')}</div>`;say(c.h);
  $$('.opt').forEach(b=>b.onclick=()=>{if(b.dataset.h===n.h){right+=b._sai?0:1;sfx.ok();b.classList.add('dung');$$('.opt').forEach(x=>x.disabled=true);fly('🔗',b);setTimeout(()=>{i++;i<total?show():gameEnd(o.id,right,total,()=>gChain(o))},550)}else{b._sai=1;$$('.opt').forEach(x=>x._sai=1);sfx.bad();b.classList.remove('sai');void b.offsetWidth;b.classList.add('sai')}})}
 show()}

function gRadical(o={}){const g=GAMES.radical;openPlay(g.c,g.d);const list=shuf(RADICALS).slice(0,7);let i=0,right=0;$('#pH').textContent='🧩';
 function show(){setBar(i/list.length);$('#pF').innerHTML='';const[a,b,r,py,vi,why]=list[i];const parts=[...new Set(RADICALS.flatMap(x=>[x[0],x[1]]))].filter(x=>x!==a&&x!==b);const tiles=shuf([a,b,...shuf(parts).slice(0,4)]);let sel=[],miss=false;
  $('#pB').innerHTML=`<div class="ttl">Ghép ra chữ có nghĩa</div><div class="stage"><div class="big">“${vi}”</div>${pyHtml(py)}<div class="merge" id="mg"><span class="mut">❓ + ❓</span></div></div><div class="tiles" style="margin-top:auto">${tiles.map((t,k)=>`<button class="tile zh" data-k="${k}" style="animation-delay:${k*.05}s;${S.review&&(t===a||t===b)?'border-color:var(--jade);border-style:dashed;':''}">${t}</button>`).join('')}</div>`;
  P.ghep=[a,b];$$('.tile').forEach(el=>el.onclick=()=>{sfx.pop();const k=+el.dataset.k;if(sel.includes(k)){sel=sel.filter(x=>x!==k);el.classList.remove('chon')}else{sel.push(k);el.classList.add('chon')}
   $('#mg').innerHTML=sel.length?sel.map(s=>`<span class="zh">${tiles[s]}</span>`).join('<b>+</b>'):'<span class="mut">❓ + ❓</span>';
   if(sel.length===2){const s=sel.map(x=>tiles[x]).sort().join(),t=[a,b].sort().join();if(s===t){sfx.win();if(!miss)right++;$$('.tile').forEach(x=>x.disabled=true);$('#mg').innerHTML=`<span class="zh">${a}</span><b>+</b><span class="zh">${b}</span><b>=</b><span class="zh kq">${r}</span>`;confetti(30);say(r);$('#pF').innerHTML=`<div class="fb"><div><h3>Ghép đúng! ${r} <span class="py">${py}</span></h3><div>${why}</div><button class="btn full" id="bN">Tiếp tục</button></div></div>`;$('#bN').onclick=()=>{i++;i<list.length?show():gameEnd(o.id,right,list.length,()=>gRadical(o))}}else{miss=true;sfx.bad();const m=$('#mg');m.style.animation='rung .35s';setTimeout(()=>{m.style.animation='';sel=[];$$('.tile').forEach(x=>x.classList.remove('chon'));m.innerHTML='<span class="mut">❓ + ❓</span>'},400)}}})}
 show()}

function gChat(o={}){const g=GAMES.chat;if(o.p===undefined){const b=sheet(`<h2>Chọn tình huống</h2>${CHATS.map((c,i)=>`<button class="mode" data-p="${i}"><b>${c.e}</b><div><h3>${c.t}</h3><small>Nói chuyện với ${c.who.toLowerCase()}</small></div></button>`).join('')}`);b.querySelectorAll('.mode').forEach(x=>x.onclick=()=>{b.remove();gChat({...o,p:+x.dataset.p})});return}
 openPlay(g.c,g.d);const C=CHATS[o.p];let i=0,right=0,miss=false;$('#pH').textContent=C.e;
 $('#pB').innerHTML=`<div class="ttl">${C.e} ${C.t}</div><div class="chatBox" id="cb"></div><div class="chatO" id="co"></div>`;
 const add=(zh,py,vi,me)=>{const d=document.createElement('div');d.className='bub '+(me?'toi':'npc');d.innerHTML=`${me?'':`<span style="font-size:22px">${C.npc}</span>`}<div><span class="zh">${zh}</span>${pyHtml(py)}${showVi()?`<small>${vi}</small>`:''}</div>`;const b=$('#cb');b.append(d);b.scrollTop=b.scrollHeight};
 function step(){setBar(i/C.s.length);const[nz,np,nv,az,ap,av,bad]=C.s[i];add(nz,np,nv,0);say(nz);miss=false;const opts=shuf([{z:az,v:av,ok:1},...bad.map(([z,v])=>({z,v}))]);
  $('#co').innerHTML=opts.map((x,k)=>`<button class="opt ${S.review&&x.ok?'goiy':''}" data-k="${k}"${x.ok?' data-ok="1"':''}><span><span class="zh">${x.z}</span>${showVi()?`<small style="display:block">${x.v}</small>`:''}</span></button>`).join('');
  $$('#co .opt').forEach(b=>b.onclick=()=>{const x=opts[+b.dataset.k];if(x.ok){if(!miss)right++;sfx.ok();$('#co').innerHTML='';add(az,ap,av,1);say(az);setTimeout(()=>{i++;i<C.s.length?step():gameEnd(o.id,right,C.s.length,()=>gChat(o))},1300)}else{miss=true;sfx.bad();b.classList.add('sai');toast('Trả lời vậy người ta sẽ ngơ ra đó 😅');b.disabled=true}})}
 step()}

function tipRow(t){const[bk,bp,re,rp,kh,gt]=t;return`<div class="tipC"><div class="tipH"><span>Sách hay dạy</span><span class="zh">${bk}</span></div><div class="tipH tot"><span>Người thật hay nói</span><span class="zh">${re}</span><button class="mini" onclick="say('${re}')" aria-label="Nghe">🔊</button></div><span class="py">${rp}</span><small><b>${kh}.</b> ${gt}</small></div>`}
function allTips(){sheet(`<h2>💡 Gợi ý nói tự nhiên</h2><p class="mut" style="margin:0;font-size:14px;font-weight:700">Đây là gợi ý để nói chuyện đời thường. Khi đi thi vẫn dùng câu chuẩn.</p>${TIPS.map(tipRow).join('')}<p class="mut" style="margin:0;font-size:13px">Số lần đếm lấy từ 822 bình luận thật trên V2EX và Bilibili, mẫu còn nhỏ và là chữ gõ, không phải lời nói.</p>`)}
function gSpeak(o={}){const g=GAMES.speak;openPlay(g.c,g.d);const list=shuf(SPEAK).slice(0,5);let i=0,right=0;$('#pH').textContent='🎙️';
 function show(){setBar(i/list.length);const[zhT,vt,q,qp,qv,a,ap,av,e]=list[i];let mo=S.review;const tn=NATURAL[SPEAK.indexOf(list[i])];
  const draw=()=>{$('#pB').innerHTML=`<div class="ttl">${e} ${vt}</div><div class="stage"><div class="rid"><span class="zh">${q}</span>${pyHtml(qp)}${showVi()?`<div class="mut" style="font-weight:700">${qv}</div>`:''}</div><button class="btn alt" id="bQ">🔊 Nghe câu hỏi</button></div>${mo?`<div class="rid cuon" style="border-color:var(--jade)"><strong>Câu trả lời mẫu</strong><span class="zh" style="font-size:20px;font-weight:500">${a}</span><span class="py">${ap}</span><span class="mut" style="font-weight:700">${av}</span><button class="btn alt" id="bA">🔊 Nghe mẫu rồi nói theo</button></div>${tn?`<div class="rid cuon goiYN"><strong>💡 Gợi ý nói tự nhiên hơn</strong><span class="zh" style="font-size:20px;font-weight:500">${tn[0]}</span><span class="py">${tn[1]}</span><small class="mut" style="font-weight:700">Dùng khi trò chuyện. Khi đi thi nên dùng câu mẫu ở trên.</small><button class="btn alt" id="bT">🔊 Nghe cách nói này</button></div>`:''}<div class="ttl" style="font-size:16px">Bạn nói được đến đâu?</div><div class="opts" style="grid-template-columns:repeat(3,minmax(0,1fr))"><button class="opt" data-v="0">😅<small>Còn vấp</small></button><button class="opt" data-v="1">🙂<small>Tạm được</small></button><button class="opt" data-v="2">😎<small>Trôi chảy</small></button></div>`:`<p class="mut" style="text-align:center;font-weight:700">Tự nói to câu trả lời của mình trong 30 giây, sau đó xem mẫu.</p><button class="btn full" id="bM" style="margin-top:auto">Xong, xem câu mẫu</button>`}`;
   $('#bQ').onclick=()=>say(q);if($('#bM'))$('#bM').onclick=()=>{mo=true;sfx.pop();draw();say(a)};if($('#bA'))$('#bA').onclick=()=>say(a);if($('#bT'))$('#bT').onclick=()=>say(tn[0]);
   $$('.opt').forEach(b=>b.onclick=()=>{if(+b.dataset.v)right++;sfx.ok();i++;i<list.length?show():gameEnd(o.id,right,list.length,()=>gSpeak(o))})};
  draw();say(q)}
 show()}

/* ===== Lịch xoay mỗi ngày: cùng ngày thì mọi máy ra cùng một kết quả ===== */
const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const rng=seed=>{let x=hash(seed)||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;x>>>=0;return x/4294967296}};
const sshuf=(a,r)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=r()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
let dOff=0;
const curDate=()=>{const d=new Date();d.setDate(d.getDate()+dOff);return d};
const ymd=d=>d.toLocaleDateString('sv');
const dmy=d=>d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
const dayNo=d=>Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(2026,0,1))/864e5);
const THU=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const TWIST=[
 {e:'📝',n:'Ngày đề mới',d:'Phòng thi vừa có đề tuần này',t:['chunk','listen','tone']},
 {e:'🌱',n:'Khởi động nhẹ',d:'Chỉ đoán nghĩa và chọn chữ',t:['mean','rev']},
 {e:'👂',n:'Ngày tai thính',d:'Toàn bộ là câu nghe',t:['listen']},
 {e:'🧩',n:'Ngày điền cụm',d:'Điền từ còn thiếu vào cụm',t:['chunk']},
 {e:'🎵',n:'Săn thanh điệu',d:'Toàn bộ là câu thanh điệu',t:['tone']},
 {e:'⚡',n:'Đấu nhanh',d:'Mỗi câu chỉ có 8 giây',t:['rev','chunk'],timer:8},
 {e:'🎉',n:'Chơi cho vui',d:'Trộn đủ dạng câu',t:['mean','rev','chunk','listen']}];
function planOf(d){const n=dayNo(d),r=rng(ymd(d)),keys=Object.keys(GAMES),flat=WORLDS.flatMap(W=>W.lessons.map((L,i)=>({W,L,i})));
 const deck=sshuf(keys,rng('xoay')),dat=!dOff&&LICH_HOM||{};let games=[0,1,2].map(k=>deck[(n*3+k)%deck.length]);if(dat.tro){const g=dat.tro.split(',').map(x=>x.trim()).filter(k=>GAMES[k]);if(g.length)games=g.slice(0,3)}
 const les=flat.find(x=>x.L.t===dat.bai)||flat[n%flat.length],weak=[...ALL].sort((a,b)=>(S.box[a.h]||0)-(S.box[b.h]||0)||r()-.5).slice(0,6);
 return{loi:dat.loi,tip:TIPS[n%TIPS.length],tw:TWIST[d.getDay()],games,les,word:ALL[r()*ALL.length|0],words:[...weak,...sshuf(les.L.words,r).slice(0,4)]}}
function todayCard(){const d=curDate(),p=planOf(d),done=!!S.stars['day-'+ymd(d)];
 return`<section class="card homnay" style="--w:${p.les.W.c};--wD:${p.les.W.d}"><div class="hnTop"><div><small>${THU[d.getDay()]}, ${dmy(d)}</small><h2>Hôm nay ${p.tw.e} ${p.tw.n}</h2></div>${S.review?`<div class="hnNgay"><button class="mini" id="dLui" aria-label="Xem ngày trước">◀</button><button class="mini" id="dTien" aria-label="Xem ngày sau">▶</button></div>`:''}</div>
 ${p.loi?`<p class="hnThu">💌 ${p.loi}</p>`:''}${dOff?`<p class="hnThu">Đang xem thử lịch của ngày khác. <button class="link" id="dVe">Về hôm nay</button></p>`:''}
 <div class="hnList"><button class="hnBai" id="hnThach"><b>${p.tw.e}</b><span><strong>Thử thách ngày ${done?'✅':''}</strong><small>${p.tw.d}, 10 câu, trộn từ còn yếu</small></span></button><button class="hnBai" id="hnBai"><b>${p.les.L.e}</b><span><strong>Bài hôm nay: ${p.les.L.t}</strong><small>${p.les.W.name}, 8 từ</small></span></button></div>
 <div class="hnGame">${p.games.map(k=>`<button class="hnG" style="--c:${GAMES[k].c}" data-g="${k}"><b>${GAMES[k].e}</b>${GAMES[k].n}</button>`).join('')}</div>
 <button class="hnTu" id="hnTu"><span class="zh">${p.word.h}</span><span><span class="py">${p.word.p}</span><br>Từ của ngày: ${p.word.v}</span><b>🔊</b></button><button class="hnTip" id="hnTip"><b>💡</b><span>Thay vì <span class="zh">${p.tip[0]}</span> thử nói <span class="zh">${p.tip[2]}</span><small>${p.tip[4]}. Chạm để xem thêm gợi ý</small></span></button></section>`}
function bindToday(){const d=curDate(),p=planOf(d),re=()=>{sfx.tap();vMap()};
 const on=(id,f)=>{const e=$(id);if(e)e.onclick=f};
 on('#dLui',()=>{dOff--;re()});on('#dTien',()=>{dOff++;re()});on('#dVe',()=>{dOff=0;re()});
 on('#hnBai',()=>{const ds=LEVELS.filter(x=>x.L===p.les.L);openDlg(ds.find(x=>!S.stars[x.id])||ds[0])});on('#hnTu',()=>say(p.word.h));on('#hnTip',()=>{say(p.tip[2]);allTips()});
 const thach=()=>{openPlay(p.les.W.c,p.les.W.d);runQuiz({title:p.tw.n,words:p.words,pool:ALL,n:10,types:p.tw.t,timer:p.tw.timer,id:'day-'+ymd(d),again:thach})};on('#hnThach',thach);
 $$('.hnG').forEach(b=>b.onclick=()=>{sfx.tap();GAMES[b.dataset.g].run({})})}

/* ===== Phòng thi ===== */
const EF={
 old2:{n:'Dạng đề cũ, cấp 2',lv:2,nghe:6,doc:4,pass:1,viet:0,noi:0,phut:12},
 old3:{n:'Dạng đề cũ, cấp 3',lv:3,nghe:6,doc:4,pass:2,viet:3,noi:0,phut:18},
 new3:{n:'Dạng đề mới, cấp 3',lv:3,nghe:6,doc:4,pass:2,viet:3,noi:2,phut:22}};
const soCau=F=>F.nghe+F.doc+F.pass*2+F.viet+F.noi;
function examsList(){const t=curDate(),sun=new Date(t);sun.setDate(t.getDate()-t.getDay());return Array.from({length:9},(_,k)=>{const d=new Date(sun);d.setDate(sun.getDate()-7*k);return{id:'D'+ymd(d),d,f:['new3','old3','old2'][Math.floor(dayNo(d)/7)%3]}})}
function vExam(){const L=examsList();render(`<h1 style="font-size:26px">Phòng thi 📝</h1><div class="card"><p style="margin:0">Mỗi Chủ nhật có một đề mới, đề cũ được giữ lại để làm lại. Đây là <b>đề mô phỏng rút gọn</b> soạn theo dạng câu hỏi HSK, không phải đề gốc của kỳ thi.</p></div><div class="exGrid">${L.map((e,i)=>{const F=EF[e.f],kq=(S.exams||{})[e.id];return`<button class="exC" data-e="${e.id}"><b>${e.f==='new3'?'🆕':'📄'}</b><span><strong>${dmy(e.d)} ${i?'':'<span class="tag">Đề mới nhất</span>'}</strong><small>${F.n}</small><small>${soCau(F)} câu, ${F.phut} phút${F.noi?', có phần nói':''}</small></span><em class="${kq?(kq.pct>=60?'dat':'chua'):''}">${kq?kq.pct+'%':'Làm bài'}</em></button>`}).join('')}</div>`);
 $$('.exC').forEach(b=>b.onclick=()=>{sfx.tap();runExam(L.find(e=>e.id===b.dataset.e))})}
function makeExam(e){const F=EF[e.f],r=rng(e.id),ws=sshuf(ALL.filter(w=>w.lv&&w.lv<=F.lv),r),qs=[];let k=0;const nw=()=>ws[k++%ws.length];
 const four=(w,key)=>{const o=sshuf([w,...sshuf(ws.filter(x=>x[key]!==w[key]),r).slice(0,3)],r);return{o,ans:o.indexOf(w)}};
 for(let i=0;i<F.nghe;i++){const w=nw();if(i%2){const{o,ans}=four(w,'cv');qs.push({part:'Nghe',say:w.c,py:w.cp,ask:'Nghe và chọn nghĩa đúng',opts:o.map(x=>x.cv),ans})}else{const{o,ans}=four(w,'h');qs.push({part:'Nghe',say:w.h,py:w.p,ask:'Nghe và chọn đúng từ',opts:o.map(x=>x.h),zh:1,ans})}}
 for(let i=0;i<F.doc;i++){const w=nw(),{o,ans}=four(w,'h');qs.push({part:'Đọc',text:w.c.replace(w.h,'＿＿'),vi:w.cv,ask:'Chọn từ điền vào chỗ trống',opts:o.map(x=>x.h),zh:1,ans})}
 sshuf(PASSAGES,r).slice(0,F.pass).forEach(P2=>P2[3].forEach(([q,qv,o])=>{const op=sshuf(o,r);qs.push({part:'Đọc',pass:P2,text:q,vi:qv,ask:'Đọc đoạn văn rồi trả lời',opts:op,zh:1,ans:op.indexOf(o[0])})}));
 sshuf(ORDERS,r).slice(0,F.viet).forEach(o=>{const t=o[0].split('|');qs.push({part:'Viết',order:t,mix:sshuf(t,r),vi:o[2],py:o[1],ask:'Xếp thành câu đúng'})});
 sshuf(SPEAK,r).slice(0,F.noi).forEach(x=>qs.push({part:'Nói',sp:x,ask:'Nói to câu trả lời trong 30 giây rồi tự chấm'}));
 return{F,qs}}
function runExam(e){const{F,qs}=makeExam(e);openPlay('#8E6BFF','#6B46E0');$('#pGoi').hidden=true;const A=qs.map(q=>q.order?[]:null);let i=0,left=F.phut*60;
 const clock=()=>{const m=$('#pH');if(m)m.textContent=`⏱ ${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`};clock();
 P.iv=setInterval(()=>{left--;clock();if(left<=0)nop()},1000);
 function view(){const q=qs[i];setBar(i/qs.length);const hint=S.review;
  let body='';
  if(q.say)body=`<div class="stage"><button class="loa" id="eLoa" aria-label="Nghe">🔊</button>${hint||(!AUD&&noVoice())?`<small class="mut">${q.py}</small>`:''}</div>`;
  if(q.pass)body+=`<div class="rid"><span class="zh" style="font-size:18px;font-weight:500">${q.pass[0]}</span>${hint?`<small class="py">${q.pass[1]}</small><small class="mut" style="display:block;font-weight:700">${q.pass[2]}</small>`:''}</div>`;
  if(q.text)body+=`<div class="stage"><div class="rid"><span class="zh">${q.text}</span>${showVi()?`<small class="mut" style="font-weight:700">${q.vi}</small>`:''}</div></div>`;
  if(q.opts)body+=`<div class="opts">${q.opts.map((o,k)=>`<button class="opt ${A[i]===k?'chon':''} ${hint&&k===q.ans?'goiy':''}" data-k="${k}">${q.zh?`<span class="zh">${o}</span>`:o}</button>`).join('')}</div>`;
  if(q.order)body+=`<div class="stage"><div class="big" style="font-size:20px">${q.vi}</div>${hint?`<small class="mut" style="font-weight:700">Đáp án: ${q.order.join(' ')}</small>`:''}</div><div class="slot">${A[i].map((k,x)=>`<button class="tile zh" data-x="${x}">${q.mix[k]}</button>`).join('')}</div><div class="tiles">${q.mix.map((t,k)=>`<button class="tile zh ${A[i].includes(k)?'an':''}" data-m="${k}">${t}</button>`).join('')}</div>`;
  if(q.sp)body+=`<div class="stage"><span class="emo">${q.sp[8]}</span><div class="rid"><span class="zh">${q.sp[2]}</span>${pyHtml(q.sp[3])}${showVi()?`<small class="mut" style="font-weight:700">${q.sp[4]}</small>`:''}</div><button class="btn alt" id="eQ">🔊 Nghe câu hỏi</button></div><div class="opts" style="grid-template-columns:repeat(3,minmax(0,1fr))">${[['😅 Chưa nói được',0],['🙂 Tạm được',.5],['😎 Trôi chảy',1]].map(([t,v])=>`<button class="opt ${A[i]===v?'chon':''}" data-v="${v}">${t}</button>`).join('')}</div>`;
  $('#pB').innerHTML=`<div class="ttl">Câu ${i+1}/${qs.length} · Phần ${q.part}</div><div class="ttl" style="font-size:15.5px">${q.ask}</div>${body}<div class="two" style="margin-top:auto"><button class="btn alt" id="ePrev" ${i?'':'disabled'}>◀ Câu trước</button><button class="btn" id="eNext">${i<qs.length-1?'Câu sau ▶':'Nộp bài'}</button></div>`;
  if(q.say){$('#eLoa').onclick=()=>say(q.say);setTimeout(()=>say(q.say),250)}
  if($('#eQ'))$('#eQ').onclick=()=>say(q.sp[2]);
  $$('.opt[data-k]').forEach(b=>b.onclick=()=>{A[i]=+b.dataset.k;sfx.pop();view()});
  $$('.opt[data-v]').forEach(b=>b.onclick=()=>{A[i]=+b.dataset.v;sfx.pop();view()});
  $$('.tile[data-m]').forEach(b=>b.onclick=()=>{A[i].push(+b.dataset.m);sfx.pop();view()});
  $$('.slot .tile').forEach(b=>b.onclick=()=>{A[i].splice(+b.dataset.x,1);sfx.pop();view()});
  $('#ePrev').onclick=()=>{i--;view()};
  $('#eNext').onclick=()=>{sfx.tap();i<qs.length-1?(i++,view()):nop()}}
 function diem(q,a){if(q.sp)return a||0;if(q.order)return a.map(k=>q.mix[k]).join('')===q.order.join('')?1:0;return a===q.ans?1:0}
 function nop(){clearInterval(P.iv);setBar(1);$('#pH').textContent='🏁';const ps={};let sum=0;qs.forEach((q,k)=>{const d=diem(q,A[k]);sum+=d;const x=ps[q.part]=ps[q.part]||[0,0];x[0]+=d;x[1]++});
  const pct=Math.round(sum/qs.length*100);S.exams=S.exams||{};const cu=S.exams[e.id];if(!cu||pct>=cu.pct)S.exams[e.id]={pct,ngay:today()};addXp(pct);if(pct>=60)tuoiCay();
  const sai=qs.map((q,k)=>[q,k]).filter(([q,k])=>diem(q,A[k])<1);
  $('#pB').innerHTML=`<div class="stage"><span class="emo">${pct>=60?'🐼':'🥺'}</span><h2>${pct}%</h2><p class="mut" style="margin:0;font-weight:700">Đúng ${sum}/${qs.length} câu, ${dmy(e.d)}. Mốc 60% là mốc tự đặt của app.</p></div><div class="card">${Object.entries(ps).map(([n,[a,b]])=>`<div class="q" style="grid-template-columns:52px 1fr auto"><span>${n}</span><span></span><span class="mut">${a}/${b}</span><div class="bar"><i style="width:${a/b*100}%"></i></div></div>`).join('')}</div>${sai.length?`<h3>Xem lại câu chưa đúng</h3><div class="cuon">${sai.map(([q,k])=>`<div class="chunk" style="background:var(--paper);border:2px solid var(--line)">${q.sp?`<span class="zh">${q.sp[5]}</span><small>${q.sp[7]}</small>`:q.order?`<span class="zh">${q.order.join('')}</span><small>${q.py}</small><small>${q.vi}</small>`:`<small>${q.text||q.py}</small><span class="zh">${q.opts[q.ans]}</span>${q.vi?`<small>${q.vi}</small>`:''}`}</div>`).join('')}</div>`:''}<div class="two"><button class="btn alt" id="eLai">↻ Làm lại</button><button class="btn" onclick="closePlay()">Xong</button></div>`;
  if(pct>=60){sfx.win();confetti()}else sfx.bad();$('#eLai').onclick=()=>runExam(e)}
 view()}

/* ===== Sổ từ ===== */
let fW='all',fQ='',fL='all';
function vWords(){const n=[0,0,0,0];ALL.forEach(w=>n[S.box[w.h]||0]++);
 render(`<h1 style="font-size:26px">Sổ từ của tôi 📒</h1><div class="card"><div class="legend"><span><i style="background:var(--line)"></i>Chưa học ${n[0]}</span><span><i style="background:var(--sun)"></i>Mới biết ${n[1]}</span><span><i style="background:var(--sea)"></i>Đang nhớ ${n[2]}</span><span><i style="background:var(--jade)"></i>Đã thuộc ${n[3]}</span></div><div class="bar" style="margin:9px 0"><i style="width:${n[3]/ALL.length*100}%"></i></div><button class="btn full" id="bOn">🎯 Ôn những từ yếu nhất</button><button class="btn alt full" id="bTip" style="margin-top:8px">💡 Gợi ý nói tự nhiên</button></div>
 <input id="tim" placeholder="Tìm chữ Hán, pinyin hoặc nghĩa" value="${fQ}" aria-label="Tìm từ"><div class="tools" id="fl"><button class="chip ${fW==='all'?'on':''}" data-w="all">Tất cả</button>${WORLDS.map(W=>`<button class="chip ${fW===W.id?'on':''}" data-w="${W.id}">${W.e} ${W.name}</button>`).join('')}</div><div class="tools" id="fl2">${[['all','Mọi cấp'],['1','HSK 1'],['2','HSK 2'],['3','HSK 3'],['0','Đời thật']].map(([k,t])=>`<button class="chip ${fL===k?'on':''}" data-l="${k}">${t}</button>`).join('')}</div><div class="wGrid" id="wg"></div>`);
 const paint=()=>{const q=fQ.toLowerCase();$('#wg').innerHTML=ALL.filter(w=>(fW==='all'||w.world===fW)&&(fL==='all'||w.lv==fL)&&(!q||w.h.includes(q)||w.p.toLowerCase().includes(q)||w.v.toLowerCase().includes(q))).map(w=>`<button class="wC b${S.box[w.h]||0}" data-h="${w.h}"><span class="zh">${w.h}</span><small>${w.p}</small><small>${w.v}</small>${w.lv?'':'<small>✦ ngoài đề</small>'}</button>`).join('')||'<p class="mut">Không có từ nào khớp.</p>';$$('.wC').forEach(b=>b.onclick=()=>wordSheet(b.dataset.h))};paint();
 $('#tim').oninput=e=>{fQ=e.target.value.trim();paint()};
 $$('#fl .chip').forEach(b=>b.onclick=()=>{fW=b.dataset.w;$$('#fl .chip').forEach(c=>c.classList.toggle('on',c===b));paint()});
 $$('#fl2 .chip').forEach(b=>b.onclick=()=>{fL=b.dataset.l;$$('#fl2 .chip').forEach(c=>c.classList.toggle('on',c===b));paint()});
 $('#bTip').onclick=allTips;$('#bOn').onclick=()=>{const ws=[...ALL].sort((a,b)=>(S.box[a.h]||0)-(S.box[b.h]||0)||Math.random()-.5).slice(0,10);const r=()=>{openPlay();runQuiz({title:'Ôn từ yếu',words:ws,pool:ALL,n:10,again:r})};r()}}
function wordSheet(h){const w=byH[h];sheet(`<div style="display:flex;gap:12px;align-items:center"><div class="tzg ${w.h.length>1?'dai':''}" style="flex:none;min-height:96px;${w.h.length>1?'':'width:96px;height:96px'}"><span class="zh" style="font-size:44px">${w.h}</span></div><div style="min-width:0"><div class="big">${w.e} ${w.v}</div><span class="py" style="font-size:18px">${w.p}</span><div>${tag(w)}</div></div></div><div class="chunk" style="background:var(--mint)"><span class="zh">${w.c}</span><small>${w.cp}</small><small>${w.cv}</small></div><div class="two"><button class="btn alt" onclick="say('${w.h}')">🔊 Nghe từ</button><button class="btn" onclick="say('${w.c}')">🔊 Nghe cụm</button></div>`);say(w.h)}

/* ===== Đề cương ===== */
function vPlan(){render(`<div class="plan" style="display:flex;flex-direction:column;gap:14px"><h1 style="font-size:26px">Đề cương 12 tuần 🧭</h1>
<div class="card"><h2>Mục tiêu</h2><p>Từ nền HSK2 đi lên HSK3 <b>theo đề thi mới</b>, và thước đo là nói được việc thật: tự gọi đồ uống, đi taxi, hẹn bạn qua WeChat. Từ vựng đi trước, ngữ pháp đi theo trong từng câu.</p></div>
<div class="card"><h2>Khác gì học theo sách?</h2><div class="vs">${[['Học thuộc từng từ lẻ','Học cả cụm hay đi cùng nhau, như 别担心 (đừng lo)'],['Chép chữ theo nét, không biết vì sao','Ghép chữ theo bộ phận, biết phần nào chỉ nghĩa, phần nào gợi âm'],['Bài khóa kiểu "Đây là sách của tôi"','Tình huống thật: 半糖少冰 (nửa đường ít đá), gọi tài xế là 师傅'],['Trò chơi không liên quan','Đố chữ 字谜 và nối chữ 词语接龙, hai trò chơi chữ quen thuộc của người Trung'],['Quên sau một tuần','Từ sai quay lại ngay trong bài, sổ từ theo dõi từ nào còn yếu']].map(([a,b])=>`<div class="vsR"><div>${a}</div><div>${b}</div></div>`).join('')}</div></div>
<div class="card"><h2>Lộ trình</h2>${WORLDS.map((W,i)=>`<div class="wk"><b>Tuần ${i*2+1}–${i==4?12:i*2+2}</b><div><strong>${W.e} ${W.name}</strong> <span class="zh">${W.zh}</span><small>${W.cap}. Làm được: ${W.goal.toLowerCase()}.</small><small>Chủ đề: ${W.lessons.map(l=>l.t).join(', ')}. Trò chơi: ${W.game.n}.</small></div></div>`).join('')}</div>
<div class="card"><h2>Mỗi ngày 15 phút</h2><div class="daily"><div><b>🔁</b>5 phút ôn từ yếu</div><div><b>📚</b>5 phút một bài mới</div><div><b>🎮</b>5 phút chơi một trò</div></div></div>
<div class="card"><h2>Bài mới tự xoay</h2><div class="wk"><b>Mỗi sáng</b><div>Lịch hôm nay tự đổi: bài học, 3 trò chơi, thử thách và từ của ngày.<small>Lịch được xếp trên Google Sheet. Ngày nào chưa xếp thì app tự xoay.</small></div></div><div class="wk"><b>Chủ nhật</b><div>Phòng thi có thêm một đề mới, đề cũ vẫn giữ lại.</div></div><div class="wk"><b>Hằng tuần</b><div>Claude soạn thêm từ, câu đố và đề, kiểm tra pinyin rồi nạp vào kho bài.</div></div></div>
<div class="card"><h2>Nói cho tự nhiên</h2><p>Bài học vẫn bám đề thi. Bên cạnh đó có <b>gợi ý</b> cách người Trung nói thật ngoài đời, không bắt buộc học, dùng khi trò chuyện chứ không dùng khi thi.</p><p class="mut" style="font-size:14px;font-weight:700">Nguồn: bảng so sánh của <a href="https://eachtone.com/blog/stop-sounding-like-a-textbook" target="_blank" rel="noopener">EachTone</a>, <a href="https://doi.org/10.17265/1539-8072/2019.02.005" target="_blank" rel="noopener">nghiên cứu về cách dùng 你好</a>, và 822 bình luận thật trên V2EX, Bilibili (mẫu nhỏ, là chữ gõ). Các câu gợi ý trong Luyện thi nói do Claude viết theo những mẫu đó.</p></div>
<div class="card"><h2>Đề thi mới</h2><div class="daily"><div><b>300</b>từ cấp 1</div><div><b>+200</b>từ cấp 2, tổng 500</div><div><b>+500</b>từ cấp 3, tổng 1.000</div></div>
<div class="wk" style="margin-top:8px"><b>Kỳ thi đầu</b><div>13/12/2026 là đợt thi thường đầu tiên theo đề mới.<small>Cần xác nhận lại lịch với điểm thi.</small></div></div>
<div class="wk"><b>Bài viết</b><div>Cấp 3 có 70 câu, khoảng 83 phút.</div></div>
<div class="wk"><b>Bài nói</b><div>Cấp 3 có phần thi nói khoảng 15 phút.<small>Hai đợt thi thử năm 2026 bắt buộc đăng ký kèm, trò Luyện thi nói dành cho phần này.</small></div></div>
<div class="wk"><b>Hiện có</b><div>${ALL.filter(w=>w.lv).length} từ nằm trong đề cấp 1–3, ${ALL.filter(w=>!w.lv).length} từ đời thật được ghi rõ là ngoài đề.<small>Mỗi tuần thêm từ mới cho tới khi đủ 1.000 từ.</small></div></div>
<p style="margin-top:8px">Nguồn: <a href="https://studycli.org/hsk/the-new-hsk/" target="_blank" rel="noopener">CLI: lịch và cấu trúc đề</a>, <a href="https://github.com/ofou/hsk/releases/tag/data-2026-11" target="_blank" rel="noopener">danh sách từ theo đề cương 2025</a>, <a href="https://www.lrdc.pitt.edu/perfettilab/pubpdfs/ChineseRadicalBasedGrouping.pdf" target="_blank" rel="noopener">nghiên cứu học chữ theo bộ (Pitt)</a>.</p></div></div>`)}

/* Khởi động */
$('#bg').innerHTML=[...'学习汉字好词语说听读写爱'].map((c,i)=>`<span style="left:${(i*37)%96}%;top:${(i*61)%92}%;font-size:${26+(i*13)%38}px;animation-delay:-${i*1.3}s">${c}</span>`).join('');
$$('#nav button').forEach(b=>b.onclick=()=>{sfx.tap();go(b.dataset.v)});
$('#bMode').onclick=pickMode;
$('#bSound').onclick=()=>{S.sound=!S.sound;save();syncTop()};
try{speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>{}}catch(e){}
addEventListener('keydown',e=>{if(P.el.hidden||e.target.tagName==='INPUT')return;const n=+e.key;if(n>=1&&n<=4){const o=$$('#pB .opt:not([disabled])')[n-1];if(o){e.preventDefault();o.click()}}else if(e.key==='Enter'){const b=$('#bN')||$('#eNext')||$('#b1');if(b&&!b.disabled){e.preventDefault();b.click()}}});
/* Đồng bộ: gửi tiến độ, nhận bản đã gộp, lịch hôm nay và bài mới. Mất mạng thì vẫn chơi, lần sau gửi bù. */
const dong=async()=>{if(!CF.k||!CF.u||dangDong)return;dangDong=true;try{const cu=JSON.stringify(TIEN.map(k=>S[k]));
 const r=await(await fetch(CF.u,{method:'POST',body:JSON.stringify({k:CF.k,tien:Object.fromEntries(TIEN.map(k=>[k,S[k]])),ngay:today(),rev:Number(localStorage.getItem('gt_rev'))||0})})).json();
 if(!r.ok){if(r.loi==='khoa')toast('Link riêng không đúng, tiến độ chưa được lưu');return}
 Object.assign(S,gopTienDo(S,r.tien));luuMay();syncTop();const lichDoi=JSON.stringify(r.lich)!==JSON.stringify(LICH_HOM);LICH_HOM=r.lich;
 if(r.kho){localStorage.setItem('gt_kho',JSON.stringify(r.kho));localStorage.setItem('gt_rev',r.rev);if(P.el.hidden&&JSON.stringify(r.kho)!==JSON.stringify(KHO_MOI)){location.reload();return}}
 if(P.el.hidden&&(lichDoi||cu!==JSON.stringify(TIEN.map(k=>S[k])))&&cur!=='words')go(cur)}catch(e){}finally{dangDong=false}};
dongNgay=dong;addEventListener('online',dong);addEventListener('hashchange',()=>location.reload());document.addEventListener('visibilitychange',()=>{dong()});
if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
taiAud();syncTop();go('map');dong();
