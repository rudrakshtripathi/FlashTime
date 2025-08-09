import React, { useState } from 'react';
import { Play, Database, Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ActivityService } from '../services/activityService';

const TestPanel: React.FC = () => {
  const { user } = useAuth();
  const [isSimulating, setIsSimulating] = useState(false);
  const [message, setMessage] = useState('');

  const simulateActivity = async () => {
    if (!user) return;
    
    setIsSimulating(true);
    setMessage('');
    
    try {
      await ActivityService.simulateActivity(user.uid, 'FlashTime Dashboard');
      setMessage('✅ Successfully simulated VS Code activities! Check the dashboard for updates.');
    } catch (error) {
      setMessage('❌ Error simulating activities. Check console for details.');
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6 shadow-xl">
      <div className="flex items-center space-x-2 mb-4">
        <Database className="w-5 h-5 text-cyber-blue" />
        <h2 className="text-lg font-semibold text-cyber-green">Development Testing</h2>
      </div>
      
      <p className="text-sm text-cyber-green/70 mb-4">
        Simulate VS Code extension activity to test the real-time data flow and backend processing.
      </p>
      
      <button
        onClick={simulateActivity}
        disabled={isSimulating}
        className="flex items-center space-x-2 px-4 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 disabled:opacity-50 disabled:cursor-not-allowed text-cyber-blue rounded-lg transition-all duration-200 border border-cyber-blue/30"
      >
        {isSimulating ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        <span>{isSimulating ? 'Simulating...' : 'Simulate VS Code Activity'}</span>
      </button>
      
      {message && (
        <div className="mt-4 p-3 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg">
          <p className="text-sm text-cyber-green">{message}</p>
        </div>
      )}
    </div>
  );
};

export default TestPanel;