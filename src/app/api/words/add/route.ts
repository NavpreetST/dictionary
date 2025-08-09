
import { NextResponse } from 'next/server';
import { openDb, setup } from '@/db/database';

export async function POST(request: Request) {
  await setup();
  const db = await openDb();
  const { germanWord } = await request.json();

  // This is a placeholder for the Google Generative Language API call
  // In a real application, you would make an API call here to get the word details
  const wordData = {
    partOfSpeech: 'Noun',
    article: 'der',
    definition: 'A domestic canine.',
    translation: 'dog',
  };

  const result = await db.run(
    'INSERT INTO words (german, partOfSpeech, article, definition, translation) VALUES (?, ?, ?, ?, ?)',
    germanWord,
    wordData.partOfSpeech,
    wordData.article,
    wordData.definition,
    wordData.translation
  );

  return NextResponse.json({ id: result.lastID });
}
