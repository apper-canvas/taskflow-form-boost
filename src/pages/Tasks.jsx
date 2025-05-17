import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { fetchTasks, createTask, updateTask } from '../services/taskService';
import { fetchProjects } from '../services/projectService';

import NewTaskModal from '../components/tasks/NewTaskModal';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    dueDate: '',
    priority: 'Medium',
    assignee: '',
    projectId: ''
  });
  const [filterStatus, setFilterStatus] = useState('All');

  // Get icons
  const PlusIcon = getIcon('Plus');
  const LoaderIcon = getIcon('Loader');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ClockIcon = getIcon('Clock');
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const XIcon = getIcon('X');
  const CheckSquareIcon = getIcon('CheckSquare');
  const FolderIcon = getIcon('Folder');
  const UserIcon = getIcon('User');
  const CalendarIcon = getIcon('Calendar');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load projects first
        const projectData = await fetchProjects();
        setProjects(projectData);
        
        // Then load tasks
        const taskData = await fetchTasks();
        setTasks(taskData);
        
      } catch (error) {
        toast.error("Failed to load data: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm({
      ...taskForm,
      [name]: value
    });
  };

  // Open task modal for creation
  const openNewTaskModal = () => {
    setSelectedTask(null);
    setTaskForm({
      title: '',
      description: '',
      status: 'Not Started',
      dueDate: '',
      priority: 'Medium',
      assignee: '',
      projectId: ''
    });
    setIsTaskModalOpen(true);
  };

  // Open task modal for editing
  const openEditTaskModal = (task) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate?.split('T')[0] || '',
      priority: task.priority,
      assignee: task.assignee,
      projectId: task.project || ''
    });
    setIsTaskModalOpen(true);
  };

  // Handle task creation/update
  const handleTaskSubmit = async (e) => {
    // Reload tasks after successful task creation/update
    try {  
      const updatedTasks = await fetchTasks();
      setTasks(updatedTasks);      
      setIsTaskModalOpen(false);
      return true;
            
    } catch (error) {
      toast.error(selectedTask ? "Failed to update task" : "Failed to create task");
    }
  };

  // Handle status change for a task
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task.Id === taskId);
      await updateTask(taskId, { ...taskToUpdate, status: newStatus });
      
      // Update local state
      setTasks(tasks.map(task => 
        task.Id === taskId ? { ...task, status: newStatus } : task
      ));
      
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  // Filter tasks by status
  const filteredTasks = filterStatus === 'All' 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon className="animate-spin h-12 w-12 text-primary" />
        <p className="ml-2 text-xl">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex rounded-lg bg-white/30 dark:bg-surface-800/30 p-1 backdrop-blur-sm">
            {['All', 'Not Started', 'In Progress', 'Completed'].map(status => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-primary text-white'
                    : 'hover:bg-white/20 dark:hover:bg-surface-700/30'
                }`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <button 
            onClick={openNewTaskModal}
            className="btn-primary flex items-center justify-center"
          >
            <PlusIcon size={18} className="mr-1.5" />
            New Task
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-surface-500 dark:text-surface-400 mb-4">No tasks found</p>
            <button 
              onClick={openNewTaskModal}
              className="btn-outline flex items-center justify-center mx-auto"
            >
              <PlusIcon size={18} className="mr-1.5" />
              Create First Task
            </button>
          </div>
        ) : (
          filteredTasks.map(task => (
            <motion.div
              key={task.Id}
              className="card-glass hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-1">
                  <h3 
                    className="text-xl font-bold mb-2 cursor-pointer hover:text-primary"
                    onClick={() => openEditTaskModal(task)}
                  >
                    {task.title}
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-4">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center text-sm bg-surface-200/50 dark:bg-surface-700/50 px-3 py-1 rounded-full">
                      <FolderIcon size={14} className="mr-1.5 text-primary" />
                      {projects.find(p => p.Id === task.project)?.Name || 'No Project'}
                    </div>
                    
                    <div className="flex items-center text-sm bg-surface-200/50 dark:bg-surface-700/50 px-3 py-1 rounded-full">
                      <UserIcon size={14} className="mr-1.5 text-tertiary" />
                      {task.assignee || 'Unassigned'}
                    </div>
                    
                    <div className="flex items-center text-sm bg-surface-200/50 dark:bg-surface-700/50 px-3 py-1 rounded-full">
                      <CalendarIcon size={14} className="mr-1.5 text-secondary" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </div>
                    
                    <div className={`flex items-center text-sm px-3 py-1 rounded-full ${
                      task.priority === 'High' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                        : task.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      <AlertTriangleIcon size={14} className="mr-1.5" />
                      {task.priority} Priority
                    </div>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-2 mt-4 md:mt-0 md:ml-4">
                  <button 
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
                      task.status === 'Completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : task.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                    }`}
                  >
                    {task.status === 'Completed' ? (
                      <CheckCircleIcon size={14} className="mr-1.5" />
                    ) : task.status === 'In Progress' ? (
                      <ClockIcon size={14} className="mr-1.5" />
                    ) : (
                      <CheckSquareIcon size={14} className="mr-1.5" />
                    )}
                    {task.status}
                  </button>
                  
                  {task.status !== 'Completed' && (
                    <button
                      onClick={() => handleStatusChange(task.Id, 'Completed')}
                      className="px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-lg text-sm font-medium flex items-center"
                    >
                      <CheckCircleIcon size={14} className="mr-1.5" />
                      Mark Complete
                    </button>
                  )}
                  
                  {task.status === 'Not Started' && (
                    <button
                      onClick={() => handleStatusChange(task.Id, 'In Progress')}
                      className="px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-sm font-medium flex items-center"
                    >
                      <ClockIcon size={14} className="mr-1.5" />
                      Start Task
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Task Modal */}
      <NewTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        initialProject={selectedTask?.project || ''}
        onSuccess={handleTaskSubmit}
      />
      
    </div>
  );
};

export default Tasks;