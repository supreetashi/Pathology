// ============================================================
//  shipment.api.ts  —  Shipment module API service
//  Base URL: /api/  (adjust to your http instance base)
// ============================================================

import { http } from "./http";

// ─────────────────────────────────────────────
//  TYPES  (mirror your Django models exactly)
// ─────────────────────────────────────────────

export interface Patient {
  id: number;
  name: string;
  age: number;
  patient_code: string;
  gender: string;
}

export interface PendingShipment {
  id: number;
  order_date: string;          // ISO datetime
  sample_no: string | null;
  sample_type: "Blood" | "Urine";
  test_code: string;
  test_name: string;
  service_name: string;
  patient: Patient | null;
  created_at: string;
}

export interface ShipmentShipped {
  id: number;
  ship_date: string;           // ISO datetime
  shipment_no: string;
  pending_shipment: PendingShipment | null;
  ship_to: string;
  created_at: string;
}

export interface ShipmentReceived {
  id: number;
  receive_date: string;        // ISO datetime
  received_no: string;
  shipped_shipment: ShipmentShipped | null;
  status: "Accepted" | "Rejected";
  result: string;
  created_at: string;
}

export interface ActivityLog {
  id: number;
  shipped_shipment: ShipmentShipped | null;
  ship_date_time: string;      // ISO datetime
  ship_from: string;
  ship_to: string;
  ship_by: string;
  created_at: string;
}

// Payload for Schedule Shipping (POST /api/schedule-shipping/)
export interface ScheduleShippingPayload {
  ship_date: string;           // ISO datetime  e.g. "2026-03-13T12:30:00"
  ship_to: string;
  pending_shipment_ids: number[];
}

// Payload for Move to Received (POST /api/move-to-received/)
export interface MoveToReceivedPayload {
  shipped_shipment_id: number;
  status: "Accepted" | "Rejected";
  result?: string;
}

// ─────────────────────────────────────────────
//  PENDING SHIPMENT
// ─────────────────────────────────────────────

/** GET /api/pending-shipment/  — list all pending samples */
export const getPendingShipments = async (): Promise<PendingShipment[]> => {
  const res = await http.get<PendingShipment[]>(`/pending-shipment/`);
  return res.data;
};

// ─────────────────────────────────────────────
//  SCHEDULE SHIPPING  (Pending → Shipped)
// ─────────────────────────────────────────────

/** POST /api/schedule-shipping/  — schedule selected rows for shipping */
export const scheduleShipping = async (
  payload: ScheduleShippingPayload
): Promise<ShipmentShipped[]> => {
  const res = await http.post<ShipmentShipped[]>(
    `/schedule-shipping/`,
    payload
  );
  return res.data;
};

/** GET /api/schedule-shipping/  — list all scheduled shippings */
export const getScheduledShippings = async (): Promise<ShipmentShipped[]> => {
  const res = await http.get<ShipmentShipped[]>(`/schedule-shipping/`);
  return res.data;
};

// ─────────────────────────────────────────────
//  MOVE TO SHIPPED
// ─────────────────────────────────────────────

/** POST /api/move-to-shipped/  — move a scheduled shipment to shipped status */
export const moveToShipped = async (
  payload: { pending_shipment_ids: number[]; ship_date: string; ship_to: string }
): Promise<ShipmentShipped[]> => {
  const res = await http.post<ShipmentShipped[]>(
    `/move-to-shipped/`,
    payload
  );
  return res.data;
};

// ─────────────────────────────────────────────
//  SHIPPED SHIPMENT
// ─────────────────────────────────────────────

/** GET /api/shipped-shipment/  — list all shipped records */
export const getShippedShipments = async (): Promise<ShipmentShipped[]> => {
  const res = await http.get<ShipmentShipped[]>(`/shipped-shipment/`);
  return res.data;
};

// ─────────────────────────────────────────────
//  MOVE TO RECEIVED  (Shipped → Received)
// ─────────────────────────────────────────────

/** POST /api/move-to-received/  — mark a shipped record as received */
export const moveToReceived = async (
  payload: MoveToReceivedPayload
): Promise<ShipmentReceived> => {
  const res = await http.post<ShipmentReceived>(
    `/move-to-received/`,
    payload
  );
  return res.data;
};

// ─────────────────────────────────────────────
//  RECEIVED SHIPMENT
// ─────────────────────────────────────────────

/** GET /api/received-shipment/  — list all received records */
export const getReceivedShipments = async (): Promise<ShipmentReceived[]> => {
  const res = await http.get<ShipmentReceived[]>(
    `/received-shipment/`
  );
  return res.data;
};

// ─────────────────────────────────────────────
//  ACTIVITY LOGS
// ─────────────────────────────────────────────

/** GET /api/activity-logs/  — list all activity log entries */
export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  const res = await http.get<ActivityLog[]>(`/activity-logs/`);
  return res.data;
};

// ─────────────────────────────────────────────
//  PATIENTS  (for search / reference)
// ─────────────────────────────────────────────

/** GET /api/patients/  — list patients */
export const getPatients = async (): Promise<Patient[]> => {
  const res = await http.get<Patient[]>(`/patients/`);
  return res.data;
};