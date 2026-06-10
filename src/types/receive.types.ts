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

export interface ReceiveSamplePayload {
  received_at?: string;
  received_time?: string;
  accepted_by?: string;
  remark?: string;
  is_sub_optimal?: boolean;
  [key: string]: unknown;
}

export interface RejectSamplePayload {
  rejected_at?: string;
  rejected_time?: string;
  rejected_by?: string;
  remark?: string;
  resend_for_new_sample?: boolean;
  [key: string]: unknown;
}
