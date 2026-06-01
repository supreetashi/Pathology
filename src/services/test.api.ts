import {
  CreateCategoryPayload,
  CreateTestPayload,
  UpdateCategoryPayload,
  UpdateTestPayload,
} from "../types/test.types";
import { http } from "./http";

// =====================================================
// Test & Category APIs
// =====================================================

export const testApi = {
  // ── Tests ──────────────────────────────────────────
  getTests: () => http.get("/tests/"),

  createTest: (payload: CreateTestPayload) => http.post("/tests/", payload),

  updateTest: ({ id, ...payload }: UpdateTestPayload) =>
  http.put(`/tests/${id}/`, payload),

  updateTestStatus: (id: number, status: boolean) =>
    http.patch(`/tests/${id}/`, { status }),

  deleteTest: (id: number) => http.delete(`/tests/${id}/`),

  // ── Categories ─────────────────────────────────────
  getCategories: () => http.get("/categories/"),

  createCategory: (payload: CreateCategoryPayload) =>
    http.post("/categories/", payload),

  updateCategory: ({ id, ...payload }: UpdateCategoryPayload) =>
    http.patch(`/categories/${id}/`, payload),

  updateCategoryStatus: (id: number, status: boolean) =>
    http.patch(`/categories/${id}/`, { status }),

  deleteCategory: (id: number) => http.delete(`/categories/${id}/`),
};