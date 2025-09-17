// src/screens/WelcomeScreen.tsx
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Logo from '../components/Logo';
import PrimaryButton from '../components/PrimaryButton';
import { Colors, Typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    // SafeAreaView is handled by SafeAreaProvider at top-level; we can still use full-screen container here
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Logo size={110} />
        {/* App title */}
        <Text style={styles.title}>Mysuru Explorer</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.lead}>
          Discover Mysuru’s rich heritage. Scan QR plaques at real locations, collect beautifully designed stamps, and enjoy short cultural videos — all available offline.
        </Text>

        <PrimaryButton
          title="Get Started"
          onPress={() => {
            navigation.replace('Home'); // demo flow
          }}
          style={{ marginTop: 18, width: '78%' }}
        />
      </View>

      {/* Hero background image — uses the hero you uploaded; it's pinned to bottom and spans width */}
      <Image source={require('../../assets/hero_placeholder.png')} style={styles.hero} resizeMode="cover" />
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmWhite, // subtle warm background to match heritage palette
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 18,
  },
  title: {
    marginTop: 8,
    fontSize: 26,
    fontFamily: Typography.fontFamilyBold,
    color: Colors.heritageBrown,
  },
  body: {
    paddingHorizontal: 28,
    alignItems: 'center',
  },
  lead: {
    textAlign: 'center',
    fontSize: 15,
    color: Colors.mutedText,
    fontFamily: Typography.fontFamily,
    lineHeight: 22,
  },
  hero: {
    width: '100%',
    height: 260,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
