'use strict';
// Fan-written room easter eggs; decorative 2:52 is NOT a clock. No state or storage writes.
(() => {
 const clock=document.getElementById('memoryClock');
 const poster=document.getElementById('memoryPoster');
 const collection=document.getElementById('memoryCollection');
 let sparkleTimer;
 clock.addEventListener('click',()=>{say('嘘——2:52 是小屋的秘密暗号！这只钟只负责可爱，不负责报时。');});
 poster.addEventListener('click',()=>{
  clearTimeout(sparkleTimer);poster.classList.remove('is-twinkling');void poster.offsetWidth;poster.classList.add('is-twinkling');
  say('RIIZE 的海报要贴好！等我的宇宙巡演开始，这里也要留一个位置。');
  sparkleTimer=setTimeout(()=>poster.classList.remove('is-twinkling'),1400);
 });
 collection.addEventListener('click',()=>{
  if(typeof openRoomCollection==='function'){openRoomCollection();return;}
  if(typeof openGacha==='function'){openGacha();return;}
  openDialog('豆兵的珍藏卡','这张小卡片记着：爸爸 SOHEE、RIIZE、BRIIZE，还有闪闪发光的你。\n豆兵悄悄写下：下一个宇宙小明星，当然是我啦！',[]);
 });
})();
