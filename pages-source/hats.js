'use strict';
// 收藏馆共用房间中的 SVG 豆兵，预览只克隆角色；只有「保存搭配」会写入存档。
const HAT_LINES = [
 '这顶帽子，装着今天的小小好心情！','锵锵！今天是你的专属小模特 ♡',
 '帽子换好了，可爱也加满啦～','镜子说：这顶和豆兵很配！',
 '偷偷把一颗小星星，藏进新帽子里。','你挑的帽子，我都想戴着转一圈！'
];
const WARDROBE_OUTFITS = [
 {id:'classic',name:'经典红制服',detail:'红色制服 · 黄色纽扣'},
 {id:'berry-zip',name:'莓红拉链套装',detail:'酒红外套 · 蓝粉条纹拼边 · 拉链口袋'},
 {id:'midnight-jersey',name:'午夜球衣套装',detail:'黑白滚边 · 莓红拼色 · 原创星章'},
 {id:'lemon-flight',name:'鹅黄飞行外套',detail:'鹅黄立领 · 奶油口袋 · 深色抽绳'},
 {id:'stage',name:'舞台唱歌豆兵',detail:'蓝白舞台服 · 红色斜挎带 · 话筒'},
 {id:'sohee-pajamas',name:'蓝白条纹睡衣',subtitle:"SOHEE'S PAJAMAS",detail:'今天也要穿得软乎乎的，晚安！'},
 {id:'i-love-sh',name:'I ♥ SH 白色T恤',detail:'奶白圆领 · 黑色字母 · 红色爱心'},
 {id:'maid',name:'奶油蕾丝女仆装',detail:'黑色蓬蓬裙 · 奶油围裙 · 蕾丝蝴蝶结'},
 {id:'piggy',name:'草莓奶小猪套装',detail:'软粉连体衣 · 小猪耳朵 · 卷卷尾巴'},
 {id:'sleepy',name:'蓬松眼罩豆兵',detail:'蓬松发梢 · 黄色眼罩 · 红制服'}
];
let wardrobeDraft=null,hatRenderSerial=0,wardrobeAnimationTimer,roomHatTimer;
const hatCards=new Map(),clothesCards=new Map();
function findHat(id){return HAT_COLLECTION.find(h=>h.id===id)||HAT_COLLECTION[0];}
function hatMarkup(hat,side,prefix){const markup=hat[side].replaceAll('__UID__',prefix);if(!markup)return '';return `<g transform="${HAT_FITS[hat.id][side]}">${markup}</g>`;}
function paintHat(svg,id){
 const hat=findHat(id),prefix=`hat-${++hatRenderSerial}-`;
 svg.querySelector('.hat-back-layer').innerHTML=hatMarkup(hat,'back',prefix);
 svg.querySelector('.hat-front-layer').innerHTML=hatMarkup(hat,'front',prefix);
 svg.classList.add('hat-collection');svg.dataset.hat=hat.id;
 svg.setAttribute('aria-label',`${hat.id==='classic'?'不戴外部帽子':hat.name}的豆兵，永久深灰高筒头部、原版眼神、雀斑和橘色鸭嘴`);
}
function createHatThumbnail(hat){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox',hat.back?'20 -10 220 285':'20 -10 220 177');svg.setAttribute('aria-hidden','true');
 const prefix=`thumb-${++hatRenderSerial}-`;
 const base=$('character').querySelector('.base-head').cloneNode(true);
 svg.innerHTML=hatMarkup(hat,'back',prefix);svg.append(base);
 const front=document.createElementNS('http://www.w3.org/2000/svg','g');front.innerHTML=hatMarkup(hat,'front',prefix);svg.append(front);
 return svg;
}
function cloneWardrobeCharacter(outfit,hat){
 const svg=$('character').cloneNode(true);svg.removeAttribute('id');
 // Rebuild outfit-local clip IDs: previews coexist with the live character.
 delete svg.dataset.lookVersion;
 svg.dataset.motion='preview';if(typeof applyFace==='function')applyFace(svg,'neutral');else svg.dataset.expression='neutral';if(typeof applyCharacterLook==='function')applyCharacterLook(svg,outfit,false);paintHat(svg,hat);if(typeof syncWingPose==='function')syncWingPose(svg);return svg;
}
function buildHatCards(){
 $('hatsTab').textContent=`帽子 · ${HAT_COLLECTION.length}`;
 const elements=HAT_COLLECTION.map((hat,index)=>{
  const card=document.createElement('article');card.className='hat-card';card.dataset.hatId=hat.id;
  const image=document.createElement('button');image.className='hat-thumb';image.setAttribute('aria-label',`预览${hat.name}`);image.append(createHatThumbnail(hat));image.addEventListener('click',()=>previewHat(hat.id));
  const number=document.createElement('span');number.className='hat-number';number.textContent=String(index+1).padStart(2,'0');
  const name=document.createElement('h3');name.textContent=hat.name;
  const trial=document.createElement('button');trial.className='try-hat';trial.textContent='试戴';trial.setAttribute('aria-label',`试戴${hat.name}`);trial.addEventListener('click',()=>previewHat(hat.id));
  card.append(number,image,name,trial);hatCards.set(hat.id,{card,image,trial});return card;
 });$('hatGrid').replaceChildren(...elements);
}
function buildClothesCards(){
 $('clothesTab').textContent=`造型 · ${WARDROBE_OUTFITS.length}`;
 $('clothesGrid').replaceChildren(...WARDROBE_OUTFITS.map(outfit=>{
  const b=document.createElement('button');b.className=`clothes-card outfit-${outfit.id}`;
  const thumbnail=document.createElement('div');thumbnail.className='clothes-thumbnail';thumbnail.append(cloneWardrobeCharacter(outfit.id,wardrobeDraft.hat));
  const name=document.createElement('b');name.textContent=outfit.name;
  const detail=document.createElement('small');detail.textContent=outfit.detail;
  b.append(thumbnail,name);if(outfit.subtitle){const subtitle=document.createElement('small');subtitle.textContent=outfit.subtitle;b.append(subtitle);}b.append(detail);b.addEventListener('click',()=>previewOutfit(outfit.id));clothesCards.set(outfit.id,b);return b;
 }));
}
function updateWardrobeSelection(){
 for(const [id,{card,image,trial}] of hatCards){const chosen=wardrobeDraft.hat===id;card.classList.toggle('is-selected',chosen);image.setAttribute('aria-pressed',String(chosen));trial.setAttribute('aria-pressed',String(chosen));trial.textContent=chosen?'✓ 试戴中':'试戴';}
 for(const [id,button]of clothesCards)button.setAttribute('aria-pressed',String(wardrobeDraft.outfit===id));
 const hat=findHat(wardrobeDraft.hat);$('previewHatName').textContent=hat.name;$('previewHatDetail').textContent=hat.detail;$('hatPosition').textContent=`${HAT_COLLECTION.indexOf(hat)+1} / ${HAT_COLLECTION.length}`;
 $('wardrobeSaveHint').textContent=wardrobeDraft.hat===state.hat&&wardrobeDraft.outfit===state.outfit?'当前已保存的搭配 · 可以继续试戴':'正在试戴 · 点击保存搭配后生效';
}
function drawWardrobePreview(animate=false){
 const box=$('wardrobePreview');box.className=`wardrobe-preview outfit-${wardrobeDraft.outfit}`;
 box.replaceChildren(cloneWardrobeCharacter(wardrobeDraft.outfit,wardrobeDraft.hat));
 clearTimeout(wardrobeAnimationTimer);
 if(animate){const svg=box.querySelector('svg');if(typeof applyFace==='function')applyFace(svg,'smug');else svg.dataset.expression='smug';void box.offsetWidth;box.classList.add('hat-changing');wardrobeAnimationTimer=setTimeout(()=>{box.classList.remove('hat-changing');if(typeof applyFace==='function')applyFace(svg,'neutral');else svg.dataset.expression='neutral';},650);}
 updateWardrobeSelection();
}
function wardrobeLine(){const line=HAT_LINES[Math.floor(Math.random()*HAT_LINES.length)];$('wardrobeLine').textContent=line;return line;}
function previewHat(id){
 if(!wardrobeDraft||!HAT_COLLECTION.some(h=>h.id===id))return;
 wardrobeDraft.hat=id;drawWardrobePreview(true);wardrobeLine();
 // 服装缩略图同时沿用正在试戴的帽子。
 for(const button of clothesCards.values())paintHat(button.querySelector('svg'),id);
}
function previewOutfit(id){if(!wardrobeDraft||!WARDROBE_OUTFITS.some(o=>o.id===id))return;const changed=wardrobeDraft.outfit!==id;wardrobeDraft.outfit=id;if(changed&&['stage','sleepy'].includes(id))wardrobeDraft.hat='classic';drawWardrobePreview(true);for(const button of clothesCards.values())paintHat(button.querySelector('svg'),wardrobeDraft.hat);wardrobeLine();}
function stepHat(direction){if(!wardrobeDraft)return;const current=HAT_COLLECTION.findIndex(h=>h.id===wardrobeDraft.hat);const next=(current+direction+HAT_COLLECTION.length)%HAT_COLLECTION.length;previewHat(HAT_COLLECTION[next].id);hatCards.get(wardrobeDraft.hat).card.scrollIntoView({block:'nearest',behavior:'smooth'});}
function wardrobeTab(which){
 const hats=which==='hats';$('hatsTab').setAttribute('aria-selected',String(hats));$('clothesTab').setAttribute('aria-selected',String(!hats));$('hatsTab').tabIndex=hats?0:-1;$('clothesTab').tabIndex=hats?-1:0;$('hatsPanel').hidden=!hats;$('clothesPanel').hidden=hats;
}
function openWardrobe(){
 if(!canTouch()||drag)return;clearPose();stopSinging();returnHome();cheekTimes=[];
 wardrobeDraft={hat:findHat(state.hat).id,outfit:WARDROBE_OUTFITS.some(o=>o.id===state.outfit)?state.outfit:'classic'};
 buildClothesCards();wardrobeTab('hats');drawWardrobePreview();$('wardrobeLine').textContent='挑一顶，把今天戴成喜欢的样子 ♡';$('wardrobeDialog').showModal();
}
function closeWardrobe(){clearTimeout(wardrobeAnimationTimer);wardrobeDraft=null;$('wardrobeDialog').close();lastActive=Date.now();}
function saveWardrobe(){
 if(!wardrobeDraft)return;
 const changed=state.hat!==wardrobeDraft.hat||state.outfit!==wardrobeDraft.outfit;
 const previous={hat:state.hat,outfit:state.outfit};state.hat=wardrobeDraft.hat;state.outfit=wardrobeDraft.outfit;save();
 if(saveFailed){state.hat=previous.hat;state.outfit=previous.outfit;$('wardrobeSaveHint').textContent='保存未成功：浏览器限制了本地存储，请允许后再试。';return;}
 const line=wardrobeLine();paintHat($('character'),state.hat);
 if(changed){interact({affection:1,mood:2},'dress');clearPose();if(typeof setExpression==='function')setExpression('smug',850);$('room').classList.remove('hat-changing');void $('pet').offsetWidth;$('room').classList.add('hat-changing');clearTimeout(roomHatTimer);roomHatTimer=setTimeout(()=>$('room').classList.remove('hat-changing'),650);}else render();
 say(line);closeWardrobe();
}
function initHatCollection(){
 state.hat=findHat(state.hat).id;paintHat($('character'),state.hat);save();buildHatCards();
 // 动态替换换装动作；底部原按钮仍然复用 actions.dress，不改变其他互动入口。
 actions.dress=openWardrobe;
 $('closeWardrobe').addEventListener('click',closeWardrobe);$('saveWardrobe').addEventListener('click',saveWardrobe);
 $('previousHat').addEventListener('click',()=>stepHat(-1));$('nextHat').addEventListener('click',()=>stepHat(1));$('resetHat').addEventListener('click',()=>previewHat('classic'));
 $('hatsTab').addEventListener('click',()=>wardrobeTab('hats'));$('clothesTab').addEventListener('click',()=>wardrobeTab('clothes'));
 for(const id of ['hatsTab','clothesTab'])$(id).addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const target=e.key==='Home'?'hats':e.key==='End'?'clothes':id==='hatsTab'?'clothes':'hats';wardrobeTab(target);$(target==='hats'?'hatsTab':'clothesTab').focus();});
 $('wardrobeDialog').addEventListener('cancel',e=>{e.preventDefault();closeWardrobe();});$('wardrobeDialog').addEventListener('close',()=>{wardrobeDraft=null;clearTimeout(wardrobeAnimationTimer);lastActive=Date.now();});
}
initHatCollection();
