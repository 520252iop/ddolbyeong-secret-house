'use strict';
// Shared room hotspot coordination. No new storage, stats or rewards.
const ROOM_HOTSPOTS=['bed','starPlush','window','memoryClock','memoryPoster','memoryCollection','roomMemoryPhoto','roomFriendsPhoto','roomPastelPlush','roomMemoryCamera','interiorBirthday','interiorPlayer','roomDiaryBook','friendJewelry','friendDinoLamp','friendDumbbell','friendHeadband','friendStones','roomWallSwitch'];
const ROOM_DIALOGS=['choiceDialog','wardrobeDialog','miniDialog','diaryDialog','gachaDialog','memoryAlbumDialog','cosmicMailDialog'];
let roomHotspotLast=-Infinity,roomHotspotFocus=null;
function roomHasDialog(){return ROOM_DIALOGS.some(id=>$(id).open);}
function roomHotspotAllowed(id){if(!ROOM_HOTSPOTS.includes(id))return true;if(document.hidden||roomHasDialog()||busy||drag)return false;if(sleeping&&['starPlush','window','memoryClock','memoryPoster','roomPastelPlush','interiorPlayer'].includes(id))return false;const now=Date.now();if(now-roomHotspotLast<300)return false;roomHotspotLast=now;roomHotspotFocus=$(id);lastActive=now;if(typeof clearPersonality==='function')clearPersonality();return true;}
$('room').addEventListener('click',event=>{const button=event.target.closest?.('button');if(button&&!roomHotspotAllowed(button.id)){event.preventDefault();event.stopImmediatePropagation();}},true);
for(const id of ROOM_DIALOGS)$(id).addEventListener('close',()=>{setTimeout(()=>{if(roomHotspotFocus&&!roomHasDialog()){roomHotspotFocus.focus();roomHotspotFocus=null;}},0);lastActive=Date.now();});
function openRoomMusic(){if(roomHasDialog())return;openDialog('豆兵的音乐角','今天想怎么感受星光？',[{label:'♪ 练习一首小曲',run(){actions.sing();}},{label:'♫ 节奏小游戏',run(){openMini('rhythm');}},{label:'▧ 舞台回忆',run(){openMemoryAlbum('stage',null,$('interiorPlayer'));}}]);}
function openRoomCollection(){if(roomHasDialog())return;openDialog('豆兵的小收藏柜','把珍藏的小物和今天的装扮都收好。',[{label:'◒ 每日扭蛋与收藏册',run(){openGacha();}},{label:'♡ 帽子与服装',run(){openWardrobe();}},{label:'▧ 豆兵的小相册',run(){openMemoryAlbum('sohee',null,$('memoryCollection'));}}]);}
$('roomDiaryBook').addEventListener('click',()=>{if(!roomHasDialog())openSecretDiary();});
