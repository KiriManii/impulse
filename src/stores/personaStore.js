import { create } from 'zustand';

const usePersonaStore = create((set) => ({
  personas: [],
  activePesonaId: null,
  
  addPersona: (persona) => set((state) => ({ 
    personas: [...state.personas, persona],
    activePersonaId: persona.id
  })),
  
  removePersona: (id) => set((state) => ({ 
    personas: state.personas.filter(p => p.id !== id),
    activePersonaId: state.activePersonaId === id ? null : state.activePersonaId
  })),
  
  setActivePersona: (id) => set({ activePersonaId: id }),
  
  getActivePersona: (state) => state.personas.find(p => p.id === state.activePersonaId),
}));

export default usePersonaStore;