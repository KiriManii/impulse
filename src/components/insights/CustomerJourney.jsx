import React from 'react';
import { motion } from 'framer-motion';
import useSimulationStore from '../../stores/simulationStore';
import useFunnelStore from '../../stores/funnelStore';

function CustomerJourney() {
  const { abandonments, completions } = useSimulationStore();
  const getActiveFunnel = useFunnelStore(state => state.getActiveFunnel);
  
  const funnel = getActiveFunnel();
  
  if (!funnel) {
    return <div className="text-gray-500">No funnel selected.</div>;
  }
  
  // Calculate drop-off numbers for each step
  const stepAbandonments = funnel.steps.map(step => {
    const count = abandonments.filter(a => a.stepId === step.id).length;
    return { 
      stepId: step.id, 
      count,
      reasons: abandonments
        .filter(a => a.stepId === step.id)
        .reduce((acc, abandon) => {
          acc[abandon.reason] = (acc[abandon.reason] || 0) + 1;
          return acc;
        }, {})
    };
  });
  
  // Total customers that entered the funnel
  const totalCustomers = completions + abandonments.length;
  
  // Calculate customers at each step
  let customersAtSteps = [];
  let remainingCustomers = totalCustomers;
  
  for (let i = 0; i < funnel.steps.length; i++) {
    customersAtSteps.push(remainingCustomers);
    remainingCustomers -= stepAbandonments[i].count;
  }
  
  // Find the max customers for scaling
  const maxCustomers = Math.max(...customersAtSteps, 1);
  
  // Calculate width percentage for each step
  const stepWidths = customersAtSteps.map(count => (count / maxCustomers) * 100);
  
  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-6">Customer Journey Visualization</h3>
      
      {totalCustomers === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Run a simulation to see the customer journey.
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            {funnel.steps.map((step, index) => (
              <div key={step.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{step.name}</span>
                  <span>{customersAtSteps[index]} customers</span>
                </div>
                
                <div className="h-12 bg-gray-100 rounded-lg relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stepWidths[index]}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-full bg-primary-100 absolute left-0 top-0"
                  />
                  
                  <div className="absolute inset-0 flex items-center px-4">
                    {stepAbandonments[index].count > 0 && (
                      <div className="z-10 flex items-center">
                        <span className="text-red-500 font-bold mr-1">-{stepAbandonments[index].count}</span>
                        <span className="text-sm">
                          {Object.entries(stepAbandonments[index].reasons).map(([reason, count], i) => (
                            <span key={reason} className="inline-flex items-center mr-2">
                              {reason === 'price' && '💸'}
                              {reason === 'ux' && '🤔'}
                              {reason === 'trust' && '🔒'}
                              {reason === 'technical' && '⚙️'}
                              {reason === 'distraction' && '👀'}
                              {count > 1 && <span className="text-xs ml-1">x{count}</span>}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between font-medium">
              <span>Started:</span>
              <span>{totalCustomers} customers</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Completed:</span>
              <span className="text-green-600">{completions} customers ({Math.round((completions / totalCustomers) * 100)}%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerJourney;