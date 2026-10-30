'use strict';
// 表情仅改变临时表现，不写存档，也不改变原眼睛外轮廓、瞳孔大小和鸭嘴外形。
const EXPRESSIONS = [
 {id:'neutral',name:'正常呆萌',line:'嗯？豆兵正在认真发呆。'},
 {id:'smirk',name:'歪嘴坏笑',line:'嘿嘿，我好像知道一点小秘密。'},
 {id:'brow',name:'单眼挑眉',line:'哦？你是不是又想戳我脸啦？'},
 {id:'smug',name:'得意眯眼',line:'没办法，豆兵就是这么有魅力。'},
 {id:'disdain',name:'假装嫌弃',line:'哼，只准你再摸一下……就一下！'},
 {id:'pout',name:'鼓嘴生气',line:'我鼓起来了！快哄我一下。'},
 {id:'eye-roll',name:'翻白眼',line:'又戳！这个人怎么比豆兵还调皮。'},
 {id:'stare',name:'无语凝视',line:'……我看着你，我不说话。'},
 {id:'shy',name:'害羞脸红',line:'才、才没有特别喜欢被你夸。'},
 {id:'teary',name:'委屈泪眼',line:'小饼干掉了……抱一下就能好。'},
 {id:'chew',name:'吃东西鼓腮',line:'唔唔……先让我咽下这一口！'},
 {id:'laugh',name:'开心大笑',line:'哈哈哈哈！今天的开心归你啦！'}
];
let expressionTimers=[],expressionIndex=0,cheekExpressionRound=0;
const FACIAL_TRANSFORMS={
 smirk:{pupils:'translate(-3 1)','lid-left':'translate(0 -9)','lid-right':'translate(0 -5)'},
 brow:{pupils:'translate(-3 -1)','brow-left':'translate(0 1) rotate(8 100 159)','brow-right':'translate(0 -4) rotate(-12 162 159)'},
 smug:{'brow-left':'rotate(-10 100 159)'},
 disdain:{pupils:'translate(3 0)','lid-left':'translate(0 1)','lid-right':'translate(0 1)','brow-left':'rotate(8 100 159)','brow-right':'rotate(-8 162 159)'},
 pout:{pupils:'translate(0 1)','brow-left':'translate(0 1) rotate(15 100 159)','brow-right':'translate(0 1) rotate(-15 162 159)','mouth-flat':'translate(130 215) scale(.65 1) translate(-130 -215)'},
 'eye-roll':{pupils:'translate(0 -3) translate(130 174) scale(1 .72) translate(-130 -174)'},
 stare:{pupils:'translate(0 1) translate(130 174) scale(1 .9) translate(-130 -174)','lid-left':'translate(0 3)','lid-right':'translate(0 3)'},
 shy:{pupils:'translate(2 2)','lid-left':'translate(0 -7)','lid-right':'translate(0 -7)','wing-left':'rotate(112)','wing-right':'rotate(-112)'},
 teary:{pupils:'translate(0 2)','brow-left':'rotate(13 100 159)','brow-right':'rotate(-13 162 159)'},
 chew:{'mouth-line':'translate(130 214) scale(.75 1) translate(-130 -214)'}
};
const FACIAL_PARTS=['pupils','lid-left','lid-right','brow-left','brow-right','mouth-flat','mouth-line','wing-left','wing-right'];
function applyFace(svg,id){svg.dataset.expression=id;for(const part of FACIAL_PARTS){const nodes=svg.querySelectorAll?svg.querySelectorAll('.'+part):[svg.querySelector('.'+part)].filter(Boolean);for(const node of nodes){const transform=FACIAL_TRANSFORMS[id]?.[part];if(transform)node.setAttribute('transform',transform);else node.removeAttribute('transform');}}}
function clearExpression(){for(const timer of expressionTimers)clearTimeout(timer);expressionTimers=[];applyFace($('character'),'neutral');}
function expressionSequence(phases,duration){
 clearExpression();for(const phase of phases){if(phase.after===0)applyFace($('character'),phase.id);else expressionTimers.push(setTimeout(()=>applyFace($('character'),phase.id),phase.after));}
 if(duration>0)expressionTimers.push(setTimeout(()=>applyFace($('character'),sleeping?'sleepy':'neutral'),duration));
}
function setExpression(id,duration=2400){if(!EXPRESSIONS.some(e=>e.id===id)&&!['sing','yawn','sleepy','blink'].includes(id))return;expressionSequence([{id,after:0}],duration);}
function expressionForPose(name,duration){
 const mapping={'head-love':'disdain',shy:'shy',laughing:'laugh',pouting:'pout',hugging:'smug','idle-blink':'blink','idle-yawn':'yawn','idle-look':'brow','idle-smirk':'smirk','idle-stare':'stare','idle-brow':'brow'};
 if(mapping[name])setExpression(mapping[name],duration);
}
function expressionInteraction(kind){
 if(kind!=='cheek')cheekExpressionRound=0;
 switch(kind){
  case 'pat':expressionSequence([{id:'disdain',after:0},{id:'shy',after:650}],2500);break;
  case 'food':expressionSequence([{id:'chew',after:0},{id:'smug',after:1500}],2800);break;
  case 'cheek':if($('room').classList.contains('pouting')){const id=['disdain','eye-roll','pout'][cheekExpressionRound++%3];expressionSequence([{id,after:0},{id:'pout',after:1100}],2800);}break;
  case 'belly':setExpression('laugh',2200);break;
  case 'sing':setExpression('sing',4500);break;
  case 'sleep':setExpression(sleeping?'sleepy':'neutral',0);break;
  case 'dress':setExpression('smug',850);break;
  case 'hug':setExpression('smug',3000);break;
  case 'talk':{const ids=['smirk','brow','stare','teary','neutral'];setExpression(ids[Math.floor(Math.random()*ids.length)]);break;}
 }
}
$('expressionPeek').addEventListener('click',()=>{if(!canTouch()||drag)return;clearPose();stopSinging();cheekTimes=[];const expression=EXPRESSIONS[++expressionIndex%EXPRESSIONS.length];setExpression(expression.id,3200);say(`${expression.name} · ${expression.line}`);lastActive=Date.now();});
$('sitToggle').addEventListener('click',()=>{if(!canTouch()||drag)return;clearPose();stopSinging();const sitting=!$('room').classList.contains('sitting');returnHome();$('room').classList.toggle('sitting',sitting);$('sitToggle').textContent=sitting?'站起来':'坐一会儿';setExpression(sitting?'smirk':'neutral');say(sitting?'坐一会儿吧，小脚掌只给你看～':'起立！豆兵又充满电啦。');lastActive=Date.now();});
