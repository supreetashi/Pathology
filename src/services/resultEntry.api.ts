import { http } from "./http";
import type { Result } from "../components/ResultEntry/types";

// ── Types (mirror ResultEntry Django model + serializer) ──────────────────────

export interface ResultEntryRecord {
  id: number;
  receive_sample: number;        // FK id → ReceiveSample
  parameter_name: string;
  result_value: string | null;
  remarks: string | null;
  entered_by: string | null;
  result_status: "Pending" | "Completed";
  is_deleted: boolean;
  created_at: string;            // ISO datetime
  deleted_at: string | null;
  // Read-only computed fields from serializer:
  specimen_no: string | null;
  shipment_no: string | null;
  patient_name: string | null;
  test_name: string | null;
}

export interface PendingSample {
  id: number;
  shipment_no: string;
  specimen_no: string;
  patient_name: string;
  test_name: string;
  status: string;
}

// ── Mapper: ResultEntryRecord → Result (table row shape) ──────────────────────

export function toResult(r: ResultEntryRecord): Result {
  return {
    id: r.id,
    date: r.created_at ? r.created_at.slice(0, 10).split("-").reverse().join("/") : "—",
    time: r.created_at
      ? new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "—",
    patient: r.patient_name ?? "—",
    details: r.specimen_no ?? "—",
    type: "Registered",
    doctor: "—",
    bill: r.shipment_no ?? "—",
    orders: 1,
    status: r.result_status === "Completed" ? "Completed" : "Pending",
  };
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** GET /api/result-entry/list/ */
export const getResultEntries = async (): Promise<ResultEntryRecord[]> => {
  const res = await http.get<ResultEntryRecord[]>("/result-entry/list/");
  return res.data;
};

/** GET /api/result-entry/pending-samples/ */
export const getPendingSamples = async (): Promise<PendingSample[]> => {
  const res = await http.get<PendingSample[]>("/result-entry/pending-samples/");
  return res.data;
};

/** POST /api/result-entry/create/ */
export const createResultEntry = async (
  receiveSampleId: number,
  parameterName: string,
): Promise<ResultEntryRecord> => {
  const res = await http.post<{ message: string; data: ResultEntryRecord }>(
    "/result-entry/create/",
    {
      receive_sample: receiveSampleId,
      parameter_name: parameterName,
      result_status: "Pending",
    },
  );
  return res.data.data;
};

/** POST /api/result-entry/<id>/complete/ */
export const completeResultEntry = async (resultId: number): Promise<void> => {
  await http.post(`/result-entry/${resultId}/complete/`);
};
