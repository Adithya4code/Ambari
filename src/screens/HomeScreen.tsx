// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const demo = [
  { id: '1', name: 'Chamundi Hill', collected: true, img: require('../../assets/hero_placeholder.png') },
  { id: '2', name: 'Mysore Palace', collected: false, img: require('../../assets/hero_placeholder.png') },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Your Stamp Book</Text>
        <Pressable onPress={() => navigation.navigate('Scan')}>
          <Text style={styles.scan}>Scan</Text>
        </Pressable>
      </View>

      <FlatList
        data={demo}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.img} style={styles.img} />
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={item.collected ? styles.collected : styles.locked}>
              {item.collected ? 'Collected' : 'Locked'}
            </Text>
          </View>
        )}
      />
    </SafeAreaProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F3' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  header: { fontSize: 20, fontWeight: '700', color: '#8B4513' },
  scan: { color: '#C65D3B', fontWeight: '700' },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
  },
  img: { width: 120, height: 80, borderRadius: 8 },
  cardTitle: { marginTop: 8, fontWeight: '600' },
  collected: { marginTop: 6, color: '#2E4F9A', fontWeight: '700' },
  locked: { marginTop: 6, color: '#bbb' },
});
