import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'زهرا ایمانی فرد | طراح و توسعه‌دهنده فول‌استک',description:'پورتفولیوی زهرا ایمانی فرد، طراح وب و توسعه‌دهنده فول‌استک. طراحی تجربه‌های دیجیتال خلاق و سریع.',robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fa" dir="rtl"><body>{children}</body></html>}
