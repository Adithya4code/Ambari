// src/screens/HomeScreen.tsx
import React, { useMemo, useCallback, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing } from '../theme';
import { WebView } from 'react-native-webview';
import { DEFAULT_CENTER, DEFAULT_ZOOM, PLACES } from '../lib/places';
import { getLocationById, Location } from '../lib/locations';
import { generateQuizQuestions } from '../lib/geminiApi';
import { QuizQuestion, QuizResult } from '../lib/quiz';
import { saveQuizResult } from '../lib/scoreManager';
import { calculateDiscount, calculatePoints } from '../lib/quiz';
import PlaceInfoCard from '../components/PlaceInfoCard';
import QuizModal from '../components/QuizModal';
import QuizResultsModal from '../components/QuizResultsModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  // State for quiz flow
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showPlaceInfoCard, setShowPlaceInfoCard] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizResults, setQuizResults] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  const html = useMemo(() => {
    const markersJs = PLACES.map(
      (p) => `
        (function(){
          const m = L.marker([${p.lat}, ${p.lng}]).addTo(map).bindPopup(${JSON.stringify(p.name)});
          m.on('click', function(){
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'marker', id: ${JSON.stringify(p.id)} }));
            }
          });
        })();
      `
    ).join('\n');
      const latLngs = PLACES.map((p) => `[${p.lat}, ${p.lng}]`).join(',');

    // Inline Leaflet CSS/JS via unpkg CDN suitable for WebView usage
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
      .leaflet-container { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script>
      const map = L.map('map').setView([${DEFAULT_CENTER.lat}, ${DEFAULT_CENTER.lng}], ${DEFAULT_ZOOM});
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
        ${markersJs}
        const bounds = L.latLngBounds([${latLngs}]);
        map.fitBounds(bounds, { padding: [20, 20] });
    </script>
  </body>
 </html>`;
  }, []);

  const onMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event?.nativeEvent?.data ?? '{}');
      if (data?.type === 'marker' && typeof data?.id === 'string') {
        // Instead of navigating to scan, show place info card
        const location = getLocationById(data.id);
        if (location) {
          setSelectedLocationId(data.id);
          setSelectedLocation(location);
          
          // Only show place info card if the location has facts or if it's the Mysore Palace
          if (location.facts || location.id === 'mysore_palace') {
            setShowPlaceInfoCard(true);
          } else {
            // For locations without facts data, fall back to the scan screen
            navigation.navigate('Scan', { locationId: data.id });
          }
        }
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  }, [navigation]);

  // Start quiz flow
  const handleStartQuiz = useCallback(async () => {
    if (!selectedLocationId || !selectedLocation) return;
    
    setShowPlaceInfoCard(false);
    setIsLoadingQuiz(true);
    setShowQuizModal(true);
    setQuizError(null);
    
    try {
      // Generate quiz questions
      const questions = await generateQuizQuestions(selectedLocationId);
      setQuizQuestions(questions);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setQuizError('Failed to generate quiz questions. Please try again.');
    } finally {
      setIsLoadingQuiz(false);
    }
  }, [selectedLocationId, selectedLocation]);

  // Handle quiz completion
  const handleQuizComplete = useCallback((correctAnswers: number, totalQuestions: number) => {
    setQuizResults({ correct: correctAnswers, total: totalQuestions });
    setShowQuizModal(false);
    setShowResultsModal(true);
    
    // Calculate points and save quiz result
    const points = calculatePoints(correctAnswers);
    const discount = calculateDiscount(correctAnswers, totalQuestions);
    
    if (selectedLocationId) {
      const result: QuizResult = {
        locationId: selectedLocationId,
        totalQuestions,
        correctAnswers,
        pointsEarned: points,
        discountPercentage: discount,
        timestamp: Date.now()
      };
      
      // Save the result
      saveQuizResult(result);
    }
  }, [selectedLocationId]);

  // Handle continuing after seeing results
  const handleContinue = useCallback(() => {
    setShowResultsModal(false);
    setSelectedLocationId(null);
    setSelectedLocation(null);
    setQuizQuestions([]);
  }, []);

  // Retry quiz generation if there was an error
  const handleRetryQuizGeneration = useCallback(() => {
    if (selectedLocationId) {
      handleStartQuiz();
    }
  }, [selectedLocationId, handleStartQuiz]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerOverlay}>
        <Text style={styles.headerTitle}>Mysuru Map</Text>
        <View style={{ flex: 1 }} />
        <Pressable onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Profile</Text>
        </Pressable>
      </View>
      <WebView originWhitelist={["*"]} source={{ html }} style={{ flex: 1 }} onMessage={onMessage} />

      {/* Place Info Card Modal */}
      <Modal
        visible={showPlaceInfoCard}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          {selectedLocation && (
            <PlaceInfoCard
              location={selectedLocation}
              onClose={() => setShowPlaceInfoCard(false)}
              onStartQuiz={handleStartQuiz}
            />
          )}
        </View>
      </Modal>

      {/* Quiz Modal */}
      {selectedLocation && (
        <QuizModal
          visible={showQuizModal}
          locationId={selectedLocationId || ''}
          locationName={selectedLocation.name}
          questions={quizQuestions}
          onClose={() => {
            setShowQuizModal(false);
            setQuizQuestions([]);
          }}
          onComplete={handleQuizComplete}
          isLoading={isLoadingQuiz}
          error={quizError || undefined}
          onRetry={handleRetryQuizGeneration}
        />
      )}

      {/* Quiz Results Modal */}
      {selectedLocation && (
        <QuizResultsModal
          visible={showResultsModal}
          locationName={selectedLocation.name}
          correctAnswers={quizResults.correct}
          totalQuestions={quizResults.total}
          onClose={() => setShowResultsModal(false)}
          onContinue={handleContinue}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmWhite },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.overlayDark,
  },
  headerTitle: { color: '#fff', fontFamily: Typography.fontFamilyBold, fontSize: 18 },
  profileBtn: { backgroundColor: Colors.gold, padding: 8, borderRadius: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
