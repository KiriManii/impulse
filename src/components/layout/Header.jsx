import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">
              Impulse
            </span>
            <span className="ml-2 text-sm text-gray-500 hidden sm:inline">
              Real-Time Buyer Psychology Tracker
            </span>
          </Link>
        </motion.div>
        
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/personas/new" className="text-gray-600 hover:text-primary-600 transition-colors">
            New Persona
          </Link>
          <Link to="/funnels/new" className="text-gray-600 hover:text-primary-600 transition-colors">
            New Funnel
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;