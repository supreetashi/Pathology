import {
  CreateParameterPayload,
  UpdateParameterPayload,
  CreateReferenceRangePayload,
  UpdateReferenceRangePayload,
} from "../types/parameter.types";
import { http } from "./http";

export const parameterApi = {
  // ── Parameters ─────────────────────────────────────
  getParameters: async () => {
    const allItems: any[] = [];
    let page = 1;
    while (true) {
      const res = await http.get(`/parameters/?page=${page}`);
      allItems.push(...res.data.results);
      if (!res.data.next) break;
      page += 1;
    }
    return { data: allItems };
  },

  createParameter: (payload: CreateParameterPayload) =>
    http.post("/parameters/", payload),

  updateParameter: ({ id, ...payload }: UpdateParameterPayload) =>
    http.put(`/parameters/${id}/`, payload),

  updateParameterStatus: (id: string, status: boolean) =>
    http.patch(`/parameters/${id}/`, { status }),

  deleteParameter: (id: string) => http.delete(`/parameters/${id}/`),

  // ── Reference Ranges — nested under parameter ──────
  getReferenceRanges: (parameterId: string) =>
    http.get(`/parameters/${parameterId}/`),

  createReferenceRange: (payload: CreateReferenceRangePayload) =>
    http.post(`/parameters/${payload.parameter}/reference-ranges/`, payload),

  updateReferenceRange: ({ id, ...payload }: UpdateReferenceRangePayload) =>
    http.put(`/parameters/${payload.parameter}/reference-ranges/${id}/`, payload),

  deleteReferenceRange: (id: number, parameterId: string) =>
    http.delete(`/parameters/${parameterId}/reference-ranges/${id}/`),
};