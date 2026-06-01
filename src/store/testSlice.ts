import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type {
  CreateCategoryPayload,
  CreateTestPayload,
  TestState,
  UpdateCategoryPayload,
  UpdateTestPayload,
} from "../types/test.types";
import type { RootState } from ".";
import { testApi } from "../services/test.api";

// =====================================================
// Initial State
// =====================================================

const initialState: TestState = {
  tests: [],
  categories: [],
  loading: false,
  error: null,
};

// =====================================================
// Thunks — Tests
// =====================================================

export const fetchTests = createAsyncThunk("test/fetchTests", async () => {
  const res = await testApi.getTests();
  return res.data;
});

export const createTest = createAsyncThunk(
  "test/createTest",
  async (payload: CreateTestPayload, { dispatch }) => {
    await testApi.createTest(payload);
    dispatch(fetchTests());
  },
);

export const updateTest = createAsyncThunk(
  "test/updateTest",
  async (payload: UpdateTestPayload, { dispatch }) => {
    await testApi.updateTest(payload);
    dispatch(fetchTests());
  },
);

export const deleteTest = createAsyncThunk(
  "test/deleteTest",
  async (id: number, { dispatch }) => {
    await testApi.deleteTest(id);
    dispatch(fetchTests());
  },
);

export const toggleTestStatus = createAsyncThunk(
  "test/toggleTestStatus",
  async (
    { id, status }: { id: number; status: boolean },
    { dispatch, getState },
  ) => {
    const state = getState() as RootState;
    const test = state.test.tests.find((t) => t.id === id);
    if (!test) return;
    await testApi.updateTest({
      id,
      test_code: test.code,
      test_name: test.name,
      print_name: test.printName,
      status,
    });
    dispatch(fetchTests());
  },
);

// =====================================================
// Thunks — Categories
// =====================================================

export const fetchCategories = createAsyncThunk(
  "test/fetchCategories",
  async () => {
    const res = await testApi.getCategories();
    return res.data;
  },
);

export const createCategory = createAsyncThunk(
  "test/createCategory",
  async (payload: CreateCategoryPayload, { dispatch }) => {
    await testApi.createCategory(payload);
    dispatch(fetchCategories());
  },
);

export const updateCategory = createAsyncThunk(
  "test/updateCategory",
  async (payload: UpdateCategoryPayload, { dispatch }) => {
    await testApi.updateCategory(payload);
    dispatch(fetchCategories());
  },
);

export const deleteCategory = createAsyncThunk(
  "test/deleteCategory",
  async (id: number, { dispatch }) => {
    await testApi.deleteCategory(id);
    dispatch(fetchCategories());
  },
);

export const toggleCategoryStatus = createAsyncThunk(
  "test/toggleCategoryStatus",
  async ({ id, status }: { id: number; status: boolean }, { dispatch }) => {
    await testApi.updateCategoryStatus(id, status);
    dispatch(fetchCategories());
  },
);

// =====================================================
// Slice
// =====================================================

const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── Tests ───────────────────────────────────────
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load tests";
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload.map((item: any) => ({
          id: item.id,
          code: item.test_code,
          name: item.test_name,
          printName: item.print_name,
          serviceName: item.service_name ?? "",
          testCompletionTime: item.test_completion_time ?? "",
          isSensitive: item.is_sensitive ?? false,
          suggestionNote: item.suggestion_note ?? "",
          disclaimer: item.disclaimer ?? "",
          reportType: item.report_type ?? "PARAMETER",
          isActive: item.status ?? true,
        }));
      })

      // ── Categories ──────────────────────────────────
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load categories";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.map((item: any) => ({
          id: item.id,
          code: item.category_code,
          name: item.category_name,
          isActive: item.status ?? true,
          tests: item.tests ?? [],
        }));
      });
  },
});

export default testSlice.reducer;

// =====================================================
// Selectors
// =====================================================

export const selectTests = (state: RootState) => state.test.tests;
export const selectCategories = (state: RootState) => state.test.categories;
export const selectTestLoading = (state: RootState) => state.test.loading;
export const selectTestError = (state: RootState) => state.test.error;
