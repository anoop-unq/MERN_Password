import { useState } from 'react';
import { generatePassword, calculatePasswordStrength } from '../utils/passwordGenerator.js';
import { copyToClipboard } from '../utils/clipboard.js';

const PasswordGenerator = ({ onPasswordGenerated }) => {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState({
    length: 12,
    includeNumbers: true,
    includeLetters: true,
    includeSymbols: true,
    excludeLookAlikes: true
  });
  const [copied, setCopied] = useState(false);

  const generateNewPassword = () => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    if (onPasswordGenerated) {
      onPasswordGenerated(newPassword);
    }
  };

  const handleCopy = async () => {
    if (password) {
      const success = await copyToClipboard(password, () => setCopied(false));
      if (success) {
        setCopied(true);
      }
    }
  };

  const strength = calculatePasswordStrength(password);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Password Generator</h2>
      
      {/* Password Display */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Generated password will appear here"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded font-medium ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        {password && (
          <div className="flex items-center space-x-2 text-sm">
            <span>Strength:</span>
            <span className={`font-medium text-${strength.color}-600`}>
              {strength.strength}
            </span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        {/* Length Slider */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Length: {options.length}
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={options.length}
            onChange={(e) => setOptions(prev => ({ 
              ...prev, 
              length: parseInt(e.target.value) 
            }))}
            className="w-full"
          />
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => setOptions(prev => ({ 
                ...prev, 
                includeNumbers: e.target.checked 
              }))}
              className="rounded"
            />
            <span>Numbers</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeLetters}
              onChange={(e) => setOptions(prev => ({ 
                ...prev, 
                includeLetters: e.target.checked 
              }))}
              className="rounded"
            />
            <span>Letters</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => setOptions(prev => ({ 
                ...prev, 
                includeSymbols: e.target.checked 
              }))}
              className="rounded"
            />
            <span>Symbols</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.excludeLookAlikes}
              onChange={(e) => setOptions(prev => ({ 
                ...prev, 
                excludeLookAlikes: e.target.checked 
              }))}
              className="rounded"
            />
            <span>Exclude Look-alikes</span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateNewPassword}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 font-medium"
        >
          Generate Password
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;