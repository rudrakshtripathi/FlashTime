import React from 'react';
import { Download, Mail, Calendar, FileText } from 'lucide-react';

const WeeklyReport: React.FC = () => {
  const reportData = {
    week: 'Nov 11-17, 2024',
    totalHours: 39.8,
    productiveHours: 32.1,
    productivityScore: 87,
    commits: 23,
    filesModified: 67,
    bugsFixed: 8,
    features: 5,
  };

  const insights = [
    'Your most productive day was Thursday with 8.1 hours of focused coding',
    'You maintained a consistent coding schedule throughout the week',
    'Morning sessions (9-11 AM) showed highest productivity levels',
    'Break frequency was optimal for maintaining focus',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cyber-green mb-2">Weekly Report</h1>
          <p className="text-cyber-green/70">{reportData.week}</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-cyber-blue/20 hover:bg-cyber-blue/30 text-cyber-blue rounded-lg transition-all duration-200">
            <Mail className="w-4 h-4" />
            <span>Email Report</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-cyber-purple/20 hover:bg-cyber-purple/30 text-cyber-purple rounded-lg transition-all duration-200">
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyber-blue mb-2">{reportData.totalHours}h</div>
            <div className="text-sm text-cyber-green/60">Total Hours</div>
          </div>
        </div>
        
        <div className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyber-purple mb-2">{reportData.productivityScore}%</div>
            <div className="text-sm text-cyber-green/60">Productivity Score</div>
          </div>
        </div>
        
        <div className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyber-green mb-2">{reportData.commits}</div>
            <div className="text-sm text-cyber-green/60">Commits Made</div>
          </div>
        </div>
        
        <div className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">{reportData.features}</div>
            <div className="text-sm text-cyber-green/60">Features Built</div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Breakdown */}
        <div className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-cyber-green mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Activity Breakdown
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-cyber-green/80">Coding</span>
                <span className="text-cyber-blue">{reportData.productiveHours}h (80.7%)</span>
              </div>
              <div className="w-full bg-cyber-purple/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyber-blue to-cyber-purple h-2 rounded-full" style={{ width: '80.7%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-cyber-green/80">Debugging</span>
                <span className="text-orange-400">4.2h (10.6%)</span>
              </div>
              <div className="w-full bg-cyber-purple/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full" style={{ width: '10.6%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-cyber-green/80">Meetings</span>
                <span className="text-cyber-purple">2.1h (5.3%)</span>
              </div>
              <div className="w-full bg-cyber-purple/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyber-purple to-pink-400 h-2 rounded-full" style={{ width: '5.3%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-cyber-green/80">Other</span>
                <span className="text-cyber-green">1.4h (3.4%)</span>
              </div>
              <div className="w-full bg-cyber-purple/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyber-green to-green-400 h-2 rounded-full" style={{ width: '3.4%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-cyber-green mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            AI Insights
          </h2>
          
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-cyber-blue rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-cyber-green/80 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg">
            <p className="text-sm text-cyber-purple font-medium">
              🎯 Recommendation: Your productivity peaks in the morning. Consider scheduling complex tasks between 9-11 AM for maximum efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-terminal-dark/50 backdrop-blur-sm border border-cyber-purple/30 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-cyber-green mb-4">Export & Sharing</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-cyber-blue/20 hover:bg-cyber-blue/30 rounded-lg transition-all duration-200 border border-cyber-blue/30">
            <Download className="w-5 h-5 text-cyber-blue" />
            <span className="text-cyber-blue">Download PDF</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-4 bg-cyber-purple/20 hover:bg-cyber-purple/30 rounded-lg transition-all duration-200 border border-cyber-purple/30">
            <Mail className="w-5 h-5 text-cyber-purple" />
            <span className="text-cyber-purple">Email Report</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-4 bg-cyber-green/20 hover:bg-cyber-green/30 rounded-lg transition-all duration-200 border border-cyber-green/30">
            <FileText className="w-5 h-5 text-cyber-green" />
            <span className="text-cyber-green">Share Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;