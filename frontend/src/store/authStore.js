import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/apiServices';

const useAuthStore = create((set, get) => ({
  user:       null,
  token:      null,
  isLoggedIn: false,
  isLoading:  false,
  error:      null,

  signup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { data: res } = await authService.signup(data);
      await AsyncStorage.setItem('token', res.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.user));
      set({ token: res.token, user: res.user, isLoggedIn: true, isLoading: false });
      return { success: true };
    } catch (e) {
      const msg = e.response?.data?.message || 'Erreur inscription';
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },

  signin: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { data: res } = await authService.signin(data);
      await AsyncStorage.setItem('token', res.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.user));
      set({ token: res.token, user: res.user, isLoggedIn: true, isLoading: false });
      return { success: true };
    } catch (e) {
      const msg = e.response?.data?.message || 'Email ou mot de passe incorrect';
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },

  signout: async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    set({ user: null, token: null, isLoggedIn: false });
  },

  restoreSession: async () => {
    const token   = await AsyncStorage.getItem('token');
    const userStr = await AsyncStorage.getItem('user');
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr), isLoggedIn: true });
      return true;
    }
    return false;
  },

  updateUser: async (user) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
