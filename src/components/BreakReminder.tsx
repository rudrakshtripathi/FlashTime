import React, { useEffect, useState } from 'react';
import { Coffee, X, Clock, Play } from 'lucide-react';

interface BreakReminderProps {
  onClose: () => void;
}

const BreakReminder: React.FC<BreakReminderProps> = ({ onClose }) => {
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown => countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      onClose();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, countdown, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startBreak = () => {
    setIsActive(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-terminal-dark/95 border border-cyber-purple/30 rounded-lg p-8 max-w-md w-full shadow-2xl animate-scale-in">
        {/* Holographic Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 via-transparent to-cyber-blue/20 rounded-lg pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyber-purple to-cyber-blue rounded-full flex items-center justify-center animate-pulse">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-cyber-green">Smart Break Time!</h2>
                <p className="text-sm text-cyber-green/70">You've been coding for 2 hours</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-cyber-green/70" />
            </button>
          </div>

          <div className="text-center mb-6">
            <p className="text-cyber-green/90 mb-4">
              Your productivity analysis suggests taking a 5-minute break now for optimal focus.
            </p>
            
            {isActive ? (
              <div className="space-y-4">
                <div className="text-4xl font-mono font-bold text-cyber-blue">
                  {formatTime(countdown)}
                </div>
                <div className="flex items-center justify-center space-x-2 text-cyber-purple">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Break in progress...</span>
                </div>
              </div>
            ) : (
              <button
                onClick={startBreak}
                className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-cyber-purple to-cyber-blue hover:from-cyber-blue hover:to-cyber-purple rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyber-purple/25"
              >
                <Play className="w-5 h-5" />
                <span className="font-medium">Start 5-min Break</span>
              </button>
            )}
          </div>

          <div className="space-y-3 text-sm text-cyber-green/70">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyber-green rounded-full"></div>
              <span>Step away from your screen</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyber-blue rounded-full"></div>
              <span>Do some light stretching</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyber-purple rounded-full"></div>
              <span>Hydrate and rest your eyes</span>
            </div>
          </div>

          {!isActive && (
            <div className="mt-6 pt-4 border-t border-cyber-purple/20">
              <button
                onClick={onClose}
                className="w-full py-2 text-sm text-cyber-green/70 hover:text-cyber-green transition-colors duration-200"
              >
                Maybe later
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreakReminder;