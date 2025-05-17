import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './features/projects/projectsSlice';
import userReducer from './store/userSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    user: userReducer,
  },
});