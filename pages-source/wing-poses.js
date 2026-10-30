'use strict';
// The rear and foreground drawings are mutually exclusive views of ONE pair of wings.
function syncWingPose(svg){
 const actual=svg===$('character'),room=$('room'),look=svg.dataset.look;
 const asleep=svg.dataset.asleep==='true'||(actual&&sleeping);
 let pose='rest';
 if(actual&&room.classList.contains('hugging'))pose='hold';
 else if(actual&&room.classList.contains('friend-lift'))pose='hold';
 else if(actual&&room.classList.contains('sitting')&&look==='sleepy')pose='hold';
 else if(svg.dataset.motion==='sing'||(actual&&room.classList.contains('singing')))pose='sing';
 else if(svg.dataset.expression==='shy')pose='shy';
 else if(svg.dataset.expression==='pout')pose='waist';
 else if(actual&&svg.dataset.personality==='smug')pose='waist';
 else if(look==='stage'&&!asleep&&!(actual&&room.classList.contains('eating')))pose='stage';
 if(asleep)pose='rest';
 if(svg.dataset.wingPose!==pose)svg.dataset.wingPose=pose;
}
const wingPoseObserver=new MutationObserver(()=>syncWingPose($('character')));
wingPoseObserver.observe($('room'),{attributes:true,attributeFilter:['class']});
wingPoseObserver.observe($('character'),{attributes:true,attributeFilter:['data-expression','data-motion','data-look','data-asleep','data-personality']});
syncWingPose($('character'));
