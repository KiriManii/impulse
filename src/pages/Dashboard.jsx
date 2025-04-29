import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PersonaList from '../components/personas/PersonaList';
import FunnelList from '../components/funnel/FunnelList';
import SimulationControls from '../components/shared/SimulationControls';
import usePersonaStore from '../stores/personaStore';
import useFunnelStore from '../stores/funnelStore';
import { defaultPersonas } from '../data/defaultPersonas';
import { defaultFunnels } from '../data/defaultFunnels';
import { generateId } from '../utils/idGenerator';

function Dashboard() {
  const { personas, addPersona } = usePersonaStore();
  const { funnels, addFunnel } = useFunnelStore();
  const initialized = useRef(false);
  
  // Load default data if stores are empty - ONLY ONCE
  useEffect(() => {
    if (initialized.current) return;
    
    if (personas.length === 0) {
      defaultPersonas.forEach(persona => {
        // Create a fresh copy with unique ID for each persona
        const uniquePersona = {
          ...persona,
          id: `persona-${persona.name.toLowerCase().replace(/\s+/g, '-')}-${generateId()}`
        };
        addPersona(uniquePersona);
      });
    }
    
    if (funnels.length === 0) {
      defaultFunnels.forEach(funnel => {
        // Create a fresh copy with unique IDs for funnel and steps
        const uniqueFunnel = {
          ...funnel,
          id: `funnel-${funnel.name.toLowerCase().replace(/\s+/g, '-')}-${generateId()}`,
          steps: funnel.steps.map(step => ({
            ...step,
            id: `step-${step.type}-${generateId()}`
          }))
        };
        addFunnel(uniqueFunnel);
      });
    }
    
    initialized.current = true;
  }, []);
  
  return (
    <div className="max-w-6xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-indigo-800"
      >
        Impulse Dashboard
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-700">Buyer Personas</h2>
              <Link to="/personas/new" className="btn btn-primary text-sm py-1">
                + Create New
              </Link>
            </div>
            <PersonaList />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-700">Sales Funnels</h2>
              <Link to="/funnels/new" className="btn btn-primary text-sm py-1">
                + Create New
              </Link>
            </div>
            <FunnelList />
          </motion.div>
        </div>
        
        <div>
          <SimulationControls />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="card mt-6 bg-gradient-to-br from-white to-indigo-50"
          >
            <h3 className="text-lg font-semibold mb-4 text-indigo-700">Quick Stats</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Personas</div>
                <div className="text-2xl font-semibold">{personas.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Funnels</div>
                <div className="text-2xl font-semibold">{funnels.length}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Simulation</div>
                <div className="text-lg">Not run yet</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;