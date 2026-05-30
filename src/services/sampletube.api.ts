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
};
