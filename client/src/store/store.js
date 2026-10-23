import { configureStore } from '@reduxjs/toolkit';
import applicationsReducer from './applicationsSlice';
import resumeReducer from './resumeSlice';

export const store = configureStore({
  reducer: {
    applications: applicationsReducer,
    resume: resumeReducer,
  },
});
