const tg = window.Telegram?.WebApp;
if (tg) { try { tg.ready(); tg.expand(); } catch(e) {} }

const levels = [
  {id:"foundation", name:"Foundation", icon:"🟢", desc:"Linux, Windows, networking, Python, SQL и Web", weeks:[1,2,3,4,5,6]},
  {id:"security", name:"Security Core", icon:"🔵", desc:"Модели угроз, криптография, auth и системная защита", weeks:[7,8,9,10]},
  {id:"web", name:"Web Security", icon:"🔴", desc:"Burp, OWASP, injection, XSS, API security", weeks:[11,12,13,14]},
  {id:"offensive", name:"Enterprise / Pentest", icon:"🟠", desc:"Windows, Active Directory и безопасная практика pentest", weeks:[15,16,17,18]},
  {id:"blue", name:"Blue Team / SOC", icon:"🟣", desc:"Логи, SIEM, MITRE ATT&CK и Incident Response", weeks:[19,20,21,22]},
  {id:"practice", name:"CTF & Portfolio", icon:"⚡", desc:"CTF, проекты, GitHub и итоговая лаборатория", weeks:[23,24,25,26]}
];

const weeks = [
  ["Linux","Компьютерная база + Linux",["CPU, RAM, процессы, память, файлы","Linux filesystem: /home, /etc, /var, /tmp, /proc","Users, groups, sudo, permissions","CLI: pwd, ls, cd, cp, mv, grep, find, chmod, chown, ps, systemctl, journalctl"],["Установить Linux VM","Создать 2 пользователей и группу","Настроить права на папки","Найти процесс и PID","Найти событие в логах"]],
  ["Windows","Windows + PowerShell",["Processes, services, users, groups, NTFS, Registry","UAC, Firewall, Defender, Event Viewer","PowerShell: Get-Process, Get-Service, Get-WinEvent, Get-ChildItem, Select-String"],["Создать пользователя и группу","Найти процесс и службу","Посмотреть события входа","Написать 5–10 полезных PowerShell-команд"]],
  ["Networking","Сети: фундамент",["OSI и TCP/IP","Ethernet, MAC, IP, ARP","IPv4, subnet, gateway, broadcast, DHCP, NAT","TCP vs UDP, ports, sockets"],["Разобрать 192.168.1.0/24, /25, /26, /27, /28","Использовать ping, ipconfig/ifconfig, ip/route","Объяснить ARP и gateway"]],
  ["Wireshark","TCP/IP + DNS + HTTP + Wireshark",["TCP handshake, retransmission, ports","DNS, DHCP, ICMP","HTTP/HTTPS, headers, status codes","TLS на уровне понимания"],["Поймать DNS-запрос в Wireshark","Найти TCP handshake","Разобрать HTTP request/response","Использовать nslookup/dig, curl, traceroute"]],
  ["Python","Python для ИБ",["Переменные, типы, условия, циклы, функции","list/dict/set/tuple, exceptions, modules","Файлы, JSON, regex, requests, socket, subprocess"],["Написать IP/port checker для своей лаборатории","Прочитать лог и посчитать типы событий","Сделать запрос к тестовому API и разобрать JSON"]],
  ["Web","SQL + Web",["SELECT, INSERT, UPDATE, DELETE, WHERE, JOIN, GROUP BY, ORDER BY","Primary/foreign key, relations, indexes","HTML, JavaScript basics, HTTP, cookies, sessions, REST API, JSON"],["Создать БД и выполнить CRUD","Разобрать запрос браузера в DevTools","Отправить GET/POST через curl","Объяснить authentication vs authorization"]],
  ["Security Core","Основы ИБ",["CIA Triad","Asset, threat, vulnerability, exploit, risk, control","Attack surface, least privilege, defense in depth","Security policies и базовая модель рисков"],["Для 5 сценариев определить asset → threat → vulnerability → impact → control","Сделать мини threat model"]],
  ["Cryptography","Криптография",["Hash vs encryption","SHA-256/SHA-3, collision, password hashing","AES, RSA, ECC на концептуальном уровне","Digital signatures, certificates, PKI, TLS"],["Разобрать путь HTTPS","Объяснить, почему пароль нельзя хранить просто как SHA-256"]],
  ["Auth","Authentication & Authorization",["Passwords, MFA, session, cookie, token","JWT, OAuth 2.0, OpenID Connect","RBAC и least privilege","Common auth/session mistakes"],["Составить карту логина учебного приложения","Определить, где хранится session и что проверяет сервер"]],
  ["System Security","Network & System Security",["Firewall, IDS/IPS, VPN, segmentation","Endpoint security, patching, hardening","Backups, logging, monitoring","Basic threat modeling"],["Сделать схему домашней лаборатории","Отметить trust boundaries, сервисы и защитные меры"]],
  ["Burp","Burp + HTTP",["Burp Proxy, Repeater, Intruder на базовом уровне","Requests, responses, headers, cookies, parameters","Same-Origin Policy"],["Перехватить запрос в учебной лаборатории","Изменить параметр через Repeater","Объяснить результат"]],
  ["Injection","Injection",["SQL Injection","Command Injection","Path Traversal","File upload vulnerabilities"],["Решать только учебные labs","Для каждой уязвимости записать причина → условие → impact → mitigation"]],
  ["XSS","XSS + CSRF + Access Control",["Stored/Reflected/DOM XSS","CSRF","IDOR/Broken Access Control","Session weaknesses"],["Пройти beginner labs","После каждой написать исправление"]],
  ["APISecurity","SSRF + API Security + OWASP",["SSRF","API authentication/authorization","Rate limiting","OWASP Top 10 как карта тем"],["Составить шпаргалку OWASP","Пройти beginner labs"]],
  ["WindowsSec","Windows Internals для ИБ",["Processes, services, tokens, privileges","Event Logs, Sysmon basics","PowerShell и remote management","NTFS permissions"],["Создать безопасное событие в lab","Найти его в логах"]],
  ["AD","Active Directory",["Domain, Domain Controller, LDAP, Kerberos, NTLM","Users, groups, OU, GPO","SMB, DNS и AD-зависимости"],["Собрать учебный AD lab при наличии ресурсов"]],
  ["ADSec","AD Security",["Kerberoasting, AS-REP Roasting, Pass-the-Hash/Ticket — концепции","ACL abuse, lateral movement","Credential hygiene и hardening"],["Только labs/CTF","Для техники записать prerequisites, detection, mitigation"]],
  ["Pentest","Базовый Pentest Workflow",["Recon → enumeration → vulnerability discovery → exploitation → privilege escalation → reporting","Nmap","Linux/Windows privilege escalation"],["Решить 2–3 beginner boxes","Написать короткий отчёт"]],
  ["Logs","Логи и расследование",["Windows Event Logs","Linux logs","Web server logs","IOC и timeline investigation"],["Сгенерировать безопасные события","Найти их в логах"]],
  ["SIEM","SIEM",["Что такое SIEM","Parsing, fields, correlation, alerts","Wazuh/Elastic/Splunk — выбрать один"],["Собрать логи с VM","Сделать 2 detection/alert rules"]],
  ["MITRE","MITRE ATT&CK",["Tactics, Techniques, Procedures","Initial Access, Execution, Persistence, Privilege Escalation, Lateral Movement, Credential Access, Discovery"],["Составить ATT&CK chain для учебного инцидента","Указать точки обнаружения"]],
  ["IR","Incident Response",["Preparation, detection, analysis, containment, eradication, recovery","False positive vs true positive","Evidence и документация"],["Разобрать учебный alert","Написать короткий incident report"]],
  ["CTF","CTF Fundamentals",["Beginner platform: TryHackMe, PortSwigger Web Security Academy, picoCTF или аналог","Linux, networking, web, basic crypto"],["Решить 5–10 небольших задач","Не смотреть write-up до собственной попытки"]],
  ["Project1","Мини-проект №1",["Python + networking/security"],["Log analyzer","HTTP checker","Hash checker","Другой utility для своей lab","README обязателен"]],
  ["Project2","Мини-проект №2",["Web security или SOC — выбрать одно"],["Web: отчёт по 5 labs","SOC: mini lab с логами и 2–3 detections"]],
  ["Final","Итоговый проект",["Собрать всё в один безопасный сценарий"],["Лаборатория","Reconnaissance","Analysis","Findings","Detection/mitigation","Финальный отчёт"]]
].map((w,i)=>({id:i+1,code:w[0],title:w[1],theory:w[2],practice:w[3]}));

