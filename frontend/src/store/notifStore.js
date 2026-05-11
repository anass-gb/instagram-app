import { create } from 'zustand';
import { notifService } from '../services/apiServices';

const useNotifStore = create((set) => ({
  notifications: [],
  unreadCount:   0,

  fetch:        async () => {
    const { data } = await notifService.getAll().catch(() => ({ data: [] }));
    set({ notifications: data });
  },
  fetchUnread:  async () => {
    const { data } = await notifService.unreadCount().catch(() => ({ data: { unread: 0 } }));
    set({ unreadCount: data.unread });
  },
  markAllRead:  async () => {
    await notifService.readAll().catch(() => {});
    set({ unreadCount: 0 });
  },
}));

export default useNotifStore;
