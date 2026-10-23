import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationsAPI } from '../api/client';

export const fetchApplications = createAsyncThunk('applications/fetchAll', async () => {
  const res = await applicationsAPI.getAll();
  return res.data;
});

export const fetchApplication = createAsyncThunk('applications/fetchOne', async (id) => {
  const res = await applicationsAPI.getOne(id);
  return res.data;
});

export const createApplication = createAsyncThunk('applications/create', async (data) => {
  const res = await applicationsAPI.create(data);
  return res.data;
});

export const updateApplication = createAsyncThunk('applications/update', async ({ id, data }) => {
  const res = await applicationsAPI.update(id, data);
  return res.data;
});

export const deleteApplication = createAsyncThunk('applications/delete', async (id) => {
  await applicationsAPI.delete(id);
  return id;
});

export const fetchStats = createAsyncThunk('applications/fetchStats', async () => {
  const res = await applicationsAPI.getStats();
  return res.data;
});

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    items: [],
    current: null,
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    },
    updateLocalStatus: (state, action) => {
      const { id, status } = action.payload;
      const app = state.items.find((a) => a._id === id);
      if (app) app.status = status;
      if (state.current?._id === id) state.current.status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => { state.loading = true; })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchApplication.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        const idx = state.items.findIndex((a) => a._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.current?._id === action.payload._id) state.current = action.payload;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a._id !== action.payload);
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearCurrent, updateLocalStatus } = applicationsSlice.actions;
export default applicationsSlice.reducer;
