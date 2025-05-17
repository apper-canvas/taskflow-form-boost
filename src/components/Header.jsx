import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      <div className="glass-effect border-b border-white/30 dark:border-surface-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-animate flex items-center justify-center text-white font-bold text-lg shadow-sm">
                TF
              </div> 
              <span className="text-xl font-bold gradient-text">TaskFlow</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => 
                  `px-5 py-2.5 rounded-xl transition-all duration-300 text-base ${
                    isActive 
                      ? 'nav-link-active' 
                      : 'hover:bg-white/30 dark:hover:bg-surface-700/30'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/tasks" 
                className={({ isActive }) => 
                  `px-5 py-2.5 rounded-xl transition-all duration-300 text-base ${
                    isActive 
                      ? 'nav-link-active' 
                      : 'hover:bg-white/30 dark:hover:bg-surface-700/30'
                  }`
                }
              >
                Tasks
              </NavLink>
              <NavLink 
                to="/calendar" 
                className={({ isActive }) => 
                  `px-5 py-2.5 rounded-xl transition-all duration-300 text-base ${
                    isActive 
                      ? 'nav-link-active' 
                      : 'hover:bg-white/30 dark:hover:bg-surface-700/30'
                  }`
                }
              >
                Calendar
              </NavLink>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2.5 rounded-lg glass-button hover:bg-white/30 dark:hover:bg-surface-700/30 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 12h16M4 6h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 dark:border-surface-700/20"
          >
            <nav className="flex flex-col space-y-2 p-4">
              <NavLink 
                to="/" 
                onClick={closeMenu}
                className={({ isActive }) => `px-4 py-3 rounded-xl ${isActive ? 'nav-link-active' : 'hover:bg-white/30 dark:hover:bg-surface-700/30'}`}
              >Dashboard</NavLink>
              <NavLink 
                to="/tasks" 
                onClick={closeMenu}
                className={({ isActive }) => `px-4 py-3 rounded-xl ${isActive ? 'nav-link-active' : 'hover:bg-white/30 dark:hover:bg-surface-700/30'}`}
              >Tasks</NavLink>
              <NavLink 
                to="/calendar" 
                onClick={closeMenu}
                className={({ isActive }) => `px-4 py-3 rounded-xl ${isActive ? 'nav-link-active' : 'hover:bg-white/30 dark:hover:bg-surface-700/30'}`}
              >Calendar</NavLink>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;