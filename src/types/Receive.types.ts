// =====================================================
// UI Models
// =====================================================

export interface ReceiveSampleItem {
  id: number;
  shipmentReceived: number | null;
  shipDate: string;
  shipTime: string;
  shipmentNo: string;
  specimenNo: string;
  specimenType: string;
  testCode: string;
  testName: string;
  serviceName: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientCode: string;
  receiveDate: string | null;
  receiveTime: string | null;
  acceptedBy: string | null;
  remark: string | null;
  subOptimal: boolean;
  status: "Shipped" | "Received" | "Rejected";
  isDeleted: boolean;
  createdAt: string;
  deletedAt: string | null;
}

// =====================================================
// Redux State
// =====================================================

export interface ReceiveState {
  samples: ReceiveSampleItem[];
  activityLogs: ReceiveSampleItem[];
  loading: boolean;
  activityLoading: boolean;
  error: string | null;
}

// =====================================================
// API Request Payloads
// =====================================================

export interface CreateReceiveSamplePayload {
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
  shipment_received?: number | null;
  status?: string;
}

export interface ReceiveSamplePayload {
  receive_date: string;
  receive_time: string;
  accepted_by: string;
  remark?: string;
  sub_optimal?: boolean;
  shipment_received?: number | null;
}

export interface RejectSamplePayload {
  receive_date: string;
  receive_time: string;
  rejected_by: string;
  remark?: string;
  resend_new_sample?: boolean;
}