import React, { useState } from 'react';
import { X, User, Lock, Mail, Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-terminal-dark/95 border border-cyber-purple/30 rounded-lg p-8 max-w-md w-full shadow-2xl animate-scale-in">
        {/* Holographic Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 via-transparent to-cyber-blue/20 rounded-lg pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-purple to-cyber-blue rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-cyber-green">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </h2>
                <p className="text-sm text-cyber-green/70">Access your FlashTime dashboard</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-cyber-green/70" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyber-green/80 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyber-green/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-terminal-black/50 border border-cyber-purple/30 rounded-lg text-cyber-green placeholder-cyber-green/50 focus:outline-none focus:border-cyber-blue transition-colors duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyber-green/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyber-green/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-terminal-black/50 border border-cyber-purple/30 rounded-lg text-cyber-green placeholder-cyber-green/50 focus:outline-none focus:border-cyber-blue transition-colors duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-cyber-purple to-cyber-blue hover:from-cyber-blue hover:to-cyber-purple rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyber-purple/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <User className="w-5 h-5" />
                  <span className="font-medium">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-cyber-purple/20 text-center">
            <p className="text-sm text-cyber-green/70">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-2 text-cyber-blue hover:text-cyber-purple transition-colors duration-200 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;