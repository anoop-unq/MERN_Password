import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState(null);
  const [vaultItems, setVaultItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Check authentication state
  const checkAuthState = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/check`);
      if (response.data.success && response.data.isAuthenticated) {
        setIsLogged(true);
        setUserData(response.data.user);
        await fetchVaultItems();
      } else {
        setIsLogged(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLogged(false);
      setUserData(null);
    }
  };

  // Register user
  const register = async (email, password, masterKey) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/register`, {
        email,
        password,
        masterKey
      });

      if (response.data.success) {
        setIsLogged(true);
        setUserData(response.data.user);
        toast.success('Registration successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        setIsLogged(true);
        setUserData(response.data.user);
        await fetchVaultItems();
        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`);
      setIsLogged(false);
      setUserData(null);
      setVaultItems([]);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fetch vault items
  const fetchVaultItems = useCallback(async (masterKey) => {
    if (!isLogged) return;
      if (masterKey && !await verifyMasterKey(masterKey)) {
    toast.error('Invalid master key');
    return;
  }
  
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/vault/items`);
      if (response.data.success) {
        setVaultItems(response.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch vault items:', error);
      toast.error('Failed to load vault items');
    } finally {
      setIsLoading(false);
    }
  }, [isLogged, backendUrl]);

// Update your functions to require master key verification
// Create vault item
const createVaultItem = async (itemData, masterKey) => {
  try {
    const response = await axios.post(`${backendUrl}/api/vault/items`, itemData, {
      withCredentials: true
    });
    if (response.data.success) {
      setVaultItems(prev => [response.data.item, ...prev]);
      toast.success('Item saved successfully');
      return { success: true, item: response.data.item };
    }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to save item';
    toast.error(message);
    return { success: false, error: message };
  }
};

// Similarly update updateVaultItem and deleteVaultItem to accept masterKey parameter
  // Update vault item
  const updateVaultItem = async (itemId, itemData,masterKey) => {
     if (!await verifyMasterKey(masterKey)) {
    toast.error('Invalid master key');
    return { success: false, error: 'Invalid master key' };
  }
    try {
      const response = await axios.put(`${backendUrl}/api/vault/items/${itemId}`, itemData);
      if (response.data.success) {
        setVaultItems(prev => 
          prev.map(item => item._id === itemId ? response.data.item : item)
        );
        toast.success('Item updated successfully');
        return { success: true, item: response.data.item };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update item';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete vault item
  const deleteVaultItem = async (itemId,masterKey) => {
      if (!await verifyMasterKey(masterKey)) {
    toast.error('Invalid master key');
    return { success: false, error: 'Invalid master key' };
  }
    try {
      const response = await axios.delete(`${backendUrl}/api/vault/items/${itemId}`);
      if (response.data.success) {
        setVaultItems(prev => prev.filter(item => item._id !== itemId));
        toast.success('Item deleted successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete item';
      toast.error(message);
      return { success: false, error: message };
    }
  };

// Search vault items - Updated to work with backend
const searchVaultItems = async (query) => {
  if (!query || query.trim().length === 0) {
    setSearchResults([]);
    setIsSearching(false);
    // When search is cleared, refetch all items to show complete vault
    await fetchVaultItems();
    return;
  }

  setIsSearching(true);
  try {
    const response = await axios.get(`${backendUrl}/api/vault/search`, {
      params: { query: query.trim() }
    });
    
    if (response.data.success) {
      setSearchResults(response.data.items);
    } else {
      setSearchResults([]);
      toast.error('Search failed');
    }
  } catch (error) {
    console.error('Search error:', error);
    const message = error.response?.data?.message || 'Search failed';
    toast.error(message);
    setSearchResults([]);
  } finally {
    setIsSearching(false);
  }
};

const clearSearchResults = async () => {
  setSearchResults([]);
  setIsSearching(false);
  // Refetch all vault items when clearing search
  await fetchVaultItems();
};

  const verifyMasterKey = async (masterKey) => {
  try {
    const response = await axios.post(`${backendUrl}/api/vault/verify-master-key`, {
      masterKey
    }, {
      withCredentials: true
    });
    return response.data.success;
  } catch (error) {
    console.error('Master key verification failed:', error);
    return false;
  }
};




  // Initial auth check
  useEffect(() => {
    checkAuthState();
  }, []);

  const value = {
    backendUrl,
    isLogged,
    setIsLogged,
    userData,
    setUserData,
    vaultItems,
    isLoading,
    searchResults,
    isSearching,
    register,
    login,
    logout,
    fetchVaultItems,
    createVaultItem,
    updateVaultItem,
    deleteVaultItem,
    searchVaultItems,
    clearSearchResults,
    verifyMasterKey
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};