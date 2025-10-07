import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import MasterKeyPrompt from './MasterKeyPrompt';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiLogOut, 
  FiLock, 
  FiTag,
  FiCalendar,
  FiX,
  FiShield,
  FiKey,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiCopy,
  FiClock,
  FiUser,
  FiMenu,
  FiGrid
} from 'react-icons/fi';

const Dashboard = () => {
  const { 
    userData, 
    vaultItems, 
    isLoading,
    isSearching,
    searchResults,
    createVaultItem,
    updateVaultItem,
    deleteVaultItem,
    searchVaultItems,
    clearSearchResults,
    fetchVaultItems,
    verifyMasterKey,
    logout
  } = useContext(AppContext);
  
  const [showItemForm, setShowItemForm] = useState(false);
  const [showMasterKeyPrompt, setShowMasterKeyPrompt] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [pendingAction, setPendingAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedItems, setDisplayedItems] = useState([]);
  const [newItem, setNewItem] = useState({
    title: '',
    encryptedData: '',
    iv: '',
    tags: ''
  });
  const [editingItem, setEditingItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Show alert popup
  const showAlertPopup = (message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  // Fetch vault items on component mount
  useEffect(() => {
    fetchVaultItems();
  }, [fetchVaultItems]);

  // Update displayed items based on search results
  useEffect(() => {
    if (searchResults.length > 0 || searchQuery) {
      setDisplayedItems(searchResults);
    } else {
      setDisplayedItems(vaultItems);
    }
  }, [searchResults, vaultItems, searchQuery]);

  // Handle view item
  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  // Copy to clipboard
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showAlertPopup('Copied to clipboard!', 'success');
    }).catch(() => {
      showAlertPopup('Failed to copy to clipboard', 'error');
    });
  };

  // Handle search with debounce
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      handleClearSearch();
      return;
    }

    const timeoutId = setTimeout(() => {
      searchVaultItems(query);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  // Clear search and show all items
  const handleClearSearch = async () => {
    setSearchQuery('');
    await clearSearchResults();
  };

  // Create new vault item
  const handleCreateItem = async (e, masterKey = null) => {
    e.preventDefault();
    
    if (!masterKey) {
      setPendingAction(() => (masterKey) => handleCreateItem(e, masterKey));
      setShowMasterKeyPrompt(true);
      return;
    }

    if (!await verifyMasterKey(masterKey)) {
      showAlertPopup('Invalid master key! Please try again.');
      return;
    }

    try {
      const result = await createVaultItem({
        ...newItem,
        tags: newItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }, masterKey);
      
      if (result.success) {
        setShowItemForm(false);
        setNewItem({ title: '', encryptedData: '', iv: '', tags: '' });
        showAlertPopup('Item created successfully!', 'success');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      showAlertPopup('Failed to create item. Please try again.');
    }
  };

  // Update vault item
  const handleUpdateItem = async (itemId, updatedData, masterKey = null) => {
    if (!masterKey) {
      setPendingAction(() => (masterKey) => handleUpdateItem(itemId, updatedData, masterKey));
      setShowMasterKeyPrompt(true);
      return;
    }

    if (!await verifyMasterKey(masterKey)) {
      showAlertPopup('Invalid master key! Please try again.');
      return;
    }

    try {
      const result = await updateVaultItem(itemId, {
        ...updatedData,
        tags: updatedData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }, masterKey);
      
      if (result.success) {
        setEditingItem(null);
        setNewItem({ title: '', encryptedData: '', iv: '', tags: '' });
        showAlertPopup('Item updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      showAlertPopup('Failed to update item. Please try again.');
    }
  };

  // Delete vault item
  const handleDeleteItem = async (itemId, masterKey = null) => {
    if (!masterKey) {
      setPendingAction(() => (masterKey) => handleDeleteItem(itemId, masterKey));
      setShowMasterKeyPrompt(true);
      return;
    }

    if (!await verifyMasterKey(masterKey)) {
      showAlertPopup('Invalid master key! Please try again.');
      return;
    }

    setPendingAction(() => async (confirmedMasterKey) => {
      if (confirmedMasterKey) {
        try {
          await deleteVaultItem(itemId, confirmedMasterKey);
          showAlertPopup('Item deleted successfully!', 'success');
        } catch (error) {
          console.error('Error deleting item:', error);
          showAlertPopup('Failed to delete item. Please try again.');
        }
      }
    });
    setShowMasterKeyPrompt(true);
  };

  const handleLogout = () => {
    setAlertMessage('Are you sure you want to logout?');
    setAlertType('confirm');
    setShowAlert(true);
    setPendingAction(() => () => {
      logout();
      setShowAlert(false);
    });
  };

  const resetForm = () => {
    setShowItemForm(false);
    setEditingItem(null);
    setNewItem({ title: '', encryptedData: '', iv: '', tags: '' });
  };

  const confirmAction = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowAlert(false);
  };

  const cancelAction = () => {
    setPendingAction(null);
    setShowAlert(false);
  };

  // View Modal Component
  const ViewItemModal = () => {
    if (!selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden transform animate-scale-in border border-gray-200/50">
          {/* Header */}
          <div className="relative p-4 sm:p-6 border-b border-gray-200/60 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                  <FiFileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="max-w-[200px] sm:max-w-none">
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                    {selectedItem.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 flex items-center">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200 group"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-gray-700" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
            <div className="space-y-4 sm:space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FiFileText className="w-4 h-4 mr-2 text-blue-600" />
                  Title
                </label>
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <p className="text-gray-900 font-medium break-words">{selectedItem.title}</p>
                </div>
              </div>

              {/* Tags */}
              {selectedItem.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <FiTag className="w-4 h-4 mr-2 text-green-600" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-xs font-medium border border-green-200"
                      >
                        <FiTag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Encrypted Data */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                  <span className="flex items-center">
                    <FiLock className="w-4 h-4 mr-2 text-red-600" />
                    Encrypted Data
                  </span>
                  <button
                    onClick={() => handleCopyToClipboard(selectedItem.encryptedData)}
                    className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs"
                  >
                    <FiCopy className="w-3 h-3 mr-1" />
                    Copy
                  </button>
                </label>
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-3">
                  <pre className="text-green-400 text-xs sm:text-sm whitespace-pre-wrap break-all font-mono">
                    {selectedItem.encryptedData}
                  </pre>
                </div>
              </div>

              {/* Initialization Vector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
                  <span className="flex items-center">
                    <FiShield className="w-4 h-4 mr-2 text-purple-600" />
                    Initialization Vector (IV)
                  </span>
                  <button
                    onClick={() => handleCopyToClipboard(selectedItem.iv)}
                    className="flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs"
                  >
                    <FiCopy className="w-3 h-3 mr-1" />
                    Copy
                  </button>
                </label>
                <div className="bg-gray-800 rounded-lg border border-gray-600 p-3">
                  <pre className="text-yellow-400 text-xs sm:text-sm whitespace-pre-wrap break-all font-mono">
                    {selectedItem.iv}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50/80 border-t border-gray-200/60">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <FiUser className="w-3 h-3" />
                <span className="truncate max-w-[120px] sm:max-w-none">ID: {selectedItem._id}</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setEditingItem(selectedItem);
                    setNewItem({
                      title: selectedItem.title,
                      encryptedData: selectedItem.encryptedData,
                      iv: selectedItem.iv,
                      tags: selectedItem.tags.join(', ')
                    });
                    setShowViewModal(false);
                  }}
                  className="flex items-center justify-center flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <FiEdit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleDeleteItem(selectedItem._id);
                  }}
                  className="flex items-center justify-center flex-1 sm:flex-none px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Alert Popup */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform animate-scale-in">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4 ${
              alertType === 'success' ? 'bg-green-100' : 
              alertType === 'confirm' ? 'bg-blue-100' : 'bg-red-100'
            }`}>
              {alertType === 'success' ? (
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              ) : alertType === 'confirm' ? (
                <FiAlertCircle className="w-6 h-6 text-blue-600" />
              ) : (
                <FiAlertCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <h3 className={`text-lg font-semibold text-center mb-2 ${
              alertType === 'success' ? 'text-green-800' : 
              alertType === 'confirm' ? 'text-blue-800' : 'text-red-800'
            }`}>
              {alertType === 'success' ? 'Success!' : 
               alertType === 'confirm' ? 'Confirm Action' : 'Error'}
            </h3>
            <p className="text-gray-600 text-center mb-6 text-sm">{alertMessage}</p>
            <div className="flex gap-3">
              {alertType === 'confirm' ? (
                <>
                  <button
                    onClick={cancelAction}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAction}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAlert(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {showViewModal && <ViewItemModal />}

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <FiLock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Secure Vault
                </h1>
                <p className="text-xs text-gray-600 flex items-center">
                  <FiKey className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-[120px] sm:max-w-none">{userData?.email || 'Welcome'}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:hidden"
              >
                <FiMenu className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
              >
                <FiLogOut className="w-4 h-4 mr-1" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden py-3 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg justify-center"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 py-4">
        {/* Stats Card - Single Card for Mobile */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Items</p>
                <p className="text-3xl font-bold mt-1">{vaultItems.length}</p>
                <p className="text-blue-100 text-xs mt-2 flex items-center">
                  <FiShield className="w-3 h-3 mr-1" />
                  AES-256 Encrypted
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <FiGrid className="w-6 h-6" />
              </div>
            </div>
            {vaultItems.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-blue-100 text-xs">
                  Last updated: {new Date(vaultItems[0]?.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Search and Add Button Section */}
        <div className="mb-6">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title or tags..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/90 backdrop-blur-sm text-sm"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                </div>
              )}
              {searchQuery && !isSearching && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </div>
            <button 
              onClick={() => setShowItemForm(true)}
              className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Add New Item
            </button>
          </div>
        </div>

        {/* Add/Edit Item Form */}
        {(showItemForm || editingItem) && (
          <div className="mb-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FiEdit className="w-4 h-4 mr-2 text-blue-600" />
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button 
                onClick={resetForm}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={editingItem ? 
              (e) => { e.preventDefault(); handleUpdateItem(editingItem._id, newItem); } : 
              handleCreateItem
            } className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter item title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encrypted Data *
                </label>
                <textarea
                  placeholder="Paste your encrypted data here"
                  value={newItem.encryptedData}
                  onChange={(e) => setNewItem({...newItem, encryptedData: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white font-mono text-xs"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initialization Vector (IV) *
                </label>
                <input
                  type="text"
                  placeholder="Enter initialization vector"
                  value={newItem.iv}
                  onChange={(e) => setNewItem({...newItem, iv: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white font-mono text-xs"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FiTag className="w-4 h-4 mr-1" />
                  Tags
                </label>
                <input
                  type="text"
                  placeholder="comma, separated, tags"
                  value={newItem.tags}
                  onChange={(e) => setNewItem({...newItem, tags: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="flex items-center justify-center flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md font-medium text-sm"
                >
                  <FiLock className="w-4 h-4 mr-2" />
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="flex items-center justify-center flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200 font-medium text-sm"
                >
                  <FiX className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vault Items List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm">Loading your vault items...</p>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No items found' : 'No items in your vault'}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Add your first secure item to get started'}
              </p>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {displayedItems.map((item) => (
                <div key={item._id} className="p-4 hover:bg-blue-50/50 transition-all duration-200 group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 mr-3">
                      <h4 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <FiCalendar className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button 
                        onClick={() => handleViewItem(item)}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all duration-200"
                        title="View item"
                      >
                        <FiEye className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingItem(item);
                          setNewItem({
                            title: item.title,
                            encryptedData: item.encryptedData,
                            iv: item.iv,
                            tags: item.tags.join(', ')
                          });
                        }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200"
                        title="Edit item"
                      >
                        <FiEdit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item._id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                        title="Delete item"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-600 font-mono text-xs break-all">
                        {item.encryptedData.substring(0, 60)}...
                      </p>
                    </div>
                    
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            <FiTag className="w-2 h-2 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Master Key Prompt Modal */}
      {showMasterKeyPrompt && (
        <MasterKeyPrompt
          onVerify={(masterKey) => {
            setShowMasterKeyPrompt(false);
            if (pendingAction) {
              pendingAction(masterKey);
              setPendingAction(null);
            }
          }}
          onCancel={() => {
            setShowMasterKeyPrompt(false);
            setPendingAction(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;