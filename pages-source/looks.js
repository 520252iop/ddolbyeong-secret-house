'use strict';
// 完整造型沿用 outfit 存档字段。头发/眼罩属于头部附加层，永久高筒节点始终保留。
const CHARACTER_LOOK_ART = {
 'i-love-sh':{head:'',hand:'',body:`
 <g class="reference-outfit i-love-sh-shirt" stroke-linecap="round" stroke-linejoin="round">
 <!-- Use the native rounded torso as the garment; no separate sleeve or side silhouette. -->
 <path d="M106 233q24 12 48 0" fill="none" stroke="#ded3c4" stroke-width="2"/>
 <!-- Vector letters keep the reference print consistent without extra fonts. -->
 <path class="shirt-print-letters" d="M106 247h16v3h-5v20h5v3h-16v-3h5v-20h-5Z" fill="#302e31"/>
 <path class="shirt-print-heart" d="M145 272c-5-4-18-12-18-20 0-10 12-12 18-4 6-8 18-6 18 4 0 8-13 16-18 20Z" fill="#bc4855" stroke="#a3414b" stroke-width="1"/>
 <path d="M126 280c-8-5-23-4-23 5 0 7 19 5 19 12 0 6-13 7-21 1v7c10 4 26 3 26-8 0-9-19-8-19-13 0-4 11-5 18 0Z" fill="#302e31"/>
 <path d="M133 278h12v3h-3v9h12v-9h-3v-3h12v3h-3v22h3v3h-12v-3h3v-10h-12v10h3v3h-12v-3h3v-22h-3Z" fill="#302e31"/>
 </g>`},
 maid:{hand:'',head:`<g class="maid-lace" stroke="#9b8584" stroke-width="2" stroke-linejoin="round"><path d="M65 76l-5-12 12-6-2-13 14-2 4-13 14 5 8-12 13 8 12-8 11 10 14-4 7 13 14 1 1 14 13 6-4 13Q130 55 65 76Z" fill="#fff8eb"/><path d="M69 73q61-22 121 0" fill="none" stroke="#d9a7b3" stroke-width="6"/><path d="m124 52-17-10v21l17-6 19 6V42l-19 10Z" fill="#d9a7b3"/><circle cx="125" cy="54" r="4" fill="#fff8eb"/></g>`,body:`
 <g class="reference-outfit maid-dress" stroke="#75656d" stroke-width="2.4" stroke-linejoin="round">
 <path d="M99 226q31-8 62 0 17 12 19 42l6 45q-55 27-112 0l6-45q2-30 19-42Z" fill="#45424e"/>
 <path d="m104 232 26 13 26-13-8 19-18-6-18 6Z" fill="#fff8eb" stroke-width="1.5"/>
 <path d="m124 248-12-5v15l12-4 15 4v-15l-15 5Z" fill="#d9a7b3" stroke-width="1"/>
 <path d="M106 256q24 8 48 0l-3 25 12 29q-33 15-66 0l12-29Z" fill="#fff8eb"/>
 <path d="M107 259v21m46-21v21M85 312q45 22 90 0l4 8-8 1-4 6-8-2-6 6-9-3-8 5-8-4-9 3-8-5-9 2-6-6-8 0Z" fill="#fff8eb" stroke-width="1.3"/>
 <path d="M100 280h60" stroke="#d9a7b3" stroke-width="5"/><path d="M119 287q11 10 22 0" fill="none" stroke="#d9a7b3" stroke-width="2"/>
 <path d="m90 295-5 14m85-14 5 14" stroke="#77717f" fill="none"/>
 </g>`},
 piggy:{hand:'',head:`<g class="piggy-ears" stroke="#a67b87" stroke-width="2.5" stroke-linejoin="round"><path d="M69 68Q43 63 48 29q25 0 38 23Z" fill="#edbec8"/><path d="M191 68q26-5 21-39-25 0-38 23Z" fill="#edbec8"/><path d="m57 40 14 14-14 2Zm146 0-14 14 14 2Z" fill="#d993a7" stroke="none"/></g>`,body:`
 <g class="reference-outfit piggy-suit" stroke="#a67b87" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
 <path d="M177 291q26-17 25 2-1 11-12 6-6-6 2-10" fill="none" stroke="#d998ac" stroke-width="5"/>
 <path d="M99 226q31-8 62 0 21 16 21 52 1 33-10 42-42 14-84 0-11-9-10-42 0-36 21-52Z" fill="#edbec8"/>
 <path d="M104 235q26 16 52 0" fill="none" stroke="#fff0e7" stroke-width="7"/>
 <ellipse cx="130" cy="284" rx="31" ry="33" fill="#fff0e7" stroke-width="1.5"/>
 <path d="m116 269-5-7 12 2m21 5 5-7-12 2" fill="#edbec8" stroke-width="1.5"/>
 <ellipse cx="130" cy="284" rx="17" ry="12" fill="#e6a6b8" stroke-width="1.5"/>
 <g fill="#a67b87" stroke="none"><ellipse cx="124" cy="284" rx="2.5" ry="4"/><ellipse cx="136" cy="284" rx="2.5" ry="4"/><circle cx="119" cy="274" r="2"/><circle cx="141" cy="274" r="2"/></g>
 <path d="M88 315q11 7 22 5m40 0q11 2 22-5" fill="none" stroke="#d998ac" stroke-width="4"/>
 </g>`},
 'berry-zip':{head:'',hand:'',body:`
 <g class="reference-outfit berry-zip" stroke-linecap="round" stroke-linejoin="round">
 <path d="M99 226C83 231 78 252 78 278q-1 33 10 42 42 14 84 0 11-9 10-42c0-26-5-47-21-52q-31-8-62 0Z" fill="#ae596b" stroke="#766365" stroke-width="2.6"/>
 <path d="M103 238q27 9 54 0l-10 18-17-5-17 5Z" fill="#343d50" stroke="#766365" stroke-width="1.7"/>
 <path d="M130 250v70" stroke="#343d50" stroke-width="7"/><path d="M130 253v64" stroke="#b3adb1" stroke-width="1.4" stroke-dasharray="1 3"/>
 <path d="M129 271h3v8h-3Z" fill="#e6cdd0" stroke="#746775" stroke-width="1"/>
 <path d="m99 278-9 23q8 5 19 3l8-18m44-8 9 23q-8 5-19 3l-8-18" fill="none" stroke="#814b59" stroke-width="1.6"/>
 <path d="M85 309q45 15 90 0l-3 11q-42 14-84 0Z" fill="#e0b8c9" stroke="#766365" stroke-width="1.3"/>
 <path d="m93 313 0 9m11-6v9m11-7v9m29-9v9m11-10v9m11-12v9" stroke="#697c9b" stroke-width="4"/>
 <path d="M86 255l3 8m85-8-3 8" fill="none" stroke="#ca8590" stroke-width="1.4"/>
 </g>`},
 'midnight-jersey':{head:'',hand:'',body:`
 <g class="reference-outfit midnight-jersey" stroke-linecap="round" stroke-linejoin="round">
 <path d="M99 226C83 231 78 252 78 278q-1 33 10 42 42 14 84 0 11-9 10-42c0-26-5-47-21-52q-31-8-62 0Z" fill="#42434a" stroke="#70686a" stroke-width="2.6"/>
 <path d="M103 238l27 14 27-14-3 9-24 13-24-13Z" fill="#fff8e9" stroke="#b8b7b1" stroke-width="1.4"/>
 <path d="M128 258v63m7-63v63" stroke="#eee8d9" stroke-width="2.3"/>
 <g fill="#a95c66"><path d="M82 276h35v15H81Zm62 0h35v15h-35Z"/></g>
 <path d="M88 242l-4 29m88-29 4 29M91 309l-2 6m80-6 2 6" stroke="#d9d7cb" stroke-width="1.5"/>
 <path d="M103 257l3 5 6 1-4 4 1 6-6-3-5 3 1-6-4-4 6-1Z" fill="#b97980" stroke="#d6b4ad" stroke-width="1"/>
 <path d="M150 257q10-5 17 0v10q-5 8-9 8-5 0-8-8Z" fill="#6e535e" stroke="#c9b9b0" stroke-width="1.2"/>
 <path d="m154 264 4 4 5-7" fill="none" stroke="#eee4cf" stroke-width="1.5"/>
 <g fill="#dfd8c8"><circle cx="132" cy="275" r="1.7"/><circle cx="132" cy="294" r="1.7"/><circle cx="132" cy="313" r="1.7"/></g>
 <path d="M89 318q41 12 82 0" fill="none" stroke="#818087" stroke-width="1.4"/>
 </g>`},
 'lemon-flight':{head:'',hand:'',body:`
 <g class="reference-outfit lemon-flight" stroke-linecap="round" stroke-linejoin="round">
 <path d="M99 226C83 231 78 252 78 278q-1 33 10 42 42 14 84 0 11-9 10-42c0-26-5-47-21-52q-31-8-62 0Z" fill="#e9d980" stroke="#8c826a" stroke-width="2.6"/>
 <path d="M105 238l-1 12 23 6 3-12 3 12 23-6-1-12" fill="#f5e6a0" stroke="#a99a6c" stroke-width="1.5"/>
 <path d="M130 251v69" stroke="#8d8160" stroke-width="2"/>
 <path d="M112 253l-2 24m38-24 2 24" stroke="#fffbed" stroke-width="3.5"/>
 <path d="m124 255-2 14m14-14 2 14" stroke="#5d5b53" stroke-width="2.5"/>
 <path d="M91 286h25v21q-10 7-23 0Zm53 0h25l-2 21q-13 7-23 0Z" fill="#f3e9b5" stroke="#a79c78" stroke-width="1.5"/>
 <path d="M91 286h25v6H91Zm53 0h25v6h-25Z" fill="#e1cd7d" stroke="#a79c78" stroke-width="1.2"/>
 <circle cx="104" cy="295" r="1.7" fill="#777967"/><circle cx="156" cy="295" r="1.7" fill="#777967"/>
 <path d="M86 257q-2 8 0 13m88-13q2 8 0 13M88 317q42 12 84 0" fill="none" stroke="#c1b275" stroke-width="1.4"/>
 </g>`},
 'sohee-pajamas':{head:'',hand:'',body:`
 <g class="sohee-pajama-shirt" stroke-linecap="round" stroke-linejoin="round">
 <defs><clipPath id="__LOOK_UID__shirt"><path d="M99 226C83 231 77 251 77 278C77 301 79 316 88 320Q130 334 172 320C181 316 183 301 183 278C183 251 177 231 161 226Q130 218 99 226Z"/></clipPath></defs>
 <path d="M99 226C83 231 77 251 77 278C77 301 79 316 88 320Q130 334 172 320C181 316 183 301 183 278C183 251 177 231 161 226Q130 218 99 226Z" fill="#fff9e9" stroke="#877b75" stroke-width="2.5"/>
 <g clip-path="url(#__LOOK_UID__shirt)" fill="none" stroke="#b7ced7" stroke-width="9">
 <path d="M82 222q-2 52 0 107M102 220q-3 55 0 113M122 219q-1 57 0 115M142 219q1 57 0 115M162 220q3 55 0 113M182 222q2 52 0 107"/>
 </g>
 <path d="M130 244q-2 38 0 77" fill="none" stroke="#d7afb5" stroke-width="1.6"/>
 <path d="M101 238q13 1 29 6l-10 13-21-13ZM159 238q-13 1-29 6l10 13 21-13Z" fill="#fff9ec" stroke="#d7afb5" stroke-width="1.8"/>
 <path d="M147 267h23l-1 20q-10 7-21 0Z" fill="#e2e9e5" stroke="#a1b7bf" stroke-width="1.3"/>
 <path d="M154 270v17m9-17v17" stroke="#b7ced7" stroke-width="5"/>
 <path d="M147 267h23v5h-23Z" fill="#fff9ec" stroke="#d7afb5" stroke-width="1.4"/>
 <g fill="#fffbed" stroke="#bbaaa0" stroke-width="1.2"><circle cx="130" cy="263" r="3.4"/><circle cx="130" cy="286" r="3.4"/><circle cx="130" cy="309" r="3.4"/></g>
 <path d="m129 263 2 0m-2 23h2m-2 23h2" stroke="#c7b6ac" stroke-width="1"/>
 <path d="M84 251q3 6 2 11m88-11q-3 6-2 11M86 302l4 5m84-5-4 5" fill="none" stroke="#a5bec7" stroke-width="1.2" opacity=".75"/>
 <path d="M86 314q44 17 88 0" fill="none" stroke="#d7afb5" stroke-width="1.5"/>
 </g>`},
 stage:{head:'',body:`
 <g class="stage-jersey"><path d="M105 237h8v84h-8Zm25 0h8v90h-8Zm25 0h7v84h-7Z" fill="#89b7d4"/>
 <path d="M86 234q43 12 86 0" fill="none" stroke="#6596bb" stroke-width="3"/><text x="88" y="263" font-family="sans-serif" font-size="9" font-style="italic" font-weight="bold" fill="#6d98ba" transform="rotate(-8 105 258)">RIIZE</text></g>
 <g class="stage-strap"><path d="m83 229 91 56-8 13-91-57Z" fill="#e77970" stroke="#69534e" stroke-width="2"/><path d="m82 235 85 53" stroke="#f5b396" stroke-width="2"/>
 <path d="m158 278 19 10-7 17-20-11Z" fill="#d45d60" stroke="#69534e" stroke-width="2"/><path d="m154 286 18 10" stroke="#f4b7a6" stroke-width="2"/><path d="m119 255 10 6-4 6-10-6Z" fill="#e8e0c9" stroke="#836a5a" stroke-width="1.2"/></g>`,hand:`
 <g class="stage-held-mic"><path d="m178 237-10 28q-1 5 4 6t7-3l9-29" fill="#56525f" stroke="#514754" stroke-width="2"/><circle cx="185" cy="232" r="11" fill="#666174" stroke="#514754" stroke-width="2.5"/><path d="m179 228 10 7m-12-2 10 7m-3-15-5 13m10-11-5 13" stroke="#9491a1" stroke-width="1.2"/></g>`},
 sleepy:{head:`
 <g class="fluffy-hair"><path d="M57 145q-15-13-6-32l-7-13 11 1q-17-24-2-43l-3-11 15 6q1-23 24-24l-7-17q22 1 37 18 11-22 29-18l-5 12q28-6 47 16l16 4-11 7q20 12 13 35l8 11-9 4q11 19-2 32l6 10-16-2 3 13-14-6-8 10-13-9-10 11-12-12-10 9-12-9-10 9-12-10-12 10-5-10-14 7 2-12Z" fill="#51515f" stroke="#554a5c" stroke-width="3" stroke-linejoin="round"/>
 <path d="m110 44-6-10m18 7 2-12m11 17 10-9M66 120l7 8m113-7-7 10" stroke="#3d404e" stroke-width="3" fill="none" stroke-linecap="round"/></g>
 <g class="sleep-mask"><path d="M55 89q76-17 150 0v17q-75-14-150 0Z" fill="#efb45c" stroke="#927147" stroke-width="2"/>
 <path d="M79 88q19-16 49-10 30-6 53 10 12 16-1 36-13 13-33 1l-15-10q-4-3-8 1l-14 12q-21 7-32-7-13-15 1-33Z" fill="#fff189" stroke="#9f8c50" stroke-width="2.5"/>
 <path d="M89 101q12 12 25 1m29 0q13 11 27-1" fill="none" stroke="#796747" stroke-width="2.5" stroke-linecap="round"/>
 <g fill="#84754d"><circle cx="92" cy="117" r="1.5"/><circle cx="157" cy="118" r="1.5"/><circle cx="165" cy="123" r="1.5"/><circle cx="173" cy="116" r="1.5"/></g></g>`,body:`
 <g class="sleepy-pillow"><path d="M113 253q21-8 41 1l9 34q-8 15-39 12l-17-31q-4-10 6-16Z" fill="#626779" stroke="#4d4d61" stroke-width="2.5"/><path d="m119 261 12 30m-7-32 13 32" stroke="#7e8495" stroke-width="1.2" opacity=".6"/></g>`,hand:''}
};
let characterLookSerial=0;
function applyCharacterLook(svg,outfit,asleep=false){
 const look=['classic','stage','sleepy','sohee-pajamas','berry-zip','midnight-jersey','lemon-flight','maid','piggy','i-love-sh'].includes(outfit)?outfit:'classic';
 if(svg.dataset.look!==look||svg.dataset.lookVersion!=='3'){
  const art=CHARACTER_LOOK_ART[look]||{head:'',body:'',hand:''};
  const prefix='look-'+(++characterLookSerial)+'-';
  for(const [part,key]of [['look-head-layer','head'],['look-body-layer','body'],['stage-hand-layer','hand']]){const layer=svg.querySelector('.'+part);if(layer)layer.innerHTML=(art[key]||'').replaceAll('__LOOK_UID__',prefix);}
  svg.dataset.look=look;svg.dataset.lookVersion='3';
 }
 svg.dataset.asleep=String(Boolean(asleep));
}
applyCharacterLook($('character'),state.outfit,sleeping);
