import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      customerid: null,
      hasPin: false,
      pendingRoute: null, // tambah ini

      setCustomerId: (id) => set({ customerid: id }),
      setHasPin: (status) => set({ hasPin: status }),
      setPendingRoute: (route) => set({ pendingRoute: route }), // tambah setter ini
      clearPendingRoute: () => set({ pendingRoute: null }), // optional, clear setelah navigasi
      clearCustomerId: () => set({ customerid: null, hasPin: false, pendingRoute: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
