const TG = window.Telegram?.WebApp;
if (TG) { TG.ready(); TG.expand(); try { TG.setHeaderColor('#0b0f17'); TG.setBackgroundColor('#090d14'); } catch(e){} }

const roadmap = [
["Linux & OS","Foundation","Linux filesystem, permissions, processes, users, Bash"],
["Networking","Foundation","TCP/IP, DNS, DHCP, routing, ports, sockets"],
["Python","Foundation","Syntax, functions, files, requests, automation"],
["Git & GitHub","Foundation","Git workflow, branches, commits, README, portfolio"],
["Web fundamentals","Foundation","HTTP, cookies, sessions, browser security"],
["SQL","Foundation","Queries, joins, indexes, transactions"],
["Windows internals","Foundation","Processes, services, registry, Event Viewer"],
["Auth & IAM","Security Core","Passwords, MFA, sessions, RBAC, access control"],
["Cryptography","Security Core","Hashing, encryption, signatures, PKI, TLS"],
["Threat modeling","Security Core","Assets, threats, attack surface, STRIDE"],
["Security architecture","Security Core","Defense in depth, segmentation, zero trust"],
["Vulnerability management","Security Core","CVEs, CVSS, patching, prioritization"],
["OWASP Top 10","Web Security","Web vulnerabilities and mitigations"],
["Burp Suite","Web Security","Proxy, Repeater, Intruder, testing workflow"],
["Injection","Web Security","SQLi, command injection, SSRF, XXE"],
["XSS & browser security","Web Security","Reflected, stored, DOM XSS, CSP"],
["API Security","Web Security","REST, JWT, authorization, rate limits"],
["Windows pentest","Enterprise / Pentest","Enumeration, AD basics, common attack paths"],
["Active Directory","Enterprise / Pentest","Domains, Kerberos, LDAP, GPO, users/groups"],
["Linux pentest","Enterprise / Pentest","Enumeration, privilege escalation, services"],
["Logs & SIEM","Blue Team / SOC","Windows/Linux logs, parsing, alerting"],
["MITRE ATT&CK","Blue Team / SOC","Tactics, techniques, detection mapping"],
["Incident Response","Blue Team / SOC","Triage, containment, eradication, recovery"],
["CTF foundations","CTF & Portfolio","Recon, web, crypto, forensics, pwn basics"],
["Portfolio project","CTF & Portfolio","Security lab, write-up, GitHub, documentation"],
["Final lab","CTF & Portfolio","End-to-end assessment + final report"]
];

const templates = {
  Foundation:["Разобраться с базовыми понятиями и командами","Сделать 30–60 минут практики","Записать 5 ключевых выводов","Пройти мини-проверку"],
  "Security Core":["Изучить модель/концепцию","Разобрать реальный пример атаки","Сделать безопасную лабораторную практику","Сформулировать меры защиты"],
  "Web Security":["Изучить класс уязвимости","Разобрать HTTP-запросы в Burp","Повторить в локальной лаборатории","Записать remediation"],
  "Enterprise / Pentest":["Изучить компонент инфраструктуры","Провести enumeration в своей лаборатории","Разобрать attack path","Описать риск и mitigation"],
  "Blue Team / SOC":["Изучить источник логов","Найти подозрительный паттерн","Создать простое detection rule","Описать incident workflow"],
  "CTF & Portfolio":["Изучить технику","Решить практическую задачу","Сделать write-up","Добавить результат в портфолио"]
};

const tasks=[];
roadmap.forEach((r,i)=>{
  const [title,track,desc]=r;
  templates[track].forEach((t,j)=>tasks.push({id:`w${i+1}t${j+1}`,week:i+1,title,track,desc,text:t,xp:10+j*5}));
});

const defaultState={done:{},notes:[],openWeeks:{1:true},view:"home"};
let state=JSON.parse(localStorage.getItem("cyberroadmap_state")||"null")||defaultState;
state.done ||= {}; state.notes ||= []; state.openWeeks ||= {1:true};

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const save=()=>localStorage.setItem("cyberroadmap_state",JSON.stringify(state));
const total=tasks.length;
const completed=()=>tasks.filter(t=>state.done[t.id]).length;
const xp=()=>tasks.reduce((n,t)=>n+(state.done[t.id]?t.xp:0),0);
const pct=()=>Math.round(completed()/total*100);
function levelInfo(){let x=xp(); let level=Math.min(10,Math.floor(x/100)+1); return {level,x,next:level*100};}
function toast(msg){let el=document.querySelector(".toast");if(!el){el=document.createElement("div");el.className="toast";document.body.appendChild(el)}el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800)}
function setView(v){state.view=v;save();render();window.scrollTo({top:0,behavior:"smooth"})}

