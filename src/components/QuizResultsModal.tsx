// src/components/QuizResultsModal.tsx
// Modal component that displays quiz results, points earned, and discount information

import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Image 
} from 'react-native';
import { Colors, Spacing, Typography } from '../theme';
import { calculateDiscount, calculatePoints } from '../lib/quiz';

interface QuizResultsModalProps {
  visible: boolean;
  locationName: string;
  correctAnswers: number;
  totalQuestions: number;
  onClose: () => void;
  onContinue: () => void;
}

const QuizResultsModal: React.FC<QuizResultsModalProps> = ({
  visible,
  locationName,
  correctAnswers,
  totalQuestions,
  onClose,
  onContinue
}) => {
  // Calculate score percentage
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
  
  // Calculate points earned
  const pointsEarned = calculatePoints(correctAnswers);
  
  // Calculate discount percentage
  const discountPercentage = calculateDiscount(correctAnswers, totalQuestions);
  
  // Determine message based on score
  let message = '';
  let emoji = '';
  
  if (scorePercentage >= 80) {
    message = "Excellent! You're a true expert!";
    emoji = '🏆';
  } else if (scorePercentage >= 60) {
    message = "Great job! You know your stuff!";
    emoji = '👏';
  } else if (scorePercentage >= 40) {
    message = "Good effort! You've learned something new!";
    emoji = '👍';
  } else {
    message = "Thanks for trying! Now you know more about this place!";
    emoji = '😊';
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
            <Text style={styles.title}>{locationName} Quiz Results</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Results */}
          <View style={styles.resultsContainer}>
            <Text style={styles.emojiText}>{emoji}</Text>
            <Text style={styles.scoreText}>
              {correctAnswers} out of {totalQuestions} correct
            </Text>
            <View style={styles.scoreBarContainer}>
              <View style={styles.scoreBarBackground}>
                <View 
                  style={[
                    styles.scoreBarFill, 
                    { width: `${scorePercentage}%` },
                    scorePercentage >= 60 ? styles.goodScore : styles.averageScore
                  ]} 
                />
              </View>
              <Text style={styles.scorePercentage}>{scorePercentage}%</Text>
            </View>
            <Text style={styles.messageText}>{message}</Text>
          </View>
          
          {/* Rewards */}
          <View style={styles.rewardsContainer}>
            <View style={styles.rewardItem}>
              <View style={styles.rewardIcon}>
                <Text style={styles.rewardIconText}>🎮</Text>
              </View>
              <View style={styles.rewardDetails}>
                <Text style={styles.rewardLabel}>Points Earned</Text>
                <Text style={styles.rewardValue}>{pointsEarned} points</Text>
              </View>
            </View>
            
            <View style={styles.rewardItem}>
              <View style={styles.rewardIcon}>
                <Text style={styles.rewardIconText}>🏷️</Text>
              </View>
              <View style={styles.rewardDetails}>
                <Text style={styles.rewardLabel}>Discount Earned</Text>
                <Text style={styles.rewardValue}>{discountPercentage}% off next visit</Text>
              </View>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={onContinue}
            >
              <Text style={styles.buttonText}>Continue Exploring</Text>
            </TouchableOpacity>
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
  resultsContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emojiText: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  scoreText: {
    fontFamily: Typography.fontFamilySemi,
    fontSize: 22,
    color: Colors.heritageBrown,
    marginBottom: Spacing.sm,
  },
  scoreBarContainer: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  scoreBarBackground: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 5,
  },
  scoreBarFill: {
    height: 12,
    borderRadius: 6,
  },
  goodScore: {
    backgroundColor: '#4CAF50',
  },
  averageScore: {
    backgroundColor: Colors.gold,
  },
  scorePercentage: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 16,
    color: Colors.mutedText,
    textAlign: 'right',
  },
  messageText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: Colors.mutedText,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  rewardsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  rewardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rewardIconText: {
    fontSize: 20,
  },
  rewardDetails: {
    flex: 1,
  },
  rewardLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    color: Colors.mutedText,
  },
  rewardValue: {
    fontFamily: Typography.fontFamilySemi,
    fontSize: 18,
    color: Colors.heritageBrown,
  },
  actionContainer: {
    marginTop: Spacing.sm,
  },
  continueButton: {
    backgroundColor: Colors.royalBlue,
    paddingVertical: Spacing.sm,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: Typography.fontFamilySemi,
    fontSize: 16,
  },
});

export default QuizResultsModal;
