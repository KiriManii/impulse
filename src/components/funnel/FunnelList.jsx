import React from 'react';
import { motion } from 'framer-motion';
import useFunnelStore from '../../stores/funnelStore';

function FunnelList() {
  const { funnels, activeFunnelId, setActiveFunnel, removeFunnel } = useFunnelStore();
  
  if (funnels.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🛒</div>
        <h3 className="text-xl font-medium mb-2">No funnels yet</h3>
        <p className="text-gray-500 mb-4">Create your first sales funnel to start simulating customer journeys.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {funnels.map((funnel, index) => (
        <motion.div
          key={funnel.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`card cursor-pointer hover:shadow-lg transition-shadow ${
            activeFunnelId === funnel.id ? 'ring-2 ring-primary-500' : ''
          }`}
          onClick={() => setActiveFunnel(funnel.id)}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">{funnel.name || 'Unnamed Funnel'}</h3>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeFunnel(funnel.id);
              }}
              className="text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">
              {funnel.steps.length} steps
            </div>
            
            <div className="flex items-center">
              {funnel.steps.map((step, i) => (
                <React.Fragment key={step.id}>
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                    {step.type === 'landing' && '🏠'}
                    {step.type === 'product' && '🛍️'}
                    {step.type === 'cart' && '🛒'}
                    {step.type === 'checkout' && '💳'}
                    {step.type === 'confirmation' && '✅'}
                  </div>
                  {i < funnel.steps.length - 1 && (
                    <div className="flex-grow h-1 bg-gray-200 mx-1"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default FunnelList;