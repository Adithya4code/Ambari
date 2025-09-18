// src/screens/HomeScreen.tsx
import React, { useMemo, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Colors, Typography, Spacing } from '../theme';
import { WebView } from 'react-native-webview';
import { DEFAULT_CENTER, DEFAULT_ZOOM, PLACES } from '../lib/places';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const html = useMemo(() => {
    const markersJs = PLACES.map(
      (p) => `
        (function(){
          const m = L.marker([${p.lat}, ${p.lng}], { icon: customPin }).bindPopup(${JSON.stringify(
            '<b>' + p.name + '</b>'
          )});
          m.on('click', function(){
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'marker', id: ${JSON.stringify(
                p.id
              )} }));
            }
          });
          markers.addLayer(m);
        })();
      `
    ).join('\n');
    const latLngs = PLACES.map((p) => `[${p.lat}, ${p.lng}]`).join(',');

    // Inline Leaflet + MarkerCluster + custom styles
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
      .leaflet-container { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
      /* Premium-looking custom pin */
      .custom-pin {
        width: 34px; height: 34px; position: relative; transform: rotate(-45deg);
        background: #ffffff; border-radius: 50% 50% 50% 0;
        border: 3px solid #D4AF37; /* gold */
        box-shadow: 0 6px 14px rgba(0,0,0,0.22);
      }
      .custom-pin .inner {
        position: absolute; width: 14px; height: 14px; background: #2E4F9A; /* royal blue */
        border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(45deg);
      }
      /* Cluster style */
      .marker-cluster-small, .marker-cluster-medium, .marker-cluster-large { background-color: transparent; }
      .marker-cluster div {
        background: linear-gradient(180deg, #F8E7A6, #D4AF37);
        color: #3a2b00; font-weight: 800; border: 2px solid #B08D2E;
        box-shadow: 0 6px 14px rgba(0,0,0,0.22);
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"></script>
    <script>
      const map = L.map('map', { preferCanvas: true, zoomControl: true }).setView([${DEFAULT_CENTER.lat}, ${
      DEFAULT_CENTER.lng
    }], ${DEFAULT_ZOOM});
      // Carto light basemap (clean, readable)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20,
        attribution: '© OpenStreetMap contributors, © CARTO'
      }).addTo(map);

      // Custom pin icon using divIcon
      const customPin = L.divIcon({
        className: '',
        html: '<div class="custom-pin"><div class="inner"></div></div>',
        iconSize: [34, 34],
        iconAnchor: [17, 28],
        popupAnchor: [0, -24]
      });

      // Cluster group with nicer cluster icons
      const markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        iconCreateFunction: function(cluster) {
          const count = cluster.getChildCount();
          let size = 'small';
          if (count >= 25 && count < 50) size = 'medium';
          else if (count >= 50) size = 'large';
          return L.divIcon({
            html: '<div><span>' + count + '</span></div>',
            className: 'marker-cluster marker-cluster-' + size,
            iconSize: L.point(40, 40)
          });
        }
      });

      ${markersJs}

      map.addLayer(markers);

      // Fit to all markers with comfortable padding
      const bounds = L.latLngBounds([${latLngs}]);
      map.fitBounds(bounds, { padding: [32, 32] });
    </script>
  </body>
 </html>`;
  }, []);

    const onMessage = useCallback((event: any) => {
      try {
        const data = JSON.parse(event?.nativeEvent?.data ?? '{}');
        if (data?.type === 'marker' && typeof data?.id === 'string') {
          navigation.navigate('GetStamp', { locationId: data.id });
        }
      } catch {}
    }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerOverlay, { paddingTop: Math.max(Spacing.md, insets.top + 6), height: undefined }] }>
        <Text style={styles.headerTitle}>Mysuru Map</Text>
        <View style={{ flex: 1 }} />
        <Pressable onPress={() => navigation.navigate('Passport')} style={[styles.profileBtn, { marginRight: 8, backgroundColor: Colors.royalBlue }]}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Passport</Text>
        </Pressable>
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
    // subtle shadow for a premium feel
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  headerTitle: { color: '#fff', fontFamily: Typography.fontFamilyBold, fontSize: 18 },
  profileBtn: { backgroundColor: Colors.gold, padding: 8, borderRadius: 10 },
});
