export interface Clinic {
  id: number;
  name: string;
  clinic_name: string;
  department: Department[];
}

export interface Department {
  id: number;
  name: string;
  is_active: boolean;
  clinic_id: number;
  created_at: string;
}

export interface ClinicListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Clinic[];
}