// src/screens/CheckInSuccessScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckInSuccess'>;

const CheckInSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { location_id } = route.params ?? {};
  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>Check-in Successful</Text>
        <Image source={require('../../assets/hero_placeholder.png')} style={styles.image} />
        <Text style={styles.subtitle}>
          Stamp for {location_id ? `'${location_id}'` : 'this location'} has been added to your collection.
        </Text>

        <Pressable style={styles.button} onPress={() => navigation.replace('Home')}>
          <Text style={styles.buttonText}>Back to Stamp Book</Text>
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
};

export default CheckInSuccessScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F3' },
  center: { alignItems: 'center', justifyContent: 'center', padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: '#8B4513', marginBottom: 12 },
  image: { width: 160, height: 160, borderRadius: 12, marginBottom: 12 },
  subtitle: { fontSize: 15, textAlign: 'center' },
  button: {
    marginTop: 18,
    backgroundColor: '#C65D3B',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});
