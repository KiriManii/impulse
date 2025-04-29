import React, { useState } from 'react';
import { motion } from 'framer-motion';
import usePersonaStore from '../../stores/personaStore';
import { generateId } from '../../utils/idGenerator';

function PersonaCreator() {
  const addPersona = usePersonaStore(state => state.addPersona);
  
  const [persona, setPersona] = useState({
    name: '',
    emoji: '😀',
    mood: 'curious',
    intent: 'browsing',
    budget: 'medium',
    urgency: 'medium',
    techSavviness: 'medium',
    patience: 5,
    distractionProne: 5
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersona(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setPersona(prev => ({ ...prev, [name]: parseInt(value) }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newPersona = {
      ...persona,
      id: generateId()
    };
    addPersona(newPersona);
    // Reset form or navigate away
  };
  
  const moodEmojis = {
    excited: '😍',
    curious: '🤔',
    hesitant: '😐',
    impatient: '😤'
  };
  
  // Update emoji based on mood
  const updateEmoji = (mood) => {
    setPersona(prev => ({ ...prev, mood, emoji: moodEmojis[mood] }));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6">Create Buyer Persona</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card mb-6">
          <div className="flex items-center mb-6">
            <div className="text-6xl mr-4">{persona.emoji}</div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Persona Name
              </label>
              <input
                type="text"
                name="name"
                value={persona.name}
                onChange={handleChange}
                placeholder="e.g., Eager Emma, Budget Bob..."
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => updateEmoji(mood)}
                    className={`flex items-center justify-center p-3 rounded-md border ${
                      persona.mood === mood 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mr-2">{emoji}</span>
                    <span className="capitalize">{mood}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shopping Intent
              </label>
              <select
                name="intent"
                value={persona.intent}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="browsing">Just Browsing</option>
                <option value="research">Researching Options</option>
                <option value="immediate purchase">Ready to Buy</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Behavior Traits</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Budget Level
                </label>
                <span className="text-sm text-gray-500 capitalize">{persona.budget}</span>
              </div>
              <select
                name="budget"
                value={persona.budget}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low - Very Price Sensitive</option>
                <option value="medium">Medium - Considers Value</option>
                <option value="high">High - Quality Focused</option>
              </select>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Tech Savviness
                </label>
                <span className="text-sm text-gray-500 capitalize">{persona.techSavviness}</span>
              </div>
              <select
                name="techSavviness"
                value={persona.techSavviness}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low - Struggles with Technology</option>
                <option value="medium">Medium - Average Tech Skills</option>
                <option value="high">High - Tech Expert</option>
              </select>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Purchase Urgency
                </label>
                <span className="text-sm text-gray-500 capitalize">{persona.urgency}</span>
              </div>
              <select
                name="urgency"
                value={persona.urgency}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low - No Rush</option>
                <option value="medium">Medium - Somewhat Soon</option>
                <option value="high">High - Need it ASAP</option>
              </select>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Patience Level (1-10)
                </label>
                <span className="text-sm text-gray-500">{persona.patience}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                name="patience"
                value={persona.patience}
                onChange={handleRangeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Impatient</span>
                <span>Very Patient</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  Distraction Prone (1-10)
                </label>
                <span className="text-sm text-gray-500">{persona.distractionProne}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                name="distractionProne"
                value={persona.distractionProne}
                onChange={handleRangeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Focused</span>
                <span>Easily Distracted</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button type="button" className="btn bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Persona
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default PersonaCreator;