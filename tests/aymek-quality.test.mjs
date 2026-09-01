import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import worker from '../dist/server/index.js';
const env={ASSETS:{fetch:async()=>new Response('Missing',{status:404})}};
const ctx={waitUntil(){},passThroughOnException(){}};
const request=(path,init)=>worker.fetch(new Request('https://rcp-digital.ilkerdrnn.chatgpt.site'+path,init),env,ctx);
test('original logo replaces all invented brand artwork',async()=>{
 const html=await (await request('/')).text();
 assert.ok((html.match(/src="\/aymek\/logo.png"/g)||[]).length>=3);
 assert.doesNotMatch(html,/✳|class="motion-type"|favicon.svg/);
 const logo=await readFile(new URL('../public/aymek/logo.png',import.meta.url));
 assert.equal(logo.subarray(1,4).toString(),'PNG');
});
test('internal links and image assets on all linked pages resolve',async()=>{
 const queue=['/'];const seen=new Set();
 while(queue.length){const path=queue.shift();if(seen.has(path))continue;seen.add(path);assert.ok(seen.size<150);const res=await request(path);assert.equal(res.status,200,path);const html=await res.text();
 for(const [,href] of html.matchAll(/href="(\/[^"#?]*)[^\"]*"/g)){if(!href.startsWith('//')&&!href.startsWith('/_')&&!/\.(png|svg|ico|css|js)$/.test(href)&&!seen.has(href))queue.push(href)}
 for(const [,src] of html.matchAll(/<img[^>]*src="(\/[^\"]+)"/g))await access(new URL('../public'+src,import.meta.url));
 assert.match(html,/<meta name="description" content="[^"]+"/);
 }assert.ok(seen.size>=60);console.log('Internal-link audit:',seen.size,'pages');
});
test('contact preserves valid service selection and rejects unknown selections',async()=>{
 const base=await (await request('/iletisim')).text();const [,title]=base.match(/<option[^>]*>([^<]+)<\/option><option[^>]*>([^<]+)/)||[];
 const service=base.match(/<option[^>]*>Birlikte değerlendirelim<\/option><option[^>]*>([^<]+)/)?.[1];assert.ok(service);
 const html=await(await request('/iletisim?hizmet='+encodeURIComponent(service))).text();
 assert.match(html,new RegExp('<option[^>]*selected=""[^>]*>'+service.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
 const invalid=await(await request('/iletisim?hizmet=UNKNOWN_SERVICE')).text();assert.match(invalid,/<option[^>]*selected=""[^>]*>Birlikte değerlendirelim/);
});
test('missing pages return 404 with recovery navigation',async()=>{for(const path of ['/olmayan-sayfa','/hizmetler/olmayan-hizmet']){const r=await request(path);assert.equal(r.status,404,path);assert.match(await r.text(),/Ana sayfaya dön/)}});
test('unconfigured lead API does not pretend to save personal data',async()=>{const r=await request('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Test User',phone:'05550000000',business:'Test',service:'Test'})});assert.equal(r.status,503);assert.equal((await r.json()).ok,false);const source=await readFile(new URL('../app/api/lead/route.ts',import.meta.url),'utf8');assert.doesNotMatch(source,/console\.(log|info)|req\.json/)});
