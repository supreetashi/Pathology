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
  getTests: async () => {
    const allItems: any[] = [];
    let page = 1;

    while (true) {
      const res = await http.get(`/tests/?page=${page}`);
      allItems.push(...res.data.results);
      if (!res.data.next) break;
      page += 1;
    }

    return { data: allItems };
  },

  createTest: (payload: CreateTestPayload) => http.post("/tests/", payload),

  updateTest: ({ id, ...payload }: UpdateTestPayload) =>
    http.put(`/tests/${id}/`, payload),

  updateTestStatus: (id: number, status: boolean) =>
    http.patch(`/tests/${id}/`, { status }),

  deleteTest: (id: number) => http.delete(`/tests/${id}/`),

  // ── Categories ─────────────────────────────────────
  getCategories: async () => {
    const allItems: any[] = [];
    let page = 1;

    while (true) {
      const res = await http.get(`/categories/?page=${page}`);
      allItems.push(...res.data.results);
      if (!res.data.next) break;
      page += 1;
    }

    return { data: allItems };
  },

  createCategory: (payload: CreateCategoryPayload) =>
    http.post("/categories/", payload),

  updateCategory: ({ id, ...payload }: UpdateCategoryPayload) =>
    http.patch(`/categories/${id}/`, payload),

  updateCategoryStatus: (id: number, status: boolean) =>
    http.patch(`/categories/${id}/`, { status }),

  deleteCategory: (id: number) => http.delete(`/categories/${id}/`),
};