const KEY="cyberroadmap_v02";
let state;
try { state=JSON.parse(localStorage.getItem(KEY)||"{}"); } catch(e){state={};}
state.done=state.done||{}; state.notes=state.notes||{}; state.custom=state.custom||[]; state.route=state.route||"home";

function save(){ localStorage.setItem(KEY,JSON.stringify(state)); }
function toast(msg){ const el=document.getElementById("toast"); el.textContent=msg; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),1300); }
function h(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function taskId(w,type,i){return `${w}-${type}-${i}`;}
function isDone(id){return !!state.done[id];}
function allTasks(w){return [...w.theory.map((_,i)=>taskId(w.id,"t",i)),...w.practice.map((_,i)=>taskId(w.id,"p",i))];}
function stats(){
  const total=weeks.reduce((n,w)=>n+allTasks(w).length,0);
  const done=weeks.reduce((n,w)=>n+allTasks(w).filter(isDone).length,0);
  return {total,done,pct:total?Math.round(done/total*100):0};
}
function levelStats(level){
  const arr=weeks.filter(w=>level.weeks.includes(w.id)); const total=arr.reduce((n,w)=>n+allTasks(w).length,0);
  const done=arr.reduce((n,w)=>n+allTasks(w).filter(isDone).length,0);
  return {total,done,pct:total?Math.round(done/total*100):0};
}
function weekCard(w){
  const tasks=allTasks(w), d=tasks.filter(isDone).length, pct=tasks.length?Math.round(d/tasks.length*100):0;
  return `<details class="card week-card" ${state.openWeek==w.id?"open":""} data-week="${w.id}">
    <summary><div class="week-title"><div class="week-badge">${String(w.id).padStart(2,"0")}</div><div><strong>${h(w.title)}</strong><small>${d}/${tasks.length} задач · ${pct}%</small></div></div></summary>
    <div class="week-body">
      <div class="task-group-title">Изучить</div>${w.theory.map((x,i)=>taskHTML(w,"t",i,x)).join("")}
      <div class="task-group-title" style="margin-top:14px">Практика</div>${w.practice.map((x,i)=>taskHTML(w,"p",i,x)).join("")}
      <div class="task-group-title" style="margin-top:14px">Моя заметка</div>
      <textarea class="note" data-note="${w.id}" placeholder="Что понял? Что нужно повторить?">${h(state.notes[w.id]||"")}</textarea>
    </div>
  </details>`;
}
function taskHTML(w,type,i,text){
  const id=taskId(w.id,type,i), done=isDone(id);
  return `<div class="task ${done?"done":""}"><input type="checkbox" data-task="${id}" ${done?"checked":""}><label>${h(text)}</label></div>`;
}
function renderHome(){
  const s=stats();
  const next=weeks.find(w=>allTasks(w).some(id=>!isDone(id)))||weeks[weeks.length-1];
  return `<div class="hero">
    <section class="card hero-card"><div class="eyebrow">Personal Cybersecurity OS</div><h1>Продолжим обучение?</h1><p>Твой roadmap от восстановления базы до практики, CTF и портфолио.</p><div class="actions"><button class="primary" data-route="today">▶ Продолжить</button><button class="secondary" data-route="roadmap">Открыть roadmap</button></div></section>
    <section class="card progress-card"><div class="progress-ring">${s.pct}%</div><div class="progress-meta">${s.done} / ${s.total} задач</div><div class="progressbar"><i style="width:${s.pct}%"></i></div><div class="progress-meta" style="margin-top:10px">Следующая: Неделя ${next.id}</div></section>
  </div>
  <div class="stat-grid">${stat("✓",s.done,"выполнено")}${stat("📚",weeks.filter(w=>allTasks(w).every(isDone)).length,"недель закрыто")}${stat("📝",Object.keys(state.notes).filter(k=>state.notes[k].trim()).length,"заметок")}${stat("⚡",Math.max(0,Math.floor(s.done/5)),"practice points")}</div>
  <div class="section-head"><h2>Направления</h2><span>6 уровней</span></div>
  <div class="grid">${levels.map(l=>levelCard(l)).join("")}</div>`;
}
function stat(icon,num,label){return `<div class="card stat"><strong>${icon} ${num}</strong><span>${label}</span></div>`}
function levelCard(l){const s=levelStats(l);return `<div class="card level-card" data-level="${l.id}"><div class="level-top"><div class="level-name">${l.icon} ${h(l.name)}</div><div class="level-count">${s.done}/${s.total}</div></div><div class="level-desc">${h(l.desc)}</div><div class="progressbar"><i style="width:${s.pct}%"></i></div></div>`}
function renderRoadmap(filter=""){
  const q=filter.trim().toLowerCase();
  const ws=weeks.filter(w=>!q || [w.title,w.code,...w.theory,...w.practice].join(" ").toLowerCase().includes(q));
  return `<div class="section-head"><h2>Roadmap</h2><span>26 недель</span></div><input id="search" class="search" placeholder="Поиск по темам, задачам..." value="${h(filter)}"><div class="week-list">${ws.length?ws.map(weekCard).join(""):`<div class="empty">Ничего не найдено</div>`}</div>`;
}
function renderToday(){
  const pending=[];
  for(const w of weeks){for(const [i,x] of w.practice.entries()){const id=taskId(w.id,"p",i);if(!isDone(id)){pending.push({w,x,id});if(pending.length>=6)break;}}if(pending.length>=6)break;}
  const s=stats();
  return `<div class="section-head"><h2>Сегодня</h2><span>${s.done}/${s.total} всего</span></div>
  <div class="card hero-card" style="margin-bottom:12px"><div class="eyebrow">Next actions</div><h2 style="margin:8px 0">6 практических шагов</h2><p>Сначала практика. Если задача непонятна — вернись к теории недели.</p></div>
  <div class="today-list">${pending.length?pending.map((a,i)=>`<div class="card today-item"><div class="today-icon">${i+1}</div><div><h3>${h(a.w.title)}</h3><p>${h(a.x)}</p><div class="actions"><button class="secondary" data-open-week="${a.w.id}">Открыть неделю</button></div></div></div>`).join(""):`<div class="empty">🔥 Все текущие практические задачи выполнены. Переходи к следующей неделе.</div>`}</div>`;
}
function renderNotes(){
  const rows=weeks.filter(w=>state.notes[w.id]?.trim()).map(w=>`<div class="card note-card"><h3>Неделя ${w.id} — ${h(w.title)}</h3><textarea class="note" data-note="${w.id}">${h(state.notes[w.id])}</textarea></div>`).join("");
  return `<div class="section-head"><h2>Заметки</h2><span>${Object.values(state.notes).filter(x=>x?.trim()).length} записей</span></div>
  ${rows||`<div class="empty">Заметок пока нет. Открой любую неделю в Roadmap и начни писать.</div>`}`;
}
function render(){
  const app=document.getElementById("app");
  if(state.route==="home") app.innerHTML=renderHome();
  if(state.route==="roadmap") app.innerHTML=renderRoadmap(state.search||"");
  if(state.route==="today") app.innerHTML=renderToday();
  if(state.route==="notes") app.innerHTML=renderNotes();
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.route===state.route));
  bind();
}
function setRoute(r){state.route=r;save();render();window.scrollTo({top:0,behavior:"smooth"});}
function bind(){
  document.querySelectorAll("[data-route]").forEach(b=>b.onclick=()=>setRoute(b.dataset.route));
  document.querySelectorAll("[data-level]").forEach(el=>el.onclick=()=>{state.route="roadmap";state.search="";state.openLevel=el.dataset.level;save();render();});
  document.querySelectorAll("[data-task]").forEach(cb=>cb.onchange=()=>{state.done[cb.dataset.task]=cb.checked;save();render();toast(cb.checked?"Задача выполнена ✓":"Задача возвращена");});
  document.querySelectorAll("[data-note]").forEach(n=>n.oninput=()=>{state.notes[n.dataset.note]=n.value;save();});
  document.querySelectorAll("[data-open-week]").forEach(b=>b.onclick=()=>{state.route="roadmap";state.openWeek=Number(b.dataset.openWeek);save();render();setTimeout(()=>document.querySelector(`[data-week="${state.openWeek}"]`)?.scrollIntoView({behavior:"smooth",block:"start"}),50);});
  const search=document.getElementById("search"); if(search){search.oninput=()=>{state.search=search.value;renderRoadmap(state.search);bind();};}
  document.querySelectorAll("details[data-week]").forEach(d=>d.onToggle=()=>{if(d.open){state.openWeek=Number(d.dataset.week);save();}});
}
document.getElementById("settingsBtn").onclick=()=>toast("Настройки расширим после подключения Telegram");
render();
