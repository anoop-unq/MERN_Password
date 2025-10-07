import { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import SearchResults from '../components/SearchResults';
import { FaArrowLeft, FaSearch, FaTimes, FaHome } from 'react-icons/fa';
import debounce from 'lodash/debounce';
import { assets } from '../assets/assets';

const HomePage = () => {
  const { fetchPosts, searchUsers, searchResults, isSearching, clearSearchResults } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

    const [showDollar, setShowDollar] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDollar(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query && query.trim().length > 0) {
        searchUsers(query);
        setShowResults(true);
      } else {
        clearSearchResults();
        setShowResults(false);
      }
    }, 300),
    [searchUsers, clearSearchResults]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    
    // Cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearchResults();
    setShowResults(false);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setIsSearchFocused(false);
      if (!searchQuery) {
        setShowResults(false);
      }
    }, 200);
  };

  const handleCloseResults = () => {
    setShowResults(false);
  };

  const shouldShowNoResults = searchQuery && !isSearching && searchResults.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 font-['Inter']">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg shadow-lg shadow-blue-100/50 border-b border-blue-200/30">
        <div className="px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div 
              className="flex items-center cursor-pointer group transition-transform duration-300 hover:scale-105"
              onClick={() => navigate("/")}
            >
              <img 
                src={assets.logo}
                alt="Logo"
                className="h-10 sm:h-12 drop-shadow-lg transition-all duration-300 group-hover:rotate-0"
              />
              
            </div>
          
            {/* Enhanced Search Bar */}
            <div className={`relative transition-all duration-500 ease-in-out ${
              isSearchFocused || searchQuery ? 
              'flex-grow max-w-2xl ml-4 mr-2' : 
              'w-48 sm:w-64 md:w-80 lg:w-96'
            }`}>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-400/80 z-10">
                  <FaSearch className="text-lg sm:text-xl" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="w-full pl-12 pr-12 py-3 sm:py-4 text-sm sm:text-base bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200/60 focus:border-blue-400 focus:ring-4 focus:ring-blue-200/40 focus:bg-white focus:outline-none transition-all duration-300 shadow-lg shadow-blue-100/30 hover:shadow-blue-200/40"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition-all duration-300 transform hover:scale-110"
                  >
                    <FaTimes className="text-lg sm:text-xl" />
                  </button>
                )}
              </div>
              
              {/* Search Results */}
              {(showResults || isSearching) && (
                <div className="absolute top-full left-0 right-0 mt-3 z-30 animate-fadeIn">
                  <SearchResults 
                    results={searchResults} 
                    isSearching={isSearching}
                    onClose={handleCloseResults}
                    stable={shouldShowNoResults}
                  />
                </div>
              )}
              
              {/* No results found */}
              {shouldShowNoResults && (
                <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200/50 mt-3 z-30 animate-fadeIn">
                  <div className="p-6 text-center text-gray-500 font-medium">
                    <div className="text-6xl mb-3">🔍</div>
                    <p className="text-lg">No users found</p>
                    <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
           
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="relative">
        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Post Form Section */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-blue-100/30 border border-white/50 p-6 sm:p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
              <PostForm />
            </div>
          </div>

          {/* Post List Section */}
          <div className="max-w-4xlpx-4 sm:px-6 lg:px-8 pb-20">
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl shadow-blue-100/30 border border-white/50 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100/50">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Recent Product '
      {showDollar && (
        <span 
          className="text-green-500 font-mono animate-typing"
          style={{
            animation: 'typing 0.5s ease-out'
          }}
        >
          $
        </span>
      )}
      <style>{`
        @keyframes typing {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </h2>
                <p className="text-gray-600 mt-1">Discover what's happening in your community</p>
              </div>
              <PostList />
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Floating Action Button */}
      <div className="md:hidden fixed bottom-8 right-8 z-20">
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-4 w-16 h-16 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 shadow-lg shadow-blue-500/25 animate-bounce-slow"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        .font-['Inter'] {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </div>
  );
}

export default HomePage;