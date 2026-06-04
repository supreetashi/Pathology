import {
  CreateSamplePayload,
  CreateTubePayload,
} from "../types/sampleTube.types";
import { http } from "./http";

// =====================================================
// Sample & Tube APIs
// =====================================================
export const sampleTubeApi = {
  // Fetch all samples
  getSamples: () => http.get("/samples/"),

  // Fetch all tubes
  getTubes: () => http.get("/tubes/"),

  // Create sample
  createSample: (payload: CreateSamplePayload) =>
    http.post("/samples/", payload),

  // Create tube
  createTube: (payload: CreateTubePayload) => http.post("/tubes/", payload),

 updateSample: (id: string, payload: CreateSamplePayload) =>
  http.put(`/samples/${id}/`, payload),

updateTube: (id: string, payload: CreateTubePayload) =>
  http.put(`/tubes/${id}/`, payload),
};