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

    // Create pathology profile
    createPathologyProfile: (payload: CreatePathologyProfilePayload) =>
        http.post("/profiles/", payload),
};
