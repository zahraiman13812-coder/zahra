import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
const COOKIE = 'zahra_admin_session';
function secret() {return process.env.SESSION_SECRET || '';}
export function configured() {return Boolean(process.env.ADMIN_PASSWORD && secret().length >= 32);}
function signature(payload: string) {return createHmac('sha256', secret()).update(payload).digest('hex');}
export function makeSession() { const expiry = Date.now()+1000*60*60*24*7; const payload=String(expiry); return `${payload}.${signature(payload)}`; }
export function validSession(token?:string) {if (!configured() || !token) return false; const [payload,sig,...extra]=token.split('.'); if(!payload||!sig||extra.length||!/^\d+$/.test(payload)||Number(payload)<Date.now())return false; const expected=signature(payload); return sig.length===expected.length && timingSafeEqual(Buffer.from(sig),Buffer.from(expected));}
export async function isAdmin() {const jar=await cookies();return validSession(jar.get(COOKIE)?.value);}
export function checkPassword(password:string) {const expected=process.env.ADMIN_PASSWORD||'';const a=Buffer.from(password);const b=Buffer.from(expected);return configured() && a.length===b.length && timingSafeEqual(a,b);}
export const sessionCookie = COOKIE;
