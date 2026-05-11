import React from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSearch from '../../src/hooks/useSearch';
import Avatar from '../../src/components/common/Avatar';
import { Loader, EmptyState } from '../../src/components/common/UI';
import { formatCount } from '../../src/utils/helpers';
import { COLORS, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

const { width } = Dimensions.get('window');
const CELL = (width - 3) / 3;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { query, results, loading, tab, hasResults, setTab, search, clear } = useSearch();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.headerWrap}>
        <Text style={styles.title}>
          <Text style={{ color: COLORS.primary }}>{'> '}</Text>
          Rechercher
        </Text>
        <View style={styles.bar}>
          <Ionicons name="search" size={16} color={COLORS.primary} />
          <TextInput
            style={styles.input}
            placeholder="Comptes, posts…"
            placeholderTextColor={COLORS.textMuted}
            value={query}
            onChangeText={search}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clear}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      {hasResults && (
        <View style={styles.tabs}>
          {[
            { key: 'users', label: `Comptes (${results.users.length})` },
            { key: 'posts', label: `Posts (${results.posts.length})` },
          ].map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {loading && <Loader />}

      {!loading && query.length >= 2 && !hasResults && (
        <EmptyState icon="search-outline" title="Aucun résultat" subtitle={`Rien pour "${query}"`} />
      )}
      {!loading && query.length < 2 && (
        <EmptyState icon="search-outline" title="Rechercher" subtitle="Comptes et publications" />
      )}

      {!loading && tab === 'users' && results.users.length > 0 && (
        <FlatList
          data={results.users}
          keyExtractor={i => String(i.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userRow}
              onPress={() => router.push(`/profile/${item.id}`)}
            >
              <Avatar uri={item.profilePicture} username={item.username} size={46} />
              <View style={styles.userInfo}>
                <Text style={styles.username}>
                  <Text style={{ color: COLORS.primary }}>@</Text>{item.username}
                </Text>
                {item.bio && <Text style={styles.bio} numberOfLines={1}>{item.bio}</Text>}
                <Text style={styles.followers}>
                  {formatCount(item.followersCount)} abonné{item.followersCount !== 1 ? 's' : ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      {!loading && tab === 'posts' && results.posts.length > 0 && (
        <FlatList
          data={results.posts}
          keyExtractor={i => String(i.id)}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cell}
              onPress={() => router.push(`/post/${item.id}`)}
            >
              <Image source={{ uri: item.mediaUrl }} style={styles.cellImg} />
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: COLORS.bg },
  headerWrap: {
    paddingHorizontal: SPACING.md,
    paddingTop:        SPACING.md,
    paddingBottom:     SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap:               SPACING.sm,
  },
  title: {
    color:      COLORS.text,
    fontSize:   FONTS.sizes.xl,
    fontWeight: FONTS.weight.black,
    letterSpacing: 1,
  },
  bar: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               SPACING.sm,
    backgroundColor:   COLORS.surfaceAlt,
    borderRadius:      RADIUS.sm,
    borderWidth:       1,
    borderColor:       COLORS.border,
    paddingHorizontal: SPACING.md,
    height:            42,
  },
  input:     { flex: 1, color: COLORS.text, fontSize: FONTS.sizes.sm },
  tabs:      { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab:       { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText:   { color: COLORS.textSub, fontSize: FONTS.sizes.sm },
  tabTextActive: { color: COLORS.primary, fontWeight: FONTS.weight.bold },
  userRow: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: SPACING.md,
    paddingVertical:   SPACING.md,
    gap:               SPACING.md,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  userInfo:  { flex: 1 },
  username:  { color: COLORS.text, fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.semibold },
  bio:       { color: COLORS.textSub, fontSize: FONTS.sizes.sm, marginTop: 2 },
  followers: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  cell:      { width: CELL, height: CELL, margin: 0.5 },
  cellImg:   { width: '100%', height: '100%', backgroundColor: COLORS.surfaceAlt },
});
