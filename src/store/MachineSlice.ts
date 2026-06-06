import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type {
  CreateMachineParameterPayload,
  CreateMachinePayload,
  MachineState,
  UpdateMachineParameterPayload,
  UpdateMachinePayload,
} from "../types/Machine.types";
import type { RootState } from ".";
import { machineApi } from "../services/Machine.api";

// =====================================================
// Raw API response shapes
// =====================================================
interface RawMachineParameterSummary {
  id: string;
  machine_parameter_code: string;
  machine_parameter_name: string;
}

interface RawMachine {
  id: string;
  clinic: string;
  clinic_name: string;
  machine_code: string;
  machine_name: string;
  machine_parameters: (string | RawMachineParameterSummary)[];
  status: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface RawMachineParameter {
  id: string;
  machine_parameter_code: string;
  machine_parameter_name: string;
  number_of_machines?: number;
  status: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// Paginated response wrapper from DRF StandardPagination
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// =====================================================
// Initial state
// =====================================================
const initialState: MachineState = {
  machines: [],
  machineParameters: [],
  machinesLoading: false,
  parametersLoading: false,
  error: null,
};

// =====================================================
// Helpers
// =====================================================

// Handles both paginated { results: [] } and plain [] responses
function extractResults<T>(data: PaginatedResponse<T> | T[]): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray((data as PaginatedResponse<T>).results)) {
    return (data as PaginatedResponse<T>).results;
  }
  return [];
}

// Extracts a readable message from a DRF error response
function extractErrorMessage(data: unknown): string {
  if (!data) return "Unknown error";
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    // DRF returns field errors as { field: ["msg", ...] } or { detail: "msg" }
    const entries = Object.entries(data as Record<string, unknown>);
    return entries
      .map(([field, msgs]) => {
        const text = Array.isArray(msgs) ? msgs.join(", ") : String(msgs);
        return `${field}: ${text}`;
      })
      .join(" | ");
  }
  return String(data);
}

// =====================================================
// Machine Thunks
// =====================================================

export const fetchMachines = createAsyncThunk(
  "machine/fetchMachines",
  async (_, { rejectWithValue }) => {
    try {
      const res = await machineApi.getMachines();
      return res.data as PaginatedResponse<RawMachine> | RawMachine[];
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error.response?.data) ?? "Failed to fetch machines",
      );
    }
  },
);

export const createMachine = createAsyncThunk(
  "machine/createMachine",
  async (payload: CreateMachinePayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await machineApi.createMachine(payload);
      await dispatch(fetchMachines());
      return res.data as RawMachine;
    } catch (error: any) {
      const message =
        extractErrorMessage(error.response?.data) ?? "Failed to create machine";
      return rejectWithValue(message);
    }
  },
);

export const updateMachine = createAsyncThunk(
  "machine/updateMachine",
  async (
    { id, payload }: { id: string; payload: UpdateMachinePayload },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await machineApi.updateMachine(id, payload);
      await dispatch(fetchMachines());
    } catch (error: any) {
      const message =
        extractErrorMessage(error.response?.data) ?? "Failed to update machine";
      return rejectWithValue(message);
    }
  },
);

export const deleteMachine = createAsyncThunk(
  "machine/deleteMachine",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await machineApi.deleteMachine(id);
      await dispatch(fetchMachines());
    } catch (error: any) {
      const message =
        extractErrorMessage(error.response?.data) ?? "Failed to delete machine";
      return rejectWithValue(message);
    }
  },
);

// =====================================================
// Machine Parameter Thunks
// =====================================================

export const fetchMachineParameters = createAsyncThunk(
  "machine/fetchMachineParameters",
  async (_, { rejectWithValue }) => {
    try {
      const res = await machineApi.getMachineParameters();
      return res.data as PaginatedResponse<RawMachineParameter> | RawMachineParameter[];
    } catch (error: any) {
      return rejectWithValue(
        extractErrorMessage(error.response?.data) ?? "Failed to fetch parameters",
      );
    }
  },
);

