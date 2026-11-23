import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
export const runtime='nodejs';
export async function POST(request:NextRequest){
 if(!await isAdmin())return NextResponse.json({error:'دسترسی غیرمجاز'},{status:401});
 const form=await request.formData();const file=form.get('file');if(!(file instanceof File))return NextResponse.json({error:'فایل انتخاب نشده'},{status:400});
 if(file.size>5*1024*1024)return NextResponse.json({error:'حداکثر حجم فایل ۵ مگابایت است'},{status:400});
 const types:Record<string,string>={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif'};
 const ext=types[file.type];if(!ext)return NextResponse.json({error:'فرمت مجاز: PNG، JPG، WebP یا GIF'},{status:400});
 const dir=process.env.UPLOAD_DIR || path.join(process.cwd(),'public','uploads');await fs.mkdir(dir,{recursive:true});
 const name=`${randomUUID()}.${ext}`;await fs.writeFile(path.join(dir,name),Buffer.from(await file.arrayBuffer()));
 return NextResponse.json({url:`/uploads/${name}`});
}
