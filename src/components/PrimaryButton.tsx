// src/components/PrimaryButton.tsx
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  style?: any;
};

const PrimaryButton: React.FC<Props> = ({ title, onPress, style }) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#C65D3B', // terracotta token
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  text: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
