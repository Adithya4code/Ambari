// src/screens/HomeScreen.tsx
import React, { useMemo, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Colors, Typography, Spacing } from '../theme';
import { WebView } from 'react-native-webview';
import { DEFAULT_CENTER, DEFAULT_ZOOM, PLACES } from '../lib/places';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
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
          navigation.navigate('Scan', { locationId: data.id });
        }
      } catch {}
    }, [navigation]);

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
});
