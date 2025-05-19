import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../App';
import { fetchTasks, updateTask } from '../services/taskService';
import { getIcon } from '../utils/iconUtils';
import FloatingActionButton from '../components/FloatingActionButton';
import NewTaskModal from '../components/tasks/NewTaskModal';

const Tasks = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Get icons
  const EditIcon = getIcon('Edit');
  const CheckIcon = getIcon('Check');
  const ClockIcon = getIcon('Clock');
  const AlertIcon = getIcon('AlertTriangle');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Load tasks from the database
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const tasksData = await fetchTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error loading tasks:", error);
        toast.error("Failed to load tasks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      loadTasks();
    }
  }, [isAuthenticated]);
  
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };
  
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      
      // Update local state after successful update
      setTasks(tasks.map(task => 
        task.Id === taskId ? { ...task, status: newStatus } : task
      ));
      
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };
  
  const handleTaskUpdate = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
    
    // Reload tasks after update
    const loadTasks = async () => {
      try {
        const tasksData = await fetchTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error reloading tasks:", error);
      }
    };
    
    loadTasks();
  };
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-orange-500';
      case 'Low': return 'text-green-500';
      default: return 'text-surface-500';
    }
  };
  
  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-surface-800 dark:text-surface-100">Tasks</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-surface-600 dark:text-surface-400 mb-4">No tasks found</h3>
          <p className="text-surface-500 dark:text-surface-500">Create a new task to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map(task => (
            <motion.div 
              key={task.Id} 
              className="p-5 rounded-xl bg-white/70 dark:bg-surface-800/70 backdrop-blur-md border border-white/50 dark:border-surface-700/50 shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                  <p className="text-surface-600 dark:text-surface-400 text-sm line-clamp-2">{task.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEditTask(task)} className="p-2 rounded-full bg-surface-200/70 dark:bg-surface-700/70 hover:bg-surface-300/70 dark:hover:bg-surface-600/70 transition-colors">
                    <EditIcon size={16} />
                  </button>
                  {task.status !== 'Completed' && (
                    <button onClick={() => handleStatusChange(task.Id, 'Completed')} className="p-2 rounded-full bg-green-100/70 dark:bg-green-900/30 hover:bg-green-200/70 dark:hover:bg-green-800/30 text-green-600 dark:text-green-400 transition-colors">
                      <CheckIcon size={16} />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-4 text-xs text-surface-500 dark:text-surface-400">
                <span className={`font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                <span>{task.status}</span>
                <span>{task.dueDate && new Date(task.dueDate).toLocaleDateString()}</span>
                {task.assignee && <span>{task.assignee}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <FloatingActionButton />
      
      {isEditModalOpen && (
        <NewTaskModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={selectedTask}
          onSuccess={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default Tasks;