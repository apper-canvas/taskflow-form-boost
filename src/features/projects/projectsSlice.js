import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchProjects, 
  createNewProject, 
  deleteProject as deleteProjectService,
  fetchProjectById as fetchProjectByIdService,
  updateProject as updateProjectService } from '../../services/projectService';

const initialState = {
  projects: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentProject: null
};

// Async thunk to fetch projects
export const fetchAllProjects = createAsyncThunk('projects/fetchAll', async () => {
  return await fetchProjects();
};

// Async thunk to fetch a single project by ID
export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (projectId, { rejectWithValue }) => {
    try {
      const project = await fetchProjectByIdService(projectId);
      if (!project) {
        return rejectWithValue('Project not found');
      }
      return project;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch project');
    }
  }
);

// Async thunk to create a project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { dispatch }) => {
    try {
      dispatch(updateProjectStatus('loading'));
      const result = await createNewProject(projectData);
      dispatch(updateProjectStatus('succeeded'));
      return result;
    } catch (error) {
      dispatch(updateProjectStatus('failed'));
      throw error;
    }
  }
);

// Async thunk to update a project
export const updateProject = createAsyncThunk(
  'projects/update',
  async (projectData, { rejectWithValue }) => {
    try {
      // Ensure we have the ID
      if (!projectData.id) {
        return rejectWithValue('Project ID is required for updates');
      }
      
      const result = await updateProjectService(projectData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update project');
    }
  }
);

// Async thunk to delete a project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (projectId, { rejectWithValue }) => {
    try {
      await deleteProjectService(projectId);
      return projectId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete project');
    }
  }
);

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Update project loading state
    updateProjectStatus(state, action) {
      state.status = action.payload;
    },
    // Set the current project for editing or viewing details
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
    },
    // Clear the current project
    clearCurrentProject(state) {
      state.currentProject = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchAllProjects.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Map database fields to frontend property names
        state.projects = action.payload.map(project => ({
          id: project.Id,
          name: project.Name,
          description: project.description,
          progress: project.progress || 0,
          tasks: project.tasks || 0,
          completedTasks: project.completedTasks || 0,
          dueDate: project.dueDate,
          team: project.team || [],
          createdAt: project.CreatedOn
        }));
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Fetch a single project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Map database record to frontend format
        const project = action.payload;
        state.currentProject = {
          id: project.Id,
          name: project.Name,
          description: project.description,
          progress: project.progress || 0,
          tasks: project.tasks || 0,
          completedTasks: project.completedTasks || 0,
          dueDate: project.dueDate,
          team: project.team || [],
          createdAt: project.CreatedOn
        };
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      
      // Create a new project
      .addCase(createProject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add the newly created project to the state
        const newProject = action.payload;
        state.projects.unshift({
          id: newProject.Id,
          name: newProject.Name,
          description: newProject.description,
          progress: newProject.progress || 0,
          tasks: newProject.tasks || 0,
          completedTasks: newProject.completedTasks || 0,
          dueDate: newProject.dueDate,
          team: newProject.team || [],
          createdAt: newProject.CreatedOn
        });
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      
      // Update a project
      .addCase(updateProject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Find and update the project in the state
        const updatedProject = action.payload;
        const index = state.projects.findIndex(project => project.id === updatedProject.Id);
        if (index !== -1) {
          // Update the existing project with new data
          state.projects[index] = {
            id: updatedProject.Id,
            name: updatedProject.Name,
            description: updatedProject.description,
            progress: updatedProject.progress || 0,
            tasks: updatedProject.tasks || 0,
            completedTasks: updatedProject.completedTasks || 0,
            dueDate: updatedProject.dueDate,
            team: updatedProject.team || [],
            createdAt: updatedProject.CreatedOn
          };
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      
      // Delete a project
      .addCase(deleteProject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove the deleted project from state
        state.projects = state.projects.filter(project => project.id !== action.payload);
        // Clear current project if it was the one deleted
        if (state.currentProject && state.currentProject.id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  }
});

// Export actions
export const { updateProjectStatus, setCurrentProject, clearCurrentProject } = projectsSlice.actions;

// Selectors
export const selectAllProjects = state => state.projects.projects || [];
export const selectCurrentProject = state => state.projects.currentProject;
export const selectProjectById = (state, projectId) => 
  state.projects.projects.find(project => project.id === projectId);
export const selectProjectStatus = state => state.projects.status;
export const selectProjectError = state => state.projects.error;

export default projectsSlice.reducer;