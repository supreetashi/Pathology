import {
  CreateReceiveSamplePayload,
  ReceiveSamplePayload,
  RejectSamplePayload,
} from "../types/receive.types";
import { http } from "./http";

export interface ReceiveSample {
  id: number;
  ship_date: string;
  ship_time: string;
  shipment_no: string;
  specimen_no: string;
  specimen_type: string;
  test_code: string;
  test_name: string;
  service_name: string;
  patient_name: string;
  patient_age: string | number;
  patient_code: string;
  patient_gender: string;
  status: string;
  [key: string]: unknown;
}

const toArray = <T>(response: unknown): T[] => {
  const payload = (response as { data?: unknown })?.data ?? response;

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { results?: unknown }).results)
  ) {
    return (payload as { results: T[] }).results;
  }

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }

  return [];
};

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

export const getAllSamples = async (): Promise<ReceiveSample[]> => {
  const response = await receiveApi.getSamples();
  return toArray<ReceiveSample>(response);
};

export const getActivityLogSamples = async (): Promise<ReceiveSample[]> => {
  const response = await receiveApi.getActivityLogs();
  return toArray<ReceiveSample>(response);
};

export const receiveSample = async (
  sampleId: number,
  payload: ReceiveSamplePayload = {},
) => receiveApi.receiveSample(sampleId, payload);

export const rejectSample = async (
  sampleId: number,
  payload: RejectSamplePayload = {},
) => receiveApi.rejectSample(sampleId, payload);