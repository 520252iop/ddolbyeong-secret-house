'use strict';
// Temporary silent mode. Set file to 'assets/audio/ddolbyeong-humming.wav'
// only after a natural recording has been supplied and auditioned.
const HUMMING_AUDIO={file:null,silentDuration:4500};
// One short local voice, independent of BGM transport; shared volume preference.
let duckSongAudio=null,duckSongPending=false,duckSongActive=false,duckSongToken=0,duckSongTimeout=null,duckSongStartingAction=false;
const duckSongOriginalSing=actions.sing,duckSongOriginalStop=stopSinging;
function duckSongVolume(){return typeof roomMusicSettings==='object'?roomMusicSettings.volume:.35;}
function stopDuckSong(){duckSongToken++;clearTimeout(duckSongTimeout);duckSongPending=false;duckSongActive=false;if(duckSongAudio){duckSongAudio.pause();try{duckSongAudio.currentTime=0;}catch{}}}
stopSinging=function(){if(duckSongStartingAction){duckSongOriginalStop();return;}const wasSinging=$('room').classList.contains('singing');stopDuckSong();duckSongOriginalStop();$('room').classList.remove('humming');if(wasSinging&&typeof clearExpression==='function'&&$('character').dataset.expression==='sing')clearExpression();};
function duckSongFailure(token){if(token!==duckSongToken)return;stopSinging();say('轻柔哼唱录音尚未准备好或无法播放。请提供本地哼唱音频后再试。');}
function beginHumming(silent=false){
 duckSongStartingAction=true;try{duckSongOriginalSing();}finally{duckSongStartingAction=false;}
 if(!$('room').classList.contains('singing')){stopDuckSong();return;}
 duckSongActive=true;$('room').classList.add('humming');clearTimeout(singTimer);
 say(silent?'豆兵轻轻晃着脑袋，在心里哼一首小曲。':'嗯～把今天的小小好心情，轻轻哼给你。');
 if(!silent&&duckSongVolume()===0)say('音量是 0：小鸭子正在静音唱歌，可以调高下方音量。');
 duckSongTimeout=setTimeout(()=>{if(duckSongActive)stopSinging();},silent?HUMMING_AUDIO.silentDuration:6000);
}
actions.sing=async function(){
 if(duckSongPending||duckSongActive||document.hidden||sleeping||busy||drag)return;
 if(typeof personalityModalOpen==='function'&&personalityModalOpen())return;
 stopSinging();if(!HUMMING_AUDIO.file){beginHumming(true);return;}const token=duckSongToken;duckSongPending=true;
 say('正在准备轻柔的哼唱录音…');
 try{
  if(!duckSongAudio){duckSongAudio=new Audio();duckSongAudio.preload='none';duckSongAudio.loop=false;duckSongAudio.addEventListener('ended',()=>{if(duckSongActive)stopSinging();});duckSongAudio.addEventListener('error',()=>{if(duckSongActive||duckSongPending)duckSongFailure(duckSongToken);});}
  duckSongAudio.src=HUMMING_AUDIO.file;duckSongAudio.volume=duckSongVolume();
  duckSongTimeout=setTimeout(()=>duckSongFailure(token),8000);
  await duckSongAudio.play();if(token!==duckSongToken)return;
  if(document.hidden||sleeping||busy||drag){stopSinging();return;}
  clearTimeout(duckSongTimeout);duckSongPending=false;
  // Original action retains speech, particles and exactly one reward settlement.
  beginHumming();
 }catch{duckSongFailure(token);}
};
$('roomMusicVolume').addEventListener('input',()=>{if(duckSongAudio)duckSongAudio.volume=duckSongVolume();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(duckSongPending||duckSongActive))stopSinging();});
window.addEventListener('pagehide',()=>{if(duckSongPending||duckSongActive)stopSinging();});
// Any pre-existing action which removes the singing class also releases the voice.
const duckSongObserver=new MutationObserver(()=>{if(duckSongActive&&!$('room').classList.contains('singing'))stopDuckSong();});duckSongObserver.observe($('room'),{attributes:true,attributeFilter:['class']});
