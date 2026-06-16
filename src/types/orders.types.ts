// ─────────────────────────────────────────────────────────────────────────────
// orders.types.ts
// Based on client API: GET /pathology-orders/
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiMeta {
  limit: number;
  offset: number;
  total_count: number;
  next: string | null;
  previous: string | null;
}

export interface OrderPatient {
  id: number;
  name: string;
  mrn: string;
  age: number;
  gender: string;
  patient_type: string;
  cycle_number: string;
  doctor_first_name: string;
  doctor_last_name: string;
}

export interface InvoiceItem {
  id: number;
  billing_source_type: string;
  billing_source_id: number;
  billing_source_code: string;
  billing_source_name: string;
  date: string;
  charges: string;
  discount_amount: string;
  tax_amount: string;
  net_amount: string;
  provider_id: number;
  is_from_package: boolean;
  package_id: number | null;
  package_name: string | null;
  is_refunded: boolean;
  prescribe_from_doctor: boolean;
  test_service_id: number;
  test_service_code: number;
  test_service_name: string;
  code_type: string | null;
  sac_code: string | null;
  base_rate: string;
  test_gender: string;
  test_unit: string;
  test_is_active: boolean;
}

export interface PathologyOrder {
  id: number;
  bill_number: string;
  bill_type: string;
  status: string;
  visit_id: number;
  visit_date: string;
  invoice_datetime: string | null;
  total_amount: string;
  discount_amount: string;
  tax_amount: string;
  net_amount: string;
  paid_amount: string;
  balance_amount: string;
  total_tests: number;
  patient: OrderPatient;
  invoice_items: InvoiceItem[];
}

export interface PathologyOrderListResponse {
  meta: ApiMeta;
  objects: PathologyOrder[];
}

export type OrderStatus = "Pending" | "Partial" | "Complete";
export type BillStatus  = "Paid" | "Unpaid";
export type OrderType   = "inhouse" | "outsource";
export type PatientType = "Walk-In" | "Registered";

export interface OrderRow {
  id: string;
  visitDate: string | null;
  orderId: number;          // ← Vidai work_order id for detail API
  date: string;
  time: string;
  patientName: string;
  patientAge: number;
  mrn: string;
  gender: string;
  patientType: PatientType;
  cycleNumber: string;      // ← added
  doctorName: string;
  billNo: string;
  netAmt: number;
  billStatus: BillStatus;
  totalTests: number;
  orderStatus: OrderStatus;
  type: OrderType;
}

export type TestStatus =
  | "Pending"
  | "Recollection Pending"
  | "Collected"
  | "Shipped"
  | "Accepted"
  | "Completed"
  | "Rejected";

export interface BaseTest {
  id: number;
  date: string;
  time: string;
  code: string;
  name: string;
  service: string;
  specimenNo: string;
  type: string;
  collectorItem: string;
  status: TestStatus;
  checked: boolean;
  testServiceId?: number;   // ← for collection API
  source: "inhouse" | "outsource";
}

export interface InhouseTest extends BaseTest {
  source: "inhouse";
}

export interface OutsourceTest extends BaseTest {
  source: "outsource";
  agency: string;
}

export type TestRow = InhouseTest | OutsourceTest;

export interface OrderFilters {
  fromDate: string;
  toDate: string;
  doctor: string;
  orderStatus: string;
  patientType: string;
}

export interface OrderQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
}
