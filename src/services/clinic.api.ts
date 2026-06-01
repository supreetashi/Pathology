import type { Clinic, ClinicListResponse } from "../types/clinic.types";
import { http } from "./http";

// =====================================================
// Clinic API Operations
// =====================================================
export const clinicApi = {
  // Fetch clinic details by id
  getById: (id: number) => http.get<Clinic>(`/clinics/${id}/`),

  // Fetch all clinics
  getAll: () => http.get<ClinicListResponse>("/clinics/"),
};
