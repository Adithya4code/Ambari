import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Colors } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

/**
 * QRScanScreen implemented with expo-camera.
 * CameraView component provides `onBarCodeScanned` callback.
 * We also show permission state handling and a simple frame overlay.
 */
const QRScanScreen: React.FC<Props> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const insets = useSafeAreaInsets();

  // Reset scanned state when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setScanned(false);
    });
    return unsubscribe;
  }, [navigation]);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return; // avoid duplicate scans
    setScanned(true);

    // try to parse as URL query params (our QR format)
    try {
      const url = new URL(data);
      const location_id = url.searchParams.get('location_id');
      const token = url.searchParams.get('token');
      navigation.replace('CheckInSuccess', { location_id: location_id ?? undefined, token: token ?? undefined });
    } catch (err) {
      // fallback: not a URL - send raw data
      navigation.replace('CheckInSuccess', { location_id: data, token: undefined });
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No camera permission. Please enable camera in settings.</Text>
        <Pressable onPress={requestPermission} style={{ marginTop: 12 }}>
          <Text style={{ color: Colors.terracotta }}>Grant permission</Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
          <Text style={{ color: Colors.terracotta }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        ref={cameraRef}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
        <Text style={styles.hint}>Align the QR code on the heritage plaque</Text>
        <Pressable
          style={[
            styles.cancel,
            {
              bottom: insets.bottom + 48, // Respect bottom safe area
            },
          ]}
          onPress={() => {
            setScanned(false);
            navigation.goBack();
          }}
        >
          <Text style={{ color: '#fff' }}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default QRScanScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBox: {
    width: 260,
    height: 260,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.85)',
    backgroundColor: 'transparent',
  },
  hint: {
    marginTop: 16,
    color: '#fff',
    fontWeight: '600',
  },
  cancel: {
    position: 'absolute',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.terracotta,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});