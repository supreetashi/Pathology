import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  CreateReceiveSamplePayload,
  ReceiveSampleItem,
  ReceiveSamplePayload,
  ReceiveState,
  RejectSamplePayload,
} from "../types/Receive.types";
import type { RootState } from ".";
import { receiveApi } from "../services/Receive.api";

// =====================================================
// Raw API response shape (snake_case from Django)
// =====================================================
interface RawReceiveSample {
  id: number;
  shipment_received: number | null;
  ship_date: string;
  ship_time: string;
  shipment_no: string;
  specimen_no: string;
  specimen_type: string;
  test_code: string;
  test_name: string;
  service_name: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  patient_code: string;
  receive_date: string | null;
  receive_time: string | null;
  accepted_by: string | null;
  remark: string | null;
  sub_optimal: boolean;
  status: "Shipped" | "Received" | "Rejected";
  is_deleted: boolean;
  created_at: string;
  deleted_at: string | null;
}

// =====================================================
// Helpers
// =====================================================
function mapRaw(item: RawReceiveSample): ReceiveSampleItem {
  return {
    id: item.id,
    shipmentReceived: item.shipment_received,
    shipDate: item.ship_date,
    shipTime: item.ship_time,
    shipmentNo: item.shipment_no,
    specimenNo: item.specimen_no,
    specimenType: item.specimen_type,
    testCode: item.test_code,
    testName: item.test_name,
    serviceName: item.service_name,
    patientName: item.patient_name,
    patientAge: item.patient_age,
    patientGender: item.patient_gender,
    patientCode: item.patient_code,
    receiveDate: item.receive_date,
    receiveTime: item.receive_time,
    acceptedBy: item.accepted_by,
    remark: item.remark,
    subOptimal: item.sub_optimal,
    status: item.status,
    isDeleted: item.is_deleted,
    createdAt: item.created_at,
    deletedAt: item.deleted_at,
  };
}

function extractErrorMessage(data: unknown): string {
  if (!data) return "Unknown error";
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    return Object.entries(data as Record<string, unknown>)
      .map(([field, msgs]) => {
        const text = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
        return `${field}: ${text}`;
      })
      .join(" | ");
  }
  return String(data);
}

// =====================================================
// Initial State
// =====================================================
const initialState: ReceiveState = {
  samples: [],
  activityLogs: [],
  loading: false,
  activityLoading: false,
  error: null,
};

// =====================================================
// Thunks
// =====================================================

export const fetchReceiveSamples = createAsyncThunk(
  "receive/fetchSamples",
  async (_, { rejectWithValue }) => {
    try {
      const res = await receiveApi.getSamples();
      return res.data as RawReceiveSample[];
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error.response?.data) ?? "Failed to fetch samples",
      );
    }
  },
);

export const createReceiveSample = createAsyncThunk(
  "receive/createSample",
  async (payload: CreateReceiveSamplePayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await receiveApi.createSample(payload);
      await dispatch(fetchReceiveSamples());
      return res.data as RawReceiveSample;
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error.response?.data) ?? "Failed to create sample",
      );
    }
  },
);

export const receiveSample = createAsyncThunk(
  "receive/receiveSample",
  async (
    { sampleId, payload }: { sampleId: number; payload: ReceiveSamplePayload },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const res = await receiveApi.receiveSample(sampleId, payload);
      await dispatch(fetchReceiveSamples());
      await dispatch(fetchActivityLogs());
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error.response?.data) ?? "Failed to receive sample",
      );
    }
  },
);

export const rejectSample = createAsyncThunk(
  "receive/rejectSample",
  async (
    { sampleId, payload }: { sampleId: number; payload: RejectSamplePayload },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const res = await receiveApi.rejectSample(sampleId, payload);
      await dispatch(fetchReceiveSamples());
      await dispatch(fetchActivityLogs());
      return res.data;
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error.response?.data) ?? "Failed to reject sample",
      );
    }
  },
);

export const fetchActivityLogs = createAsyncThunk(
  "receive/fetchActivityLogs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await receiveApi.getActivityLogs();
      return res.data as RawReceiveSample[];
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error.response?.data) ?? "Failed to fetch activity logs",
      );
    }
  },
);

export const deleteReceiveSample = createAsyncThunk(
  "receive/deleteSample",
  async (sampleId: number, { dispatch, rejectWithValue }) => {
    try {
      await receiveApi.deleteSample(sampleId);
      await dispatch(fetchReceiveSamples());
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error.response?.data) ?? "Failed to delete sample",
      );
    }
  },
);

// =====================================================
// Slice
// =====================================================
const receiveSlice = createSlice({
  name: "receive",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ----- Fetch Samples -----
      .addCase(fetchReceiveSamples.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceiveSamples.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Failed to load samples";
      })
      .addCase(fetchReceiveSamples.fulfilled, (state, action) => {
        state.loading = false;
        state.samples = action.payload.map(mapRaw);
      })

      // ----- Fetch Activity Logs -----
      .addCase(fetchActivityLogs.pending, (state) => {
        state.activityLoading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.activityLoading = false;
        state.error = (action.payload as string) ?? "Failed to load activity logs";
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.activityLoading = false;
        state.activityLogs = action.payload.map(mapRaw);
      })

      // ----- Error cases -----
      .addCase(createReceiveSample.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to create sample";
      })
      .addCase(receiveSample.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to receive sample";
      })
      .addCase(rejectSample.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to reject sample";
      })
      .addCase(deleteReceiveSample.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to delete sample";
      });
  },
});

export default receiveSlice.reducer;

// =====================================================
// Selectors
// =====================================================
export const selectReceiveSamples = (state: RootState) => state.receive.samples;
export const selectActivityLogs = (state: RootState) => state.receive.activityLogs;
export const selectReceiveLoading = (state: RootState) => state.receive.loading;
export const selectActivityLoading = (state: RootState) => state.receive.activityLoading;
export const selectReceiveError = (state: RootState) => state.receive.error;

// Derived selectors
export const selectShippedSamples = (state: RootState) =>
  state.receive.samples.filter((s) => s.status === "Shipped" && !s.isDeleted);

export const selectReceivedSamples = (state: RootState) =>
  state.receive.samples.filter((s) => s.status === "Received" && !s.isDeleted);

export const selectRejectedSamples = (state: RootState) =>
  state.receive.samples.filter((s) => s.status === "Rejected" && !s.isDeleted);