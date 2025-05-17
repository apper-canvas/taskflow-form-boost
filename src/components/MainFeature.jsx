import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const MainFeature = ({ project }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo', priority: 'medium' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [kanbanView, setKanbanView] = useState(true);

  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash2');
  const EditIcon = getIcon('Edit');
  const CalendarIcon = getIcon('Calendar');
  const TagIcon = getIcon('Tag');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ClockIcon = getIcon('Clock');  
  const XIcon = getIcon('X');
  const KanbanIcon = getIcon('LayoutGrid');
  const ListIcon = getIcon('List');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const ClipboardListIcon = getIcon('ClipboardList');

  useEffect(() => {
    if (project) {
      // Simulate getting tasks for the selected project
      const demoTasks = [
        { 
          id: 1, 
          title: 'Create wireframes', 
          description: 'Design initial wireframes for homepage and dashboard',
          status: 'done',
          priority: 'high',
          dueDate: '2023-06-20',
        },
        { 
          id: 2, 
          title: 'Develop authentication flow', 
          description: 'Implement login, registration, and password reset functionality',
          status: 'inprogress',
          priority: 'high',
          dueDate: '2023-06-25',
        },
        { 
          id: 3, 
          title: 'Write API documentation', 
          description: 'Document all REST API endpoints for frontend developers',
          status: 'todo',
          priority: 'medium',
          dueDate: '2023-07-01',
        },
        { 
          id: 4, 
          title: 'Test user profiles', 
          description: 'Verify that user profile updates work correctly',
          status: 'todo',
          priority: 'low',
          dueDate: '2023-07-10',
        },
      ];
      setTasks(demoTasks);
    }
  }, [project]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id ? { ...task, ...newTask } : task
      );
      setTasks(updatedTasks);
      toast.success("Task updated successfully!");
      setEditingTask(null);
    } else {
      // Add new task
      const task = {
        id: Date.now(),
        ...newTask
      };
      setTasks([...tasks, task]);
      toast.success("New task added!");
    }
    
    setNewTask({ title: '', description: '', status: 'todo', priority: 'medium' });
    setIsFormVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully!");
  };

  const handleEdit = (task) => {
    setNewTask({ ...task });
    setEditingTask(task);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setNewTask({ title: '', description: '', status: 'todo', priority: 'medium' });
    setEditingTask(null);
    setIsFormVisible(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inprogress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'todo': return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200';
      default: return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200';
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case 'done': return 'Done';
      case 'inprogress': return 'In Progress';
      case 'todo': return 'To Do';
      default: return status;
    }
  };

  const kanbanColumns = [
    { id: 'todo', name: 'To Do' },
    { id: 'inprogress', name: 'In Progress' },
    { id: 'done', name: 'Done' }
  ];

  const tasksByStatus = kanbanColumns.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id);
    return acc;
  }, {});

  const slideIn = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  if (!project) {
    return (
      <motion.div 
        className="h-full flex flex-col items-center justify-center p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card max-w-md animate-float">
          <div className="text-primary mb-4">
            <ClipboardListIcon size={48} />
          </div>
          <h3 className="text-2xl font-bold mb-3">Welcome to TaskFlow</h3>
          <p className="text-surface-600 dark:text-surface-300 mb-6">
            Select a project from the list to view and manage its tasks, or create a new project to get started.
          </p>
          <div className="py-2 px-4 glass-button text-primary font-medium inline-flex items-center animate-bounce-subtle">
            <ArrowLeftIcon size={18} className="mr-2 animate-pulse-subtle" />
            Select a project
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p className="text-surface-600 dark:text-surface-300">{project.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-100 dark:bg-surface-800 rounded-lg overflow-hidden p-1">
            <button
              className={`p-2 rounded-lg ${kanbanView ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-float' : 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'}`}
              onClick={() => setKanbanView(true)}
              aria-label="Kanban view"
            >
              <KanbanIcon size={20} />
            </button>
            <button 
              className={`p-2 rounded ${!kanbanView ? 'bg-primary text-white' : 'text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700'}`}
              onClick={() => setKanbanView(false)}
              aria-label="List view"
            >
              <ListIcon size={18} />
            </button>
          </div>
          <button 
            onClick={() => {
              setIsFormVisible(true);
              setEditingTask(null);
              setNewTask({ title: '', description: '', status: 'todo', priority: 'medium' });
            }}
            className="btn-primary"
          >
            <PlusIcon size={18} className="mr-1" />
            Add Task
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFormVisible && (
          <motion.div 
            className="mb-6"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
          >
            <form onSubmit={handleSubmit} className="card-glass">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{editingTask ? 'Edit Task' : 'New Task'}</h3>
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="p-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                >
                  <XIcon size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Task title"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleChange}
                    className="input-field min-h-[100px]"
                    placeholder="Task description"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={newTask.status}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate || ''}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary shadow-float"
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {kanbanView ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kanbanColumns.map(column => (
            <div key={column.id} className="glass-effect rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                {column.name}
                <span className="ml-2 glass-effect rounded-full px-2 py-0.5 text-xs">
                  {tasksByStatus[column.id]?.length || 0}
                </span>
              </h3> 
              <div className="space-y-3">
                <AnimatePresence>
                  {tasksByStatus[column.id]?.length ? (
                    tasksByStatus[column.id].map(task => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="glass-card hover:shadow-float transition-all duration-300"
                      >
                        <div className="mb-2 flex justify-between items-start">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} 
                          </span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleEdit(task)}
                              className="p-1 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                              aria-label="Edit task"
                            >
                              <EditIcon size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(task.id)}
                              className="p-1 text-surface-500 hover:text-red-500"
                              aria-label="Delete task"
                            >
                              <TrashIcon size={16} />
                            </button>
                          </div>
                        </div>
                        <h4 className="font-medium mb-1">{task.title}</h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400 mb-3 line-clamp-2">{task.description}</p>
                        {task.dueDate && (
                          <div className="flex items-center text-xs text-surface-500">
                            <CalendarIcon size={14} className="mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      className="py-8 flex flex-col items-center justify-center text-center text-surface-500"
                    >
                      <div className="mb-2 opacity-70">
                        {column.id === 'todo' ? <ClipboardListIcon size={24} /> : 
                         column.id === 'inprogress' ? <ClockIcon size={24} /> :
                         <CheckCircleIcon size={24} />} 
                      </div>
                      <p className="text-sm">No tasks here</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead className="bg-surface-100/70 dark:bg-surface-700/70">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Task</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Priority</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Due Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                <AnimatePresence>
                  {tasks.length > 0 ? (
                    tasks.map(task => (
                      <motion.tr 
                        key={task.id}
                        variants={slideIn}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium">{task.title}</div>
                            <div className="text-xs text-surface-500 dark:text-surface-400 line-clamp-1">{task.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {getStatusName(task.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            <TagIcon size={12} className="mr-1" />
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleEdit(task)} 
                            className="text-primary hover:text-primary-dark mr-3"
                            aria-label="Edit task"
                          >
                            <EditIcon size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(task.id)} 
                            className="text-red-500 hover:text-red-700"
                            aria-label="Delete task"
                          >
                            <TrashIcon size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                    >
                      <td colSpan={5} className="px-6 py-10 text-center text-surface-500">
                        <div className="flex flex-col items-center">
                          <ClockIcon size={32} className="mb-2 opacity-70" />
                          <p>No tasks found for this project</p>
                          <button 
                            onClick={() => {
                              setIsFormVisible(true);
                              setEditingTask(null);
                              setNewTask({ title: '', description: '', status: 'todo', priority: 'medium' });
                            }}
                            className="mt-3 text-primary hover:text-primary-dark font-medium text-sm flex items-center"
                          >
                            <PlusIcon size={16} className="mr-1" />
                            Add your first task
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MainFeature;