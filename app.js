/* Tâches Labo — application Android (Capacitor), données stockées sur le téléphone */
(function(){
"use strict";

/* ---------- plugins natifs ---------- */
const Cap = window.Capacitor;
const isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
const LN = window.capacitorLocalNotifications && window.capacitorLocalNotifications.LocalNotifications;
const SR = window.capacitorSpeechRecognition && window.capacitorSpeechRecognition.SpeechRecognition;
const FSx = window.capacitorFilesystem;
const SHx = window.capacitorShare;
const APP = window.capacitorApp && window.capacitorApp.App;

/* ---------- icônes ---------- */
const P = (d)=>`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  equip:P('<path d="M9 3h6"/><path d="M10 3v6L5 18a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/>'),
  stock:P('<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/>'),
  patient:P('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'),
  assur:P('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h6M9 11h2"/>'),
  caisse:P('<rect x="2" y="6" width="20" height="13" rx="2"/><circle cx="12" cy="12.5" r="2.5"/><path d="M6 10v.01M18 15v.01"/>'),
  bureau:P('<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/>'),
  recur:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
  bell:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  bellOff:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.7 3A6 6 0 0 1 18 8c0 2.8.7 4.8 1.5 6.2M17 17H3s3-2 3-9c0-.8.1-1.5.4-2.2"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0M2 2l20 20"/></svg>',
  mic:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1"/><path d="M12 18v4"/></svg>',
  scan:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 8v8M10 8v8M14 8v8M17 8v8"/></svg>',
  check:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  left:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  right:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
  close:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
};
const CATS = {
  equip:{label:'Équipements', types:['Contrôle qualité','Calibration','Maintenance','Appel fournisseur (maintenance / réparation)']},
  stock:{label:'Stock & achats', types:['Vérification de stock','Commande de réactif','Correction de commande reçue','Réclamation fournisseur']},
  patient:{label:'Patients & médecins', types:['Appeler un patient','RDV patient pour un acte','Appeler un médecin']},
  assur:{label:'Assurance & administratif', types:['Ordonnance à vérifier','Correction de facture','Correction sur plateforme assurance','Document manquant']},
  caisse:{label:'Caisse', types:['Vérification de caisse']},
  bureau:{label:'Bureautique', types:['Papier','Imprimante / encre','Fournitures de bureau']}
};
const DOSSIER_CATS = ['patient','assur'];
const COLORS = ['#0E7490','#BE185D','#6D28D9','#7C4A1E','#3730A3','#A21CAF','#115E59','#9F1239'];
const UNIT = {day:'jour',week:'semaine',month:'mois'};
const DAY = 86400000;

/* ---------- base de données locale (sur le téléphone) ---------- */
const DB = (function(){
  const KEY='labo.db.v1';
  let data;
  try{data=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){data={}}
  const listeners=[];
  function save(){
    try{localStorage.setItem(KEY,JSON.stringify(data))}
    catch(e){throw {code:'quota_exceeded'}}
  }
  function coll(name){return data[name]||(data[name]={})}
  function snap(q){
    let arr=Object.keys(coll(q.name)).map(id=>{const v=coll(q.name)[id];return {id,exists:true,data:()=>v}});
    if(q.ob){const f=q.ob[0],s=q.ob[1]==='desc'?-1:1;arr.sort((a,b)=>{const x=a.data()[f],y=b.data()[f];return (x<y?-1:x>y?1:0)*s})}
    if(q.lim) arr=arr.slice(0,q.lim);
    return {docs:arr,size:arr.length,empty:!arr.length};
  }
  function notify(name){listeners.forEach(l=>{if(l.q.name===name)l.cb(snap(l.q))})}
  function query(q){
    return {
      orderBy:(f,d)=>query(Object.assign({},q,{ob:[f,d||'asc']})),
      limit:(n)=>query(Object.assign({},q,{lim:n})),
      get:async()=>snap(q),
      onSnapshot:(cb)=>{const l={q,cb};listeners.push(l);setTimeout(()=>cb(snap(q)),0);return ()=>{const i=listeners.indexOf(l);if(i>=0)listeners.splice(i,1)}}
    };
  }
  const newId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
  function doc(name,id){
    id=id||newId();
    return {
      id,
      set:async(v)=>{coll(name)[id]=JSON.parse(JSON.stringify(v));save();notify(name)},
      update:async(v)=>{const c=coll(name);if(!c[id])throw {code:'invalid_argument'};Object.assign(c[id],JSON.parse(JSON.stringify(v)));save();notify(name)},
      delete:async()=>{delete coll(name)[id];save();notify(name)}
    };
  }
  return {
    collection:(name)=>Object.assign(query({name}),{doc:(id)=>doc(name,id),add:async(v)=>{const d=doc(name);await d.set(v);return d}}),
    exportAll:()=>JSON.stringify({app:'taches-labo',version:1,exportedAt:Date.now(),data},null,1),
    importAll:(text)=>{
      const o=JSON.parse(text);
      if(!o||o.app!=='taches-labo'||!o.data||typeof o.data!=='object') throw new Error('format');
      data=o.data;save();['staff','tasks','log'].forEach(notify);
    }
  };
})();

/* ---------- état ---------- */
const S = {
  db:DB, staff:[], tasks:[], log:[], gotStaff:false,
  meId:lsGet('labo.me'), view:'tasks', scope:'mine', tstatus:'todo',
  weekStart:startOfWeek(Date.now()), day:startOfDay(Date.now()),
  rep:{period:7, person:'', cat:''}, sheet:null, soundOn:lsGet('labo.sound')!=='0', now:Date.now(),
  notifPerm:isNative?'unknown':'web', exact:'granted'
};
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}}

/* ---------- outils ---------- */
const $ = (s)=>document.querySelector(s);
const esc = (s)=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function startOfDay(ms){const d=new Date(ms);d.setHours(0,0,0,0);return d.getTime()}
function startOfWeek(ms){const d=new Date(startOfDay(ms));const wd=(d.getDay()+6)%7;d.setDate(d.getDate()-wd);return d.getTime()}
function addDays(ms,n){const d=new Date(ms);d.setDate(d.getDate()+n);return d.getTime()}
const fTime = (ms)=>new Date(ms).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
const fDate = (ms)=>new Date(ms).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'});
const fLong = (ms)=>{const s=new Date(ms).toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});return s.charAt(0).toUpperCase()+s.slice(1)};
function toLocalInput(ms){const d=new Date(ms);return new Date(ms-d.getTimezoneOffset()*60000).toISOString().slice(0,16)}
function staffById(id){return S.staff.find(s=>s.id===id)}
function me(){return staffById(S.meId)}
function initialsOf(name){return name.trim().split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase()}
function badge(st,size){
  size=size||40;
  if(!st) return `<span class="badge" style="width:${size}px;height:${size}px;background:var(--muted);font-size:${Math.round(size*.36)}px">?</span>`;
  if(st.role==='bio') return `<span class="badge bio" style="width:${size}px;height:${size}px;font-size:${Math.round(size*.3)}px" title="${esc(st.name)}">BIO</span>`;
  return `<span class="badge" style="width:${size}px;height:${size}px;background:${esc(st.color||COLORS[0])};font-size:${Math.round(size*.36)}px" title="${esc(st.name)}">${esc(st.initials||initialsOf(st.name))}</span>`;
}
async function sha256(text){
  if(window.crypto&&crypto.subtle){
    const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
    return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');
  }
  let h=5381;for(let i=0;i<text.length;i++)h=((h<<5)+h+text.charCodeAt(i))|0;return 'djb'+(h>>>0).toString(16);
}
const hashPin=(id,pin)=>sha256('labo:'+id+':'+pin);
function nextDue(ms,n,unit){const d=new Date(ms);if(unit==='day')d.setDate(d.getDate()+n);else if(unit==='week')d.setDate(d.getDate()+7*n);else d.setMonth(d.getMonth()+n);return d.getTime()}
function recurText(t){if(!t.recurUnit||t.recurUnit==='none')return '';const n=Number(t.recurN)||1;return n>1?'Tous les '+n+' '+(t.recurUnit==='month'?'mois':UNIT[t.recurUnit]+'s'):'Chaque '+UNIT[t.recurUnit]}
function assignLabel(t){
  if(t.assignType==='person'){const s=staffById(t.assignId);return s?s.name:'Personne retirée'}
  return t.assignType==='tech'?'Tous les techniciens':t.assignType==='bio'?'Biologistes':'Tout le labo';
}
function isMine(t,m){
  if(!m) return false;
  if(t.assignType==='person') return t.assignId===m.id;
  if(t.assignType==='tech') return m.role==='tech';
  if(t.assignType==='bio') return m.role==='bio';
  return true;
}
function status(t){
  const now=S.now;
  if(t.dueAt<now) return 'late';
  if(t.priority==='urgent') return 'urgent';
  if(startOfDay(t.dueAt)===startOfDay(now)) return 'today';
  return 'soon';
}
function tagText(t,st){
  const d=startOfDay(t.dueAt), today=startOfDay(S.now);
  const when = d===today?fTime(t.dueAt):d===today+DAY?'demain '+fTime(t.dueAt):d===today-DAY?'hier '+fTime(t.dueAt):fDate(t.dueAt)+' '+fTime(t.dueAt);
  if(st==='late') return 'En retard · '+when;
  if(st==='urgent') return 'Urgent · '+when;
  if(st==='today') return "Aujourd'hui · "+when;
  return when.charAt(0).toUpperCase()+when.slice(1);
}
function dossierText(t){return t.dossier&&t.dossier.n?'Dossier '+t.dossier.j+t.dossier.m+t.dossier.n:''}
function openTasks(){return S.tasks.filter(t=>!t.done)}
function sortTasks(a,b){
  const rank={late:0,urgent:1,today:2,soon:3};
  const ra=a.paused?9:rank[status(a)], rb=b.paused?9:rank[status(b)];
  return ra-rb || a.dueAt-b.dueAt;
}
function soundFor(t){const st=status(t);if(st==='late'||t.priority==='urgent')return 'urgent';if(t.cat==='equip')return 'equip';if(t.cat==='patient')return 'patient';return 'soft'}

/* ---------- sons dans l'appli ---------- */
let actx=null;
function ensureAudio(){
  if(!actx){try{actx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){actx=null}}
  if(actx&&actx.state==='suspended'){actx.resume().catch(()=>{})}
}
function tone(f,t,dur,type,vol){
  const o=actx.createOscillator(),g=actx.createGain();o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+dur+.05);
}
const SOUNDS={
  equip:t=>{[0,.25,.5].forEach(d=>tone(880,t+d,.18,'square',.12))},
  patient:t=>{[660,880,990].forEach((f,i)=>tone(f,t+i*.18,.45,'sine',.3))},
  soft:t=>{tone(523,t,.35,'triangle',.25);tone(659,t+.3,.5,'triangle',.25)},
  urgent:t=>{for(let i=0;i<8;i++)tone(i%2?740:988,t+i*.15,.13,'sawtooth',.13)}
};
function play(kind){if(!S.soundOn)return;ensureAudio();if(!actx)return;try{SOUNDS[kind](actx.currentTime+.03)}catch(e){}}

/* ---------- notifications Android (même téléphone en veille) ---------- */
const CHANNELS=[
  {id:'labo_urgent',name:'Urgent et en retard',description:'Tâches urgentes ou en retard',sound:'urgent.wav'},
  {id:'labo_equip',name:'Équipements',description:'Contrôles, calibrations, maintenances',sound:'equip.wav'},
  {id:'labo_patient',name:'Patients et médecins',description:'Appels et rendez-vous',sound:'patient.wav'},
  {id:'labo_soft',name:'Administratif et stock',description:'Assurance, caisse, stock, bureautique',sound:'soft.wav'}
];
function channelFor(t,loud){if(loud||t.priority==='urgent')return 'labo_urgent';if(t.cat==='equip')return 'labo_equip';if(t.cat==='patient')return 'labo_patient';return 'labo_soft'}
async function setupNotifications(){
  if(!isNative||!LN) return;
  try{
    for(const c of CHANNELS){await LN.createChannel(Object.assign({importance:5,visibility:1,vibration:true,lights:true,lightColor:'#0B5E84'},c))}
    const p=await LN.checkPermissions();S.notifPerm=p.display;
    try{const ex=await LN.checkExactNotificationSetting();S.exact=ex.exact_alarm||'granted'}catch(e){S.exact='granted'}
    LN.addListener('localNotificationActionPerformed',(a)=>{
      const id=a&&a.notification&&a.notification.extra&&a.notification.extra.taskId;
      if(id&&S.tasks.some(t=>t.id===id)){S.view='tasks';S.sheet={type:'validate',id};render()}
    });
  }catch(e){}
  render();scheduleSoon();
}
async function askNotifications(){
  if(!LN)return;
  try{const p=await LN.requestPermissions();S.notifPerm=p.display;}catch(e){}
  if(S.notifPerm==='granted'){toast('Notifications activées');scheduleSoon()}
  else toast("Notifications refusées. Activez-les dans Paramètres › Applis › Tâches Labo.",5000);
  render();
}
async function askExact(){
  if(!LN)return;
  try{await LN.changeExactNotificationSetting()}catch(e){}
  setTimeout(async()=>{try{const ex=await LN.checkExactNotificationSetting();S.exact=ex.exact_alarm||'granted'}catch(e){}render();scheduleSoon()},1500);
}
let schedTimer=null;
function scheduleSoon(){clearTimeout(schedTimer);schedTimer=setTimeout(reschedule,700)}
async function reschedule(){
  if(!isNative||!LN||S.notifPerm!=='granted') return;
  try{
    const pend=await LN.getPending();
    if(pend&&pend.notifications&&pend.notifications.length) await LN.cancel({notifications:pend.notifications.map(n=>({id:n.id}))});
    const now=Date.now(),horizon=now+8*DAY,list=[];
    const push=(at,title,body,t,loud)=>{if(at>now+5000&&at<horizon)list.push({at,title,body,channelId:channelFor(t,loud),taskId:t.id})};
    for(const t of openTasks()){
      if(t.paused) continue;
      const who=assignLabel(t),rem=(Number(t.remindMin)||0)*60000;
      const occ=occurrences(t,now-DAY,horizon).slice(0,10);
      occ.forEach((o,k)=>{
        push(o-rem, (t.priority==='urgent'?'URGENT · ':'Rappel · ')+t.title, `${rem?'À faire à '+fTime(o):'À faire maintenant'} · ${who}`, t, false);
        if(rem>0) push(o, 'Échéance · '+t.title, `Maintenant · ${who}`, t, false);
        if(k===0){
          push(o+15*60000,'En retard · '+t.title,`Prévue à ${fTime(o)} · ${who}`,t,true);
          push(o+60*60000,'Toujours en retard · '+t.title,`Prévue à ${fTime(o)} · biologiste prévenu · ${who}`,t,true);
        }
      });
    }
    list.sort((a,b)=>a.at-b.at);
    const notifs=list.slice(0,60).map((n,i)=>({
      id:1000+i,title:n.title,body:n.body,channelId:n.channelId,smallIcon:'ic_stat_task',iconColor:'#0B5E84',
      schedule:{at:new Date(n.at),allowWhileIdle:true},extra:{taskId:n.taskId},autoCancel:true
    }));
    if(notifs.length) await LN.schedule({notifications:notifs});
  }catch(e){console.warn('notifications',e)}
}

/* ---------- bandeaux de rappel (appli ouverte) ---------- */
const alerts=new Map();
function toast(msg,ms){
  const el=document.createElement('div');el.className='toast';el.innerHTML=`<div class="tx">${esc(msg)}</div>`;
  $('#toasts').appendChild(el);setTimeout(()=>el.remove(),ms||3200);
}
function renderAlerts(){
  const box=$('#toasts');box.querySelectorAll('.toast.alarm').forEach(e=>e.remove());
  for(const [k,a] of alerts){
    if(a.ack) continue;
    const t=S.tasks.find(x=>x.id===a.id);if(!t||t.done){alerts.delete(k);continue}
    const el=document.createElement('div');el.className='toast alarm';
    el.innerHTML=`<div class="tx"><b>${status(t)==='late'?'En retard':'Rappel'} :</b> ${esc(t.title)} · ${fTime(t.dueAt)}</div><button data-act="ackopen" data-k="${esc(k)}">Ouvrir</button><button data-act="ack" data-k="${esc(k)}">Vu</button>`;
    box.prepend(el);
  }
}
function checkReminders(){
  S.now=Date.now();
  const m=me();if(!m)return;
  let changed=false;
  for(const t of openTasks()){
    if(t.paused) continue;
    const mine=isMine(t,m);
    const escalate=m.role==='bio'&&!mine&&t.dueAt<S.now-60*60000;
    if(!mine&&!escalate) continue;
    if(S.now<t.dueAt-(Number(t.remindMin)||0)*60000) continue;
    const k=t.id+':'+t.dueAt+(escalate?':esc':'');
    const a=alerts.get(k), loud=status(t)==='late'||t.priority==='urgent';
    if(!a){alerts.set(k,{id:t.id,last:S.now,ack:false});play(soundFor(t));changed=true}
    else if(!a.ack&&loud&&S.now-a.last>=60000){a.last=S.now;play('urgent')}
  }
  if(changed) renderAlerts();
}

/* ---------- écrans ---------- */
function header(title){
  const m=me();
  return `<div class="top"><div><div class="date">${esc(fLong(S.now))}</div><h1>${esc(title)}</h1></div>
  <div class="toprow">
    <button class="iconbtn ${S.soundOn?'on':''}" data-act="sound" aria-label="${S.soundOn?'Couper les sons dans l’appli':'Activer les sons dans l’appli'}" aria-pressed="${S.soundOn}">${S.soundOn?ICON.bell:ICON.bellOff}</button>
    <button class="iconbtn" data-act="who" aria-label="Changer de profil">${badge(m,40)}</button>
  </div></div>`;
}
function permNotice(){
  if(!isNative) return '';
  if(S.notifPerm!=='granted'&&S.notifPerm!=='unknown') return `<div class="notice"><div><b>Rappels désactivés.</b> Autorisez les notifications pour être prévenu même téléphone en veille.</div><button class="ghost blue" data-act="asknotif">Autoriser les notifications</button></div>`;
  if(S.notifPerm==='granted'&&S.exact==='denied') return `<div class="notice"><div><b>Rappels à l'heure exacte.</b> Autorisez les « alarmes et rappels » pour que les sons arrivent pile à l'heure.</div><button class="ghost blue" data-act="askexact">Autoriser</button></div>`;
  return '';
}
function taskCard(t){
  const st=t.paused?'soon':status(t);
  const who=t.assignType==='person'?badge(staffById(t.assignId),24):'';
  const rt=recurText(t);
  return `<div class="card ${t.paused?'paused':st}">
    <div class="ico ${st}">${ICON[t.cat]||ICON.bureau}</div>
    <div class="body">
      <div class="tag ${st}">${t.paused?'Suspendue':esc(tagText(t,st))}</div>
      <div class="ttl">${esc(t.title)}</div>
      <div class="meta">${who}<span>${esc(CATS[t.cat]?CATS[t.cat].label:'')} · ${esc(assignLabel(t))}</span>${rt?`<span style="display:inline-flex;gap:4px;align-items:center;color:var(--brand);font-weight:700">${ICON.recur}${esc(rt)}</span>`:''}${dossierText(t)?'<span>· '+esc(dossierText(t))+'</span>':''}</div>
    </div>
    <button class="done-btn" data-act="validate" data-id="${esc(t.id)}">${t.paused?'Voir':'Fait'}</button>
  </div>`;
}
function logRow(l,showDate){
  const s=staffById(l.by);
  return `<div class="card">
    ${badge(s,46)}
    <div class="body">
      <div class="tag donec">${l.late?'Validée en retard':'Validée'} · ${showDate?fDate(l.at)+' ':''}${fTime(l.at)}</div>
      <div class="ttl">${esc(l.title)}</div>
      <div class="meta"><span>${esc(CATS[l.cat]?CATS[l.cat].label:'')} · ${esc(s?s.name:'?')}</span>${l.value?'<span>· '+esc(l.value)+'</span>':''}</div>
      ${l.comment?`<div class="meta">${esc(l.comment)}</div>`:''}
    </div>
    <span style="color:var(--done)">${ICON.check}</span>
  </div>`;
}
function viewTasks(){
  const m=me();
  const open=openTasks().filter(t=>S.scope==='all'||(!t.paused&&isMine(t,m))).sort(sortTasks);
  const mineOpen=openTasks().filter(t=>!t.paused&&isMine(t,m));
  const cnt=k=>mineOpen.filter(t=>status(t)===k).length;
  const today0=startOfDay(S.now);
  const doneToday=S.log.filter(l=>l.at>=today0).filter(l=>S.scope==='all'||l.by===S.meId||isMine(l,m)).sort((a,b)=>b.at-a.at);
  const parts=m?m.name.trim().split(/\s+/):[''];let h=header('Bonjour '+(/^dr\.?$/i.test(parts[0])?parts.slice(0,2).join(' '):parts[0]));
  h+=permNotice();
  h+=`<div class="stats"><div class="stat u"><b>${cnt('urgent')}</b><span>Urgentes</span></div><div class="stat d"><b>${cnt('today')}</b><span>Aujourd'hui</span></div><div class="stat l"><b>${cnt('late')}</b><span>En retard</span></div></div>`;
  h+=`<div class="seg" role="group" aria-label="Portée"><button data-act="scope" data-v="mine" aria-pressed="${S.scope==='mine'}">Mes tâches</button><button data-act="scope" data-v="all" aria-pressed="${S.scope==='all'}">Tout le labo</button></div>`;
  h+=`<div class="pills" role="group" aria-label="Statut"><button class="pill" data-act="tstatus" data-v="todo" aria-pressed="${S.tstatus==='todo'}">À faire · ${open.length}</button><button class="pill" data-act="tstatus" data-v="done" aria-pressed="${S.tstatus==='done'}">Validées aujourd'hui · ${doneToday.length}</button></div>`;
  if(S.tstatus==='todo'){
    h+= open.length? `<div class="list">${open.map(taskCard).join('')}</div>`
      : `<div class="empty"><b>Aucune tâche à faire</b><span>Touchez le bouton + pour créer une tâche.</span></div>`;
  } else {
    h+= doneToday.length? `<div class="list">${doneToday.map(l=>logRow(l,false)).join('')}</div>`
      : `<div class="empty"><b>Rien de validé aujourd'hui</b><span>Les tâches validées apparaissent ici avec les initiales de la personne.</span></div>`;
  }
  return h;
}
function occurrences(t,from,to){
  const out=[];if(t.done)return out;
  if(!t.recurUnit||t.recurUnit==='none'){if(t.dueAt>=from&&t.dueAt<to)out.push(t.dueAt);return out}
  let d=t.dueAt,guard=0;
  while(d<to&&guard<400){if(d>=from)out.push(d);d=nextDue(d,Number(t.recurN)||1,t.recurUnit);guard++}
  return out;
}
function dayItems(dayMs){
  const from=dayMs,to=addDays(dayMs,1),items=[];
  for(const t of S.tasks){if(t.paused)continue;for(const o of occurrences(t,from,to)){
    const st=o===t.dueAt?status(t):(t.priority==='urgent'?'urgent':(startOfDay(o)===startOfDay(S.now)?'today':'soon'));
    items.push({kind:'task',t,at:o,st});
  }}
  for(const l of S.log){if(l.at>=from&&l.at<to)items.push({kind:'log',l,at:l.at,st:'done'})}
  return items.sort((a,b)=>a.at-b.at);
}
const DOTC={late:'var(--late)',urgent:'var(--urgent)',today:'var(--due)',soon:'var(--soon)',done:'var(--done)'};
function viewPlanning(){
  let h=header('Planning');
  const ws=S.weekStart;
  h+=`<div class="wnav"><button class="iconbtn" data-act="week" data-v="-1" aria-label="Semaine précédente">${ICON.left}</button><b>Semaine du ${new Date(ws).toLocaleDateString('fr-FR',{day:'numeric',month:'long'})}</b><button class="iconbtn" data-act="week" data-v="1" aria-label="Semaine suivante">${ICON.right}</button></div>`;
  h+='<div class="week">';
  for(let i=0;i<7;i++){
    const d=addDays(ws,i),its=dayItems(d).slice(0,4),dd=new Date(d);
    h+=`<button data-act="day" data-v="${d}" aria-pressed="${d===S.day}" aria-label="${esc(fLong(d))}"><small>${dd.toLocaleDateString('fr-FR',{weekday:'short'}).replace('.','')}</small><strong>${dd.getDate()}</strong><span class="dots">${its.map(x=>`<i style="background:${DOTC[x.st]}"></i>`).join('')}</span></button>`;
  }
  h+='</div>';
  h+=`<div class="sec">${esc(fLong(S.day))}</div>`;
  const items=dayItems(S.day);
  if(!items.length) h+=`<div class="empty"><b>Journée libre</b><span>Aucune tâche prévue ce jour-là.</span></div>`;
  else{
    h+='<div class="list">';
    for(const x of items){
      if(x.kind==='log'){
        const s=staffById(x.l.by);
        h+=`<div class="slot"><div class="tm">${fTime(x.at)}</div><div class="card" style="background:var(--done-t);border-color:transparent">${badge(s,32)}<div class="body"><div class="ttl" style="color:var(--done)">${esc(x.l.title)}</div><div class="meta">Faite par ${esc(s?s.name:'?')}</div></div></div></div>`;
      } else {
        const t=x.t,rt=recurText(t);
        h+=`<div class="slot"><div class="tm">${fTime(x.at)}</div><button class="card ${x.st}" data-act="validate" data-id="${esc(t.id)}"><span class="body"><span class="ttl">${esc(t.title)}</span><span class="meta">${t.assignType==='person'?badge(staffById(t.assignId),22):''}${rt?`<span style="display:inline-flex;gap:4px;align-items:center;color:var(--brand);font-weight:700">${ICON.recur}${esc(rt)}</span>`:''}<span>${esc(assignLabel(t))}</span></span></span></button></div>`;
      }
    }
    h+='</div>';
  }
  h+=`<div class="legend"><span><i style="background:var(--urgent)"></i>Urgent</span><span><i style="background:var(--late)"></i>En retard</span><span><i style="background:var(--due)"></i>Aujourd'hui</span><span><i style="background:var(--soon)"></i>À venir</span><span><i style="background:var(--done)"></i>Fait</span></div>`;
  return h;
}
function reportRows(){
  const from=S.rep.period===1?startOfDay(S.now):S.now-S.rep.period*DAY;
  return S.log.filter(l=>l.at>=from&&(!S.rep.person||l.by===S.rep.person)&&(!S.rep.cat||l.cat===S.rep.cat)).sort((a,b)=>b.at-a.at);
}
function viewReport(){
  let h=header('Rapports');
  h+=`<div class="seg" role="group" aria-label="Période">${[[1,"Aujourd'hui"],[7,'7 jours'],[30,'30 jours']].map(([v,l])=>`<button data-act="period" data-v="${v}" aria-pressed="${S.rep.period===v}">${l}</button>`).join('')}</div>`;
  h+=`<div class="row" style="margin-bottom:12px"><div><label class="l" for="rp">Personne</label><select class="in" id="rp" data-change="rperson"><option value="">Tout le monde</option>${S.staff.map(s=>`<option value="${esc(s.id)}" ${S.rep.person===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div>
  <div><label class="l" for="rc">Catégorie</label><select class="in" id="rc" data-change="rcat"><option value="">Toutes</option>${Object.keys(CATS).map(k=>`<option value="${k}" ${S.rep.cat===k?'selected':''}>${esc(CATS[k].label)}</option>`).join('')}</select></div></div>`;
  const rows=reportRows(),late=rows.filter(r=>r.late).length;
  h+=`<div class="kpis"><div class="kpi"><b style="color:var(--done)">${rows.length}</b><span>Validées</span></div><div class="kpi"><b style="color:var(--late)">${late}</b><span>En retard</span></div><div class="kpi"><b>${rows.length?Math.round((rows.length-late)/rows.length*100)+' %':'—'}</b><span>À l'heure</span></div></div>`;
  if(!rows.length) h+=`<div class="empty"><b>Aucune validation sur cette période</b><span>Chaque tâche validée est enregistrée ici avec le nom, la date et l'heure.</span></div>`;
  else h+=`<div class="rows">${rows.slice(0,300).map(l=>{const s=staffById(l.by);return `<div class="r">${badge(s,34)}<div class="body"><div class="ttl" style="font-size:15px">${esc(l.title)}</div><div class="meta">${esc(s?s.name:'?')} · ${fDate(l.at)} ${fTime(l.at)}${l.late?' · <b style="color:var(--late)">en retard</b>':''}${l.value?' · '+esc(l.value):''}</div></div></div>`}).join('')}</div>`;
  h+=`<div style="margin-top:14px"><button class="primary" data-act="export" ${rows.length?'':'disabled'}>Envoyer le rapport (Excel / CSV)</button></div>`;
  return h;
}
function viewTeam(){
  const m=me(),isBio=m&&m.role==='bio';
  let h=header('Équipe');
  h+=`<div class="rows" style="margin-bottom:14px">${S.staff.slice().sort((a,b)=>a.role===b.role?a.name.localeCompare(b.name):a.role==='bio'?-1:1).map(s=>`<div class="r">${badge(s,40)}<div class="body"><div class="ttl">${esc(s.name)}${s.id===S.meId?' <span class="hint">(vous)</span>':''}</div><div class="meta">${s.role==='bio'?'Biologiste':'Technicien'}</div></div>${isBio&&s.id!==S.meId?`<button class="ghost danger" data-act="delstaff" data-id="${esc(s.id)}">Retirer</button>`:''}</div>`).join('')}</div>`;
  if(isBio){
    h+=`<form class="box" data-form="staff" autocomplete="off"><h2 style="margin:0">Ajouter une personne</h2>
      <div><label class="l" for="sn">Nom</label><input class="in" id="sn" name="name" required maxlength="40" placeholder="Prénom Nom"></div>
      <div><span class="l">Fonction</span><div class="chips" role="radiogroup"><button type="button" class="chip" data-act="srole" data-v="tech" aria-pressed="true">Technicien</button><button type="button" class="chip" data-act="srole" data-v="bio" aria-pressed="false">Biologiste</button></div></div>
      <div id="colorbox"><span class="l">Couleur du cercle</span><div class="colors">${COLORS.map((c,i)=>`<button type="button" data-act="scolor" data-v="${c}" aria-pressed="${i===0}" aria-label="Couleur ${i+1}" style="background:${c}"></button>`).join('')}</div><div class="hint" style="margin-top:6px">Ces couleurs évitent celles des statuts (rouge, orange, vert, bleu).</div></div>
      <div><label class="l" for="sp">Code personnel (4 chiffres)</label><input class="in pin" id="sp" name="pin" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required></div>
      <div class="err" id="serr" hidden></div>
      <button class="primary" type="submit">Ajouter</button></form>`;
    h+=`<div class="box"><b>Sauvegarde des données</b><div class="hint">Les données restent sur ce téléphone. Envoyez une sauvegarde régulièrement (WhatsApp, e-mail, Drive) : elle permet de tout récupérer sur un autre téléphone.</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="ghost blue" data-act="backup">Envoyer une sauvegarde</button><button class="ghost danger" data-act="restore">Restaurer une sauvegarde</button></div></div>`;
  } else {
    h+=`<div class="hint" style="margin-bottom:12px">Seul un biologiste peut ajouter ou retirer des membres de l'équipe.</div>`;
  }
  h+=`<div class="box"><b>Tester les sons</b><div class="chips"><button class="chip" data-act="test" data-v="equip">Équipements</button><button class="chip" data-act="test" data-v="patient">Patients</button><button class="chip" data-act="test" data-v="soft">Administratif</button><button class="chip u" data-act="test" data-v="urgent" aria-pressed="true">Urgent / retard</button></div><div class="hint">Les mêmes sons accompagnent les notifications, même téléphone en veille.</div></div>`;
  h+=`<div class="hint" style="text-align:center;margin-top:8px">Tâches Labo · version d'essai 0.1</div>`;
  return h;
}
function viewSetup(){
  return `<div class="top"><div><div class="date">Première ouverture</div><h1>Créer le compte du biologiste</h1></div></div>
  <form class="box" data-form="setup" autocomplete="off">
    <div class="hint">Ce premier compte gère l'équipe et les tâches permanentes. Vous ajouterez ensuite les techniciens dans l'onglet Équipe.</div>
    <div><label class="l" for="un">Nom</label><input class="in" id="un" name="name" required maxlength="40" placeholder="Dr Prénom Nom"></div>
    <div><label class="l" for="up">Code personnel (4 chiffres)</label><input class="in pin" id="up" name="pin" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required></div>
    <div class="err" id="uerr" hidden></div>
    <button class="primary" type="submit">Créer</button>
  </form>
  <div class="box"><div class="hint">Vous avez une sauvegarde d'un autre téléphone ?</div><button class="ghost" data-act="restore">Restaurer une sauvegarde</button></div>`;
}
function viewWho(){
  return `<div class="top"><div><div class="date">Bienvenue</div><h1>Qui utilise l'appli ?</h1></div></div>
  <div class="rows">${S.staff.map(s=>`<button class="r" style="width:100%;border:none;background:none;text-align:left" data-act="pickme" data-id="${esc(s.id)}">${badge(s,44)}<span class="body"><span class="ttl">${esc(s.name)}</span><span class="meta">${s.role==='bio'?'Biologiste':'Technicien'}</span></span>${ICON.right}</button>`).join('')}</div>
  <div class="hint" style="margin-top:10px">Chaque validation demande le code personnel, même si le téléphone est partagé.</div>`;
}

function render(){
  S.now=Date.now();
  const app=$('#app');
  if(!S.gotStaff) return;
  if(!S.staff.length){app.innerHTML=viewSetup();$('#nav').hidden=true;$('#fab').hidden=true;renderSheet();return}
  if(!me()){app.innerHTML=viewWho();$('#nav').hidden=true;$('#fab').hidden=true;renderSheet();return}
  const v=S.view;
  app.innerHTML = v==='planning'?viewPlanning():v==='report'?viewReport():v==='team'?viewTeam():viewTasks();
  $('#nav').hidden=false;$('#fab').hidden=(v==='team'||v==='report');
  document.querySelectorAll('#nav [data-act="view"]').forEach(b=>b.setAttribute('aria-current',b.dataset.v===v?'page':'false'));
  renderSheet();renderAlerts();
}

/* ---------- fenêtres du bas ---------- */
function closeSheet(){S.sheet=null;renderSheet()}
function renderSheet(){
  const el=$('#sheet');
  if(!S.sheet){el.innerHTML='';return}
  if(S.sheet.rendered) return;
  S.sheet.rendered=true;
  const inner = S.sheet.type==='new'?sheetNew():S.sheet.type==='validate'?sheetValidate():sheetWho();
  el.innerHTML=`<div class="scrim" data-act="scrim"><div class="sheet" role="dialog" aria-modal="true">${inner}</div></div>`;
  if(S.sheet.type==='new') showReadback();
}
function sheetWho(){
  return `<div class="shead"><h2>Changer de profil</h2><button class="iconbtn" data-act="close" aria-label="Fermer">${ICON.close}</button></div>
  <div class="rows">${S.staff.map(s=>`<button class="r" style="width:100%;border:none;background:none;text-align:left" data-act="pickme" data-id="${esc(s.id)}">${badge(s,40)}<span class="body"><span class="ttl">${esc(s.name)}</span><span class="meta">${s.role==='bio'?'Biologiste':'Technicien'}</span></span>${s.id===S.meId?ICON.check:''}</button>`).join('')}</div>`;
}
function sheetNew(){
  const m=me(),isBio=m.role==='bio',d=S.sheet.draft;
  const due=d.dueAt||(Math.ceil((S.now+3600000)/900000)*900000);
  return `<form data-form="new" autocomplete="off">
  <div class="shead"><h2>Nouvelle tâche</h2><button type="button" class="iconbtn" data-act="close" aria-label="Fermer">${ICON.close}</button></div>
  <div class="box">
    <div><span class="l">Catégorie</span><div class="chips">${Object.keys(CATS).map(k=>`<button type="button" class="chip" data-act="ncat" data-v="${k}" aria-pressed="${d.cat===k}"><span style="display:flex">${ICON[k]}</span>${esc(CATS[k].label)}</button>`).join('')}</div></div>
    <div><label class="l" for="ntype">Type de tâche</label><select class="in" id="ntype" data-change="ntype">${CATS[d.cat].types.map(t=>`<option ${d.type===t?'selected':''}>${esc(t)}</option>`).join('')}</select></div>
    <div><label class="l" for="ntitle">Titre</label><div class="withmic"><input class="in" id="ntitle" name="title" required maxlength="90" value="${esc(d.title)}"><button type="button" class="mic" data-act="dict-title" aria-label="Dicter le titre">${ICON.mic}</button></div></div>
  </div>
  <div class="box" ${DOSSIER_CATS.includes(d.cat)?'':'hidden'}>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><b>N° de dossier</b><button type="button" class="ghost blue" data-act="scan">${ICON.scan}Scanner l'étiquette</button></div>
    <div><label class="l" for="ndict">Ou dictez : jour, mois, puis le numéro chiffre par chiffre</label><div class="withmic"><input class="in" id="ndict" placeholder="zéro neuf, zéro un, un huit huit" data-input="dict"><button type="button" class="mic" data-act="dict-dos" aria-label="Dicter le numéro de dossier">${ICON.mic}</button></div></div>
    <div class="dos"><div><label for="dj">Jour</label><input id="dj" inputmode="numeric" maxlength="2" value="${esc(d.dj||'')}" data-input="dos"></div><div><label for="dm">Mois</label><input id="dm" inputmode="numeric" maxlength="2" value="${esc(d.dm||'')}" data-input="dos"></div><div><label for="dn">N° patient</label><input id="dn" inputmode="numeric" maxlength="5" value="${esc(d.dn||'')}" data-input="dos"></div></div>
    <div id="readback" class="readback" hidden></div>
  </div>
  <div class="box">
    <div><span class="l">Priorité</span><div class="chips"><button type="button" class="chip" data-act="nprio" data-v="normal" aria-pressed="${d.priority!=='urgent'}">Normale</button><button type="button" class="chip u" data-act="nprio" data-v="urgent" aria-pressed="${d.priority==='urgent'}">Urgente</button></div></div>
    <div><label class="l" for="nassign">Assignée à</label><select class="in" id="nassign" name="assign">
      <option value="all">Tout le labo</option><option value="tech">Tous les techniciens</option><option value="bio">Biologistes</option>
      <optgroup label="Une personne">${S.staff.map(s=>`<option value="p:${esc(s.id)}" ${d.assign==='p:'+s.id?'selected':''}>${esc(s.name)}${s.role==='bio'?' (biologiste)':''}</option>`).join('')}</optgroup></select></div>
    <div class="row"><div><label class="l" for="ndue">Échéance</label><input class="in" type="datetime-local" id="ndue" name="due" value="${toLocalInput(due)}" required></div>
    <div><label class="l" for="nrem">Rappel</label><select class="in" id="nrem" name="remind"><option value="0">À l'échéance</option><option value="15">15 min avant</option><option value="30" selected>30 min avant</option><option value="60">1 h avant</option><option value="120">2 h avant</option><option value="1440">1 jour avant</option></select></div></div>
    ${isBio?`<div><span class="l">Tâche permanente (réservé biologiste)</span><div class="row"><div><label class="l" for="nrn">Tous les</label><input class="in" type="number" id="nrn" name="recurN" min="1" max="365" value="1"></div><div><label class="l" for="nru">Unité</label><select class="in" id="nru" name="recurUnit"><option value="none">Pas de répétition</option><option value="day">jours</option><option value="week">semaines</option><option value="month">mois</option></select></div></div></div>`:''}
    <div><label class="l" for="nnote">Note (facultatif)</label><textarea class="in" id="nnote" name="note" maxlength="300"></textarea></div>
    <div class="hint">Créée par ${esc(m.name)} · ${m.role==='bio'?'biologiste':'technicien'}</div>
  </div>
  <div class="err" id="nerr" hidden style="margin-bottom:10px"></div>
  <button class="primary" type="submit">Créer la tâche</button>
  </form>`;
}
function sheetValidate(){
  const t=S.tasks.find(x=>x.id===S.sheet.id);if(!t)return `<div class="shead"><h2>Tâche introuvable</h2><button class="iconbtn" data-act="close" aria-label="Fermer">${ICON.close}</button></div>`;
  const m=me(),isBio=m.role==='bio',st=status(t),creator=staffById(t.createdBy),rt=recurText(t);
  return `<form data-form="validate" autocomplete="off">
  <div class="shead"><h2>Valider la tâche</h2><button type="button" class="iconbtn" data-act="close" aria-label="Fermer">${ICON.close}</button></div>
  <div class="box" style="gap:6px">
    <div class="tag ${t.paused?'soon':st}">${t.paused?'Suspendue':esc(tagText(t,st))} · ${esc(CATS[t.cat]?CATS[t.cat].label:'')}</div>
    <div class="ttl" style="font-size:19px">${esc(t.title)}</div>
    ${dossierText(t)?`<div class="meta" style="font-size:15px;color:var(--ink)"><b>${esc(dossierText(t))}</b> · patient n° ${esc(t.dossier.n)} du ${esc(t.dossier.j)}/${esc(t.dossier.m)}</div>`:''}
    <div class="meta">Assignée à ${esc(assignLabel(t))} · créée par ${esc(creator?creator.name:'?')}</div>
    ${rt?`<div class="meta" style="color:var(--brand);font-weight:700">${ICON.recur} Tâche permanente · ${esc(rt.toLowerCase())}</div>`:''}
    ${t.note?`<div class="meta">${esc(t.note)}</div>`:''}
  </div>
  ${t.paused?'':`<div class="box">
    <div><label class="l" for="vby">Validée par</label><select class="in" id="vby" name="by">${S.staff.map(s=>`<option value="${esc(s.id)}" ${s.id===S.meId?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div>
    <div><label class="l" for="vval">${t.cat==='equip'?'N° de lot / résultat (facultatif)':'Résultat (facultatif)'}</label><input class="in" id="vval" name="value" maxlength="60"></div>
    <div><label class="l" for="vcom">Commentaire (facultatif)</label><div class="withmic"><input class="in" id="vcom" name="comment" maxlength="200"><button type="button" class="mic" data-act="dict-com" aria-label="Dicter le commentaire">${ICON.mic}</button></div></div>
    <div><label class="l" for="vpin">Code personnel</label><input class="in pin" id="vpin" name="pin" type="password" inputmode="numeric" maxlength="4" required></div>
    <div class="err" id="verr" hidden></div>
    <button class="primary go" type="submit">Valider — tâche faite</button>
    <div class="hint" style="text-align:center">Enregistré avec le nom, la date et l'heure.</div>
  </div>`}
  ${isBio?`<div style="display:flex;gap:10px;flex-wrap:wrap">${rt?`<button type="button" class="ghost" data-act="pause" data-id="${esc(t.id)}">${t.paused?'Reprendre la tâche':'Suspendre (ex. automate en panne)'}</button>`:''}<button type="button" class="ghost danger" data-act="deltask" data-id="${esc(t.id)}">Supprimer</button></div>`:''}
  </form>`;
}

/* ---------- n° de dossier ---------- */
const WORDS={zero:'0','zéro':'0',un:'1',une:'1',deux:'2',trois:'3',quatre:'4',cinq:'5',six:'6',sept:'7',huit:'8',neuf:'9'};
function digitsFromSpeech(s){
  return s.toLowerCase().replace(/[,.;:\-]/g,' ').split(/\s+/).map(w=>WORDS[w]!==undefined?WORDS[w]:w.replace(/\D/g,'')).join('');
}
function fillDossier(digits){
  if(digits.length<5){showReadback();return false}
  $('#dj').value=digits.slice(0,2);$('#dm').value=digits.slice(2,4);$('#dn').value=digits.slice(4,9);
  showReadback();return true;
}
function checkDossier(j,m,n){
  if(!j&&!m&&!n) return {empty:true};
  const jj=+j,mm=+m;
  if(j.length!==2||jj<1||jj>31) return {err:'Jour invalide (01 à 31)'};
  if(m.length!==2||mm<1||mm>12) return {err:'Mois invalide (01 à 12)'};
  if(!n) return {err:'Numéro du patient manquant'};
  let y=new Date(S.now).getFullYear(),dt=new Date(y,mm-1,jj);
  if(dt.getMonth()!==mm-1) return {err:"Cette date n'existe pas"};
  if(dt.getTime()>S.now){y--;dt=new Date(y,mm-1,jj)}
  return {ok:`Patient n° ${String(+n)} du ${jj} ${dt.toLocaleDateString('fr-FR',{month:'long'})} ${y}`};
}
function showReadback(){
  const rb=$('#readback');if(!rb||!$('#dj'))return;
  const r=checkDossier($('#dj').value.trim(),$('#dm').value.trim(),$('#dn').value.trim());
  if(r.empty){rb.hidden=true;return}
  rb.hidden=false;rb.className='readback '+(r.ok?'ok':'bad');rb.textContent=r.ok?('✓ '+r.ok+' — vérifiez avant de créer'):r.err;
}

/* ---------- dictée vocale ---------- */
async function dictate(prompt){
  if(!isNative||!SR){toast('Utilisez le micro du clavier pour dicter.',3500);return null}
  try{
    const av=await SR.available();
    if(!av||!av.available){toast("Dictée indisponible sur ce téléphone. Utilisez le micro du clavier.",4500);return null}
    let p=await SR.checkPermissions();
    if(p.speechRecognition!=='granted') p=await SR.requestPermissions();
    if(p.speechRecognition!=='granted'){toast("Micro refusé. Autorisez-le dans Paramètres › Applis › Tâches Labo.",5000);return null}
    const r=await SR.start({language:'fr-FR',maxResults:1,prompt:prompt||'Parlez maintenant',partialResults:false,popup:true});
    return r&&r.matches&&r.matches[0]?r.matches[0]:null;
  }catch(e){toast("Dictée interrompue. Réessayez.",3000);return null}
}

/* ---------- scan du code-barres (photo) ---------- */
$('#scanfile').addEventListener('change',async e=>{
  const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
  toast('Lecture du code-barres…',1800);
  try{
    const url=URL.createObjectURL(f);
    const reader=new ZXing.BrowserMultiFormatReader();
    const res=await reader.decodeFromImageUrl(url);URL.revokeObjectURL(url);
    const digits=String(res.getText()).replace(/\D/g,'');
    if(fillDossier(digits)) toast('Numéro lu : '+digits,2600); else toast('Code lu mais numéro incomplet : '+res.getText(),3500);
  }catch(err){toast("Code-barres non reconnu. Reprenez la photo plus près, bien à plat, ou dictez le numéro.",4200)}
});

/* ---------- partage de fichiers (rapport, sauvegarde) ---------- */
async function shareText(filename,text,title){
  if(isNative&&FSx&&SHx){
    const r=await FSx.Filesystem.writeFile({path:filename,data:text,directory:FSx.Directory.Cache,encoding:FSx.Encoding.UTF8});
    try{await SHx.Share.share({title,url:r.uri,dialogTitle:title})}catch(e){/* partage annulé */}
    return;
  }
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download=filename;document.body.appendChild(a);a.click();a.remove();
}
async function exportCsv(){
  const rows=reportRows();
  const q=s=>'"'+String(s==null?'':s).replace(/"/g,'""')+'"';
  const lines=[['Date','Heure','Tâche','Catégorie','Dossier','Validée par','Fonction','Échéance','En retard','Résultat','Commentaire'].map(q).join(';')];
  for(const l of rows){const s=staffById(l.by);lines.push([fDate(l.at)+'/'+new Date(l.at).getFullYear(),fTime(l.at),l.title,CATS[l.cat]?CATS[l.cat].label:'',l.dossier?l.dossier.j+l.dossier.m+l.dossier.n:'',s?s.name:'?',s?(s.role==='bio'?'Biologiste':'Technicien'):'',fDate(l.dueAt)+' '+fTime(l.dueAt),l.late?'oui':'non',l.value||'',l.comment||''].map(q).join(';'))}
  try{await shareText('rapport-taches-'+new Date().toISOString().slice(0,10)+'.csv','﻿'+lines.join('\r\n'),'Rapport des tâches')}
  catch(e){toast("Envoi du rapport impossible.",4000)}
}
$('#restorefile').addEventListener('change',e=>{
  const f=e.target.files&&e.target.files[0];e.target.value='';if(!f)return;
  const rd=new FileReader();
  rd.onload=()=>{try{DB.importAll(String(rd.result));toast('Sauvegarde restaurée');S.meId=null;lsSet('labo.me',null);render()}catch(err){toast("Ce fichier n'est pas une sauvegarde de Tâches Labo.",4500)}};
  rd.readAsText(f);
});

/* ---------- données ---------- */
function dbFail(e,elId){
  const msg=e&&e.code==='quota_exceeded'?"Mémoire de l'appli pleine : envoyez une sauvegarde puis supprimez d'anciennes tâches.":'Enregistrement impossible. Réessayez.';
  const el=elId&&$('#'+elId);if(el){el.hidden=false;el.textContent=msg}else toast(msg,4500);
}
function initDb(){
  DB.collection('staff').onSnapshot(snap=>{S.staff=snap.docs.map(d=>Object.assign({id:d.id},d.data()));S.gotStaff=true;render()});
  DB.collection('tasks').onSnapshot(snap=>{S.tasks=snap.docs.map(d=>Object.assign({id:d.id},d.data()));render();checkReminders();scheduleSoon()});
  DB.collection('log').orderBy('at','desc').limit(3000).onSnapshot(snap=>{S.log=snap.docs.map(d=>Object.assign({id:d.id},d.data()));render()});
}

/* ---------- interactions ---------- */
document.addEventListener('click',async e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const a=b.dataset.act,v=b.dataset.v;
  if(a==='scrim'){if(e.target===b)closeSheet();return}
  if(a==='view'){S.view=v;window.scrollTo(0,0);render()}
  else if(a==='scope'){S.scope=v;render()}
  else if(a==='tstatus'){S.tstatus=v;render()}
  else if(a==='sound'){S.soundOn=!S.soundOn;lsSet('labo.sound',S.soundOn?'1':'0');if(S.soundOn){ensureAudio();play('soft')}render()}
  else if(a==='test'){if(!S.soundOn){S.soundOn=true;lsSet('labo.sound','1')}ensureAudio();play(v);render()}
  else if(a==='asknotif'){askNotifications()}
  else if(a==='askexact'){askExact()}
  else if(a==='who'){S.sheet={type:'who'};renderSheet()}
  else if(a==='pickme'){S.meId=b.dataset.id;lsSet('labo.me',S.meId);S.sheet=null;alerts.clear();render();checkReminders();if(isNative&&S.notifPerm==='prompt')askNotifications()}
  else if(a==='close'){closeSheet()}
  else if(a==='validate'){S.sheet={type:'validate',id:b.dataset.id};renderSheet()}
  else if(a==='week'){S.weekStart=addDays(S.weekStart,7*Number(v));S.day=S.weekStart;render()}
  else if(a==='day'){S.day=Number(v);render()}
  else if(a==='period'){S.rep.period=Number(v);render()}
  else if(a==='export'){exportCsv()}
  else if(a==='backup'){try{await shareText('sauvegarde-taches-labo-'+new Date().toISOString().slice(0,10)+'.json',DB.exportAll(),'Sauvegarde Tâches Labo')}catch(err){toast('Sauvegarde impossible.',4000)}}
  else if(a==='restore'){
    if(S.staff.length&&b.dataset.confirm!=='1'){b.dataset.confirm='1';b.textContent='Remplacer toutes les données ? Touchez encore';return}
    $('#restorefile').click();
  }
  else if(a==='ack'||a==='ackopen'){const al=alerts.get(b.dataset.k);if(al){al.ack=true;if(a==='ackopen'){S.sheet={type:'validate',id:al.id};renderSheet()}}renderAlerts()}
  else if(a==='ncat'){const d=S.sheet.draft;syncDraft();d.cat=v;d.type=CATS[v].types[0];d.title=d.type;S.sheet.rendered=false;renderSheet()}
  else if(a==='nprio'){S.sheet.draft.priority=v;b.parentElement.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(c===b)))}
  else if(a==='scan'){$('#scanfile').click()}
  else if(a==='dict-title'){const t=await dictate('Dites le titre de la tâche');if(t){$('#ntitle').value=t.charAt(0).toUpperCase()+t.slice(1)}}
  else if(a==='dict-com'){const t=await dictate('Dites votre commentaire');if(t&&$('#vcom')){$('#vcom').value=t}}
  else if(a==='dict-dos'){const t=await dictate('Jour, mois, puis numéro chiffre par chiffre');if(t){$('#ndict').value=t;const dg=digitsFromSpeech(t);if(!fillDossier(dg))toast('Compris : « '+t+' ». Il manque des chiffres.',4000)}}
  else if(a==='srole'){b.parentElement.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));const cb=$('#colorbox');if(cb)cb.hidden=(v==='bio')}
  else if(a==='scolor'){b.parentElement.querySelectorAll('button').forEach(c=>c.setAttribute('aria-pressed',String(c===b)))}
  else if(a==='pause'){const t=S.tasks.find(x=>x.id===b.dataset.id);if(!t)return;try{await DB.collection('tasks').doc(t.id).update({paused:!t.paused});toast(t.paused?'Tâche reprise':'Tâche suspendue');closeSheet()}catch(err){dbFail(err)}}
  else if(a==='deltask'){
    if(b.dataset.confirm!=='1'){b.dataset.confirm='1';b.textContent='Confirmer la suppression';return}
    try{await DB.collection('tasks').doc(b.dataset.id).delete();toast('Tâche supprimée');closeSheet()}catch(err){dbFail(err)}
  }
  else if(a==='delstaff'){
    if(b.dataset.confirm!=='1'){b.dataset.confirm='1';b.textContent='Confirmer';return}
    try{await DB.collection('staff').doc(b.dataset.id).delete();toast('Personne retirée')}catch(err){dbFail(err)}
  }
});
$('#fab').addEventListener('click',()=>{
  const cat='equip';
  S.sheet={type:'new',draft:{cat,type:CATS[cat].types[0],title:CATS[cat].types[0],priority:'normal',dueAt:S.view==='planning'&&S.day>startOfDay(Date.now())?S.day+8.5*3600000:null}};
  renderSheet();
});
function syncDraft(){
  const d=S.sheet&&S.sheet.draft;if(!d)return;
  const g=id=>{const el=$('#'+id);return el?el.value:''};
  d.title=g('ntitle');d.dj=g('dj');d.dm=g('dm');d.dn=g('dn');d.assign=g('nassign');
  const due=g('ndue');if(due)d.dueAt=new Date(due).getTime();
}
document.addEventListener('change',e=>{
  const k=e.target.dataset.change;if(!k)return;
  if(k==='rperson'){S.rep.person=e.target.value;render()}
  else if(k==='rcat'){S.rep.cat=e.target.value;render()}
  else if(k==='ntype'){const t=$('#ntitle');S.sheet.draft.type=e.target.value;if(t)t.value=e.target.value}
});
document.addEventListener('input',e=>{
  const k=e.target.dataset.input;if(!k)return;
  if(k==='dict'){const dg=digitsFromSpeech(e.target.value);if(dg.length>=5)fillDossier(dg)}
  else if(k==='dos'){e.target.value=e.target.value.replace(/\D/g,'');showReadback()}
});
document.addEventListener('submit',async e=>{
  const f=e.target,k=f.dataset.form;if(!k)return;e.preventDefault();
  const fd=new FormData(f);
  if(k==='setup'||k==='staff'){
    const name=String(fd.get('name')||'').trim(),pin=String(fd.get('pin')||'');
    const errEl=$(k==='setup'?'#uerr':'#serr');
    if(!/^\d{4}$/.test(pin)){errEl.hidden=false;errEl.textContent='Le code doit contenir 4 chiffres.';return}
    let role='bio',color=COLORS[0];
    if(k==='staff'){const r=f.querySelector('[data-act="srole"][aria-pressed="true"]');role=r?r.dataset.v:'tech';const c=f.querySelector('[data-act="scolor"][aria-pressed="true"]');color=c?c.dataset.v:COLORS[0]}
    const ref=DB.collection('staff').doc();
    try{
      const pinHash=await hashPin(ref.id,pin);
      if(k==='setup'){S.meId=ref.id;lsSet('labo.me',ref.id)}
      await ref.set({name,role,initials:initialsOf(name),color,pinHash,createdAt:Date.now()});
      toast(k==='setup'?'Compte créé':name+' ajouté(e) à l\'équipe');
      if(k==='setup'&&isNative&&S.notifPerm!=='granted') askNotifications();
    }catch(err){dbFail(err,k==='setup'?'uerr':'serr')}
  }
  else if(k==='new'){
    syncDraft();
    const d=S.sheet.draft,errEl=$('#nerr');
    const title=String(fd.get('title')||'').trim();
    const due=new Date(String(fd.get('due'))).getTime();
    if(!title||isNaN(due)){errEl.hidden=false;errEl.textContent='Indiquez un titre et une échéance.';return}
    let dossier=null;
    if(DOSSIER_CATS.includes(d.cat)){
      const r=checkDossier((d.dj||'').trim(),(d.dm||'').trim(),(d.dn||'').trim());
      if(r.err){errEl.hidden=false;errEl.textContent='N° de dossier : '+r.err;return}
      if(r.ok) dossier={j:d.dj,m:d.dm,n:d.dn};
    }
    const as=String(fd.get('assign')||'all');
    const recurUnit=String(fd.get('recurUnit')||'none');
    const doc={title,cat:d.cat,priority:d.priority||'normal',dueAt:due,remindMin:Number(fd.get('remind'))||0,
      assignType:as.startsWith('p:')?'person':as,assignId:as.startsWith('p:')?as.slice(2):null,
      recurUnit,recurN:Math.max(1,Number(fd.get('recurN'))||1),dossier,note:String(fd.get('note')||'').trim(),
      createdBy:S.meId,createdAt:Date.now(),done:false,paused:false};
    try{await DB.collection('tasks').add(doc);closeSheet();toast('Tâche créée');play(doc.priority==='urgent'?'urgent':soundFor(doc))}catch(err){dbFail(err,'nerr')}
  }
  else if(k==='validate'){
    const t=S.tasks.find(x=>x.id===S.sheet.id);if(!t)return;
    const by=String(fd.get('by')),pin=String(fd.get('pin')||''),errEl=$('#verr');
    const who=staffById(by);
    if(!who||await hashPin(who.id,pin)!==who.pinHash){errEl.hidden=false;errEl.textContent='Code incorrect pour '+(who?who.name:'cette personne')+'.';$('#vpin').value='';return}
    const now=Date.now(),recur=t.recurUnit&&t.recurUnit!=='none';
    const entry={taskId:t.id,title:t.title,cat:t.cat,priority:t.priority,assignType:t.assignType,assignId:t.assignId,by,at:now,dueAt:t.dueAt,late:now>t.dueAt,
      comment:String(fd.get('comment')||'').trim(),value:String(fd.get('value')||'').trim(),dossier:t.dossier||null};
    try{
      await DB.collection('log').add(entry);
      if(recur){let nd=t.dueAt,g=0;while(nd<=now&&g<500){nd=nextDue(nd,Number(t.recurN)||1,t.recurUnit);g++}
        await DB.collection('tasks').doc(t.id).update({dueAt:nd,lastDoneBy:by,lastDoneAt:now});}
      else await DB.collection('tasks').doc(t.id).update({done:true,doneBy:by,doneAt:now});
      for(const al of alerts.values()){if(al.id===t.id)al.ack=true}
      closeSheet();toast('Validée par '+who.name+' à '+fTime(now));
    }catch(err){dbFail(err,'verr')}
  }
});

/* bouton retour Android : ferme la fenêtre ouverte, puis revient aux tâches */
if(APP){
  APP.addListener('backButton',()=>{
    if(S.sheet){closeSheet();return}
    if(S.view!=='tasks'){S.view='tasks';render();return}
    APP.minimizeApp();
  });
  APP.addListener('appStateChange',(st)=>{if(st&&st.isActive){S.now=Date.now();checkReminders();if(!S.sheet)render()}});
}

setInterval(()=>{checkReminders();if(!S.sheet&&document.visibilityState==='visible'&&S.gotStaff&&me())render()},20000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){checkReminders();if(!S.sheet)render()}});
initDb();
setupNotifications();
})();
