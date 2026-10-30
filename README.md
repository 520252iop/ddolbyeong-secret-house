> 2026-10-30: Mailbox now connects to Supabase Edge Functions. Earlier migration-unavailable notes below are historical. Live read, CAPTCHA, send and refresh were verified; remaining security regression checks were simulated.

# DDOLBYEONG：GitHub Pages 迁移准备

尚未上传、提交、推送或启用Pages。新URL不是已发布事实。
本地当前项目继续保留Netlify配置和所有旧网站文件；只新增静态迁移目录。

## 检查结论

原游戏为原生HTML/CSS/JS，角色SVG、换装、喂食、睡觉、动画、养成、七日来信、日记、相册、收藏、音乐以及本地备份恢复可静态运行。无打包依赖或服务器渲染要求。
206文件的Pages产物位于dist/github-pages；index.html在产物根目录；项目仓库子路径下使用相对引用，不使用根路径 /assets 或本机绝对路径。65项HTML/CSS引用、相册138项src/thumb引用及本地资源存在检查通过。
69项相册、10套衣服保留；图片、插画、WAV、字体与字体许可逐字节保持。没有重绘、重排或压缩任何现有照片。

## 共享来信箱的明确例外

GitHub Pages不能运行netlify/functions/cosmic-mailbox.mjs；旧Netlify也正因用量限制返回usage_exceeded。把网页搬走不会恢复旧API。
本次静态副本保留来信箱位置，禁用按钮并标记“服务迁移中”，apiBase为空、sharedVerified=false，不加载Turnstile或发送失败请求，不使用localStorage伪装共享。Supabase来信不删除，原Netlify后端文件/配置不动。
如果要求共享来信与静态网站同时恢复，需要另行部署安全后端（例如把验证、限流和管理员流程移植到Supabase Edge Functions），配置GitHub Pages Origin和Turnstile允许域名；不能把service_role/secret key放进Pages。此后端迁移本轮未实施，不声称共享信箱已完整迁移。

## 性能与缓存

- 相册列表保留原有lazy loading、async decoding、明确宽高、详情按需显示。
- 13组展示图与列表图字节完全相同，构建时复用同一URL；避免潜在重复下载9,743,431字节，旧图片文件仍保留。
- 图片、字体、脚本、样式、音乐引用添加内容摘要版本号；更新只使改动文件的URL失效，不用每次随机时间戳强制下载。
- 新Service Worker仅按需缓存同源、当前项目路径下带版本号的GET资源。不预下载整个相册，不缓存API、跨域请求或Range分段请求。每个仓库路径有独立缓存前缀；只清理自己的旧静态缓存，不碰localStorage、备份或其他网站缓存。
- HTML不走Service Worker缓存优先；网页更新仍联网读取。浏览器不支持Service Worker时仍可正常游玩，依赖原HTTP缓存。
- 音乐仍由用户点击后加载，Audio对象复用、preload=none；没有首屏自动播放。两首原WAV合计约16.93MB，未安装音频转码器、未重编码；第一次点击音乐的流量仍较大。Range请求交给浏览器/HTTP缓存，不承诺完整离线音频。
- Pages的Cache-Control由平台决定，不能像自有服务器任意设定；本轮不添加无效的Netlify_headers来假装配置Pages缓存。

## 存档保护与换域名

SAVE_KEY仍为sohee-little-world-v1，数据结构、衣服ID和备份文件格式不变。没有访问真实玩家浏览器存档，所有自动测试只使用内存。
不同域名的localStorage不能自动互读；GitHub Pages新网址首次打开看起来是新存档，并不表示旧存档被删除。
正常恢复：在旧网址用网页“备份存档”下载JSON，在新网址选择该文件并确认恢复。游戏已保留格式校验、确认和防止覆盖已变化存档的保护。
旧Netlify已暂停，网页无法加载时不要清缓存、换浏览器或卸载浏览器。请先保留原设备/浏览器/配置文件。
必要时可在打开旧网址的同一浏览器开发者工具Console执行下方本地导出（无网络请求、只读旧存档）。浏览器若显示的是内部网络错误页或不允许访问存储，先停止；不要在其他网站运行后误当旧存档。

