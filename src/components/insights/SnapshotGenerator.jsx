import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import useSimulationStore from '../../stores/simulationStore';
import useFunnelStore from '../../stores/funnelStore';

function SnapshotGenerator() {
  const snapshotRef = useRef(null);
  const { abandonments, completions } = useSimulationStore();
  const getActiveFunnel = useFunnelStore(state => state.getActiveFunnel);
  
  const funnel = getActiveFunnel();
  const totalCustomers = completions + abandonments.length;
  const completionRate = totalCustomers ? Math.round((completions / totalCustomers) * 100) : 0;
  
  // Generate insights based on simulation results
  const generateInsights = () => {
    if (totalCustomers === 0) return 'Run a simulation to see insights';
    
    // Group abandonments by reason
    const reasonCounts = abandonments.reduce((acc, abandon) => {
      acc[abandon.reason] = (acc[abandon.reason] || 0) + 1;
      return acc;
    }, {});
    
    // Find the top reason
    let topReason = null;
    let topCount = 0;
    
    Object.entries(reasonCounts).forEach(([reason, count]) => {
      if (count > topCount) {
        topReason = reason;
        topCount = count;
      }
    });
    
    // Generate insight message
    if (completionRate >= 80) {
      return '🏆 Great funnel! Your completion rate is impressive.';
    } else if (completionRate < 50) {
      if (topReason === 'price') {
        return '💸 Your prices might be scaring customers away.';
      } else if (topReason === 'ux') {
        return '🤔 Your funnel has a UX issue. Try simplifying the experience.';
      } else if (topReason === 'trust') {
        return '🔒 Your funnel has a trust issue. Add more social proof.';
      } else if (topReason === 'technical') {
        return '⚙️ Technical problems are killing your conversions.';
      } else if (topReason === 'distraction') {
        return '👀 Too many distractions in your funnel. Focus on the goal.';
      }
    }
    
    return '📊 Your funnel needs some optimization to improve conversions.';
  };
  
  const insight = generateInsights();
  
  const handleExport = async () => {
    if (!snapshotRef.current) return;
    
    try {
      const canvas = await html2canvas(snapshotRef.current, {
        backgroundColor: null,
        scale: 2
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `impulse-snapshot-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to export snapshot:', error);
    }
  };
  
  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-6">Generate Shareable Insight</h3>
      
      <div 
        ref={snapshotRef}
        className="p-6 rounded-lg bg-gradient-to-br from-primary-50 to-secondary-50 mb-6"
      >
        <div className="text-center mb-3">
          <h4 className="text-xl font-bold text-gray-800">
            {funnel?.name || 'Funnel'} Performance
          </h4>
          <div className="text-sm text-gray-500">powered by Impulse</div>
        </div>
        
        <div className="flex justify-center items-center space-x-8 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">
              {completionRate}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">
              {abandonments.length}
            </div>
            <div className="text-sm text-gray-600">Abandonments</div>
          </div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-xl">{insight}</div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleExport}
          disabled={totalCustomers === 0}
          className={`btn ${
            totalCustomers === 0 
              ? 'bg-gray-200 cursor-not-allowed' 
              : 'btn-primary'
          }`}
        >
          Export as Image
        </button>
      </div>
    </div>
  );
}

export default SnapshotGenerator;