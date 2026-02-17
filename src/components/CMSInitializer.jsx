'use client';

import { useEffect } from 'react';
import useCMSStore from '@/store/useCMSStore';

export default function CMSInitializer({ children }) {
  const fetchAllSections = useCMSStore((state) => state.fetchAllSections);

  useEffect(() => {
    fetchAllSections();
  }, [fetchAllSections]);

  return <>{children}</>;
}
