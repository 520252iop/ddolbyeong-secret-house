'use strict';
// 仅观察现有动作状态，不改互动、积分、任务或存档。CSS 对各个 SVG 关节分别插值。
function resolveMotion(room,pet){
 if(room.classList.contains('sleeping'))return 'sleep';
 if(pet.classList.contains('dragging'))return 'drag';
 if(room.classList.contains('walking'))return 'walk';
 if(room.classList.contains('singing'))return 'sing';
 if(room.classList.contains('sitting')||room.classList.contains('at-bed'))return 'rest';
 if(['head-love','shy','laughing','pouting','hugging','hat-changing'].some(c=>room.classList.contains(c)))return 'reaction';
 return 'idle';
}
function syncMotion(){
 const svg=$('character'),next=resolveMotion($('room'),$('pet'));
 if(svg.dataset.motion!==next)svg.dataset.motion=next;
 const paused=document.hidden?'true':'false';if(svg.dataset.motionPaused!==paused)svg.dataset.motionPaused=paused;
}
const motionObserver=new MutationObserver(syncMotion);
motionObserver.observe($('room'),{attributes:true,attributeFilter:['class']});
motionObserver.observe($('pet'),{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',syncMotion);
syncMotion();
