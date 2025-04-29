import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FunnelVisualization from '../components/funnel/FunnelVisualization';
import FunnelSimulator from '../components/funnel/FunnelSimulator';
import SimulationControls from '../components/shared/SimulationControls';
import useFunnelStore from '../stores/funnelStore';
import usePersonaStore from '../stores/personaStore';
import useSimulationStore from '../stores/simulationStore';

function FunnelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { funnels, setActiveFunnel } = useFunnelStore();
  const { personas, activePersonaId, setActivePersona } = usePersonaStore();
  const { isRunning, abandonments, completions } = useSimulationStore();
  
  // Set active funnel when component mounts
  useEffect(() => {
    const funnel = funnels.find(f => f.id === id);
    if (funnel) {
      setActiveFunnel(id);
    } else {
      navigate('/');
    }
  }, [id, funnels, setActiveFunnel, navigate]);
  
  const handlePersonaChange = (e) => {
    setActivePersona(e.target.value);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-bold">Funnel Simulation</h1>
        <div className="space-x-3">
          <button 
            onClick={() => navigate(`/funnels/${id}/insights`)}
            className="btn btn-primary"
            disabled={abandonments.length === 0 && completions === 0}
          >
            View Insights
          </button>
          <button 
            onClick={() => navigate('/')}
            className="btn bg-gray-200 hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FunnelVisualization />
        </div>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-semibold mb-4">Select Customer Persona</h3>
            
            {personas.length === 0 ? (
              <p className="text-gray-500">No personas available. Create one first.</p>
            ) : (
              <select
                value={activePersonaId || ''}
                onChange={handlePersonaChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isRunning}
              >
                <option value="" disabled>Select a persona</option>
                {personas.map(persona => (
                  <option key={persona.id} value={persona.id}>
                    {persona.emoji} {persona.name}
                  </option>
                ))}
              </select>
            )}
          </motion.div>
          
          <SimulationControls />
          
          {isRunning && (
            <FunnelSimulator />
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h3 className="text-lg font-semibold mb-4">Simulation Results</h3>
            
            {abandonments.length === 0 && completions === 0 ? (
              <p className="text-gray-500">No simulation data yet.</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Completion Rate</div>
                  <div className="text-2xl font-semibold">
                    {Math.round((completions / (completions + abandonments.length)) * 100)}%
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Abandonments by Reason</div>
                  <div className="space-y-2">
                    {Object.entries(abandonments.reduce((acc, abandon) => {
                      acc[abandon.reason] = (acc[abandon.reason] || 0) + 1;
                      return acc;
                    }, {})).map(([reason, count]) => (
                      <div key={reason} className="flex justify-between">
                        <span className="capitalize">
                          {reason === 'price' && '💸'}
                          {reason === 'ux' && '🤔'}
                          {reason === 'trust' && '🔒'}
                          {reason === 'technical' && '⚙️'}
                          {reason === 'distraction' && '👀'}
                          {' '}
                          {reason}
                        </span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default FunnelPage;