// src/lib/quiz.ts
// Quiz types, utilities, and generation logic for the tourism app

/**
 * Represents a single quiz question with multiple-choice options
 */
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

/**
 * Result of a completed quiz
 */
export interface QuizResult {
  locationId: string;
  totalQuestions: number;
  correctAnswers: number;
  pointsEarned: number;
  discountPercentage: number;
  timestamp: number;
}

/**
 * Points awarded per correct answer
 */
export const POINTS_PER_CORRECT_ANSWER = 10;

/**
 * Calculate discount percentage based on quiz performance
 * @param correctAnswers Number of correctly answered questions
 * @param totalQuestions Total number of questions in the quiz
 * @returns Discount percentage (0-25%)
 */
export function calculateDiscount(correctAnswers: number, totalQuestions: number): number {
  // Calculate percentage of correct answers
  const correctPercentage = (correctAnswers / totalQuestions) * 100;
  
  // Determine discount based on performance
  if (correctPercentage >= 90) {
    return 25; // 90%+ correct = 25% discount
  } else if (correctPercentage >= 70) {
    return 15; // 70-89% correct = 15% discount
  } else if (correctPercentage >= 50) {
    return 10; // 50-69% correct = 10% discount
  } else {
    return 5; // Less than 50% = 5% discount (participation reward)
  }
}

/**
 * Calculate points earned from quiz performance
 * @param correctAnswers Number of correctly answered questions
 * @returns Total points earned
 */
export function calculatePoints(correctAnswers: number): number {
  return correctAnswers * POINTS_PER_CORRECT_ANSWER;
}

/**
 * Helper function to parse quiz questions from Gemini API response
 * @param apiResponse Raw response from Gemini API
 * @returns Array of parsed quiz questions
 */
export function parseQuizQuestionsFromApi(apiResponse: string): QuizQuestion[] {
  try {
    // Try to parse as JSON first
    try {
      const parsedResponse = JSON.parse(apiResponse);
      if (Array.isArray(parsedResponse) && 
          parsedResponse.length > 0 && 
          'question' in parsedResponse[0] && 
          'options' in parsedResponse[0] && 
          'correctAnswerIndex' in parsedResponse[0]) {
        return parsedResponse;
      }
    } catch (e) {
      // Not valid JSON, continue with text parsing
    }

    // Fallback to parsing structured text response
    const questions: QuizQuestion[] = [];
    
    // Split by numbered questions (1., 2., etc.)
    const questionBlocks = apiResponse.split(/\d+\.\s+/).filter(block => block.trim().length > 0);
    
    for (const block of questionBlocks) {
      try {
        // Extract question
        const questionMatch = block.match(/(.+?)[\n\r]+Options:/i);
        if (!questionMatch || !questionMatch[1]) continue;
        const question = questionMatch[1].trim();
        
        // Extract options using regex
        const optionsMatch = block.match(/Options:[\n\r]+((?:(?:[a-d][).]\s*.+?[\n\r]+){4}))/i);
        if (!optionsMatch || !optionsMatch[1]) continue;
        
        const optionsText = optionsMatch[1];
        const options = optionsText.split(/[a-d][).]\s*/)
          .filter(opt => opt.trim().length > 0)
          .map(opt => opt.trim());
        
        if (options.length !== 4) continue;
        
        // Extract correct answer
        const correctAnswerMatch = block.match(/(?:Answer:|Correct Answer:|Correct:)\s*([a-d])/i);
        if (!correctAnswerMatch || !correctAnswerMatch[1]) continue;
        
        const correctLetter = correctAnswerMatch[1].toLowerCase();
        const correctAnswerIndex = correctLetter.charCodeAt(0) - 'a'.charCodeAt(0);
        
        if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) continue;
        
        questions.push({
          question,
          options,
          correctAnswerIndex
        });
      } catch (e) {
        console.error('Failed to parse question block:', e);
      }
    }
    
    return questions;
  } catch (error) {
    console.error('Error parsing quiz questions:', error);
    return [];
  }
}

/**
 * Generate fallback quiz questions for a location
 * (Used when API is unavailable)
 */
