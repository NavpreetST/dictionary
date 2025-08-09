import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Word } from '@/lib/database';

// GET - Fetch all words
export async function GET() {
  try {
    const db = await getDatabase();
    const words = await db.getAllWords();
    return NextResponse.json({ words }, { status: 200 });
  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch words' },
      { status: 500 }
    );
  }
}

// POST - Add a new word
export async function POST(request: NextRequest) {
  try {
    const { germanWord }: { germanWord: string } = await request.json();
    
    if (!germanWord || !germanWord.trim()) {
      return NextResponse.json(
        { error: 'German word is required' },
        { status: 400 }
      );
    }

    console.log('Adding word:', germanWord);
    
    // Get word details with shorter timeout and fallback
    let wordDetails;
    try {
      wordDetails = await Promise.race([
        getWordDetailsFromAI(germanWord.trim().toLowerCase()),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('API timeout')), 10000)
        )
      ]);
    } catch (timeoutError) {
      console.log('API timeout, using fallback for:', germanWord);
      wordDetails = getBasicWordDetails(germanWord.trim().toLowerCase());
    }
    
    console.log('Got word details:', wordDetails);
    
    const db = await getDatabase();
    const newWord = await db.addWord({
      german: germanWord.trim().toLowerCase(),
      partOfSpeech: wordDetails.partOfSpeech,
      article: wordDetails.article,
      definition: wordDetails.definition,
      translation: wordDetails.translation,
      examples: wordDetails.examples || [],
      alternateMeanings: wordDetails.alternateMeanings || [],
    });

    console.log('Word added successfully:', newWord);
    return NextResponse.json({ word: newWord }, { status: 201 });
  } catch (error) {
    console.error('Error adding word:', error);
    return NextResponse.json(
      { error: `Failed to add word: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// DELETE - Delete a word
export async function DELETE(request: NextRequest) {
  try {
    const { german }: { german: string } = await request.json();
    
    if (!german) {
      return NextResponse.json(
        { error: 'German word is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    await db.deleteWord(german);
    
    return NextResponse.json({ message: 'Word deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting word:', error);
    return NextResponse.json(
      { error: 'Failed to delete word' },
      { status: 500 }
    );
  }
}

async function getWordDetailsFromAI(word: string): Promise<{
  partOfSpeech: string;
  article: string;
  definition: string;
  translation: string;
  examples?: string[];
  alternateMeanings?: string[];
}> {
  // Add your Google Gemini API key here
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    // Fallback to basic lookup if no API key
    return getBasicWordDetails(word);
  }

  try {
    const prompt = `For the German word "${word}", provide:
1. Part of speech (Noun, Verb, Adjective, Adverb, Other)
2. Article (der/die/das for nouns, "–" for others)
3. Primary English translation
4. Simple English definition
5. 2-3 German example sentences using the word
6. Any alternate meanings or translations (if applicable)

Format as JSON: {"partOfSpeech": "Noun", "article": "der", "translation": "dog", "definition": "A domestic canine", "examples": ["Der Hund bellt laut.", "Ich gehe mit dem Hund spazieren."], "alternateMeanings": ["colloquial: person (derogatory)"]}`

// If no examples or alternate meanings exist, use empty arrays.`;
    
    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0]) {
      const textResponse = result.candidates[0].content.parts[0].text;
      const cleanedText = textResponse.replace(/```json|```/g, '').trim();
      const wordData = JSON.parse(cleanedText);

      return {
        partOfSpeech: wordData.partOfSpeech || 'Other',
        article: wordData.article || '–',
        definition: wordData.definition,
        translation: wordData.translation,
        examples: wordData.examples || [],
        alternateMeanings: wordData.alternateMeanings || [],
      };
    } else {
      throw new Error("Invalid response structure from the API.");
    }
  } catch (error) {
    console.error('AI API error, falling back to basic lookup:', error);
    return getBasicWordDetails(word);
  }
}

// Fallback function for basic word details
function getBasicWordDetails(word: string): {
  partOfSpeech: string;
  article: string;
  definition: string;
  translation: string;
} {
  // Basic German articles assignment (very simplified)
  const commonNouns: Record<string, { article: string; translation: string; definition: string }> = {
    'haus': { article: 'das', translation: 'house', definition: 'A building for human habitation' },
    'katze': { article: 'die', translation: 'cat', definition: 'A small domesticated carnivorous mammal' },
    'hund': { article: 'der', translation: 'dog', definition: 'A domesticated carnivorous mammal' },
    'wasser': { article: 'das', translation: 'water', definition: 'A colorless, transparent, odorless liquid' },
    'buch': { article: 'das', translation: 'book', definition: 'A set of written or printed pages' },
    'auto': { article: 'das', translation: 'car', definition: 'A road vehicle with an engine' },
    'frau': { article: 'die', translation: 'woman', definition: 'An adult female human being' },
    'mann': { article: 'der', translation: 'man', definition: 'An adult male human being' },
    'kind': { article: 'das', translation: 'child', definition: 'A young human being' },
    'tisch': { article: 'der', translation: 'table', definition: 'A piece of furniture with a flat top' },
    'stuhl': { article: 'der', translation: 'chair', definition: 'A seat for one person' },
    'fenster': { article: 'das', translation: 'window', definition: 'An opening in a wall filled with glass' },
  };

  const commonVerbs: Record<string, { translation: string; definition: string }> = {
    'sein': { translation: 'to be', definition: 'To exist or to have the quality of' },
    'haben': { translation: 'to have', definition: 'To possess or own something' },
    'gehen': { translation: 'to go', definition: 'To move from one place to another' },
    'kommen': { translation: 'to come', definition: 'To move toward a specific location' },
    'machen': { translation: 'to make/do', definition: 'To create or perform an action' },
    'sehen': { translation: 'to see', definition: 'To perceive with the eyes' },
    'sagen': { translation: 'to say', definition: 'To speak words or express verbally' },
  };

  const commonAdjectives: Record<string, { translation: string; definition: string }> = {
    'gut': { translation: 'good', definition: 'Of high quality or satisfactory' },
    'groß': { translation: 'big/tall', definition: 'Of large size or extent' },
    'klein': { translation: 'small', definition: 'Of little size or extent' },
    'schön': { translation: 'beautiful', definition: 'Pleasing to look at; attractive' },
    'alt': { translation: 'old', definition: 'Having lived for a long time' },
    'neu': { translation: 'new', definition: 'Recently made or obtained' },
  };

  let partOfSpeech = 'Other';
  let article = '–';
  let definition = `Definition for ${word}`;
  let translation = `Translation of ${word}`;

  if (commonNouns[word]) {
    partOfSpeech = 'Noun';
    article = commonNouns[word].article;
    translation = commonNouns[word].translation;
    definition = commonNouns[word].definition;
  } else if (commonVerbs[word]) {
    partOfSpeech = 'Verb';
    translation = commonVerbs[word].translation;
    definition = commonVerbs[word].definition;
  } else if (commonAdjectives[word]) {
    partOfSpeech = 'Adjective';
    translation = commonAdjectives[word].translation;
    definition = commonAdjectives[word].definition;
  }

  return {
    partOfSpeech,
    article,
    definition,
    translation,
  };
}
