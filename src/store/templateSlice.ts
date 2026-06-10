import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  CreateTemplatePayload,
  UpdateTemplatePayload,
  TemplateState,
} from "../types/template.types";
import type { RootState } from ".";
import { templateApi } from "../services/template.api";

const initialState: TemplateState = {
  templates: [],
  loading: false,
  error: null,
};

export const fetchTemplates = createAsyncThunk(
  "template/fetchTemplates",
  async () => {
    const res = await templateApi.getTemplates();
    return res.data;
  }
);

export const createTemplate = createAsyncThunk(
  "template/createTemplate",
  async (payload: CreateTemplatePayload, { dispatch }) => {
    const res = await templateApi.createTemplate(payload);
    dispatch(fetchTemplates());
    return res.data;
  }
);

export const updateTemplate = createAsyncThunk(
  "template/updateTemplate",
  async (payload: UpdateTemplatePayload, { dispatch }) => {
    await templateApi.updateTemplate(payload);
    dispatch(fetchTemplates());
  }
);

export const toggleTemplateStatus = createAsyncThunk(
  "template/toggleTemplateStatus",
  async ({ id, status }: { id: string; status: boolean }, { dispatch }) => {
    await templateApi.updateTemplateStatus(id, status);
    dispatch(fetchTemplates());
  }
);

export const deleteTemplate = createAsyncThunk(
  "template/deleteTemplate",
  async (id: string, { dispatch }) => {
    await templateApi.deleteTemplate(id);
    dispatch(fetchTemplates());
  }
);

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load templates";
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        const results = action.payload?.results ?? [];
        state.templates = results.map((item: any) => ({
          id: item.id,
          code: item.template_code,
          name: item.template_name,
          templateFor: item.template_for ?? "",
          serviceName: item.service_name ?? "",
          gender: item.gender ?? "BOTH",
          userType: item.user_type ?? "",
          templateFormat: item.template_format ?? "TEXT",
          templateText: item.template_text ?? "",
          templateJson: item.template_json ?? null,
          isActive: item.status ?? true,
        }));
      });
  },
});

export default templateSlice.reducer;

export const selectTemplates = (state: RootState) => state.template.templates;
export const selectTemplateLoading = (state: RootState) => state.template.loading;
export const selectTemplateError = (state: RootState) => state.template.error;