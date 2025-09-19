// src/screens/WelcomeScreen.tsx
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ImageBackground } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Logo from '../components/Logo';
import PrimaryButton from '../components/PrimaryButton';
import { Colors, Typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Hero as fullscreen background */}
      <ImageBackground
        source={require('../../assets/hero_placeholder.png')}
        style={styles.hero}
        resizeMode="cover"
      >
        {/* Dark overlay to make text more readable */}
        <View style={styles.darkOverlay} />

        {/* Content overlay */}
        <View style={styles.overlay}>
          {/* Header with logo + title */}
          <View style={styles.header}>
            <Logo size={110} />
            <Text style={styles.title}>Ambari</Text>
          </View>

          {/* Body content */}
          <View style={styles.body}>
            <Text style={styles.lead}>
              Discover Mysuru’s rich heritage. Scan QR plaques at real locations, collect beautifully designed stamps, and enjoy short cultural videos — all available offline.
            </Text>
          </View>

          {/* Button at bottom */}
          <PrimaryButton
            title="Get Started"
            onPress={() => navigation.replace('Home')}
            style={styles.button}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmWhite,
  },
  hero: {
    flex: 1, // hero covers full screen
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end', // children anchored to bottom
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject, // covers entire image
    backgroundColor: 'rgba(0,0,0,0.35)', // adjust 0.25–0.5 for more/less darkness
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 28,
  },
  header: {
    alignItems: 'center',
    marginTop: 10, // moved higher (was 60)
  },
  title: {
    marginTop: 8,
    fontSize: 30,
    fontFamily: Typography.fontFamilyBold,
    color: '#FFD700', // golden color for regal vibe
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  body: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  lead: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff', // white text for readability
    fontFamily: Typography.fontFamily,
    lineHeight: 22,
  },
  button: {
    alignSelf: 'center',
    width: '80%',
  },
});
