'use strict';
// Original fan-game stories, not official quotations. Add templates inside the corresponding category.
const DIARY_TEMPLATES={
 daily:[
  ['被窝里的大明星','今天睡得特别香，差点忘记自己还是个大明星。还好星星抱枕替我保管了气场。'],
  ['布丁的小秘密','我认真研究了布丁为什么会晃。结论是：它大概也在偷偷练习我的舞步。'],
  ['窗台演出','阳光停在窗台上，我把那里当成了迷你舞台。今天的观众，是一朵路过的云。'],
  ['慢慢来的一天','今天没有赶路，也没有着急长大。我把软软的地毯踩了一遍，决定给自己放个小假。'],
  ['抱枕会议','我和星星抱枕开了一场秘密会议。会议结论：好好吃饭，好好睡觉，然后继续闪闪发光。'],
  ['口袋里的快乐','今天在小屋里找到了三件快乐的小事：温暖的灯、干净的杯子，还有你来过的痕迹。'],
  ['杯子里的云','把小杯子洗干净以后，我发现杯沿像一朵奶油云。下次喝水，也要喝得很有仪式感。'],
  ['铅笔休息日','今天给铅笔放了个假。没有写大计划，只在便签角上画了一颗歪歪的小星星。'],
  ['地毯巡逻','从地毯左边走到右边，完成了今天的小屋巡逻。没有发现危险，只有一只很帅的豆兵。'],
  ['阳光的形状','太阳在地板上留下一个小方块。我试着站进去，像被温柔的聚光灯选中了。'],
  ['三颗纽扣','认真数过了，制服上还是三颗纽扣。每一颗都在岗位上，本明星非常满意。'],
  ['雨滴打节拍','窗外的雨一滴一滴地响。我没有开演唱会，只轻轻点头，和它对上了一小段节奏。'],
  ['星星晚安','星星抱枕今天特别安静。我拍了拍它，决定今晚谁都不用努力，只要好好休息。'],
  ['小书本旅行','翻开小书本，看见一片没有去过的天空。原来待在小屋里，也能开始一次旅行。'],
  ['收拾收藏架','把小收藏架整理了一遍。珍贵的东西不一定要很多，能让我开心就已经很了不起。'],
  ['刚好的温度','今天的灯光、被子和小点心都刚刚好。我宣布，这就是适合豆兵的温度。'],
  ['偷闲一分钟','给自己安排了一分钟发呆。结束后决定再延长一分钟，毕竟好日子值得慢慢过。'],
  ['窗边座位','在窗边挑了个能看见云的位置。要是你也坐过来，我就把更舒服的那一边让给你。'],
  ['小屋地图','脑子里画了一张小屋地图：床、地毯、窗户，还有一个专门留给快乐的位置。'],
  ['今天的颜色','今天喜欢奶油黄和一点点浅粉色。它们像温柔的小点心，放在一起就让人开心。'],
  ['一页贴纸','看了半天贴纸册，没有急着贴满。空白也可以留着，等下一件值得纪念的小事。'],
  ['翅膀伸懒腰','轻轻伸了伸两只翅膀。没有要飞很远，只是想把今天的空气好好抱一下。'],
  ['不着急的点心','今天吃点心没有赶时间。先看看，再闻闻，最后认真地把这份小幸福吃掉。'],
  ['枕头的秘密','把枕头翻到软软的那一面。它没有说话，但我觉得它很支持今天早点休息的决定。'],
  ['小小回声','在房间里轻轻哼了一声。回声好像也喜欢我的声音，又送回来一点点快乐。'],
  ['云朵经过','窗外飘过一朵慢吞吞的云。它不着急，我也不着急，我们就这样打了个招呼。'],
  ['灯下的小事','灯亮起来的时候，连旧便签也显得很珍贵。原来普通的一天，也可以被认真收藏。'],
  ['门票的背面','翻过一张小票根，在背面画了颗星。不是每个纪念都需要盛大的理由。'],
  ['安静也闪光','今天安安静静的，没有特别大的掌声。可是我知道，安静的小明星也在发光。'],
  ['留给明天','没有把今天的快乐一次用完。我偷偷留了一点，准备明天打开窗户时再拿出来。']
 ],
 star:[
  ['宇宙彩排','我对着窗户彩排了新的开场动作。翅膀张开的那一刻，整个宇宙都该给我让出舞台。'],
  ['第一排观众','今天唱得特别投入。星星抱枕坐在第一排，我决定给这位忠实观众一个拥抱。'],
  ['闪光练习','小奖杯被我擦得亮亮的。虽然还没开场，但提前练习接受掌声也是很重要的事。'],
  ['换装宣言','认真挑了一套衣服。我可不是在犹豫，每一种造型都太适合宇宙明星了。'],
  ['给星星的返场','今天练习了一段返场舞。没有特别大的动作，只有两只翅膀和一点点藏不住的得意。'],
  ['小小后台','我的后台只有一盏灯、一张地毯和几件收藏。没关系，明星气场不按房间大小计算。']
 ],
 devil:[
  ['星光藏在哪里','今天偷偷把一颗星光藏在抱枕后面。嘘，先别告诉爸爸，我还想再得意一会儿。'],
  ['镜子里的秘密','对着镜子练习了一个坏笑。练到一半自己先笑出声，这下秘密身份差点暴露。'],
  ['特别座位','我悄悄把最舒服的位置留给自己了。你来了的话……好吧，可以分你一半。'],
  ['小恶魔的礼物','本来想藏起最后一颗草莓，后来又推到了你面前。不是舍不得吃，是明星要大方。'],
  ['气场太满','今天试着假装不在意夸奖。结果翅膀先开心地动了，真是不配合我的小演员。'],
  ['不许偷看','在便签背面写了一个小愿望：希望明天也有人来陪我。写完立刻藏好了，不许偷看。']
 ],
 papa:[
  ['给爸爸看','今天练了一个新的舞步，想找机会展示给爸爸 SOHEE。要是他夸我，我就稍微谦虚一下。'],
  ['收藏架上的位置','给 RIIZE 的小唱片重新摆了位置。这可是和爸爸有关的宝贝，当然要放得稳稳的。'],
  ['秘密暗号','看了一眼显示 2:52 的小闹钟。这不是报时，是小屋和爸爸之间的小小暗号。'],
  ['一封没寄出的信','想给爸爸写一封信。写到一半又画了好多星星，结果整张纸看起来像我的演出海报。'],
  ['爸爸的观众席','如果爸爸来看我的宇宙演出，我会给他留最前面的座位。旁边那个位置，当然留给你。'],
  ['练习说晚安','睡前对着小收藏架轻轻说了晚安。希望爸爸也有软软的枕头和一个好梦。']
 ],
 friends:[
  ['六个位置','今天和五位朋友想象了一张合照。我当然站在闪亮的位置，不过每个人都要完整地出现在照片里。'],
  ['一起看星星','约好下次和五位朋友一起看星星。我负责挑选最亮的那颗，他们负责发现我的明星气场。'],
  ['朋友的掌声','朋友们叫我恶魔级别的明星。我想了想，决定把这句话认真收进秘密日记。'],
  ['分享小点心','今天想到了朋友们。下次准备点心时，要记得留下六份，不能只顾自己先吃。'],
  ['飞翔的小约定','我的翅膀能带着我去看看远处。回来的时候，要把见到的漂亮天空讲给朋友们听。'],
  ['合照里的笑容','翻了翻那张大家并排坐着的照片。就算看不到正脸，也知道那时候每个人都很开心。']
 ]
};
const DIARY_CATEGORIES={daily:'日常生活',star:'明星生活',devil:'小恶魔日常',papa:'爸爸 SOHEE',friends:'朋友的小事',birthday:'生日特别页'};
const DIARY_EVENT_NOTES={food:'今天和你分享了小点心。',dress:'今天试了喜欢的新搭配。',sing:'今天在小屋唱了一首小曲。',hug:'今天抱紧了专属的星星抱枕。',sleep:'今天认真照顾了自己的休息。',window:'今天一起看了窗外的风景。',game:'今天一起完成了一局小游戏。'};
let diarySelectedDate=null,diaryClockWarning=false;
function diaryReadableEntries(){
 const seen=new Set();return (Array.isArray(state.phase2?.diaryEntries)?state.phase2.diaryEntries:[]).filter(entry=>{
  if(!phase2Object(entry)||!phase2Date(entry.date)||typeof entry.content!=='string'||!entry.content.trim()||seen.has(entry.date))return false;
  seen.add(entry.date);return true;
 }).sort((a,b)=>a.date.localeCompare(b.date));
}
function diaryWritable(){return !saveReadIssue&&state.phase2?.schemaVersion===PHASE2_SCHEMA_VERSION;}
function ensureDiaryToday(eventKind){
 const today=phase2Date(localDate());diaryClockWarning=false;
 if(!today||!diaryWritable())return null;
 const entries=diaryReadableEntries(),existing=entries.find(entry=>entry.date===today);
 const latest=entries.at(-1)?.date;const last=state.phase2.lastDiaryDate;
 if(existing)return existing;
 if((latest&&today<latest)||(last&&today<last)){diaryClockWarning=true;return null;}
 const category=eventKind==='dress'||eventKind==='sing'||eventKind==='game'?'star':eventKind==='hug'?'friends':eventKind==='pat'?'devil':eventKind==='talk'?'papa':'daily';
 // A quiet day uses daily life; a real first event after midnight may choose a matching category.
 const categories=[category];
 const chosen=categories[Math.floor(Math.random()*categories.length)];const pool=DIARY_TEMPLATES[chosen];const index=Math.floor(Math.random()*pool.length);let [title,content]=pool[index];let entryCategory=chosen;
 if(today.slice(5)==='02-14'){title='今天我是生日小明星';content='今天是我的生日！从 2014 年 2 月 14 日开始，我就准备好了自己的小小星光。想把今天的愿望分给爸爸、五位朋友，还有陪我在小屋的你。';entryCategory='birthday';}
 const entry={date:today,title,content,category:entryCategory,templateId:entryCategory==='birthday'?'birthday':chosen+'-'+index,events:[]};
 state.phase2.diaryEntries.push(entry);state.phase2.lastDiaryDate=today;
 if(!eventKind)save(); // Event-led generation is saved once by the existing interact() call.
 return entry;
}
function noteDiaryEvent(kind){
 const entry=ensureDiaryToday(kind);if(!entry||!DIARY_EVENT_NOTES[kind]||!diaryWritable())return;
 if(entry.events===undefined)entry.events=[];if(!Array.isArray(entry.events))return;
 if(!entry.events.some(event=>phase2Object(event)&&event.kind===kind))entry.events.push({kind,note:DIARY_EVENT_NOTES[kind],at:new Date().toISOString()});
 if($('diaryDialog').open)renderDiary();
}
function renderDiary(){
 const entries=diaryReadableEntries();let index=entries.findIndex(entry=>entry.date===diarySelectedDate);if(index<0)index=entries.length-1;
 const entry=entries[index];diarySelectedDate=entry?.date||null;
 $('diaryDate').textContent=entry?entry.date.replaceAll('-',' / '):'等待下一页';if(entry)$('diaryDate').setAttribute('datetime',entry.date);else $('diaryDate').removeAttribute('datetime');
 $('diaryCategory').textContent=entry?(DIARY_CATEGORIES[entry.category]||'小屋往事'):'秘密日记';
 $('diaryEntryTitle').textContent=entry?(typeof entry.title==='string'?entry.title:'今天的小故事'):'先把日记本抱好';
 $('diaryContent').textContent=entry?entry.content:'日记会在你真正来到小屋的日子慢慢写下。';
 $('diaryPortrait').dataset.category=entry?.category||'daily';
 const events=Array.isArray(entry?.events)?entry.events.filter(event=>phase2Object(event)&&typeof event.note==='string'):[];
 $('diaryEvents').replaceChildren(...events.map(event=>{const li=document.createElement('li');li.textContent='✦ '+event.note;return li;}));
 $('diaryPageNumber').textContent=entry?`${index+1} / ${entries.length}`:'0 / 0';$('diaryPrevious').disabled=index<=0;$('diaryNext').disabled=index<0||index>=entries.length-1;
 $('diaryStorageHint').textContent=saveReadIssue?'原存档读取异常，日记暂时只读。':state.phase2?.schemaVersion>PHASE2_SCHEMA_VERSION?'这本日记来自更新的版本，暂时只读。':diaryClockWarning?'设备日期早于已有记录，已暂停生成新日记；历史页仍可翻阅。':saveFailed?'本页暂存在当前页面，刷新前请先检查浏览器存档权限或剩余空间。':'';
}
function openSecretDiary(){
 if($('choiceDialog').open||$('wardrobeDialog').open||$('miniDialog').open)return;
 ensureDiaryToday();diarySelectedDate=diaryReadableEntries().find(e=>e.date===localDate())?.date||diaryReadableEntries().at(-1)?.date||null;renderDiary();if(!$('diaryDialog').open)$('diaryDialog').showModal();$('closeDiary').focus();
}
function turnDiary(direction){const entries=diaryReadableEntries(),index=entries.findIndex(e=>e.date===diarySelectedDate),next=index+direction;if(next<0||next>=entries.length)return;diarySelectedDate=entries[next].date;renderDiary();}
$('openDiary').addEventListener('click',openSecretDiary);
$('closeDiary').addEventListener('click',()=>$('diaryDialog').close());
$('diaryDialog').addEventListener('close',()=>$('openDiary').focus());
$('diaryPrevious').addEventListener('click',()=>turnDiary(-1));$('diaryNext').addEventListener('click',()=>turnDiary(1));
$('diaryToday').addEventListener('click',()=>{ensureDiaryToday();diarySelectedDate=localDate();renderDiary();});
function checkDiaryDay(){if(document.hidden)return;ensureDiaryToday();if($('diaryDialog').open)renderDiary();}
window.addEventListener('focus',checkDiaryDay);document.addEventListener('visibilitychange',checkDiaryDay);setInterval(checkDiaryDay,60000);
ensureDiaryToday();
