import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const AlertOctagonIcon = getIcon('AlertOctagon');
  const ArrowLeftIcon = getIcon('ArrowLeft');

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 text-accent"
      >
        <AlertOctagonIcon size={64} />
      </motion.div>
      
      <motion.h1 
        className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        404
      </motion.h1>
      
      <motion.h2 
        className="text-2xl md:text-3xl font-semibold mb-4"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Page Not Found
      </motion.h2>
      
      <motion.p 
        className="text-surface-600 dark:text-surface-300 max-w-md mb-10"
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link 
          to="/"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          <ArrowLeftIcon size={20} className="mr-2" />
          Back to Home
        </Link>
      </motion.div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-secondary"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      />
    </motion.div>
  );
};

export default NotFound;