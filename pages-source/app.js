'use strict';
// 在这里添加新的随机互动台词，每句用引号包裹并以逗号分隔。
const DIALOGUES = [
 '今天也辛苦啦！','陪我玩一会儿嘛～','今天有没有想豆兵？','啵啵！','我今天超级开心！',
 '给你留了最软的那块地毯。','小小的我，也有大大的拥抱！','你一来，小屋就亮起来啦。','要不要一起发一会儿呆？','把烦恼交给我的高帽子吧！',
 '今天的云像一块小饼干。','慢慢来，你已经很棒啦。','听说笑一下，好运就会靠近哦。','偷偷告诉你：我最喜欢你来啦！','给你一颗口袋里的小星星。',
 '不必每天都很厉害，开心一点就好。','一起把今天变成软乎乎的一天吧！','我在练习一首只唱给你的小曲。','这顶帽子装得下好多好多想念。','你在这里，就是特别的日子。',
 '今天想吃甜甜的布丁！','小屋里永远有你的位置。','我们一起数星星吧～','外面的世界很大，回这里歇一歇。'
];
const SAVE_KEY = 'sohee-little-world-v1';
const DEFAULT = {affection:20,mood:80,fullness:65,outfit:'classic',totalDays:0,streak:0,lastInteractionDate:null,unlockedLetter:false};
function validDate(s){return typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s+'T12:00:00'));}
let saveReadIssue=false; // If original storage cannot be read, never overwrite it with defaults.
function loadState(){try{const raw=JSON.parse(localStorage.getItem(SAVE_KEY));if(raw===null)return {...DEFAULT};if(typeof raw!=='object'||Array.isArray(raw)){saveReadIssue=true;return {...DEFAULT};}const s={...raw,...DEFAULT};for(const key of ['affection','mood','fullness'])if(Number.isFinite(raw[key]))s[key]=Math.max(0,Math.min(100,raw[key]));for(const key of ['totalDays','streak'])if(Number.isInteger(raw[key])&&raw[key]>=0)s[key]=raw[key];if(['classic','pajamas','casual','stage','sleepy','sohee-pajamas','berry-zip','midnight-jersey','lemon-flight','maid','piggy','i-love-sh'].includes(raw.outfit))s.outfit=raw.outfit;s.lastInteractionDate=validDate(raw.lastInteractionDate)?raw.lastInteractionDate:null;s.unlockedLetter=raw.unlockedLetter===true;
// V2 字段先原样带过，v2.js 初始化时再校验，避免 V1 启动保存丢失新进度。
for(const key of ['stars','stickers','task','weather','memories','version','hat'])if(Object.prototype.hasOwnProperty.call(raw,key))s[key]=raw[key];
return s;}catch{saveReadIssue=true;return {...DEFAULT};}}
let state=loadState();let sleeping=false;let singTimer;let saveFailed=false;
const $=id=>document.getElementById(id);
function localDate(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function previousDate(){const d=new Date();d.setDate(d.getDate()-1);return localDate(d);}
function activeStreak(){return [localDate(),previousDate()].includes(state.lastInteractionDate)?state.streak:0;}
function save(){if(saveReadIssue){saveFailed=true;$('saveStatus').textContent='原存档暂时无法读取，已暂停写入以保护数据';return false;}try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));saveFailed=false;$('saveStatus').textContent='✓ 已保存在这个浏览器';}catch{saveFailed=true;$('saveStatus').textContent='暂时无法存档，请允许浏览器本地存储';}}
function render(){for(const key of ['affection','mood','fullness']){$(key).value=state[key];$(key+'Text').textContent=state[key];}$('room').classList.remove('outfit-classic','outfit-pajamas','outfit-casual','outfit-stage','outfit-sleepy','outfit-sohee-pajamas','outfit-berry-zip','outfit-midnight-jersey','outfit-lemon-flight','outfit-maid','outfit-piggy','outfit-i-love-sh');$('room').classList.add('outfit-'+(['pajamas','casual'].includes(state.outfit)?'classic':state.outfit));$('status').textContent=sleeping?'嘘，正在做甜甜的梦':state.mood>=85?'正在幸福地冒泡泡 ♡':'今天也一起慢慢来';$('sleepLabel').textContent=sleeping?'叫醒豆兵':'睡觉';$('room').classList.toggle('sleeping',sleeping);if(typeof applyCharacterLook==='function')applyCharacterLook($('character'),state.outfit,sleeping);const streak=activeStreak();$('days').replaceChildren(...Array.from({length:7},(_,i)=>{const el=document.createElement('span');el.className='day'+(i<Math.min(streak,7)?' done':'');el.textContent=i<Math.min(streak,7)?'♡':String(i+1).padStart(2,'0');return el;}));$('daySummary').textContent=`累计 ${state.totalDays} 天 · 连续 ${streak} 天`;$('letter').textContent=state.unlockedLetter?'✉ 豆兵的信 · 点击阅读':'✉ 神秘来信 · 7 日解锁';}
function say(line){$('speech').textContent=line;}
function particles(symbols){for(let i=0;i<6;i++){const el=document.createElement('span');el.className='effect';el.textContent=symbols[i%symbols.length];el.style.setProperty('--dx',`${(i-2.5)*30}px`);el.style.marginLeft=`${(i-2.5)*12}px`;el.style.animationDelay=`${i*.07}s`;$('effects').append(el);setTimeout(()=>el.remove(),2400);}}
function interact(delta,kind='pat'){let unlockedNow=false;const today=localDate();if(state.lastInteractionDate!==today){state.streak=state.lastInteractionDate===previousDate()?state.streak+1:1;state.totalDays++;state.lastInteractionDate=today;}for(const [key,value]of Object.entries(delta))state[key]=Math.max(0,Math.min(100,state[key]+value));if(state.streak>=7&&!state.unlockedLetter){state.unlockedLetter=true;unlockedNow=true;}if(typeof recordV2==='function')recordV2(kind);if(typeof expressionInteraction==='function')expressionInteraction(kind);if(typeof noteDiaryEvent==='function')noteDiaryEvent(kind);save();render();if(typeof renderV2==='function')renderV2();if(unlockedNow){particles(['✉','♡','✦']);setTimeout(()=>{say('叮！有一封偷偷写给你的信，快去看看吧 ♡');},1000);}}
function stopSinging(){clearTimeout(singTimer);$('room').classList.remove('singing');}
function awake(){if(!sleeping)return true;say('豆兵正在梦里旅行，先点「叫醒豆兵」吧 ☾');return false;}
function openDialog(title,hint,options=[]){$('dialogTitle').textContent=title;$('dialogHint').textContent=hint;$('choices').replaceChildren(...options.map(item=>{const b=document.createElement('button');if(item.art){b.classList.add('food-choice');const art=document.createElement('span');art.className='food-choice-art';art.innerHTML=item.art;const label=document.createElement('span');label.textContent=item.label;b.append(art,label);}else b.textContent=item.label;if(item.selected)b.className='selected';b.addEventListener('click',()=>{$('choiceDialog').close();item.run();});return b;}));$('choiceDialog').showModal();}
const actions={
 pat(){if(!awake())return;say('嘿嘿，帽子下面也感受到你的温柔啦！');particles(['♡','♥','✦']);interact({affection:3,mood:5});},
 food(){if(!awake())return;openDialog('今天吃点什么？','小小一份，也是满满的心意。',[{id:'pudding',label:'🍮 焦糖布丁 +18',gain:18,line:'布丁晃呀晃，幸福也晃呀晃～'},{id:'strawberry',label:'🍓 草莓 +12',gain:12,line:'酸酸甜甜，是今天的好心情！'},{id:'riceball',label:'🍙 小饭团 +25',gain:25,line:'啊呜！饭团里藏着你的关心。'}].map(f=>({label:f.label,art:typeof foodIllustration==='function'?foodIllustration(f.id):'',run(){if(typeof startFeeding==='function'){startFeeding(f);return;}say(f.line);particles(['✦','♡']);interact({fullness:f.gain,mood:3,affection:2},'food');}})));},
 sleep(){stopSinging();sleeping=!sleeping;say(sleeping?'晚安，陪我做一个棉花糖的梦吧。':'睡饱啦！又可以陪你玩了 ♡');interact({mood:3,affection:1},'sleep');},
 sing(){if(!awake())return;stopSinging();$('room').classList.add('singing');say('啦啦啦～这首小曲，送给特别的你！');particles(['♪','♫','♬']);interact({mood:6,affection:2},'sing');singTimer=setTimeout(stopSinging,4500);},
 dress(){if(!awake())return;openDialog('豆兵的小衣橱','今天也要穿得可可爱爱。',[['classic','♥ 经典红制服'],['sohee-pajamas','☾ 蓝白条纹睡衣']].map(([outfit,label])=>({label,selected:state.outfit===outfit,run(){state.outfit=outfit;say('换好啦！今天的豆兵也请多关照。');particles(['✦','♡']);interact({affection:1,mood:2},'dress');}})));},
 talk(){if(!awake())return;say(DIALOGUES[Math.floor(Math.random()*DIALOGUES.length)]);interact({affection:2,mood:2},'talk');}
};
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>actions[b.dataset.action]()));
$('letter').addEventListener('click',()=>{if(!state.unlockedLetter){openDialog('一封正在路上的信','连续 7 个不同自然日来和豆兵互动，就能拆开这封信。\n今天摸摸头、喂食、聊天或换装，都算一次陪伴。\n不来也不会扣数值，累计陪伴天数会一直保留。');return;}openDialog('致最特别的你 ♡','嘿，是我，豆兵！\n\n你每次推开小屋的门，我的世界就会多一颗小星星。谢谢你这七天的陪伴，让普通的日子也变得亮晶晶。\n\n希望你记得：不需要一直努力，也不需要一直开心。累的时候，就来这里坐一坐。我把最软的枕头、最好吃的布丁，还有一个大大的拥抱，都留给你。\n\n就算忙起来，很久不来，也没有关系。你再出现的那天，我只会说：你来啦！\n\n今天、明天，都愿你被温柔包围。\n\n你的豆兵 敬上 ✦');});
document.querySelector('.close').addEventListener('click',()=>$('choiceDialog').close());$('choiceDialog').addEventListener('click',e=>{if(e.target===$('choiceDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});render();save();
