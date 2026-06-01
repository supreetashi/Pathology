import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type {
  CreateSamplePayload,
  CreateTubePayload,
  SampleTubeState,
} from "../types/sampleTube.types";
import type { RootState } from ".";
import { sampleTubeApi } from "../services/sampletube.api";

// Initial Redux state
const initialState: SampleTubeState = {
  samples: [],
  tubes: [],
  loading: false,
  error: null,
};

// =====================================================
// API calls to fetch and create Sample/Tube data
// =====================================================
export const fetchSamples = createAsyncThunk(
  "sampleTube/fetchSamples",
  async () => {
    const res = await sampleTubeApi.getSamples();
    return res.data;
  },
);

// Fetch tubes from backend
export const fetchTubes = createAsyncThunk(
  "sampleTube/fetchTubes",
  async () => {
    const res = await sampleTubeApi.getTubes();
    return res.data;
  },
);

// Create sample and refresh list
export const createSample = createAsyncThunk(
  "sampleTube/createSample",
  async (payload: CreateSamplePayload, { dispatch }) => {
    await sampleTubeApi.createSample(payload);

    dispatch(fetchSamples());
  },
);

// Create tube and refresh list
export const createTube = createAsyncThunk(
  "sampleTube/createTube",
  async (payload: CreateTubePayload, { dispatch }) => {
    await sampleTubeApi.createTube(payload);

    dispatch(fetchTubes());
  },
);

export const updateSample = createAsyncThunk(
  "sampleTube/updateSample",
  async (
    {
      id,
      payload,
    }: {
      id: number;
      payload: CreateSamplePayload;
    },
    { dispatch },
  ) => {
    await sampleTubeApi.updateSample(id, payload);

    dispatch(fetchSamples());
  },
);

export const updateTube = createAsyncThunk(
  "sampleTube/updateTube",
  async (
    {
      id,
      payload,
    }: {
      id: number;
      payload: CreateTubePayload;
    },
    { dispatch },
  ) => {
    await sampleTubeApi.updateTube(id, payload);

    dispatch(fetchTubes());
  },
);

// =====================================================
// Reducer
// =====================================================
const sampleTubeSlice = createSlice({
  name: "sampleTube",
  initialState,

  reducers: {
    // TODO: Replace with backend status API
    toggleSampleStatus: (state, action: PayloadAction<number>) => {
      const sample = state.samples.find((item) => item.id === action.payload);

      if (sample) {
        sample.isActive = !sample.isActive;
      }
    },

    // TODO: Replace with backend status API
    toggleTubeStatus: (state, action: PayloadAction<number>) => {
      const tube = state.tubes.find((item) => item.id === action.payload);

      if (tube) {
        tube.isActive = !tube.isActive;
      }
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchSamples.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchTubes.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchSamples.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load samples";
      })

      .addCase(fetchTubes.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load tubes";
      })

      .addCase(fetchSamples.fulfilled, (state, action) => {
        state.loading = false;

        state.samples = action.payload.map((item: any) => ({
          id: item.id,
          code: item.sample_code,
          name: item.sample_name,
          isActive: item.status,
        }));
      })

      .addCase(fetchTubes.fulfilled, (state, action) => {
        state.loading = false;

        state.tubes = action.payload.map((item: any) => ({
          id: item.id,
          code: item.tube_code,
          name: item.tube_name,
          isActive: item.status,
        }));
      });
  },
});

// =====================================================
// Actions
// =====================================================
export const { toggleSampleStatus, toggleTubeStatus } = sampleTubeSlice.actions;

export default sampleTubeSlice.reducer;

// =====================================================
// Selectors
// =====================================================
export const selectSamples = (state: RootState) => state.sampleTube.samples;

export const selectTubes = (state: RootState) => state.sampleTube.tubes;
