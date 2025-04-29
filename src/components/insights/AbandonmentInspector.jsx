import React from 'react';
import { motion } from 'framer-motion';
import useSimulationStore from '../../stores/simulationStore';
import useFunnelStore from '../../stores/funnelStore';
import usePersonaStore from '../../stores/personaStore';

function AbandonmentInspector() {
  const { abandonments } = useSimulationStore();
  const { funnels } = useFunnelStore();
  const { personas } = usePersonaStore();
  
  if (abandonments.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Abandonment Inspector</h3>
        <div className="text-center py-8 text-gray-500">
          No abandonment data available. Run a simulation first.
        </div>
      </div>
    );
  }
  
  // Get step details for each abandonment
  const abandonmentDetails = abandonments.map(abandonment => {
    const funnel = funnels.find(f => 
      f.steps.some(s => s.id === abandonment.stepId)
    );
    
    const step = funnel?.steps.find(s => s.id === abandonment.stepId);
    const persona = personas.find(p => p.id === abandonment.personaId);
    
    return {
      ...abandonment,
      step,
      persona,
      funnelName: funnel?.name || 'Unknown Funnel'
    };
  }).filter(a => a.step && a.persona);
  
  // Group by reason
  const reasonGroups = {};
  abandonmentDetails.forEach(detail => {
    if (!reasonGroups[detail.reason]) {
      reasonGroups[detail.reason] = [];
    }
    reasonGroups[detail.reason].push(detail);
  });
  
  const reasonEmojis = {
    price: '💸',
    ux: '🤔',
    trust: '🔒',
    technical: '⚙️',
    distraction: '👀'
  };
  
  const reasonMessages = {
    price: 'Too expensive! Customers left when seeing prices.',
    ux: 'Confusing experience. Your design might need work.',
    trust: 'Trust issues. Customers didn\'t feel secure.',
    technical: 'Technical problems caused customers to leave.',
    distraction: 'Customers got distracted and bounced.'
  };
  
  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Abandonment Inspector</h3>
      
      <div className="space-y-6">
        {Object.entries(reasonGroups).map(([reason, details]) => (
          <motion.div
            key={reason}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-gray-50"
          >
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">{reasonEmojis[reason] || '❓'}</span>
              <h4 className="text-lg font-medium capitalize">{reason} Issues</h4>
              <span className="ml-auto bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                {details.length} {details.length === 1 ? 'customer' : 'customers'}
              </span>
            </div>
            
            <p className="text-gray-700 mb-3">{reasonMessages[reason] || 'Customers left your funnel.'}</p>
            
            <div className="space-y-2">
              {details.slice(0, 3).map((detail, index) => (
                <div key={index} className="text-sm p-2 bg-white rounded border border-gray-200">
                  <div className="flex items-center">
                    <span className="mr-1">{detail.persona.emoji}</span>
                    <span className="font-medium">{detail.persona.name}</span>
                    <span className="mx-2 text-gray-400">left at</span>
                    <span>{detail.step.name}</span>
                  </div>
                </div>
              ))}
              
              {details.length > 3 && (
                <div className="text-sm text-gray-500 text-center">
                  + {details.length - 3} more similar abandonments
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default AbandonmentInspector;