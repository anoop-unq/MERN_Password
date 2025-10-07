import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { 
  FiMail, 
  FiLock, 
  FiLogIn, 
  FiUserPlus, 
  FiShield,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { HiOutlineLockClosed } from 'react-icons/hi';

const Login = () => {
  const { login } = useContext(AppContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    
    setIsLoading(true);
    await login(formData.email, formData.password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <HiOutlineLockClosed className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base">
            Sign in to access your secure vault
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiMail className="w-4 h-4 mr-2 text-blue-600" />
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiLock className="w-4 h-4 mr-2 text-blue-600" />
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/50 backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-start space-x-2">
                <FiShield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-800 mb-1">Secure Login</p>
                  <p className="text-xs text-blue-700">
                    Your data is encrypted end-to-end. We never store your master key.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !formData.email || !formData.password}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <FiLogIn className="w-4 h-4 mr-2" />
                    Sign In to Vault
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to Secure Vault?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link 
                to="/register" 
                className="group inline-flex items-center justify-center w-full py-3 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FiUserPlus className="w-4 h-4 mr-2 text-gray-500 group-hover:text-gray-700 transition-colors" />
                Create New Account
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            🔒 Your privacy is our priority. All data is encrypted with AES-256.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;