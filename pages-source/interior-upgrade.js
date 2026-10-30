'use strict';
// Decorations delegate to existing features; no independent clock, music or reward system.
$('interiorBirthday').addEventListener('click',()=>{openDialog('豆兵的生日纪念卡','DDOLBYEONG · 2014.02.14\n这张小卡记着豆兵的生日。252 是小屋珍藏的暗号。',[]);});
$('interiorPlayer').addEventListener('click',()=>{if(typeof openRoomMusic==='function'){openRoomMusic();return;}openMemoryAlbum('stage',null,$('interiorPlayer'));});
