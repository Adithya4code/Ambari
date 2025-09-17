// src/screens/CheckInSuccessScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { validateScanData, Location } from '../lib/locations';
import { addCollectedStamp, enqueueCheckin, hasStamp } from '../lib/storage';
import LocationDetail from '../components/LocationDetail';
import { Colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckInSuccess'>;

const CheckInSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const raw = (route.params as any)?.raw ?? undefined;
    const location_id = (route.params as any)?.location_id ?? undefined;
  const token = (route.params as any)?.token ?? undefined;
  const [status, setStatus] = useState<'validating' | 'ok' | 'error'>('validating');
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [alreadyHad, setAlreadyHad] = useState(false);

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

  // Handle the initial 'validating' state.
  if (status === 'validating' || !location) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Processing check-in…</Text>
        <Text style={styles.sub}>Validating scanned token and saving your stamp.</Text>
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
        <LocationDetail location={location} autoPlay />
      </View>
      <View style={styles.footer}>
        <Pressable style={styles.button} onPress={() => navigation.replace('Home')}><Text style={styles.buttonText}>Back to Stamp Book</Text></Pressable>
        <Pressable style={[styles.button, styles.ghost]} onPress={() => navigation.replace('Profile')}><Text style={[styles.buttonText, { color: Colors.heritageBrown }]}>View Profile</Text></Pressable>
      </View>
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
});