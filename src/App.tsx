import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductivityScore from './components/ProductivityScore';
import TimeChart from './components/TimeChart';
import ActivityFeed from './components/ActivityFeed';
import GPTSummary from './components/GPTSummary';
import BreakReminder from './components/BreakReminder';
import StatsCards from './components/StatsCards';
import WeeklyReport from './components/WeeklyReport';
import TestPanel from './components/TestPanel';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBreakReminder, setShowBreakReminder] = useState(false);

  useEffect(() => {
    // Simulate break reminder after 5 seconds
    const timer = setTimeout(() => {
      setShowBreakReminder(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <StatsCards />
              <TimeChart />
              <ActivityFeed />
            </div>
            <div className="space-y-6">
              <ProductivityScore />
              <GPTSummary />
              <TestPanel />
            </div>
          </div>
        );
      case 'reports':
        return <WeeklyReport />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-cyber-blue text-lg">Feature coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-terminal-black text-cyber-green font-mono overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />
      
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {renderContent()}
      </main>

      {showBreakReminder && (
        <BreakReminder onClose={() => setShowBreakReminder(false)} />
      )}
    </div>
  );
}

export default App;