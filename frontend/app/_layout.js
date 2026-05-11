import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import useAuthStore from '../src/store/authStore';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  const restoreSession = useAuthStore(s => s.restoreSession);

  useEffect(() => { restoreSession(); }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={COLORS.bg} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.bg } }}>
          <Stack.Screen name="(auth)"   options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)"   options={{ headerShown: false }} />
          <Stack.Screen name="post/[id]"    options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="story/viewer" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="story/create" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="message/[userId]" options={{ headerShown: false }} />
          <Stack.Screen name="profile/[userId]" options={{ headerShown: false }} />
          <Stack.Screen name="search/index"     options={{ headerShown: false }} />
        </Stack>
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
