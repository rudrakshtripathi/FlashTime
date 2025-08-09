import React from 'react';
import { Code, Target, Zap, TrendingUp } from 'lucide-react';

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Coding Hours',
      value: '6.5h',
      change: '+12%',
      changeType: 'positive',
      icon: Code,
      color: 'cyber-blue',
    },
    {
      title: 'Focus Score',
      value: '87%',
      change: '+5%',
      changeType: 'positive',
      icon: Target,
      color: 'cyber-purple',
    },
    {
      title: 'Productivity',
      value: '92%',
      change: '+8%',
      changeType: 'positive',
      icon: Zap,
      color: 'cyber-green',
    },
    {
      title: 'Efficiency',
      value: '78%',
      change: '-3%',
      changeType: 'negative',
      icon: TrendingUp,
      color: 'orange-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-4 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${stat.color}/20`}>
                <Icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <div
                className={`text-xs px-2 py-1 rounded-full ${
                  stat.changeType === 'positive'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {stat.change}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className={`text-2xl font-bold text-${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-cyber-green/60">
                {stat.title}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;