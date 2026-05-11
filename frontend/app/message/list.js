import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import useAuthStore from '../../src/store/authStore';
import { searchService } from '../../src/services/apiServices';
import Avatar from '../../src/components/common/Avatar';
import { Loader, EmptyState, Divider } from '../../src/components/common/UI';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';

dayjs.extend(relativeTime);
dayjs.locale('fr');

export default function MessageListScreen() {
  const insets      = useSafeAreaInsets();
  const currentUser = useAuthStore(s => s.user);
  // On charge la liste des followers comme liste de conversations potentielles
  const [contacts, setContacts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    // Charger les followers comme liste de conversations
    import('../../src/services/apiServices').then(({ followService }) => {
      followService.getFollowers(currentUser?.id)
        .then(r => setContacts(r.data ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Messages</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={contacts}
        keyExtractor={i => String(i.id)}
        ItemSeparatorComponent={() => <Divider style={{ marginHorizontal: SPACING.md }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push({
              pathname: `/message/${item.id}`,
              params: { username: item.username, profilePicture: item.profilePicture ?? '' }
            })}
          >
            <Avatar uri={item.profilePicture} username={item.username} size={52} showOnline />
            <View style={styles.info}>
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.sub}>Appuyez pour envoyer un message</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState icon="paper-plane-outline" title="Aucune conversation" subtitle="Suivez des personnes pour démarrer une conversation" />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  title:   { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weight.black },
  row:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, gap: SPACING.md },
  info:    { flex: 1 },
  name:    { color: COLORS.text, fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.semibold },
  sub:     { color: COLORS.textSub, fontSize: FONTS.sizes.sm, marginTop: 2 },
});
