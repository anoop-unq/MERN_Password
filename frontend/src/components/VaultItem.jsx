import { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard.js';

const VaultItem = ({ item, onEdit, onDelete, masterKey, decryptData }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [decryptedData, setDecryptedData] = useState(null);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const handleDecrypt = async () => {
    if (!isDecrypted && masterKey) {
      try {
        const data = decryptData(item.encryptedData, item.iv, masterKey);
        setDecryptedData(data);
        setIsDecrypted(true);
      } catch (error) {
        console.error('Decryption failed:', error);
        alert('Failed to decrypt item. Please check your master key.');
      }
    }
  };

  const handleCopy = async (text, field) => {
    if (text) {
      const success = await copyToClipboard(text, () => setCopiedField(''));
      if (success) {
        setCopiedField(field);
      }
    }
  };

  const displayData = isDecrypted ? decryptedData : { title: item.title };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{displayData.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {!isDecrypted ? (
        <button
          onClick={handleDecrypt}
          className="w-full bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200 font-medium"
        >
          Click to decrypt and view details
        </button>
      ) : (
        <div className="space-y-2">
          {displayData.username && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Username:</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{displayData.username}</span>
                <button
                  onClick={() => handleCopy(displayData.username, 'username')}
                  className={`text-xs px-2 py-1 rounded ${
                    copiedField === 'username' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {copiedField === 'username' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {displayData.password && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Password:</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium">
                  {showPassword ? displayData.password : '••••••••'}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleCopy(displayData.password, 'password')}
                    className={`text-xs px-2 py-1 rounded ${
                      copiedField === 'password' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {copiedField === 'password' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {displayData.url && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">URL:</span>
              <div className="flex items-center space-x-2">
                <a 
                  href={displayData.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm truncate max-w-xs"
                >
                  {displayData.url}
                </a>
                <button
                  onClick={() => handleCopy(displayData.url, 'url')}
                  className={`text-xs px-2 py-1 rounded ${
                    copiedField === 'url' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {copiedField === 'url' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {displayData.notes && (
            <div>
              <span className="text-sm text-gray-600">Notes:</span>
              <p className="text-sm mt-1 text-gray-700 bg-gray-50 p-2 rounded">
                {displayData.notes}
              </p>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VaultItem;