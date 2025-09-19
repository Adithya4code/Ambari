// src/screens/GetStampScreen.tsx
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Colors, Typography, Spacing } from '../theme';
import SwipeToConfirm from '../components/SwipeToConfirm';
import { PLACES } from '../lib/places';

type Props = NativeStackScreenProps<RootStackParamList, 'GetStamp'>;

const GetStampScreen: React.FC<Props> = ({ route, navigation }) => {
  const id = (route.params as any)?.locationId as string | undefined;
  const place = PLACES.find((p) => p.id === id);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Get Your Stamp</Text>
      {place ? (
        <View style={styles.card}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <Text style={styles.place}>{place.name}</Text>
          <Text style={styles.instructions}>Slide to open scanner and stamp your passport</Text>
          <View style={{ marginTop: 16 }}>
            <SwipeToConfirm onConfirmed={() => navigation.replace('Scan', { locationId: place.id })} />
          </View>
        </View>
      ) : (
        <Text style={{ padding: Spacing.md, color: Colors.mutedText }}>Unknown location.</Text>
      )}
    </SafeAreaView>
  );
};

export default GetStampScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmWhite, alignItems: 'center' },
  title: { fontFamily: Typography.fontFamilyBold, color: Colors.heritageBrown, fontSize: 20, marginTop: 12 },
  card: {
    width: '88%',
    backgroundColor: '#fff',
    marginTop: 18,
    borderRadius: 14,
    padding: Spacing.lg,
    alignItems: 'center',
    elevation: 3,
  },
  logo: { width: 82, height: 82, opacity: 0.9, marginBottom: 8 },
  place: { fontFamily: Typography.fontFamilySemi, color: Colors.heritageBrown, fontSize: 16, textAlign: 'center' },
  instructions: { marginTop: 8, color: Colors.mutedText, textAlign: 'center' },
});
