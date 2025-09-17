// src/screens/HomeScreen.tsx
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ImageBackground, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import StampCard from '../components/StampCard';
import { Colors, Typography, Spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const demoData = [
  { id: 'l1', title: 'Chamundi Hill', collected: true, image: require('../../assets/hero_placeholder.png') },
  { id: 'l2', title: 'Mysore Palace', collected: true, image: require('../../assets/hero_placeholder.png') },
  { id: 'l3', title: 'St. Philomena Church', collected: false, image: require('../../assets/hero_placeholder.png') },
  { id: 'l4', title: 'Jaganmohan Palace', collected: false, image: require('../../assets/hero_placeholder.png') },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Hero background at top - ImageBackground lets us overlay content on top of the hero image */}
      <ImageBackground source={require('../../assets/hero_placeholder.png')} style={styles.heroBg} imageStyle={{ opacity: 0.85 }}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Your Stamp Book</Text>
          <Text style={styles.heroSub}>Explore sites and collect unique stamps</Text>
          <Pressable style={styles.scanButton} onPress={() => navigation.navigate('Scan')}>
            <Text style={styles.scanText}>Scan QR</Text>
          </Pressable>
        </View>
      </ImageBackground>

      {/* Grid of stamps */}
      <FlatList
        data={demoData}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <StampCard
            id={item.id}
            title={item.title}
            collected={item.collected}
            image={item.image}
            onPress={() => {
              // placeholder - later: navigate to StampDetail
              console.log('pressed', item.id);
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmWhite },
  heroBg: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
  },
  heroContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.08)', // subtle overlay to ensure text legibility
  },
  heroTitle: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 22,
    color: '#fff', // hero overlay expects white contrast
    marginBottom: 6,
  },
  heroSub: {
    fontFamily: Typography.fontFamily,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 12,
  },
  scanButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scanText: {
    fontFamily: Typography.fontFamilySemi,
    color: Colors.heritageBrown,
    fontWeight: '700',
  },
  listContent: {
    padding: Spacing.sm,
    paddingBottom: 100,
  },
});
