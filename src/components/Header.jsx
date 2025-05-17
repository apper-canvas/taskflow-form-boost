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
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-effect border-b border-white/20 dark:border-surface-700/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-gradient-animate flex items-center justify-center text-white font-bold text-lg">
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
                  `px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-medium' 
                      : 'hover:bg-white/20 dark:hover:bg-surface-700/20'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/tasks" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-medium' 
                      : 'hover:bg-white/20 dark:hover:bg-surface-700/20'
                  }`
                }
              >
                Tasks
              </NavLink>
              <NavLink 
                to="/calendar" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-medium' 
                      : 'hover:bg-white/20 dark:hover:bg-surface-700/20'
                  }`
                }
              >
                Calendar
              </NavLink>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-white/20 dark:hover:bg-surface-700/20 transition-colors"
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
      </div>
    </header>
  );
};

export default Header;