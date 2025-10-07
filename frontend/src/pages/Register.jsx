import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

// Icons (you can use react-icons or any other icon library)
const EmailIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const KeyIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const Register = () => {
  const { register } = useContext(AppContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    masterKey: '',
    confirmMasterKey: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.masterKey) {
      newErrors.masterKey = 'Master key is required';
    } else if (formData.masterKey.length < 8) {
      newErrors.masterKey = 'Master key must be at least 8 characters long';
    }

    if (formData.masterKey !== formData.confirmMasterKey) {
      newErrors.confirmMasterKey = 'Master keys do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    await register(formData.email, formData.password, formData.masterKey);
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <KeyIcon />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Vault
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your master key encrypts your data and <span className="font-semibold text-red-500">cannot be recovered</span> if lost
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <EmailIcon />
                    <span className="ml-2">Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <LockIcon />
                    <span className="ml-2">Password</span>
                  </label>
                  <input
                    type="password"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <LockIcon />
                    <span className="ml-2">Confirm Password</span>
                  </label>
                  <input
                    type="password"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Master Key Field */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <KeyIcon />
                    <span className="ml-2">Master Key</span>
                  </label>
                  <input
                    type="password"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.masterKey ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your master key"
                    value={formData.masterKey}
                    onChange={(e) => handleInputChange('masterKey', e.target.value)}
                  />
                  {errors.masterKey && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.masterKey}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
                </div>

                {/* Confirm Master Key Field */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <KeyIcon />
                    <span className="ml-2">Confirm Master Key</span>
                  </label>
                  <input
                    type="password"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmMasterKey ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your master key"
                    value={formData.confirmMasterKey}
                    onChange={(e) => handleInputChange('confirmMasterKey', e.target.value)}
                  />
                  {errors.confirmMasterKey && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirmMasterKey}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Creating Your Vault...
                    </>
                  ) : (
                    'Create Secure Vault'
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm">
                  Already have a vault?{' '}
                  <Link 
                    to="/login" 
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200 underline"
                  >
                    Access your account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Your data is encrypted end-to-end for maximum security
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;