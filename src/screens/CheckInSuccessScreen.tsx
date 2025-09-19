// src/screens/CheckInSuccessScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Pressable, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { validateScanData, Location } from '../lib/locations';
import { addCollectedStamp, enqueueCheckin, hasStamp } from '../lib/storage';
import LocationDetail from '../components/LocationDetail';
import { getStamp } from '../lib/stamps';
import { Colors } from '../theme';
import { Audio } from 'expo-av';
import ConfettiCannon from 'react-native-confetti-cannon';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckInSuccess'>;

const CheckInSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const raw = (route.params as any)?.raw ?? undefined;
    const location_id = (route.params as any)?.location_id ?? undefined;
  const token = (route.params as any)?.token ?? undefined;
  const [status, setStatus] = useState<'validating' | 'ok' | 'error'>('validating');
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [alreadyHad, setAlreadyHad] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const stampScale = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      // It's safe to assume `raw` is valid here, based on the QRScanScreen logic
      let candidateRaw = raw;
      if (!candidateRaw && location_id) {
        candidateRaw = `https://mysuru.example/checkin?location_id=${location_id}&token=${token ?? ''}`;
      }

      // Handle missing data at the start
      if (!candidateRaw) {
        setStatus('error');
        return;
      }
      
      const res = validateScanData(candidateRaw);
      if (!res.ok) {
        setStatus('error');
        return;
      }
      
      const l = res.location!;
      setLocation(l);

      if (res.ok) {
        const l = res.location!;
        setLocation(l);
        try {
          const had = await hasStamp(l.id);
          setAlreadyHad(had);
          await addCollectedStamp(l.id);
          await enqueueCheckin(l.id, l.token);
          setStatus('ok');
          setCelebrate(true);
          try {
            const { sound } = await Audio.Sound.createAsync(require('../../stamp-81635.mp3'));
            setSound(sound);
            await sound.playAsync();
          } catch {}
          // animate stamp drop
          Animated.sequence([
            Animated.timing(stampScale, { toValue: 0, duration: 1, useNativeDriver: true }),
            Animated.spring(stampScale, { toValue: 1.15, useNativeDriver: true }),
            Animated.spring(stampScale, { toValue: 1.0, useNativeDriver: true }),
          ]).start();
        } catch (err) {
          console.warn('checkin storage err', err);
          setStatus('ok');
        }
      } else {
        // Fallback for an unlikely error, but should not happen in practice
        console.error("Received invalid data on CheckInSuccessScreen.");
        setStatus('ok');
      }
    })();
  }, [raw]);

  if (status === 'validating' || (!location && status !== 'error')) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Processing check-in…</Text>
        <Text style={styles.sub}>Validating scanned token and saving your stamp.</Text>
      </SafeAreaView>
    );
  }

  if (status === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Validation Failed</Text>
          <Text style={styles.sub}>We could not validate that QR. Please try rescanning.</Text>
        </View>
        <View style={styles.footer}>
          <Pressable style={styles.button} onPress={() => navigation.replace('Scan', { locationId: location_id })}>
            <Text style={styles.buttonText}>Rescan</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.ghost]} onPress={() => navigation.replace('Home')}>
            <Text style={[styles.buttonText, { color: Colors.heritageBrown }]}>Back to Map</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // The rest of the code assumes a valid 'location' is available.
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Check-in Successful</Text>
        <Text style={styles.small}>{alreadyHad ? 'You already had this stamp — updated timestamp recorded.' : 'New stamp added to your collection!'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <LocationDetail location={location!} autoPlay />
        {/* Overlay the actual transparent stamp for this place */}
        {(() => {
          const s = getStamp(location!.id);
          if (!s) return null;
          return (
            <View style={styles.stampOverlayWrap} pointerEvents="none">
              <Animated.Image source={s.image} style={[styles.stampImg, { transform: [{ scale: stampScale }] }]} resizeMode="contain" />
            </View>
          );
        })()}
      </View>
      <View style={styles.footer}>
  <Pressable style={styles.button} onPress={() => navigation.replace('Passport', { justStamped: true, stampedLocationId: location.id })}><Text style={styles.buttonText}>View Passport</Text></Pressable>
        <Pressable style={[styles.button, styles.ghost]} onPress={() => navigation.replace('Profile')}><Text style={[styles.buttonText, { color: Colors.heritageBrown }]}>View Profile</Text></Pressable>
      </View>
      {celebrate && (
        <ConfettiCannon count={100} origin={{ x: 0, y: 0 }} fadeOut autoStart onAnimationEnd={() => setCelebrate(false)} />
      )}
    </SafeAreaView>
  );
};

export default CheckInSuccessScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.heritageBrown },
  small: { color: Colors.mutedText, marginTop: 6 },
  sub: { color: Colors.mutedText, marginTop: 8 },
  footer: { padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    backgroundColor: Colors.terracotta,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  ghost: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  stampOverlayWrap: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    width: 140,
    height: 140,
  },
  stampImg: {
    width: '100%',
    height: '100%',
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});