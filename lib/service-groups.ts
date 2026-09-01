import {servicePages} from './services';
export const commerceSlugs=['e-ticaret-danismanligi','shopify-danismanligi','e-ihracat-danismanligi','stratejik-planlama','yazilim-danismanligi','depo-lojistik','finansal-planlama','insan-kaynaklari-plani'];
const creative=['sosyal-medya-yonetimi','marka-ve-kreatif','grafik-tasarim','icerik-uretimi','influencer-marketing','web-tasarim','televizyon-reklamlari'];
export function serviceGroup(slug:string){return commerceSlugs.includes(slug)?'E-ticaret & operasyon':creative.includes(slug)?'Marka, içerik & deneyim':'Dijital reklam & görünürlük'}
export const serviceGroups=['Dijital reklam & görünürlük','Marka, içerik & deneyim','E-ticaret & operasyon'];
export const serviceEntries=Object.entries(servicePages);
