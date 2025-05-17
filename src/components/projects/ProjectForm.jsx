import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { toast } from 'react-toastify';

const ProjectForm = ({ project = {}, onSubmit, isLoading = false }) => {
  // Get required icons
  const AlertCircleIcon = getIcon('AlertCircle');
  const CalendarIcon = getIcon('Calendar');
  const UsersIcon = getIcon('Users');
  const LoaderIcon = getIcon('Loader');

  // Get min date for due date (today)
  const today = new Date().toISOString().split('T')[0];
  
  // Initialize form state with project data or defaults
  const [formData, setFormData] = useState({
    name: project.name || '',
    description: project.description || '',
    dueDate: project.dueDate || '',
    team: project.team || []
  });
  
  // Available team members
  const [availableTeamMembers, setAvailableTeamMembers] = useState([
    "Alex S.", "Jamie L.", "Taylor R.", "Morgan W.", "Casey P.", "Jordan B.", "Riley T.", "Blake M.", "Avery D."
  ]);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');

  // Form errors state
  const [errors, setErrors] = useState({});
  
  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle adding team members
  const handleAddTeamMember = () => {
    if (selectedTeamMember && !formData.team.includes(selectedTeamMember)) {
      setFormData(prev => ({
        ...prev,
        team: [...prev.team, selectedTeamMember]
      }));
      setSelectedTeamMember('');
    }
  };
  
  // Handle removing team members
  const handleRemoveTeamMember = (member) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(m => m !== member)
    }));
  };
  
  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast.error('Please fix the errors in the form before submitting');
    }
  };
  
  // Animation variants
  const inputVariants = {
    error: { x: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } },
    normal: { x: 0 }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Project Name
        </label>
        <motion.div
          variants={inputVariants}
          animate={errors.name ? 'error' : 'normal'}
        >
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? 'border-red-500 dark:border-red-400' : ''}`}
            placeholder="Enter project name"
            disabled={isLoading}
          />
        </motion.div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircleIcon size={14} className="mr-1" /> {errors.name}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <motion.div
          variants={inputVariants}
          animate={errors.description ? 'error' : 'normal'}
        >
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className={`input-field resize-none ${errors.description ? 'border-red-500 dark:border-red-400' : ''}`}
            placeholder="Describe the project"
            disabled={isLoading}
          ></textarea>
        </motion.div>
        {errors.description && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircleIcon size={14} className="mr-1" /> {errors.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="dueDate" className="block text-sm font-medium">
          Due Date
        </label>
        <div className="relative">
          <motion.div
            variants={inputVariants}
            animate={errors.dueDate ? 'error' : 'normal'}
          >
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={today}
              className={`input-field pl-10 ${errors.dueDate ? 'border-red-500 dark:border-red-400' : ''}`}
              disabled={isLoading}
            />
          </motion.div>
          <CalendarIcon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
        </div>
        {errors.dueDate && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircleIcon size={14} className="mr-1" /> {errors.dueDate}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="team" className="block text-sm font-medium">
          Team Members
        </label>
        
        <div className="flex space-x-2 mb-2">
          <select
            className="input-field flex-grow"
            value={selectedTeamMember}
            onChange={(e) => setSelectedTeamMember(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Select team member</option>
            {availableTeamMembers
              .filter(member => !formData.team.includes(member))
              .map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
          </select>
          <button 
            type="button" 
            onClick={handleAddTeamMember}
            className="btn-primary" 
            disabled={!selectedTeamMember || isLoading}
          >
            Add
          </button>
        </div>
        
        {formData.team.length === 0 ? (
          <p className="text-surface-500 dark:text-surface-400 italic text-sm">No team members added yet</p>
        ) : (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.team.map(member => (
              <div key={member} className="bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-md flex items-center">
                <span>{member}</span>
                <button 
                  type="button" 
                  className="ml-2 text-surface-500 hover:text-red-500"
                  onClick={() => handleRemoveTeamMember(member)}
                  disabled={isLoading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200 dark:border-surface-700">
        <button
          type="button"
          onClick={() => onSubmit(null)}
          className="btn-outline"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderIcon size={18} className="mr-2 animate-spin" />
              Creating...
            </>
          ) : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;