import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProjects, createNewProject, deleteProject as deleteProjectService } from '../../services/projectService';

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

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Add a new project
    // Update project loading state
    updateProjectStatus(state, action) {
      state.status = action.payload;
    },
    // Delete a project
    deleteProject(state, action) {
      state.projects = state.projects.filter(project => project.id !== action.payload);
    },
    // Update a project
    updateProject(state, action) {
      const { id, ...changes } = action.payload;
      const existingProject = state.projects.find(project => project.id === id);
      if (existingProject) {
        Object.assign(existingProject, changes);
      }
    },
    setCurrentProject(state, action) {
      state.currentProject = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchAllProjects.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
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
      });
  }
});

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

// Export actions
export const { 
  updateProject, 
  updateProjectStatus,
  setCurrentProject,
  deleteProject
};

export const selectAllProjects = state => state.projects.projects || [];
export const selectCurrentProject = state => state.projects.currentProject;
export default projectsSlice.reducer;