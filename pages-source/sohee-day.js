'use strict';
(() => {
 const start = Date.parse('2026-11-20T00:00:00+09:00');
 const party = Date.parse('2026-11-21T00:00:00+09:00');
 const night = Date.parse('2026-11-21T23:21:00+09:00');
 const end = Date.parse('2026-11-22T00:00:00+09:00');
 const keepsake = Date.parse('2026-11-23T00:00:00+09:00');
 const phase = now => now < start ? 'before' : now < party ? 'warmup' : now < end ? 'party' : now < keepsake ? 'keepsake' : 'after';
 if (typeof module !== 'undefined' && module.exports) {
  module.exports = {phase, start, party, night, end, keepsake};
  return;
 }
 const byId = id => document.getElementById(id);
 const room = byId('room');
 const dialog = byId('soheeDay');
 const gift = byId('soheeGift');
 const secret = byId('soheeSecret');
 const archive = byId('soheeArchive');
 const action = byId('soheeAction');
 const message = byId('soheeMessage');
 const progress = byId('soheeProgress');
 const birthdayAudio = byId('soheeBirthdayAudio');
 const birthdayButton = byId('soheeBirthdaySong');
 const songStatus = byId('soheeSongStatus');
 const records = byId('soheeRecords');
 const letter = byId('soheeLetter');
 const letterOpen = byId('soheeLetterOpen');
 const bgm = byId('soheeBgm');
 const bgmToggle = byId('soheeBgmToggle');
 const soundtrack = [
  "assets/audio/inside-my-life.mp3",
  "assets/audio/love-on-the-canvas.mp3",
  "assets/audio/made-the-night-magic.mp3",
  "assets/audio/wine-kiss.mp3"
 ];
 bgm.volume = .35;
 let trackIndex = 0;
 let attempted = false;
 function playBackground() {
  if (!soundtrack.length || document.hidden || !['warmup','party','keepsake'].includes(phase(Date.now()))) return;
  if (!bgm.getAttribute('src')) bgm.src = soundtrack[trackIndex];
  if (typeof pauseRoomMusic === 'function' && (roomMusicPlaying || roomMusicPending)) pauseRoomMusic(false);
  bgm.play().catch(() => { bgmToggle.textContent = '♫ 点一下播放背景音乐'; });
 }
 bgmToggle.addEventListener('click', () => {
  if (bgm.paused) { stopBirthdaySong(); playBackground(); } else bgm.pause();
 });
 bgm.addEventListener('ended', () => {
  trackIndex = (trackIndex + 1) % soundtrack.length;
  bgm.src = soundtrack[trackIndex];
  playBackground();
 });
 bgm.addEventListener('error', () => { bgmToggle.textContent = '♫ 背景音乐暂不可用'; });
 for (const event of ['play','pause']) bgm.addEventListener(event, () => {
  bgmToggle.textContent = bgm.paused ? '♫ 播放生日背景音乐' : 'Ⅱ 暂停生日背景音乐';
 });
 byId('roomMusicToggle').addEventListener('click', () => { if (soundtrack.length) bgm.pause(); });
 letterOpen.addEventListener('click', () => {
  if (Date.now() >= party && Date.now() < keepsake) letter.showModal();
 });
 byId('soheeLetterClose').addEventListener('click', () => letter.close());
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
  if (soundtrack.length) bgm.pause();
  if (typeof pauseRoomMusic === 'function') pauseRoomMusic(false);
  songStatus.hidden = true;
  birthdayAudio.play().catch(showSongError);
 });
 for (const event of ['play', 'pause', 'ended']) birthdayAudio.addEventListener(event, syncBirthdayButton);
 birthdayAudio.addEventListener('error', showSongError);
 records.addEventListener('toggle', () => { if (!records.open) stopBirthdaySong(); });
 dialog.addEventListener('close', stopBirthdaySong);
 document.addEventListener('visibilitychange', () => {
  if (document.hidden) { stopBirthdaySong(); if (soundtrack.length) bgm.pause(); }
 });

 const steps = ['挂好手写彩旗', '给蛋糕点一根蜡烛', '绑好礼物丝带'];
 const lines = ['旗子挂歪了一点点。豆兵说，这样才看得出是亲手挂的。', '豆兵护住小小的火苗。爸爸许愿的时候，要闭上眼睛哦。', '豆兵从丝带后探出头来。原来它把自己也打包进了礼物里！'];
 let mode = '';
 let storyStep = 0;
 let chime;
 const record = () => {
  const data = state.soheeDay2026;
  return {step: Number.isInteger(data?.step) && data.step >= 0 && data.step <= 3 ? data.step : 0, star: data?.star === true};
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
 function playChime(secretScene = false) {
  if (!byId('soheeSound').checked) return;
  try {
   chime ||= new AudioContext();
   chime.resume().then(() => {
    const notes = secretScene ? [698.46, 587.33, 440, 523.25] : [523.25, 659.25, 587.33, 783.99];
    notes.forEach((frequency, index) => {
     const time = chime.currentTime + .13 * index;
     const tone = chime.createOscillator();
     const gain = chime.createGain();
     tone.frequency.value = frequency;
     gain.gain.setValueAtTime(.001, time);
     gain.gain.exponentialRampToValueAtTime(.055, time + .024);
     gain.gain.exponentialRampToValueAtTime(.001, time + .28);
     tone.connect(gain).connect(chime.destination);
     tone.start(time);
     tone.stop(time + .3);
    });
   }).catch(() => {});
  } catch {}
 }
 function refresh() {
  const now = Date.now();
  const current = phase(now);
  const birthdayOpen = current === 'party';
  const active = ['warmup','party','keepsake'].includes(current);
  letterOpen.hidden = now < party || now >= keepsake;
  if (letterOpen.hidden && letter.open) letter.close();
  bgmToggle.hidden = !active || !soundtrack.length;
  if (active && soundtrack.length && !attempted && !document.hidden) { attempted = true; playBackground(); }
  if (!active && soundtrack.length && !bgm.paused) bgm.pause();
  if (!birthdayOpen && !birthdayButton.hidden) stopBirthdaySong();
  birthdayButton.hidden = !birthdayOpen;
  records.hidden = !birthdayOpen && current !== 'warmup';
  byId('soheeBirthdayHint').hidden = current !== 'warmup';
  const data = record();
  gift.hidden = !['warmup', 'party'].includes(current);
  archive.hidden = data.step < 3 && !data.star && current !== 'keepsake';
  secret.hidden = now < night || now >= end;
  room.classList.toggle('sohee-party', current === 'party');
  room.classList.toggle('sohee-night', !secret.hidden);
  room.dataset.soheeStep = String(data.step);
  const minutes = Math.max(0, Math.ceil((party - now) / 60000));
  byId('soheeCountdown').textContent = current === 'warmup'
   ? Math.floor(minutes / 1440) + '天 ' + Math.floor(minutes / 60) % 24 + '小时 ' + minutes % 60 + '分'
   : '拆开礼物';
 }
 function updateCard(line) {
  const current = phase(Date.now());
  const data = record();
  const tasksOpen = ['party', 'keepsake'].includes(current);
  dialog.dataset.scene = mode;
  byId('soheeArt').dataset.step = String(data.step);
  byId('soheeTitle').textContent = mode === 'secret' ? '窗边的小星星' : current === 'warmup' ? '豆兵的神秘礼物盒' : 'SOHEE DAY · 1121';
  byId('soheePhoto').hidden = mode === 'secret' || data.step !== 3;
  progress.hidden = mode === 'secret' || !tasksOpen;
  progress.textContent = '生日准备 ' + data.step + ' / 3';
  action.hidden = false;
  if (mode === 'secret') {
   message.textContent = ['豆兵扑扇着翅膀，轻轻落在窗台上。今天有很多很多人爱着爸爸。', '可是明天也会有哦。', 'SOHEE, YOU ARE LOVED.'][storyStep];
   action.textContent = ['再听一句', '望向夜空', data.star ? '星星已经收好' : '收藏这颗星星'][storyStep];
   action.hidden = storyStep === 2 && data.star;
  } else if (current === 'warmup') {
   message.textContent = '不可以偷看！11月21日再来，豆兵有事情想拜托你。';
   action.hidden = true;
  } else {
   message.textContent = line || (data.step === 3 ? '爸爸要一直幸福哦！小狐狸造型已经放进衣柜。' : tasksOpen ? '嘘，我们来把给爸爸的惊喜准备好吧。' : '那晚，豆兵在窗边收好了一颗小星星。');
   action.hidden = data.step !== 3 && !tasksOpen;
   action.textContent = data.step === 3 ? '去小相册看拍立得' : steps[data.step];
  }
 }
 function open(scene) {
  refresh();
  if (scene === 'secret') stopBirthdaySong();
  mode = scene;
  storyStep = 0;
  updateCard();
  if (!dialog.open) dialog.showModal();
 }
 gift.addEventListener('click', () => open('gift'));
 secret.addEventListener('click', () => { if (!secret.hidden) open('secret'); });
 archive.addEventListener('click', () => open('archive'));
 byId('soheeClose').addEventListener('click', () => dialog.close());
 action.addEventListener('click', () => {
  const data = record();
  if (mode === 'secret') {
   if (storyStep < 2) storyStep++;
   else if (!storeRecord({...data, star:true})) return;
   playChime(true);
   refresh();
   updateCard();
   return;
  }
  if (data.step === 3) {
   dialog.close();
   openMemoryAlbum('original', 'sohee-day-2026', archive);
   return;
  }
  if (!['party', 'keepsake'].includes(phase(Date.now()))) { refresh(); updateCard(); return; }
  if (!storeRecord({...data, step:data.step + 1})) return;
  playChime();
  refresh();
  updateCard(lines[data.step]);
 });
 byId('soheeReplay').addEventListener('click', () => open('secret'));
 function refreshAll() {
  const previous = room.dataset.soheePhase;
  refresh();
  room.dataset.soheePhase = phase(Date.now());
  if (dialog.open && mode !== 'secret' && previous !== room.dataset.soheePhase) updateCard();
  byId('soheeReplay').hidden = !record().star || mode === 'secret';
 }
 dialog.addEventListener('close', refreshAll);
 // Keep replay accessible whenever the archived star was earned.
 archive.addEventListener('click', refreshAll);
 gift.addEventListener('click', refreshAll);
 secret.addEventListener('click', refreshAll);
 byId('soheeReplay').addEventListener('click', refreshAll);
 refreshAll();
 setInterval(refreshAll, 1000);
 document.addEventListener('visibilitychange', refreshAll);
})();
