import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';
import NewTaskModal from './tasks/NewTaskModal';
import NewProjectModal from './projects/NewProjectModal';

const FloatingActionButton = ({ project = null }) => {
  const navigate = useNavigate();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Get icons
  const PlusIcon = getIcon('Plus');
  const TaskIcon = getIcon('CheckSquare');
  const ProjectIcon = getIcon('Folder');
  const CloseIcon = getIcon('X');

  const openTaskModal = () => {
    setIsTaskModalOpen(true);
    setIsMenuOpen(false);
  };

  const openProjectModal = () => {
    setIsProjectModalOpen(true);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goToTasksPage = () => {
    navigate('/tasks');
    setIsMenuOpen(false);
  };

  const handleTaskSuccess = () => {
    // You could add additional logic here if needed
    setIsTaskModalOpen(false);
  };
  
  const handleProjectSuccess = () => {
    setIsProjectModalOpen(false);
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
      >
        {isMenuOpen && (
          <motion.div 
            className="flex flex-col gap-3 mb-3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <button onClick={goToTasksPage} className="bg-tertiary hover:bg-tertiary-dark text-white rounded-full w-12 h-12 flex items-center justify-center shadow-float transition-all duration-300 hover:shadow-lg hover:scale-105">
              <TaskIcon size={20} />
            </button>
            <button onClick={openProjectModal} className="bg-secondary hover:bg-secondary-dark text-white rounded-full w-12 h-12 flex items-center justify-center shadow-float transition-all duration-300 hover:shadow-lg hover:scale-105">
              <ProjectIcon size={20} />
            </button>
          </motion.div>
        )}
        
        <button
          onClick={toggleMenu}
          className="bg-primary hover:bg-primary-dark text-white rounded-full w-14 h-14 flex items-center justify-center shadow-float transition-all duration-300 hover:shadow-lg hover:scale-105 relative"
          aria-label={isMenuOpen ? "Close menu" : "Open actions menu"}
        >
          {isMenuOpen ? <CloseIcon size={24} /> : <PlusIcon size={24} />}
        </button>
      </motion.div>
      
      <NewTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} initialProject={project?.Id || ''} onSuccess={handleTaskSuccess} />
      <NewProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} onSuccess={handleProjectSuccess} />
    </>
  );
};

export default FloatingActionButton;