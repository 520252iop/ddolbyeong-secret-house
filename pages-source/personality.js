'use strict';
// Transient presentation only. Original handlers remain the sole reward/save owners.
const PERSONALITY_STATES={idle:'自然待机',happy:'开心',shy:'害羞',smug:'得意',mischievous:'调皮',fly:'拖动飞行',eat:'进食',sleep:'睡觉',sing:'唱歌'};
let personalityTimer=null,personalityToken=0,personalityUntil=0,personalityLastTap=-Infinity,personalityLastChoice={};
function personalityModalOpen(){return ['choiceDialog','wardrobeDialog','miniDialog','diaryDialog','gachaDialog','memoryAlbumDialog','cosmicMailDialog'].some(id=>$(id).open);}
function resolvePersonality(){const room=$('room');if(sleeping)return 'sleep';if(room.classList.contains('eating'))return 'eat';if(drag||$('pet').classList.contains('dragging'))return 'fly';if(room.classList.contains('walking'))return 'idle';if(room.classList.contains('singing'))return 'sing';if(Date.now()<personalityUntil)return $('character').dataset.personality||'idle';return 'idle';}
function syncPersonality(){const svg=$('character'),next=resolvePersonality();if(['sleep','eat','fly','sing'].includes(next)){clearTimeout(personalityTimer);personalityUntil=0;personalityToken++;}svg.dataset.personality=next;}
function clearPersonality(){clearTimeout(personalityTimer);personalityUntil=0;personalityToken++;$('character').dataset.personality='idle';}
function personalityPick(part,choices){let pool=choices.filter(choice=>choice!==personalityLastChoice[part]);const choice=pool[Math.floor(Math.random()*pool.length)];personalityLastChoice[part]=choice;return choice;}
function personalityReact(id,duration=2200){if(!Object.hasOwn(PERSONALITY_STATES,id)||sleeping||busy||drag||document.hidden||personalityModalOpen())return false;clearPersonality();const token=personalityToken;personalityUntil=Date.now()+duration;$('character').dataset.personality=id;
 const faces={happy:'laugh',shy:'shy',smug:'smug',mischievous:'smirk'};if(faces[id])setExpression(faces[id],duration);
 personalityTimer=setTimeout(()=>{if(token!==personalityToken)return;personalityUntil=0;syncPersonality();},duration);return true;}
function personalityTapAllowed(){if(sleeping||busy||drag||document.hidden||personalityModalOpen())return false;const now=Date.now();if(now-personalityLastTap<320)return false;personalityLastTap=now;clearPersonality();return true;}
const personalityOriginalPat=actions.pat,personalityOriginalCheek=touchCheek,personalityOriginalBelly=touchBelly;
actions.pat=function(){if(!personalityTapAllowed())return;personalityOriginalPat();$('character').dataset.personality='shy';personalityUntil=Date.now()+2500;const token=personalityToken;personalityTimer=setTimeout(()=>{if(token===personalityToken){personalityUntil=0;syncPersonality();}},2500);};
touchCheek=function(){if(!personalityTapAllowed())return;personalityOriginalCheek();if($('room').classList.contains('pouting')){personalityReact('mischievous',2800);setExpression('eye-roll',2800);}else{personalityReact(personalityPick('cheek',['shy','mischievous']),1900);}};
touchBelly=function(){if(!personalityTapAllowed())return;personalityOriginalBelly();personalityReact(personalityPick('belly',['happy','smug']),2100);};
const personalityOriginalTalk=actions.talk;
actions.talk=function(){if(!personalityTapAllowed())return;personalityOriginalTalk();personalityReact(personalityPick('talk',['smug','mischievous','happy']),2400);};
// Cancel a transient reaction before another subsystem takes control, without changing its rules.
for(const name of ['food','sleep','sing','dress']){const original=actions[name];actions[name]=function(...args){clearPersonality();const result=original(...args);syncPersonality();return result;};}
const personalityObserver=new MutationObserver(syncPersonality);personalityObserver.observe($('room'),{attributes:true,attributeFilter:['class']});personalityObserver.observe($('pet'),{attributes:true,attributeFilter:['class']});
document.addEventListener('visibilitychange',()=>{clearPersonality();syncPersonality();});syncPersonality();
