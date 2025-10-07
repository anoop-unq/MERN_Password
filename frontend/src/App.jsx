import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext, AppContextProvider } from './context/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isLogged } = useContext(AppContext);
  return isLogged ? children : <Navigate to="/login" />;
};

// Public Route component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { isLogged } = useContext(AppContext);
  return !isLogged ? children : <Navigate to="/dashboard" />;
};

function AppContent() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;