
import { NextResponse } from 'next/server';
import { openDb, setup } from '@/db/database';

export async function POST(request: Request) {
  await setup();
  const db = await openDb();
  const { id } = await request.json();

  const result = await db.run('DELETE FROM words WHERE id = ?', id);

  return NextResponse.json({ affectedRows: result.changes });
}
