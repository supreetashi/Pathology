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
  receive_date?: string | null;
  receive_time?: string | null;
  remark?: string | null;
  sub_optimal?: boolean | null;
  resend_new_sample?: boolean | null;
  accepted_by?: string | null;
  rejected_by?: string | null;
  result_status?: string | null;
  [key: string]: unknown;
}

// Shape returned by /shipped-shipment/
interface ShippedShipmentRaw {
  id: number;
  ship_date: string;
  shipment_no: string;
  ship_to: string;
  pending_shipment: {
    id?: number;
    order_date?: string;
    sample_no: string | null;
    sample_type: string;
    test_code: string;
    test_name: string;
    service_name: string;
    patient: {
      id?: number;
      name: string;
      age: number;
      patient_code: string;
      gender: string;
    } | null;
  } | null;
}

// Shape returned by /receive-activity-logs/
// This is the authoritative source for Received and Rejected tabs.
// It returns a full flat record with status: "Received" | "Rejected" directly.
interface ActivityLogRaw {
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
  patient_age: number;
  patient_gender: string;
  patient_code: string;
  receive_date: string | null;
  receive_time: string | null;
  accepted_by: string | null;
  rejected_by: string | null;
  remark: string | null;
  sub_optimal: boolean;
  resend_new_sample: boolean;
  status: "Received" | "Rejected";
  is_deleted: boolean;
  created_at: string;
  deleted_at: string | null;
  shipment: null;
}

// =====================================================
// Helpers
// =====================================================

function normaliseShipped(d: ShippedShipmentRaw): ReceiveSample {
  const dt = d.ship_date ? new Date(d.ship_date) : null;
  return {
    id: d.id,
    ship_date: dt ? dt.toISOString().split("T")[0] : "",
    ship_time: dt
      ? dt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
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
    sub_optimal: null,
    resend_new_sample: null,
    accepted_by: null,
    rejected_by: null,
    result_status: null,
  };
}

function normaliseActivityLog(d: ActivityLogRaw): ReceiveSample {
  return {
    id: d.id,
    ship_date: d.ship_date ?? "",
    ship_time: d.ship_time ?? "",
    shipment_no: d.shipment_no ?? "-",
    specimen_no: d.specimen_no ?? "-",
    specimen_type: d.specimen_type ?? "-",
    test_code: d.test_code ?? "-",
    test_name: d.test_name ?? "-",
    service_name: d.service_name ?? "-",
    patient_name: d.patient_name ?? "-",
    patient_age: d.patient_age ?? 0,
    patient_code: d.patient_code ?? "-",
    patient_gender: d.patient_gender ?? "-",
    status: d.status, // "Received" | "Rejected" — comes directly from backend
    receive_date: d.receive_date ?? null,
    receive_time: d.receive_time ?? null,
    remark: d.remark ?? null,
    sub_optimal: d.sub_optimal ?? null,
    resend_new_sample: d.resend_new_sample ?? null,
    accepted_by: d.accepted_by ?? null,
    rejected_by: d.rejected_by ?? null,
    result_status: null,
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

function buildCreatePayload(
  shipped: ShippedShipmentRaw,
): CreateReceiveSamplePayload {
  const dt = shipped.ship_date ? new Date(shipped.ship_date) : null;
  return {
    ship_date: dt ? dt.toISOString().split("T")[0] : "",
    ship_time: dt
      ? dt.toISOString().split("T")[1]?.slice(0, 8) ?? "00:00:00"
      : "00:00:00",
    shipment_no: shipped.shipment_no ?? "",
    specimen_no: shipped.pending_shipment?.sample_no ?? "",
    specimen_type: shipped.pending_shipment?.sample_type ?? "",
    test_code: shipped.pending_shipment?.test_code ?? "",
    test_name: shipped.pending_shipment?.test_name ?? "",
    service_name: shipped.pending_shipment?.service_name ?? "",
    patient_name: shipped.pending_shipment?.patient?.name ?? "",
    patient_age: shipped.pending_shipment?.patient?.age ?? 0,
    patient_code: shipped.pending_shipment?.patient?.patient_code ?? "",
    patient_gender: shipped.pending_shipment?.patient?.gender ?? "",
    status: "Shipped",
  };
}

async function getOrCreateReceiveSample(shippedId: number): Promise<number> {
  const shippedRes = await http.get("/shipped-shipment/");
  const shippedList = toArray<ShippedShipmentRaw>(shippedRes);
  const shipped = shippedList.find((s) => s.id === shippedId);

  if (!shipped) throw new Error(`Shipped shipment ${shippedId} not found`);

  const existingRes = await http.get(
    `/samples/?search=${shipped.shipment_no}`,
  );
  const existing = toArray<{
    id: number;
    shipment_no: string;
    status: string;
  }>(existingRes);
  const match = existing.find((s) => s.shipment_no === shipped.shipment_no);

  if (match) return match.id;

  const createRes = await receiveApi.createSample(buildCreatePayload(shipped));
  const newId = createRes.data?.data?.id ?? createRes.data?.id;

  if (!newId) throw new Error("Failed to create ReceiveSample record");

  return newId;
}

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
      console.error(
        "[createSample] error:",
        JSON.stringify(error.response?.data ?? error.message, null, 2),
      );
      throw error;
    }
  },

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

