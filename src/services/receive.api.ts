import { http } from "./http";

// ── Types (mirror ReceiveSample Django model) ─────────────────────────────────

export interface ReceiveSample {
  id: number;
  shipment: number | null;
  ship_date: string;         // "YYYY-MM-DD"
  ship_time: string;         // "HH:MM:SS"
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
  remark: string | null;
  sub_optimal: boolean;
  status: "Shipped" | "Received" | "Rejected";
  is_deleted: boolean;
  created_at: string;
  deleted_at: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function currentTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

// ── API calls ─────────────────────────────────────────────────────────────────

/**
 * GET /api/active-samples/  — all non-deleted ReceiveSamples.
 * Returns { message, data: ReceiveSample[] }.
 * We filter by status on the frontend to populate each tab.
 */
export const getAllSamples = async (): Promise<ReceiveSample[]> => {
  const res = await http.get<{ message: string; data: ReceiveSample[] }>("/active-samples/");
  return res.data.data;
};

/**
 * GET /api/receive-activity-logs/  — samples with status Received or Rejected.
 * Returns { message, data: ReceiveSample[] }.
 */
export const getActivityLogSamples = async (): Promise<ReceiveSample[]> => {
  const res = await http.get<{ message: string; data: ReceiveSample[] }>("/receive-activity-logs/");
  return res.data.data;
};

/**
 * POST /api/receive-sample/<id>/  — mark a sample as Received.
 */
export const receiveSample = async (sampleId: number): Promise<void> => {
  await http.post(`/receive-sample/${sampleId}/`, {
    receive_date: todayDate(),
    receive_time: currentTime(),
  });
};

/**
 * POST /api/reject-sample/<id>/  — mark a sample as Rejected.
 */
export const rejectSample = async (sampleId: number): Promise<void> => {
  await http.post(`/reject-sample/${sampleId}/`, {
    receive_date: todayDate(),
    receive_time: currentTime(),
  });
};
