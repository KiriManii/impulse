import { create } from 'zustand';

const useSimulationStore = create((set) => ({
  isRunning: false,
  speed: 1, // 0.5-2x simulation speed
  customerCount: 10, // Number of customers to simulate
  completions: 0,
  abandonments: [], // Array of {stepId, reason, personaId, timestamp}
  
  startSimulation: () => set({ isRunning: true, completions: 0, abandonments: [] }),
  stopSimulation: () => set({ isRunning: false }),
  setSpeed: (speed) => set({ speed }),
  setCustomerCount: (count) => set({ customerCount: count }),
  
  recordCompletion: () => set(state => ({ completions: state.completions + 1 })),
  recordAbandonment: (abandonment) => set(state => ({ 
    abandonments: [...state.abandonments, abandonment] 
  })),
}));

export default useSimulationStore;