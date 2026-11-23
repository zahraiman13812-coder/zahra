import { readProjects } from '@/lib/store';
import { Portfolio } from '@/components/portfolio';
export const dynamic='force-dynamic';
export default async function Home(){const projects=(await readProjects()).filter(p=>p.published);return <Portfolio projects={projects}/>;}
