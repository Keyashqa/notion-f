import { create } from 'zustand';

const usePageStore = create((set) => ({
  selectedPage: null,
  setSelectedPageId: (pageId) => set({ selectedPage: pageId })
}));

export default usePageStore;