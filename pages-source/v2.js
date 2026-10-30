'use strict';
// V2 仅扩展原来的 sohee-little-world-v1 存档，不更换键、不清空 V1 字段。
const TASKS = [
 {type:'pat',goal:3,label:'摸摸豆兵的头 3 次'}, {type:'food',goal:2,label:'分享 2 份小点心'},
 {type:'hug',goal:2,label:'和星星抱枕拥抱 2 次'}, {type:'game',goal:1,label:'完整玩一局小游戏'},
 {type:'talk',goal:3,label:'陪豆兵聊 3 次天'}, {type:'window',goal:2,label:'一起看 2 次窗外'}
];
const STICKERS = [
 {id:'hello',icon:'♡',name:'第一次心动',hint:'摸摸头 1 次',type:'pat',goal:1},
 {id:'soft',icon:'☁',name:'温柔的手心',hint:'摸摸头 10 次',type:'pat',goal:10},
 {id:'blush',icon:'🌸',name:'脸红小豆',hint:'戳脸颊 3 次',type:'cheek',goal:3},
 {id:'puff',icon:'💭',name:'气鼓鼓也可爱',hint:'连续戳脸颊 3 次',type:'puff',goal:1},
 {id:'laugh',icon:'☀',name:'咯咯笑',hint:'挠肚子 3 次',type:'belly',goal:3},
 {id:'hug',icon:'⭐',name:'抱抱收藏家',hint:'抱星星抱枕 3 次',type:'hug',goal:3},
 {id:'snack',icon:'🍮',name:'点心时间',hint:'喂食 3 次',type:'food',goal:3},
 {id:'sing',icon:'♫',name:'小屋歌手',hint:'唱歌 3 次',type:'sing',goal:3},
 {id:'dress',icon:'🎀',name:'今日穿搭',hint:'换装 3 次',type:'dress',goal:3},
 {id:'sky',icon:'☾',name:'窗外旅行',hint:'切换窗景 3 次',type:'window',goal:3},
 {id:'star',icon:'⭐',name:'接星小能手',hint:'累计接住 10 颗星',type:'catches',goal:10},
 {id:'beat',icon:'🎵',name:'心有小节拍',hint:'累计命中 8 个音符',type:'beats',goal:8}
];
const safeCount = n => Number.isSafeInteger(n) && n >= 0 ? n : 0;
function initV2(){
 state.version=Number.isSafeInteger(state.version)&&state.version>2?state.version:2;state.stars=safeCount(state.stars);
 state.stickers=Array.isArray(state.stickers)?[...new Set(state.stickers.filter(id=>STICKERS.some(s=>s.id===id)))]:[];
 const memories=state.memories && typeof state.memories==='object'&&!Array.isArray(state.memories)?state.memories:{};
 state.memories={...memories};for(const type of new Set([...STICKERS.map(s=>s.type),'game','drag','sleep','talk']))state.memories[type]=safeCount(memories[type]);
 state.weather=['sunny','rainy','night'].includes(state.weather)?state.weather:'sunny';
 ensureTask();save();renderV2();
}
function ensureTask(){
 const t=state.task;const def=t&&TASKS.find(d=>d.type===t.type);
 if(!t||t.date!==localDate()||!def){const d=TASKS[Math.floor(Math.random()*TASKS.length)];state.task={date:localDate(),type:d.type,progress:0,claimed:false};return;}
 t.progress=Math.min(def.goal,safeCount(t.progress));t.claimed=t.claimed===true;
}
function recordV2(kind){
 ensureTask();state.memories[kind]=Math.min(Number.MAX_SAFE_INTEGER,safeCount(state.memories[kind])+1);
 const task=TASKS.find(d=>d.type===state.task.type);
 if(!state.task.claimed&&kind===state.task.type){state.task.progress=Math.min(task.goal,state.task.progress+1);if(state.task.progress===task.goal){state.task.claimed=true;state.stars+=8;notice('每日小心愿完成！收下 8 颗星星 ✦');}}
 unlockStickers();
}
function unlockStickers(){const added=[];for(const s of STICKERS){if(!state.stickers.includes(s.id)&&safeCount(state.memories[s.type])>=s.goal){state.stickers.push(s.id);added.push(s.name);}}if(added.length)notice(`新贴纸：${added.join('、')} ♡`);}
function notice(text){$('v2Notice').textContent=text;}
function renderV2(){
 $('starWallet').textContent=`✦ ${state.stars} 星星`;
 const def=TASKS.find(d=>d.type===state.task.type);
 $('taskText').textContent=`今日小心愿 · ${def.label}`;
 $('taskProgress').textContent=state.task.claimed?'✓ 已获得 8 星星':`${state.task.progress}/${def.goal} · 奖励 8 ✦`;
 $('stickerCount').textContent=`${state.stickers.length} / ${STICKERS.length}`;
 $('stickerAlbum').replaceChildren(...STICKERS.map(s=>{const b=document.createElement('button');const owned=state.stickers.includes(s.id);b.className='sticker'+(owned?' unlocked':'');b.setAttribute('aria-label',`${s.name}：${owned?'已解锁':s.hint}`);const icon=document.createElement('span');icon.textContent=owned?s.icon:'?';const label=document.createElement('small');label.textContent=s.name;b.append(icon,label);b.addEventListener('click',()=>openDialog(`${owned?s.icon:'✧'} ${s.name}`,`${owned?'这枚贴纸，纪念我们一起度过的小瞬间。':'还没收集到，慢慢来就好。'}\n解锁方式：${s.hint}\n当前进度：${Math.min(s.goal,state.memories[s.type]||0)}/${s.goal}`));return b;}));
 const sky={sunny:['☀','晴天'],rainy:['☂','雨天'],night:['☾','夜晚']}[state.weather];
 $('window').dataset.weather=state.weather;$('skySymbol').textContent=sky[0];$('window').setAttribute('aria-label',`窗户：当前${sky[1]}，点击切换天气`);if(typeof syncRoomTime==='function')syncRoomTime();
}

