import { Tabs, Redirect } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../src/store/authStore';
import useNotifStore from '../../src/store/notifStore';
import { COLORS, SIZES, FONTS, SPACING, RADIUS } from '../../src/constants/theme';

// ── Tab icon ──────────────────────────────────────────────────────────────
function TabIcon({ name, focused, badge }) {
  return (
    <View style={styles.iconWrap}>
      {focused && <View style={styles.activeIndicator} />}
      <Ionicons
        name={focused ? name : `${name}-outline`}
        size={24}
        color={focused ? COLORS.primary : COLORS.textSub}
      />
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      )}
    </View>
  );
}

// ── Center "+" button ─────────────────────────────────────────────────────
function CreateBtn() {
  return (
    <View style={styles.createOuter}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDim]}
        style={styles.createGradient}
      >
        <Ionicons name="add" size={26} color={COLORS.bg} />
      </LinearGradient>
    </View>
  );
}

export default function TabsLayout() {
  const isLoggedIn  = useAuthStore(s => s.isLoggedIn);
  const unreadCount = useNotifStore(s => s.unreadCount);

  if (!isLoggedIn) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown:             false,
        tabBarStyle:             styles.tabBar,
        tabBarShowLabel:         false,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSub,
        tabBarBackground: () => (
          <View style={styles.tabBarBg}>
            {/* Subtle green top border */}
            <View style={styles.topLine} />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="search" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: () => <CreateBtn />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="notifications" focused={focused} badge={unreadCount} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth:  0,
    height:          SIZES.tabBar + 14,
    paddingBottom:   14,
    paddingTop:      6,
    elevation:       0,
  },
  tabBarBg: {
    flex:            1,
    backgroundColor: COLORS.surface,
    borderTopWidth:  0,
  },
  topLine: {
    height:          1,
    backgroundColor: COLORS.border,
  },
  iconWrap:        { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  activeIndicator: {
    position:        'absolute',
    top:             -8,
    width:           28,
    height:          2,
    borderRadius:    1,
    backgroundColor: COLORS.primary,
  },
  badge: {
    position:          'absolute',
    top:               -5,
    right:             -9,
    backgroundColor:   COLORS.like,
    borderRadius:      99,
    minWidth:          16,
    height:            16,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: 3,
    borderWidth:       1.5,
    borderColor:       COLORS.surface,
  },
  badgeText:       { color: COLORS.white, fontSize: 9, fontWeight: FONTS.weight.bold },

  // Create button
  createOuter: {
    width:  48,
    height: 48,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  createGradient: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
  },
});
