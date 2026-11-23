import { NextRequest, NextResponse } from 'next/server';
import { checkPassword, configured, isAdmin, makeSession, sessionCookie } from '@/lib/auth';
export const runtime='nodejs';
export async function GET(){return NextResponse.json({authenticated:await isAdmin(),configured:configured()});}
export async function POST(request:NextRequest){
  const body=await request.json().catch(()=>({}));
  if(!configured())return NextResponse.json({error:'ابتدا فایل .env.local را تنظیم کنید.'},{status:503});
  if(!checkPassword(String(body.password||'')))return NextResponse.json({error:'رمز عبور صحیح نیست.'},{status:401});
  const res=NextResponse.json({ok:true});res.cookies.set(sessionCookie,makeSession(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:604800});return res;
}
export async function DELETE(){const res=NextResponse.json({ok:true});res.cookies.set(sessionCookie,'',{httpOnly:true,path:'/',maxAge:0});return res;}