// 动画状态独立于存档：不会把暂时的害羞、拖动或小游戏计时保存进去。
let poseTimer,walkTimer,idleTimer,lastActive=Date.now(),busy=false,drag=null,cheekTimes=[];
let suppressClick=false;
const POSES=['head-love','shy','laughing','pouting','hugging','idle-blink','idle-yawn','idle-look','idle-smirk','idle-stare','idle-brow'];
function clearPose(){clearTimeout(poseTimer);$('room').classList.remove(...POSES);if(typeof clearExpression==='function')clearExpression();}
function pose(name,duration=2000){clearPose();stopSinging();$('room').classList.add(name);if(typeof expressionForPose==='function')expressionForPose(name,duration);poseTimer=setTimeout(()=>{$('room').classList.remove(name);},duration);}
function positionPet(x=0,y=0){$('pet').style.setProperty('--move-x',`${x}px`);$('pet').style.setProperty('--move-y',`${y}px`);}
function returnHome(){clearTimeout(walkTimer);busy=false;$('room').classList.remove('walking','at-bed','sitting');if($('sitToggle'))$('sitToggle').textContent='坐一会儿';positionPet();}
function canTouch(){return !busy && awake();}
actions.pat=function(){if(!canTouch())return;cheekTimes=[];pose('head-love');say('嘿嘿，歪着脑袋接住你的温柔 ♡');particles(['♡','♥','✦']);interact({affection:3,mood:5},'pat');};
function touchCheek(){
 if(!canTouch())return;const now=Date.now();cheekTimes=cheekTimes.filter(t=>now-t<2400);cheekTimes.push(now);
 if(cheekTimes.length>=3){cheekTimes=[];pose('pouting',2600);say('哼唧！脸蛋要被你戳成小汤圆啦！');particles(['💭','!']);recordV2('puff');}
 else{pose('shy',1900);say('哎呀……脸颊热乎乎的！');particles(['♡','✿']);}
 interact({affection:2,mood:3},'cheek');
}
function touchBelly(){if(!canTouch())return;cheekTimes=[];pose('laughing');say('哈哈哈！这里藏着豆兵的痒痒开关！');particles(['ha','♪','✦']);interact({affection:2,mood:5},'belly');}
const originalSleep=actions.sleep;
actions.sleep=function(){if(busy)return;cheekTimes=[];clearPose();if(sleeping)returnHome();originalSleep();};
const originalSing=actions.sing;
actions.sing=function(){if(busy)return;cheekTimes=[];clearPose();originalSing();};
for(const key of ['food','dress','talk']){const original=actions[key];actions[key]=function(){if(busy)return;cheekTimes=[];clearPose();original();};}
function visit(target,kind){
 if(busy)return;if(sleeping){if(kind==='bed')actions.sleep();else awake();return;}
 clearPose();stopSinging();busy=true;cheekTimes=[];
 const room=$('room').getBoundingClientRect(),pet=$('pet').getBoundingClientRect(),item=target.getBoundingClientRect();
 const dest=Math.max(room.left+pet.width/2,Math.min(room.right-pet.width/2,item.left+item.width/2));
 positionPet(dest-(pet.left+pet.width/2),kind==='bed'?-15:0);$('room').classList.add('walking');say(kind==='bed'?'小被窝，我来啦～':'星星抱枕，给我一个抱抱！');
 walkTimer=setTimeout(()=>{
  $('room').classList.remove('walking');busy=false;
  if(kind==='bed'){$('room').classList.add('at-bed');originalSleep();}
  else{pose('hugging',3000);$('starPlush').classList.add('being-hugged');setTimeout(()=>$('starPlush').classList.remove('being-hugged'),3000);particles(['♡','♡','✦']);say('抱紧紧！这是本明星专属的星星抱枕，今天分你一点星光。');interact({affection:3,mood:5},'hug');walkTimer=setTimeout(returnHome,3000);}
 },850);
}
$('bed').addEventListener('click',()=>visit($('bed'),'bed'));
$('starPlush').addEventListener('click',()=>visit($('starPlush'),'starPlush'));
$('window').addEventListener('click',()=>{cheekTimes=[];const skies=['sunny','rainy','night'];state.weather=skies[(skies.indexOf(state.weather)+1)%3];say({sunny:'阳光在窗台上，晒出一颗小甜豆。',rainy:'滴答滴答，雨也在给我们唱歌呢。',night:'月亮上班啦，一起悄悄许个愿吧。'}[state.weather]);interact({mood:2},'window');});
document.querySelectorAll('[data-part]').forEach(b=>b.addEventListener('click',()=>b.dataset.part==='cheek'?touchCheek():touchBelly()));

