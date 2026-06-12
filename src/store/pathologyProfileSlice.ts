import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CreatePathologyProfilePayload,
  PathologyProfileState,
} from "../types/pathologyProfile.types";
import type { RootState } from ".";
import { pathologyProfileApi } from "../services/pathologyprofile.api";

const initialState: PathologyProfileState = {
  pathologyProfiles: [],
  serviceNames: [],
  loading: false,
  error: null,
};

// ---------------- FETCH PROFILES ----------------
export const fetchPathologyProfiles = createAsyncThunk(
  "pathologyProfile/fetch",
  async () => {
    const res = await pathologyProfileApi.getPathologyProfiles();
    return res.data.results;
  }
);

// ---------------- SERVICE NAMES ----------------
export const fetchServiceNameLists = createAsyncThunk(
  "pathologyProfile/serviceNames",
  async () => {
    const res = await pathologyProfileApi.getServiceNameLists();
    return res.data.results;
  }
);

// ---------------- CREATE ----------------
export const createPathologyProfile = createAsyncThunk(
  "pathologyProfile/create",
  async (payload: CreatePathologyProfilePayload, { dispatch }) => {
    await pathologyProfileApi.createPathologyProfile(payload);
    dispatch(fetchPathologyProfiles());
  }
);

// ---------------- UPDATE ----------------
export const updatePathologyProfile = createAsyncThunk(
  "pathologyProfile/update",
  async (
    payload: {
      id: number;
      service_name: string;
      tests: string[];
      clinic: string;
    },
    { dispatch }
  ) => {
    await pathologyProfileApi.updatePathologyProfile(payload.id, {
      service_name: payload.service_name,
      tests: payload.tests,
      clinic: payload.clinic,
    });

    dispatch(fetchPathologyProfiles());
  }
);

const slice = createSlice({
  name: "pathologyProfile",
  initialState,
  reducers: {
    togglePathologyProfileStatus: (state, action: PayloadAction<number>) => {
      const item = state.pathologyProfiles.find((p) => p.id === action.payload);
      if (item) item.status = !item.status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPathologyProfiles.fulfilled, (state, action) => {
      state.pathologyProfiles = action.payload.map((item: any) => ({
        id: item.id,
        service_name: item.service_name,
        tests: item.tests ?? [],
        no_of_tests: item.no_of_tests ?? 0,
        status: item.status,
        clinic: item.clinic,
      }));
    });

    builder.addCase(fetchServiceNameLists.fulfilled, (state, action) => {
      state.serviceNames = action.payload;
    });
  },
});

export const { togglePathologyProfileStatus } = slice.actions;
export default slice.reducer;

export const selectPathologyProfiles = (s: RootState) =>
  s.pathologyProfile.pathologyProfiles;

export const selectServiceNames = (s: RootState) =>
  s.pathologyProfile.serviceNames;