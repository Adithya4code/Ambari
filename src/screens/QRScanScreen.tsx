// src/screens/QRScanScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors } from '../theme';
import { validateScanData, Location, getLocationById } from '../lib/locations';
import { addCollectedStamp, enqueueCheckin, hasStamp } from '../lib/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

const QRScanScreen: React.FC<Props> = ({ navigation, route }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<'scanning' | 'processing'>('scanning');
    const targetLocationId = (route.params as any)?.locationId as string | undefined;
    const insets = useSafeAreaInsets();

    const handleSuccessfulScan = (location: Location) => {
        navigation.replace('CheckInSuccess', { location_id: location.id, token: location.token });
    };

    const onBarcodeScanned = async (scanningResult: BarcodeScanningResult) => {
        if (status === 'processing') return;
        setStatus('processing');

        const rawData = scanningResult.data;

        try {
            // If opened for a specific location, accept any QR and grant that stamp immediately.
            if (targetLocationId) {
                const loc = getLocationById(targetLocationId);
                if (loc) {
                    // Provide a properly formatted URL string so validateScanData succeeds
                    const rawUrl = `https://mysuru.example/checkin?location_id=${loc.id}&token=${loc.token}`;
                    navigation.replace('CheckInSuccess', { raw: rawUrl, location_id: loc.id, token: loc.token });
                } else {
                    navigation.replace('CheckInSuccess', { location_id: targetLocationId });
                }
                // Persist in background
                (async () => {
                    try {
                        await addCollectedStamp(targetLocationId);
                        await enqueueCheckin(targetLocationId, undefined);
                    } catch {}
                })();
                return;
            }

            // Otherwise, fallback to strict validation
            const validationResult = validateScanData(rawData);
            if (!validationResult.ok) {
                setError(validationResult.reason);
                setTimeout(() => {
                    setError(null);
                    setStatus('scanning');
                }, 3000);
                return;
            }

            const location = validationResult.location!;
            const hadStamp = await hasStamp(location.id);
            await addCollectedStamp(location.id);
            await enqueueCheckin(location.id, location.token);

            handleSuccessfulScan(location);
        } catch (err) {
            console.error('Scan processing error:', err);
            setError('An error occurred. Please try again.');
            setTimeout(() => {
                setError(null);
                setStatus('scanning');
            }, 3000);
        }
    };
    
    // All return statements for rendering must be at the top level
    if (!permission) {
        return (
            <View style={styles.center}>
                <Text>Requesting camera permissions…</Text>
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
                onBarcodeScanned={status === 'scanning' ? onBarcodeScanned : undefined}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            />

            {error && (
                <View style={[styles.errorBanner, { top: insets.top + 10 }]}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.overlay}>
                <Text style={[styles.hint, { marginTop: undefined, top: insets.top + 24 }]}>Align the QR on the plaque</Text>
                <Pressable style={[styles.cancel, { bottom: Math.max(32, insets.bottom + 16) }]} onPress={() => navigation.goBack()}>
                    <Text style={{ color: '#fff', fontSize: 20 }}>Cancel</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default QRScanScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    camera: { flex: 1 },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    frame: { width: 260, height: 260, borderWidth: 4, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 12 },
    hint: { color: '#fff', marginTop: 500, fontWeight: '900', fontSize: 24 },
    cancel: { position: 'absolute', bottom: 48, backgroundColor: Colors.terracotta, padding: 12, borderRadius: 10 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    errorBanner: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        zIndex: 10,
    },
    errorText: {
        color: 'white',
        fontWeight: 'bold',
    },
});