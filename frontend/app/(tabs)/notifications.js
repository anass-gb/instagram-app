import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import useNotifStore from '../../src/store/notifStore';
import Avatar from '../../src/components/common/Avatar';
import { Loader, EmptyState } from '../../src/components/common/UI';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const ICONS = {
  LIKE_POST:    { icon: 'heart',               color: '#FF3B5C' },
  LIKE_COMMENT: { icon: 'heart',               color: '#FF3B5C' },
  LIKE_MESSAGE: { icon: 'heart',               color: '#FF3B5C' },
  LIKE_STORY:   { icon: 'heart',               color: '#FF3B5C' },
  COMMENT:      { icon: 'chatbubble',          color: COLORS.primary },
  COMMENT_REPLY:{ icon: 'chatbubble-ellipses', color: COLORS.primary },
  FOLLOW:       { icon: 'person-add',          color: '#00B4FF' },
  STORY_VIEW:   { icon: 'eye',                 color: '#9B59B6' },
  MESSAGE:      { icon: 'paper-plane',         color: COLORS.primary },
  SHARED_POST:  { icon: 'share-social',        color: '#00B4FF' },
};

export default function NotificationsScreen() {
  const insets     = useSafeAreaInsets();
  const { notifications, fetch, markAllRead } = useNotifStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const init = async () => {
      await fetch();
      await markAllRead();
      setLoading(false);
    };
    init();
  }, []);

  const renderItem = ({ item }) => {
    const meta = ICONS[item.type] ?? { icon: 'notifications', color: COLORS.primary };
    return (
      <TouchableOpacity
        style={[styles.item, !item.isRead && styles.itemUnread]}
        onPress={() => item.actor && router.push(`/profile/${item.actor.id}`)}
        activeOpacity={0.8}
      >
        <View style={styles.avatarWrap}>
          <Avatar uri={item.actor?.profilePicture} username={item.actor?.username} size={44} />
          <View style={[styles.typeDot, { backgroundColor: meta.color }]}>
            <Ionicons name={meta.icon} size={9} color={COLORS.white} />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.msg}>
            <Text style={styles.actor}>{item.actor?.username} </Text>
            {item.message?.replace(item.actor?.username + ' ', '') || ''}
          </Text>
          <Text style={styles.time}>{dayjs(item.createdAt).fromNow()}</Text>
        </View>
        {!item.isRead && <View style={styles.unread} />}
      </TouchableOpacity>
    );
  };

  if (loading) return <Loader />;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={i => String(i.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState icon="notifications-outline" title="Aucune notification" subtitle="Vos notifications apparaîtront ici" />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  title:       { color: COLORS.text, fontSize: FONTS.sizes.xl, fontWeight: FONTS.weight.black },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.md,
  },
  itemUnread:  { backgroundColor: COLORS.primaryFaint },
  avatarWrap:  { position: 'relative' },
  typeDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 18, height: 18, borderRadius: 99,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.bg,
  },
  content:     { flex: 1 },
  msg:         { color: COLORS.text, fontSize: FONTS.sizes.sm, lineHeight: 18 },
  actor:       { fontWeight: FONTS.weight.bold },
  time:        { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 3 },
  unread:      { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
});
