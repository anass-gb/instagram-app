import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { savedService } from '../../src/services/apiServices';
import { Header, Loader, EmptyState } from '../../src/components/common/UI';
import { COLORS } from '../../src/constants/theme';

const CELL = (Dimensions.get('window').width - 3) / 3;

export default function SavedScreen() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    savedService.getAll()
      .then(r => setPosts(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <View style={styles.screen}>
      <Header title="Posts sauvegardés" onBack={() => router.back()} />
      <FlatList
        data={posts}
        keyExtractor={i => String(i.id)}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.cell} onPress={() => router.push(`/post/${item.id}`)}>
            <Image source={{ uri: item.mediaUrl }} style={styles.img} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<EmptyState icon="bookmark-outline" title="Aucun post sauvegardé" />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  cell:   { width: CELL, height: CELL, margin: 0.5 },
  img:    { width: '100%', height: '100%', backgroundColor: COLORS.surfaceAlt },
});
