'use strict';
// Original pastel SVG keepsakes. No official artwork or additional character limbs.
const GACHA_ART={
 star:'<path d="m40 10 9 19 22 3-16 15 4 22-19-11-20 11 4-22L8 32l23-3Z" fill="#f5dfab"/><path d="m24 38 8-2m15 0 8 2" fill="none" stroke="#fff3d3"/>',
 strawberry:'<path d="M17 31q2-18 22-13 23-5 24 14 2 18-19 34-7 5-14-1-17-16-13-34Z" fill="#edbac8"/><path d="m39 25-13-12 1 13-13 2 19 9 7-8 8 8 18-10-13-1 2-13Z" fill="#c8dcb8"/><path d="m28 44 2 3m13-7 1 3m10 3-2 3m-13 8 1 3" stroke="#fff2d1"/>',
 wing:'<path d="M65 25q-20-9-38 0Q8 31 13 49q3 8 11 0-3 15 6 12 5-1 7-7-1 14 8 8 9-8 12-20Z" fill="#fffaf0"/><path d="M33 32q9-5 20-5" fill="none" stroke="#e1d4c3"/>',
 mic:'<path d="m35 36-4 31q1 6 8 6 6-1 6-6l-1-30Z" fill="#d4c6d6"/><ellipse cx="40" cy="25" rx="17" ry="20" fill="#bdcbd5"/><path d="m29 17 22 10m-24-3 22 11m-13-25-8 25m17-24-9 28m14-23-9 23" fill="none" stroke="#edf2ee"/><path d="M34 54h10" fill="none"/>',
 ribbon:'<path d="M39 32Q9 7 9 30q-1 24 30 10 30 20 32-5 2-28-32-3Z" fill="#efc5d5"/><path d="m38 39-15 26 15-4 4 10 8-26m-7-7 16 25 1-12 11 3-19-18" fill="#f6d8e2"/><ellipse cx="41" cy="36" rx="8" ry="10" fill="#edbaca"/>',
 ticket:'<path d="M6 20 71 14 75 59 11 66 9 52q8-7-2-13Z" fill="#f3d9e1"/><path d="m26 20 4 41" fill="none" stroke-dasharray="3 3"/><text x="48" y="37" text-anchor="middle" font-family="monospace" font-size="12" fill="#a48c96" stroke="none">252</text><text x="49" y="50" text-anchor="middle" font-size="5" fill="#a48c96" stroke="none">ADMIT ONE</text>',
 record:'<path d="M8 12 69 9 72 69 10 71Z" fill="#dce8ee"/><circle cx="41" cy="39" r="25" fill="#bdc2cd"/><circle cx="41" cy="39" r="16" fill="#d6d7df"/><circle cx="41" cy="39" r="8" fill="#f5e7c6"/><circle cx="41" cy="39" r="2" fill="#b5a6ad"/><text x="41" y="66" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#a48c96" stroke="none">RIIZE</text>',
 trophy:'<path d="M25 19h31q2 27-15 32-19-4-16-32Z" fill="#f4dfad"/><path d="M25 24H13q0 22 18 20m25-20h12q0 22-18 20M41 51v12m-15 7h30l-5-8H31Z" fill="#f8e9c5"/><path d="m40 25 2 5 6 1-4 4 1 6-5-3-6 3 1-6-4-4 6-1Z" fill="#fff3d3"/>',
 frame:'<path d="M9 11 72 14 68 72 7 68Z" fill="#dcebf0"/><path d="M17 22 63 24 61 57 16 55Z" fill="#fff5dc"/><path d="m40 28 4 8 9 1-6 6 1 9-8-5-8 4 2-9-7-6 9-1Z" fill="#edd6e0"/><path d="m35 13-2-10 8 6 6-7 2 9 9-3-3 11Z" fill="#f5e3aa"/>',
 devil:'<path d="M20 28 16 9l17 13q10-4 20 0L66 9l-3 24q7 25-22 34Q12 59 20 28Z" fill="#e5d1e5"/><path d="m28 36 8 4m15-4-8 4M31 49q11 9 21-2" fill="none"/><path d="m40 13 2 5 6 1-5 3 1 6-4-4-5 4 1-6-4-3 6-1Z" fill="#f8e3ac"/>',
 cosmos:'<path d="M9 12 69 10 72 69 10 71Z" fill="#d7deed"/><ellipse cx="40" cy="40" rx="15" ry="17" fill="#f0d8df"/><path d="M17 47q24-25 46-13 2 7-21 12-17 5-25 1Z" fill="#f6e7be"/><path d="m22 23 2 4 5 1-5 2-1 5-2-5-4-1 4-2m39 27 2 4 4 1-4 2-2 5-2-5-4-2 4-1Z" fill="#fff6d4"/>',
 crown:'<path d="m13 58-6-32 19 13L41 13l11 25 21-14-8 35Z" fill="#f8e4ad"/><path d="m13 58 52 1-1 10H14Z" fill="#f3d3de"/><circle cx="41" cy="48" r="4" fill="#dfc6e2"/><path d="m26 55 4-5m23 4 3-4" stroke="#fff4d5" fill="none"/>'
};
const GACHA_ITEMS=[
 {id:'star-sticker',name:'星星贴纸',rarity:'common',art:'star',photoSticker:true},
 {id:'strawberry-sticker',name:'草莓贴纸',rarity:'common',art:'strawberry',photoSticker:true},
 {id:'wing-sticker',name:'豆兵小翅膀贴纸',rarity:'common',art:'wing',photoSticker:true},
 {id:'mini-mic',name:'迷你麦克风',rarity:'common',art:'mic'},
 {id:'pink-ribbon',name:'粉色蝴蝶结',rarity:'common',art:'ribbon',photoSticker:true},
 {id:'ticket-252',name:'252复古门票',rarity:'rare',art:'ticket'},
 {id:'riize-record',name:'RIIZE迷你唱片',rarity:'rare',art:'record'},
 {id:'super-trophy',name:'SUPER STAR奖杯',rarity:'rare',art:'trophy'},
 {id:'personal-frame',name:'豆兵专属相框',rarity:'rare',art:'frame'},
 {id:'devil-star',name:'恶魔级明星限定贴纸',rarity:'special',art:'devil',photoSticker:true},
 {id:'cosmic-card',name:'宇宙舞台纪念卡',rarity:'special',art:'cosmos'},
 {id:'birthday-crown',name:'豆兵生日皇冠',rarity:'special',art:'crown',photoSticker:true}
];
function gachaIcon(item){return '<svg viewBox="0 0 80 80" aria-hidden="true" focusable="false"><g stroke="#bca9aa" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">'+GACHA_ART[item.art]+'</g></svg>';}
