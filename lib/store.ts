import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Project } from './types';
const storePath = process.env.DATA_FILE || path.join(process.cwd(), 'data', 'projects.json');
export async function readProjects(): Promise<Project[]> {
  try { const content = await fs.readFile(storePath, 'utf8'); return JSON.parse(content) as Project[]; }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; throw error; }
}
// Atomic file replacement; deploy on a server with persistent storage (not an ephemeral serverless filesystem).
export async function writeProjects(projects: Project[]) {
  await fs.mkdir(path.dirname(storePath), { recursive:true });
  const tmp = `${storePath}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(projects,null,2),'utf8');
  await fs.rename(tmp, storePath);
}
