import React, { useState } from 'react';
import { FiKey, FiLock, FiX, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

const MasterKeyPrompt = ({ onVerify, onCancel, actionType = "perform this action" }) => {
  const [masterKey, setMasterKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (masterKey.trim()) {
      setIsLoading(true);
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      onVerify(masterKey);
      setMasterKey('');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setMasterKey('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in border border-gray-200/50">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <FiShield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Master Key Required
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Security verification needed
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
            >
              <FiX className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">
              Enter Your Master Key
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              To {actionType}, please verify your identity with your master key. 
              This ensures the security of your encrypted data.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Master Key
              </label>
              <div className="relative">
                <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your master key"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your master key is never stored on our servers
              </p>
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-start space-x-2">
                <FiShield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-800 mb-1">Security Tip</p>
                  <p className="text-xs text-blue-700">
                    Make sure you're in a private space and no one can see your screen.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!masterKey.trim() || isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify & Continue'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/80 rounded-b-2xl border-t border-gray-200/60">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-gray-600">
              Connection secured with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterKeyPrompt;