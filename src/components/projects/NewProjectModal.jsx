import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
import ProjectForm from './ProjectForm';
import { createProject, selectProjectStatus, updateProjectStatus } from '../../features/projects/projectsSlice';

const NewProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const status = useSelector(selectProjectStatus);
  const XIcon = getIcon('X');
  
  // Reset form on close
  useEffect(() => {
    if (!isOpen) {
      // Reset status when modal is closed
      if (status !== 'idle') {
        dispatch(updateProjectStatus('idle'));
      }
    }
  }, [isOpen, dispatch, status]);

  const handleSubmit = async (projectData) => {
    try {
      // createProject is now a thunk that makes an API call
      await dispatch(createProject(projectData)).unwrap();
      
      // Show success message
      toast.success(`Project "${projectData.name}" created successfully!`);
      
      // Close modal and reset status
      dispatch(updateProjectStatus('idle'));
      onClose();
    } catch (error) {
      // Handle error
      toast.error(`Failed to create project: ${error.message}`);
      dispatch(updateProjectStatus('failed'));
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div 
              className="relative w-full max-w-2xl glass-card border border-white/30 dark:border-surface-700/30 shadow-float"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <button className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors" onClick={onClose}>
                  <XIcon size={20} />
                </button>
              </div>
              <ProjectForm onSubmit={handleSubmit} isLoading={status === 'loading'} />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewProjectModal;