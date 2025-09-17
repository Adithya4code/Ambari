// src/screens/HomeScreen.tsx
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ImageBackground, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import StampCard from '../components/StampCard';
import { Colors, Typography, Spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const demoData = [
  { id: 'mysore_palace', title: 'Mysore Palace', collected: false, image: require('../../assets/locations/mysore_palace.png') },
//   { id: 'jaganmohan', title: 'Jaganmohan Palace', collected: true, image: ('../../assets/locations/jaganmohan.jpg') },
//   { id: 'lalitha_mahal', title: 'Lalitha Mahal Palace', collected: false, image: ('../../assets/locations/lalitha_mahal.jpg') },
//   { id: 'chamundi_hill', title: 'Chamundeshwari Temple', collected: false, image: ('../../assets/locations/chamundi_hill.jpg') },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/hero_placeholder.png')} style={styles.heroBg} imageStyle={{ opacity: 0.9 }}>
        <View style={styles.topRow}>
          <Text style={styles.heroTitle}>Your Stamp Book</Text>
          <Pressable onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Profile</Text>
          </Pressable>
        </View>

        <View style={styles.heroMeta}>
          <Text style={styles.heroSub}>Explore sites and collect unique stamps</Text>
          {/* <Pressable style={styles.scanButton} onPress={() => navigation.navigate('Scan')}>
            <Text style={styles.scanText}>Scan QR</Text>
          </Pressable> */}
        </View>
      </ImageBackground>

      <FlatList
        data={demoData}
        keyExtractor={(i) => i.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <StampCard id={item.id} title={item.title} collected={item.collected} image={item.image} onPress={() => navigation.navigate('Scan', { locationId : item.id})} />
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmWhite },
  heroBg: { width: '100%', height: 160, justifyContent: 'center' },
  topRow: { padding: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroTitle: { fontFamily: Typography.fontFamilyBold, fontSize: 22, color: '#fff' },
  profileBtn: { backgroundColor: Colors.gold, padding: 8, borderRadius: 10 },
  heroMeta: { paddingHorizontal: Spacing.md, paddingBottom: 10 },
  heroSub: { color: '#fff', marginBottom: 12 },
  scanButton: { alignSelf: 'flex-start', backgroundColor: Colors.gold, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  scanText: { fontFamily: Typography.fontFamilySemi, color: Colors.heritageBrown, fontWeight: '700' },
  listContent: { padding: Spacing.sm, paddingBottom: 100 },
});
