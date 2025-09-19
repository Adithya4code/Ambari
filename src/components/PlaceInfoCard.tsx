// src/components/PlaceInfoCard.tsx
// Card component that displays place information and a start quiz button

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Location } from '../lib/locations';
import { Colors, Spacing, Typography } from '../theme';

interface PlaceInfoCardProps {
  location: Location;
  onClose: () => void;
  onStartQuiz: () => void;
  onScan: () => void; // new prop for QR scan action
}

const PlaceInfoCard: React.FC<PlaceInfoCardProps> = ({ 
  location, 
  onClose,
  onStartQuiz,
  onScan
}) => {
  const hasFacts = !!location.facts;
  const { facts } = location;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{location.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.factsContainer}>
        {hasFacts ? (
          <>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>Main Feature</Text>
              <Text style={styles.factText}>{facts?.mainFeature}</Text>
            </View>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>Origin of Name</Text>
              <Text style={styles.factText}>{facts?.originOfName}</Text>
            </View>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>History</Text>
              <Text style={styles.factText}>{facts?.history}</Text>
            </View>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>Specialty</Text>
              <Text style={styles.factText}>{facts?.specialty}</Text>
            </View>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>Famous For</Text>
              <Text style={styles.factText}>{facts?.famousFact}</Text>
            </View>
            <View style={styles.factRow}>
              <Text style={styles.factLabel}>Cultural Significance</Text>
              <Text style={styles.factText}>{facts?.culturalSignificance}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.noFactsText}>
            Information about this place is not available right now. You can still scan the QR code on-site.
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {hasFacts && (
          <Text style={styles.quizPrompt}>
            Test your knowledge about {location.name} with a quiz!
          </Text>
        )}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={onStartQuiz}
            disabled={!hasFacts}
            style={[styles.startQuizButton, !hasFacts && styles.disabledBtn]}
          >
            <Text style={styles.buttonText}>{hasFacts ? 'Start Quiz' : 'Quiz Unavailable'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onScan} style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan QR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: Spacing.md,
    maxHeight: '70%',
    width: '90%',
    alignSelf: 'center',
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
  factsContainer: {
    marginBottom: Spacing.md,
    maxHeight: 350,
  },
  factRow: {
    marginBottom: Spacing.md,
  },
  factLabel: {
    fontFamily: Typography.fontFamilySemi,
    color: Colors.terracotta,
    marginBottom: 4,
  },
  factText: {
    fontFamily: Typography.fontFamily,
    color: Colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: Spacing.md,
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  startQuizButton: {
    backgroundColor: Colors.royalBlue,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 30,
    alignItems: 'center',
    minWidth: 140,
  },
  scanButton: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 30,
    alignItems: 'center',
    minWidth: 140,
  },
  disabledBtn: {
    backgroundColor: '#9aa4b1',
  },
  quizPrompt: {
    fontFamily: Typography.fontFamilySemi,
    fontSize: 14,
    color: Colors.mutedText,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: Typography.fontFamilySemi,
    fontSize: 16,
  },
  noFactsText: {
    fontFamily: Typography.fontFamily,
    color: Colors.mutedText,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
  closeCardButton: {
    backgroundColor: Colors.terracotta,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
  },
});

export default PlaceInfoCard;
