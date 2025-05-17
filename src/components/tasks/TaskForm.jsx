import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';
import { fetchProjects } from '../../services/projectService';
import { createTask, updateTask } from '../../services/taskService';

const TaskForm = ({ 
  task = null, 
  initialProject = '', 
  onSuccess, 
  onCancel 
}) => {
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

  // Get icons
  const LoaderIcon = getIcon('Loader');

  // Load projects for dropdown
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectData = await fetchProjects();
        setProjects(projectData);
      } catch (error) {
        toast.error("Failed to load projects: " + error.message);
      }
    };
    
    loadProjects();
  }, []);

  // If editing, populate form with task data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Not Started',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        priority: task.priority || 'Medium',
        assignee: task.assignee || '',
        projectId: task.project || initialProject || ''
      });
    } else if (initialProject) {
      setFormData(prev => ({
        ...prev,
        projectId: initialProject
      }));
    }
  }, [task, initialProject]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // Call the success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(task ? "Failed to update task" : "Failed to create task");
      console.error("Task operation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="title">
          Task Title*
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Enter task title"
          required
        />
      </div>
      
      <div>
        <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="input-field"
          rows="3"
          placeholder="Enter task description"
        ></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="projectId">
            Project
          </label>
          <select
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">Select Project</option>
            {projects.map(project => (
              <option key={project.Id} value={project.Id}>{project.Name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <div>
          <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="assignee">
            Assignee
          </label>
          <select
            id="assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">Select Assignee</option>
            {["Alex S.", "Jamie L.", "Taylor R.", "Morgan W.", "Casey P.", "Jordan B.", "Riley T.", "Blake M.", "Avery D."].map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-surface-700 dark:text-surface-300 mb-2" htmlFor="dueDate">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          className="btn bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-300 dark:border-surface-600 text-surface-800 dark:text-surface-200"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center"
          disabled={isLoading}
        >
          {isLoading ? <LoaderIcon className="animate-spin mr-2" size={16} /> : null}
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;