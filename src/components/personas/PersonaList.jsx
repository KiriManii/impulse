import React from 'react';
import { motion } from 'framer-motion';
import usePersonaStore from '../../stores/personaStore';

function PersonaList() {
  const { personas, activePersonaId, setActivePersona, removePersona } = usePersonaStore();
  
  if (personas.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">👤</div>
        <h3 className="text-xl font-medium mb-2">No personas yet</h3>
        <p className="text-gray-500 mb-4">Create your first buyer persona to start simulating customer behavior.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {personas.map((persona, index) => (
        <motion.div
          key={persona.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`card cursor-pointer hover:shadow-lg transition-shadow ${
            activePersonaId === persona.id ? 'ring-2 ring-primary-500' : ''
          }`}
          onClick={() => setActivePersona(persona.id)}
        >
          <div className="flex items-start">
            <div className="text-4xl mr-3">{persona.emoji}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{persona.name}</h3>
              <p className="text-sm text-gray-500 capitalize">
                {persona.mood}, {persona.intent}
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removePersona(persona.id);
              }}
              className="text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Budget:</span>
              <span className="capitalize font-medium">{persona.budget}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Urgency:</span>
              <span className="capitalize font-medium">{persona.urgency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tech Savvy:</span>
              <span className="capitalize font-medium">{persona.techSavviness}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Patience:</span>
              <span className="font-medium">{persona.patience}/10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Distraction:</span>
              <span className="font-medium">{persona.distractionProne}/10</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default PersonaList;