import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results, isSearching, onClose, stable }) => {
  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    navigate(`/view-users/${userId}`);
    if (onClose) onClose();
  };
  console.log(results)
  console.log(isSearching,"55")


  if (!results || results.length === 0 || results==[]) {
    if (isSearching === true) {
      return stable ? (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg border border-gray-200 mt-1 z-20">
          <div className="p-4 text-center text-gray-500">
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </div>
          </div>
        </div>
      ) : null;
    }
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg border border-gray-200 mt-1 z-20 max-h-80 overflow-y-auto">
      {results.map((user) => (
        <div
          key={user._id}
          className="p-3 flex items-center hover:bg-gray-50 cursor-pointer transition-colors duration-150"
          onClick={() => handleUserClick(user._id)}
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900 flex items-center">
              {user.name}
              {user.isAccountVerified && (
                <span className="ml-1 text-blue-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </span>
              )}
            </div>
            {user.bio && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {user.bio}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;