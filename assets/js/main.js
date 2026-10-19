(()=>{
const {GH,jobs,edu,projects,skills,svc,certs,soc,projectDetails}=window.D;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const h=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.innerHTML=x;return e};
const slug=t=>t.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const pad=n=>String(n).padStart(2,'0');

/* theme */
const root=document.documentElement;
try{const t=localStorage.getItem('theme');if(t)root.dataset.theme=t}catch(e){}
$('#theme').onclick=()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}$('meta[name=theme-color]').content=t==='dark'?'#0c0e0d':'#efece4'};

/* stats + strengths */
const orgs=new Set(jobs.map(j=>j[2])).size;
$('#stats').append(...[['3.5+','Years in ML, agentic AI & analytics'],[projects.length,'Projects built'],[orgs,'Organisations worked with']].map(([v,l],i)=>{const e=h('div','stat rv',`<b data-to="${v}">${v}</b><span>${l}</span>`);e.style.setProperty('--i',i);return e}));
$('#svc').append(...svc.map(s=>{const l=h('li','',s[0]);l.title=s[1];return l}));

/* skills */
$('#skgrid').append(...skills.map((s,i)=>{const c=h('div','sk rv',`<span class="mono" style="color:var(--mut)">${pad(i+1)}</span><h3>${s[0]}</h3><p>${s[1]}</p><div class="chips">${s[2].map(x=>`<span class="chip">${x}</span>`).join('')}</div>`);c.style.setProperty('--i',i%3);
 c.onpointermove=e=>{const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px')};return c}));

/* experience: master/detail timeline */
const tl=$('#tlist'),tp=$('#tpanel');
function showJob(i){$$('button',tl).forEach((b,k)=>b.setAttribute('aria-selected',k===i));const j=jobs[i];tp.style.animation='none';tp.offsetHeight;tp.style.animation='';
 tp.innerHTML=`<span class="mono" style="color:var(--mut)">${j[0]} · ${j[3]}</span><h3>${j[1]}</h3><p class="org">${j[2]}</p><ul>${j[4].map(b=>`<li>${b}</li>`).join('')}</ul>`}
jobs.forEach((j,i)=>{const li=h('li','',`<button role="tab" aria-selected="false"><b>${j[2]}</b><span>${j[1]} · ${j[0]}</span></button>`);li.firstChild.onclick=()=>showJob(i);tl.append(li)});showJob(0);
$('#edu').append(...edu.map(e=>h('div','row',`<b>${e[1]}</b><span>${e[2]}</span><small>${e[0]}</small>`)));
$('#certs').append(...certs.map(c=>h('div','row',`<b>${c[1]}</b><span>${c[0]}${c[2]?' — '+c[2]:''}</span>${c[3]?`<small>${c[3]}</small>`:''}`)));

/* projects */
const grid=$('#pgrid'),m=$('#modal');
projects.forEach((p,i)=>{const src=p.length>4?p[4]:`assets/video/${slug(p[1])}.mp4`,poster=p.length>6?p[6]:'';
 const preview=src?`<video muted loop playsinline preload="none"${poster?` poster="${poster}"`:''} data-src="${src}" aria-hidden="true"></video>`:'';
 const b=h('button','pc rv',`<div class="pv">${preview}<span class="n mono">${pad(i+1)}</span></div><div class="pb"><span class="mono">${p[0]}</span><h3>${p[1]}</h3><p>${p[2]}</p><span class="more">Open project <i>→</i></span></div>`);
 b.dataset.cat=p[0];b.style.setProperty('--i',i%3);b.onclick=()=>openProject(p);
 if(fine&&!reduce){b.onpointermove=e=>{const r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.setProperty('--ry',x*8+'deg');b.style.setProperty('--rx',-y*8+'deg')};
  b.onpointerenter=()=>{const v=$('video',b);if(v&&!v.src){v.src=v.dataset.src;v.play().catch(()=>{})}};
  b.onpointerleave=()=>{b.style.setProperty('--ry','0deg');b.style.setProperty('--rx','0deg');$('video',b)?.pause()}}
 grid.append(b)});
/* lazy poster frames */
const vo=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const v=e.target;if(!v.src){v.preload='metadata';v.src=v.dataset.src+'#t=1'}vo.unobserve(v)}}),{rootMargin:'200px'});
$$('.pv video').forEach(v=>vo.observe(v));
const cats=['All',...new Set(projects.map(p=>p[0]))],fl=$('#filters');
cats.forEach((c,i)=>{const b=h('button','',c);b.setAttribute('aria-pressed',i===0);b.onclick=()=>{$$('button',fl).forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.pc').forEach(p=>{p.hidden=c!=='All'&&p.dataset.cat!==c;if(!p.hidden)p.classList.add('in')})};fl.append(b)});
function openProject(p){const src=p.length>4?p[4]:`assets/video/${slug(p[1])}.mp4`,poster=p.length>6?p[6]:'',overview=D.projectDetails[p[1]]||[p[2]];$('#mbody').innerHTML=`<span class="mono" style="color:var(--ac)">${p[0]}</span><h3 id="mt">${p[1]}</h3>${src?`<video controls playsinline preload="metadata"${poster?` poster="${poster}"`:''} aria-label="${p[1]} explainer"><source src="${src}" type="video/mp4"></video>`:''}<h4>Overview</h4>${overview.map(paragraph=>`<p>${paragraph}</p>`).join('')}<h4>${p[5]||'Tools &amp; technologies'}</h4><div class="chips">${p[3].map(t=>`<span class="chip">${t}</span>`).join('')}</div><div class="cta"><a class="btn solid" href="${GH}" target="_blank" rel="noopener">GitHub profile <span>↗</span></a></div>`;m.showModal()}
m.addEventListener('close',()=>$('video',m)?.pause());$('#mx').onclick=()=>m.close();m.addEventListener('click',e=>{if(e.target===m)m.close()});

/* AI capability map — matches real project/role content only */
const caps=[['Machine Learning',/machine learning|scikit|random forest|classification|deep learning/i],['Generative AI',/generative|llm|gpt|langchain|rag\b|autogen|crewai/i],['LLMs',/llm|gpt|indicbert|llama|hugging/i],['RAG',/\brag\b|faiss|vector/i],['Document Intelligence',/document intelligence|document upload|source-grounded|pdf documents|word documents/i],['Agentic AI',/agent|crewai|langgraph|autogen/i],['NLP',/nlp|chatbot|dialogflow|rasa|whisper|speech/i],['Computer Vision',/computer vision|opencv|yolo|ocr|object detection|face|mediapipe|image/i],['AI Automation',/automation|n8n|workflow|bot\b/i],['AI APIs',/openai|gpt|whatsapp|telegram|twilio|rest api|\bapi/i],['Cloud Deployment',/\baws\b|ec2|render|deploy|docker|azure/i]];
const svg=$('#mapsvg'),NS='http://www.w3.org/2000/svg',info=$('#mapinfo');
const mk=(t,a,p=svg)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.append(e);return e};
mk('circle',{class:'ring',cx:300,cy:300,r:235});mk('circle',{class:'ring',cx:300,cy:300,r:150});
const nodes=caps.map((c,i)=>{const a=i/caps.length*Math.PI*2-Math.PI/2,x=300+235*Math.cos(a),y=300+235*Math.sin(a);
 const ed=mk('line',{class:'ed',x1:300,y1:300,x2:x,y2:y});const g=mk('g',{class:'nd',tabindex:0,role:'button','aria-label':c[0]});mk('circle',{cx:x,cy:y,r:36},g);const t=mk('text',{x,y:y+4},g);
 c[0].split(' ').forEach((w,k,arr)=>{const s=mk('tspan',{x,dy:k?12:(arr.length>1?-2:4)},t);s.textContent=w});
 g.onclick=()=>pick(i);g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(i)}};return{g,ed,x,y}});
