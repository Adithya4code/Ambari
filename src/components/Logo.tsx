// src/components/Logo.tsx
import React from 'react';
import { View, Image, StyleSheet, ImageStyle } from 'react-native';

type Props = {
  size?: number;
  style?: ImageStyle;
};

/**
 * Logo component - small wrapper so screens can use the same logo and size.
 * We import the logo from /assets/logo.png (you uploaded this).
 * Use this only for recognition (app icon/header), not hero background.
 */
const Logo: React.FC<Props> = ({ size = 92, style }) => {
  return (
    <View style={styles.wrapper}>
      <Image
        source={require('../../assets/logo.png')}
        style={[{ width: size, height: size, borderRadius: 12 }, style]}
        resizeMode="contain"
      />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  wrapper: {
    // centers logo within any parent container
    alignItems: 'center',
    justifyContent: 'center',
  },
});
