import {NextResponse} from "next/server";
// No persistent lead backend is configured. Never log personal data or claim a saved lead.
export async function POST(){return NextResponse.json({ok:false,error:"Bu uç nokta kayıt almıyor. İletişim sayfasından WhatsApp mesajınızı hazırlayabilirsiniz.",contactUrl:"/iletisim"},{status:503,headers:{"Cache-Control":"no-store"}})}
