import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import i18n from '../languageConfig/i18n'; // pastikan path ke file i18n kamu benar

const useStore = create(
  persist(
    (set, get) => ({
      customerid: null,
      hasPin: false,
      pendingRoute: null,
      locationId: null,
      profileImage: null, 
      lang: 'en',
      hasOnboarding: false,
      token: false,

      selectedProducts: [],

      customerDetails: {
        fullname: null,
        email: null,
        phone: null,
        gender: null,
        dateofbirth: null,
        locationCustomerRegister: null,
        token: null
      },

      // Reminder list
      reminders: [],

      // Setters
      setCustomerId: (id) => set({ customerid: id }),
      setHasPin: (status) => set({ hasPin: status }),
      setPendingRoute: (route) => set({ pendingRoute: route }),
      clearPendingRoute: () => set({ pendingRoute: null }),
      setLocationId: (id) => set({ locationId: id }),
      setHasOnboarding: (status) => set({ hasOnboarding: status }),
      setToken: (token) => set({ token: token }),
      setSelectedProducts: (products: any[]) => set({ selectedProducts: products }),
      addSelectedProduct: (product: any) => set((state) => ({ selectedProducts: [...state.selectedProducts, product] })),
      removeSelectedProduct: (id: number) =>set((state) => ({selectedProducts: state.selectedProducts.filter((i) => i.id !== id),})),
      clearSelectedProducts: () => set({ selectedProducts: [] }),
      clearCustomerId: () =>
        set({
          customerid: null,
          hasPin: false,
          pendingRoute: null,
          customerDetails: {
            fullname: null,
            email: null,
            phone: null,
            gender: null,
            dateofbirth: null,
            locationCustomerRegister: null,
            token: null
          },
        }),

      // Language
      setLang: async (newLang) => {
        await i18n.changeLanguage(newLang);
        set({ lang: newLang });
      },

      setCustomerDetails: (details) =>
        set((state) => ({
          customerDetails: {
            ...state.customerDetails,
            ...details,
          },
        })),

      // Reminder actions
      addReminder: (bookingId) =>
        set((state) => ({
          reminders: [...state.reminders, bookingId],
        })),

      setProfileImage: (image) => set({ profileImage: image }),

      removeReminder: (bookingId) =>
        set((state) => ({
          reminders: state.reminders.filter((id) => id !== bookingId),
        })),

        clearProfileImage: () => set({ profileImage: null }),

      isReminderActive: (bookingId) =>
        get().reminders.includes(bookingId),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
