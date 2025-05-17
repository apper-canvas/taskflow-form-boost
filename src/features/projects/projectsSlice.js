import { createSlice, nanoid } from '@reduxjs/toolkit';

// Initial sample projects data
const initialState = {
  projects: [
    { 
      id: '1', 
      name: "Website Redesign", 
      description: "Complete overhaul of company website with modern design", 
      progress: 75, 
      tasks: 24, 
      completedTasks: 18,
      dueDate: "2023-07-15", 
      team: ["Alex S.", "Jamie L.", "Taylor R."],
      createdAt: "2023-05-01"
    },
    { 
      id: '2', 
      name: "Mobile App Development", 
      description: "Create iOS and Android versions of customer portal", 
      progress: 45, 
      tasks: 32, 
      completedTasks: 14,
      dueDate: "2023-09-30", 
      team: ["Morgan W.", "Casey P.", "Jordan B.", "Riley T."],
      createdAt: "2023-06-15"
    },
    { 
      id: '3', 
      name: "Product Launch Campaign", 
      description: "Plan and execute marketing campaign for new product", 
      progress: 30, 
      tasks: 18, 
      completedTasks: 5,
      dueDate: "2023-08-10", 
      team: ["Blake M.", "Avery D."],
      createdAt: "2023-07-01"
    }
  ],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Add a new project
    createProject: {
      reducer(state, action) {
        // Set status to 'loading' to simulate API call
        state.status = 'loading';
        
        // In a real app, this would be handled by createAsyncThunk
        setTimeout(() => {
          state.status = 'succeeded';
          state.projects.push(action.payload);
        }, 500);
      },
      prepare(projectData) {
        // Generate an ID and add creation date
        const today = new Date().toISOString().split('T')[0];
        return {
          payload: {
            id: nanoid(),
            ...projectData,
            progress: 0,
            tasks: 0,
            completedTasks: 0,
            createdAt: today
          }
        };
      }
    },
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
    }
  }
});

// Export actions and reducer
export const { createProject, deleteProject, updateProject, updateProjectStatus } = projectsSlice.actions;

// Export selectors
export const selectAllProjects = state => state.projects.projects;
export const selectProjectStatus = state => state.projects.status;

export default projectsSlice.reducer;