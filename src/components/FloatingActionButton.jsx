import { useState } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import NewTaskModal from './tasks/NewTaskModal';

const FloatingActionButton = ({ project = null }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  // Get icons
  const PlusIcon = getIcon('Plus');
  const TaskIcon = getIcon('CheckSquare');

  const openTaskModal = () => {
    setIsTaskModalOpen(true);
  };

  const handleTaskSuccess = () => {
    // You could add additional logic here if needed
    setIsTaskModalOpen(false);
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <button
          onClick={openTaskModal}
          className="bg-primary hover:bg-primary-dark text-white rounded-full w-14 h-14 flex items-center justify-center shadow-float transition-all duration-300 hover:shadow-lg hover:scale-105"
          aria-label="Add new task"
        >
          <PlusIcon size={24} />
        </button>
      </motion.div>

      <NewTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        initialProject={project?.Id || ''}
        onSuccess={handleTaskSuccess}
      />
    </>
  );
};

export default FloatingActionButton;