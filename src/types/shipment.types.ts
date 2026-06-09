// ─────────────────────────────────────────────────────────────────────────────
// shipment.types.ts
// Mirrors Django models: PendingShipment, ShipmentShipped, ShipmentReceived,
// ActivityLogs, ScheduleShipping — and the UI row shapes used in the tab
// components (PendingTab, ShippedTab, ReceivedTab, ActivityLogsTab).
// ─────────────────────────────────────────────────────────────────────────────

import type { PaginatedResponse } from "./clinic.types"; // reuse shared paginator

// ── Re-export so consumers can import from one place ─────────────────────────
export type { PaginatedResponse };

// ─────────────────────────────────────────────────────────────────────────────
// 1.  Patient  (nested inside PendingShipment API responses)
// ─────────────────────────────────────────────────────────────────────────────
export interface ShipmentPatient {
  id: number;
  name: string;
  age: number;
  gender: string;
  patient_code: string;
  patient_type: "walkin" | "registered";
}

// ─────────────────────────────────────────────────────────────────────────────
// 2.  PendingShipment  (model: shipment_pending.py)
// ─────────────────────────────────────────────────────────────────────────────
export interface PendingShipment {
  id: number;
  order_date: string; // ISO datetime
  sample_no: string | null;
  sample_type: "Blood" | "Urine";
  test_code: string;
  test_name: string;
  service_name: string;
  patient: ShipmentPatient | null;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3.  ScheduleShipping  (model: shipment_schedule_shipping.py)
// ─────────────────────────────────────────────────────────────────────────────
export interface ScheduleShipping {
  id: number;
  pending: PendingShipment;
  ship_date: string; // date string "YYYY-MM-DD"
  ship_time: string; // time string "HH:MM"
  dispatched_by: string;
  ship_to: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4.  ShipmentShipped  (model: shipment_shipped.py)
// ─────────────────────────────────────────────────────────────────────────────
export interface ShipmentShipped {
  id: number;
  ship_date: string; // ISO datetime
  shipment_no: string;
  pending_shipment: PendingShipment | null;
  ship_to: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5.  ShipmentReceived  (model: shipment_received.py)
// ─────────────────────────────────────────────────────────────────────────────
export interface ShipmentReceived {
  id: number;
  receive_date: string; // ISO datetime
  received_no: string;
  shipped_shipment: ShipmentShipped | null;
  status: "Accepted" | "Rejected";
  result: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6.  ActivityLog  (model: shipment_activitylogs.py)
// ─────────────────────────────────────────────────────────────────────────────
export interface ActivityLog {
  id: number;
  shipped_shipment: ShipmentShipped | null;
  ship_date_time: string; // ISO datetime
  ship_from: string;
  ship_to: string;
  ship_by: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7.  UI row shapes — flattened/formatted versions used by tab components
//     These are what gets stored in Redux after mapping from API responses.
// ─────────────────────────────────────────────────────────────────────────────

/** Used by PendingTab */
export interface PendingRow {
  id: number;
  date: string;       // formatted "DD/MM/YYYY"
  time: string;       // formatted "HH:MM AM/PM"
  sampleNo: string;
  type: string;       // sample_type
  testCode: string;
  testName: string;
  serviceName: string;
  patientName: string;
  age: number | string;
  patientCode: string;
  gender: string;
}

/** Used by ShippedTab */
export interface ShippedRow {
  id: number;
  shipDate: string;   // formatted "DD/MM/YYYY"
  time: string;
  shipmentNo: string;
  sampleNo: string;
  type: string;
  testCode: string;
  testName: string;
  serviceName: string;
  patientName: string;
  age: number | string;
  patientCode: string;
  gender: string;
  shipTo: string;
}

/** Used by ReceivedTab */
export interface ReceivedRow {
  id: number;
  date: string;
  time: string;
  receivedNo: string;
  sampleNo: string;
  type: string;
  testCode: string;
  testName: string;
  serviceName: string;
  patientName: string;
  age: number | string;
  patientCode: string;
  gender: string;
  shipTo: string;
  status: "Accepted" | "Rejected";
}

/** Used by ActivityLogsTab */
export interface ActivityLogRow {
  id: number;
  date: string;
  time: string;
  shipNo: string;
  shipFrom: string;
  shipTo: string;
  shipBy: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8.  Schedule shipping request payload  (sent to API)
// ─────────────────────────────────────────────────────────────────────────────
export interface ScheduleShippingPayload {
  ship_date: string;              // ISO datetime "YYYY-MM-DDTHH:MM:00"
  ship_to: string;
  pending_shipment_ids: number[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 9.  Filter shape (mirrors ShipmentView local state)
//     Added: shippedDateMode, receivedDateMode for per-tab date radio buttons
// ─────────────────────────────────────────────────────────────────────────────
export interface ShipmentFilters {
  fromDate: string;
  toDate: string;
  shipTo: string;
  specimenType: string;
  testName: string;
  service: string;
  shipFrom: string;
  shipBy: string;
  shipmentNo: string;
  shippedDateMode: string;   // "ship" | "order"
  receivedDateMode: string;  // "ship" | "receive" | "order"
}

export const emptyFilters: ShipmentFilters = {
  fromDate: "",
  toDate: "",
  shipTo: "",
  specimenType: "",
  testName: "",
  service: "",
  shipFrom: "",
  shipBy: "",
  shipmentNo: "",
  shippedDateMode: "ship",
  receivedDateMode: "ship",
};

// ─────────────────────────────────────────────────────────────────────────────
// 10.  Filter modal props  (shared by all 4 filter modals in ShipmentFilters.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export interface FilterModalProps {
  filters: ShipmentFilters;
  setFilters: (f: ShipmentFilters) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}