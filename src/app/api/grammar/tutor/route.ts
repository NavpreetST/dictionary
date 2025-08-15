import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      message,
      conversationHistory = []
    }: { 
      message: string;
      conversationHistory?: Array<{role: string, content: string}>;
    } = await request.json();
    
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('Processing tutoring request:', message);
    
    const response = await getTutorResponse(message, conversationHistory);
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in tutor API:', error);
    return NextResponse.json(
      { error: 'Failed to process tutoring request' },
      { status: 500 }
    );
  }
}

async function getTutorResponse(message: string, conversationHistory: Array<{role: string, content: string}>) {
  const GEMINI_GRAMMAR_API_KEY = process.env.GEMINI_GRAMMAR_API_KEY;
  
  if (!GEMINI_GRAMMAR_API_KEY) {
    throw new Error('Grammar API key not configured');
  }

  try {
    // Condensed, optimized system prompt for API
    const systemPrompt = `You are a friendly German teacher for a student progressing from A2 to B1 level.

CORE RULES:
1. Always respond in simple German (A2-B1 level)
2. Add English meanings in parentheses for new/important words: word (meaning)
3. Correct ANY student input (even English) by showing correct German version
4. Use emojis and varied sentence structures for engagement

CORRECTION FORMAT:
If student writes incorrectly or in English:
❌ What they wrote
✅ Correct German: [proper version]
💡 Brief explanation in English

TEACHING APPROACH:
- Be encouraging and interactive
- Give examples with everyday situations
- Break complex topics into simple parts
- Provide exercises when explaining grammar

STUDENT'S CURRENT TOPICS (B1):
- Doppelkonjunktionen (sowohl...als auch, weder...noch)
- Relativsätze with prepositions/genitive
- Passiv, Konjunktiv II
- je...desto/umso constructions
- Temporal clauses (nachdem, sobald)
- Nominalized adjectives/participles

When explaining grammar:
1. Simple explanation with examples
2. Show patterns clearly
3. Point out exceptions
4. Give 2-3 practice exercises

Keep responses concise but educational. Focus on practical usage.`;

    // Build conversation with history
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    const payload = {
      contents: messages.filter(m => m.role !== 'system').map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
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
      const tutorResponse = result.candidates[0].content.parts[0].text;
      
      return {
        response: tutorResponse,
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error("Invalid response structure from the API.");
    }
  } catch (error) {
    console.error('Error in getTutorResponse:', error);
    // Fallback response
    return {
      response: "Entschuldigung (Sorry), es gibt ein Problem (there's a problem). Bitte versuche es noch einmal (Please try again)! 😊",
      timestamp: new Date().toISOString()
    };
  }
}

// Alternative condensed prompt for grammar-specific queries
export const GRAMMAR_TUTOR_PROMPT = `You're a German tutor for A2→B1 students.

RULES:
• Respond in simple German with English in parentheses for new words
• Correct all errors: Show ❌Wrong ✅Correct German 💡English explanation
• Use emojis, varied sentences, be encouraging

CORRECTIONS:
Student: "I go yesterday school"
❌ I go yesterday school
✅ Ich bin gestern zur Schule gegangen (I went to school yesterday)
💡 Use Perfekt for past: sein/haben + Partizip II

TEACHING:
• Simple explanations → Examples → Patterns → Exceptions → Exercises
• Focus on practical usage
• Break complex topics into chunks

B1 FOCUS: Passiv, Konjunktiv II, Relativsätze, je...desto, nachdem, nominalization

Keep responses concise and educational.`;
