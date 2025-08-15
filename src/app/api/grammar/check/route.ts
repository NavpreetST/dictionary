import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      question, 
      userAnswer, 
      context 
    }: { 
      question: string; 
      userAnswer: string; 
      context?: string;
    } = await request.json();
    
    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: 'Question and user answer are required' },
        { status: 400 }
      );
    }

    console.log('Checking answer for question:', question);
    
    const result = await checkAnswer(question, userAnswer, context);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error checking answer:', error);
    return NextResponse.json(
      { error: 'Failed to check answer' },
      { status: 500 }
    );
  }
}

async function checkAnswer(question: string, userAnswer: string, context?: string) {
  const GEMINI_GRAMMAR_API_KEY = process.env.GEMINI_GRAMMAR_API_KEY;
  
  if (!GEMINI_GRAMMAR_API_KEY) {
    // Fallback to basic checking
    return basicAnswerCheck(userAnswer);
  }

  try {
    const prompt = `You are a German language teacher evaluating a student's answer.

Question: ${question}
${context ? `Context: ${context}` : ''}
Student's Answer: ${userAnswer}

Please evaluate if the answer is correct, partially correct, or incorrect.
Consider:
1. Grammar accuracy
2. Spelling (allow minor variations like ß/ss)
3. Word order flexibility in German
4. Accept alternative phrasings that convey the same meaning

Respond with a JSON object:
{
  "correct": true/false,
  "score": 0-100 (percentage score),
  "feedback": "Brief constructive feedback",
  "correctedAnswer": "The corrected version if incorrect, or the answer itself if correct",
  "alternativeAnswers": ["other acceptable answers"],
  "grammarNotes": "Specific grammar points to note"
}`;

    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.3,
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
      const textResponse = result.candidates[0].content.parts[0].text;
      const cleanedText = textResponse.replace(/```json|```/g, '').trim();
      const evaluation = JSON.parse(cleanedText);

      return {
        correct: evaluation.correct || false,
        score: evaluation.score || 0,
        feedback: evaluation.feedback || 'Your answer has been evaluated.',
        correctedAnswer: evaluation.correctedAnswer || userAnswer,
        alternativeAnswers: evaluation.alternativeAnswers || [],
        grammarNotes: evaluation.grammarNotes || ''
      };
    } else {
      throw new Error("Invalid response structure from the API.");
    }
  } catch (error) {
    console.error('Error in checkAnswer:', error);
    // Fallback to basic checking
    return basicAnswerCheck(userAnswer);
  }
}

// Basic answer checking for fallback
function basicAnswerCheck(userAnswer: string) {
  // This is a simple fallback - in production, you'd want more sophisticated checking
  const answer = userAnswer.trim().toLowerCase();
  
  // Basic German grammar patterns
  const hasGermanArticles = /\b(der|die|das|den|dem|des|ein|eine|einen|einem|eines)\b/i.test(userAnswer);
  const hasGermanWords = /\b(ist|sind|haben|sein|werden|können|müssen|wollen|sollen)\b/i.test(userAnswer);
  const hasCapitalizedNouns = /\b[A-ZÄÖÜ][a-zäöüß]+\b/.test(userAnswer);
  
  // Very basic scoring
  let score = 0;
  let feedback = '';
  
  if (answer.length < 3) {
    return {
      correct: false,
      score: 0,
      feedback: 'Your answer seems too short. Please provide a complete response.',
      correctedAnswer: userAnswer,
      alternativeAnswers: [],
      grammarNotes: 'Make sure to write complete sentences or phrases.'
    };
  }
  
  if (hasGermanArticles) score += 30;
  if (hasGermanWords) score += 30;
  if (hasCapitalizedNouns) score += 20;
  if (answer.length > 10) score += 20;
  
  if (score >= 70) {
    feedback = 'Your answer appears to be grammatically structured.';
  } else if (score >= 40) {
    feedback = 'Your answer needs some improvement. Check your grammar and word order.';
  } else {
    feedback = 'Please review German grammar rules and try again.';
  }
  
  return {
    correct: score >= 70,
    score: Math.min(score, 100),
    feedback,
    correctedAnswer: userAnswer,
    alternativeAnswers: [],
    grammarNotes: 'This is a basic evaluation. For detailed feedback, ensure the API key is configured.'
  };
}