export const createMachineParameter = createAsyncThunk(
  "machine/createMachineParameter",
  async (payload: CreateMachineParameterPayload, { dispatch, rejectWithValue }) => {
    try {
      const res = await machineApi.createMachineParameter(payload);
      await dispatch(fetchMachineParameters());
      return res.data as RawMachineParameter;
    } catch (error: any) {
      const message =
        extractErrorMessage(error.response?.data) ?? "Failed to create parameter";
      return rejectWithValue(message);
    }
  },
);

export const updateMachineParameter = createAsyncThunk(
  "machine/updateMachineParameter",
  async (
    { id, payload }: { id: string; payload: UpdateMachineParameterPayload },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await machineApi.updateMachineParameter(id, payload);
      await dispatch(fetchMachineParameters());
    } catch (error: any) {
      const message =
        extractErrorMessage(error.response?.data) ?? "Failed to update parameter";
      return rejectWithValue(message);
    }
  },
);

export const deleteMachineParameter = createAsyncThunk(
  "machine/deleteMachineParameter",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await machineApi.deleteMachineParameter(id);
      await dispatch(fetchMachineParameters());
    } catch (error: any) {
      const message =
        extractErrorMessage(error.response?.data) ?? "Failed to delete parameter";
      return rejectWithValue(message);
    }
  },
);

// =====================================================
// Slice
// =====================================================
const machineSlice = createSlice({
  name: "machine",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ----- Machines -----
      .addCase(fetchMachines.pending, (state) => {
        state.machinesLoading = true;
        state.error = null;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.machinesLoading = false;
        state.error = (action.payload as string) ?? "Failed to load machines";
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.machinesLoading = false;
        const items = extractResults(action.payload);
        state.machines = items.map((item) => ({
          id: item.id,
          clinicId: item.clinic,
          clinicName: item.clinic_name,
          machineCode: item.machine_code,
          machineName: item.machine_name,
          machineParameterIds: (item.machine_parameters ?? []).map((mp) =>
            typeof mp === "string" ? mp : mp.id,
          ),
          machineParameters: (item.machine_parameters ?? []).filter(
            (mp): mp is RawMachineParameterSummary => typeof mp === "object",
          ),
          isActive: item.status,
          isDeleted: item.is_deleted,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
      })

      // createMachine / updateMachine / deleteMachine — error lands in state.error
      .addCase(createMachine.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to create machine";
      })
      .addCase(updateMachine.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to update machine";
      })
      .addCase(deleteMachine.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to delete machine";
      })

      // ----- Parameters -----
      .addCase(fetchMachineParameters.pending, (state) => {
        state.parametersLoading = true;
        state.error = null;
      })
      .addCase(fetchMachineParameters.rejected, (state, action) => {
        state.parametersLoading = false;
        state.error = (action.payload as string) ?? "Failed to load machine parameters";
      })
      .addCase(fetchMachineParameters.fulfilled, (state, action) => {
        state.parametersLoading = false;
        const items = extractResults(action.payload);
        state.machineParameters = items.map((item) => ({
          id: item.id,
          machineParameterCode: item.machine_parameter_code,
          machineParameterName: item.machine_parameter_name,
          numberOfMachines: item.number_of_machines ?? 0,
          isActive: item.status,
          isDeleted: item.is_deleted,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
      })

      .addCase(createMachineParameter.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to create parameter";
      })
      .addCase(updateMachineParameter.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to update parameter";
      })
      .addCase(deleteMachineParameter.rejected, (state, action) => {
        state.error = (action.payload as string) ?? "Failed to delete parameter";
      });
  },
});

export default machineSlice.reducer;

// =====================================================
// Selectors
// =====================================================
export const selectMachines = (state: RootState) => state.machine.machines;

export const selectMachineParameters = (state: RootState) =>
  state.machine.machineParameters;

export const selectMachinesLoading = (state: RootState) =>
  state.machine.machinesLoading;

export const selectParametersLoading = (state: RootState) =>
  state.machine.parametersLoading;

export const selectMachineLoading = (state: RootState) =>
  state.machine.machinesLoading || state.machine.parametersLoading;

export const selectMachineError = (state: RootState) => state.machine.error;