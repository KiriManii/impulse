import React from 'react';
import { motion } from 'framer-motion';
import useSimulationStore from '../../stores/simulationStore';

function SimulationControls() {
  const { 
    isRunning, 
    speed, 
    customerCount, 
    startSimulation, 
    stopSimulation,
    setSpeed,
    setCustomerCount
  } = useSimulationStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-lg font-semibold mb-4">Simulation Controls</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">
              Number of Customers
            </label>
            <span className="text-sm text-gray-500">{customerCount}</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={customerCount}
            onChange={(e) => setCustomerCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={isRunning}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">
              Simulation Speed
            </label>
            <span className="text-sm text-gray-500">{speed}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Slower</span>
            <span>Faster</span>
          </div>
        </div>
        
        <div className="flex justify-center pt-2">
          {!isRunning ? (
            <button
              onClick={startSimulation}
              className="btn btn-primary w-full"
            >
              Start Simulation
            </button>
          ) : (
            <button
              onClick={stopSimulation}
              className="btn bg-red-500 hover:bg-red-600 text-white w-full"
            >
              Stop Simulation
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default SimulationControls;