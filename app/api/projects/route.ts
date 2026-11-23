import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { isAdmin } from '@/lib/auth';
import { readProjects, writeProjects } from '@/lib/store';
import type { Project } from '@/lib/types';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const clean = (raw:Record<string,unknown>, base?:Project):Project => {
 const str=(v:unknown,max=500)=>String(v??'').trim().slice(0,max);
 const link=(v:unknown)=>{const s=str(v,1000);if(!s)return '';try{const u=new URL(s);return ['http:','https:'].includes(u.protocol)?s:'';}catch{return ''}};
 const img=str(raw.image,1000);const safeImage=img.startsWith('/uploads/')&&!img.includes('..')?img:link(img);
 return {id:base?.id||randomUUID(),title:str(raw.title,120),category:str(raw.category,80),description:str(raw.description,800),tags:Array.isArray(raw.tags)?raw.tags.slice(0,12).map(v=>str(v,35)).filter(Boolean):[],image:safeImage,url:link(raw.url),github:link(raw.github),featured:Boolean(raw.featured),published:raw.published!==false,createdAt:base?.createdAt||new Date().toISOString()};
};
export async function GET(request:NextRequest){const all=await readProjects();const admin=await isAdmin();return NextResponse.json(admin&&request.nextUrl.searchParams.get('all')==='1'?all:all.filter(p=>p.published));}
export async function POST(request:NextRequest){if(!await isAdmin())return NextResponse.json({error:'دسترسی غیرمجاز'},{status:401});const body=await request.json().catch(()=>null);if(!body||typeof body!=='object')return NextResponse.json({error:'داده نامعتبر'},{status:400});const project=clean(body);if(!project.title)return NextResponse.json({error:'عنوان الزامی است'},{status:400});const list=await readProjects();list.unshift(project);await writeProjects(list);return NextResponse.json(project,{status:201});}
export async function PUT(request:NextRequest){if(!await isAdmin())return NextResponse.json({error:'دسترسی غیرمجاز'},{status:401});const body=await request.json().catch(()=>null);if(!body||typeof body!=='object')return NextResponse.json({error:'داده نامعتبر'},{status:400});const list=await readProjects();const idx=list.findIndex(p=>p.id===body.id);if(idx<0)return NextResponse.json({error:'پروژه پیدا نشد'},{status:404});list[idx]=clean(body,list[idx]);if(!list[idx].title)return NextResponse.json({error:'عنوان الزامی است'},{status:400});await writeProjects(list);return NextResponse.json(list[idx]);}
export async function DELETE(request:NextRequest){if(!await isAdmin())return NextResponse.json({error:'دسترسی غیرمجاز'},{status:401});const id=request.nextUrl.searchParams.get('id');const list=await readProjects();if(!list.some(p=>p.id===id))return NextResponse.json({error:'پروژه پیدا نشد'},{status:404});await writeProjects(list.filter(p=>p.id!==id));return NextResponse.json({ok:true});}
