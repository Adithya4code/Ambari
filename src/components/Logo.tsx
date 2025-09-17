// src/components/Logo.tsx
import React from 'react';
import { Image, ImageStyle, View } from 'react-native';

type Props = {
  size?: number;
  style?: ImageStyle;
};

const Logo: React.FC<Props> = ({ size = 120, style }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../../assets/logo.png')}
        style={[{ width: size, height: size, borderRadius: 16 }, style]}
        resizeMode="contain"
      />
    </View>
  );
};

export default Logo;
