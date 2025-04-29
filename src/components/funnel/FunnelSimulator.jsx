import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePersonaStore from '../../stores/personaStore';
import useFunnelStore from '../../stores/funnelStore';
import useSimulationStore from '../../stores/simulationStore';
import { generateId } from '../../utils/idGenerator';

function FunnelSimulator() {
  const getActivePersona = usePersonaStore(state => state.getActivePersona);
  const getActiveFunnel = useFunnelStore(state => state.getActiveFunnel);
  const { 
    isRunning, 
    speed, 
    customerCount, 
    recordCompletion, 
    recordAbandonment 
  } = useSimulationStore();
  
  const [customers, setCustomers] = useState([]);
  
  const persona = getActivePersona();
  const funnel = getActiveFunnel();
  
  // Calculate if a customer abandons at a step
  const calculateAbandonment = (step, customerPersona) => {
    if (!step.abandonmentTriggers || step.abandonmentTriggers.length === 0) {
      return { abandoned: false };
    }
    
    for (const trigger of step.abandonmentTriggers) {
      let baseProbability = trigger.probability;
      
      // Adjust probability based on persona traits
      if (trigger.impactedBy && trigger.impactedBy.length > 0) {
        for (const trait of trigger.impactedBy) {
          if (trait === 'patience' && customerPersona.patience < 5) {
            baseProbability += (5 - customerPersona.patience) * 0.05;
          }
          if (trait === 'budget' && customerPersona.budget === 'low' && trigger.type === 'price') {
            baseProbability += 0.2;
          }
          if (trait === 'techSavviness' && customerPersona.techSavviness === 'low' && trigger.type === 'technical') {
            baseProbability += 0.15;
          }
          if (trait === 'distractionProne' && customerPersona.distractionProne > 5 && trigger.type === 'distraction') {
            baseProbability += (customerPersona.distractionProne - 5) * 0.05;
          }
        }
      }
      
      // Cap probability at 0.9
      const finalProbability = Math.min(baseProbability, 0.9);
      
      if (Math.random() < finalProbability) {
        return { 
          abandoned: true, 
          reason: trigger.type 
        };
      }
    }
    
    return { abandoned: false };
  };
  
  // Generate a new customer
  const generateCustomer = () => {
    if (!persona || !funnel) return null;
    
    return {
      id: generateId(),
      persona: { ...persona },
      currentStepIndex: 0,
      abandoned: false,
      abandonmentReason: null,
      completed: false,
      timeInStep: 0,
    };
  };
  
  // Start the simulation
  useEffect(() => {
    if (!isRunning || !persona || !funnel) return;
    
    // Generate initial batch of customers
    const initialCustomers = [];
    for (let i = 0; i < customerCount; i++) {
      const newCustomer = generateCustomer();
      if (newCustomer) {
        initialCustomers.push(newCustomer);
      }
    }
    
    setCustomers(initialCustomers);
    
    // Clear customers when simulation stops
    return () => {
      setCustomers([]);
    };
  }, [isRunning, persona, funnel, customerCount]);
  
  // Progress simulation
  useEffect(() => {
    if (!isRunning || !funnel || customers.length === 0) return;
    
    const simulationInterval = setInterval(() => {
      setCustomers(prevCustomers => {
        return prevCustomers.map(customer => {
          // Skip customers who have already completed or abandoned
          if (customer.completed || customer.abandoned) {
            return customer;
          }
          
          // Increment time in step based on speed
          const newTimeInStep = customer.timeInStep + (speed * 0.1);
          
          // Check if customer should move to next step
          if (newTimeInStep >= 1) {
            const currentStep = funnel.steps[customer.currentStepIndex];
            const { abandoned, reason } = calculateAbandonment(currentStep, customer.persona);
            
            if (abandoned) {
              // Record abandonment
              recordAbandonment({
                stepId: currentStep.id,
                reason: reason,
                personaId: customer.persona.id,
                timestamp: Date.now()
              });
              
              return {
                ...customer,
                abandoned: true,
                abandonmentReason: reason,
                timeInStep: 0
              };
            } else if (customer.currentStepIndex === funnel.steps.length - 1) {
              // Customer completed the funnel
              recordCompletion();
              
              return {
                ...customer,
                completed: true,
                timeInStep: 0
              };
            } else {
              // Move to next step
              return {
                ...customer,
                currentStepIndex: customer.currentStepIndex + 1,
                timeInStep: 0
              };
            }
          }
          
          // Stay in current step
          return {
            ...customer,
            timeInStep: newTimeInStep
          };
        });
      });
    }, 100); // Update every 100ms
    
    return () => clearInterval(simulationInterval);
  }, [isRunning, funnel, customers, speed, recordCompletion, recordAbandonment]);
  
  if (!isRunning || !persona || !funnel) {
    return null;
  }
  
  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-10">
      <div className="card bg-white shadow-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-3">Simulation Running</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Active Customers:</span>
            <span>{customers.filter(c => !c.completed && !c.abandoned).length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Completed:</span>
            <span>{customers.filter(c => c.completed).length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Abandoned:</span>
            <span>{customers.filter(c => c.abandoned).length}</span>
          </div>
        </div>
        
        <div className="h-[40px] mt-3 flex items-center overflow-hidden">
          <AnimatePresence>
            {customers.map(customer => {
              if (customer.abandoned || customer.completed) return null;
              
              const currentStep = funnel.steps[customer.currentStepIndex];
              return (
                <motion.div
                  key={customer.id}
                  className="flex-shrink-0 mr-2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-100">
                    <span>{customer.persona.emoji}</span>
                  </div>
                  <div className="text-xs text-center mt-1 w-8 truncate">
                    {currentStep.type.slice(0, 4)}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default FunnelSimulator;