// =====================================================
// Typed helpers consumed by ReceiveView
// =====================================================

export const getAllSamples = async (): Promise<ReceiveSample[]> => {
  const [shippedRes, activityRes] = await Promise.all([
    receiveApi.getShippedSamples(),
    receiveApi.getActivityLogs(), // SOURCE OF TRUTH for Received + Rejected tabs
  ]);

  const shippedRaw = toArray<ShippedShipmentRaw>(shippedRes);
  const activityRaw = toArray<ActivityLogRaw>(activityRes)
    .filter((r) => !r.is_deleted); // exclude soft-deleted records

  // Build set of shipment_nos already actioned → exclude from Shipped tab
  const processedShipmentNos = new Set<string>(
    activityRaw
      .map((r) => r.shipment_no)
      .filter((n): n is string => Boolean(n)),
  );

  const shipped = shippedRaw
    .filter((s) => !processedShipmentNos.has(s.shipment_no))
    .map(normaliseShipped);

  // Activity log returns status "Received" | "Rejected" directly — no mapping needed
  const receivedAndRejected = activityRaw.map(normaliseActivityLog);

  return [...shipped, ...receivedAndRejected];
};

// Activity logs tab still uses the same endpoint — just pass through all records
export const getActivityLogSamples = async (): Promise<ReceiveSample[]> => {
  const response = await receiveApi.getActivityLogs();
  return toArray<ActivityLogRaw>(response)
    .filter((r) => !r.is_deleted)
    .map(normaliseActivityLog);
};

export const receiveSample = async (
  shippedId: number,
  payload: ReceiveSamplePayload = {},
): Promise<void> => {
  const sampleId = await getOrCreateReceiveSample(shippedId);
  await receiveApi.receiveSample(sampleId, {
    receive_date: payload.receive_date,
    receive_time: payload.receive_time,
    remark: payload.remark,
    sub_optimal: payload.sub_optimal,
    accepted_by: payload.accepted_by,
  });
};

export const rejectSample = async (
  shippedId: number,
  payload: RejectSamplePayload = {},
): Promise<void> => {
  const sampleId = await getOrCreateReceiveSample(shippedId);
  await receiveApi.rejectSample(sampleId, {
    receive_date: payload.receive_date,
    receive_time: payload.receive_time,
    remark: payload.remark,
    resend_new_sample: payload.resend_new_sample,
    rejected_by: payload.rejected_by,
  });
};

export const createSample = async (payload: CreateReceiveSamplePayload) => {
  return await receiveApi.createSample(payload);
};

export const deleteSample = async (sampleId: number): Promise<void> => {
  await receiveApi.deleteSample(sampleId);
};