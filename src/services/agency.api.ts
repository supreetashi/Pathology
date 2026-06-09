import type { PaginatedAgencyResponse, Agency, CreateAgencyPayload } from "../types/agency.types";
import { http } from "./http";

export type { Agency, CreateAgencyPayload };

export const agencyApi = {
  getAll: async (search?: string): Promise<PaginatedAgencyResponse> => {
    const response = await http.get<PaginatedAgencyResponse>(
      `/agencies/${search ? `?search=${encodeURIComponent(search)}` : ""}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Agency> => {
    const response = await http.get<Agency>(`/agencies/${id}/`);
    return response.data;
  },

  create: async (payload: CreateAgencyPayload): Promise<Agency> => {
    const response = await http.post<Agency>("/agencies/", payload);
    return response.data;
  },

  update: async (
    id: string,
    payload: Partial<CreateAgencyPayload>
  ): Promise<Agency> => {
    const response = await http.put<Agency>(`/agencies/${id}/`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await http.delete(`/agencies/${id}/`);
  },
};