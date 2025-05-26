// src/store/topstore.js
import { create } from 'zustand';

const useTopStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useTopStore;
