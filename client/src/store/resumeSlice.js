import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeAPI } from '../api/client';

export const fetchResume = createAsyncThunk('resume/fetch', async () => {
  const res = await resumeAPI.get();
  return res.data;
});

export const updateResume = createAsyncThunk('resume/update', async (data) => {
  const res = await resumeAPI.update(data);
  return res.data;
});

export const parseResume = createAsyncThunk('resume/parse', async (rawText) => {
  const res = await resumeAPI.parse(rawText);
  return res.data;
});

const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    data: null,
    loading: false,
    parsing: false,
    error: null,
  },
  reducers: {
    setRawText: (state, action) => {
      if (state.data) state.data.rawText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResume.pending, (state) => { state.loading = true; })
      .addCase(fetchResume.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(parseResume.pending, (state) => { state.parsing = true; })
      .addCase(parseResume.fulfilled, (state, action) => {
        state.parsing = false;
        state.data = action.payload;
      })
      .addCase(parseResume.rejected, (state, action) => {
        state.parsing = false;
        state.error = action.error.message;
      });
  },
});

export const { setRawText } = resumeSlice.actions;
export default resumeSlice.reducer;
