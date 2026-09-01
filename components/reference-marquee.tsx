"use client";
import {useState} from 'react';
import {Pause,Play} from 'lucide-react';
import {referenceIds,referenceImage,referenceNames} from '@/lib/brand';
export default function ReferenceMarquee(){
 const [paused,setPaused]=useState(false);
 return <div className="reference-marquee" data-paused={paused}>
  <div className="marquee-window" tabIndex={0} role="region" aria-label="Aymek Dijital referans markaları">
   <div className="marquee-track">
    {[0,1].map(copy=><div className="marquee-group" key={copy} aria-hidden={copy===1?true:undefined}>
     {referenceIds.map((id,i)=><div className="marquee-logo" key={id}><img src={referenceImage(id)} alt={copy===1?'':referenceNames[id]||`Aymek Dijital referans markası ${i+1}`} width="300" height="275" loading="lazy" decoding="async"/></div>)}
    </div>)}
   </div>
  </div>
  <button className="marquee-toggle" type="button" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?<Play size={14}/>:<Pause size={14}/>} {paused?'Kaydırmayı başlat':'Kaydırmayı duraklat'}</button>
 </div>
}