function home(){
 const c=completed(), p=pct(), l=levelInfo();
 const tracks={}; roadmap.forEach((r,i)=>{let ts=tasks.filter(t=>t.week===i+1),d=ts.filter(t=>state.done[t.id]).length;tracks[r[1]]=(tracks[r[1]]||[]);tracks[r[1]].push({r,i,d,total:ts.length})});
 const cards=Object.entries(tracks).map(([name,arr])=>{
   const d=arr.reduce((a,x)=>a+x.d,0),tt=arr.reduce((a,x)=>a+x.total,0);
   const descriptions={Foundation:"Linux, Windows, networking, Python, SQL и Web", "Security Core":"Модели угроз, криптография, auth и системная защита","Web Security":"Burp, OWASP, injection, XSS, API security","Enterprise / Pentest":"Windows, Active Directory и безопасная практика pentest","Blue Team / SOC":"Логи, SIEM, MITRE ATT&CK и Incident Response","CTF & Portfolio":"CTF, проекты, GitHub и итоговая лаборатория"};
   const icons={Foundation:"🟢","Security Core":"🔵","Web Security":"🔴","Enterprise / Pentest":"🟠","Blue Team / SOC":"🟣","CTF & Portfolio":"⚡"};
   return `<div class="card track"><div class="track-head"><div class="track-name">${icons[name]} ${name}</div><span class="track-meta">${d}/${tt}</span></div><div class="track-desc">${descriptions[name]}</div><div class="bar"><i style="width:${tt?d/tt*100:0}%"></i></div></div>`;
 }).join("");
 return `<div class="grid">
  <section class="card hero"><div class="eyebrow">Personal Cybersecurity OS</div><h1>${c?"Продолжаем прокачку":"Начнём обучение?"}</h1><p>26-недельный путь от восстановления базы до Web Security, SOC, CTF и сильного портфолио.</p><div class="actions"><button class="btn" onclick="setView('today')">▶ ${c?"Продолжить":"Начать обучение"}</button><button class="btn secondary" onclick="setView('roadmap')">Открыть roadmap</button></div></section>
  <section class="card progress-card"><div class="big-progress">${p}%</div><div class="muted">${c} / ${total} задач</div><div class="bar" style="margin:14px 0 10px"><i style="width:${p}%"></i></div><div class="muted" style="font-size:11px">Уровень ${l.level} · ${l.x} XP</div></section>
 </div>
 <div class="stats">
  <div class="card stat"><div class="ico">✓</div><strong>${c}</strong><span>выполнено</span></div>
  <div class="card stat"><div class="ico">📚</div><strong>${Math.floor(c/4)}</strong><span>этапов закрыто</span></div>
  <div class="card stat"><div class="ico">📝</div><strong>${state.notes.length}</strong><span>заметок</span></div>
  <div class="card stat"><div class="ico">⚡</div><strong>${xp()}</strong><span>practice points</span></div>
 </div>
 <div class="section-title"><h2>Направления</h2><span>6 уровней</span></div><div class="track-grid">${cards}</div>
 <div class="section-title"><h2>Текущий уровень</h2><span>${l.x} / ${l.next} XP</span></div>
 <div class="card level-card"><div class="level-row"><div><strong>Level ${l.level}</strong><div class="muted" style="font-size:11px;margin-top:5px">Каждая практика приносит XP. Не гонимся за галочками — строим реальные навыки.</div></div><span class="level-badge">CYBER STUDENT</span></div><div class="bar" style="margin-top:15px"><i style="width:${Math.min(100,l.x/l.next*100)}%"></i></div></div>`;
}

