import {
    CreatePathologyProfilePayload,
} from "../types/pathologyProfile.types";

import { http } from "./http";

// =====================================================
// Pathology Profile APIs
// =====================================================
export const pathologyProfileApi = {
    // Fetch all pathology profiles
    getPathologyProfiles: () => http.get("/profiles/"),

    getServiceNameLists: () => http.get("/laboratory-test/"),

    // Create pathology profile
    createPathologyProfile: (payload: CreatePathologyProfilePayload) =>
        http.post("/profiles/", payload),

    updatePathologyProfile: (id: number, payload: CreatePathologyProfilePayload) =>
        http.put(`/profiles/${id}/`, payload),
};
