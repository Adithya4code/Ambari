// src/components/SwipeToConfirm.tsx
import React, { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Animated, Text } from 'react-native';
import { Colors, Typography } from '../theme';

type Props = {
  width?: number;
  onConfirmed: () => void;
  label?: string;
};

const SwipeToConfirm: React.FC<Props> = ({ width = 300, onConfirmed, label = 'Slide to stamp' }) => {
  const knobSize = 54;
  const trackHeight = 56;
  const maxX = width - knobSize - 4; // padding
  const pan = useRef(new Animated.Value(0)).current;
  const [confirmed, setConfirmed] = useState(false);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !confirmed,
      onMoveShouldSetPanResponder: () => !confirmed,
      onPanResponderMove: (_, gesture) => {
        if (confirmed) return;
        const x = Math.min(Math.max(0, gesture.dx), maxX);
        pan.setValue(x);
      },
      onPanResponderRelease: (_, gesture) => {
        if (confirmed) return;
        if (gesture.dx > maxX * 0.85) {
          setConfirmed(true);
          Animated.timing(pan, { toValue: maxX, duration: 140, useNativeDriver: false }).start(() => onConfirmed());
        } else {
          Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  return (
    <View style={[styles.wrap, { width, height: trackHeight }]}> 
      <Text style={styles.label}>{label}</Text>
      <Animated.View {...responder.panHandlers} style={[styles.knob, { width: knobSize, height: knobSize, transform: [{ translateX: pan }] }]} />
    </View>
  );
};

export default SwipeToConfirm;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#f2e7cf',
    borderRadius: 999,
    justifyContent: 'center',
    padding: 2,
    overflow: 'hidden',
  },
  label: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: Colors.heritageBrown,
    fontFamily: Typography.fontFamilySemi,
  },
  knob: {
    backgroundColor: Colors.terracotta,
    borderRadius: 999,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
