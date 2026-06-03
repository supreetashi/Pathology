import type { Clinic ,PaginatedResponse } from "../types/clinic.types";
import { http } from "./http";

// =====================================================
// Clinic API Operations
// =====================================================
export const clinicApi = {
  // Fetch clinic details by id
  getById: (id: string) => http.get<Clinic>(`/clinics/${id}/`),

  // Fetch all clinics
  getAll: () =>
  http.get<PaginatedResponse<Clinic>>("/clinics"),
};
