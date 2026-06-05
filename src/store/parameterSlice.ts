import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type {
  CreateParameterPayload,
  UpdateParameterPayload,
  CreateReferenceRangePayload,
  UpdateReferenceRangePayload,
  ParameterState,
} from "../types/parameter.types";
import type { RootState } from ".";
import { parameterApi } from "../services/parameter.api";

// =====================================================
// Initial State
// =====================================================

const initialState: ParameterState = {
  parameters: [],
  referenceRanges: [],
  loading: false,
  error: null,
};

// =====================================================
// Thunks — Parameters
// =====================================================

export const fetchParameters = createAsyncThunk(
  "parameter/fetchParameters",
  async () => {
    const res = await parameterApi.getParameters();
    return res.data;
  },
);

export const createParameter = createAsyncThunk(
  "parameter/createParameter",
  async (payload: CreateParameterPayload, { dispatch }) => {
    const res = await parameterApi.createParameter(payload);
    dispatch(fetchParameters());
    return res.data; // ← return created parameter
  },
);

export const updateParameter = createAsyncThunk(
  "parameter/updateParameter",
  async (payload: UpdateParameterPayload, { dispatch }) => {
    await parameterApi.updateParameter(payload);
    dispatch(fetchParameters());
  },
);

export const toggleParameterStatus = createAsyncThunk(
  "parameter/toggleParameterStatus",
  async ({ id, status }: { id: string; status: boolean }, 
    { dispatch, getState },
  ) => {
    const state = getState() as RootState;
    const param = state.parameter.parameters.find((p) => p.id === id);
    if (!param) return;
    await parameterApi.updateParameter({
      id,
      parameter_code: param.code,
      parameter_name: param.name,
      parameter_print_name: param.printName,
      type_of_value: param.typeOfValue,
      unit: param.unit,
      status,
    });
    dispatch(fetchParameters());
  },
);

export const deleteParameter = createAsyncThunk(
  "parameter/deleteParameter",
  async (id: string, { dispatch }) => {
    await parameterApi.deleteParameter(id);
    dispatch(fetchParameters());
  },
);

// =====================================================
// Thunks — Reference Ranges
// =====================================================

export const fetchReferenceRanges = createAsyncThunk(
  "parameter/fetchReferenceRanges",
  async (parameterId?: string) => {
    const res = await parameterApi.getReferenceRanges(parameterId);
    return res.data;
  },
);

export const createReferenceRange = createAsyncThunk(
  "parameter/createReferenceRange",
  async (payload: CreateReferenceRangePayload, { dispatch }) => {
    await parameterApi.createReferenceRange(payload);
    dispatch(fetchReferenceRanges(payload.parameter));
  },
);

export const updateReferenceRange = createAsyncThunk(
  "parameter/updateReferenceRange",
  async (payload: UpdateReferenceRangePayload, { dispatch }) => {
    await parameterApi.updateReferenceRange(payload);
    dispatch(fetchReferenceRanges(payload.parameter));
  },
);

export const deleteReferenceRange = createAsyncThunk(
  "parameter/deleteReferenceRange",
  async ({ id, parameterId }: { id: number; parameterId: string },
    { dispatch },
  ) => {
    await parameterApi.deleteReferenceRange(id);
    dispatch(fetchReferenceRanges(parameterId));
  },
);

// =====================================================
// Slice
// =====================================================

const parameterSlice = createSlice({
  name: "parameter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── Parameters ──────────────────────────────────
      .addCase(fetchParameters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParameters.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load parameters";
      })
      .addCase(fetchParameters.fulfilled, (state, action) => {
        state.loading = false;
        state.parameters = action.payload.results.map((item: any) => ({
          id: item.id,
          code: item.parameter_code,
          name: item.parameter_name,
          printName: item.parameter_print_name ?? "",
          typeOfValue: item.type_of_value ?? "NUMERIC",
          unit: item.unit ?? "",
          deltaCheckPercentage: item.delta_check_percentage ?? "",
          techniqueUsed: item.technique_used ?? "",
          executionCalendarLinking: item.execution_calendar_linking ?? "",
          formula: item.formula ?? "",
          skipNumericResultEntry: item.skip_numeric_result_entry ?? false,
          isActive: item.status ?? true,
        }));
      })

      // ── Reference Ranges ─────────────────────────────
      .addCase(fetchReferenceRanges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferenceRanges.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load reference ranges";
      })
      .addCase(fetchReferenceRanges.fulfilled, (state, action) => {
        state.loading = false;
        const items = action.payload?.results ?? action.payload ?? []; // ← handle both
        state.referenceRanges = items.map((item: any) => ({
          id: item.id,
          parameterId: item.parameter,
          gender: item.gender ?? "",
          machineName: item.machine_name ?? "",
          minRef: item.min_ref ?? "",
          maxRef: item.max_ref ?? "",
          minAuthz: item.min_authz ?? "",
          maxAuthz: item.max_authz ?? "",
          isAgeApplicable: item.is_age_applicable ?? false,
          ageLowerLimit: item.age_lower_limit ?? "",
          ageUpperLimit: item.age_upper_limit ?? "",
          improbableValueLess: item.improbable_value_less ?? "",
          improbableValueGreater: item.improbable_value_greater ?? "",
          isReflex: item.is_reflex ?? false,
          reflexValueLess: item.reflex_value_less ?? "",
          reflexValueGreater: item.reflex_value_greater ?? "",
          panicValueLess: item.panic_value_less ?? "",
          panicValueGreater: item.panic_value_greater ?? "",
          varyingReferenceRange: item.varying_reference_range ?? "",
          notes: item.notes ?? "",
          isActive: item.status ?? true,
        }));
      });
  },
});

export default parameterSlice.reducer;

// =====================================================
// Selectors
// =====================================================

export const selectParameters = (state: RootState) =>
  state.parameter.parameters;
export const selectReferenceRanges = (state: RootState) =>
  state.parameter.referenceRanges;
export const selectParameterLoading = (state: RootState) =>
  state.parameter.loading;
export const selectParameterError = (state: RootState) => state.parameter.error;
