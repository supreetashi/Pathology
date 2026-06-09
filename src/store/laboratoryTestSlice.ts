import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getLaboratoryTests } from "../services/laboratoryTest.api";
import type { RootState } from "./index";

export type LaboratoryTest = {
  id: number;
  identifier: number;
  name: string;
  tag_name: string | null;
  unit: string | null;
};

type State = {
  items: LaboratoryTest[];
  loading: boolean;
};

export const fetchLaboratoryTests = createAsyncThunk(
  "laboratoryTest/fetchAll",
  async () => getLaboratoryTests()
);

const laboratoryTestSlice = createSlice({
  name: "laboratoryTest",
  initialState: { items: [], loading: false } as State,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLaboratoryTests.pending, (state) => { state.loading = true; })
      .addCase(fetchLaboratoryTests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLaboratoryTests.rejected, (state) => { state.loading = false; });
  },
});

export const selectLaboratoryTests = (state: RootState) => state.laboratoryTests.items;
export const selectLaboratoryTestsLoading = (state: RootState) => state.laboratoryTests.loading;
export default laboratoryTestSlice.reducer;