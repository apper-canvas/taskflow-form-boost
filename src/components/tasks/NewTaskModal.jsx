import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import TaskForm from './TaskForm';

const NewTaskModal = ({
  isOpen,
  onClose,
  task = null,
  initialProject = '',
  onSuccess
}) => {
  const XIcon = getIcon('X');

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="flex items-center justify-center min-h-screen p-4">
        <motion.div 
          className="relative w-full max-w-2xl glass-card border border-white/30 dark:border-surface-700/30 shadow-float"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button className="p-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors" onClick={onClose}>
              <XIcon size={20} />
            </button>
          </div>
          <TaskForm task={task} initialProject={initialProject} onSuccess={handleSuccess} onCancel={onClose} />
        </motion.div>
      </div>
    </div>
  );
};

export default NewTaskModal;