import {
  CreateParameterPayload,
  UpdateParameterPayload,
  CreateReferenceRangePayload,
  UpdateReferenceRangePayload,
} from "../types/parameter.types";
import { http } from "./http";

// =====================================================
// Parameter & Reference Range APIs
// =====================================================

export const parameterApi = {
  // ── Parameters ─────────────────────────────────────
  getParameters: () => http.get("/parameters/?page_size=100"),

  createParameter: (payload: CreateParameterPayload) =>
    http.post("/parameters/", payload),

  updateParameter: ({ id, ...payload }: UpdateParameterPayload) =>
  http.put(`/parameters/${id}/`, payload),

  updateParameterStatus: (id: string, status: boolean) =>
  http.put(`/parameters/${id}/`, { status }),

  deleteParameter: (id: string) => http.delete(`/parameters/${id}/`),

  // ── Reference Ranges ───────────────────────────────
  getReferenceRanges: (parameterId?: string) =>
  parameterId
    ? http.get(`/parameter-reference-ranges/?parameter=${parameterId}`)
    : http.get("/parameter-reference-ranges/"),

  createReferenceRange: (payload: CreateReferenceRangePayload) =>
    http.post("/parameter-reference-ranges/", payload),

  updateReferenceRange: ({ id, ...payload }: UpdateReferenceRangePayload) =>
    http.put(`/parameter-reference-ranges/${id}/`, payload),

  deleteReferenceRange: (id: number) =>
    http.delete(`/parameter-reference-ranges/${id}/`),
};