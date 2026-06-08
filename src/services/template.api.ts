import {
  CreateTemplatePayload,
  UpdateTemplatePayload,
} from "../types/template.types";
import { http } from "./http";

export const templateApi = {
  getTemplates: () => http.get("/templates/"),

  createTemplate: (payload: CreateTemplatePayload) =>
    http.post("/templates/", payload),

  updateTemplate: ({ id, ...payload }: UpdateTemplatePayload) =>
    http.put(`/templates/${id}/`, payload),

  updateTemplateStatus: (id: string, status: boolean) =>
    http.patch(`/templates/${id}/`, { status }),

  deleteTemplate: (id: string) => http.delete(`/templates/${id}/`),
};