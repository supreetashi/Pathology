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

  testsLoading: false,
  categoriesLoading: false,

  error: null,
};

// =====================================================
// Helpers
// =====================================================

// Handles both flat array (all-pages fetch) and paginated { results: [] }
const getResults = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;
  return payload?.results ?? [];
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
  }
);

export const updateTest = createAsyncThunk(
  "test/updateTest",
  async (payload: UpdateTestPayload, { dispatch }) => {
    await testApi.updateTest(payload);
    dispatch(fetchTests());
  }
);

export const deleteTest = createAsyncThunk(
  "test/deleteTest",
  async (id: number, { dispatch }) => {
    await testApi.deleteTest(id);
    dispatch(fetchTests());
  }
);

export const toggleTestStatus = createAsyncThunk(
  "test/toggleTestStatus",
  async (
    { id, status }: { id: number; status: boolean },
    { dispatch, getState }
  ) => {
    const state = getState() as RootState;

    const test = state.test.tests.find((t) => t.id === id);
    const clinic = state.clinic.data;

    if (!test || !clinic) return;

    await testApi.updateTest({
      id,
      clinic: clinic.id,

      test_code: test.code,
      test_name: test.name,
      print_name: test.printName,

      service_name: test.serviceName,
      test_completion_time: Number(test.testCompletionTime),

      is_sensitive: test.isSensitive,
      suggestion_note: test.suggestionNote,
      disclaimer: test.disclaimer,

      report_type: test.reportType,

      status,
    });

    dispatch(fetchTests());
  }
);

// =====================================================
// Thunks — Categories
// =====================================================

export const fetchCategories = createAsyncThunk(
  "test/fetchCategories",
  async () => {
    const res = await testApi.getCategories();
    return res.data;
  }
);

export const createCategory = createAsyncThunk(
  "test/createCategory",
  async (payload: CreateCategoryPayload, { dispatch }) => {
    await testApi.createCategory(payload);
    dispatch(fetchCategories());
  }
);

export const updateCategory = createAsyncThunk(
  "test/updateCategory",
  async (payload: UpdateCategoryPayload, { dispatch }) => {
    await testApi.updateCategory(payload);
    dispatch(fetchCategories());
  }
);

export const deleteCategory = createAsyncThunk(
  "test/deleteCategory",
  async (id: number, { dispatch }) => {
    await testApi.deleteCategory(id);
    dispatch(fetchCategories());
  }
);

export const toggleCategoryStatus = createAsyncThunk(
  "test/toggleCategoryStatus",
  async ({ id, status }: { id: number; status: boolean }, { dispatch }) => {
    await testApi.updateCategoryStatus(id, status);
    dispatch(fetchCategories());
  }
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

      // =========================
      // TESTS
      // =========================
      .addCase(fetchTests.pending, (state) => {
        state.testsLoading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.testsLoading = false;

        const results = getResults(action.payload);

        state.tests = results.map((item: any) => ({
          id: item.id,
          code: item.test_code,
          name: item.test_name,
          printName: item.print_name,
          serviceName: item.service_name ?? "",
          tubeName: item.tube_name ?? null,
          testCompletionTime: item.test_completion_time ?? "",
          isSensitive: item.is_sensitive ?? false,
          suggestionNote: item.suggestion_note ?? "",
          disclaimer: item.disclaimer ?? "",
          reportType: item.report_type ?? "PARAMETER",
          isActive: item.status ?? true,
        }));
      })
      .addCase(fetchTests.rejected, (state) => {
        state.testsLoading = false;
        state.error = "Failed to load tests";
      })

      // =========================
      // CATEGORIES
      // =========================
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;

        const results = getResults(action.payload);

        state.categories = results.map((item: any) => ({
          id: item.id,
          code: item.category_code,
          name: item.category_name,
          isActive: item.status ?? true,
          tests: item.tests ?? [],
          noOfTests: item.no_of_tests ?? item.tests?.length ?? 0,
        }));
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categoriesLoading = false;
        state.error = "Failed to load categories";
      });
  },
});

export default testSlice.reducer;

// =====================================================
// Selectors
// =====================================================

export const selectTests = (state: RootState) => state.test.tests;
export const selectCategories = (state: RootState) => state.test.categories;

export const selectTestsLoading = (state: RootState) =>
  state.test.testsLoading;

export const selectCategoriesLoading = (state: RootState) =>
  state.test.categoriesLoading;

export const selectTestError = (state: RootState) => state.test.error;