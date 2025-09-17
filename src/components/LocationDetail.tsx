// src/components/LocationDetail.tsx
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { Typography, Colors } from '../theme';
import { Location } from '../lib/locations';

type Props = {
  location: Location;
  autoPlay?: boolean;
};

const LocationDetail: React.FC<Props> = ({ location, autoPlay = false }) => {
  const videoRef = useRef<Video | null>(null);
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      {/* Image header */}
      <Image source={location.image} style={styles.image} resizeMode="cover" />

      {/* text meta */}
      <View style={styles.meta}>
        <Text style={styles.title}>{location.name}</Text>
        <Text style={styles.description}>{location.description}</Text>
      </View>

      {/* Video player (short 15-30s) */}
      <View style={styles.videoWrap}>
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
        )}
        <Video
          ref={videoRef}
          source={location.video}
          useNativeControls
          //resizeMode="cover"
          style={styles.video}
          onReadyForDisplay={() => setLoading(false)}
          shouldPlay={autoPlay}
        />
      </View>

      <Pressable style={styles.cta} onPress={() => videoRef.current?.presentFullscreenPlayer()}>
        <Text style={styles.ctaText}>Watch fullscreen</Text>
      </Pressable>
    </View>
  );
};

export default LocationDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  image: {
    width: '100%',
    height: 160, // hero preview image height for location
  },
  meta: {
    padding: 12,
  },
  title: {
    fontFamily: Typography.fontFamilySemi,
    fontSize: 18,
    color: Colors.heritageBrown,
    marginBottom: 6,
  },
  description: {
    fontFamily: Typography.fontFamily,
    color: Colors.mutedText,
    fontSize: 14,
  },
  videoWrap: {
    height: 200,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loading: {
    position: 'absolute',
    zIndex: 10,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  ctaText: {
    color: Colors.terracotta,
    fontFamily: Typography.fontFamilySemi,
    fontWeight: '700',
  },
});
