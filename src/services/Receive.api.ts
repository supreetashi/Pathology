import {
  CreateReceiveSamplePayload,
  ReceiveSamplePayload,
  RejectSamplePayload,
} from "../types/Receive.types";
import { http } from "./http";

// =====================================================
// Receive Sample APIs
// =====================================================
export const receiveApi = {

  // GET /api/samples/ — list all active samples
  getSamples: () => http.get("/samples/"),

  // POST /api/create-sample/ — create a new sample
  createSample: async (payload: CreateReceiveSamplePayload) => {
    try {
      return await http.post("/create-sample/", payload);
    } catch (error: any) {
      console.error(
        "[createSample] error:",
        JSON.stringify(error.response?.data ?? error.message, null, 2),
      );
      throw error;
    }
  },

  // POST /api/receive-sample/<sample_id>/ — mark sample as received
  receiveSample: async (sampleId: number, payload: ReceiveSamplePayload) => {
    try {
      return await http.post(`/receive-sample/${sampleId}/`, payload);
    } catch (error: any) {
      console.error(
        "[receiveSample] error:",
        JSON.stringify(error.response?.data ?? error.message, null, 2),
      );
      throw error;
    }
  },

  // POST /api/reject-sample/<sample_id>/ — mark sample as rejected
  rejectSample: async (sampleId: number, payload: RejectSamplePayload) => {
    try {
      return await http.post(`/reject-sample/${sampleId}/`, payload);
    } catch (error: any) {
      console.error(
        "[rejectSample] error:",
        JSON.stringify(error.response?.data ?? error.message, null, 2),
      );
      throw error;
    }
  },

  // GET /api/receive-activity-logs/ — receive and reject history
  getActivityLogs: () => http.get("/receive-activity-logs/"),

  // DELETE /api/delete-sample/<sample_id>/ — soft delete
  deleteSample: async (sampleId: number) => {
    try {
      return await http.delete(`/delete-sample/${sampleId}/`);
    } catch (error: any) {
      console.error(
        "[deleteSample] error:",
        JSON.stringify(error.response?.data ?? error.message, null, 2),
      );
      throw error;
    }
  },
};