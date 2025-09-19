// src/screens/PassportScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Image, Animated, Dimensions, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing } from '../theme';
import { getCollectedStamps } from '../lib/storage';
import { PLACES } from '../lib/places';
import { getFact } from '../lib/facts';
import { getStamp } from '../lib/stamps';
import { Audio } from 'expo-av';
import ConfettiCannon from 'react-native-confetti-cannon';

type Props = NativeStackScreenProps<RootStackParamList, 'Passport'>;

const { width } = Dimensions.get('window');

const PassportScreen: React.FC<Props> = ({ route }) => {
  const [collected, setCollected] = useState<string[]>([]);
  const [playCelebration, setPlayCelebration] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const flatRef = useRef<FlatList<any> | null>(null);

  // Book opening animation
  const bookScale = useRef(new Animated.Value(0.9)).current;
  const bookOpacity = useRef(new Animated.Value(0)).current;

  // Stamp animation scale per page (only animate when targeted)
  const stampScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const stamps = await getCollectedStamps();
      setCollected(stamps);

      // Opening animation
      Animated.parallel([
        Animated.timing(bookOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(bookScale, { toValue: 1, useNativeDriver: true }),
      ]).start();

      // If we came after scan, go to the stamped page and animate the stamp drop
      const justStamped = (route.params as any)?.justStamped;
      const stampedLocationId = (route.params as any)?.stampedLocationId as string | undefined;
      if (justStamped && stampedLocationId) {
        const idx = PLACES.findIndex((p) => p.id === stampedLocationId);
        if (idx >= 0) {
          // scroll to page
          setTimeout(() => flatRef.current?.scrollToIndex({ index: idx, animated: true }), 50);
          // play animation & sound slightly after scroll
          setTimeout(async () => {
            setPlayCelebration(true);
            Animated.sequence([
              Animated.timing(stampScale, { toValue: 0, duration: 1, useNativeDriver: true }),
              Animated.spring(stampScale, { toValue: 1.15, useNativeDriver: true }),
              Animated.spring(stampScale, { toValue: 1.0, useNativeDriver: true }),
            ]).start();
            try {
              const { sound } = await Audio.Sound.createAsync(require('../../stamp-81635.mp3'));
              setSound(sound);
              await sound.playAsync();
            } catch {}
          }, 300);
        }
      }
    })();

    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  const targetStampedId = (route.params as any)?.stampedLocationId as string | undefined;
  const data = useMemo(() => PLACES.map((p) => ({ ...p, collected: collected.includes(p.id), fact: getFact(p.id), stamp: getStamp(p.id) })), [collected]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Travel Passport</Text>

      <Animated.View style={{ flex: 1, opacity: bookOpacity, transform: [{ scale: bookScale }] }}>
        <FlatList
          ref={flatRef}
          data={data}
          keyExtractor={(i) => i.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
            setPageIndex(i);
          }}
          renderItem={({ item }) => (
            <View style={styles.pageWrap}>
              <View style={styles.pageLeft}>
                {/* Show placeholder circle when locked; show actual transparent PNG stamp when collected */}
                {item.collected && item.stamp ? (
                  <Animated.Image
                    source={item.stamp.image}
                    style={[
                      styles.stampImage,
                      // Only animate the just-stamped page; others render at normal scale
                      { transform: [{ scale: (targetStampedId && item.id === targetStampedId) ? stampScale : 1 }] as any },
                    ]}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.placeholderCircle} />
                )}
                {!!item.stamp?.title && <Text style={styles.stampLabel}>{item.stamp.title}</Text>}
              </View>
              <View style={styles.pageRight}>
                <Text style={styles.place}>{item.name}</Text>
                {!!item.fact && <Text style={styles.fact}>{item.fact}</Text>}
              </View>
            </View>
          )}
        />
        <View style={styles.navRow}>
          <Pressable disabled={pageIndex === 0} onPress={() => flatRef.current?.scrollToIndex({ index: Math.max(0, pageIndex - 1), animated: true })}>
            <Text style={[styles.navBtn, pageIndex === 0 && styles.navDisabled]}>{'‹ Prev'}</Text>
          </Pressable>
          <Pressable disabled={pageIndex >= data.length - 1} onPress={() => flatRef.current?.scrollToIndex({ index: Math.min(data.length - 1, pageIndex + 1), animated: true })}>
            <Text style={[styles.navBtn, pageIndex >= data.length - 1 && styles.navDisabled]}>{'Next ›'}</Text>
          </Pressable>
        </View>
      </Animated.View>

      {playCelebration && (
        <ConfettiCannon count={120} origin={{ x: width / 2, y: -20 }} fadeOut autoStart onAnimationEnd={() => setPlayCelebration(false)} />
      )}
    </SafeAreaView>
  );
};

export default PassportScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7efe3' },
  title: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 22,
    color: Colors.heritageBrown,
    textAlign: 'center',
    marginTop: 12,
  },
  pageWrap: {
    width,
    flexDirection: 'row',
    padding: Spacing.lg,
  },
  pageLeft: {
    width: width * 0.42,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#e8dcc7',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pageRight: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: '#e8dcc7',
    padding: Spacing.md,
    justifyContent: 'center',
  },
  stampCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: Colors.terracotta,
    opacity: 0.95,
  },
  stampOverlay: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
  },
  stampOverlayImg: { width: '100%', height: '100%' },
  // New styles for transparent PNG stamps
  stampImage: {
    width: 160,
    height: 160,
    marginBottom: 8,
    // subtle shadow for stamp
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  placeholderCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#d6c8b0',
    backgroundColor: '#f2eadb',
    marginBottom: 8,
  },
  stampLabel: {
    color: Colors.mutedText,
    fontFamily: Typography.fontFamily,
    fontSize: 12,
  },
  place: { fontFamily: Typography.fontFamilySemi, color: Colors.heritageBrown, fontSize: 18, marginBottom: 8 },
  fact: { color: Colors.mutedText, fontFamily: Typography.fontFamily, fontSize: 14 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, paddingTop: 8 },
  navBtn: { color: Colors.terracotta, fontFamily: Typography.fontFamilySemi, fontSize: 16 },
  navDisabled: { opacity: 0.35 },
});
