// src/components/QuizModal.tsx
// Modal component that displays one quiz question at a time with progress tracking

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Modal 
} from 'react-native';
import { Colors, Spacing, Typography } from '../theme';
import { QuizQuestion } from '../lib/quiz';

interface QuizModalProps {
  visible: boolean;
  locationId: string;
  locationName: string;
  questions: QuizQuestion[];
  onClose: () => void;
  onComplete: (correctAnswers: number, totalQuestions: number) => void;
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({
  visible,
  locationId,
  locationName,
  questions,
  onClose,
  onComplete,
  isLoading = false,
  error,
  onRetry
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Reset state when the modal becomes visible
  useEffect(() => {
    if (visible) {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCorrectAnswers(0);
      setShowAnswer(false);
    }
  }, [visible]);

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return; // Prevent changing answer once submitted
    
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswered) return;
    
    setIsAnswered(true);
    setShowAnswer(true);
    
    if (selectedAnswer === currentQuestion?.correctAnswerIndex) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowAnswer(false);
    } else {
      // End of quiz
      onComplete(correctAnswers, questions.length);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.royalBlue} />
            <Text style={styles.loadingText}>
              Generating quiz questions about {locationName}...
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  // Error state
  if (error) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Error</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>{error}</Text>
            {onRetry && (
              <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
                <Text style={styles.buttonText}>Retry</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onClose} style={styles.closeQuizButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // No questions
  if (!questions || questions.length === 0) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>No Questions</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.errorText}>
              No quiz questions are available for this location.
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeQuizButton}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{locationName} Quiz</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </View>
          
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion?.question}</Text>
          </View>
          
          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQuestion?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                  showAnswer && index === currentQuestion?.correctAnswerIndex && styles.correctOption,
                  showAnswer && selectedAnswer === index && selectedAnswer !== currentQuestion?.correctAnswerIndex && styles.incorrectOption
                ]}
                onPress={() => handleSelectAnswer(index)}
                disabled={isAnswered}
              >
                <Text style={[
                  styles.optionText,
                  (showAnswer && index === currentQuestion?.correctAnswerIndex) && styles.correctOptionText,
                  (showAnswer && selectedAnswer === index && selectedAnswer !== currentQuestion?.correctAnswerIndex) && styles.incorrectOptionText
                ]}>
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            {!isAnswered ? (
              <TouchableOpacity
                style={[styles.submitButton, selectedAnswer === null && styles.disabledButton]}
                onPress={handleSubmitAnswer}
                disabled={selectedAnswer === null}
              >
                <Text style={styles.buttonText}>Submit Answer</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextQuestion}
              >
                <Text style={styles.buttonText}>
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: Spacing.md,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 20,
    color: Colors.heritageBrown,
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.terracotta,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: Colors.royalBlue,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    color: Colors.mutedText,
    textAlign: 'right',
  },
  questionContainer: {
    marginBottom: Spacing.lg,
  },
  questionText: {
    fontFamily: Typography.fontFamilySemi,
    fontSize: 18,
    color: Colors.heritageBrown,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: Spacing.lg,
  },
  optionButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  selectedOption: {
    borderColor: Colors.royalBlue,
    backgroundColor: '#E8F0FE',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  incorrectOption: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  optionText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: Colors.mutedText,
  },
  correctOptionText: {
    color: '#2E7D32',
  },
  incorrectOptionText: {
    color: '#C62828',
  },
  actionContainer: {
    marginTop: Spacing.sm,
  },
  submitButton: {
    backgroundColor: Colors.royalBlue,
    paddingVertical: Spacing.sm,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: Colors.terracotta,
    paddingVertical: Spacing.sm,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    color: 'white',
    fontFamily: Typography.fontFamilySemi,
    fontSize: 16,
  },
  loadingContainer: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: Spacing.lg,
    width: '80%',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Typography.fontFamily,
    color: Colors.mutedText,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: Typography.fontFamily,
    color: '#C62828',
    marginVertical: Spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.royalBlue,
    paddingVertical: Spacing.sm,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  closeQuizButton: {
    backgroundColor: Colors.terracotta,
    paddingVertical: Spacing.sm,
    borderRadius: 30,
    alignItems: 'center',
  },
});

export default QuizModal;
