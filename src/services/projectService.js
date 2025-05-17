/**
 * Project Service - Handles all API operations for projects
 */

// Get only updateable fields from the project table
const getUpdateableFields = (project) => {
  const updateableFields = [
    'Name',
    'Tags',
    'Owner',
    'description',
    'progress',
    'tasks',
    'completedTasks',
    'dueDate',
    'team'
  ];
  
  const filteredProject = {};
  Object.keys(project).forEach(key => {
    if (updateableFields.includes(key)) {
      filteredProject[key] = project[key];
    }
  });
  
  return filteredProject;
};

/**
 * Fetch all projects from the database
 */
export const fetchProjects = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.fetchRecords('project1', {
      fields: [
        'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
        'ModifiedOn', 'ModifiedBy', 'description', 'progress',
        'tasks', 'completedTasks', 'dueDate', 'team'
      ],
      orderBy: [{ field: 'CreatedOn', direction: 'DESC' }]
    });

    return response.data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * Fetch a single project by ID
 */
export const fetchProjectById = async (projectId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('project1', projectId);
    return response.data || null;
  } catch (error) {
    console.error(`Error fetching project with ID ${projectId}:`, error);
    throw error;
  }
};

/**
 * Create a new project in the database
 */
export const createNewProject = async (projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Map fields to database schema and filter for updateable fields
    const mappedProject = {
      Name: projectData.name,
      description: projectData.description,
      progress: projectData.progress || 0,
      tasks: projectData.tasks || 0,
      completedTasks: projectData.completedTasks || 0,
      dueDate: projectData.dueDate,
      team: projectData.team
    };

    const filteredProject = getUpdateableFields(mappedProject);
    
    const response = await apperClient.createRecord('project1', {
      records: [filteredProject]
    });

    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error('Failed to create project');
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Delete a project from the database
 */
export const deleteProject = async (projectId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.deleteRecord('project1', {
      RecordIds: [projectId]
    });
    
    return response && response.success;
  } catch (error) {
    console.error(`Error deleting project with ID ${projectId}:`, error);
    throw error;
  }
};