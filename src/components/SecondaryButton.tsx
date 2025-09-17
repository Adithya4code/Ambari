// src/components/SecondaryButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  style?: any;
};

const SecondaryButton: React.FC<Props> = ({ title, onPress, style }) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

export default SecondaryButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#2E4F9A', // royal blue token
    fontWeight: '600',
    fontSize: 15,
  },
});
