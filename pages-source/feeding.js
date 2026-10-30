'use strict';
// Trusted local SVG illustrations. The existing menu owns food names, gains and dialogue.
const FOOD_ART={
 pudding:'<path d="M24 25q24-7 48 0l8 34q-31 12-64 0Z" fill="#f9dfac" stroke="#c5ac94" stroke-width="1.4"/><path d="M24 25q24-7 48 0l2 8q-8 5-14 0-8 8-15 0-11 6-23 0Z" fill="#d6a68e" stroke="#bd9987" stroke-width="1.1"/><path d="M31 37q-3 8-4 16" stroke="#fff1d0" stroke-width="3" stroke-linecap="round"/><ellipse cx="48" cy="23" rx="25" ry="6" fill="#dab09a" stroke="#bd9987" stroke-width="1.1"/><path d="M43 16q-3-10 5-10 10 1 7 11Z" fill="#fff8e8" stroke="#cfbdab" stroke-width="1"/><circle cx="50" cy="8" r="4" fill="#e7a3b0"/>',
 strawberry:'<path d="M23 28q3-17 25-12 21-6 26 12 1 20-20 34-7 5-12 0Q20 46 23 28Z" fill="#efaebb" stroke="#c59ba4" stroke-width="1.4"/><path d="m47 20-15-9 4 13-13-1 14 10 11-7 11 7 13-10-13 1 4-13Z" fill="#c2d7b3" stroke="#a7b99b" stroke-width="1.2"/><path d="m35 38 2 3m13-8 2 3m12 2-1 4m-23 6 2 3m11-4-1 3m-6 5 1 2" stroke="#fff1d5" stroke-width="2.3" stroke-linecap="round"/>',
 riceball:'<path d="M16 55Q29 24 42 13q7-6 13 0 20 22 29 43 2 9-14 10H29q-17-1-13-11Z" fill="#fffaf0" stroke="#c5b7a7" stroke-width="1.4"/><path d="M37 44q12-3 23 0l2 23H35Z" fill="#a9b8a7" stroke="#95a591" stroke-width="1.2"/><path d="m24 48 2-4m8-13 2-3m23-5 3 4m9 16 2 4m-43 7 1 3" stroke="#e6dccb" stroke-width="1.5" stroke-linecap="round"/>'
};
function foodIllustration(id){if(!FOOD_ART[id])return '';return '<svg viewBox="0 0 96 88" focusable="false" aria-hidden="true"><ellipse cx="48" cy="71" rx="42" ry="10" fill="#e1edf0" stroke="#bccbd0" stroke-width="1.2"/><ellipse cx="48" cy="70" rx="33" ry="6" fill="#fff9ed"/><g class="food-serving">'+FOOD_ART[id]+'</g></svg>';}
let feedingSession=null;
function cancelFeeding(){
 if(!feedingSession)return;for(const timer of feedingSession.timers)clearTimeout(timer);feedingSession=null;
 $('feedingTray').hidden=true;$('feedingTray').innerHTML='';$('room').classList.remove('eating','eat-open');busy=false;
 if(typeof clearExpression==='function')clearExpression();
}
function startFeeding(food){
 if(feedingSession||busy||drag||!FOOD_ART[food.id]||!awake())return false;
 clearPose();stopSinging();returnHome();busy=true;cheekTimes=[];lastActive=Date.now();
 const tray=$('feedingTray');tray.innerHTML=foodIllustration(food.id);tray.dataset.bites='0';tray.hidden=false;$('room').classList.add('eating');
 const session={food,timers:[],settled:false};feedingSession=session;say('小盘子准备好啦！豆兵要开动了～');setExpression('chew',6000);
 const reduced=typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const after=(ms,fn)=>session.timers.push(setTimeout(()=>{if(feedingSession===session)fn();},ms));
 (reduced?[250,650,1000]:[700,1500,2300]).forEach((ms,i)=>after(ms,()=>{tray.dataset.bites=String(i+1);$('room').classList.add('eat-open');after(260,()=>$('room').classList.remove('eat-open'));}));
 after(reduced?1400:3200,()=>{
  if(session.settled)return;session.settled=true;
  tray.hidden=true;tray.innerHTML='';$('room').classList.remove('eating','eat-open');feedingSession=null;busy=false;
  // Single commit after the last bite; interact retains all original clamping, rewards and storage rules.
  say(food.line);interact({fullness:food.gain,mood:3,affection:2},'food');setExpression('smug',2200);particles(['✦','♡']);lastActive=Date.now();
 });return true;
}
window.addEventListener('pagehide',cancelFeeding);
