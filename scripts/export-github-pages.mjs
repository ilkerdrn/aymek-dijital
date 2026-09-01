import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
import worker from '../dist/server/index.js';
const prefix='/aymek-dijital';
const out=new URL('../gh-pages/',import.meta.url);
const env={ASSETS:{fetch:async()=>new Response('Not found',{status:404})}};
const ctx={waitUntil(){},passThroughOnException(){}};
const queue=['/'];const seen=new Set();
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
while(queue.length){const path=queue.shift();if(seen.has(path))continue;seen.add(path);const response=await worker.fetch(new Request(`https://pages.local${path}`,{headers:{accept:'text/html'}}),env,ctx);if(response.status!==200)throw new Error(`Page export failed: ${path}`);let html=await response.text();for(const [,href] of html.matchAll(/href="(\/[^"#?]*)[^\"]*"/g)){if(!href.startsWith('/_')&&!/\.(png|svg|ico|css|js)$/.test(href)&&!seen.has(href))queue.push(href)}html=html.replaceAll('href="/','href="'+prefix+'/').replaceAll('src="/','src="'+prefix+'/').replaceAll('href="'+prefix+'//','href="//').replace('</head>',`<script>addEventListener('click',e=>{const a=e.target.closest('a');if(a&&a.href&&a.origin===location.origin){e.preventDefault();location.href=a.href}},true)</script></head>`);const target=path==='/'?new URL('index.html',out):new URL(`.${path}/index.html`,out);await mkdir(new URL('./',target),{recursive:true});await writeFile(target,html)}
await cp(new URL('../dist/client/',import.meta.url),out,{recursive:true});await cp(new URL('../public/',import.meta.url),out,{recursive:true});await writeFile(new URL('.nojekyll',out),'');console.log(`Exported ${seen.size} pages for GitHub Pages.`);
