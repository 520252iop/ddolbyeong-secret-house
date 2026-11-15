'use strict';
(() => {
 const topics = [
  '哪一次听见 SOHEE 唱歌，你到现在还记得？',
  '哪首 RIIZE 的歌最适合陪你回家？你会推荐给第一次来小屋的朋友吗？',
  '如果给豆兵的晚安电台点一首歌，你会选哪首？',
  '最近哪一个 SOHEE 的小瞬间让你忍不住笑了？'
 ];
 const firstMonday = Date.UTC(2026,10,16) - 8*3600000;
 const week = Math.floor((Date.now()-firstMonday)/(7*86400000));
 const topic = topics[(week%topics.length+topics.length)%topics.length];
 const start = $('openFanTea');
 $('fanTeaTopic').textContent=topic;
 start.addEventListener('click',()=>{
  if(!openCosmicMailbox())return;
  cosmicMailTrigger=start;
  $('fanTeaMailTopic').textContent=topic;
  $('fanTeaMailTopic').hidden=false;
 });
 $('cosmicMailDialog').addEventListener('close',()=>{ $('fanTeaMailTopic').hidden=true; });
})();
