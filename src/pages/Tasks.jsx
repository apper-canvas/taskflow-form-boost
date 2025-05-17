import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { useState } from 'react';

const Tasks = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const PlusIcon = getIcon('Plus');
  
  const tasks = [
    { id: 1, title: "Design new landing page", priority: "high", status: "in progress", dueDate: "2023-08-25", assignee: "Alex S." },
    { id: 2, title: "Fix payment integration", priority: "urgent", status: "pending", dueDate: "2023-08-22", assignee: "Taylor R." },
    { id: 3, title: "Review marketing content", priority: "medium", status: "completed", dueDate: "2023-08-20", assignee: "Jamie L." },
    { id: 4, title: "Setup analytics dashboard", priority: "low", status: "in progress", dueDate: "2023-08-30", assignee: "Morgan W." },
    { id: 5, title: "User testing for v2.0", priority: "high", status: "pending", dueDate: "2023-08-28", assignee: "Casey P." },
    { id: 6, title: "Database optimization", priority: "medium", status: "completed", dueDate: "2023-08-18", assignee: "Blake M." }
  ];
  
  const filteredTasks = selectedStatus === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === selectedStatus);
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium">Completed</span>;
      case 'in progress':
        return <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium">In Progress</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs font-medium">Pending</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-xs font-medium">{status}</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button className="btn-primary flex items-center">
          <PlusIcon size={18} className="mr-2" />
          Add New Task
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <input 
            type="text"
            placeholder="Search tasks..."
            className="input-field pl-10"
          />
          <SearchIcon size={18} className="absolute left-3.5 top-3 text-surface-400" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedStatus === 'all' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'}`}
            onClick={() => setSelectedStatus('all')}
          >All</button>
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedStatus === 'pending' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'}`}
            onClick={() => setSelectedStatus('pending')}
          >Pending</button>
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedStatus === 'in progress' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'}`}
            onClick={() => setSelectedStatus('in progress')}
          >In Progress</button>
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedStatus === 'completed' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'}`}
            onClick={() => setSelectedStatus('completed')}
          >Completed</button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-100/70 dark:bg-surface-700/70 backdrop-blur-sm">
              <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-xl">Task</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Priority</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Due Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Assignee</th>
              <th className="px-4 py-3 text-right text-sm font-semibold rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/50">
                <td className="px-4 py-4 text-sm font-medium">{task.title}</td>
                <td className="px-4 py-4">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                </td>
                <td className="px-4 py-4">{getStatusBadge(task.status)}</td>
                <td className="px-4 py-4 text-sm">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-sm">{task.assignee}</td>
                <td className="px-4 py-4 text-right space-x-2">
                  <button className="px-2 py-1 text-xs rounded-md bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors">Edit</button>
                  <button className="px-2 py-1 text-xs rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Tasks;