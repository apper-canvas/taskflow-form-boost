import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createTask, updateTask } from '../../services/taskService';
import { fetchProjects } from '../../services/projectService';

const TaskForm = ({ task = null, initialProject = '', onSuccess, onCancel }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    dueDate: '',
    priority: 'Medium',
    assignee: '',
    projectId: initialProject || ''
  });

  // If task is provided, populate form with task data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Not Started',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority || 'Medium',
        assignee: task.assignee || '',
        projectId: task.project || initialProject
      });
    } else if (initialProject) {
      setFormData(prev => ({ ...prev, projectId: initialProject }));
    }
  }, [task, initialProject]);

  // Load projects for dropdown
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
        toast.error("Failed to load projects");
      }
    };

    loadProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (task) {
        // Update existing task
        await updateTask(task.Id, formData);
        toast.success("Task updated successfully");
      } else {
        // Create new task
        await createTask(formData);
        toast.success("Task created successfully");
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(task ? "Failed to update task" : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title*</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input-field"
          placeholder="Task title"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-field min-h-[100px]"
          placeholder="Task description"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="input-field">
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className="input-field">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Assignee</label>
          <select name="assignee" value={formData.assignee} onChange={handleChange} className="input-field">
            <option value="">Select Assignee</option>
            {["Alex S.", "Jamie L.", "Taylor R.", "Morgan W.", "Casey P.", "Jordan B.", "Riley T.", "Blake M.", "Avery D."].map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-outline" disabled={isLoading}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {task ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            <span>{task ? 'Update Task' : 'Create Task'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;