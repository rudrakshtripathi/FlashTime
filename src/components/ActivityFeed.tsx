import React from 'react';
import { GitCommit, FileText, Bug, Coffee, Clock } from 'lucide-react';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'commit',
      title: 'Fixed authentication bug in user login',
      description: 'auth.ts, login.tsx',
      time: '2 minutes ago',
      icon: GitCommit,
      color: 'text-cyber-green',
      bgColor: 'bg-cyber-green/20',
    },
    {
      id: 2,
      type: 'coding',
      title: 'Implemented dashboard components',
      description: 'ProductivityScore.tsx, TimeChart.tsx',
      time: '15 minutes ago',
      icon: FileText,
      color: 'text-cyber-blue',
      bgColor: 'bg-cyber-blue/20',
    },
    {
      id: 3,
      type: 'debugging',
      title: 'Debugging API connection issues',
      description: 'api.service.ts',
      time: '45 minutes ago',
      icon: Bug,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/20',
    },
    {
      id: 4,
      type: 'break',
      title: 'Smart break taken',
      description: 'Recommended 5-minute break',
      time: '1 hour ago',
      icon: Coffee,
      color: 'text-cyber-purple',
      bgColor: 'bg-cyber-purple/20',
    },
    {
      id: 5,
      type: 'commit',
      title: 'Added time tracking functionality',
      description: 'timeTracker.ts, hooks/useTimeTracker.ts',
      time: '1 hour ago',
      icon: GitCommit,
      color: 'text-cyber-green',
      bgColor: 'bg-cyber-green/20',
    },
  ];

  return (
    <div className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6 shadow-xl">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="w-5 h-5 text-cyber-blue" />
        <h2 className="text-lg font-semibold text-cyber-green">Activity Feed</h2>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`p-2 rounded-full ${activity.bgColor} flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-cyber-green truncate">
                    {activity.title}
                  </h3>
                  <span className="text-xs text-cyber-green/50 flex-shrink-0 ml-2">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-cyber-green/70 mt-1 truncate">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-cyber-purple/20">
        <button className="w-full py-2 text-sm text-cyber-blue hover:text-cyber-purple transition-colors duration-200">
          View All Activity →
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;