import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Provider store={store}>
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 via-surface-50 to-tertiary/5 dark:from-primary/10 dark:via-surface-900 dark:to-tertiary/10"></div>
        <div className="fixed -z-10 top-0 left-0 right-0 h-72 bg-gradient-to-r from-primary/8 via-tertiary/8 to-secondary/8 dark:from-primary/15 dark:via-tertiary/15 dark:to-secondary/15 blur-[120px]"></div>
        <div className="fixed -z-10 bottom-0 left-0 right-0 h-72 bg-gradient-to-r from-secondary/8 via-primary/8 to-tertiary/8 dark:from-secondary/15 dark:via-primary/15 dark:to-tertiary/15 blur-[120px]"></div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 floating"
        >
          <motion.button
            onClick={toggleDarkMode}
            className="p-3.5 rounded-full glass-effect hover:shadow-glow transition-all duration-300 border border-white/40 dark:border-surface-600/40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 drop-shadow-sm">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-700 drop-shadow-sm">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </motion.button>
        </motion.div>

        {/* Header with navigation */}
        <Header />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? 'dark' : 'light'}
          toastClassName={() => 
            'relative flex p-4 min-h-10 rounded-xl justify-between overflow-hidden cursor-pointer ' + 
            'bg-white/90 dark:bg-surface-800/90 backdrop-blur-md font-medium border border-white/50 dark:border-surface-700/50 ' + 
            'shadow-float'
          }
        />
      </div>
    </Provider>
  );
}

export default App;