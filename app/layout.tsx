import type {Metadata} from 'next';
import {AgencyHeader,AgencyFooter} from '@/components/agency-shell';
import ScrollReveal from '@/components/scroll-reveal';
import './globals.css';
export const metadata:Metadata={title:'Aymek Dijital | Strateji, Tasarım ve Dijital Büyüme',description:'İstanbul merkezli Aymek Dijital: Google ve Meta reklamları, e-ticaret danışmanlığı, sosyal medya, web tasarım ve yaratıcı marka çözümleri.',icons:{icon:{url:'/aymek/logo.png',type:'image/png'}}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr"><body><AgencyHeader/><main id="main">{children}</main><AgencyFooter/><ScrollReveal/></body></html>}
