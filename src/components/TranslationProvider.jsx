'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/config';

export default function TranslationProvider({ children }) {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language, mounted]);

  // Prevent hydration mismatch:
  // The server renders 'en' by default. The client uses 'localStorage' which might be 'ar'.
  // By waiting for 'mounted', we ensure we only render the content once the client is ready
  // and has determined the correct language.
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
