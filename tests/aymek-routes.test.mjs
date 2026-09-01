import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import worker from '../dist/server/index.js';
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
const ctx={waitUntil(){},passThroughOnException(){}};
async function page(path){const r=await worker.fetch(new Request('http://localhost'+path,{headers:{accept:'text/html'}}),env,ctx);assert.equal(r.status,200,path);const html=await r.text();assert.match(html,/<title>[^<]*Aymek Dijital/);assert.equal((html.match(/<h1\b/g)||[]).length,1,path+' needs one h1');assert.doesNotMatch(html,/RCP Digital|RCP DIGITAL/);return html}
test('all Aymek catalog and detail routes render',async()=>{const visited=new Set();for(const base of ['/','/hizmetler','/kurumsal','/sektorler','/bilgi-merkezi','/referanslar','/e-ticaret','/iletisim']){const html=await page(base);visited.add(base);for(const [,href]of html.matchAll(/href="(\/(?:hizmetler|kurumsal|sektorler|bilgi-merkezi)\/[^"?#]+)"/g)){if(!visited.has(href)){await page(href);visited.add(href)}}}assert.ok(visited.size>=55,`Only ${visited.size} routes`);console.log('Verified routes:',visited.size)});
test('30 reference assets are valid PNGs',async()=>{const directory=new URL('../public/aymek/',import.meta.url);const files=(await readdir(directory)).filter(x=>x.startsWith('Adsiz-'));assert.equal(files.length,30);for(const file of files){const b=await readFile(new URL(file,directory));assert.equal(b.subarray(1,4).toString(),'PNG',file)}});
