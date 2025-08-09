import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Flame } from 'lucide-react';

const ProductivityScore: React.FC = () => {
  const [score, setScore] = useState(0);
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    // Animate score from 0 to 87
    const timer = setTimeout(() => {
      setScore(87);
    }, 500);

    // Trigger fire animation
    const animationTimer = setTimeout(() => {
      setAnimation('animate-pulse');
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimer);
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-cyber-blue to-cyber-purple';
    if (score >= 60) return 'from-cyber-green to-cyber-blue';
    return 'from-orange-500 to-red-500';
  };

  const getMotivationMessage = (score: number) => {
    if (score >= 80) return { icon: Flame, text: "🔥 You're on fire!", color: 'text-cyber-blue' };
    if (score >= 60) return { icon: TrendingUp, text: "📈 Great progress!", color: 'text-cyber-green' };
    return { icon: Zap, text: "💤 Time to focus!", color: 'text-orange-400' };
  };

  const motivation = getMotivationMessage(score);
  const Icon = motivation.icon;

  return (
    <div className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-cyber-green">Productivity Score</h2>
        <Zap className="w-5 h-5 text-cyber-blue" />
      </div>

      {/* Score Circle */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* Background Circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-cyber-purple/20"
            />
            {/* Progress Circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="transition-all duration-2000 ease-out"
              strokeDasharray={`${(score / 100) * 314} 314`}
              style={{
                filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))',
              }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent ${animation}`}>
                {score}
              </div>
              <div className="text-xs text-cyber-green/60 mt-1">SCORE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Message */}
      <div className={`flex items-center justify-center space-x-2 p-3 bg-gradient-to-r ${getScoreColor(score)}/10 rounded-lg border border-current/20`}>
        <Icon className={`w-5 h-5 ${motivation.color}`} />
        <span className={`font-medium ${motivation.color}`}>
          {motivation.text}
        </span>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-cyber-green/60">Today's Focus</span>
          <span className="text-cyber-blue">4h 32m</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cyber-green/60">Streak</span>
          <span className="text-cyber-purple">7 days</span>
        </div>
      </div>
    </div>
  );
};

export default ProductivityScore;