function petPart(event){const point=$('character').createSVGPoint();point.x=event.clientX;point.y=event.clientY;const matrix=$('character').getScreenCTM();const p=matrix?point.matrixTransform(matrix.inverse()):{y:100};return p.y<163?'head':p.y<235?'cheek':'belly';}
$('pet').addEventListener('pointerdown',e=>{
 if(e.button!==0||!canTouch()||drag)return;clearTimeout(walkTimer);returnHome();
 drag={id:e.pointerId,x:e.clientX,y:e.clientY,part:petPart(e),moved:false};$('pet').setPointerCapture(e.pointerId);e.preventDefault();
});
$('pet').addEventListener('pointermove',e=>{
 if(!drag||e.pointerId!==drag.id)return;
 const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>8)drag.moved=true;
 if(drag.moved){clearPose();stopSinging();$('pet').classList.add('dragging');const room=$('room').getBoundingClientRect();const w=$('pet').offsetWidth,h=$('pet').offsetHeight;positionPet(Math.max(-(room.width-w)/2,Math.min((room.width-w)/2,dx)),Math.max(-(room.height-h-30),Math.min(25,dy)));}
});
function releasePet(e,cancelled=false){
 if(!drag||e.pointerId!==drag.id)return;const current=drag;drag=null;suppressClick=true;setTimeout(()=>suppressClick=false,0);$('pet').classList.remove('dragging');positionPet();if($('pet').hasPointerCapture(e.pointerId))$('pet').releasePointerCapture(e.pointerId);
 if(cancelled)return;if(current.moved){cheekTimes=[];pose('head-love',1300);particles(['♡','✦']);say('飞起来啦～稳稳回到你身边！');interact({affection:2,mood:3},'drag');}
 else if(current.part==='head')actions.pat();else if(current.part==='cheek')touchCheek();else touchBelly();
}
$('pet').addEventListener('pointerup',e=>releasePet(e));$('pet').addEventListener('pointercancel',e=>releasePet(e,true));$('pet').addEventListener('lostpointercapture',e=>releasePet(e,true));
$('pet').addEventListener('click',e=>{if(e.detail===0&&!suppressClick)actions.pat();});
function scheduleIdle(){clearTimeout(idleTimer);idleTimer=setTimeout(()=>{
 if(!(typeof roomHasDialog==='function'&&roomHasDialog())&&!document.hidden&&!sleeping&&!busy&&!drag&&!game&&Date.now()-lastActive>8000&&!$('choiceDialog').open&&!$('miniDialog').open&&!document.getElementById('wardrobeDialog')?.open){const types=['idle-blink','idle-yawn','idle-look','idle-smirk','idle-stare','idle-brow'];const type=types[Math.floor(Math.random()*types.length)];pose(type,type==='idle-blink'?350:2600);}
 scheduleIdle();},9000+Math.random()*6000);}
document.addEventListener('pointerdown',()=>lastActive=Date.now());document.addEventListener('keydown',()=>lastActive=Date.now());

