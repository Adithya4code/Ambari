// src/lib/geminiApi.ts
// API wrapper for Google's Gemini API to generate quiz questions

import { getLocationById } from './locations';
import { QuizQuestion, generateFallbackQuiz, parseQuizQuestionsFromApi } from './quiz';

// For security, this should be stored in a .env file or secure storage
// and not hard-coded in the source code
const API_KEY = 'AIzaSyCAs5VzwBM5xEjeZdPvZzPFvcR6HC_VqoQ'; // Add your Gemini API key here

// Gemini Pro model endpoint
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Generate quiz questions for a specific location using Google's Gemini API
 * @param locationId The ID of the location to generate questions for
 * @param numQuestions Number of quiz questions to generate (default: 5)
 * @returns Array of QuizQuestion objects
 */
export async function generateQuizQuestions(
  locationId: string,
  numQuestions: number = 5
): Promise<QuizQuestion[]> {
  try {
    // Get location details
    const location = getLocationById(locationId);
    if (!location || !location.facts) {
      console.error(`Location not found or has no facts: ${locationId}`);
      return generateFallbackQuiz(locationId);
    }

    // Check if API key is available
    if (!API_KEY) {
      console.warn('No Gemini API key provided, using fallback questions');
      return generateFallbackQuiz(locationId);
    }

    // Create prompt for Gemini API
    const prompt = createQuizGenerationPrompt(location.name, location.facts, numQuestions);

    // Call Gemini API
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    // Parse response
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return generateFallbackQuiz(locationId);
    }

    // Extract the text response from Gemini
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      console.error('Invalid response format from Gemini API');
      return generateFallbackQuiz(locationId);
    }

    // Parse the response into QuizQuestion objects
    const questions = parseQuizQuestionsFromApi(generatedText);
    
    // If parsing failed or returned too few questions, fall back to default
    if (questions.length < 3) {
      console.warn('Failed to parse enough questions from API response, using fallback');
      return generateFallbackQuiz(locationId);
    }

    // Return the requested number of questions (or all if fewer were generated)
    return questions.slice(0, numQuestions);
    
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return generateFallbackQuiz(locationId);
  }
}

/**
 * Create a prompt for the Gemini API to generate quiz questions
 */
function createQuizGenerationPrompt(
  locationName: string,
  facts: any,
  numQuestions: number
): string {
  // Format the facts as a bulleted list
  const factsList = Object.entries(facts)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  return `
Generate ${numQuestions} multiple-choice quiz questions about ${locationName} based on these facts:

${factsList}

Each question should have:
1. A clear question about the location
2. Exactly 4 options (labeled A, B, C, D)
3. One correct answer

Format each question like this:
1. [Question text]
Options:
A) [Option 1]
B) [Option 2]
C) [Option 3]
D) [Option 4]
Correct Answer: [A, B, C, or D]

Make sure the questions test understanding of the provided facts, varying in difficulty. The correct answer should always be based on the facts provided.
`;
}
