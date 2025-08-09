import React from 'react';
import { Activity, BarChart3, FileText, Settings, Github } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="border-b border-cyber-purple/30 bg-terminal-black/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyber-purple to-cyber-blue rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyber-purple to-cyber-blue bg-clip-text text-transparent">
              FlashTime
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-cyber-purple/20 text-cyber-purple shadow-lg shadow-cyber-purple/25'
                    : 'hover:bg-white/5 text-cyber-green/70 hover:text-cyber-green'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </nav>

          {/* GitHub Connection */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 rounded-lg transition-all duration-200 text-cyber-blue border border-cyber-blue/30">
              <Github className="w-4 h-4" />
              <span className="text-sm">Connected</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;