// 小游戏：同一个动画循环管理时间和暂停，结束后只结算一次。
let game=null,frameId=0;
function openMini(mode){
 if(!canTouch())return;clearPose();returnHome();stopSinging();
 $('miniTitle').textContent=mode==='catch'?'✦ 接住小星星':'♫ 心动小节拍';
 $('miniHelp').textContent=mode==='catch'?'30 秒内接住星星！在场地内移动鼠标、触屏拖动，或按 ← → / A D。每接住一颗奖励 1 星星。':'音符到达粉色判定线时，点击大按钮或按空格。共 12 个音符，每次命中奖励 2 星星。';
 $('miniStage').dataset.mode=mode;$('miniStage').className='outfit-'+state.outfit;$('fallingStars').replaceChildren();$('catcher').replaceChildren();
 const clone=$('character').cloneNode(true);clone.removeAttribute('id');clone.dataset.motion='preview';clone.dataset.motionPaused='false';if(typeof syncWingPose==='function')syncWingPose(clone);clone.setAttribute('aria-hidden','true');$('catcher').append(clone);
 $('miniOverlay').textContent='准备好和豆兵一起玩吗？';$('miniOverlay').hidden=false;$('miniFeedback').textContent='随时可以暂停。关闭未完成的游戏不会扣除星星。';$('miniTime').textContent=mode==='catch'?'30 秒':'12 个节拍';$('miniScore').textContent='命中 0';$('startMini').textContent='开始游戏';$('startMini').disabled=false;$('pauseMini').disabled=true;$('pauseMini').textContent='暂停';
 $('beatNote').style.transform='translateX(0px)';$('beatNote').hidden=true;game={mode,phase:'ready',elapsed:0,score:0,last:null,stars:[],nextSpawn:.3,x:.5,keys:new Set(),beat:0,judged:false};$('catcher').style.left='50%';$('miniDialog').showModal();
}
function startMini(){if(!game)return;if(game.phase==='ended'){const mode=game.mode;game={mode,phase:'ready',elapsed:0,score:0,last:null,stars:[],nextSpawn:.3,x:.5,keys:new Set(),beat:0,judged:false};$('fallingStars').replaceChildren();$('catcher').style.left='50%';}
 if(game.phase!=='ready')return;game.phase='running';game.last=null;$('miniOverlay').hidden=true;$('startMini').disabled=true;$('pauseMini').disabled=false;$('miniFeedback').textContent='开始啦！';$('miniStage').focus();frameId=requestAnimationFrame(tickMini);}
