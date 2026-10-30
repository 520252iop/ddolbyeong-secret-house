'use strict';
let gachaSession=null,gachaBlockedMessage='';
const GACHA_RARITY_NAMES={common:'普通',rare:'稀有',special:'特别'};
function gachaOwnedCount(item){const value=state.phase2?.gachaInventory?.[item.id];return phase2Object(value)&&Number.isSafeInteger(value.count)&&value.count>=0?value.count:0;}
function gachaDailyStatus(){
 const today=phase2Date(localDate());
 if(saveReadIssue||state.phase2?.schemaVersion!==PHASE2_SCHEMA_VERSION)return {available:false,message:'当前存档暂时只读，可以翻阅已有收藏。'};
 if(saveFailed)return {available:false,message:'存档尚未成功，请先检查浏览器存储权限或剩余空间。'};
 if(gachaBlockedMessage)return {available:false,message:gachaBlockedMessage};
 if(!today)return {available:false,message:'设备日期暂时无法识别，请检查时间设置。'};
 const dates=[state.phase2.gachaLastFreeDate,...GACHA_ITEMS.map(item=>state.phase2.gachaInventory[item.id]?.lastDate)].filter(date=>phase2Date(date));const latest=dates.sort().at(-1);
 if(latest&&latest>=today)return {available:false,message:latest>today?'设备日期早于已有抽取记录，先检查时间，再来收集小惊喜。':'今天的小惊喜已经收好啦，明天还有一颗免费扭蛋。'};
 return {available:true,message:'今天有 1 次免费机会。转一转，收好一颗小星光。'};
}
function chooseGachaItem(){const roll=Math.random();const rarity=roll<.7?'common':roll<.95?'rare':'special';const pool=GACHA_ITEMS.filter(item=>item.rarity===rarity);return pool[Math.floor(Math.random()*pool.length)];}
function renderGachaResult(item,already=false){
 const box=$('gachaResult');box.replaceChildren();if(!item)return;
 const icon=document.createElement('span');icon.className='gacha-result-art';icon.innerHTML=gachaIcon(item);
 const name=document.createElement('b');name.textContent=item.name;
 const hint=document.createElement('small');hint.textContent=`${already?'今天已收好':'收到啦'} · ${GACHA_RARITY_NAMES[item.rarity]} · 现有 ${gachaOwnedCount(item)} 件`;
 box.append(icon,name,hint);
}
function renderGacha(){
 const inventory=state.phase2?.gachaInventory||{};let owned=0,total=0;
 $('gachaGrid').replaceChildren(...GACHA_ITEMS.map(item=>{
  const count=gachaOwnedCount(item),record=inventory[item.id];if(count){owned++;total+=count;}
  const card=document.createElement('article');card.className='gacha-item'+(count?'':' gacha-locked');card.dataset.rarity=item.rarity;
  const icon=document.createElement('span');icon.className='gacha-icon';icon.innerHTML=gachaIcon(item);
  const name=document.createElement('b');name.textContent=count?item.name:'神秘小物';
  const info=document.createElement('small');info.textContent=count?`${GACHA_RARITY_NAMES[item.rarity]} · ×${count}\n首次 ${phase2Date(record.firstDate)||'日期未记录'}\n最近 ${phase2Date(record.lastDate)||'日期未记录'}`:`${GACHA_RARITY_NAMES[item.rarity]} · 尚未解锁`;
  card.setAttribute('aria-label',count?item.name+'，'+info.textContent:'尚未解锁的'+GACHA_RARITY_NAMES[item.rarity]+'收藏');card.append(icon,name,info);return card;
 }));
 $('gachaProgress').textContent=`${owned} / ${GACHA_ITEMS.length} 种 · 共 ${total} 件`;
 const status=gachaDailyStatus();$('drawGacha').disabled=Boolean(gachaSession)||!status.available;$('drawGacha').textContent=gachaSession?'小扭蛋正在转动…':status.available?'转一转 · 今日免费':'今天先收好收藏册';
 $('gachaStatus').textContent=gachaSession?'咔哒——星光正在赶来。':status.message;
 if(!gachaSession){const today=localDate();const item=GACHA_ITEMS.find(item=>gachaOwnedCount(item)>0&&inventory[item.id].lastDate===today);renderGachaResult(item,true);}
}
function failGacha(session,message){if(gachaSession!==session)return false;gachaSession=null;$('gachaMachine').classList.remove('is-turning');renderGacha();$('gachaStatus').textContent=message;return false;}
function commitGachaDraw(session){
 if(gachaSession!==session)return false;
 const status=gachaDailyStatus();if(!status.available)return failGacha(session,status.message);
 // Read just before committing. Never overwrite a newer save from another tab/window.
 try{
  const raw=localStorage.getItem(SAVE_KEY),saved=JSON.parse(raw);
  if(!phase2Object(saved))return failGacha(session,'暂时读不到原存档，本次没有扣除免费机会。');
  if(saved.phase2?.gachaLastFreeDate&&saved.phase2.gachaLastFreeDate>=localDate()){gachaBlockedMessage='这次机会已在另一个页面领取，请刷新小屋查看收藏。';return failGacha(session,gachaBlockedMessage);}
  if(JSON.stringify(saved)!==JSON.stringify(state)){gachaBlockedMessage='另一个页面更新了存档，请刷新小屋后再抽取，避免覆盖进度。';return failGacha(session,gachaBlockedMessage);}
 }catch{return failGacha(session,'存档读取失败，本次没有扣除免费机会。');}
 const item=chooseGachaItem(),data=state.phase2,today=localDate(),oldRecord=data.gachaInventory[item.id];
 if(oldRecord!==undefined&&(!phase2Object(oldRecord)||!Number.isSafeInteger(oldRecord.count)||oldRecord.count<0))return failGacha(session,'这件收藏的旧记录需要检查，本次先保留原数据和免费机会。');
 if(oldRecord?.count===Number.MAX_SAFE_INTEGER)return failGacha(session,'这件收藏已达到数量上限，本次保留免费机会。');
 const previousInventory=data.gachaInventory,previousDate=data.gachaLastFreeDate,previousStickers=data.unlockedStickers;
 data.gachaInventory={...previousInventory,[item.id]:{...oldRecord,count:(oldRecord?.count||0)+1,firstDate:phase2Date(oldRecord?.firstDate)||today,lastDate:today}};
 data.gachaLastFreeDate=today;data.unlockedStickers=item.photoSticker?[...new Set([...previousStickers,item.id])]:previousStickers;
 save();
 if(saveFailed){data.gachaInventory=previousInventory;data.gachaLastFreeDate=previousDate;data.unlockedStickers=previousStickers;return failGacha(session,'这次没有保存成功，未领取物品、也未扣除免费机会。请检查存储空间。');}
 // Save first: closing/refreshing during the animation cannot grant a second capsule.
 $('gachaMachine').classList.add('is-turning');$('gachaResult').replaceChildren();renderGacha();
 const reduced=typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 session.timer=setTimeout(()=>{if(gachaSession!==session)return;gachaSession=null;$('gachaMachine').classList.remove('is-turning');renderGacha();renderGachaResult(item);$('gachaStatus').textContent='收好啦！重复的小物也会认真记在收藏册里。';},reduced?250:1400);
 return true;
}
function drawDailyGacha(){
 if(gachaSession||!gachaDailyStatus().available){renderGacha();return false;}
 const session={};gachaSession=session;renderGacha();
 // Web Locks serialize draws across tabs when supported. The fallback detects stale saves,
 // but localStorage alone cannot provide an atomic transaction across simultaneous tabs.
 if(typeof navigator!=='undefined'&&navigator.locks&&typeof navigator.locks.request==='function')return navigator.locks.request(SAVE_KEY+'-daily-gacha',()=>commitGachaDraw(session)).catch(()=>failGacha(session,'扭蛋暂时没有转动成功，免费机会仍然保留。'));
 return commitGachaDraw(session);
}
function openGacha(){
 if($('choiceDialog').open||$('diaryDialog').open||$('wardrobeDialog').open||$('miniDialog').open)return;
 renderGacha();if(!$('gachaDialog').open)$('gachaDialog').showModal();$('closeGacha').focus();
}
function closeGachaSession(){if(gachaSession){clearTimeout(gachaSession.timer);gachaSession=null;}$('gachaMachine').classList.remove('is-turning');$('openGacha').focus();}
$('openGacha').addEventListener('click',openGacha);$('drawGacha').addEventListener('click',drawDailyGacha);
$('closeGacha').addEventListener('click',()=>$('gachaDialog').close());$('gachaDone').addEventListener('click',()=>$('gachaDialog').close());$('gachaDialog').addEventListener('close',closeGachaSession);
function refreshGachaDay(){if(!document.hidden&&$('gachaDialog').open&&!gachaSession)renderGacha();}
window.addEventListener('focus',refreshGachaDay);document.addEventListener('visibilitychange',refreshGachaDay);setInterval(refreshGachaDay,60000);
