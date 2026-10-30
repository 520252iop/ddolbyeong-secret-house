// 无浏览器依赖的行为检查；仅使用内存存档，不碰真实 localStorage。
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
function fixture(seed, withHats=false) {
 let now = new Date(2026, 9, 20, 12).getTime(), saved = seed ? JSON.stringify(seed) : null, nextTimer = 1;
 const timers = new Map(), nodes = new Map();
 class TestDate extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
 function element(id = '', tagName='div') {
  const classes = new Set(), listeners = {}, properties = {}, captures = new Set();
  return { id, tagName, dataset:{}, children:[], listeners, offsetWidth:235, offsetHeight:325, clientWidth:400, open:false,
   classList:{ add(...v){v.forEach(s=>classes.add(s));}, remove(...v){v.forEach(s=>classes.delete(s));}, contains(v){return classes.has(v);}, toggle(v,on){if(on===undefined)on=!classes.has(v);on?classes.add(v):classes.delete(v);}},
   style:{setProperty(k,v){properties[k]=v;},getPropertyValue(k){return properties[k];}},
   addEventListener(type,fn){(listeners[type]??=[]).push(fn);},
   emit(type,e={}){for(const fn of listeners[type]||[])fn({target:this,preventDefault(){},...e});},
   setAttribute(k,v){this[k]=v;},getAttribute(k){return this[k]??null;},removeAttribute(k){delete this[k];},
   cloneNode(deep){const clone=element(this.id,this.tagName);clone.className=this.className;clone.innerHTML=this.innerHTML;clone.dataset={...this.dataset};if(deep)clone.children=this.children.map(n=>n.cloneNode(true));return clone;},
   querySelector(selector){for(const node of this.children){if(selector[0]==='.'?(node.className||'').split(' ').includes(selector.slice(1)):node.tagName===selector)return node;const found=node.querySelector(selector);if(found)return found;}return null;},
   replaceChildren(...items){this.children=items;},append(...items){this.children.push(...items);},remove(){this.removed=true;},
   showModal(){this.open=true;},close(){this.open=false;this.emit('close');},focus(){},scrollIntoView(){},
   setPointerCapture(id){captures.add(id);},hasPointerCapture(id){return captures.has(id);},releasePointerCapture(id){captures.delete(id);},
   getBoundingClientRect(){const rects={room:[0,0,900,420],pet:[332,65,235,325],bed:[45,250,200,105],starPlush:[760,300,60,70],miniStage:[0,0,400,330]};const [left,top,width,height]=rects[id]||[0,0,400,100];return {left,top,width,height,right:left+width,bottom:top+height};},
   createSVGPoint(){return {x:0,y:0,matrixTransform(){return {x:this.x,y:this.y};}};},getScreenCTM(){return {inverse(){return {};}};}
  };
 }
 const get=id=>{if(!nodes.has(id))nodes.set(id,element(id));return nodes.get(id);};
 const document=element('document');document.getElementById=get;document.createElement=tag=>element('',tag);document.createElementNS=(ns,tag)=>element('',tag);document.querySelectorAll=()=>[];document.querySelector=()=>get('close');document.hidden=false;
 if(withHats){const svg=get('character');svg.tagName='svg';svg.dataset.expression='neutral';for(const name of ['hat-back-layer','base-head','hat-front-layer','look-head-layer','look-body-layer','stage-hand-layer','pupils','lid-left','lid-right','brow-left','brow-right','mouth-flat','mouth-line','wing-left','wing-right']){const layer=element('','g');layer.className=name;if(name==='base-head'){layer.dataset.permanent='true';layer.innerHTML='permanent-original-head';}svg.append(layer);}}
 const context={document,window:element('window'),Date:TestDate,console,localStorage:{getItem(){return saved;},setItem(k,v){assert.equal(k,'sohee-little-world-v1');saved=v;}},
  setTimeout(fn,delay){const id=nextTimer++;timers.set(id,{fn,delay});return id;},clearTimeout(id){timers.delete(id);},setInterval(){},requestAnimationFrame(){return 1;},cancelAnimationFrame(){}
 };
 vm.createContext(context);const run=code=>vm.runInContext(code,context);
 for(const file of ['app.js','v2.js',...(withHats?['expressions.js','looks.js','assets/hats/catalog.js','hats.js']:[])])vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
 return {run,get,context,save:()=>JSON.parse(saved),advance(ms){now+=ms;},flush(delay){for(const [id,timer] of [...timers])if(timer.delay===delay){timers.delete(id);timer.fn();}}};
}
module.exports={fixture};
