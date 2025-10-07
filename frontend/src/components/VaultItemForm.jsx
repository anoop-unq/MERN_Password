import { useState, useEffect } from 'react';
import { encryptData } from '../utils/encryption.js';

const VaultItemForm = ({ onSubmit, editingItem, masterKey, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    tags: ''
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.decryptedData?.title || '',
        username: editingItem.decryptedData?.username || '',
        password: editingItem.decryptedData?.password || '',
        url: editingItem.decryptedData?.url || '',
        notes: editingItem.decryptedData?.notes || '',
        tags: editingItem.tags?.join(', ') || ''
      });
    }
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    // Encrypt the sensitive data
    const dataToEncrypt = {
      title: formData.title,
      username: formData.username,
      password: formData.password,
      url: formData.url,
      notes: formData.notes
    };

    const encrypted = encryptData(dataToEncrypt, masterKey);

    const submissionData = {
      title: formData.title,
      encryptedData: encrypted.encryptedData,
      iv: encrypted.iv,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {editingItem ? 'Edit Item' : 'Add New Item'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Username/Email</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="work, personal, social"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 font-medium"
          >
            {editingItem ? 'Update Item' : 'Save Item'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default VaultItemForm;