function pauseMini(){if(!game||!['running','paused'].includes(game.phase))return;const pausing=game.phase==='running';game.phase=pausing?'paused':'running';game.last=null;game.keys.clear();cancelAnimationFrame(frameId);$('pauseMini').textContent=pausing?'继续':'暂停';$('miniOverlay').hidden=!pausing;$('miniOverlay').textContent='暂停中 · 豆兵在等你';if(!pausing)frameId=requestAnimationFrame(tickMini);}
function finishMini(){
 if(!game||game.phase!=='running')return;game.phase='ended';cancelAnimationFrame(frameId);game.keys.clear();
 const reward=game.score*(game.mode==='catch'?1:2);state.stars+=reward;
 const key=game.mode==='catch'?'catches':'beats';state.memories[key]=safeCount(state.memories[key])+game.score;
 interact({mood:4,affection:2},'game');
 $('miniOverlay').textContent=`完成！命中 ${game.score} 次 · 获得 ${reward} ✦`;$('miniOverlay').hidden=false;$('miniFeedback').textContent='奖励已经存入星星口袋。每次练习，都是可爱的回忆。';$('miniTime').textContent='本局结束';$('miniScore').textContent=`命中 ${game.score}`;$('startMini').textContent='再玩一次';$('startMini').disabled=false;$('pauseMini').disabled=true;
}
function closeMini(){cancelAnimationFrame(frameId);game=null;$('miniDialog').close();lastActive=Date.now();}
function tickMini(timestamp){
 if(!game||game.phase!=='running')return;
 const dt=game.last===null?0:Math.max(0,Math.min(.1,(timestamp-game.last)/1000));game.last=timestamp;game.elapsed+=dt;
 if(game.mode==='catch'){
  if(game.keys.has('ArrowLeft')||game.keys.has('a'))game.x-=dt*.85;if(game.keys.has('ArrowRight')||game.keys.has('d'))game.x+=dt*.85;game.x=Math.max(.08,Math.min(.92,game.x));$('catcher').style.left=`${game.x*100}%`;
  if(game.elapsed>=game.nextSpawn){game.nextSpawn+=.7;const node=document.createElement('span');node.className='fall-star';node.textContent='✦';const x=.08+Math.random()*.84;node.style.left=`${x*100}%`;$('fallingStars').append(node);game.stars.push({x,y:-.08,node});}
  for(const star of game.stars){const old=star.y;star.y+=dt*.32;star.node.style.top=`${star.y*100}%`;if(old<=.85&&star.y>=.82&&Math.abs(star.x-game.x)<.105){game.score++;star.dead=true;star.node.remove();$('miniFeedback').textContent='接住啦！✦';}else if(star.y>1.05){star.dead=true;star.node.remove();}}
  game.stars=game.stars.filter(s=>!s.dead);$('miniTime').textContent=`${Math.max(0,Math.ceil(30-game.elapsed))} 秒`;
  if(game.elapsed>=30){finishMini();return;}
 }else{
  const beat=Math.floor(game.elapsed/1.5);if(beat>=12){finishMini();return;}if(beat!==game.beat){game.beat=beat;game.judged=false;}
  const phase=game.elapsed%1.5;const width=$('rhythmTrack').clientWidth;
  $('beatNote').hidden=game.judged;$('beatNote').style.transform=`translateX(${(width-34)*Math.min(1,phase/1.3)}px)`;
  $('beatButton').classList.toggle('on-beat',Math.abs(phase-1.05)<=.22);$('miniTime').textContent=`第 ${beat+1} / 12 拍`;
 }
 $('miniScore').textContent=`命中 ${game.score}`;frameId=requestAnimationFrame(tickMini);
}
function hitBeat(){if(!game||game.mode!=='rhythm'||game.phase!=='running'||game.judged)return;const phase=game.elapsed%1.5;game.judged=true;const hit=Math.abs(phase-1.05)<=.22;if(hit)game.score++;$('miniFeedback').textContent=hit?'Perfect ♫ 接住这个节拍！':'差一点点～等音符到粉线再点';$('beatNote').hidden=true;$('miniScore').textContent=`命中 ${game.score}`;$('beatButton').classList.toggle('hit-flash',hit);setTimeout(()=>$('beatButton').classList.remove('hit-flash'),180);}
function moveCatcher(e){if(!game||game.mode!=='catch'||game.phase!=='running')return;const r=$('miniStage').getBoundingClientRect();game.x=Math.max(.08,Math.min(.92,(e.clientX-r.left)/r.width));$('catcher').style.left=`${game.x*100}%`;}
$('miniStage').addEventListener('pointerdown',e=>{if(game?.mode==='catch'&&game.phase==='running'){$('miniStage').setPointerCapture(e.pointerId);moveCatcher(e);e.preventDefault();}});
$('miniStage').addEventListener('pointermove',moveCatcher);
$('miniDialog').addEventListener('keydown',e=>{if(!game)return;const key=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowLeft','ArrowRight','a','d'].includes(key)&&game.mode==='catch'){e.preventDefault();game.keys.add(key);}if(e.code==='Space'&&game.mode==='rhythm'&&game.phase==='running'&&![ $('pauseMini'),$('closeMini'),$('startMini') ].includes(document.activeElement)){e.preventDefault();if(!e.repeat)hitBeat();}});
$('miniDialog').addEventListener('keyup',e=>{if(game)game.keys.delete(e.key.length===1?e.key.toLowerCase():e.key);});
$('catchGame').addEventListener('click',()=>openMini('catch'));$('rhythmGame').addEventListener('click',()=>openMini('rhythm'));$('startMini').addEventListener('click',startMini);$('pauseMini').addEventListener('click',pauseMini);$('beatButton').addEventListener('click',hitBeat);$('closeMini').addEventListener('click',closeMini);$('miniDialog').addEventListener('cancel',e=>{e.preventDefault();closeMini();});$('miniDialog').addEventListener('close',()=>{cancelAnimationFrame(frameId);game=null;});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(game?.phase==='running')pauseMini();if(drag)releasePet({pointerId:drag.id},true);}else{ensureTask();save();renderV2();lastActive=Date.now();}});
window.addEventListener('blur',()=>{if(game?.phase==='running')pauseMini();});
window.addEventListener('resize',()=>{if(!drag)returnHome();});
// 每分钟检查自然日切换，不触发签到或奖励。
setInterval(()=>{if(!document.hidden&&state.task.date!==localDate()){ensureTask();save();renderV2();}},60000);
initV2();scheduleIdle();
