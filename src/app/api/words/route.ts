import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

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
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('API timeout')), 25000) // Increased timeout to 25 seconds
        )
      ]);
    } catch (error) {
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
4. DEUTSCHE Definition - Eine einfache deutsche Definition (Simple German definition in Deutsche)
5. 2-3 German example sentences using the word
6. Any alternate meanings or translations (if applicable)

WICHTIG: Die Definition soll auf DEUTSCH geschrieben werden, nicht auf Englisch! (IMPORTANT: The definition should be written in GERMAN, not English!)

Format as JSON: {"partOfSpeech": "Noun", "article": "der", "translation": "dog", "definition": "Ein domestiziertes Säugetier, das als Haustier gehalten wird (A domesticated mammal kept as a pet)", "examples": ["Der Hund bellt laut.", "Ich gehe mit dem Hund spazieren."], "alternateMeanings": ["umgangssprachlich: Person (abwertend) - colloquial: person (derogatory)"]}

// If no examples or alternate meanings exist, use empty arrays.
// Remember: definition must be in German language with optional English translation in parentheses.`;
    
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
  examples?: string[];
  alternateMeanings?: string[];
} {
  // Basic German articles assignment (very simplified)
  const commonNouns: Record<string, { article: string; translation: string; definition: string }> = {
    'haus': { article: 'das', translation: 'house', definition: 'Ein Gebäude, in dem Menschen wohnen (A building where people live)' },
    'katze': { article: 'die', translation: 'cat', definition: 'Ein kleines domestiziertes Raubtier als Haustier (A small domesticated predator kept as a pet)' },
    'hund': { article: 'der', translation: 'dog', definition: 'Ein domestiziertes Säugetier, das als Haustier gehalten wird (A domesticated mammal kept as a pet)' },
    'wasser': { article: 'das', translation: 'water', definition: 'Eine farblose, durchsichtige Flüssigkeit (A colorless, transparent liquid)' },
    'buch': { article: 'das', translation: 'book', definition: 'Eine Sammlung von geschriebenen oder gedruckten Seiten (A collection of written or printed pages)' },
    'auto': { article: 'das', translation: 'car', definition: 'Ein Straßenfahrzeug mit einem Motor (A road vehicle with an engine)' },
    'frau': { article: 'die', translation: 'woman', definition: 'Eine erwachsene weibliche Person (An adult female person)' },
    'mann': { article: 'der', translation: 'man', definition: 'Eine erwachsene männliche Person (An adult male person)' },
    'kind': { article: 'das', translation: 'child', definition: 'Ein junger Mensch (A young human being)' },
    'tisch': { article: 'der', translation: 'table', definition: 'Ein Möbelstück mit einer flachen Oberfläche (A piece of furniture with a flat surface)' },
    'stuhl': { article: 'der', translation: 'chair', definition: 'Ein Sitzmöbel für eine Person (A seat for one person)' },
    'fenster': { article: 'das', translation: 'window', definition: 'Eine Öffnung in der Wand, die mit Glas gefüllt ist (An opening in a wall filled with glass)' },
  };

  const commonVerbs: Record<string, { translation: string; definition: string }> = {
    'sein': { translation: 'to be', definition: 'Existieren oder eine Eigenschaft haben (To exist or to have a quality)' },
    'haben': { translation: 'to have', definition: 'Etwas besitzen oder innehaben (To possess or own something)' },
    'gehen': { translation: 'to go', definition: 'Sich von einem Ort zu einem anderen bewegen (To move from one place to another)' },
    'kommen': { translation: 'to come', definition: 'Sich zu einem bestimmten Ort hin bewegen (To move toward a specific location)' },
    'machen': { translation: 'to make/do', definition: 'Etwas erschaffen oder eine Handlung ausführen (To create or perform an action)' },
    'sehen': { translation: 'to see', definition: 'Mit den Augen wahrnehmen (To perceive with the eyes)' },
    'sagen': { translation: 'to say', definition: 'Wörter aussprechen oder verbal ausdrücken (To speak words or express verbally)' },
  };

  const commonAdjectives: Record<string, { translation: string; definition: string }> = {
    'gut': { translation: 'good', definition: 'Von hoher Qualität oder zufriedenstellend (Of high quality or satisfactory)' },
    'groß': { translation: 'big/tall', definition: 'Von großer Größe oder Ausdehnung (Of large size or extent)' },
    'klein': { translation: 'small', definition: 'Von geringer Größe oder Ausdehnung (Of little size or extent)' },
    'schön': { translation: 'beautiful', definition: 'Angenehm anzusehen; attraktiv (Pleasing to look at; attractive)' },
    'alt': { translation: 'old', definition: 'Lange gelebt habend oder existierend (Having lived or existed for a long time)' },
    'neu': { translation: 'new', definition: 'Kürzlich gemacht oder erhalten (Recently made or obtained)' },
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
    examples: [],
    alternateMeanings: [],
  };
}
