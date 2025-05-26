import {create} from 'zustand';

const useStore = create((set, get) => ({
  // State
  workspaces: [],
  selectedWorkspace: null,
  pages: [],
  loading: false,
  selectedPageId: null,

  // Setters
  setSelectedPageId: (page) => set({ selectedPageId: page }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setSelectedWorkspace: (workspace) => set({ selectedWorkspace: workspace }),
  setPages: (pages) => set({ pages }),
  setLoading: (loading) => set({ loading }),

  // Add workspace and auto-select it
  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
      selectedWorkspace: workspace,
    })),

  // Update workspace by id and if selected, update selectedWorkspace too
  updateWorkspace: (updatedWorkspace) =>
    set((state) => {
      const workspaces = state.workspaces.map((w) =>
        w._id === updatedWorkspace._id ? updatedWorkspace : w
      );
      const selectedWorkspace =
        state.selectedWorkspace && state.selectedWorkspace._id === updatedWorkspace._id
          ? updatedWorkspace
          : state.selectedWorkspace;
      return { workspaces, selectedWorkspace };
    }),

  // Remove workspace by id and update selection
  removeWorkspace: (workspaceId) =>
    set((state) => {
      const workspaces = state.workspaces.filter((w) => w._id !== workspaceId);
      const selectedWorkspace =
        state.selectedWorkspace && state.selectedWorkspace._id === workspaceId
          ? workspaces[0] || null
          : state.selectedWorkspace;
      return { workspaces, selectedWorkspace };
    }),

  // Add page
  addPage: (page) =>
    set((state) => ({
      pages: [...state.pages, page],
    })),

  // Update pages array (e.g., after fetch or reset)
  updatePages: (pages) => set({ pages }),

  // Remove page by id
  removePage: (pageId) =>
    set((state) => ({
      pages: state.pages.filter((p) => p._id !== pageId),
    })),
    // Clear all pages
    resetStore: () =>
    set({
      pages: [],
      workspaces: [],
      selectedWorkspace: null,
    }),  
    setWorkspacePlan: (id, plan) => set((state) => {
      const updated = state.workspaces.map((w) =>
        w._id === id ? { ...w, plan } : w
      );
      return { workspaces: updated };
    }),

    blocks: [],              // add blocks array
  setBlocks: (blocks) => set({ blocks }),

  updateBlock: (updatedBlock) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b._id === updatedBlock._id ? updatedBlock : b
      ),
    })),

  addBlock: (newBlock) =>
    set((state) => ({
      blocks: [...state.blocks, newBlock],
    })),
}));

export default useStore;
