// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';
import { getCollectedStamps, getQueue, processQueue, clearCollectedStamps, clearQueue } from '../lib/storage';
import { getLocationById, LOCATIONS } from '../lib/locations';
import StampCard from '../components/StampCard';

/**
 * ProfileScreen - shows user profile info and collected stamps
 * Also exposes a manual "Sync" button to process queued check-ins.
 */
const ProfileScreen: React.FC = () => {
  const [collected, setCollected] = useState<string[]>([]);
  const [queueItems, setQueueItems] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await getCollectedStamps();
      setCollected(s);
      const q = await getQueue();
      setQueueItems(q);
    })();
  }, []);

  const onSync = async () => {
    setSyncing(true);
    const res = await processQueue();
    // refresh queue and collected
    const q = await getQueue();
    setQueueItems(q);
    const s = await getCollectedStamps();
    setCollected(s);
    setSyncing(false);
    alert(`Sync complete — ${res.success} success, ${res.failed} failed`);
  };

  const onReset = async () => {
    Alert.alert('Reset All Stamps', 'This will remove all collected stamps and clear pending check-ins. This cannot be undone. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset', style: 'destructive', onPress: async () => {
          await clearCollectedStamps();
          await clearQueue();
          const s = await getCollectedStamps();
          setCollected(s);
          const q = await getQueue();
          setQueueItems(q);
        }
      }
    ]);
  };

  const stamps = collected.map((id) => getLocationById(id)).filter(Boolean);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>Traveler</Text>
        <Text style={styles.sub}>Stamps collected: {stamps.length} / {LOCATIONS.length}</Text>
        <Pressable style={styles.sync} onPress={onSync}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{syncing ? 'Syncing...' : 'Sync'}</Text>
        </Pressable>
        <Pressable style={[styles.sync, { backgroundColor: Colors.gold }]} onPress={onReset}>
          <Text style={{ color: '#000', fontWeight: '700' }}>Reset Stamps</Text>
        </Pressable>
      </View>

      <FlatList
        data={stamps}
        keyExtractor={(i) => (i as any).id}
        numColumns={2}
        contentContainerStyle={{ padding: Spacing.sm }}
        renderItem={({ item }) => (
          <StampCard
            id={item!.id}
            title={item!.name}
            collected={true}
            image={item!.image}
            onPress={() => {
              // later: open detail
            }}
          />
        )}
        ListEmptyComponent={<Text style={{ padding: 12, color: Colors.mutedText }}>No stamps yet — get out and explore!</Text>}
      />

      <View style={styles.queue}>
        <Text style={{ fontWeight: '700' }}>Queued check-ins: {queueItems.length}</Text>
        <Text style={{ color: Colors.mutedText }}>Queued items will be pushed when you press Sync or when the app auto-syncs.</Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F3' },
  header: { padding: 16, alignItems: 'flex-start' },
  name: { fontSize: 20, fontFamily: Typography.fontFamilyBold, color: Colors.heritageBrown },
  sub: { marginTop: 6, color: Colors.mutedText },
  sync: {
    marginTop: 10,
    backgroundColor: Colors.terracotta,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  queue: { padding: 14, borderTopWidth: 1, borderTopColor: '#EEE' },
});
