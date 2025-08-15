import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic }: { topic: string } = await request.json();
    
    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: 'Grammar topic is required' },
        { status: 400 }
      );
    }

    console.log('Fetching grammar explanation for:', topic);
    
    const topicData = await getGrammarExplanation(topic.trim());
    
    return NextResponse.json(topicData, { status: 200 });
  } catch (error) {
    console.error('Error fetching grammar topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grammar topic explanation' },
      { status: 500 }
    );
  }
}

async function getGrammarExplanation(topic: string) {
  const GEMINI_GRAMMAR_API_KEY = process.env.GEMINI_GRAMMAR_API_KEY;
  
  if (!GEMINI_GRAMMAR_API_KEY) {
    throw new Error('Grammar API key not configured');
  }

  try {
    const prompt = `Provide a comprehensive explanation for the German grammar topic: "${topic}" in GERMAN language (Deutsche).

WICHTIG: Alle Erklärungen, Regeln und Tipps sollen auf DEUTSCH sein, mit englischen Übersetzungen in Klammern für schwierige Begriffe.

Please format your response as a JSON object with the following structure:
{
  "topic": "The topic name in German (English translation)",
  "explanation": "Eine klare, präzise Erklärung des Grammatikkonzepts auf Deutsch (2-3 Sätze). A clear, concise explanation of the grammar concept in German (2-3 sentences)",
  "rules": [
    "Regel 1 mit klarer Erklärung auf Deutsch (Rule 1 with clear explanation in German)",
    "Regel 2 mit klarer Erklärung auf Deutsch (Rule 2 with clear explanation in German)",
    "Regel 3 mit klarer Erklärung auf Deutsch (Rule 3 with clear explanation in German)",
    "Regel 4 mit klarer Erklärung auf Deutsch (Rule 4 with clear explanation in German)"
  ],
  "examples": [
    {
      "german": "German sentence example",
      "english": "English translation",
      "highlight": "the specific part demonstrating the grammar rule"
    },
    // Include 4-6 examples
  ],
  "tips": [
    "Praktischer Tipp 1 zum Meistern dieses Konzepts auf Deutsch (Practical tip 1 for mastering this concept in German)",
    "Praktischer Tipp 2 auf Deutsch (Practical tip 2 in German)",
    "Praktischer Tipp 3 auf Deutsch (Practical tip 3 in German)"
  ]
}

Make sure:
1. ALLE Erklärungen sind auf DEUTSCH geschrieben (All explanations are written in GERMAN)
2. Die Erklärung ist klar und für Fortgeschrittene geeignet (The explanation is clear and suitable for intermediate learners)
3. Regeln sind praktisch und leicht verständlich auf Deutsch (Rules are practical and easy to understand in German)
4. Beispiele sind relevant und demonstrieren das Konzept klar (Examples are relevant and demonstrate the concept clearly)
5. Das Highlight-Feld enthält den genauen Text aus dem deutschen Satz (The highlight field contains the exact text from the german sentence)
6. Tipps geben praktische Ratschläge auf Deutsch zum Merken oder Verwenden des Konzepts (Tips provide practical advice in German for remembering or using the concept)`;

    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_GRAMMAR_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0]) {
      const textResponse = result.candidates[0].content.parts[0].text;
      const cleanedText = textResponse.replace(/```json|```/g, '').trim();
      const topicData = JSON.parse(cleanedText);

      // Validate the response structure
      if (!topicData.topic || !topicData.explanation || !topicData.rules || !topicData.examples) {
        throw new Error('Invalid response structure from API');
      }

      return {
        topic: topicData.topic,
        explanation: topicData.explanation,
        rules: topicData.rules || [],
        examples: topicData.examples || [],
        tips: topicData.tips || []
      };
    } else {
      throw new Error("Invalid response structure from the API.");
    }
  } catch (error) {
    console.error('Error in getGrammarExplanation:', error);
    // Return a fallback response for common topics
    return getFallbackGrammarData(topic);
  }
}

