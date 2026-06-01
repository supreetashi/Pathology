import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clinicApi } from "../services/clinic.api";
import type { Clinic } from "../types/clinic.types";
import type { RootState } from ".";

type ClinicState = {
  data: Clinic | null;
  clinics: Clinic[];
  loading: boolean;
  error: string | null;
};

const initialState: ClinicState = {
  data: null,
  clinics: [],
  loading: false,
  error: null,
};

// Fetch clinic once when app loads
export const fetchClinic = createAsyncThunk(
  "clinic/fetchClinic",
  async (clinicId: number) => {
    const res = await clinicApi.getById(clinicId);
    return res.data;
  },
);

export const fetchClinics = createAsyncThunk(
  "clinic/fetchClinics",
  async () => {
    const res = await clinicApi.getAll();
    return res.data.results;
  },
);

const clinicSlice = createSlice({
  name: "clinic",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Single Clinic
      .addCase(fetchClinic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinic.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchClinic.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load clinic";
      })
      // Multiple Clinics
      .addCase(fetchClinics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinics.fulfilled, (state, action) => {
        state.loading = false;
        state.clinics = action.payload;
      })
      .addCase(fetchClinics.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load clinics";
      });
  },
});

export default clinicSlice.reducer;

export const selectClinic = (state: RootState) => state.clinic.data;
export const selectClinics = (state: RootState) => state.clinic.clinics;