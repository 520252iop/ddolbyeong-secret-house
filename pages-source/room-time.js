'use strict';
// Local-time atmosphere only. Automatic refresh never calls interact() or save().
const ROOM_TIME_LABELS={morning:'清晨',day:'白天',evening:'傍晚',night:'夜晚'};
const ROOM_TIME_MODES={auto:'自动跟随本地时间',day:'手动白天',night:'手动夜晚'};
function roomPeriodAt(date=new Date()){
 const hour=date.getHours();if(!Number.isFinite(hour))return 'day';
 return hour>=6&&hour<11?'morning':hour>=11&&hour<18?'day':hour>=18&&hour<22?'evening':'night';
}
function currentRoomTimeMode(){const mode=state.phase2?.roomTimeMode;return Object.hasOwn(ROOM_TIME_MODES,mode)?mode:'auto';}
function resolvedRoomPeriod(date=new Date()){const mode=currentRoomTimeMode();return mode==='auto'?roomPeriodAt(date):mode;}
function syncRoomTime(){
 const period=resolvedRoomPeriod(),mode=currentRoomTimeMode(),room=$('room'),sky=$('window');
 if(room.dataset.roomPeriod!==period)room.dataset.roomPeriod=period;
 const weather=['sunny','rainy','night'].includes(state.weather)?state.weather:'sunny';
 const windowPeriod=weather==='night'?'night':period;
 const symbol=weather==='rainy'?'☂':windowPeriod==='night'?'☾':windowPeriod==='evening'?'☼':'☀';
 $('skySymbol').textContent=symbol;
 const windowLabel=weather==='night'?'夜景预览':weather==='rainy'?'雨天':ROOM_TIME_LABELS[windowPeriod]+'天空';
 sky.setAttribute('aria-label',`窗户：小屋${ROOM_TIME_LABELS[period]}，窗景${windowLabel}；点击切换窗景`);
 if(typeof syncWallSwitch==='function')syncWallSwitch();
 const button=$('roomTimeSettings');button.textContent=`${period==='night'?'☾':'☼'} ${ROOM_TIME_LABELS[period]} · ${mode==='auto'?'自动':'手动'}`;
 button.setAttribute('aria-label',`小屋昼夜设置：${ROOM_TIME_MODES[mode]}，当前${ROOM_TIME_LABELS[period]}${saveFailed?'，设置尚未存档':''}`);
}
function setRoomTimeMode(mode){
 if(!Object.hasOwn(ROOM_TIME_MODES,mode)||saveReadIssue||state.phase2?.schemaVersion!==PHASE2_SCHEMA_VERSION)return false;
 if(state.phase2.roomTimeMode!==mode){state.phase2.roomTimeMode=mode;save();}
 syncRoomTime();return true;
}
function openRoomTimeSettings(){
 if($('choiceDialog').open||$('wardrobeDialog').open||$('miniDialog').open||$('diaryDialog').open)return;
 const period=resolvedRoomPeriod();
 if(saveReadIssue||state.phase2?.schemaVersion!==PHASE2_SCHEMA_VERSION){openDialog('小屋昼夜','当前存档暂时只读，仍会显示本地时间氛围；为保护原数据，本次不更改设置。',[]);return;}
 openDialog('小屋昼夜',`现在是${ROOM_TIME_LABELS[period]}。自动模式使用你的设备本地时间。\n清晨 06:00–10:59 · 白天 11:00–17:59\n傍晚 18:00–21:59 · 夜晚 22:00–05:59\n点击窗户仍可独立预览雨天或夜景，不会改变整间小屋的昼夜模式。`,Object.entries(ROOM_TIME_MODES).map(([mode,label])=>({label,selected:currentRoomTimeMode()===mode,run(){setRoomTimeMode(mode);}})));
}
$('roomTimeSettings').addEventListener('click',openRoomTimeSettings);
function refreshRoomTime(){if(!document.hidden)syncRoomTime();}
window.addEventListener('focus',refreshRoomTime);document.addEventListener('visibilitychange',refreshRoomTime);setInterval(refreshRoomTime,60000);
syncRoomTime();
