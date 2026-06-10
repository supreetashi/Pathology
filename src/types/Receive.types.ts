export interface CreateReceiveSamplePayload {
  shipment_no?: string;
  specimen_no?: string;
  specimen_type?: string;
  test_code?: string;
  test_name?: string;
  service_name?: string;
  patient_name?: string;
  patient_age?: string | number;
  patient_code?: string;
  patient_gender?: string;
  ship_date?: string;
  ship_time?: string;
  status?: string;
  [key: string]: unknown;
}

export type ReceiveSamplePayload = {
  receive_date?: string;
  receive_time?: string;
  remark?: string;
  sub_optimal?: boolean;
  accepted_by?: string;
  shipment_received?: number;
};

export type RejectSamplePayload = {
  receive_date?: string;
  receive_time?: string;
  remark?: string;
  resend_new_sample?: boolean;
  rejected_by?: string;
};

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

export interface ReceiveState {
  samples: ReceiveSampleItem[];
  activityLogs: ReceiveSampleItem[];
  loading: boolean;
  activityLoading: boolean;
  error: string | null;
}
