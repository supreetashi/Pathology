import {
  CreateReceiveSamplePayload,
  ReceiveSamplePayload,
  RejectSamplePayload,
} from "../types/Receive.types";
import { http } from "./http";

// =====================================================
// Types
// =====================================================
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
  remark?: string | null;
  receive_date?: string | null;
  receive_time?: string | null;
  [key: string]: unknown;
}

// Shape returned by /shipped-shipment/
interface ShippedShipmentRaw {
  id: number;
  ship_date: string;        // ISO datetime e.g. "2026-06-09T12:30:00"
  shipment_no: string;
  ship_to: string;
  pending_shipment: {
    id: number;
    order_date: string;
    sample_no: string | null;
    sample_type: string;
    test_code: string;
    test_name: string;
    service_name: string;
    patient: {
      id: number;
      name: string;
      age: number;
      patient_code: string;
      gender: string;
    } | null;
  } | null;
}

// Shape returned by /received-shipment/
interface ReceivedShipmentRaw {
  id: number;
  receive_date: string;
  received_no: string;
  status: "Accepted" | "Rejected";
  result: string;
  shipped_shipment: ShippedShipmentRaw | null;
}

// =====================================================
// Normalisers — map raw API shapes → ReceiveSample
// =====================================================

function normaliseShipped(d: ShippedShipmentRaw): ReceiveSample {
  const dt = d.ship_date ? new Date(d.ship_date) : null;
  return {
    id: d.id,
    ship_date: dt ? dt.toISOString().split("T")[0] : "",
    ship_time: dt
      ? dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
      : "",
    shipment_no: d.shipment_no ?? "-",
    specimen_no: d.pending_shipment?.sample_no ?? "-",
    specimen_type: d.pending_shipment?.sample_type ?? "-",
    test_code: d.pending_shipment?.test_code ?? "-",
    test_name: d.pending_shipment?.test_name ?? "-",
    service_name: d.pending_shipment?.service_name ?? "-",
    patient_name: d.pending_shipment?.patient?.name ?? "-",
    patient_age: d.pending_shipment?.patient?.age ?? 0,
    patient_code: d.pending_shipment?.patient?.patient_code ?? "-",
    patient_gender: d.pending_shipment?.patient?.gender ?? "-",
    status: "Shipped",
    remark: null,
    receive_date: null,
    receive_time: null,
  };
}

function normaliseReceived(d: ReceivedShipmentRaw): ReceiveSample {
  const shipped = normaliseShipped(d.shipped_shipment ?? ({} as ShippedShipmentRaw));
  const receiveDt = d.receive_date ? new Date(d.receive_date) : null;
  return {
    ...shipped,
    id: d.id,
    status: d.status === "Rejected" ? "Rejected" : "Received",
    remark: null,
    receive_date: receiveDt ? receiveDt.toISOString().split("T")[0] : null,
    receive_time: receiveDt
      ? receiveDt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
      : null,
  };
}

const toArray = <T>(response: unknown): T[] => {
  const payload = (response as { data?: unknown })?.data ?? response;
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    if (Array.isArray((payload as { results?: unknown }).results))
      return (payload as { results: T[] }).results;
    if (Array.isArray((payload as { data?: unknown }).data))
      return (payload as { data: T[] }).data;
  }
  return [];
};

// =====================================================
// Receive Sample APIs
// =====================================================
export const receiveApi = {
  getShippedSamples: () => http.get("/shipped-shipment/"),
  getReceivedSamples: () => http.get("/received-shipment/"),
  getActivityLogs: () => http.get("/receive-activity-logs/"),

  createSample: async (payload: CreateReceiveSamplePayload) => {
    try {
      return await http.post("/create-sample/", payload);
    } catch (error: any) {
      console.error("[createSample] error:", JSON.stringify(error.response?.data ?? error.message, null, 2));
      throw error;
    }
  },

  receiveSample: async (sampleId: number, payload: ReceiveSamplePayload) => {
    try {
      return await http.post(`/receive-sample/${sampleId}/`, payload);
    } catch (error: any) {
      console.error("[receiveSample] error:", JSON.stringify(error.response?.data ?? error.message, null, 2));
      throw error;
    }
  },

  rejectSample: async (sampleId: number, payload: RejectSamplePayload) => {
    try {
      return await http.post(`/reject-sample/${sampleId}/`, payload);
    } catch (error: any) {
      console.error("[rejectSample] error:", JSON.stringify(error.response?.data ?? error.message, null, 2));
      throw error;
    }
  },

  deleteSample: async (sampleId: number) => {
    try {
      return await http.delete(`/delete-sample/${sampleId}/`);
    } catch (error: any) {
      console.error("[deleteSample] error:", JSON.stringify(error.response?.data ?? error.message, null, 2));
      throw error;
    }
  },
};

// =====================================================
// Typed helpers consumed by ReceiveView
// =====================================================

export const getAllSamples = async (): Promise<ReceiveSample[]> => {
  const [shippedRes, receivedRes] = await Promise.all([
    receiveApi.getShippedSamples(),
    receiveApi.getReceivedSamples(),
  ]);
  const shipped = toArray<ShippedShipmentRaw>(shippedRes).map(normaliseShipped);
  const received = toArray<ReceivedShipmentRaw>(receivedRes).map(normaliseReceived);
  return [...shipped, ...received];
};

export const getActivityLogSamples = async (): Promise<ReceiveSample[]> => {
  const response = await receiveApi.getActivityLogs();
  return toArray<ReceiveSample>(response);
};

export const receiveSample = async (
  sampleId: number,
  payload: ReceiveSamplePayload = {},
): Promise<void> => {
  await receiveApi.receiveSample(sampleId, payload);
};

export const rejectSample = async (
  sampleId: number,
  payload: RejectSamplePayload = {},
): Promise<void> => {
  await receiveApi.rejectSample(sampleId, payload);
};

export const createSample = async (payload: CreateReceiveSamplePayload) => {
  return await receiveApi.createSample(payload);
};

export const deleteSample = async (sampleId: number): Promise<void> => {
  await receiveApi.deleteSample(sampleId);
};