import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { agencyApi } from "../services/agency.api";
import type { Agency } from "../types/agency.types";
import type { RootState } from ".";

type AgencyState = {
  data: Agency | null;
  agencies: Agency[];
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: AgencyState = {
  data: null,
  agencies: [],
  total: 0,
  loading: false,
  error: null,
};

// Fetch all agencies
export const fetchAgencies = createAsyncThunk(
  "agency/fetchAgencies",
  async (search?: string) => {
    const res = await agencyApi.getAll(search);
    return res;
  }
);

// Fetch single agency by id
export const fetchAgencyById = createAsyncThunk(
  "agency/fetchAgencyById",
  async (id: string) => {
    const res = await agencyApi.getById(id);
    return res;
  }
);

// Create agency
export const createAgency = createAsyncThunk(
  "agency/createAgency",
  async (payload: Parameters<typeof agencyApi.create>[0]) => {
    const res = await agencyApi.create(payload);
    return res;
  }
);

// Update agency
export const updateAgency = createAsyncThunk(
  "agency/updateAgency",
  async ({ id, payload }: { id: string; payload: Parameters<typeof agencyApi.update>[1] }) => {
    const res = await agencyApi.update(id, payload);
    return res;
  }
);

// Delete agency
export const deleteAgency = createAsyncThunk(
  "agency/deleteAgency",
  async (id: string) => {
    await agencyApi.delete(id);
    return id;
  }
);

const agencySlice = createSlice({
  name: "agency",
  initialState,
  reducers: {
    clearSelectedAgency: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAgencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencies.fulfilled, (state, action) => {
        state.loading = false;
        state.agencies = action.payload.results ?? [];
        state.total = action.payload.count ?? 0;
      })
      .addCase(fetchAgencies.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load agencies";
      })

      // Fetch by id
      .addCase(fetchAgencyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencyById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAgencyById.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load agency";
      })

      // Create
      .addCase(createAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAgency.fulfilled, (state, action) => {
        state.loading = false;
        state.agencies = [action.payload, ...state.agencies];
        state.total += 1;
      })
      .addCase(createAgency.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to create agency";
      })

      // Update
      .addCase(updateAgency.fulfilled, (state, action) => {
        state.agencies = state.agencies.map((a) =>
          a.id === action.payload.id ? action.payload : a
        );
        if (state.data?.id === action.payload.id) {
          state.data = action.payload;
        }
      })

      // Delete
      .addCase(deleteAgency.fulfilled, (state, action) => {
        state.agencies = state.agencies.filter((a) => a.id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { clearSelectedAgency } = agencySlice.actions;

export default agencySlice.reducer;

export const selectAgencies = (state: RootState) => state.agency.agencies;
export const selectAgencyTotal = (state: RootState) => state.agency.total;
export const selectSelectedAgency = (state: RootState) => state.agency.data;
export const selectAgencyLoading = (state: RootState) => state.agency.loading;
export const selectAgencyError = (state: RootState) => state.agency.error;