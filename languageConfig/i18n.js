// i18n.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import file bahasa
import en from '../locales/en.json';
import id from '../locales/id.json';
import zh from '../locales/zh.json';

// Async function to get saved language from AsyncStorage
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      const savedLang = await AsyncStorage.getItem('user-storage');
      if (savedLang) {
        const parsed = JSON.parse(savedLang);
        const lang = parsed.state?.lang || 'en';
        return callback(lang);
      }
    } catch (e) {
      console.log('Failed to load language from storage', e);
    }
    callback('en'); // fallback default
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React sudah handle XSS
    },
    resources: {
      en: { translation: en },
      id: { translation: id },
      zh: { translation: zh },
    },
  });

export default i18n;
