'use strict';
let cosmicMailBusy=false,cosmicMailCursor=null,cosmicMailTrigger=null,cosmicMailRequest=0,cosmicMailCaptchaToken='',cosmicMailWidget=null,cosmicPaper='cream';
const COSMIC_PAPERS=['cream','rose','sky'];
function cosmicMailURL(){const value=COSMIC_MAILBOX_CONFIG.apiBase.trim();if(!value)return null;if(value==='/.netlify/functions/cosmic-mailbox')return value;try{const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)return null;return url.href.replace(/\/$/,'');}catch{return null;}}
function cosmicMailStatus(text){$('cosmicMailStatus').textContent=text;}
function cosmicMailText(tag,text){const node=document.createElement(tag);node.textContent=text;return node;}
function cosmicMailReady(){return Boolean(cosmicMailURL()&&COSMIC_MAILBOX_CONFIG.turnstileSiteKey&&cosmicMailCaptchaToken&&!cosmicMailBusy);}
function cosmicMailCaptchaReset(){cosmicMailCaptchaToken='';if(cosmicMailWidget!==null&&window.turnstile)window.turnstile.reset(cosmicMailWidget);$('cosmicMailSend').disabled=true;}
function cosmicMailInitCaptcha(){
 if(!cosmicMailURL()||!COSMIC_MAILBOX_CONFIG.turnstileSiteKey)return;
 const mount=()=>{if(cosmicMailWidget!==null)return;cosmicMailWidget=window.turnstile.render($('cosmicMailCaptcha'),{sitekey:COSMIC_MAILBOX_CONFIG.turnstileSiteKey,action:'cosmic_mail',size:'flexible',callback:token=>{cosmicMailCaptchaToken=token;$('cosmicMailSend').disabled=!cosmicMailReady();},'expired-callback':()=>{cosmicMailCaptchaToken='';$('cosmicMailSend').disabled=true;cosmicMailStatus('人机验证已过期，请重新验证。');},'error-callback':()=>{cosmicMailCaptchaToken='';$('cosmicMailSend').disabled=true;cosmicMailStatus('人机验证加载失败，请检查网络后重新打开来信箱。');}});};
 if(window.turnstile){mount();return;}if(document.getElementById('cosmicTurnstileScript'))return;
 const script=document.createElement('script');script.id='cosmicTurnstileScript';script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.addEventListener('load',mount);script.addEventListener('error',()=>{script.remove();cosmicMailStatus('人机验证无法加载，请检查网络后重试。');});document.head.append(script);
}
function cosmicMailRender(items,append=false){
 if(!append)$('cosmicMailList').replaceChildren();
 const seen=new Set(Array.from($('cosmicMailList').children).map(n=>n.dataset.letterId));
 for(const item of items){
  if(!item||typeof item.id!=='string'||!/^\d+$/.test(item.id)||seen.has(item.id)||typeof item.nickname!=='string'||typeof item.body!=='string')continue;seen.add(item.id);
  const card=document.createElement('li');card.className='cosmic-mail-letter';card.dataset.paper=COSMIC_PAPERS.includes(item.paper)?item.paper:'cream';card.dataset.letterId=item.id;
  const envelope=document.createElement('details'),summary=document.createElement('summary');summary.append(cosmicMailText('span','✉ '+item.nickname+' 的来信'));
  const date=new Date(item.createdAt),time=cosmicMailText('time',Number.isNaN(date.getTime())?'远方的一封信':date.toLocaleString('zh-CN'));if(!Number.isNaN(date.getTime()))time.setAttribute('datetime',date.toISOString());summary.append(time);envelope.append(summary,cosmicMailText('p',item.body));
  const label=cosmicMailText('label','举报原因'),select=document.createElement('select');for(const [value,text]of [['spam','刷屏或广告'],['unsafe','不友善内容'],['private','私人信息'],['other','其他']]){const option=cosmicMailText('option',text);option.value=value;select.append(option);}label.append(select);
  const report=cosmicMailText('button','举报这封信');report.type='button';report.addEventListener('click',()=>reportCosmicMail(item.id,select.value));envelope.append(label,report);card.append(envelope);$('cosmicMailList').append(card);
 }
}
async function cosmicMailFetch(route,options={}){
 const base=cosmicMailURL();if(!base)throw Error('共享服务尚未连接');const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
 // The protected Netlify draft needs its own access cookie. Never send it cross-origin.
 try{const response=await fetch(base+route,{...options,signal:controller.signal,credentials:'same-origin',cache:'no-store',referrerPolicy:'no-referrer'});let data;try{data=await response.json();}catch{throw Error('服务器未返回JSON（HTTP '+response.status+'），请确认测试站访问登录仍有效');}if(!response.ok)throw Error((typeof data.error==='string'?data.error:'来信服务暂时不可用')+(typeof data.code==='string'&&/^[A-Z0-9_]{1,70}$/.test(data.code)?'（'+data.code+'）':''));return data;}catch(error){if(error.name==='AbortError')throw Error('星际传送超时，请稍后重试');if(error instanceof TypeError)throw Error('网络已断开或服务不可达，请保留草稿后重试');throw error;}finally{clearTimeout(timer);}
}
async function loadCosmicMail(append=false){
 if(cosmicMailBusy)return;$('cosmicMailSend').disabled=!cosmicMailReady();
 if(!cosmicMailURL()){cosmicMailStatus('共享服务尚未连接：即将开放。当前不会发送数据，草稿只在本次打开的页面中。');$('cosmicMailMore').hidden=true;return;}
 cosmicMailBusy=true;const request=++cosmicMailRequest;$('cosmicMailRefresh').disabled=true;$('cosmicMailMore').disabled=true;cosmicMailStatus('正在接收远方的来信…');
 try{const data=await cosmicMailFetch('/messages'+(append&&cosmicMailCursor?'?before='+encodeURIComponent(cosmicMailCursor):''));if(request!==cosmicMailRequest)return;if(!Array.isArray(data.messages))throw Error('来信格式暂时无法识别');cosmicMailRender(data.messages,append);cosmicMailCursor=data.nextCursor||null;$('cosmicMailMore').hidden=!cosmicMailCursor;cosmicMailStatus($('cosmicMailList').children.length?'点击信封展开阅读；新来信先显示，昵称未经身份认证。':'还没有公开来信，愿第一份温柔从这里出发。');}catch(error){cosmicMailStatus('未能加载：'+error.message);}finally{cosmicMailBusy=false;$('cosmicMailRefresh').disabled=false;$('cosmicMailMore').disabled=false;$('cosmicMailSend').disabled=!cosmicMailReady();}
}
async function reportCosmicMail(id,reason){
 if(cosmicMailBusy)return;if(!cosmicMailReady()){cosmicMailStatus('举报前请先完成下方人机验证。');$('cosmicMailCaptcha').scrollIntoView({block:'center'});return;}
 cosmicMailBusy=true;$('cosmicMailSend').disabled=true;cosmicMailStatus('正在提交举报…');
 try{const data=await cosmicMailFetch('/reports',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,reason,captchaToken:cosmicMailCaptchaToken})});if(data.ok!==true)throw Error('服务未确认举报');if(data.hidden===true){const card=Array.from($('cosmicMailList').children).find(n=>n.dataset.letterId===id);if(card)card.remove();}cosmicMailStatus('举报已收到。30天内达到3个不同网络来源的有效举报会自动隐藏；同一网络重复举报只计一次。');}catch(error){cosmicMailStatus('举报未确认：'+error.message);}finally{cosmicMailBusy=false;cosmicMailCaptchaReset();}
}
function openCosmicMailbox(){if(busy||drag||document.hidden||(typeof roomHasDialog==='function'&&roomHasDialog()))return false;cosmicMailTrigger=$('openCosmicMailbox');clearPose();stopSinging();$('cosmicMailDialog').showModal();$('cosmicMailNickname').focus();cosmicMailInitCaptcha();loadCosmicMail();return true;}
$('openCosmicMailbox').addEventListener('click',openCosmicMailbox);
$('closeCosmicMail').addEventListener('click',()=>$('cosmicMailDialog').close());
$('cosmicMailDialog').addEventListener('close',()=>{lastActive=Date.now();cosmicMailTrigger?.focus();});
$('cosmicMailRefresh').addEventListener('click',()=>loadCosmicMail());$('cosmicMailMore').addEventListener('click',()=>loadCosmicMail(true));
$('cosmicMailForm').dataset.paper=cosmicPaper;
for(const radio of document.querySelectorAll('input[name="cosmicPaper"]'))radio.addEventListener('change',()=>{if(COSMIC_PAPERS.includes(radio.value)){cosmicPaper=radio.value;$('cosmicMailForm').dataset.paper=cosmicPaper;}});
$('cosmicMailForm').addEventListener('submit',async event=>{
 event.preventDefault();if(cosmicMailBusy)return;if(!cosmicMailURL()){cosmicMailStatus('共享服务尚未连接，暂不能发送。');return;}if(!cosmicMailReady()){cosmicMailStatus('请先完成人机验证。');return;}
 const nickname=$('cosmicMailNickname').value.trim(),body=$('cosmicMailBody').value.trim();if(!nickname||nickname.length>20||!body||body.length>300){cosmicMailStatus('请填写1–20字昵称和1–300字留言。');return;}
 cosmicMailBusy=true;$('cosmicMailSend').disabled=true;cosmicMailStatus('正在投递…请勿重复发送。');
 try{const data=await cosmicMailFetch('/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nickname,body,paper:cosmicPaper,captchaToken:cosmicMailCaptchaToken})});if(data.status!=='approved')throw Error('服务器未确认收件，请勿立即重复投递');$('cosmicMailBody').value='';cosmicMailStatus('已寄出并公开，其他朋友刷新即可看到。');if(typeof setExpression==='function')setExpression('laugh',2200);$('room').classList.add('cosmic-mail-happy');setTimeout(()=>$('room').classList.remove('cosmic-mail-happy'),2200);const lines=['小小的心意，已经飞向星空啦！','帮你贴好邮票了，等一封温柔的回信吧！','收到你的心意，豆兵也开心得晃晃翅膀！'];say(lines[Math.floor(Math.random()*lines.length)]);const page=await cosmicMailFetch('/messages').catch(()=>null);if(Array.isArray(page?.messages)){cosmicMailRender(page.messages);cosmicMailCursor=page.nextCursor||null;$('cosmicMailMore').hidden=!cosmicMailCursor;}
 }catch(error){cosmicMailStatus('投递未确认：'+error.message+'。草稿已保留；请勿立即重复发送。');}finally{cosmicMailBusy=false;cosmicMailCaptchaReset();}
});

if(COSMIC_MAILBOX_CONFIG.sharedVerified===true){$('openCosmicMailbox').textContent='✉ 打开来信箱';}
