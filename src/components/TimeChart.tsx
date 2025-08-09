import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Code, Coffee } from 'lucide-react';

const TimeChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const weekData = [
    { day: 'Mon', productive: 6.5, wasted: 1.5 },
    { day: 'Tue', productive: 7.2, wasted: 0.8 },
    { day: 'Wed', productive: 5.8, wasted: 2.2 },
    { day: 'Thu', productive: 8.1, wasted: 0.4 },
    { day: 'Fri', productive: 6.9, wasted: 1.1 },
    { day: 'Sat', productive: 3.2, wasted: 0.8 },
    { day: 'Sun', productive: 2.1, wasted: 0.3 },
  ];

  const maxHours = Math.max(...weekData.map(d => d.productive + d.wasted));

  return (
    <div className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-cyber-blue" />
          <h2 className="text-lg font-semibold text-cyber-green">Time Analysis</h2>
        </div>
        
        <div className="flex space-x-1">
          {['day', 'week', 'month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                selectedPeriod === period
                  ? 'bg-cyber-purple/30 text-cyber-purple'
                  : 'hover:bg-white/5 text-cyber-green/60'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end justify-between space-x-2 mb-4">
        {weekData.map((data, index) => (
          <div key={data.day} className="flex flex-col items-center flex-1">
            <div className="w-full relative">
              {/* Productive Time Bar */}
              <div
                className={`w-full bg-gradient-to-t from-cyber-blue to-cyber-purple rounded-t-sm transition-all duration-1000 ease-out ${
                  animateChart ? '' : 'h-0'
                }`}
                style={{
                  height: animateChart ? `${(data.productive / maxHours) * 200}px` : '0px',
                  filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))',
                }}
              />
              
              {/* Wasted Time Bar */}
              <div
                className={`w-full bg-gradient-to-t from-red-500 to-orange-500 rounded-b-sm transition-all duration-1000 ease-out ${
                  animateChart ? '' : 'h-0'
                }`}
                style={{
                  height: animateChart ? `${(data.wasted / maxHours) * 200}px` : '0px',
                  filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))',
                }}
              />
            </div>
            
            <div className="text-xs text-cyber-green/60 mt-2">{data.day}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full"></div>
          <span className="text-sm text-cyber-green/80">Productive</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
          <span className="text-sm text-cyber-green/80">Wasted</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-cyber-purple/20">
        <div className="text-center">
          <Clock className="w-4 h-4 text-cyber-blue mx-auto mb-1" />
          <div className="text-sm text-cyber-blue font-medium">39.8h</div>
          <div className="text-xs text-cyber-green/60">Total</div>
        </div>
        <div className="text-center">
          <Code className="w-4 h-4 text-cyber-purple mx-auto mb-1" />
          <div className="text-sm text-cyber-purple font-medium">32.1h</div>
          <div className="text-xs text-cyber-green/60">Coding</div>
        </div>
        <div className="text-center">
          <Coffee className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <div className="text-sm text-orange-400 font-medium">7.7h</div>
          <div className="text-xs text-cyber-green/60">Breaks</div>
        </div>
      </div>
    </div>
  );
};

export default TimeChart;