import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      customerid: null,
      hasPin: false,

      setCustomerId: (id) => set({ customerid: id }),
      setHasPin: (status) => set({ hasPin: status }),
      clearCustomerId: () => set({ customerid: null, hasPin: false }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage), // ✅ ini penting
    }
  )
);

export default useStore;
