/**
 * Task Service - Handles all API operations for tasks
 */

// Get only updateable fields from the task table
const getUpdateableFields = (task) => {
  const updateableFields = [
    'Name',
    'Tags',
    'Owner',
    'title',
    'description',
    'status',
    'dueDate',
    'priority',
    'assignee',
    'project'
  ];
  
  const filteredTask = {};
  Object.keys(task).forEach(key => {
    if (updateableFields.includes(key)) {
      filteredTask[key] = task[key];
    }
  });
  
  return filteredTask;
};

/**
 * Fetch all tasks from the database
 */
export const fetchTasks = async (filters = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
        'ModifiedOn', 'ModifiedBy', 'title', 'description',
        'status', 'dueDate', 'priority', 'assignee', 'project'
      ],
      orderBy: [{ field: 'CreatedOn', direction: 'DESC' }],
      expands: [
        { name: 'project' }
      ]
    };

    // Add filters if provided
    if (filters.projectId) {
      params.where = [
        {
          fieldName: 'project',
          operator: 'ExactMatch',
          values: [filters.projectId]
        }
      ];
    }

    const response = await apperClient.fetchRecords('task2', params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Create a new task in the database
 */
export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Map fields to database schema and filter for updateable fields
    const mappedTask = {
      Name: taskData.title,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || 'Not Started',
      dueDate: taskData.dueDate,
      priority: taskData.priority || 'Medium',
      assignee: taskData.assignee,
      project: taskData.projectId
    };

    const filteredTask = getUpdateableFields(mappedTask);
    
    const response = await apperClient.createRecord('task2', {
      records: [filteredTask]
    });

    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create task');
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Update an existing task in the database
 */
export const updateTask = async (taskId, taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Map fields and filter for updateable fields
    const mappedTask = {
      Id: taskId,
      Name: taskData.title,
      project: taskData.projectId,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      assignee: taskData.assignee
    };

    const filteredTask = getUpdateableFields(mappedTask);
    filteredTask.Id = taskId; // ID must be included for updates
    
    const response = await apperClient.updateRecord('task2', {
      records: [filteredTask]
    });

    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to update task');
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
};