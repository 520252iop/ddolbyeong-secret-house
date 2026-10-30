// Portable, dependency-free GitHub Pages build. Input contains PUBLIC runtime only.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source=path.join(root,'pages-source'),out=path.join(root,'dist/github-pages');
const walk=(dir,base=dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{assert(!e.isSymbolicLink(),'Symlinks forbidden');const f=path.join(dir,e.name);return e.isDirectory()?walk(f,base):[path.relative(base,f).replaceAll('\\','/')];});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex').slice(0,16);
fs.mkdirSync(out,{recursive:true});assert(!fs.lstatSync(path.dirname(out)).isSymbolicLink());assert(!fs.lstatSync(out).isSymbolicLink());
const files=walk(source),data=new Map(files.map(f=>[f,fs.readFileSync(path.join(source,f))]));
assert(!files.some(f=>/^(?:netlify|cloud|backups|reports|tests)\/|\.env|\.json$|\/originals\//.test(f)),'Nonpublic input');
const photos=JSON.parse(data.get('memory-album-data.js').toString().match(/const MEMORY_PHOTOS\s*=\s*(\[[\s\S]*\]);/)[1]);
let reused=0,reusedBytes=0;
for(const photo of photos){if(data.get(photo.src).equals(data.get(photo.thumb))&&photo.src!==photo.thumb){photo.thumb=photo.src;reused++;reusedBytes+=data.get(photo.src).length;}}
const versions=new Map([...data].map(([f,b])=>[f,hash(b)]));
const assetRef=(ref,from)=>{if(/^(?:data:|https?:|#)/.test(ref))return ref;assert(!ref.startsWith('/'),'Root-relative path '+ref);const file=path.posix.normalize(path.posix.join(path.posix.dirname(from),ref.split(/[?#]/)[0]));assert(files.includes(file),'Missing reference '+file);return ref.split('?')[0]+'?v='+versions.get(file);};
// Preserve media bytes and filenames; only generated references and public text change.
data.set('memory-album-data.js',Buffer.from("'use strict';\nconst MEMORY_PHOTOS="+JSON.stringify(photos.map(p=>({...p,src:assetRef(p.src,'memory-album-data.js'),thumb:assetRef(p.thumb,'memory-album-data.js')})))+';\n'));
data.set('cosmic-mailbox-config.js',Buffer.from("'use strict';\nconst COSMIC_MAILBOX_CONFIG=Object.freeze({apiBase:'',turnstileSiteKey:'',sharedVerified:false});\n"));
for(const [file,buffer]of data){if(!/\.(js|css)$/.test(file)||file==='memory-album-data.js')continue;let text=buffer.toString();if(file.endsWith('.css'))text=text.replace(/url\((['"]?)([^)'"\s]+)\1\)/g,(m,q,ref)=>'url('+q+assetRef(ref,file)+q+')');else text=text.replace(/^\s*\/\/.*$/gm,'').replace(/(['"])(assets\/[^'"\s?]+\.(?:wav|mp3|jpg|jpeg|png|svg|webp|ttf|woff2?|js))\1/g,(m,q,ref)=>q+assetRef(ref,file)+q);data.set(file,Buffer.from(text));}
for(const [f,b]of data)versions.set(f,hash(b));
let html=data.get('index.html').toString();
html=html.replace(/<section class="cosmic-mail-panel"[\s\S]*?<\/section>/,m=>m.replace(/<p>[\s\S]*?<\/p>/,'<p>共享来信服务迁移中，暂不可用。原有来信保留。</p>').replace(/<button\b[^>]*id="openCosmicMailbox"[^>]*>[\s\S]*?<\/button>/,'<button type="button" id="openCosmicMailbox" disabled>✉ 来信箱 · 迁移中</button>'));
html=html.replace(/((?:src|href)=")([^"]+)(")/g,(m,a,ref,z)=>a+assetRef(ref,'index.html')+z);
const release=hash(Buffer.concat([...data.values()]));
html=html.replace('</body>',`<script src="pages-cache.js?v=${release}"></script></body>`);
data.set('index.html',Buffer.from(html));
data.set('pages-cache.js',Buffer.from(`'use strict';if('serviceWorker' in navigator&&location.protocol==='https:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./pages-sw.js',{updateViaCache:'none'}).catch(()=>{}));}\n`));
data.set('pages-sw.js',Buffer.from(`'use strict';
const PREFIX='ddolbyeong-pages-static-'+encodeURIComponent(new URL(self.registration.scope).pathname)+'-';
const CACHE=PREFIX+'${release}';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const req=event.request,u=new URL(req.url),scope=new URL(self.registration.scope);if(req.method!=='GET'||u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname)||req.headers.has('range')||!(/^[a-f0-9]{16}$/.test(u.searchParams.get('v')||'')))return;
event.respondWith((async()=>{const cache=await caches.open(CACHE),hit=await cache.match(req);if(hit)return hit;const res=await fetch(req);if(res.status===200&&res.type==='basic')try{await cache.put(req,res.clone());}catch{}return res;})());});
`));
for(const [file,buffer]of data){if(/\.(?:js|css|html|svg|txt)$/.test(file))assert(!/\b[A-Z]:[\\/]|file:\/\/\/|-----BEGIN .*PRIVATE KEY|sb_secret_[A-Za-z0-9_-]{10,}/i.test(buffer.toString()),'Unsafe '+file);const dest=path.join(out,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,buffer);}
assert.equal(walk(out).length,data.size,'Unexpected stale output: use a fresh output directory');
fs.writeFileSync(path.join(root,'dist/github-pages-build.json'),JSON.stringify({files:data.size,photos:photos.length,bytes:[...data.values()].reduce((n,b)=>n+b.length,0),reusedImageURLs:reused,avoidedDuplicateImageBytes:reusedBytes,mailbox:'disabled: backend migration required'},null,2));
console.log(fs.readFileSync(path.join(root,'dist/github-pages-build.json'),'utf8'));
