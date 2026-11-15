'use strict';
(() => {
 const start = Date.parse('2026-11-20T00:00:00+09:00');
 const party = Date.parse('2026-11-21T00:00:00+09:00');
 const end = Date.parse('2026-11-22T00:00:00+09:00');
 const keepsake = Date.parse('2026-11-23T00:00:00+09:00');
 const phase = now => now < start ? 'before' : now < party ? 'warmup' : now < end ? 'party' : now < keepsake ? 'keepsake' : 'after';
 if (typeof module !== 'undefined' && module.exports) {
  module.exports = {phase, start, party, end, keepsake};
  return;
 }

 const byId = id => document.getElementById(id);
 const room = byId('room');
 const popper = byId('reviewPopper');
 const cakeTable = byId('reviewCakeTable');
 const cakePoster = byId('birthdayCakePoster');
 const birthdayMic = byId('birthdayMic');
 const birthdayCandle = byId('birthdayCandle');
 const micDialog = byId('birthdayMicDialog');
 function openBirthdayMic() {
  if (phase(Date.now()) === 'party' && record().served && !micDialog.open) micDialog.showModal();
 }
 birthdayMic.addEventListener('click',openBirthdayMic);
 byId('birthdayMicClose').addEventListener('click', () => micDialog.close());
 birthdayCandle.addEventListener('click', () => {
  const lit = birthdayCandle.getAttribute('aria-pressed') !== 'true';
  birthdayCandle.setAttribute('aria-pressed',String(lit));
  say(lit?'点亮啦！这支小蜡烛帮你守着愿望。':'嘘，先把这支小蜡烛歇一歇。');
 });
 const choices = [
  {key:'sponge',title:'挑一个蛋糕胚', options:[['vanilla','香草','#f5c47c'],['cocoa','可可','#b88373'],['berry','草莓','#f7acc1']]},
  {key:'cream',title:'挑一种奶油颜色', options:[['pink','莓果粉','#ffd0df'],['mint','薄荷青','#b9edd3'],['lilac','芋泥紫','#ded0ff']]},
  {key:'topping',title:'选一款蛋糕装饰', options:[['stars','星星糖','#ffd76e','✦ ✧ ✦'],['berries','草莓粒','#ed8ba4','♥ ♥ ♥'],['bows','糖霜花','#b391d3','✿ ❋ ✿']]}
 ];
 const optionsBox = byId('cakeOptions');
 const cakeChoices = byId('cakeChoices');
 let selection = '';
 for (const trigger of [cakeTable,cakePoster]) trigger.addEventListener('click', () => open('gift'));
 function paintCake(cake, data, currentChoice) {
  const art = choices.map(group => group.options.find(option => option[0] === (group.key === currentChoice?.key ? selection : data[group.key])));
  const [sponge,cream,topping] = art;
  cake.style.setProperty('--cake-sponge',sponge?.[2] || '#f5c47c');
  cake.style.setProperty('--cake-cream',cream?.[2] || '#fff9ec');
  cake.style.setProperty('--cake-topping',topping?.[2] || '#e79bb1');
  cake.querySelector('.review-berries').textContent = topping?.[3] || '';
  cake.dataset.showSponge = String(Boolean(sponge));
  cake.dataset.showCream = String(Boolean(cream));
  cake.dataset.showTopping = String(Boolean(topping));
 }
 function burstConfetti() {
  const pieces = Array.from({length:24}, (_,i) => {
   const piece = document.createElement('i');
   piece.style.setProperty('--x', (25-(i % 8)*31) + 'px');
   piece.style.setProperty('--y', (-85-(i%6)*25) + 'px');
   piece.style.setProperty('--spin', (i%2 ? 1 : -1)*(90+i*23)+'deg');
   piece.style.background = ['#efd2aa','#e5a7a2','#fff0d2','#c5b1d7'][i%4];
   return piece;
  });
  byId('reviewConfetti').replaceChildren(...pieces);
  setTimeout(() => { for (const piece of pieces) piece.remove(); },1000);
 }
 popper.addEventListener('click', burstConfetti);
 const dialog = byId('soheeDay');
 const gift = byId('soheeGift');
 const archive = byId('soheeArchive');
 const action = byId('soheeAction');
 const message = byId('soheeMessage');
 const progress = byId('soheeProgress');
 const birthdayAudio = byId('soheeBirthdayAudio');
 birthdayAudio.volume = .25;
 const birthdayButton = byId('soheeBirthdaySong');
 const songStatus = byId('soheeSongStatus');
 let backgroundBeforeSong = false;
 const letter = byId('soheeLetter');
 const letterOpen = byId('soheeLetterOpen');
 const bgm = byId('soheeBgm');
 const bgmToggle = byId('backgroundMusicToggle');
 const backgroundPreferenceKey = 'sohee-little-world-background-stopped';
 let backgroundStopped = false;
 try { backgroundStopped = ![null,'playing'].includes(localStorage.getItem(backgroundPreferenceKey)); } catch {}
 function stopBackground() {
  backgroundStopped = true;
  stopListeningForGesture();
  resumeOnReturn = false;
  backgroundBeforeSong = false;
  bgm.pause();
  if (typeof pauseRoomMusic === 'function' && (roomMusicPlaying || roomMusicPending)) pauseRoomMusic(false);
  bgmToggle.textContent = '继续播放背景音乐';
 }
 function resumeBackground() {
  backgroundStopped = false;
  bgmToggle.textContent = '停止背景音乐';
  if (birthdayAudio.paused) playBackground();
  else backgroundBeforeSong = true;
 }
 if (backgroundStopped) bgmToggle.textContent = '继续播放背景音乐';
 bgmToggle.addEventListener('click', () => {
  if (backgroundStopped) {
   try { localStorage.setItem(backgroundPreferenceKey,'playing'); } catch {}
   resumeBackground();
   return;
  }
  stopBackground();
  try { localStorage.setItem(backgroundPreferenceKey,String(Date.now())+'-'+Math.random()); } catch {}
 });
 window.addEventListener('storage',event => {
  if (event.key !== backgroundPreferenceKey) return;
  if (event.newValue !== null && event.newValue !== 'playing') stopBackground();
  else resumeBackground();
 });
 bgm.volume = .09;
 let attempted = false;
 let resumeOnReturn = false;
 function stopListeningForGesture() {
  document.removeEventListener('pointerup', playOnGesture, true);
  document.removeEventListener('keydown', playOnGesture, true);
 }
 function playOnGesture(event) {
  if (!event.isTrusted) return;
  stopListeningForGesture();
  playBackground();
 }
 function playBackground() {
  if (document.hidden || backgroundStopped) return;
  if (typeof pauseRoomMusic === 'function' && (roomMusicPlaying || roomMusicPending)) pauseRoomMusic(false);
  bgm.play().then(() => {
   stopListeningForGesture();
   if (backgroundStopped) bgm.pause();
  }).catch(error => {
   if (error.name !== 'NotAllowedError' || backgroundStopped) return;
   document.addEventListener('pointerup', playOnGesture, true);
   document.addEventListener('keydown', playOnGesture, true);
  });
 }
 letterOpen.addEventListener('click', () => {
  if (Date.now() >= party && Date.now() < keepsake) letter.showModal();
 });
 byId('soheeLetterClose').addEventListener('click', () => letter.close());
 byId('birthdayMailInvite').addEventListener('click', () => {
  letter.close();
  if (typeof openCosmicMailbox === 'function' && openCosmicMailbox()) return;
  byId('openCosmicMailbox').focus();
 });
 function stopBirthdaySong() {
  birthdayAudio.pause();
  birthdayAudio.currentTime = 0;
 }
 function syncBirthdayButton() {
  birthdayButton.textContent = birthdayAudio.paused ? '播放生日快乐歌' : '停止生日快乐歌';
 }
 function showSongError() {
  songStatus.hidden = false;
  songStatus.textContent = '音乐盒暂时播不了。生日任务可以继续。';
 }
 birthdayButton.addEventListener('click', () => {
  if (phase(Date.now()) !== 'party') return;
  if (!birthdayAudio.paused) { stopBirthdaySong(); return; }
  backgroundBeforeSong = !bgm.paused || backgroundBeforeSong;
  bgm.pause();
  if (typeof pauseRoomMusic === 'function') pauseRoomMusic(false);
  songStatus.hidden = true;
  birthdayAudio.play().catch(() => { showSongError(); restoreBackground(); });
 });
 for (const event of ['play', 'pause', 'ended']) birthdayAudio.addEventListener(event, syncBirthdayButton);
 birthdayAudio.addEventListener('error', showSongError);
 function restoreBackground() {
  if (!backgroundBeforeSong || document.hidden) return;
  backgroundBeforeSong = false;
  playBackground();
 }
 birthdayAudio.addEventListener('pause', restoreBackground);
 birthdayAudio.addEventListener('ended', restoreBackground);
 micDialog.addEventListener('close', () => { stopBirthdaySong(); restoreBackground(); });
 document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
   resumeOnReturn = !bgm.paused || backgroundBeforeSong;
   backgroundBeforeSong = false;
   stopBirthdaySong();
   bgm.pause();
  } else if (resumeOnReturn) {
   resumeOnReturn = false;
   playBackground();
  }
 });

 const steps = ['叠好蛋糕胚', '抹上奶油', '放上装饰，点亮蜡烛'];
 const lines = ['第一层歪了一点。豆兵说：没关系，第二层往反方向歪！', '奶油抹好啦！豆兵嘴角这点也是奶油？它说是试味道。', '蜡烛亮了！豆兵赶紧戴上生日帽。「生日蛋糕师」套装已经放进衣柜啦。'];
 let mode = '';
 const record = () => {
  const data = state.soheeDay2026;
  const step = data?.cakeVersion === 2 && Number.isInteger(data.step) && data.step >= 0 && data.step <= 3 ? data.step : 0;
  return {cakeVersion:2,step,served:step===3 && data?.served===true,star:data?.star===true,sponge:data?.sponge,cream:data?.cream,topping:data?.topping};
 };
 function storeRecord(next) {
  const previous = state.soheeDay2026;
  state.soheeDay2026 = next;
  save();
  if (!saveFailed) return true;
  state.soheeDay2026 = previous;
  message.textContent = '小屋暂时存不了档。允许浏览器存储后，可以再试一次。';
  return false;
 }
 let tablePaintKey = '';
 function renderTableCake(data,served) {
  const key = served ? [data.sponge,data.cream,data.topping].join('/') : '';
  if (key === tablePaintKey) return;
  tablePaintKey = key;
  byId('cakeTableLabel').textContent = served?'看看我们的蛋糕':'和豆兵做蛋糕';
  if (!served) return;
  const [sponge,cream,topping] = choices.map(group => group.options.find(option => option[0]===data[group.key]));
  cakeTable.style.setProperty('--served-sponge',sponge?.[2] || '#f5c47c');
  cakeTable.style.setProperty('--served-cream',cream?.[2] || '#fff9ec');
  cakeTable.style.setProperty('--served-topping',topping?.[2] || '#e79bb1');
  byId('servedTopping').textContent=topping?.[3] || '';
 }
 function refresh() {
  const now = Date.now();
  const current = phase(now);
  const birthdayOpen = current === 'party';
  const decorated = current === 'party' || current === 'keepsake';
  popper.hidden = !decorated;
  cakeTable.hidden = !decorated;
  cakePoster.hidden = !decorated;
  const data = record();
  const served = decorated && data.served;
  birthdayMic.hidden = !birthdayOpen || !served;
  room.classList.toggle('birthday-cake-served',served);
  birthdayCandle.hidden = !decorated;
  room.classList.toggle('party-cake-room',decorated);
  letterOpen.hidden = now < party || now >= keepsake;
  room.classList.toggle('has-birthday-letter',!letterOpen.hidden);
  if (letterOpen.hidden && letter.open) letter.close();
  if (!attempted && !document.hidden) { attempted = true; playBackground(); }
  if (!birthdayOpen && micDialog.open) micDialog.close();
  renderTableCake(data,served);
  gift.hidden = current !== 'warmup';
  archive.hidden = data.step < 3 && current !== 'keepsake';
  room.classList.toggle('sohee-party', current === 'party');
  room.dataset.soheeStep = String(data.step);
  const minutes = Math.max(0, Math.ceil((party - now) / 60000));
  byId('soheeCountdown').textContent = current === 'warmup'
   ? Math.floor(minutes / 1440) + '天 ' + Math.floor(minutes / 60) % 24 + '小时 ' + minutes % 60 + '分'
   : '和豆兵做蛋糕';
 }
 function updateCard(line) {
  const current = phase(Date.now());
  const data = record();
  const tasksOpen = ['party', 'keepsake'].includes(current);
  dialog.dataset.scene = mode;
  const cake = byId('reviewCake');
  cake.hidden = current === 'warmup';
  cake.dataset.step = String(data.step);
  if (cake.hidden) byId('soheeArt').removeAttribute('hidden');
  else byId('soheeArt').setAttribute('hidden','');
  cake.innerHTML = '<div class="review-cake-plate"><i class="review-sponge"></i><i class="review-icing"></i><i class="review-berries">● ● ●</i><i class="review-candle"><b></b></i></div>';

  byId('soheeArt').dataset.step = String(data.step);
  byId('soheeTitle').textContent = current === 'warmup' ? '豆兵的神秘礼物盒' : '给炤熙做蛋糕';
  const group = tasksOpen ? choices[data.step] : null;
  cakeChoices.hidden = !group;
  if (group) {
   byId('cakeChoiceTitle').textContent = group.title;
   optionsBox.replaceChildren(...group.options.map(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option[1];
    button.style.setProperty('--choice',option[2]);
    button.setAttribute('aria-pressed',String(selection===option[0]));
    button.addEventListener('click', () => {
     selection=option[0];
     for (const peer of optionsBox.children) peer.setAttribute('aria-pressed',String(peer===button));
     paintCake(cake,data,group);
     action.disabled=false;
    });
    return button;
   }));
  }
  if (!cake.hidden) paintCake(cake,data,group);
  progress.hidden = !tasksOpen;
  progress.textContent = '蛋糕进度 ' + data.step + ' / 3';
  action.hidden = false;
  action.disabled = Boolean(group && !selection);
  if (current === 'warmup') {
   message.textContent = '不可以偷看！11月21日再来，豆兵有事情想拜托你。';
   action.hidden = true;
  } else {
   message.textContent = data.served && current === 'party' ? '你的蛋糕已经上桌啦。接下来点麦克风，给 SOHEE 放生日歌。' : line || (data.step === 3 ? '蛋糕做好啦！带尖顶生日帽的「生日蛋糕师」套装已经放进衣柜。' : tasksOpen ? '嘘，豆兵把围裙系反了。你来帮它，我们一起做个蛋糕吧！' : '豆兵把这次做蛋糕的配方收好啦。');
   action.hidden = data.step !== 3 && !tasksOpen;
   action.textContent = data.step === 3 ? (data.served ? (current === 'party' ? '下一步 · 打开生日点歌' : '回到小屋') : '把蛋糕端上桌') : steps[data.step];
  }
 }
 function open(scene) {
  refresh();
  mode = scene;
  selection = '';
  updateCard();
  if (!dialog.open) dialog.showModal();
 }
 gift.addEventListener('click', () => open('gift'));
 archive.addEventListener('click', () => open('archive'));
 byId('soheeClose').addEventListener('click', () => dialog.close());
 action.addEventListener('click', () => {
  const data = record();
  if (data.step === 3) {
   if (data.served) { dialog.close(); openBirthdayMic(); return; }
   if (!['party','keepsake'].includes(phase(Date.now())) || !storeRecord({...data,served:true})) return;
   dialog.close();
   refresh();
   if (!popper.hidden) burstConfetti();
   if (!birthdayMic.hidden) birthdayMic.focus({preventScroll:true});
   say(phase(Date.now())==='party'?'蛋糕上桌啦！来点一下麦克风，今天轮到我们唱给 SOHEE 听。':'蛋糕上桌啦！这一块给 SOHEE 留着。');
   return;
  }
  if (!['party', 'keepsake'].includes(phase(Date.now()))) { refresh(); updateCard(); return; }
  if (!selection || !storeRecord({...data,[choices[data.step].key]:selection,step:data.step+1})) return;
  selection='';
  refresh();
  updateCard(lines[data.step]);
 });
 function refreshAll() {
  const previous = room.dataset.soheePhase;
  refresh();
  room.dataset.soheePhase = phase(Date.now());
  if (!previous && room.dataset.soheePhase === 'party') say('你来啦！给 SOHEE 的信放在右边的小柜子上，蛋糕就等你一起做。');
  if (dialog.open && previous !== room.dataset.soheePhase) updateCard();
 }
 dialog.addEventListener('close', refreshAll);

 archive.addEventListener('click', refreshAll);
 gift.addEventListener('click', refreshAll);
 refreshAll();
 setInterval(refreshAll, 1000);
 document.addEventListener('visibilitychange', refreshAll);
})();
