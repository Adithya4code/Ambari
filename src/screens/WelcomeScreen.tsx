import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={require('../../assets/hero_placeholder.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text
            style={[
              styles.title,
              {
                marginTop: insets.top + 25, // Respect top safe area
              },
            ]}
          >
            Ambari
          </Text>
          <View
            style={[
              styles.bottomContent,
              {
                paddingBottom: insets.bottom + 24, // Respect bottom safe area
              },
            ]}
          >
            <Text style={styles.subtitle}>
              Discover Mysuru’s heritage. Scan QR plaques, collect stamps, and unlock short cultural videos.
            </Text>
            <PrimaryButton
              title="Get Started"
              onPress={() => navigation.replace('Home')}
              style={styles.primaryButton}
            />
            <SecondaryButton
              title="Sign in (demo)"
              onPress={() => navigation.navigate('Home')}
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 248, 243, 0.17)', // Semi-transparent warmWhite for readability
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    top: 0,
    width: '100%',
    fontSize: 54,
    fontWeight: '700',
    color: '#fcfcfcff', // heritageBrown
    textAlign: 'center',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 30,
    color: '#2d1c1cff',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
    fontWeight: '900',
  },
  primaryButton: {
    width: '80%',
    marginBottom: 12,
  },
  secondaryButton: {
    width: '80%',
  },
});