import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type {
    CreatePathologyProfilePayload,
    PathologyProfileState,
} from "../types/pathologyProfile.types";
import type { RootState } from ".";
import { pathologyProfileApi } from "../services/pathologyprofile.api";

// Initial Redux state
const initialState: PathologyProfileState = {
    pathologyProfiles: [],
    serviceNames: [],
    loading: false,
    error: null,
};

// =====================================================
// API calls to fetch and create Pathology Profile data
// =====================================================
export const fetchServiceNameLists = createAsyncThunk(
    "pathologyProfile/fetchServiceNameLists",
    async () => {
        const res = await pathologyProfileApi.getServiceNameLists();
        return res.data.results;
    },
);

// =====================================================
// API calls to fetch and create Pathology Profile data
// =====================================================
export const fetchPathologyProfiles = createAsyncThunk(
    "pathologyProfile/fetchPathologyProfiles",
    async () => {
        const res = await pathologyProfileApi.getPathologyProfiles();
        return res.data.results;
    },
);

// Create sample and refresh list
export const createPathologyProfile = createAsyncThunk(
    "pathologyProfile/createPathologyProfile",
    async (payload: CreatePathologyProfilePayload, { dispatch }) => {
        await pathologyProfileApi.createPathologyProfile(payload);

        dispatch(fetchPathologyProfiles());
    },
);

// =====================================================
// Reducer
// =====================================================
const pathologyProfileSlice = createSlice({
    name: "pathologyProfile",
    initialState,

    reducers: {
        // TODO: Replace with backend status API
        togglePathologyProfileStatus: (state, action: PayloadAction<number>) => {
            const pathologyProfile = state.pathologyProfiles.find((item) => item.id === action.payload);

            if (pathologyProfile) {
                pathologyProfile.status = !pathologyProfile.status;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPathologyProfiles.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPathologyProfiles.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to load Pathology Profiles";
            })
            .addCase(fetchPathologyProfiles.fulfilled, (state, action) => {
                state.loading = false;
                state.pathologyProfiles = action.payload.map((item: any) => ({
                    id: item.id,
                    service_name: item.service_name,
                    tests: item.tests,
                    status: item.status,
                }));
            })
            .addCase(fetchServiceNameLists.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchServiceNameLists.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to load Service Lists";
            })
            .addCase(fetchServiceNameLists.fulfilled, (state, action) => {
                state.loading = false;
                state.serviceNames = action.payload.map((item: any) => ({
                    id: item.id,
                    identifier: item.identifier,
                    name: item.name,
                    tag_name: item.tag_name,
                    icon_url: item.icon_url,
                }));
            })
    },
});

// =====================================================
// Actions
// =====================================================
export const { togglePathologyProfileStatus } = pathologyProfileSlice.actions;

export default pathologyProfileSlice.reducer;

// =====================================================
// Selectors
// =====================================================
export const selectPathologyProfiles = (state: RootState) => state.pathologyProfile.pathologyProfiles;
export const selectServiceNames = (state: RootState) => state.pathologyProfile.serviceNames;
