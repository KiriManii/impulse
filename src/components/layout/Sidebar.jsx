import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePersonaStore from '../../stores/personaStore';
import useFunnelStore from '../../stores/funnelStore';

function Sidebar() {
  const location = useLocation();
  const personas = usePersonaStore(state => state.personas);
  const funnels = useFunnelStore(state => state.funnels);
  
  return (
    <motion.aside 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-64 h-full bg-white border-r border-gray-200 hidden md:block overflow-y-auto"
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Workspace</h2>
        
        <div className="space-y-6">
          <div>
            <Link 
              to="/" 
              className={`flex items-center p-2 rounded-md ${
                location.pathname === '/' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">📊</span>
              Dashboard
            </Link>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">BUYER PERSONAS</h3>
              <Link to="/personas/new" className="text-primary-600 text-sm">+</Link>
            </div>
            <ul className="space-y-1">
              {personas.map(persona => (
                <li key={persona.id}>
                  <Link
                    to={`/personas/${persona.id}`}
                    className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <span className="mr-2">{persona.emoji}</span>
                    {persona.name}
                  </Link>
                </li>
              ))}
              {personas.length === 0 && (
                <li className="text-sm text-gray-400 italic p-2">No personas yet</li>
              )}
            </ul>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">FUNNELS</h3>
              <Link to="/funnels/new" className="text-primary-600 text-sm">+</Link>
            </div>
            <ul className="space-y-1">
              {funnels.map(funnel => (
                <li key={funnel.id}>
                  <Link
                    to={`/funnels/${funnel.id}`}
                    className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <span className="mr-2">🛒</span>
                    {funnel.name || 'Unnamed Funnel'}
                  </Link>
                </li>
              ))}
              {funnels.length === 0 && (
                <li className="text-sm text-gray-400 italic p-2">No funnels yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;