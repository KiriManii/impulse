import { create } from 'zustand';

const useFunnelStore = create((set, get) => ({
  funnels: [],
  activeFunnelId: null,
  
  addFunnel: (funnel) => set((state) => ({ 
    funnels: [...state.funnels, funnel],
    activeFunnelId: funnel.id
  })),
  
  removeFunnel: (id) => set((state) => ({ 
    funnels: state.funnels.filter(f => f.id !== id),
    activeFunnelId: state.activeFunnelId === id ? null : state.activeFunnelId
  })),
  
  setActiveFunnel: (id) => set({ activeFunnelId: id }),
  
  getActiveFunnel: (state) => state.funnels.find(f => f.id === state.activeFunnelId),
  
  updateFunnelStep: (funnelId, stepId, updates) => set((state) => {
    const funnelIndex = state.funnels.findIndex(f => f.id === funnelId);
    if (funnelIndex === -1) return state;
    
    const funnel = state.funnels[funnelIndex];
    const stepIndex = funnel.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return state;
    
    const updatedSteps = [...funnel.steps];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], ...updates };
    
    const updatedFunnels = [...state.funnels];
    updatedFunnels[funnelIndex] = { ...funnel, steps: updatedSteps };
    
    return { funnels: updatedFunnels };
  }),
}));

export default useFunnelStore;