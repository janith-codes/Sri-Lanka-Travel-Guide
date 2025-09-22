import fs from 'node:fs';
import path from 'node:path';
import Client from './Client';

type Params = { params: { id: string } };

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'public', 'locations.json');
  const json = fs.readFileSync(filePath, 'utf-8');
  const locations: Array<{ id: number }> = JSON.parse(json);
  return locations.map((loc) => ({ id: String(loc.id) }));
}

export default function LocationPage({ params }: Params) {
  return <Client id={params.id} />;
}