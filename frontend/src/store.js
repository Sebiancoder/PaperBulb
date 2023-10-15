import create from 'zustand';

const useStore = create((set) => ({
  nodes: [],
  edges: [],
  setNodes: (newNodes) => set({ nodes: newNodes }),
  setEdges: (newEdges) => set({ edges: newEdges }),
}));

export default useStore;