mk('circle',{class:'core',cx:300,cy:300,r:46});mk('text',{x:300,y:306}).textContent='Jahsh';
const dots=nodes.map(n=>{const d=mk('circle',{class:'pulse',r:2.6,cx:300,cy:300});return d});
function pick(i){nodes.forEach((n,k)=>{n.g.classList.toggle('on',k===i);n.ed.classList.toggle('on',k===i)});
 const re=caps[i][1],ps=projects.filter(p=>re.test([p[0],p[1],p[2],...p[3]].join(' '))),rs=jobs.filter(j=>re.test(j[4].join(' ')));
 info.innerHTML=`<span class="mono" style="color:var(--ac)">${pad(ps.length)} projects · ${pad(rs.length)} roles</span><h3>${caps[i][0]}</h3>`;
 ps.slice(0,8).forEach(p=>{const b=h('button','',`<b>${p[1]}</b><br>${p[0]}`);b.onclick=()=>openProject(p);info.append(b)});
 if(ps.length>8)info.append(h('p','',`+ ${ps.length-8} more in Projects`));
 rs.slice(0,3).forEach(j=>info.append(h('p','',`<span class="mono">Role</span> · ${j[1]}, ${j[2]}`)));}
info.innerHTML='<span class="mono" style="color:var(--ac)">Capability</span><h3>Pick a node.</h3><p>Each node lists the real projects and roles it appears in.</p>';
/* data pulses travelling along the edges */
let T=0;(function tick(){T+=.008;dots.forEach((d,i)=>{const p=(T+i*.13)%1,n=nodes[i];d.setAttribute('cx',300+(n.x-300)*p);d.setAttribute('cy',300+(n.y-300)*p);d.style.opacity=Math.sin(p*Math.PI)});if(!reduce)requestAnimationFrame(tick)})();

/* contact links */
$('#clinks').prepend(...soc.map(([n,u])=>{const li=h('li','',`<a href="${u}" target="_blank" rel="noopener">${n} ↗</a>`);return li}));