```js
(() => {
  if (location.origin !== 'https://splendorous-buttercream-852269.netlify.app')
    throw new Error('请在原Netlify网址执行');
  const raw = localStorage.getItem('sohee-little-world-v1');
  if (!raw) throw new Error('当前浏览器没有找到旧存档，请勿清理数据');
  const backup = {format:'sohee-local-backup',version:1,
    exportedAt:new Date().toISOString(),raw};
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],
    {type:'application/json'}));
  const a = document.createElement('a');
  a.href=url; a.download='ddolbyeong-old-site-save.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(url),1000);
})();
```

这不能替代真实设备恢复验收。备份JSON包含私人游戏进度，不要上传GitHub、发到公开留言或交给其他人。
同一GitHub用户名下各项目的github.io路径共享origin；不要认为换仓库路径会产生独立localStorage。当前保持同一游戏键，避免在同一origin另部署不兼容版本。
旧netlify.app子域归平台管理，无法在Pages直接接管；目前也不能在暂停的旧站设置生效跳转。需在小红书更新置顶网址并附存档备份提醒。没有更改或删除旧站。

## 仓库和Actions

唯一可上传的准备目录：publish-staging/github-pages-migration，不能把SOHEE-LITTLE-WORLD整个工作目录上传。
该目录只含pages-source（脱敏静态源）、tools的3个纯Node构建/检查文件、.github/workflows/pages.yml及说明/.gitignore，不含Netlify函数、数据库SQL、密钥、原始素材目录、个人JSON、开发日志、备份或CLI。
Actions在main推送或手动运行时构建dist/github-pages、执行检查、upload-pages-artifact，再deploy-pages。仅使用GitHub内置GITHUB_TOKEN/OIDC权限，不需要Netlify令牌、Supabase密钥或第三方付费服务。
构建命令node tools/build-pages.cjs；检查命令node tools/check-pages.cjs。没有npm安装步骤，本地Windows与Linux构建均使用相同Node内置API；Actions真正运行仍待GitHub授权后验证。

人工设置（实际操作时逐项指导）：

1. 确认GitHub账号已解除此前第三方授权/账号标记限制，能使用原仓库520252IOP/ddolbyeong-secret-house；如不能，先处理账号状态，不反复登录。
2. 确认该仓库可公开：源码、照片、插画、音频和字体会被访客下载。图片公开使用授权仍未核实；保留图片不代表获得授权。SVG嵌入完整JPEG仍可提取。
3. 只同步准备目录的内部内容到仓库根目录；不要上传外层文件夹。上传后pages-source、tools、.github应在根目录。实际Git提交/推送前核对远端历史，禁止强推覆盖已有内容。
4. 仓库Settings → Pages → Build and deployment → Source选择GitHub Actions；Actions权限若被账号或组织禁用需本人打开。
5. 运行Deploy DDOLBYEONG工作流，等待build/deploy成功。若该用户名和仓库名不变，预期URL为https://520252iop.github.io/ddolbyeong-secret-house/，以GitHub实际返回URL为准，未上线前不能宣传为已可用。
6. 真实验收桌面/手机、音频、七日信件、匿名首次访问、刷新保存及旧JSON手动恢复，再更新小红书链接。

## 安全、限制和验证结果

部署目录不含个人存档、JSON清单、秘密凭据或本机绝对路径。字体许可保留；图片权利风险未解决。音乐为现有原创WAV，未新增外部音源。
GitHub Pages是静态托管，存在容量、带宽及平台政策限制，不承诺长期无限免费。免费账号公开仓库可用Pages；若账号限制未解除仍不能保证发布。
本轮自动检查通过：206静态文件，69相册，10套衣服，65HTML/CSS相对资源引用，旧媒体字节保持、脚本语法、模拟刷新/独立存档/原字段保留/备份确认恢复/睡觉唱歌互动、缓存边界检查。
尚未执行：GitHub上传或Pages启用、Actions云端运行、真实Pages子路径浏览器访问、手机视觉、实际音频播放、真实旧地址存档导出恢复。旧Netlify继续保留；原来信箱的数据库访问权限不降低。

官方依据：
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/github-pages-limits
