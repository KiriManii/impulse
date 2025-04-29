import React from 'react';
import { motion } from 'framer-motion';
import useFunnelStore from '../../stores/funnelStore';
import useSimulationStore from '../../stores/simulationStore';

function FunnelVisualization() {
  const getActiveFunnel = useFunnelStore(state => state.getActiveFunnel);
  const { isRunning } = useSimulationStore();
  
  const funnel = getActiveFunnel();
  
  if (!funnel) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Select a funnel to visualize</p>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-6">{funnel.name || 'Funnel Visualization'}</h3>
      
      <div className="relative">
        {funnel.steps.map((step, index) => (
          <div key={step.id} className="mb-10 relative">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center mr-3">
                {index + 1}
              </div>
              <h4 className="font-medium text-lg">{step.name}</h4>
            </div>
            
            <div className="ml-5 pl-10 border-l-2 border-gray-200">
              <div className="bg-gray-50 rounded-lg p-4 min-h-[100px]">
                <div className="mb-2 flex justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Step Type: <span className="capitalize">{step.type}</span>
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    Friction: {step.friction}/10
                  </span>
                </div>
                
                {step.abandonmentTriggers.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Potential Issues:</h5>
                    <ul className="text-sm text-gray-600">
                      {step.abandonmentTriggers.map((trigger, i) => (
                        <li key={i} className="flex items-center mb-1">
                          {trigger.type === 'price' && '💸'}
                          {trigger.type === 'ux' && '🤔'}
                          {trigger.type === 'trust' && '🔒'}
                          {trigger.type === 'technical' && '⚙️'}
                          {trigger.type === 'distraction' && '👀'}
                          <span className="ml-2 capitalize">
                            {trigger.type} ({Math.round(trigger.probability * 100)}% chance)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {isRunning && (
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                    <div className="flex items-center space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-primary-500 rounded-full"
                          animate={{
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {index < funnel.steps.length - 1 && (
              <div className="absolute left-5 ml-[1px] h-[30px] border-l-2 border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FunnelVisualization;