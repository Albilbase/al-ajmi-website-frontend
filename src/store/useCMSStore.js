import { create } from 'zustand';
import { getAllSectionsAPI } from '../lib/api';

const useCMSStore = create((set, get) => ({
  sections: [],
  isLoading: false,
  error: null,

  // Fetch all sections and store them
  fetchAllSections: async (force = false) => {
    const { sections, isLoading } = get();
    // Guard: Prevent redundant calls
    if (!force && (sections.length > 0 || isLoading)) return;

    set({ isLoading: true, error: null });
    try {
      const response = await getAllSectionsAPI();
      // Most APIs return { status: 200, data: [...] }
      const data = response?.data || response || [];
      set({ sections: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      console.error("Error fetching all CMS sections:", error);
    }
  },

  // Selector-like function to get sections by key
  getSectionByKey: (sectionKey) => {
    return (get().sections || []).filter(section => section.section_key === sectionKey);
  },

  // Force refresh specific data if needed
  refreshSections: async () => {
    await get().fetchAllSections(true);
  }
}));

export default useCMSStore;
