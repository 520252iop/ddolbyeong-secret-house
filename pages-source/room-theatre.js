'use strict';
(() => {
 const trigger = $('openRoomTheatre');
 const roomMic = $('dailyRoomMic');
 const stage = $('roomTheatre');
 const prompt = $('theatrePrompt');
 const options = $('theatreOptions');
 const progress = $('theatreProgress');
 const art = $('theatreArt');
 const scenes = [
  {id:'mic', name:'小麦克风', mark:'♫', color:'lilac', endings:[
   ['唱一句','豆兵清完嗓子，发出一声很认真的「嘎」。它说刚才那句是试音。'],
   ['采访自己','“请问你今天做了什么？”豆兵把麦克风换到另一只翅膀：“接受采访。”']
  ]},
  {id:'cushion', name:'星星抱枕', mark:'✦', color:'cream', endings:[
   ['给星星盖被子','豆兵把被子拉到最上面。星星露了一只角，它又给那只角掖了掖。'],
   ['把它当方向盘','豆兵原地开了三圈，最后宣布：“各位乘客，终点站是我自己的床。”']
  ]},
  {id:'tape', name:'旧磁带', mark:'▣', color:'mint', endings:[
   ['倒回去听','磁带吱呀了一声。豆兵贴近听了听：“录到我偷偷打哈欠啦！”'],
   ['录一条留言','“给明天的豆兵：饼干在第二格。”它录完马上把第二格打开了。']
  ]}
 ];
 const specialScenes = {
  mic: {id:'mic-night',label:'录一段晚安电台',line:'“这里是豆兵的晚安电台。今晚的新闻是——枕头已经翻到了凉快的一面。”说完它自己先打了个哈欠。',available:()=>$('room').dataset.roomPeriod==='night'},
  tape: {id:'tape-rain',label:'听听窗边录音',line:'磁带里有三声雨点，还有豆兵小声数到四。它坚持第四声是雨点迟到了。',available:()=>$('window').dataset.weather==='rainy'}
 };
 const ids = new Set([
  ...scenes.flatMap(scene => scene.endings.map((_, index) => scene.id+'-'+index)),
  ...Object.values(specialScenes).map(scene=>scene.id)
 ]);
 const seen = () => new Set(Array.isArray(state.roomTheatreSeen) ? state.roomTheatreSeen.map(id=>id==='mic-birthday'?'mic-night':id).filter(id=>ids.has(id)) : []);
 function makeButton(text,handler) {
  const button=document.createElement('button');
  button.type='button';
  button.textContent=text;
  button.addEventListener('click',handler);
  return button;
 }
 function showOptions(...buttons) {
  options.replaceChildren(...buttons);
  buttons[0]?.focus();
 }
 function drawProgress() {
  progress.textContent = '已看过 '+seen().size+' / '+ids.size+' 场';
 }
 function chooseProp() {
  stage.dataset.prop='lilac';
  art.textContent='✦';
  prompt.textContent='今晚让豆兵拿什么上台？';
  drawProgress();
  showOptions(...scenes.map(scene=>makeButton(scene.name,()=>chooseEnding(scene))));
 }
 function chooseEnding(scene) {
  stage.dataset.prop=scene.color;
  art.textContent=scene.mark;
  prompt.textContent='豆兵拿好了'+scene.name+'。接下来呢？';
  const buttons=scene.endings.map(([label,line],index)=>makeButton(label,()=>showEnding(scene.id+'-'+index,line)));
  const special=specialScenes[scene.id];
  if(special?.available()) buttons.push(makeButton(special.label,()=>showEnding(special.id,special.line)));
  showOptions(...buttons,makeButton('换个道具',chooseProp));
 }
 function showEnding(id,line) {
  const previous=state.roomTheatreSeen;
  const played=seen();
  if(!played.has(id)){
   played.add(id);
   state.roomTheatreSeen=[...played];
   save();
   if(saveFailed) state.roomTheatreSeen=previous;
  }
  prompt.textContent=line;
  drawProgress();
  showOptions(makeButton('再演一场',chooseProp),makeButton('回到小屋',()=>stage.close()));
 }
 let returnFocus = trigger;
 function openTheatre(source, prop) {
  if(busy||drag||roomHasDialog())return;
  if(typeof stopSinging==='function')stopSinging();
  returnFocus = source;
  stage.showModal();
  chooseProp();
  if(prop) chooseEnding(prop);
 }
 trigger.addEventListener('click',()=>openTheatre(trigger));
 roomMic.addEventListener('click',()=>openTheatre(roomMic,scenes[0]));
 $('closeRoomTheatre').addEventListener('click',()=>stage.close());
 stage.addEventListener('close',()=>returnFocus.focus());
})();