function roadmapView(){
 let query=window.__search||"";
 let weeks=Array.from({length:26},(_,i)=>i+1).map(i=>{
   const r=roadmap[i-1], ts=tasks.filter(t=>t.week===i && (!query || (t.text+" "+t.title+" "+t.desc+" "+t.track).toLowerCase().includes(query.toLowerCase())));
   if(query && !ts.length)return "";
   const d=tasks.filter(t=>t.week===i&&state.done[t.id]).length,open=state.openWeeks[i]||!!query;
   return `<section class="card week ${open?"open":""}" data-week="${i}"><div class="week-head" onclick="toggleWeek(${i})"><div class="week-title"><div class="week-num">${String(i).padStart(2,"0")}</div><div><h3>${r[0]}</h3><p>${r[1]} · ${r[2]}</p></div></div><div><span class="track-meta">${d}/4</span> <span class="chev">⌄</span></div></div><div class="week-body">${ts.map(taskHtml).join("")}</div></section>`;
 }).join("");
 return `<div class="roadmap-head"><div><h1>Roadmap</h1><div class="muted" style="font-size:12px;margin-top:5px">26 недель · ${completed()}/${total} задач</div></div><input class="search" id="roadSearch" value="${escapeHtml(query)}" placeholder="Поиск по roadmap…"></div>${weeks||'<div class="card empty">Ничего не найдено.</div>'}`;
}
function taskHtml(t){return `<label class="task ${state.done[t.id]?"done":""}"><input class="check" type="checkbox" ${state.done[t.id]?"checked":""} onchange="toggleTask('${t.id}')"><div><div class="task-title">${escapeHtml(t.text)}</div><div class="task-desc">${escapeHtml(t.desc)}</div></div><span class="xp">+${t.xp} XP</span></label>`}
function toggleWeek(i){state.openWeeks[i]=!state.openWeeks[i];save();render()}
function toggleTask(id){state.done[id]=!state.done[id];save();render();toast(state.done[id]?"Задача выполнена · XP начислен":"Задача возвращена в план")}
function today(){
 let next=tasks.find(t=>!state.done[t.id]); let week=next?.week||26;
 let dayTasks=tasks.filter(t=>t.week===week).slice(0,4);
 return `<div class="section-title"><h2>Сегодня</h2><span>${new Date().toLocaleDateString("ru-RU",{day:"numeric",month:"long"})}</span></div>
 <div class="today-grid"><section class="card today-card focus"><div class="eyebrow">Текущий фокус</div><h2>${next?`Неделя ${week} · ${roadmap[week-1][0]}`:"Roadmap завершён 🎉"}</h2><p class="muted">${next?roadmap[week-1][2]:"Теперь усиливаем портфолио и поддерживаем навыки практикой."}</p><div class="checklist">${dayTasks.map(t=>`<label class="mini-task"><input class="check" type="checkbox" ${state.done[t.id]?"checked":""} onchange="toggleTask('${t.id}')"><span class="${state.done[t.id]?"task done":""}">${escapeHtml(t.text)}</span></label>`).join("")}</div></section>
 <aside class="card today-card"><div class="eyebrow">Сессия</div><h2>${next?"25–45 минут":"Свободная практика"}</h2><p class="muted">1 теория → 1 лаборатория → 1 запись в заметки. Лучше ежедневно понемногу, чем редкие марафоны.</p><button class="btn" onclick="setView('roadmap')">Перейти к задачам</button></aside></div>`;
}
function notes(){
 return `<div class="section-title"><h2>Заметки</h2><span>${state.notes.length} сохранено</span></div>
 <section class="card" style="padding:18px"><div class="field"><label>Новая заметка</label><input id="noteTitle" placeholder="Например: Linux — chmod и права"></div><textarea id="noteBody" class="note-input" placeholder="Команды, выводы, вопросы, ссылки…"></textarea><div class="actions" style="margin-top:10px"><button class="btn" onclick="addNote()">Сохранить заметку</button></div></section>
 <div class="notes-list">${state.notes.length?state.notes.map((n,i)=>`<article class="card note"><button class="delete" onclick="deleteNote(${i})">✕</button><h3>${escapeHtml(n.title||"Без названия")}</h3><p>${escapeHtml(n.body)}</p><time>${escapeHtml(n.date)}</time></article>`).join(""):'<div class="card empty" style="grid-column:1/-1">Пока пусто. Сохраняй сюда команды, выводы и идеи для лабораторий.</div>'}</div>`;
}
function addNote(){let title=$("#noteTitle").value.trim(),body=$("#noteBody").value.trim();if(!body){toast("Напиши хотя бы текст заметки");return}state.notes.unshift({title,body,date:new Date().toLocaleString("ru-RU")});save();render();toast("Заметка сохранена")}
function deleteNote(i){if(confirm("Удалить заметку?")){state.notes.splice(i,1);save();render()}}
function settings(){openModal(`<h2>Настройки</h2><p class="muted">Прогресс хранится локально в этом браузере. Перед подключением Telegram это временное хранилище.</p><div class="actions"><button class="btn ghost" onclick="exportData()">Экспорт прогресса</button><button class="btn danger" onclick="resetProgress()">Сбросить прогресс</button></div><div class="field"><label>Telegram</label><div class="muted">Mini App API уже подключён. После публикации мы привяжем данные к Telegram ID и добавим синхронизацию.</div></div>`)}
function exportData(){let blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="cyberroadmap-progress.json";a.click();URL.revokeObjectURL(a.href);toast("Файл прогресса подготовлен")}
function resetProgress(){if(confirm("Удалить весь прогресс и заметки?")){localStorage.removeItem("cyberroadmap_state");state=JSON.parse(JSON.stringify(defaultState));closeModal();render();toast("Прогресс сброшен")}}
function searchModal(){openModal(`<h2>Поиск</h2><input class="search" style="width:100%" id="globalSearch" placeholder="Linux, Burp, SIEM, Python…"><p class="muted" style="font-size:12px;margin-top:10px">Поиск работает по всем 26 неделям roadmap.</p>`);setTimeout(()=>{$("#globalSearch").focus();$("#globalSearch").addEventListener("input",e=>{window.__search=e.target.value;closeModal();setView("roadmap")})},50)}
function openModal(html){$("#modalCard").innerHTML=html;$("#modal").classList.remove("hidden")}
function closeModal(){$("#modal").classList.add("hidden")}
function escapeHtml(s=""){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function render(){
 $("#main").innerHTML=state.view==="home"?home():state.view==="roadmap"?roadmapView():state.view==="today"?today():notes();
 $$(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===state.view));
 if($("#roadSearch")) $("#roadSearch").addEventListener("input",e=>{window.__search=e.target.value;render()});
}
$$(".nav-btn").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
$("#settingsBtn").onclick=settings;$("#searchBtn").onclick=searchModal;
$("#modal").addEventListener("click",e=>{if(e.target.classList.contains("modal-backdrop"))closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
render();
