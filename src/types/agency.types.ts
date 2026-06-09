export interface AgencyServiceItem {
  id: number;
  agency_name: string;
  profile_name: string;
  service_name: string;
  rate: string;
  status: boolean;
  agency: string;
}

export interface Agency {
  id: string;
  agency_code: string;
  agency_name: string;
  country: string | null;
  state: string | null;
  city: string | null;
  pincode: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  contact_person_1_name: string | null;
  contact_person_1_mobile: string | null;
  contact_person_1_email: string | null;
  contact_person_2_name: string | null;
  contact_person_2_mobile: string | null;
  contact_person_2_email: string | null;
  phone_no: string | null;
  fax_no: string | null;
  specialization_details: string | null;
  status: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  agency_services: AgencyServiceItem[];
}

export interface CreateAgencyPayload {
  agency_code: string;
  agency_name: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  address_line_1?: string;
  address_line_2?: string;
  address_line_3?: string;
  contact_person_1_name?: string;
  contact_person_1_mobile?: string;
  contact_person_1_email?: string;
  contact_person_2_name?: string;
  contact_person_2_mobile?: string;
  contact_person_2_email?: string;
  phone_no?: string;
  fax_no?: string;
  specialization_details?: string;
  status?: boolean;
  agency_services?: {
    service_name: string;
    rate: string;
    status?: boolean;
  }[];
}

export interface PaginatedAgencyResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Agency[];
}