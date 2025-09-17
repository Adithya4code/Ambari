// src/components/StampCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

type Props = {
  id: string;
  title: string;
  collected?: boolean;
  image: any;
  onPress?: () => void;
};

/**
 * StampCard - represents a location stamp tile in the stampbook/grid.
 * Reusable for location cards or video items (keeps layout consistent).
 */
const StampCard: React.FC<Props> = ({ id, title, collected = false, image, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Image area: important visual anchor */}
      <Image source={image} style={styles.image} resizeMode="cover" />

      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* collected / locked label */}
        <View style={[styles.badge, collected ? styles.collectedBadge : styles.lockedBadge]}>
          <Text style={[styles.badgeText, collected ? styles.collectedText : styles.lockedText]}>
            {collected ? 'Collected' : 'Locked'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default StampCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: Spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',      // ensures child image respects radius
    backgroundColor: Colors.cardBg,
    elevation: 2,            // Android shadow
    shadowColor: '#000',     // iOS shadow
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 110,             // fixed image height for grid consistency
  },
  meta: {
    padding: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: Typography.fontFamilySemi,
    color: Colors.heritageBrown,
    marginRight: 8,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  collectedBadge: {
    backgroundColor: Colors.royalBlue,
  },
  lockedBadge: {
    backgroundColor: '#EEE',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  collectedText: {
    color: '#fff',
    fontFamily: Typography.fontFamilySemi,
  },
  lockedText: {
    color: '#666',
    fontFamily: Typography.fontFamily,
  },
});
