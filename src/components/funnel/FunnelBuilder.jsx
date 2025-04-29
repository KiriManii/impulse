import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useFunnelStore from '../../stores/funnelStore';
import { generateId } from '../../utils/idGenerator';

function FunnelBuilder() {
  const addFunnel = useFunnelStore(state => state.addFunnel);
  
  const [funnel, setFunnel] = useState({
    name: '',
    steps: [
      {
        id: `step-landing-${generateId()}`,
        name: 'Landing Page',
        type: 'landing',
        friction: 3,
        abandonmentTriggers: [
          {
            type: 'ux',
            probability: 0.1,
            impactedBy: ['patience', 'techSavviness']
          }
        ]
      }
    ]
  });
  
  const handleFunnelNameChange = (e) => {
    setFunnel(prev => ({ ...prev, name: e.target.value }));
  };
  
  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...funnel.steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setFunnel(prev => ({ ...prev, steps: updatedSteps }));
  };
  
  const addStep = () => {
    const stepTypes = ['landing', 'product', 'cart', 'checkout', 'confirmation'];
    const currentTypesCount = funnel.steps.reduce((acc, step) => {
      acc[step.type] = (acc[step.type] || 0) + 1;
      return acc;
    }, {});
    
    // Find the first type that isn't used or has the fewest occurrences
    const nextType = stepTypes.reduce((selected, type) => {
      if (!currentTypesCount[type]) return type;
      if (!selected || currentTypesCount[type] < currentTypesCount[selected]) {
        return type;
      }
      return selected;
    }, null);
    
    const newStep = {
      id: `step-${nextType}-${generateId()}`,
      name: `New ${nextType.charAt(0).toUpperCase() + nextType.slice(1)} Step`,
      type: nextType,
      friction: 3,
      abandonmentTriggers: []
    };
    
    setFunnel(prev => ({ 
      ...prev, 
      steps: [...prev.steps, newStep]
    }));
  };
  
  const removeStep = (index) => {
    if (funnel.steps.length <= 1) return; // Prevent removing the last step
    
    const updatedSteps = funnel.steps.filter((_, i) => i !== index);
    setFunnel(prev => ({ ...prev, steps: updatedSteps }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newFunnel = {
      ...funnel,
      id: `funnel-${generateId()}`
    };
    addFunnel(newFunnel);
    // Reset form or navigate away
  };
  
  const stepTypeLabels = {
    landing: 'Landing Page',
    product: 'Product Page',
    cart: 'Shopping Cart',
    checkout: 'Checkout',
    confirmation: 'Confirmation'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-indigo-800">Create Sales Funnel</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card bg-gradient-to-br from-white to-indigo-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Funnel Name
          </label>
          <input
            type="text"
            value={funnel.name}
            onChange={handleFunnelNameChange}
            placeholder="e.g., Product Launch, Holiday Sale..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-indigo-700">Funnel Steps</h3>
            <button 
              type="button" 
              onClick={addStep}
              className="btn btn-primary text-sm py-1"
            >
              + Add Step
            </button>
          </div>
          
          {funnel.steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card mb-4 bg-gradient-to-br from-white to-indigo-50"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-800 rounded-full mr-2">
                    {index + 1}
                  </span>
                  <h4 className="font-medium">{step.name}</h4>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeStep(index)}
                  className="text-gray-400 hover:text-red-500"
                  disabled={funnel.steps.length <= 1}
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Step Name
                  </label>
                  <input
                    type="text"
                    value={step.name}
                    onChange={(e) => handleStepChange(index, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Step Type
                  </label>
                  <select
                    value={step.type}
                    onChange={(e) => handleStepChange(index, 'type', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Object.entries(stepTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">
                      Friction Level (1-10)
                    </label>
                    <span className="text-sm text-gray-500">{step.friction}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={step.friction}
                    onChange={(e) => handleStepChange(index, 'friction', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Smooth</span>
                    <span>High Friction</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button type="button" className="btn bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Funnel
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default FunnelBuilder;