import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAuthorizations,
  getAuthorizationLogs,
  approveAuthorization,
  rejectAuthorization,
  deleteAuthorization,
  createAuthorization,
  getDeletedAuthorizations,
} from "../services/authorization.api";
import { Authorization, AuthorizationState } from "../types/authorization.types";

const initialState: AuthorizationState = {
  authorizations: [],
  deletedAuthorizations: [],
  logs: [],
  loading: false,
  error: null,
};

export const fetchAuthorizations = createAsyncThunk(
  "authorization/fetchAuthorizations",
  async (
    params: { status?: string; search?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      return await getAuthorizations(params?.status, params?.search);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Failed to fetch authorizations");
    }
  }
);

export const fetchAuthorizationLogs = createAsyncThunk(
  "authorization/fetchAuthorizationLogs",
  async (_, { rejectWithValue }) => {
    try {
      return await getAuthorizationLogs();
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Failed to fetch logs");
    }
  }
);

export const fetchDeletedAuthorizations = createAsyncThunk(
  "authorization/fetchDeletedAuthorizations",
  async (_, { rejectWithValue }) => {
    try {
      return await getDeletedAuthorizations();
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Failed to fetch deleted authorizations");
    }
  }
);

export const approveAuthorizationThunk = createAsyncThunk(
  "authorization/approveAuthorization",
  async (id: number, { rejectWithValue }) => {
    try {
      await approveAuthorization(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Failed to approve authorization");
    }
  }
);

export const rejectAuthorizationThunk = createAsyncThunk(
  "authorization/rejectAuthorization",
  async (id: number, { rejectWithValue }) => {
    try {
      await rejectAuthorization(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Failed to reject authorization");
    }
  }
);

export const deleteAuthorizationThunk = createAsyncThunk(
  "authorization/deleteAuthorization",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteAuthorization(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Failed to delete authorization");
    }
  }
);

export const createAuthorizationThunk = createAsyncThunk(
  "authorization/createAuthorization",
  async (resultEntryId: number, { rejectWithValue }) => {
    try {
      const res = await createAuthorization(resultEntryId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data || "Failed to create authorization");
    }
  }
);

const authorizationSlice = createSlice({
  name: "authorization",
  initialState,
  reducers: {
    clearAuthorizationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch authorizations
      .addCase(fetchAuthorizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAuthorizations.fulfilled,
        (state, action: PayloadAction<Authorization[]>) => {
          state.loading = false;
          state.authorizations = action.payload;
        }
      )
      .addCase(fetchAuthorizations.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";
      })

      // fetch logs
      .addCase(fetchAuthorizationLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAuthorizationLogs.fulfilled,
        (state, action: PayloadAction<Authorization[]>) => {
          state.loading = false;
          state.logs = action.payload;
        }
      )
      .addCase(fetchAuthorizationLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";
      })

      // fetch deleted
      .addCase(fetchDeletedAuthorizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDeletedAuthorizations.fulfilled,
        (state, action: PayloadAction<Authorization[]>) => {
          state.loading = false;
          state.deletedAuthorizations = action.payload;
        }
      )
      .addCase(fetchDeletedAuthorizations.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";
      })

      // approve
      .addCase(approveAuthorizationThunk.fulfilled, (state, action: PayloadAction<number>) => {
        const item = state.authorizations.find((a) => a.id === action.payload);
        if (item) item.authorization_status = "Approved";
      })
      .addCase(approveAuthorizationThunk.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to approve";
      })

      // reject
      .addCase(rejectAuthorizationThunk.fulfilled, (state, action: PayloadAction<number>) => {
        const item = state.authorizations.find((a) => a.id === action.payload);
        if (item) item.authorization_status = "Rejected";
      })
      .addCase(rejectAuthorizationThunk.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to reject";
      })

      // delete
      .addCase(deleteAuthorizationThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.authorizations = state.authorizations.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteAuthorizationThunk.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete";
      })

      // create
      .addCase(createAuthorizationThunk.fulfilled, (state, action: PayloadAction<Authorization>) => {
        state.authorizations.unshift(action.payload);
      })
      .addCase(createAuthorizationThunk.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to create authorization";
      });
  },
});

export const { clearAuthorizationError } = authorizationSlice.actions;
export default authorizationSlice.reducer;