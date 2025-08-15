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

    console.log('Generating test for topic:', topic);
    
    const testData = await generateGrammarTest(topic.trim());
    
    return NextResponse.json(testData, { status: 200 });
  } catch (error) {
    console.error('Error generating grammar test:', error);
    return NextResponse.json(
      { error: 'Failed to generate grammar test' },
      { status: 500 }
    );
  }
}

async function generateGrammarTest(topic: string) {
  const GEMINI_GRAMMAR_API_KEY = process.env.GEMINI_GRAMMAR_API_KEY;
  
  if (!GEMINI_GRAMMAR_API_KEY) {
    throw new Error('Grammar API key not configured');
  }

  try {
    const prompt = `Create a comprehensive test for the German grammar topic: "${topic}"

Generate a test with 8-10 questions of varying difficulty and types.

Please format your response as a JSON object with the following structure:
{
  "questions": [
    {
      "id": "1",
      "type": "mcq",
      "question": "Clear question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "the correct option",
      "explanation": "Brief explanation why this is correct",
      "points": 1
    },
    {
      "id": "2",
      "type": "fillup",
      "question": "Sentence with ___ blank to fill",
      "germanContext": "The full German sentence with ___ blank",
      "correctAnswer": "the word that fills the blank",
      "explanation": "Brief explanation",
      "points": 1
    },
    {
      "id": "3",
      "type": "input",
      "question": "Question requiring a written answer (e.g., translation or sentence formation)",
      "correctAnswers": ["possible answer 1", "possible answer 2"],
      "explanation": "Brief explanation",
      "points": 2
    }
  ],
  "totalPoints": 12,
  "passingScore": 8,
  "timeLimit": 15
}

Requirements:
1. Include 3-4 MCQ questions (1 point each)
2. Include 2-3 fill-in-the-blank questions (1 point each)
3. Include 2-3 input questions requiring translation or sentence formation (2 points each)
4. Questions should progressively increase in difficulty
5. Test practical application of the grammar concept
6. Explanations should be educational and helpful
7. For input questions, provide multiple correct answer variations
8. Total points should be 10-15, with passing score at 70-75%`;

    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 3072,
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
      const testData = JSON.parse(cleanedText);

      // Validate the response structure
      if (!testData.questions || !Array.isArray(testData.questions)) {
        throw new Error('Invalid test structure from API');
      }

      // Ensure all questions have required fields
      testData.questions = testData.questions.map((q: any, index: number) => ({
        id: q.id || String(index + 1),
        type: q.type || 'mcq',
        question: q.question || '',
        germanContext: q.germanContext,
        options: q.options,
        correctAnswer: q.correctAnswer,
        correctAnswers: q.correctAnswers,
        explanation: q.explanation || '',
        points: q.points || 1
      }));

      return {
        questions: testData.questions,
        totalPoints: testData.totalPoints || testData.questions.reduce((sum: number, q: any) => sum + q.points, 0),
        passingScore: testData.passingScore || Math.ceil(testData.totalPoints * 0.7),
        timeLimit: testData.timeLimit || 15
      };
    } else {
      throw new Error("Invalid response structure from the API.");
    }
  } catch (error) {
    console.error('Error in generateGrammarTest:', error);
    // Return fallback test data
    return getFallbackTestData(topic);
  }
}

// Fallback test data for common topics
function getFallbackTestData(topic: string) {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('genitiv')) {
    return {
      questions: [
        {
          id: "1",
          type: "mcq",
          question: "Which is the correct genitive form? Das ist das Auto ___ Vaters.",
          options: ["der", "des", "dem", "den"],
          correctAnswer: "des",
          explanation: "Masculine nouns use 'des' in genitive case",
          points: 1
        },
        {
          id: "2",
          type: "mcq",
          question: "Which preposition does NOT require genitive case?",
          options: ["wegen", "trotz", "mit", "während"],
          correctAnswer: "mit",
          explanation: "'mit' requires dative case, not genitive",
          points: 1
        },
        {
          id: "3",
          type: "fillup",
          question: "Complete: Die Farbe ___ Himmels ist blau.",
          germanContext: "Die Farbe ___ Himmels ist blau.",
          correctAnswer: "des",
          explanation: "Neuter noun 'Himmel' requires 'des' in genitive",
          points: 1
        },
        {
          id: "4",
          type: "fillup",
          question: "Complete: Das Haus ___ Familie ist groß.",
          germanContext: "Das Haus ___ Familie ist groß.",
          correctAnswer: "der",
          explanation: "Feminine noun 'Familie' uses 'der' in genitive",
          points: 1
        },
        {
          id: "5",
          type: "input",
          question: "Translate to German: 'The woman's car' (Use: Auto, Frau)",
          correctAnswers: ["Das Auto der Frau", "der Frau Auto"],
          explanation: "Feminine nouns use 'der' in genitive",
          points: 2
        },
        {
          id: "6",
          type: "input",
          question: "Form the genitive: 'the children's books' (Use: Bücher, Kinder)",
          correctAnswers: ["die Bücher der Kinder", "der Kinder Bücher"],
          explanation: "Plural nouns use 'der' in genitive",
          points: 2
        }
      ],
      totalPoints: 8,
      passingScore: 6,
      timeLimit: 10
    };
  }

  // Generic fallback test
  return {
    questions: [
      {
        id: "1",
        type: "mcq",
        question: `Which option best demonstrates the ${topic} concept?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "This is a fallback question. Please configure your API key.",
        points: 1
      },
      {
        id: "2",
        type: "fillup",
        question: "Complete the sentence: Der Mann ___ das Buch.",
        germanContext: "Der Mann ___ das Buch.",
        correctAnswer: "liest",
        explanation: "Basic verb conjugation",
        points: 1
      },
      {
        id: "3",
        type: "input",
        question: "Translate: 'The house is big' (Use: Haus, groß)",
        correctAnswers: ["Das Haus ist groß", "Das Haus ist gross"],
        explanation: "Basic sentence structure",
        points: 2
      }
    ],
    totalPoints: 4,
    passingScore: 3,
    timeLimit: 10
  };
}
