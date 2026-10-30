'use strict';
// Stage 1 only: additive data foundation. No gameplay, timers, unlocks or diary generation.
const PHASE2_SCHEMA_VERSION=1;
function phase2Object(value){return value!==null&&typeof value==='object'&&!Array.isArray(value);}
function phase2Date(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
 const date=new Date(value+'T12:00:00');return Number.isFinite(date.getTime())&&localDate(date)===value?value:null;
}
function normalisePhase2Data(value){
 const raw=phase2Object(value)?value:{};
 // A newer namespace belongs to newer code: never downgrade or reinterpret its fields.
 if(Number.isSafeInteger(raw.schemaVersion)&&raw.schemaVersion>PHASE2_SCHEMA_VERSION)return raw;
 const photo=phase2Object(raw.photoSettings)?raw.photoSettings:{};
 return {
  ...raw,
  schemaVersion:PHASE2_SCHEMA_VERSION,
  diaryEntries:Array.isArray(raw.diaryEntries)?raw.diaryEntries:[],
  lastDiaryDate:phase2Date(raw.lastDiaryDate),
  gachaInventory:phase2Object(raw.gachaInventory)?raw.gachaInventory:{},
  gachaLastFreeDate:phase2Date(raw.gachaLastFreeDate),
  unlockedStickers:Array.isArray(raw.unlockedStickers)?raw.unlockedStickers:[],
  photoSettings:{...photo,
   expression:typeof photo.expression==='string'?photo.expression:'neutral',
   pose:typeof photo.pose==='string'?photo.pose:'stand',
   background:typeof photo.background==='string'?photo.background:'room',
   frame:typeof photo.frame==='string'?photo.frame:'cream',
   stickers:Array.isArray(photo.stickers)?photo.stickers:[]
  },
  roomTimeMode:['auto','day','night'].includes(raw.roomTimeMode)?raw.roomTimeMode:'auto',
  concertRecords:Array.isArray(raw.concertRecords)?raw.concertRecords:[],
  mischiefRecords:raw.mischiefRecords===undefined?[]:raw.mischiefRecords,
  mischiefLastAt:raw.mischiefLastAt===undefined?null:raw.mischiefLastAt,
  friendObjects:raw.friendObjects===undefined?{version:1,dinoLight:false,stoneStack:0}:raw.friendObjects,
  audioSettings:raw.audioSettings===undefined?{version:1,enabled:false,volume:.35}:raw.audioSettings
 };
}
function initPhase2Data(){
 const next=normalisePhase2Data(state.phase2);
 if(JSON.stringify(next)!==JSON.stringify(state.phase2)){state.phase2=next;save();}
 return state.phase2;
}
initPhase2Data();