/* nav: active section + sliding pill + burger + progress */
const bar=$('#bar'),pill=$('#pill'),links=$('#links'),navA=$$('#links a'),burger=$('#burger');
const movePill=a=>{pill.style.width=a.offsetWidth+'px';pill.style.transform=`translateX(${a.offsetLeft}px)`};
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const id=e.target.id==='resume'?'projects':e.target.id;navA.forEach(a=>{const on=a.getAttribute('href')==='#'+id;a.classList.toggle('on',on);if(on)movePill(a)})}}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section').forEach(s=>so.observe(s));
addEventListener('resize',()=>{const a=$('#links a.on');if(a)movePill(a)});
burger.onclick=()=>{const o=links.classList.toggle('open');burger.setAttribute('aria-expanded',o)};
navA.forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');burger.setAttribute('aria-expanded',false)}));
const port=$('#portrait img');
addEventListener('scroll',()=>{const d=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${d>0?scrollY/d:0})`;if(!reduce&&scrollY<innerHeight)port.style.setProperty('--py',-scrollY*.06+'px')},{passive:true});

/* reveal + counters */
const count=el=>{const to=parseFloat(el.dataset.to);if(isNaN(to)||reduce)return;const dec=String(el.dataset.to).includes('.'),suf=el.dataset.to.replace(/[\d.]/g,''),t0=performance.now();
 (function f(t){const k=Math.min((t-t0)/1400,1),v=to*(1-Math.pow(1-k,3));el.textContent=(dec?v.toFixed(1):Math.round(v))+suf;if(k<1)requestAnimationFrame(f)})(t0)};
const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');$$('[data-to]',e.target).forEach(count);ro.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
$$('.rv').forEach(el=>ro.observe(el));

/* cursor ring + magnetic buttons */
if(fine&&!reduce){const c=$('#cur');let x=0,y=0,tx=0,ty=0;
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;c.style.opacity=1;c.classList.toggle('on',!!e.target.closest('a,button,.nd'))},{passive:true});
 (function f(){x+=(tx-x)*.2;y+=(ty-y)*.2;c.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(f)})();
 $$('.mag').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.3}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')})}

/* hero neural network: layered nodes, signals travel, reacts to pointer */
const cv=$('#net'),cx=cv.getContext('2d');let W,H,L=[],mouse={x:-999,y:-999},run=true,sig=[];
function build(){const d=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);
 const cols=W<700?4:7,per=W<700?5:7;L=[];for(let c=0;c<cols;c++){const col=[];for(let r=0;r<per;r++)col.push({x:W*(.08+.84*c/(cols-1)),y:H*(.14+.72*(r+(c%2?.5:0))/per)+(Math.random()-.5)*26,ph:Math.random()*6,hot:0});L.push(col)}}
function style(){const cs=getComputedStyle(root);return[cs.getPropertyValue('--fg').trim(),cs.getPropertyValue('--ac').trim()]}
function frame(t){if(!run)return;cx.clearRect(0,0,W,H);const [fg,ac]=style();cx.lineWidth=1;
 if(!reduce&&Math.random()<.08){const c=Math.floor(Math.random()*(L.length-1));sig.push({c,a:L[c][Math.floor(Math.random()*L[c].length)],b:L[c+1][Math.floor(Math.random()*L[c+1].length)],p:0})}
 cx.globalAlpha=.1;cx.strokeStyle=fg;for(let c=0;c<L.length-1;c++)for(const a of L[c])for(const b of L[c+1]){cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}
 cx.fillStyle=ac;sig=sig.filter(s=>{s.p+=.012;const x=s.a.x+(s.b.x-s.a.x)*s.p,y=s.a.y+(s.b.y-s.a.y)*s.p;cx.globalAlpha=.9;cx.beginPath();cx.arc(x,y,2.4,0,7);cx.fill();if(s.p>=1){s.b.hot=1;if(s.c+2<L.length&&Math.random()<.7)sig.push({c:s.c+1,a:s.b,b:L[s.c+2][Math.floor(Math.random()*L[s.c+2].length)],p:0})}return s.p<1});
 for(const col of L)for(const n of col){const dm=Math.hypot(n.x-mouse.x,n.y-mouse.y),near=dm<150;n.hot*=.96;const oy=reduce?0:Math.sin(t/1400+n.ph)*4;
  if(near){cx.globalAlpha=.55*(1-dm/150);cx.strokeStyle=ac;cx.beginPath();cx.moveTo(n.x,n.y+oy);cx.lineTo(mouse.x,mouse.y);cx.stroke()}
  cx.globalAlpha=near||n.hot>.1?1:.45;cx.fillStyle=near||n.hot>.1?ac:fg;cx.beginPath();cx.arc(n.x,n.y+oy,2+n.hot*3+(near?1.5:0),0,7);cx.fill()}
 cx.globalAlpha=1;if(!reduce)requestAnimationFrame(frame)}
build();requestAnimationFrame(frame);addEventListener('resize',()=>{build();if(reduce)frame(0)});
const home=$('#home');home.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});home.addEventListener('pointerleave',()=>mouse.x=-999);
new IntersectionObserver(([e])=>{run=e.isIntersecting;if(run&&!reduce)requestAnimationFrame(frame)}).observe(home);

/* page-load */
const go=()=>document.body.classList.add('ready');addEventListener('load',()=>setTimeout(go,reduce?0:700));setTimeout(go,3000);
})();
