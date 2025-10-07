import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import VaultItem from './VaultItem';
import { decryptData } from '../utils/encryption.js';

const VaultList = ({ masterKey }) => {
  const { vaultItems, searchResults, isSearching, searchVaultItems, deleteVaultItem } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const displayItems = searchQuery && searchResults.length > 0 ? searchResults : vaultItems;

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchVaultItems(query);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteVaultItem(itemId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search vault items..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isSearching && (
          <div className="text-sm text-gray-500 mt-2">Searching...</div>
        )}
      </div>

      {/* Items Count */}
      <div className="text-sm text-gray-600">
        {searchQuery ? (
          <>Found {searchResults.length} item(s) for "{searchQuery}"</>
        ) : (
          <>Total items: {vaultItems.length}</>
        )}
      </div>

      {/* Vault Items */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((item) => (
          <VaultItem
            key={item._id}
            item={item}
            onEdit={setEditingItem}
            onDelete={handleDelete}
            masterKey={masterKey}
            decryptData={decryptData}
          />
        ))}
      </div>

      {displayItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? 'No items found matching your search.' : 'No items in your vault yet.'}
        </div>
      )}
    </div>
  );
};

export default VaultList;