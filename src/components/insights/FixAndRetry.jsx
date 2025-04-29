import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useFunnelStore from '../../stores/funnelStore';
import useSimulationStore from '../../stores/simulationStore';
import { generateId } from '../../utils/idGenerator';

function FixAndRetry() {
  const { getActiveFunnel, updateFunnelStep } = useFunnelStore();
  const originalFunnel = getActiveFunnel();
  const { abandonments } = useSimulationStore();
  
  const [fixedFunnel, setFixedFunnel] = useState(null);
  const [selectedStepId, setSelectedStepId] = useState(null);
  
  // Initialize fixed funnel with a deep copy of the original
  useEffect(() => {
    if (originalFunnel) {
      // Create a deep copy of the funnel
      setFixedFunnel(JSON.parse(JSON.stringify(originalFunnel)));
      
      // Find the step with the most abandonments
      if (abandonments.length > 0) {
        const stepCounts = {};
        abandonments.forEach(a => {
          stepCounts[a.stepId] = (stepCounts[a.stepId] || 0) + 1;
        });
        
        const mostAbandonedStepId = Object.entries(stepCounts)
          .sort((a, b) => b[1] - a[1])[0][0];
          
        setSelectedStepId(mostAbandonedStepId);
      } else if (originalFunnel.steps.length > 0) {
        setSelectedStepId(originalFunnel.steps[0].id);
      }
    }
  }, [originalFunnel, abandonments]);
  
  if (!originalFunnel || !fixedFunnel) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Fix & Retry Sandbox</h3>
        <div className="text-center py-8 text-gray-500">
          Select a funnel to optimize.
        </div>
      </div>
    );
  }
  
  const selectedStep = fixedFunnel.steps.find(s => s.id === selectedStepId);
  
  // Get abandonments for the selected step
  const stepAbandonments = abandonments.filter(a => a.stepId === selectedStepId);
  
  // Group abandonments by reason
  const reasonCounts = stepAbandonments.reduce((acc, abandon) => {
    acc[abandon.reason] = (acc[abandon.reason] || 0) + 1;
    return acc;
  }, {});
  
  // Handle step selection
  const handleStepSelect = (stepId) => {
    setSelectedStepId(stepId);
  };
  
  // Handle friction level change
  const handleFrictionChange = (e) => {
    const newFriction = parseInt(e.target.value);
    const updatedSteps = fixedFunnel.steps.map(step => {
      if (step.id === selectedStepId) {
        return { ...step, friction: newFriction };
      }
      return step;
    });
    
    setFixedFunnel({ ...fixedFunnel, steps: updatedSteps });
  };
  
  // Handle adding or removing triggers
  const handleTriggerChange = (triggerType, probability) => {
    const updatedStep = { ...selectedStep };
    const existingTriggerIndex = updatedStep.abandonmentTriggers.findIndex(
      t => t.type === triggerType
    );
    
    if (existingTriggerIndex >= 0) {
      // Update existing trigger
      const updatedTriggers = [...updatedStep.abandonmentTriggers];
      
      if (probability <= 0) {
        // Remove trigger if probability is zero or negative
        updatedTriggers.splice(existingTriggerIndex, 1);
      } else {
        // Update probability
        updatedTriggers[existingTriggerIndex] = {
          ...updatedTriggers[existingTriggerIndex],
          probability: Math.min(probability, 0.9)
        };
      }
      
      updatedStep.abandonmentTriggers = updatedTriggers;
    } else if (probability > 0) {
      // Add new trigger
      updatedStep.abandonmentTriggers.push({
        type: triggerType,
        probability: Math.min(probability, 0.9),
        impactedBy: getDefaultImpactedBy(triggerType)
      });
    }
    
    // Update the step in the fixed funnel
    const updatedSteps = fixedFunnel.steps.map(step => {
      if (step.id === selectedStepId) {
        return updatedStep;
      }
      return step;
    });
    
    setFixedFunnel({ ...fixedFunnel, steps: updatedSteps });
  };
  
  // Get default impacted by attributes based on trigger type
  const getDefaultImpactedBy = (triggerType) => {
    switch (triggerType) {
      case 'price':
        return ['budget'];
      case 'ux':
        return ['patience', 'techSavviness'];
      case 'trust':
        return ['mood'];
      case 'technical':
        return ['techSavviness'];
      case 'distraction':
        return ['distractionProne'];
      default:
        return [];
    }
  };
  
  // Handle applying changes to the original funnel
  const handleApplyChanges = () => {
    const selectedStepIndex = originalFunnel.steps.findIndex(s => s.id === selectedStepId);
    if (selectedStepIndex >= 0) {
      const updatedStep = fixedFunnel.steps.find(s => s.id === selectedStepId);
      updateFunnelStep(originalFunnel.id, selectedStepId, updatedStep);
    }
  };
  
  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-6">Fix & Retry Sandbox</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Step to Optimize
        </label>
        <div className="flex overflow-x-auto pb-2 space-x-2">
          {fixedFunnel.steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepSelect(step.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-md text-sm ${
                selectedStepId === step.id
                  ? 'bg-primary-100 text-primary-800 font-medium'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {index + 1}. {step.name}
            </button>
          ))}
        </div>
      </div>
      
      {selectedStep && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">
                Friction Level
              </label>
              <span className="text-sm text-gray-500">{selectedStep.friction}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={selectedStep.friction}
              onChange={handleFrictionChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Smooth</span>
              <span>High Friction</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Abandonment Triggers</h4>
            
            <div className="space-y-3">
              {['price', 'ux', 'trust', 'technical', 'distraction'].map(triggerType => {
                const trigger = selectedStep.abandonmentTriggers.find(t => t.type === triggerType);
                const probability = trigger ? trigger.probability : 0;
                const count = reasonCounts[triggerType] || 0;
                
                return (
                  <div key={triggerType} className="flex items-center">
                    <div className="w-24 text-sm capitalize">
                      {triggerType === 'price' && '💸'}
                      {triggerType === 'ux' && '🤔'}
                      {triggerType === 'trust' && '🔒'}
                      {triggerType === 'technical' && '⚙️'}
                      {triggerType === 'distraction' && '👀'}
                      {' '}
                      {triggerType}
                    </div>
                    
                    <input
                      type="range"
                      min="0"
                      max="0.9"
                      step="0.05"
                      value={probability}
                      onChange={(e) => handleTriggerChange(triggerType, parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mx-2"
                    />
                    
                    <div className="w-16 text-right text-sm">
                      {Math.round(probability * 100)}%
                    </div>
                    
                    {count > 0 && (
                      <div className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                        {count}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t">
            <div>
              <div className="text-sm text-gray-500">Original Friction</div>
              <div>
                {originalFunnel.steps.find(s => s.id === selectedStepId)?.friction}/10
              </div>
            </div>
            
            <button
              onClick={handleApplyChanges}
              className="btn btn-primary"
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FixAndRetry;