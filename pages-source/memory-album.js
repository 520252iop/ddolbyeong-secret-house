'use strict';
// A read-only photo collection: no storage writes or progression rewards.
const MEMORY_CATEGORIES={sohee:'SOHEE & DDOLBYEONG',friends:'RIIZE & FRIENDS',moments:'LITTLE MOMENTS',daily:"DDOLBYEONG’S DAILY LIFE",stage:'STAGE & MEMORIES',original:'豆兵的小屋故事'};
let memoryCategory='sohee',memoryPhotoId=null,memoryReturnFocus=null;
function memoryAlbumPhotos(){return [...MEMORY_PHOTOS,...(typeof mischiefAlbumPhotos==='function'?mischiefAlbumPhotos():[])];}
function memoryNode(tag,className,text){const node=document.createElement(tag);node.className=className;if(text!==undefined)node.textContent=text;return node;}
function memoryImage(photo,full=false){const image=memoryNode('img','');image.src=full?photo.src:photo.thumb;image.alt=photo.title+(photo.category==='friends'?'（完整合照）':'');image.width=photo.width;image.height=photo.height;image.loading=full?'eager':'lazy';image.decoding='async';image.addEventListener('error',()=>{image.alt='照片暂时无法显示：'+photo.title;});return image;}
function renderMemoryAlbum(){
 const tabs=$('memoryCategories');tabs.replaceChildren();for(const [key,label]of Object.entries(MEMORY_CATEGORIES)){const button=memoryNode('button','memory-category',label);button.type='button';button.setAttribute('aria-pressed',String(key===memoryCategory));button.addEventListener('click',()=>{memoryCategory=key;renderMemoryAlbum();$('memoryCategories').children[Object.keys(MEMORY_CATEGORIES).indexOf(key)].focus();});tabs.append(button);}
 const grid=$('memoryPhotoGrid');grid.replaceChildren();const photos=memoryAlbumPhotos().filter(photo=>photo.category===memoryCategory);
 grid.dataset.photoCount=String(photos.length);$('memoryAlbumCount').textContent=photos.length?photos.length+' 张回忆':memoryCategory==='original'?'小屋里的故事会慢慢留在这里，不用赶着收集。':'这个分类暂时没有照片。';for(const photo of photos){const button=memoryNode('button','memory-photo-card');button.type='button';button.setAttribute('aria-label','放大查看：'+photo.title);button.dataset.photoId=photo.id;button.append(memoryImage(photo));button.addEventListener('click',()=>showMemoryPhoto(photo.id));grid.append(button);}
}
function showMemoryPhoto(id){const photo=memoryAlbumPhotos().find(item=>item.id===id);if(!photo)return false;memoryPhotoId=id;memoryCategory=photo.category;renderMemoryAlbum();$('memoryPhotoGrid').hidden=true;$('memoryCategories').hidden=true;$('memoryAlbumCount').hidden=true;$('memoryPhotoView').hidden=false;
 $('memoryLargePhoto').replaceChildren(memoryImage(photo,true));$('memoryLargePhoto').dataset.photoId=photo.id;const view=$('memoryPhotoView');view.classList.remove('is-page-turn');void view.offsetWidth;view.classList.add('is-page-turn');$('memoryPhotoPosition').textContent=(memoryAlbumPhotos().filter(p=>p.category===memoryCategory).findIndex(p=>p.id===id)+1)+' / '+memoryAlbumPhotos().filter(p=>p.category===memoryCategory).length;$('memoryPhotoBack').focus();return true;}
function showMemoryGrid(){memoryPhotoId=null;$('memoryPhotoGrid').hidden=false;$('memoryCategories').hidden=false;$('memoryAlbumCount').hidden=false;$('memoryPhotoView').hidden=true;renderMemoryAlbum();}
function moveMemoryPhoto(step){const photos=memoryAlbumPhotos().filter(photo=>photo.category===memoryCategory);const index=photos.findIndex(photo=>photo.id===memoryPhotoId);if(!photos.length)return;showMemoryPhoto(photos[(index+step+photos.length)%photos.length].id);}
function openMemoryAlbum(category='original',id=null,trigger=null){
 if(['choiceDialog','diaryDialog','gachaDialog','wardrobeDialog','miniDialog'].some(key=>$(key).open))return false;
 memoryReturnFocus=trigger||document.activeElement||$('openMemoryAlbum');memoryCategory=MEMORY_CATEGORIES[category]?category:'sohee';showMemoryGrid();if(!$('memoryAlbumDialog').open)$('memoryAlbumDialog').showModal();if(id)showMemoryPhoto(id);else $('closeMemoryAlbum').focus();return true;
}
$('openMemoryAlbum').addEventListener('click',()=>openMemoryAlbum(typeof mischiefAlbumPhotos==='function'?'original':'sohee',null,$('openMemoryAlbum')));
$('roomMemoryPhoto').addEventListener('click',()=>openMemoryAlbum('sohee','sohee-classic-ddolbyeong',$('roomMemoryPhoto')));
$('roomFriendsPhoto').addEventListener('click',()=>openMemoryAlbum('friends',null,$('roomFriendsPhoto')));
$('closeMemoryAlbum').addEventListener('click',()=>$('memoryAlbumDialog').close());$('memoryAlbumDone').addEventListener('click',()=>$('memoryAlbumDialog').close());
$('memoryAlbumDialog').addEventListener('close',()=>{if(memoryReturnFocus&&typeof memoryReturnFocus.focus==='function')memoryReturnFocus.focus();});
$('memoryPhotoBack').addEventListener('click',()=>{const id=memoryPhotoId;showMemoryGrid();const buttons=$('memoryPhotoGrid').children;for(const button of buttons)if(button.dataset.photoId===id)button.focus();});
$('memoryPhotoPrev').addEventListener('click',()=>moveMemoryPhoto(-1));$('memoryPhotoNext').addEventListener('click',()=>moveMemoryPhoto(1));
$('memoryAlbumDialog').addEventListener('keydown',event=>{if(!memoryPhotoId)return;if(event.key==='ArrowLeft'){event.preventDefault();moveMemoryPhoto(-1);}if(event.key==='ArrowRight'){event.preventDefault();moveMemoryPhoto(1);}});
$('roomPastelPlush').addEventListener('click',()=>{if(typeof sleeping!=='undefined'&&sleeping)return;if(typeof busy!=='undefined'&&busy)return;if(typeof setExpression==='function')setExpression('brow',2000);say('这个粉紫色小伙伴，连发呆都像在做甜甜的梦。我的相册里也有它哦！');});
$('roomMemoryCamera').addEventListener('click',()=>{if(typeof openPhotoStudio==='function'){openPhotoStudio();return;}openMemoryAlbum('moments',null,$('roomMemoryCamera'));});
