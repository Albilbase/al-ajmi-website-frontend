'use client';

import i18n from 'i18next'; // Import i18next
import { initReactI18next } from 'react-i18next'; // Import react-i18next
import LanguageDetector from 'i18next-browser-languagedetector'; // Import language detector

import enTranslation from './locales/en.json'; // Import English translation
import arTranslation from './locales/ar.json'; // Import Arabic translation

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage']
    }
  });

export default i18n;