export function generateFallbackQuiz(locationId: string): QuizQuestion[] {
  // Return different questions based on the locationId
  if (locationId === 'mysore_palace') {
    return [
      {
        question: "What is the main architectural style of Mysore Palace?",
        options: [
          "Indo-Saracenic",
          "Gothic",
          "Dravidian",
          "Persian"
        ],
        correctAnswerIndex: 0
      },
      {
        question: "During which festival is Mysore Palace illuminated with nearly 100,000 lights?",
        options: [
          "Holi",
          "Diwali",
          "Dasara",
          "Pongal"
        ],
        correctAnswerIndex: 2
      },
      {
        question: "Who designed the current Mysore Palace built between 1897-1912?",
        options: [
          "Edwin Lutyens",
          "Henry Irwin",
          "Frederick Stevens",
          "Robert Chisholm"
        ],
        correctAnswerIndex: 1
      },
      {
        question: "What happened to the old wooden palace before the current one was built?",
        options: [
          "It was sold to another royal family",
          "It was destroyed in an earthquake",
          "It was converted to a museum",
          "It was destroyed in a fire"
        ],
        correctAnswerIndex: 3
      },
      {
        question: "Which dynasty ruled Mysore for nearly 600 years and were patrons of the palace?",
        options: [
          "Hoysala Dynasty",
          "Wadiyar Dynasty",
          "Chola Dynasty",
          "Vijayanagara Dynasty"
        ],
        correctAnswerIndex: 1
      }
    ];
  } 
  else if (locationId === 'jaganmohan_palace') {
    return [
      {
        question: "What does the name 'Jaganmohan' mean?",
        options: [
          "God's Blessing",
          "Pleasing to the World",
          "Royal Abode",
          "Palace of Light"
        ],
        correctAnswerIndex: 1
      },
      {
        question: "Who built the Jaganmohan Palace?",
        options: [
          "Krishnaraja Wadiyar III",
          "Krishnaraja Wadiyar IV",
          "Chamaraja Wadiyar IX",
          "Tipu Sultan"
        ],
        correctAnswerIndex: 0
      },
      {
        question: "Why was the Jaganmohan Palace built?",
        options: [
          "As a summer retreat",
          "As an alternate residence during Mysore Palace reconstruction",
          "As a wedding gift",
          "As a military headquarters"
        ],
        correctAnswerIndex: 1
      },
      {
        question: "What famous artist's works are displayed in the Jaganmohan Palace art gallery?",
        options: [
          "Raja Ravi Varma",
          "M.F. Husain",
          "S.H. Raza",
          "Amrita Sher-Gil"
        ],
        correctAnswerIndex: 0
      },
      {
        question: "What significant event in Karnataka's political history took place at Jaganmohan Palace?",
        options: [
          "Declaration of Independence from British rule",
          "First Karnataka Representative Assembly session",
          "Signing of the Mysore Treaty",
          "Coronation of the last Mysore King"
        ],
        correctAnswerIndex: 1
      }
    ];
  }
  else if (locationId === 'chamundeshwari_temple') {
    return [
      {
        question: "After whom is the Chamundeshwari Temple named?",
        options: [
          "A local saint",
          "A fierce form of Goddess Durga",
          "A Mysore queen",
          "A mountain deity"
        ],
        correctAnswerIndex: 1
      },
      {
        question: "How many steps lead to the Chamundeshwari Temple summit?",
        options: [
          "108",
          "555",
          "1,008",
          "2,001"
        ],
        correctAnswerIndex: 2
      },
      {
        question: "When was the main temple structure of Chamundeshwari Temple built?",
        options: [
          "5th century",
          "12th century",
          "17th century",
          "20th century"
        ],
        correctAnswerIndex: 2
      },
      {
        question: "What demon is associated with the origin of Mysuru's name?",
        options: [
          "Raktabija",
          "Mahishasura",
          "Shumbha",
          "Hiranyakashipu"
        ],
        correctAnswerIndex: 1
      },
      {
        question: "What famous statue is located on the way to Chamundi Hill?",
        options: [
          "Lord Ganesha",
          "Nandi (Bull)",
          "Lord Hanuman",
          "Lord Vishnu"
        ],
        correctAnswerIndex: 1
      }
    ];
  }
  else {
    // Generic questions about Mysore for any other location
    return [
      {
        question: "What was Mysore previously known as?",
        options: [
          "Mahishapura",
          "Vijayanagara",
          "Srirangapatna",
          "Maisuru"
        ],
        correctAnswerIndex: 0
      },
      {
        question: "Which dynasty ruled Mysore for the longest period?",
        options: [
          "Hoysala Dynasty",
          "Wadiyar Dynasty",
          "Vijayanagara Empire",
          "Cholas"
        ],
        correctAnswerIndex: 1
      },
      {
        question: "What is Mysore famous for?",
        options: [
          "Silk and sandalwood",
          "Coffee plantations",
          "Spice markets",
          "Diamond mines"
        ],
        correctAnswerIndex: 0
      },
      {
        question: "Which festival is celebrated with great pomp in Mysore?",
        options: [
          "Pongal",
          "Onam",
          "Dasara",
          "Diwali"
        ],
        correctAnswerIndex: 2
      },
      {
        question: "What is the popular sweet dish from Mysore?",
        options: [
          "Rasogolla",
          "Mysore Pak",
          "Jalebi",
          "Laddu"
        ],
        correctAnswerIndex: 1
      }
    ];
  }
}
