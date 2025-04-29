import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomerJourney from '../components/insights/CustomerJourney';
import AbandonmentInspector from '../components/insights/AbandonmentInspector';
import SnapshotGenerator from '../components/insights/SnapshotGenerator';
import FixAndRetry from '../components/insights/FixAndRetry';

function InsightsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('journey');
  
  const tabs = [
    { id: 'journey', label: 'Customer Journey', icon: '📊' },
    { id: 'abandonment', label: 'Abandonment Inspector', icon: '🔍' },
    { id: 'fixandretry', label: 'Fix & Retry', icon: '🧪' },
    { id: 'snapshot', label: 'Snapshot Generator', icon: '🖼️' },
  ];
  
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-bold">Funnel Insights</h1>
        <button
          onClick={() => navigate(`/funnels/${id}`)}
          className="btn bg-gray-200 hover:bg-gray-300"
        >
          Back to Funnel
        </button>
      </motion.div>
      
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex space-x-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm flex items-center whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-800 font-medium'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        {activeTab === 'journey' && <CustomerJourney />}
        {activeTab === 'abandonment' && <AbandonmentInspector />}
        {activeTab === 'fixandretry' && <FixAndRetry />}
        {activeTab === 'snapshot' && <SnapshotGenerator />}
      </div>
    </div>
  );
}

export default InsightsPage;