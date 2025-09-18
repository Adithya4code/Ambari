// src/screens/QuizHomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing } from '../theme';
import { getLocationById } from '../lib/locations';
import { generateQuizQuestions } from '../lib/geminiApi';
import { QuizQuestion } from '../lib/quiz';
import QuizModal from '../components/QuizModal';
import QuizResultsModal from '../components/QuizResultsModal';
import { saveQuizResult } from '../lib/scoreManager';
import { calculateDiscount, calculatePoints } from '../lib/quiz';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

const QuizHomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { locationId } = route.params;
  const [location, setLocation] = useState(getLocationById(locationId));
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!location) {
        setError('Location not found');
        setIsLoading(false);
        return;
      }

      try {
        const questions = await generateQuizQuestions(locationId);
        setQuizQuestions(questions);
        setShowQuiz(true);
      } catch (error) {
        console.error('Error generating quiz:', error);
        setError('Failed to generate quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [locationId, location]);

  const handleQuizComplete = (correctAnswers: number, totalQuestions: number) => {
    setQuizResults({ correct: correctAnswers, total: totalQuestions });
    setShowQuiz(false);
    setShowResults(true);

    // Save quiz result
    if (location) {
      saveQuizResult({
        locationId,
        totalQuestions,
        correctAnswers,
        pointsEarned: calculatePoints(correctAnswers),
        discountPercentage: calculateDiscount(correctAnswers, totalQuestions),
        timestamp: Date.now()
      });
    }
  };

  const handleContinue = () => {
    navigation.navigate('Home');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.royalBlue} />
          <Text style={styles.loadingText}>
            Generating quiz for {location?.name || 'this location'}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {location && (
        <>
          <QuizModal
            visible={showQuiz}
            locationId={locationId}
            locationName={location.name}
            questions={quizQuestions}
            onClose={() => navigation.goBack()}
            onComplete={handleQuizComplete}
          />
          
          <QuizResultsModal
            visible={showResults}
            locationName={location.name}
            correctAnswers={quizResults.correct}
            totalQuestions={quizResults.total}
            onClose={() => navigation.goBack()}
            onContinue={handleContinue}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  loadingText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: Colors.mutedText,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: '#C62828',
    textAlign: 'center',
  },
});

export default QuizHomeScreen;
