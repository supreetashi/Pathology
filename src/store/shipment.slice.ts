import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";
import type { RootState } from ".";
import {
  getPendingShipments, getShippedShipments,
  getReceivedShipments, getActivityLogs, scheduleShipping,
} from "../services/shipment.api";
import type {
  PendingShipment, ShipmentShipped, ShipmentReceived, ActivityLog,
  PendingRow, ShippedRow, ReceivedRow, ActivityLogRow, ScheduleShippingPayload,
} from "../types/shipment.types";

// ── State ─────────────────────────────────────────────────────────────────────

type S = {
  pending:      PendingRow[];
  shipped:      ShippedRow[];
  received:     ReceivedRow[];
  activityLogs: ActivityLogRow[];
  loading:      boolean;
  error:        string | null;
};

type DS = WritableDraft<S>;

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso?: string | null): string =>
  iso ? new Date(iso).toLocaleDateString("en-GB") : "-";

const fmtTime = (iso?: string | null): string =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "-";

const mapPending = (d: PendingShipment): PendingRow => ({
  id: d.id,
  date: fmtDate(d.order_date),   time: fmtTime(d.order_date),
  sampleNo: d.sample_no ?? "-",  type: d.sample_type,
  testCode: d.test_code,         testName: d.test_name,
  serviceName: d.service_name,
  patientName: d.patient?.name ?? "-",
  age:         d.patient?.age ?? "-",
  patientCode: d.patient?.patient_code ?? "-",
  gender:      d.patient?.gender ?? "-",
});

const mapShipped = (d: ShipmentShipped): ShippedRow => ({
  id: d.id,
  shipDate: fmtDate(d.ship_date), time: fmtTime(d.ship_date),
  shipmentNo: d.shipment_no,      shipTo: d.ship_to,
  sampleNo:    d.pending_shipment?.sample_no ?? "-",
  type:        d.pending_shipment?.sample_type ?? "-",
  testCode:    d.pending_shipment?.test_code ?? "-",
  testName:    d.pending_shipment?.test_name ?? "-",
  serviceName: d.pending_shipment?.service_name ?? "-",
  patientName: d.pending_shipment?.patient?.name ?? "-",
  age:         d.pending_shipment?.patient?.age ?? "-",
  patientCode: d.pending_shipment?.patient?.patient_code ?? "-",
  gender:      d.pending_shipment?.patient?.gender ?? "-",
});

const mapReceived = (d: ShipmentReceived): ReceivedRow => ({
  id: d.id,
  date: fmtDate(d.receive_date), time: fmtTime(d.receive_date),
  receivedNo: d.received_no,     status: d.status,
  sampleNo:    d.shipped_shipment?.pending_shipment?.sample_no ?? "-",
  type:        d.shipped_shipment?.pending_shipment?.sample_type ?? "-",
  testCode:    d.shipped_shipment?.pending_shipment?.test_code ?? "-",
  testName:    d.shipped_shipment?.pending_shipment?.test_name ?? "-",
  serviceName: d.shipped_shipment?.pending_shipment?.service_name ?? "-",
  patientName: d.shipped_shipment?.pending_shipment?.patient?.name ?? "-",
  age:         d.shipped_shipment?.pending_shipment?.patient?.age ?? "-",
  patientCode: d.shipped_shipment?.pending_shipment?.patient?.patient_code ?? "-",
  gender:      d.shipped_shipment?.pending_shipment?.patient?.gender ?? "-",
  shipTo:      d.shipped_shipment?.ship_to ?? "-",
});

const mapActivityLog = (d: ActivityLog): ActivityLogRow => ({
  id: d.id,
  date: fmtDate(d.ship_date_time), time: fmtTime(d.ship_date_time),
  shipNo: d.shipped_shipment?.shipment_no ?? "-",
  shipFrom: d.ship_from, shipTo: d.ship_to, shipBy: d.ship_by,
});

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchPendingShipments = createAsyncThunk<PendingRow[], void>(
  "shipment/fetchPending",
  async () => (await getPendingShipments() as PendingShipment[]).map(mapPending)
);

export const fetchShippedShipments = createAsyncThunk<ShippedRow[], void>(
  "shipment/fetchShipped",
  async () => (await getShippedShipments() as ShipmentShipped[]).map(mapShipped)
);

export const fetchReceivedShipments = createAsyncThunk<ReceivedRow[], void>(
  "shipment/fetchReceived",
  async () => (await getReceivedShipments() as ShipmentReceived[]).map(mapReceived)
);

export const fetchActivityLogs = createAsyncThunk<ActivityLogRow[], void>(
  "shipment/fetchActivityLogs",
  async () => (await getActivityLogs() as ActivityLog[]).map(mapActivityLog)
);

export const scheduleShippingThunk = createAsyncThunk<void, ScheduleShippingPayload>(
  "shipment/scheduleShipping",
  async (payload) => { await scheduleShipping(payload); }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const shipmentSlice = createSlice({
  name: "shipment",
  initialState: (): S => ({
    pending:      [],
    shipped:      [],
    received:     [],
    activityLogs: [],
    loading:      false,
    error:        null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingShipments.pending,    (state: DS) => { state.loading = true;  state.error = null; })
      .addCase(fetchPendingShipments.fulfilled,  (state: DS, { payload }: PayloadAction<PendingRow[]>)   => { state.loading = false; state.pending = payload; })
      .addCase(fetchPendingShipments.rejected,   (state: DS) => { state.loading = false; state.error = "Failed to load pending shipments"; })

      .addCase(fetchShippedShipments.pending,    (state: DS) => { state.loading = true;  state.error = null; })
      .addCase(fetchShippedShipments.fulfilled,  (state: DS, { payload }: PayloadAction<ShippedRow[]>)   => { state.loading = false; state.shipped = payload; })
      .addCase(fetchShippedShipments.rejected,   (state: DS) => { state.loading = false; state.error = "Failed to load shipped shipments"; })

      .addCase(fetchReceivedShipments.pending,   (state: DS) => { state.loading = true;  state.error = null; })
      .addCase(fetchReceivedShipments.fulfilled, (state: DS, { payload }: PayloadAction<ReceivedRow[]>)  => { state.loading = false; state.received = payload; })
      .addCase(fetchReceivedShipments.rejected,  (state: DS) => { state.loading = false; state.error = "Failed to load received shipments"; })

      .addCase(fetchActivityLogs.pending,    (state: DS) => { state.loading = true;  state.error = null; })
      .addCase(fetchActivityLogs.fulfilled,  (state: DS, { payload }: PayloadAction<ActivityLogRow[]>)  => { state.loading = false; state.activityLogs = payload; })
      .addCase(fetchActivityLogs.rejected,   (state: DS) => { state.loading = false; state.error = "Failed to load activity logs"; })

      .addCase(scheduleShippingThunk.pending,   (state: DS) => { state.loading = true;  state.error = null; })
      .addCase(scheduleShippingThunk.fulfilled, (state: DS) => { state.loading = false; })
      .addCase(scheduleShippingThunk.rejected,  (state: DS) => { state.loading = false; state.error = "Failed to schedule shipping"; });
  },
});

export default shipmentSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectPendingShipments  = (state: RootState) => state.shipment.pending;
export const selectShippedShipments  = (state: RootState) => state.shipment.shipped;
export const selectReceivedShipments = (state: RootState) => state.shipment.received;
export const selectActivityLogs      = (state: RootState) => state.shipment.activityLogs;
export const selectShipmentLoading   = (state: RootState) => state.shipment.loading;
export const selectShipmentError     = (state: RootState) => state.shipment.error;