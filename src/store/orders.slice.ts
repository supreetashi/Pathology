import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WritableDraft } from "immer";
import type { RootState } from ".";
import { ordersApi } from "../services/orders.api";
import type {
  PathologyOrder, OrderRow,
  BillStatus, OrderType, PatientType,
} from "../types/orders.types";

// ── State ─────────────────────────────────────────────────────────────────────

type S = {
  orders: OrderRow[];
  selectedOrder: OrderRow | null;
  loading: boolean;
  error: string | null;
  meta: { total_count: number; next: string | null; offset: number; limit: number } | null;
};

type DS = WritableDraft<S>;

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (iso?: string | null): string =>
  iso ? new Date(iso).toLocaleDateString("en-GB") : "-";

const fmtTime = (iso?: string | null): string =>
  iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "-";

const mapStatus = (s: string): "Pending" | "Partial" | "Complete" => {
  const lower = s?.toLowerCase();
  if (lower === "paid")    return "Complete";
  if (lower === "partial") return "Partial";
  return "Pending";
};

// Maps client API response fields (name, gender, patient_type, etc.)
const mapOrder = (d: PathologyOrder): OrderRow => ({
  id:          String(d.id),
  orderId:     d.id,
  date:        fmtDate(d.visit_date),
  time:        fmtTime(d.invoice_datetime ?? d.visit_date),
  patientName: d.patient.name,
  patientAge:  d.patient.age,
  mrn:         d.patient.mrn,
  gender:      d.patient.gender,
  patientType: (d.patient.patient_type?.toLowerCase() === "registered"
    ? "Registered" : "Walk-In") as PatientType,
  doctorName:  `${d.patient.doctor_first_name} ${d.patient.doctor_last_name}`.trim() || "-",
  billNo:      d.bill_number,
  netAmt:      parseFloat(d.net_amount) || 0,
  billStatus:  (d.status?.toLowerCase() === "paid" ? "Paid" : "Unpaid") as BillStatus,
  totalTests:  d.total_tests,
  orderStatus: mapStatus(d.status),
  type:        "inhouse" as OrderType,
});

// ── Thunk ─────────────────────────────────────────────────────────────────────

export const fetchOrders = createAsyncThunk<
  { rows: OrderRow[]; meta: { total_count: number; next: string | null; offset: number; limit: number } },
  { limit?: number; offset?: number } | void
>(
  "orders/fetchOrders",
  async (params) => {
    const limit  = (params as any)?.limit  ?? 10;
    const offset = (params as any)?.offset ?? 0;
    const res = await ordersApi.getAll({ limit, offset });
    return {
      rows: res.data.objects.map(mapOrder),
      meta: res.data.meta,
    };
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const ordersSlice = createSlice({
  name: "orders",
  initialState: (): S => ({
    orders:        [],
    selectedOrder: null,
    loading:       false,
    error:         null,
    meta:          null,
  }),
  reducers: {
    setSelectedOrder(state: DS, action: PayloadAction<OrderRow>) {
      state.selectedOrder = action.payload;
    },
    clearSelectedOrder(state: DS) {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending,   (state: DS) => { state.loading = true;  state.error = null; })
      .addCase(fetchOrders.fulfilled, (state: DS, { payload }: PayloadAction<{ rows: OrderRow[]; meta: any }>) => { state.loading = false; state.orders = payload.rows; state.meta = payload.meta; })
      .addCase(fetchOrders.rejected,  (state: DS) => { state.loading = false; state.error = "Failed to load orders"; });
  },
});

export const { setSelectedOrder, clearSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectOrders        = (state: RootState) => state.orders.orders;
export const selectOrdersMeta     = (state: RootState) => state.orders.meta;
export const selectSelectedOrder = (state: RootState) => state.orders.selectedOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError   = (state: RootState) => state.orders.error;