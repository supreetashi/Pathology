import { http } from "./http";

export const agencyClinicApi = {
  getAll: (search?: string) =>
    http.get(
      `/agency-clinics/${search ? `?search=${encodeURIComponent(search)}` : ""}`,
    ),

  getById: (id: string) => http.get(`/agency-clinics/${id}/`),

  create: (payload: any) => http.post("/agency-clinics/", payload),

  update: (id: string, payload: any) =>
    http.put(`/agency-clinics/${id}/`, payload),

  delete: (id: string) => http.delete(`/agency-clinics/${id}/`),
};