// Fallback data for common grammar topics
function getFallbackGrammarData(topic: string) {
  const topicLower = topic.toLowerCase();
  
  const fallbackTopics: Record<string, Record<string, unknown>> = {
    'nominativ': {
      topic: "Nominativ (Nominative Case)",
      explanation: "The nominative case is used for the subject of a sentence - the person or thing performing the action. It answers the question 'who?' or 'what?'",
      rules: [
        "The subject of a sentence is always in nominative case",
        "Nominative follows the verb 'sein' (to be): Das ist ein Mann",
        "Definite articles: der (m), die (f), das (n), die (pl)",
        "Indefinite articles: ein (m), eine (f), ein (n)"
      ],
      examples: [
        {
          german: "Der Mann liest ein Buch.",
          english: "The man reads a book.",
          highlight: "Der Mann"
        },
        {
          german: "Die Frau ist Ärztin.",
          english: "The woman is a doctor.",
          highlight: "Die Frau"
        },
        {
          german: "Das Kind spielt im Garten.",
          english: "The child plays in the garden.",
          highlight: "Das Kind"
        },
        {
          german: "Die Bücher sind interessant.",
          english: "The books are interesting.",
          highlight: "Die Bücher"
        }
      ],
      tips: [
        "The nominative case is the 'default' case - it's what you'll find in the dictionary",
        "Always identify the subject first by asking 'who/what is doing the action?'",
        "Remember: after 'sein' (to be), both sides use nominative"
      ]
    },
    'akkusativ': {
      topic: "Akkusativ (Accusative Case)",
      explanation: "The accusative case is used for the direct object of a sentence - the person or thing receiving the action. It answers the question 'whom?' or 'what?'",
      rules: [
        "Direct objects take accusative case",
        "Only masculine articles change: der → den, ein → einen",
        "Feminine, neuter, and plural articles remain the same",
        "Certain prepositions always require accusative: durch, für, gegen, ohne, um"
      ],
      examples: [
        {
          german: "Ich sehe den Mann.",
          english: "I see the man.",
          highlight: "den Mann"
        },
        {
          german: "Sie kauft einen Apfel.",
          english: "She buys an apple.",
          highlight: "einen Apfel"
        },
        {
          german: "Wir besuchen die Stadt.",
          english: "We visit the city.",
          highlight: "die Stadt"
        },
        {
          german: "Er liest das Buch für seinen Vater.",
          english: "He reads the book for his father.",
          highlight: "seinen Vater"
        }
      ],
      tips: [
        "Remember: only masculine articles change in accusative",
        "Ask 'wen oder was?' (whom or what?) to find the direct object",
        "Memorize accusative prepositions with the acronym FUGOD"
      ]
    },
    'dativ': {
      topic: "Dativ (Dative Case)",
      explanation: "The dative case is used for the indirect object - the person or thing that receives the direct object. It answers the question 'to whom?' or 'for whom?'",
      rules: [
        "Masculine and neuter: dem (definite), einem (indefinite)",
        "Feminine: der (definite), einer (indefinite)",
        "Plural: den + -n ending on noun (definite), -n ending (indefinite)",
        "Common dative prepositions: aus, bei, mit, nach, seit, von, zu"
      ],
      examples: [
        {
          german: "Ich gebe dem Mann das Buch.",
          english: "I give the book to the man.",
          highlight: "dem Mann"
        },
        {
          german: "Sie hilft ihrer Mutter.",
          english: "She helps her mother.",
          highlight: "ihrer Mutter"
        },
        {
          german: "Wir spielen mit den Kindern.",
          english: "We play with the children.",
          highlight: "den Kindern"
        },
        {
          german: "Er wohnt bei einem Freund.",
          english: "He lives with a friend.",
          highlight: "einem Freund"
        }
      ],
      tips: [
        "Ask 'wem?' (to whom?) to identify the dative object",
        "Remember: plural nouns often add -n in dative",
        "Some verbs always require dative: helfen, danken, folgen, glauben"
      ]
    }
  };

  // Check if we have fallback data for this topic
  for (const key in fallbackTopics) {
    if (topicLower.includes(key)) {
      return fallbackTopics[key];
    }
  }

  // Generic fallback
  return {
    topic: topic,
    explanation: `${topic} is an important German grammar concept. This is a fallback response - please ensure your API key is configured correctly.`,
    rules: [
      "Study the basic patterns of this grammar concept",
      "Practice with example sentences",
      "Pay attention to exceptions and special cases",
      "Use this grammar point in context"
    ],
    examples: [
      {
        german: "Beispielsatz auf Deutsch.",
        english: "Example sentence in English.",
        highlight: "Beispiel"
      }
    ],
    tips: [
      "Practice regularly with native speakers or language exchange partners",
      "Create your own examples to reinforce learning",
      "Use flashcards to memorize key patterns"
    ]
  };
}
