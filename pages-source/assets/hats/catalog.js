'use strict';
// 外部配饰目录。深灰高筒是永久头部；classic 仅表示脱帽，不再绘制替代头部。
// back 放在身体后方（长耳/编绳），front 放在头部上方。__UID__ 在每次绘制时替换，避免裁切 ID 冲突。
const HAT_COLLECTION = [
 {id:'classic',name:'经典原生造型（不戴帽）',detail:'永久深灰高筒头部 · 完整保留原版轮廓',viewBox:'35 10 190 160',back:'',front:''},
 {id:'striped-cat',name:'蓝白条纹小猫帽',detail:'海军蓝奶白条纹 · 双尖猫耳 · 厚厚针织卷边',viewBox:'25 12 220 157',back:'',front:`
 <defs><clipPath id="__UID__cat"><path d="M54 147 44 35q-1-17 16-10l36 23q35-13 70-1l35-23q17-8 15 12l-9 112q-74-12-153-1Z"/></clipPath></defs>
 <path d="M54 147 44 35q-1-17 16-10l36 23q35-13 70-1l35-23q17-8 15 12l-9 112q-74-12-153-1Z" fill="#293e68" stroke="#505366" stroke-width="3"/>
 <g clip-path="url(#__UID__cat)" fill="none" stroke="#f5f0df" stroke-width="12"><path d="M40 45q85 32 181-3M42 77q87 22 175-2M47 110q83 15 166-3"/></g>
 <path d="m52 38 18 13m137-13-17 13" stroke="#f1e8d6" stroke-width="4" stroke-linecap="round"/>
 <path d="M53 128q80-13 154 0l1 24q-76-11-155 1Z" fill="#30486d" stroke="#505366" stroke-width="3"/>
 <path d="M58 136q72-11 143 0" fill="none" stroke="#f5f0df" stroke-width="6"/>
 <path d="m67 143 2 8m11-9 2 8m11-9 2 8m11-9 2 8m11-9 2 8m11-9 2 8m11-9 2 8m11-8 2 8m11-7 2 8m11-7 2 8" stroke="#62738c" stroke-width="2"/>
 <rect x="188" y="128" width="12" height="18" rx="3" fill="#fff7e4"/><path d="m192 142 2-9 2 9" stroke="#556779" fill="none" stroke-width="1.5"/>`},
 {id:'fluffy-aviator',name:'灰白毛绒飞行帽',detail:'灰白毛绒 · 包耳护罩 · 黑白编织垂绳',viewBox:'23 36 214 242',back:`
 <path d="M58 135q-19 8-17 41l2 47q10 16 23-1l4-76m120-10q20 5 20 39l-1 50q-11 13-23-2l-1-76" fill="#d6d6d3" stroke="#747579" stroke-width="3"/>
 <path d="m47 171 14-8m-15 25 14-8m-13 25 13-8m135-27 11 9m-11 9 11 9m-11 10 10 8" stroke="#686e75" stroke-width="6"/>
 <g fill="none" stroke-linecap="round"><path d="M54 220q-16 21-16 43m161-41q17 17 20 41" stroke="#4b5058" stroke-width="8"/><path d="m49 229 5 4m-11 5 7 4m-10 5 7 4m-9 5 7 4m156-26 6-4m-2 14 7-4m-2 15 7-4m-1 14 6-4" stroke="#faf6ea" stroke-width="5"/><path d="m37 263-4 9m5-9 3 10m177-10-1 11m3-11 6 9" stroke="#747579" stroke-width="2"/></g>`,front:`
 <path d="M55 145q-8-56 13-76 57-39 117-4 23 19 20 79Z" fill="#92969b" stroke="#747579" stroke-width="3"/>
 <path d="M65 88q66-26 130 0M59 111q71-24 141-1" stroke="#e7e5df" stroke-width="9" fill="none"/>
 <path d="M80 66q10-10 22-7m13-4h24m14 3q14 1 23 8" stroke="#c4c6c3" stroke-width="5" stroke-linecap="round" fill="none"/>
 <path d="M53 119q-3-7 5-10-1-9 8-9 1-9 9-5 7-9 13-3 7-8 14-2 7-7 15-2 8-5 15 0 9-7 17 0 7-6 15 1 9-4 14 4 10-2 12 7 9 1 8 10 9 2 4 11l-1 21q-34-9-69-7-38-2-77 8Z" fill="#f6f4e9" stroke="#c0c1bb" stroke-width="2.5"/>
 <path d="m65 118 2 9m13-16 3 10m14-14 2 9m14-11 2 9m14-10 1 9m15-8 1 8m14-4 2 7m13-3 2 8" stroke="#dcded7" stroke-width="3" stroke-linecap="round"/>`},
 {id:'striped-beanie',name:'蓝白针织帽',detail:'圆顶短帽型 · 海军蓝白条纹 · 宽针织翻边',viewBox:'29 45 202 122',back:'',front:`
 <defs><clipPath id="__UID__beanie"><path d="M55 144q-5-38 13-62 22-25 61-25 45 0 66 27 16 22 10 60Z"/></clipPath></defs>
 <path d="M55 144q-5-38 13-62 22-25 61-25 45 0 66 27 16 22 10 60Z" fill="#32486b" stroke="#535769" stroke-width="3"/>
 <g clip-path="url(#__UID__beanie)" stroke="#f5eddb" stroke-width="10" fill="none"><path d="M56 76q76 22 147 1M51 100q81 19 157 1M51 124q80 16 157 0"/></g>
 <path d="M54 126q76-10 152 0l2 28q-78-11-156 0Z" fill="#2c4165" stroke="#535769" stroke-width="3"/>
 <path d="M56 137q75-9 148 0" stroke="#efe9db" stroke-width="8" fill="none"/>
 <path d="m65 129-1 24m12-26-1 25m13-26-1 25m14-26-1 25m14-26v25m14-25v24m14-24v25m14-25v25m13-24 1 25m12-24 1 25m11-23 1 24" stroke="#7d8aa0" stroke-width="1.4"/>
 <rect x="182" y="134" width="13" height="17" rx="2" fill="#fff6e6"/><path d="m186 147 2-8 3 8" stroke="#425673" stroke-width="1.4" fill="none"/>`},
 {id:'white-bunny',name:'白色兔耳帽',detail:'奶白毛绒 · 两侧柔软长耳 · 圆圆蓬松帽顶',viewBox:'20 43 220 237',back:`
 <path d="M62 123q-22 11-24 48l-7 72q1 27 18 22c17-3 15-23 15-42l10-85m114-15q25 9 29 46l12 71q3 28-15 27c-18-1-18-22-20-40l-11-89" fill="#fffdf1" stroke="#c6bfb5" stroke-width="3"/>
 <path d="M51 171q-4 38-5 69m159-70 10 70" stroke="#f0dce0" stroke-width="10" stroke-linecap="round" fill="none"/>
 <path d="m34 245 4 3m-3 7 5 1m181-12 5-2m-4 10 5-2" stroke="#d9d0c4" stroke-width="2"/>`,front:`
 <path d="M54 146q-3-7 0-14-5-8 1-15-4-8 4-14-2-10 7-13 1-10 11-12 3-11 15-10 5-11 17-7 9-9 21-3 11-6 20 1 12-3 18 7 12 0 16 11 11 2 11 13 10 4 7 15 9 7 4 15 6 9 0 17l-1 15q-76-13-151 0Z" fill="#fffdf3" stroke="#c6bfb5" stroke-width="3"/>
 <path d="M56 135q73-10 149 0v19q-75-10-150 0Z" fill="#f4f0e5" stroke="#d1c9bc" stroke-width="2"/>
 <path d="m65 138 3 9m13-11 2 9m15-10 1 9m15-10 1 9m15-9v9m15-9-1 9m15-8-1 9m15-7-1 9m13-6-2 9" stroke="#e1ddd2" stroke-width="2.5" stroke-linecap="round"/>`},
 {id:'red-baseball',name:'红色棒球帽',detail:'正红帽身 · 白色 S 装饰 · 侧弯曲帽檐',viewBox:'13 48 228 116',back:'',front:`
 <path d="M62 137q-8-70 38-79 49-12 82 12 21 21 17 64Z" fill="#d9414b" stroke="#95464d" stroke-width="3"/><path d="M160 64q30 14 36 36l3 34-26 1q0-39-13-71Z" fill="#c83443"/>
 <ellipse cx="129" cy="56" rx="8" ry="4" fill="#bc3242" stroke="#95464d" stroke-width="2"/>
 <path d="M129 61q-14 23-11 68m17-68q30 16 39 67" fill="none" stroke="#ef7378" stroke-width="2"/>
 <path d="M65 130q-20 5-30 19-3 9 21 7l95-13 48-7q-57-13-134-6Z" fill="#e64c54" stroke="#95464d" stroke-width="3"/>
 <path d="M37 150q25-12 71-14" fill="none" stroke="#f68688" stroke-width="2"/>
 <path d="m143 76-10 9 13 13-13 16-19 2 3-10 17-2-12-14 11-14Z" fill="#fff6e8" stroke="#fff6e8" stroke-width="1.5"/>
 <text x="76" y="112" font-family="sans-serif" font-size="6" fill="#fff0da">EST. 2003</text><circle cx="158" cy="109" r="1.5" fill="#fff0da"/><circle cx="167" cy="103" r="1.5" fill="#fff0da"/>`},
 {id:'blue-knit',name:'蓝色针织帽',detail:'鲜蓝长圆顶 · 细罗纹 · 浅色手写字母',viewBox:'30 28 201 139',back:'',front:`
 <path d="M57 151q-9-52 7-83 8-23 28-26l13-6 27 3q30-7 49 18 26 28 22 94-76-12-146 0Z" fill="#208bc9" stroke="#42728c" stroke-width="3"/>
 <path d="M76 65q-8 37-6 75m18-85q-9 38-8 84m20-91q-7 40-7 90m21-92-8 90m22-91-8 91m23-90-7 91m21-86-5 88m19-78-5 80m16-59-2 61" fill="none" stroke="#54a8d3" stroke-width="1.3" opacity=".7"/>
 <path d="M58 140q73-9 144 0l1 13q-74-11-146 0Z" fill="#208bc9" stroke="#42728c" stroke-width="2"/>
 <text x="86" y="108" fill="#2587c1" stroke="#e4eff0" stroke-width="1" font-family="cursive" font-weight="bold" font-style="italic" font-size="30" transform="rotate(-8 130 95)">Lazy</text>`},
 {id:'era-baseball',name:'New Era 风格棒球帽',detail:'藏蓝立体帽冠 · 红色 B 刺绣 · 平直长帽檐',viewBox:'15 40 230 124',back:'',front:`
 <path d="M60 133 62 82q7-29 39-32 52-12 82 10 24 14 23 70Z" fill="#293246" stroke="#424958" stroke-width="3"/><path d="M165 63q29 8 35 32l6 35-38-2q-3-37-3-65Z" fill="#222b3d" stroke="#424958" stroke-width="1.2"/>
 <ellipse cx="133" cy="47" rx="7" ry="4" fill="#293246" stroke="#424958" stroke-width="2"/>
 <path d="M131 52q26 14 34 74m-39-74q-18 21-18 75" stroke="#465169" stroke-width="1.7" fill="none"/>
 <path d="M59 130 35 143q-9 8 12 10l156-13q8-3-2-9-77-5-142-1Z" fill="#343e54" stroke="#424958" stroke-width="3"/>
 <path d="m36 148 143-11" stroke="#586179" stroke-width="1.5"/>
 <ellipse cx="75" cy="144" rx="15" ry="5" fill="#d0be7c" stroke="#efdfa3" stroke-width="1.5" transform="rotate(-7 75 144)"/>
 <text x="108" y="115" fill="#cd4c58" stroke="#f5d7d1" stroke-width="1.5" paint-order="stroke" font-family="Georgia,serif" font-weight="bold" font-size="53">B</text>
 <path d="m188 110 10-2-1 10-8 3Z" fill="none" stroke="#dce0e2" stroke-width="2"/>`},
 {id:'goggle-knit',name:'CPC 护目镜针织帽',detail:'深紫色罗纹针织 · 两枚黑色护目镜 · 保留完整眼睛',viewBox:'32 22 196 145',back:'',front:`
 <path d="M59 153q-6-51 7-84 9-38 50-36 42-9 66 17 24 28 21 103Z" fill="#675067" stroke="#59465c" stroke-width="3"/>
 <path d="M78 68q-10 35-9 73m23-91q-12 38-10 90m23-99q-9 44-9 99m22-101-7 100m22-100-6 100m21-95-5 96m20-84-6 86m20-70-6 71m16-49-3 50" fill="none" stroke="#896982" stroke-width="2" opacity=".75"/>
 <path d="M59 128q72-12 144 0v26q-72-9-144 0Z" fill="#58435d" stroke="#59465c" stroke-width="2"/>
 <path d="M56 116q76-14 150 0" stroke="#37333d" stroke-width="9" fill="none"/>
 <g stroke="#292b32" stroke-width="4" fill="#363942"><ellipse cx="96" cy="116" rx="26" ry="30" transform="rotate(-13 96 116)"/><ellipse cx="164" cy="116" rx="26" ry="30" transform="rotate(13 164 116)"/></g>
 <g fill="#20262f" stroke="#696c76" stroke-width="1.5"><ellipse cx="96" cy="116" rx="20" ry="24" transform="rotate(-13 96 116)"/><ellipse cx="164" cy="116" rx="20" ry="24" transform="rotate(13 164 116)"/></g>
 <path d="m81 109 13-12m57 11 13-12" stroke="#9ca3ad" stroke-width="3" opacity=".7" stroke-linecap="round"/>
 <path d="M122 115q8-5 16 0" fill="none" stroke="#292b32" stroke-width="5"/>
 <text x="150" y="98" fill="#e6dfdc" font-family="sans-serif" font-size="5" transform="rotate(13 164 100)">CPC</text>`},
 {id:'black-flat',name:'黑色平檐帽',detail:'黑色方圆帽冠 · 简洁字母 · 侧伸宽平檐',viewBox:'34 42 224 123',back:'',front:`
 <path d="M58 142 58 83q-1-27 32-29l62-3q33 1 41 27l10 59Z" fill="#36383d" stroke="#454349" stroke-width="3"/><path d="M165 57q26 5 28 22l10 58-25 1q-1-47-13-81Z" fill="#292b32" stroke="#454349" stroke-width="1.2"/>
 <ellipse cx="128" cy="51" rx="7" ry="3.5" fill="#292c31"/>
 <path d="M127 56q14 24 15 74M75 74l-3 58" stroke="#51535a" stroke-width="1.5" fill="none"/>
 <path d="M61 136q72-10 134-4l26 12q10 8-6 9l-128-2Z" fill="#292c31" stroke="#454349" stroke-width="3"/>
 <path d="m111 142 100 5" stroke="#53545c" stroke-width="1.5"/>
 <path d="m118 80-5 37m5-18 19-19m-20 20 23 18" stroke="#e4d6ba" stroke-width="7" stroke-linecap="square" fill="none"/>
 <path d="m118 80-5 37m5-18 19-19m-20 20 23 18" stroke="#ae6264" stroke-width="3" stroke-linecap="square" fill="none"/>
 <path d="m72 112 10-4-1 10-10 2Z" fill="none" stroke="#b65e67" stroke-width="2"/>`}
];
// 每款单独拟合：针织帽包裹至下沿，只留窄条原生头部；棒球帽露出较宽的头部下缘。
// Fit cap crowns to ~2/3 of the permanent head (20..153), centered on x=130.
const CAP_FIT = Object.freeze({width:.98, top:18, coverage:2/3, headHeight:133});
function fitBaseballCap(top,bottom){const sy=CAP_FIT.headHeight*CAP_FIT.coverage/(bottom-top);return 'matrix('+[CAP_FIT.width,0,0,Number(sy.toFixed(4)),Number((130*(1-CAP_FIT.width)).toFixed(2)),Number((CAP_FIT.top-top*sy).toFixed(3))].join(' ')+')';}
const HAT_FITS = {
 classic:{front:'',back:''},
 'striped-cat':{front:'matrix(.98 0 0 1.1 2.6 -31)',back:''},
 'fluffy-aviator':{front:'matrix(1 0 0 1.32 0 -59)',back:'matrix(.98 0 0 .95 2.6 -3)'},
 'striped-beanie':{front:'matrix(1.04 0 0 1.35 -5.2 -65)',back:''},
 'white-bunny':{front:'matrix(1.06 0 0 1.37 -7.8 -67)',back:'matrix(1 0 0 .97 0 -6)'},
 'red-baseball':{front:fitBaseballCap(52,157),back:''},
 'blue-knit':{front:'matrix(1.04 0 0 1.1 -5.2 -27)',back:''},
 'era-baseball':{front:fitBaseballCap(47,153),back:''},
 'goggle-knit':{front:'matrix(1 0 0 1.02 0 -17)',back:''},
 'black-flat':{front:fitBaseballCap(51,153),back:''}
};
